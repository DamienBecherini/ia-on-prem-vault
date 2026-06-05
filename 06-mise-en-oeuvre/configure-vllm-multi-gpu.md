---
title: "⚙️ Configurer vLLM en production multi-GPU"
description: Installation, configuration tensor parallel, déploiement multi-nœuds avec Ray, et bonnes pratiques de production pour vLLM sur GPU NVIDIA.
sidebar:
  order: 5
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] En bref
> vLLM transforme un serveur GPU en API d'inférence haute performance. Ce guide couvre l'installation, la configuration mono et multi-GPU, le déploiement multi-nœuds via Ray, et les paramètres critiques pour la production.

> [!info] Prérequis
> Ce guide suppose des GPU NVIDIA avec CUDA 12.x et Python 3.10+. Pour Apple Silicon ou AMD ROCm, les instructions d'installation diffèrent — voir la [documentation officielle vLLM](https://docs.vllm.ai/en/stable/getting_started/installation.html).

---

## 1. Installation

### Via pip (recommandé)

```bash
# Python 3.10-3.12, CUDA 12.1+
pip install vllm

# Vérification
python -c "import vllm; print(vllm.__version__)"
```

### Via Docker (production recommandée)

L'image officielle évite les conflits de dépendances CUDA[^1] :

```bash
docker pull vllm/vllm-openai:latest

docker run --runtime nvidia --gpus all \
  -p 8000:8000 \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  vllm/vllm-openai:latest \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --dtype auto
```

> [!note] Cache Hugging Face
> Montez le cache HF pour éviter de retélécharger les modèles à chaque redémarrage du container. En production, utilisez un volume Docker dédié plutôt que `~/.cache`.

---

## 2. Configuration mono-GPU

### Démarrage minimal

```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --host 0.0.0.0 \
  --port 8000
```

### Paramètres essentiels

```bash
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --host 0.0.0.0 \
  --port 8000 \
  --dtype bfloat16 \                    # bf16 natif sur Ampere+, plus stable que fp16
  --max-model-len 8192 \               # fenêtre de contexte max (limite le KV Cache)
  --gpu-memory-utilization 0.90 \      # % VRAM alloué au KV Cache (0.85-0.95)
  --max-num-seqs 256 \                 # requêtes concurrentes max en continuous batching
  --served-model-name llama-70b        # alias dans l'API (évite d'exposer le chemin HF)
```

**Paramètre critique — `gpu-memory-utilization` :**
vLLM réserve au démarrage la fraction indiquée de VRAM pour le KV Cache. Si vos prompts sont longs ou si vous avez beaucoup de requêtes concurrentes, montez à 0.95. Si des OOM apparaissent, descendez à 0.85[^2].

> [!warning] Dépassement de `max-model-len` → HTTP 400, pas de troncature silencieuse
> Si un client envoie un prompt + historique qui dépasse `--max-model-len`, vLLM **rejette la requête** avec `HTTP 400 Bad Request: prompt is too long (X tokens > Y max)`. Il ne tronque **pas** le texte automatiquement.
>
> **Solutions :**
> - **LiteLLM gateway** : activer `trim_messages: true` dans `litellm_config.yaml` → LiteLLM supprime les tours d'historique les plus anciens avant d'envoyer au moteur.
> - **Côté client** : compter les tokens avant envoi (`tiktoken` ou `transformers.AutoTokenizer`) et afficher un message métier explicite ("Document trop long — limite : ~6 000 mots").
> - **Prompt engineering** : imposer un `max_tokens` raisonnable dans le system prompt pour éviter que des réponses longues saturent progressivement l'historique.

### Modèles quantifiés (AWQ / GPTQ)

```bash
# Modèle AWQ (meilleure qualité à iso-mémoire vs GGUF Q4)
vllm serve TheBloke/Llama-2-70B-Chat-AWQ \
  --quantization awq \
  --dtype auto

# Modèle GPTQ
vllm serve TheBloke/Llama-2-70B-GPTQ \
  --quantization gptq \
  --dtype float16
```

> [!warning] GGUF non supporté nativement
> vLLM ne lit pas les fichiers GGUF (format Ollama/llama.cpp). Utilisez des poids HuggingFace natifs (safetensors) ou des quantifications AWQ/GPTQ. Pour convertir un modèle, voir [[06-mise-en-oeuvre/migrate-ollama-to-vllm|Migration Ollama → vLLM]].

---

## 3. Configuration multi-GPU (Tensor Parallelism)

Le **Tensor Parallelism** répartit les poids d'une même couche sur plusieurs GPU du même serveur via NVLink ou PCIe. C'est le mode recommandé pour les modèles qui ne tiennent pas dans une seule carte[^3].

