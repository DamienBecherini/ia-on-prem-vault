---
title: "🔄 Migrer d'Ollama vers vLLM"
description: Quand et comment passer d'Ollama à vLLM sans casser les clients existants — compatibilité API, conversion de modèles, stratégie de bascule et plan de rollback.
sidebar:
  order: 7
---

> [!tip] En bref
> La migration d'Ollama vers vLLM ne nécessite généralement pas de modifier les clients — les deux exposent une API compatible OpenAI. Le vrai effort est la conversion des modèles GGUF en formats natifs HuggingFace et la re-qualification des performances.

---

## Quand migrer ?

Ollama reste le meilleur choix pour le développement solo et les petites équipes. La migration vers vLLM se justifie quand :

| Signal | Seuil indicatif |
| :-- | :-- |
| Utilisateurs simultanés | > 5–10 (file d'attente visible) |
| Latence p95 | > 10 s pour un modèle 8B |
| Débit cible | > 50 tok/s agrégés |
| Requêtes concurrentes | > 20/min en pointe |
| SLA défini | TTFT < 2 s garanti |

> [!note] Règle simple
> Si vos utilisateurs se plaignent de temps d'attente et que `ollama ps` montre des requêtes en file, c'est le signal. vLLM gère la concurrence via **Continuous Batching** (PagedAttention)[^1], ce qu'Ollama ne fait pas nativement.

---

## Compatibilité API — ce qui change, ce qui ne change pas

Les deux services exposent une API compatible OpenAI sur `/v1/`. Dans la majorité des cas, **seule l'URL de base change**.

### Ce qui ne change pas

```python
# Avant (Ollama)
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# Après (vLLM)
client = OpenAI(base_url="http://localhost:8000/v1", api_key="sk-votre-token")

# Le code qui suit est identique dans les deux cas
response = client.chat.completions.create(
    model="llama3.1",         # voir section "noms de modèles" ci-dessous
    messages=[{"role": "user", "content": "Bonjour"}],
    temperature=0.7,
    max_tokens=500
)
```

### Ce qui change

| Fonctionnalité | Ollama | vLLM |
| :-- | :-- | :-- |
| Port par défaut | 11434 | 8000 |
| Authentification | Aucune | Token Bearer obligatoire en prod |
| Format modèle | GGUF (natif) | HuggingFace safetensors, AWQ, GPTQ |
| Endpoint pull modèle | `POST /api/pull` | Non supporté (pré-chargement) |
| Endpoint generate (legacy) | `POST /api/generate` | Non supporté (utiliser `/v1/`) |
| Stream | Supporté | Supporté |
| Embeddings | `POST /api/embeddings` | `POST /v1/embeddings` |

> [!warning] Clients qui utilisent `/api/generate` ou `/api/pull`
> Si vos scripts appellent les endpoints natifs Ollama (`/api/generate`, `/api/pull`, `/api/tags`), ils devront être adaptés. Les endpoints `/v1/chat/completions`, `/v1/completions` et `/v1/embeddings` sont compatibles sans changement[^2].

---

## Noms de modèles

Ollama utilise ses propres noms (`llama3.2`, `qwen2.5:14b`). vLLM utilise les identifiants HuggingFace (`meta-llama/Llama-3.2-3B-Instruct`), mais vous pouvez définir un alias avec `--served-model-name` pour conserver la compatibilité :

```bash
# vLLM avec alias compatible Ollama
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --served-model-name llama3.1 \    # ← le client envoie "llama3.1", vLLM comprend
  --port 8000
```

---

## Conversion des modèles GGUF

vLLM ne lit pas nativement les fichiers GGUF. Deux options :

### Option A — Télécharger les poids HuggingFace natifs (recommandé)

La plupart des modèles Ollama ont un équivalent HuggingFace officiel :

| Modèle Ollama | Équivalent HuggingFace |
| :-- | :-- |
| `llama3.2` | `meta-llama/Llama-3.2-3B-Instruct` |
| `llama3.1:70b` | `meta-llama/Llama-3.1-70B-Instruct` |
| `qwen2.5:14b` | `Qwen/Qwen2.5-14B-Instruct` |
| `qwen2.5-coder:32b` | `Qwen/Qwen2.5-Coder-32B-Instruct` |
| `phi4` | `microsoft/phi-4` |
| `deepseek-r1:70b` | `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` |

```bash
# Télécharger via Hugging Face CLI
pip install huggingface_hub
huggingface-cli login  # token HF requis pour les modèles protégés (Llama)

huggingface-cli download meta-llama/Llama-3.1-8B-Instruct \
  --local-dir /data/models/llama3.1-8b
```

### Option B — Utiliser une version AWQ pré-quantifiée

Pour les modèles lourds (70B+), les versions AWQ sont plus légères et gérées nativement par vLLM[^3] :

```bash
# AWQ 4-bit — qualité proche du BF16 avec ~25% de la VRAM
vllm serve hugging-quants/Meta-Llama-3.1-70B-Instruct-AWQ-INT4 \
  --quantization awq_marlin \
  --dtype half
```

### Option C — Convertir un GGUF vers safetensors (avancé)

Si vous avez un modèle GGUF custom (fine-tuné, merged), la conversion est possible via `llama.cpp` :

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
pip install -r requirements.txt

# Convertir GGUF → safetensors (dequantifie vers fp16)
python convert_hf_to_gguf.py --outtype f16 \
  /path/to/model.gguf \
  --outfile /path/to/output/model.safetensors
```

> [!warning] Perte de quantification
> La conversion GGUF → safetensors dequantifie le modèle (retour à fp16). Pour re-quantifier en AWQ, utilisez [AutoAWQ](https://github.com/casper-hansen/AutoAWQ). Ce processus demande de la VRAM et du temps (plusieurs heures sur un 70B).

---

## Stratégie de bascule sans interruption

### Phase 1 — Déploiement parallèle

Lancez vLLM sur un port différent (8001) en parallèle d'Ollama (11434). Ne touchez pas encore aux clients.

```bash
# vLLM sur port 8001 (staging)
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --served-model-name llama3.2 \
  --port 8001
```

### Phase 2 — Qualification

Comparez les résultats sur vos prompts réels[^4] :

```bash
# Script de comparaison A/B
for prompt in "Résume ce contrat" "Rédige un email" "Analyse ce code"; do
  echo "=== Ollama ==="
  curl -s http://localhost:11434/v1/chat/completions \
    -d "{\"model\":\"llama3.2\",\"messages\":[{\"role\":\"user\",\"content\":\"$prompt\"}]}" \
    | python3 -c "import sys,json; r=json.load(sys.stdin); print(r['choices'][0]['message']['content'][:200])"

  echo "=== vLLM ==="
  curl -s http://localhost:8001/v1/chat/completions \
    -H "Authorization: Bearer sk-token" \
    -d "{\"model\":\"llama3.2\",\"messages\":[{\"role\":\"user\",\"content\":\"$prompt\"}]}" \
    | python3 -c "import sys,json; r=json.load(sys.stdin); print(r['choices'][0]['message']['content'][:200])"
done
```

### Phase 3 — Bascule via reverse proxy

Modifiez uniquement la configuration du reverse proxy (Caddy ou Nginx), pas les clients.

**Caddy — bascule du backend :**
```
# Avant
reverse_proxy localhost:11434

# Après (changer uniquement cette ligne)
reverse_proxy localhost:8000
```

Rechargement à chaud de Caddy sans coupure :
```bash
caddy reload --config Caddyfile
```

### Phase 4 — Arrêt d'Ollama

Après 48h sans problème signalé :

```bash
# Arrêter Ollama
sudo systemctl stop ollama
sudo systemctl disable ollama

# Libérer la mémoire des modèles en cache Ollama
# (optionnel, les fichiers GGUF restent sur disque)
```

---

## Plan de rollback

```bash
# 1. Redémarrer Ollama
sudo systemctl start ollama

# 2. Rebrancher le reverse proxy sur Ollama
# Modifier le backend dans Caddyfile/nginx.conf → port 11434
caddy reload --config Caddyfile

# 3. Vérifier
curl http://localhost/v1/models
```

Le rollback complet prend < 2 minutes si Ollama était simplement arrêté (pas désinstallé).

---

## Checklist de migration

```
□ Équivalent HuggingFace identifié pour chaque modèle Ollama utilisé
□ Modèles téléchargés et chargés dans vLLM (test /health OK)
□ --served-model-name configuré pour la compatibilité des noms
□ Authentification Bearer Token configurée et testée côté clients
□ Déploiement parallèle validé (phase 1-2 complètes)
□ Performances comparées sur les prompts métier (débit, TTFT, qualité)
□ Monitoring Prometheus actif avant la bascule
□ Reverse proxy reconfiguré et rechargé sans coupure
□ Période de surveillance 48h post-bascule
□ Procédure de rollback documentée et testée
```

---

## Voir aussi

- [[06-mise-en-oeuvre/getting-started-with-ollama|🚀 Démarrer avec Ollama]] — si vous revenez en arrière ou testez en parallèle
- [[06-mise-en-oeuvre/configure-vllm-multi-gpu|⚙️ Configurer vLLM multi-GPU]] — configuration complète du nouveau backend
- [[06-mise-en-oeuvre/monitoring-inference-stack|📊 Monitoring Prometheus + Grafana]] — indispensable avant la bascule en production
- [[06-mise-en-oeuvre/local-inference-security|🔒 Sécurité de l'inférence locale]] — authentification et reverse proxy

---

## Sources et Références

[^1]: vLLM Project, *PagedAttention — Continuous Batching* (gestion dynamique KV Cache, comparaison avec Ollama en concurrence). [https://vllm.ai/blog/2023/06/20/vllm.html](https://vllm.ai/blog/2023/06/20/vllm.html)
[^2]: vLLM Project, *OpenAI-Compatible Server* (endpoints supportés `/v1/chat/completions`, `/v1/completions`, `/v1/embeddings`, `--served-model-name`). [https://docs.vllm.ai/en/stable/serving/openai_compatible_server.html](https://docs.vllm.ai/en/stable/serving/openai_compatible_server.html)
[^3]: vLLM Project, *Quantization — AWQ* (AWQ Marlin kernel, performances vs GPTQ, modèles HuggingFace compatibles). [https://docs.vllm.ai/en/stable/features/quantization/auto_awq.html](https://docs.vllm.ai/en/stable/features/quantization/auto_awq.html)
[^4]: vLLM Project, *Benchmarks* (scripts de benchmarking comparatif, latence et débit). [https://docs.vllm.ai/en/stable/performance/benchmarks.html](https://docs.vllm.ai/en/stable/performance/benchmarks.html)
