---
title: "🔄 Migrer d'Ollama vers vLLM"
description: Quand et comment passer d'Ollama à vLLM sans casser les clients existants — compatibilité API, conversion de modèles, stratégie de bascule et plan de rollback.
sidebar:
  order: 7
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] En bref
> La migration d'Ollama vers vLLM ne nécessite généralement pas de modifier les clients — les deux exposent une API compatible OpenAI. Le vrai effort est la conversion des modèles GGUF en formats natifs HuggingFace et la re-qualification des performances.

---

## Quand migrer ?

Ollama reste le meilleur choix pour le développement solo et les petites équipes. La migration vers vLLM se justifie quand :

| Signal | Seuil indicatif |
| :-- | :-- |
| Utilisateurs simultanés | plusieurs requêtes concurrentes sur le même modèle (Ollama n'en traite qu'une à la fois par défaut, `OLLAMA_NUM_PARALLEL=1`)[^7] |
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
client = OpenAI(base_url="http://localhost:8000/v1", api_key="VOTRE-TOKEN-A-REMPLACER")

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
| Authentification | Aucune (clé ignorée) | `--api-key` (ne couvre que `/v1`, `/v2` et `/inference` ; reverse proxy pour le reste)[^8] |
| Format modèle | GGUF (natif) | HuggingFace safetensors, AWQ, GPTQ |
| Endpoint pull modèle | `POST /api/pull` | Non supporté (pré-chargement) |
| Endpoint generate (legacy) | `POST /api/generate` | Non supporté (utiliser `/v1/`) |
| Stream | Supporté (format de fil OpenAI depuis 0.32.6)[^15] | Supporté |
| Embeddings | `POST /api/embed` (natif, champ `input`)[^14] ou `POST /v1/embeddings` | `POST /v1/embeddings` |
| API Responses | `POST /v1/responses` (depuis 0.13.3, variante sans état) | `POST /v1/responses` |

Si vos clients ont été écrits avant août 2026 contre le streaming d'Ollama, revalidez-les en phase 2 : la 0.32.6 (4 août 2026) a aligné le format des chunks sur OpenAI (`role` sur le premier chunk seulement, `finish_reason` sur son propre chunk, usage via `stream_options.include_usage`) et les réponses tronquées renvoient désormais `finish_reason: "length"`[^15].

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

vLLM peut charger un GGUF (plugin `vllm-gguf-plugin`, ex. `vllm serve unsloth/Qwen3-0.6B-GGUF:Q4_K_M --tokenizer Qwen/Qwen3-0.6B`), mais ce support est qualifié de « hautement expérimental et peu optimisé » par le projet au T4 2026 : il convient pour valider un modèle, pas pour la production[^5]. Trois options, par ordre de préférence :

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

Ces équivalences restent valables, mais ces modèles appartiennent à la génération qu'Ollama ≥ 0.32 (juillet 2026) signale comme « anciens » au `ollama launch` (CodeLlama, Qwen2.5, Llama 3.x, Mistral, DeepSeek-R1 de base) ; la bibliothèque courante au T4 2026 est `qwen3.5` / `qwen3.6`, `gemma4`, `qwen3-coder`, dont les poids Hugging Face se trouvent de la même manière[^9].

```bash
# Télécharger via Hugging Face CLI (commande `hf`, qui remplace `huggingface-cli`)
pip install huggingface_hub
hf auth login  # token HF requis pour les modèles protégés (Llama)

hf download meta-llama/Llama-3.1-8B-Instruct \
  --local-dir /data/models/llama3.1-8b
```

Visez exclusivement des dépôts en **safetensors** : n'acceptez jamais de poids `.bin` / pickle, même « scannés » — des chargements pickle malveillants échappent aux scanners de modèles (ShadowPickle, juillet 2026)[^11]. La commande `hf` est la forme documentée du CLI Hugging Face au T4 2026[^10].

### Option B — Utiliser une version AWQ pré-quantifiée

Pour les modèles lourds (70B+), les versions AWQ sont plus légères et gérées nativement par vLLM[^3] :

```bash
# AWQ 4-bit — qualité proche du BF16 avec ~25% de la VRAM
vllm serve hugging-quants/Meta-Llama-3.1-70B-Instruct-AWQ-INT4 \
  --quantization awq_marlin \
  --dtype half
```

### Option C — Convertir un GGUF vers safetensors (avancé)