```bash
# 2 GPU — modèle 70B dans 2 × 40 Go
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --tensor-parallel-size 2 \
  --dtype bfloat16

# 4 GPU — modèle 70B avec marges confortables
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --tensor-parallel-size 4 \
  --gpu-memory-utilization 0.90

# 8 GPU — modèle 405B ou MoE massif
vllm serve meta-llama/Llama-3.1-405B-Instruct \
  --tensor-parallel-size 8 \
  --pipeline-parallel-size 1 \
  --dtype bfloat16
```

**Règle de dimensionnement :**
- `tensor-parallel-size` doit être une puissance de 2 (1, 2, 4, 8)
- Chaque GPU doit avoir accès à `taille_modèle / tensor_parallel_size` de VRAM
- L'interconnexion décide de l'efficacité : NVLink >> PCIe (voir [[02-materiel/stations-multi-gpu|Stations Multi-GPU]])

```mermaid
graph LR
    A[Requête API] --> B[vLLM Scheduler]
    B --> C[GPU 0 — couches 0-17]
    B --> D[GPU 1 — couches 18-35]
    B --> E[GPU 2 — couches 36-53]
    B --> F[GPU 3 — couches 54-71]
    C & D & E & F --> G[Réponse]
```

---

## 4. Déploiement multi-nœuds avec Ray

Pour dépasser la capacité d'un seul serveur, vLLM s'appuie sur **Ray** pour distribuer le modèle entre plusieurs machines[^4].

### Prérequis réseau

Les nœuds doivent se voir sur un réseau à faible latence. Idéalement RoCE/InfiniBand — en pratique, 25 Gb Ethernet suffit pour du Pipeline Parallelism[^4].

### Configuration du cluster Ray

```bash
# === Sur le nœud HEAD (nœud 0) ===
pip install ray vllm

# Démarrer le processus Ray head
ray start --head --port=6379

# === Sur chaque nœud WORKER (nœuds 1, 2, ...) ===
pip install ray vllm

# Rejoindre le cluster (remplacer HEAD_IP par l'IP du nœud head)
ray start --address='HEAD_IP:6379'

# === Vérifier le cluster ===
ray status
# → affiche les nœuds connectés et les GPU disponibles
```

### Lancer vLLM sur le cluster

```bash
# Sur le nœud HEAD — vLLM utilise Ray pour distribuer automatiquement
vllm serve meta-llama/Llama-3.1-405B-Instruct \
  --tensor-parallel-size 4 \        # 4 GPU par nœud
  --pipeline-parallel-size 2 \      # 2 nœuds
  --host 0.0.0.0 \
  --port 8000
```

vLLM et Ray gèrent automatiquement la répartition : les 4 premiers GPU (nœud 0) traitent les premières couches, les 4 suivants (nœud 1) les suivantes[^4].

### Désagrégation Prefill / Decode (2026)

Architecture avancée disponible depuis vLLM v0.6+ : des nœuds dédiés au **Prefill** (lecture du prompt, CPU-bound) et d'autres au **Decode** (génération, memory-bandwidth-bound)[^5]. Réduit le TTFT de 30 à 50% sur des prompts longs.

```bash
# Nœud Prefill (optimisé calcul)
vllm serve ... --num-speculative-tokens 5 --role prefill

# Nœud Decode (optimisé mémoire)
vllm serve ... --role decode
```

> [!note] Stabilité
> La désagrégation Prefill/Decode est disponible mais encore en évolution active en 2026. À tester en staging avant tout déploiement production.

---

## 5. Configuration production — paramètres avancés

### Authentification API

```bash
vllm serve ... \
  --api-key "sk-votre-token-secret"
```

Ou via variable d'environnement :
```bash
export VLLM_API_KEY="sk-votre-token-secret"
vllm serve ...
```

Les clients doivent envoyer `Authorization: Bearer sk-votre-token-secret`.

### Limites et timeouts

```bash
vllm serve ... \
  --max-num-seqs 512 \              # file d'attente max (au-delà : erreur 503)
  --request-timeout 120 \           # timeout par requête en secondes
  --disable-log-requests            # désactiver les logs de requêtes en production
```

### Optimisation KV Cache — quantification FP8

Sur GPU NVIDIA Hopper (H100, H200), la quantification du KV Cache en FP8 réduit son empreinte de ~50% sans perte de qualité notable[^6] :

```bash
vllm serve ... \
  --kv-cache-dtype fp8 \
  --calculate-kv-cache-size         # affiche la taille KV cache configurée
```

### Automatic Prefix Caching (APC) — indispensable pour RAG et agents

En environnement multi-utilisateurs ou multi-agents, plusieurs requêtes partagent souvent le même **System Prompt** (500-2000 tokens) ou le même document RAG en contexte. Sans APC, vLLM calcule et stocke le KV Cache de ce préfixe **N fois** — une fois par requête — gaspillant VRAM et temps de calcul.

```bash
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --enable-prefix-caching \            # active le hachage de blocs de prompt
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90
```

**Fonctionnement :** vLLM hache chaque bloc de 16 tokens. Si une nouvelle requête commence par la même séquence de blocs qu'une requête précédente encore en cache GPU, les vecteurs Key/Value sont réutilisés directement — sans recalcul du Prefill[^7].

**Impact mesuré :**

| Scénario | Sans APC | Avec APC |
| :-- | :-- | :-- |
| 20 agents parallèles, même system prompt 800 tokens | TTFT 3-8s chacun | TTFT < 100ms dès la 2e requête |
| Pipeline RAG : même contexte document partagé | recalcul intégral × N | hit cache : ~96% VRAM économisée sur le préfixe |

> [!note] Compatibilité
> L'APC est **incompatible** avec la désagrégation Prefill/Decode (`--role prefill/decode`). Ne pas activer les deux simultanément. Compatible avec le Tensor Parallelism et la quantification FP8 du KV Cache[^7].

### Systemd service (Linux)

```ini
# /etc/systemd/system/vllm.service
[Unit]
Description=vLLM Inference Server
After=network.target

[Service]
Type=simple
User=vllm
Environment="HF_HOME=/data/models"
Environment="CUDA_VISIBLE_DEVICES=0,1,2,3"
ExecStart=/usr/bin/python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-3.1-70B-Instruct \
  --tensor-parallel-size 4 \
  --host 127.0.0.1 \
  --port 8000 \
  --gpu-memory-utilization 0.90
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now vllm
sudo journalctl -u vllm -f   # suivre les logs
```

---

## 6. Vérification et tests

```bash
# Health check
curl http://localhost:8000/health

# Liste des modèles chargés
curl http://localhost:8000/v1/models | python3 -m json.tool

# Test de génération
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-votre-token" \
  -d '{
    "model": "llama-70b",
    "messages": [{"role": "user", "content": "Bonjour, tu fonctionnes ?"}],
    "max_tokens": 100
  }'

# Métriques Prometheus
curl http://localhost:8000/metrics | grep vllm
```

---

## Prochaines étapes

- **Monitoring** → [[06-mise-en-oeuvre/monitoring-inference-stack|📊 Monitoring Prometheus + Grafana]]
- **Migration depuis Ollama** → [[06-mise-en-oeuvre/migrate-ollama-to-vllm|🔄 Migrer d'Ollama vers vLLM]]
- **Sécurisation** → [[06-mise-en-oeuvre/local-inference-security|🔒 Sécurité de l'inférence locale]]

---

## Sources et Références

[^1]: vLLM Project, *Installation — Docker* (image officielle `vllm/vllm-openai`, CUDA 12.x, dépendances). [https://docs.vllm.ai/en/stable/getting_started/installation.html](https://docs.vllm.ai/en/stable/getting_started/installation.html)
[^2]: vLLM Project, *Engine Arguments* (`--gpu-memory-utilization`, `--max-model-len`, `--max-num-seqs`, comportement KV Cache). [https://docs.vllm.ai/en/stable/serving/engine_args.html](https://docs.vllm.ai/en/stable/serving/engine_args.html)
[^3]: vLLM Project, *Parallelism and Scaling — Tensor Parallelism* (`--tensor-parallel-size`, sharding des poids, recommandations NVLink). [https://docs.vllm.ai/en/stable/serving/parallelism_scaling/](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/)
[^4]: Anyscale & vLLM Blog, *Streamlined multi-node serving with Ray symmetric-run* (configuration Ray cluster, pipeline parallelism inter-nœuds). [https://www.anyscale.com/blog/streamlined-multi-node-serving](https://www.anyscale.com/blog/streamlined-multi-node-serving), Novembre 2025.
[^5]: vLLM Project, *Disaggregated Prefill and Decode* (architecture séparation phases, réduction TTFT). [https://docs.vllm.ai/en/stable/features/disagg_prefill.html](https://docs.vllm.ai/en/stable/features/disagg_prefill.html)
[^6]: vLLM Project, *KV Cache Quantization* (FP8 KV cache, prise en charge NVIDIA Hopper, impact mémoire). [https://docs.vllm.ai/en/stable/features/quantization/fp8_kv_cache.html](https://docs.vllm.ai/en/stable/features/quantization/fp8_kv_cache.html)
[^7]: vLLM Project, *Automatic Prefix Caching* (fonctionnement par blocs de 16 tokens, impact TTFT, compatibilité tensor parallelism). [https://docs.vllm.ai/en/stable/features/automatic_prefix_caching.html](https://docs.vllm.ai/en/stable/features/automatic_prefix_caching.html)