Si vous avez un modèle GGUF custom (fine-tuné, merged), la conversion est possible via le chargeur GGUF de Transformers (`llama.cpp` ne fait que le sens inverse, HF → GGUF, avec `convert_hf_to_gguf.py`)[^6] :

```bash
pip install transformers gguf

# Convertir GGUF → safetensors avec Transformers (déquantifie vers bf16)
python - <<'PY'
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, GgufConfig
repo, f = "/path/to/model-dir", "model.gguf"
m = AutoModelForCausalLM.from_pretrained(
    repo, gguf_file=f,
    quantization_config=GgufConfig(dequantize=True),
    dtype=torch.bfloat16,
)
t = AutoTokenizer.from_pretrained(repo, gguf_file=f)
m.save_pretrained("/path/to/output"); t.save_pretrained("/path/to/output")
PY
```

Le chargeur déquantifie Llama, Mistral, Qwen2, Phi3, etc. ; vérifiez la liste des architectures prises en charge dans la documentation Transformers[^6].

> [!warning] Perte de quantification
> La conversion GGUF → safetensors dequantifie le modèle (retour à bf16). Pour re-quantifier en AWQ, utilisez [llm-compressor](https://github.com/vllm-project/llm-compressor) — le projet vLLM a repris AutoAWQ, archivé en mai 2025[^3]. Ce processus demande de la VRAM et du temps (plusieurs heures sur un 70B).

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

Comparez les résultats sur vos prompts réels[^4] ; `vllm bench serve --model … --dataset-name sharegpt` mesure en complément le débit et le TTFT sous charge.

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

> [!note] Ollama ≥ 0.40
> Si vous avez mis Ollama à jour pendant la migration, ses modèles ont pu être réécrits au nouveau format au premier lancement (Ollama 0.40.2, octobre 2026 ; sauvegardes conservées sur disque) ; un retour à une version < 0.40 oblige à re-tirer les modèles[^12]. Épinglez la version d'Ollama pendant la fenêtre de bascule.

---

## Checklist de migration

```
□ vLLM ≥ 0.31.0 installé, trust_remote_code désactivé
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

La version minimale n'est pas un détail : entre août et octobre 2026, vLLM a corrigé plusieurs exécutions de code à distance et dénis de service (dont GHSA-h3rc-6mm3-gc2m, fermée en 0.31.0)[^13] ; le durcissement complet est décrit dans [[06-mise-en-oeuvre/configure-vllm-multi-gpu|Configurer vLLM multi-GPU]] et [[06-mise-en-oeuvre/local-inference-security|Sécurité de l'inférence locale]].

---

## Voir aussi

- [[06-mise-en-oeuvre/getting-started-with-ollama|🚀 Démarrer avec Ollama]] — si vous revenez en arrière ou testez en parallèle
- [[06-mise-en-oeuvre/configure-vllm-multi-gpu|⚙️ Configurer vLLM multi-GPU]] — configuration complète du nouveau backend
- [[06-mise-en-oeuvre/monitoring-inference-stack|📊 Monitoring Prometheus + Grafana]] — indispensable avant la bascule en production
- [[06-mise-en-oeuvre/local-inference-security|🔒 Sécurité de l'inférence locale]] — authentification et reverse proxy

---

## Sources et Références

[^1]: vLLM Project, *vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention* (batching continu, gestion dynamique du KV Cache), 20 juin 2023, vérifié le 2026-10-10. [https://vllm.ai/blog/2023-06-20-vllm](https://vllm.ai/blog/2023-06-20-vllm)
[^2]: vLLM Project, *Online Serving — OpenAI-Compatible Server* (endpoints supportés `/v1/chat/completions`, `/v1/completions`, `/v1/embeddings`, `/v1/responses`), consulté le 2026-10-10 · Ollama, *OpenAI compatibility* (`/v1/responses` depuis 0.13.3, clé API « required but ignored »), consulté le 2026-10-10. [https://docs.vllm.ai/en/stable/serving/online_serving/](https://docs.vllm.ai/en/stable/serving/online_serving/) · [https://docs.ollama.com/api/openai-compatibility](https://docs.ollama.com/api/openai-compatibility)
[^3]: vLLM Project, *Quantization — AWQ* (« The AutoAWQ library is deprecated », workflow repris par `llm-compressor`, kernels Marlin), consulté le 2026-10-10 · casper-hansen, *AutoAWQ* (dépôt archivé le 2025-05-11, « officially deprecated »). [https://docs.vllm.ai/en/stable/features/quantization/auto_awq/](https://docs.vllm.ai/en/stable/features/quantization/auto_awq/) · [https://github.com/casper-hansen/AutoAWQ](https://github.com/casper-hansen/AutoAWQ)
[^4]: vLLM Project, *Benchmarking* (`vllm bench serve`, `latency`, `throughput`), consulté le 2026-10-10. [https://docs.vllm.ai/en/stable/benchmarking/](https://docs.vllm.ai/en/stable/benchmarking/)
[^5]: vLLM Project, *Quantization — GGUF* (plugin `vllm-gguf-plugin`, support « highly experimental and under-optimized », tokenizer du modèle de base recommandé), consulté le 2026-10-09. [https://docs.vllm.ai/en/stable/features/quantization/gguf/](https://docs.vllm.ai/en/stable/features/quantization/gguf/)
[^6]: Hugging Face, *Transformers — GGUF* (`from_pretrained(gguf_file=…)`, `GgufConfig(dequantize=True)`, architectures prises en charge, export via `save_pretrained`), consulté le 2026-10-09. [https://huggingface.co/docs/transformers/gguf](https://huggingface.co/docs/transformers/gguf)
[^7]: Ollama, *FAQ — How does Ollama handle concurrent requests?* (`OLLAMA_NUM_PARALLEL` par défaut à 1, file d'attente), consultée le 2026-10-10. [https://docs.ollama.com/faq](https://docs.ollama.com/faq)
[^8]: vLLM Project, *CLI Reference — `vllm serve`* (`--api-key` : chemins protégés `/v1`, `/v2`, `/inference`), consulté le 2026-10-10 · vLLM Project, advisory GHSA-h3rc-6mm3-gc2m (`/tokenize` non couvert par `--api-key`), 6 octobre 2026. [https://docs.vllm.ai/en/stable/cli/serve/](https://docs.vllm.ai/en/stable/cli/serve/) · [https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m](https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m)
[^9]: Ollama, *Release v0.32.0* (avertissement de dépréciation pour CodeLlama, Qwen2.5(-coder), Llama 3.x, Mistral, StarCoder et DeepSeek-R1 de base), 11 juillet 2026 · Ollama, *Library* (`qwen3.5`, `qwen3.6`, `gemma4`, `qwen3-coder`), consultée le 2026-10-10. [https://github.com/ollama/ollama/releases/tag/v0.32.0](https://github.com/ollama/ollama/releases/tag/v0.32.0) · [https://ollama.com/library](https://ollama.com/library)
[^10]: Hugging Face, *Command Line Interface (CLI)* (`hf auth login`, `hf download … --local-dir`), consulté le 2026-10-10. [https://huggingface.co/docs/huggingface_hub/guides/cli](https://huggingface.co/docs/huggingface_hub/guides/cli)
[^11]: *ShadowPickle: Evading Machine Learning Model Scanners via Stealthy Pickle Deserialization Attacks* (arXiv:2607.17503 ; dix scanners de modèles contournés), juillet 2026. [https://arxiv.org/abs/2607.17503](https://arxiv.org/abs/2607.17503)
[^12]: Ollama, *Release v0.40.2* (modèles « upgraded in the background the first time you run them », sauvegardes conservées, re-pull nécessaire en cas de retour < 0.40), 8 octobre 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.2](https://github.com/ollama/ollama/releases/tag/v0.40.2)
[^13]: vLLM Project, *Release v0.31.0* (`mm_processor_kwargs` par requête refusés sauf `--trust-request-mm-kwargs`, `fp8` → `fp8_per_tensor`), 5 octobre 2026 · advisory GHSA-h3rc-6mm3-gc2m, 6 octobre 2026. [https://github.com/vllm-project/vllm/releases/tag/v0.31.0](https://github.com/vllm-project/vllm/releases/tag/v0.31.0) · [https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m](https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m)
[^14]: Ollama, *API — Generate embeddings* (`POST /api/embed`, champ `input` chaîne ou tableau ; aucun endpoint `/api/embeddings` documenté), consulté le 2026-10-10. [https://docs.ollama.com/api/embed](https://docs.ollama.com/api/embed)
[^15]: Ollama, *Release v0.32.6* (« `/v1/chat/completions` streaming now matches OpenAI's wire format » ; `finish_reason: "length"` pour les réponses tronquées), 4 août 2026. [https://github.com/ollama/ollama/releases/tag/v0.32.6](https://github.com/ollama/ollama/releases/tag/v0.32.6)
