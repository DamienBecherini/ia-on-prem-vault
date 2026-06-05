---
title: "🚀 Démarrer avec Ollama"
description: Installation, premier modèle, test API et premières bonnes pratiques pour une inférence locale en moins de 15 minutes.
sidebar:
  order: 3
last_modified: "2026-06-05"
---

> [!tip] En bref
> Ollama est le moyen le plus rapide de faire tourner un LLM en local. Ce guide couvre l'installation, le premier modèle, l'API compatible OpenAI et les réglages de base. Comptez 15 minutes pour avoir un modèle 8B qui répond à vos premières requêtes.

---

## Prérequis

- **macOS** (Apple Silicon recommandé) ou **Linux** (GPU NVIDIA ou AMD, ou CPU seul)
- Windows : supporté via WSL2 ou installeur natif — les performances GPU nécessitent les pilotes CUDA ou ROCm
- Au moins 8 Go de RAM (16+ recommandé pour un 7B/8B confortable)
- Espace disque : 5–50 Go selon le modèle téléchargé

> [!note] Quel matériel pour quel modèle ?
> Voir [[03-stack-logicielle/choose-your-model|🗺️ Choisir son modèle]] et [[01-fondations/quantization-4bit-8bit|Quantification]] pour calculer l'empreinte VRAM/RAM avant de télécharger.

---

## Installation

### macOS / Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Ollama installe un service système qui démarre automatiquement au boot.

Vérification :

```bash
ollama --version
# ollama version is 0.x.x

# Le service tourne ?
curl http://localhost:11434/
# Ollama is running
```

### Windows

Télécharger l'installeur depuis [ollama.com/download](https://ollama.com/download). L'installeur configure le service en arrière-plan et ajoute `ollama` au PATH.

---

## Premier modèle

```bash
# Télécharger et lancer un modèle 8B (~5 Go en Q4_K_M)
ollama run llama3.2

# Ou un modèle plus compact pour tester rapidement (~1,3 Go)
ollama run phi4-mini

# Ou un modèle coder
ollama run qwen2.5-coder:14b
```

La première exécution télécharge le modèle depuis [ollama.com/library](https://ollama.com/library). Les suivantes utilisent le cache local.

Pour quitter la session interactive : `/bye` ou `Ctrl+D`.

---

## Commandes essentielles

```bash
# Lister les modèles téléchargés
ollama list

# Voir les modèles disponibles en ligne
# → https://ollama.com/library

# Télécharger sans lancer
ollama pull qwen2.5:72b

# Supprimer un modèle du cache
ollama rm llama3.2

# Voir les processus en cours
ollama ps

# Logs du service
ollama logs
```

---

## L'API compatible OpenAI

Ollama expose une API REST sur `http://localhost:11434` compatible avec le format OpenAI. Toutes les bibliothèques qui utilisent l'API OpenAI fonctionnent sans modification en changeant l'URL de base.

### Requête directe

```bash
curl http://localhost:11434/api/generate \
  -d '{
    "model": "llama3.2",
    "prompt": "Explique le KV Cache en 3 phrases.",
    "stream": false
  }'
```

### Format compatible OpenAI (`/v1/chat/completions`)

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2",
    "messages": [
      {"role": "system", "content": "Tu es un assistant technique."},
      {"role": "user", "content": "Quelle est la différence entre prefill et decoding ?"}
    ]
  }'
```

### Python (openai SDK)

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # valeur arbitraire, Ollama ne vérifie pas la clé
)

response = client.chat.completions.create(
    model="llama3.2",
    messages=[
        {"role": "user", "content": "Résume le concept de mémoire unifiée en 2 phrases."}
    ]
)
print(response.choices[0].message.content)
```

---

## Réglages utiles

### Contexte plus long

Par défaut, Ollama limite le contexte à 2048 tokens. Pour étendre :

```bash
# Via l'API (par requête)
curl http://localhost:11434/api/generate \
  -d '{"model": "llama3.2", "prompt": "...", "options": {"num_ctx": 8192}}'

# Via Modelfile (persistant)
ollama show llama3.2 --modelfile > Modelfile
# Ajouter dans le Modelfile :
# PARAMETER num_ctx 8192
ollama create llama3.2-8k -f Modelfile
```

> [!warning] VRAM et contexte
> Doubler la fenêtre de contexte peut doubler l'empreinte du [[00-lexique/kv-cache|KV Cache]]. Vérifiez que votre VRAM/RAM tient avant d'étendre à 32K ou 128K. Voir [[01-fondations/kv-cache-and-context|KV Cache & Contexte]].

### Température et paramètres de génération

```bash
curl http://localhost:11434/api/generate \
  -d '{
    "model": "llama3.2",
    "prompt": "...",
    "options": {
      "temperature": 0.1,    # 0 = déterministe, 1 = créatif
      "top_p": 0.9,
      "num_predict": 512     # tokens max à générer
    }
  }'
```

### Exposer Ollama sur le réseau local

Par défaut, Ollama n'écoute que sur `localhost`. Pour le rendre accessible aux autres machines :

```bash
# Linux : variable d'environnement du service
OLLAMA_HOST=0.0.0.0 ollama serve

# Ou via systemd (modifier /etc/systemd/system/ollama.service)
# Environment="OLLAMA_HOST=0.0.0.0"
```

> [!warning] Sécurité réseau
> Sans authentification, n'importe qui sur votre réseau peut interroger le modèle. En production, placez un reverse proxy (nginx, Caddy) avec authentification basique ou token devant Ollama, ou utilisez [[00-lexique/litellm|LiteLLM]] comme gateway.

---

## Vérifier les performances

```bash
# Lancer une requête et mesurer le débit
curl http://localhost:11434/api/generate \
  -d '{"model": "llama3.2", "prompt": "Dis bonjour en 10 langues.", "stream": false}' \
  | python3 -c "import sys,json; r=json.load(sys.stdin); \
    print(f\"Durée: {r['total_duration']/1e9:.1f}s | \
    Tokens générés: {r['eval_count']} | \
    Débit: {r['eval_count']/(r['eval_duration']/1e9):.1f} tok/s\")"
```

Indicateurs attendus selon le matériel :

| Matériel | Modèle 8B Q4 | Modèle 70B Q4 |
| :-- | :-- | :-- |
| MacBook M4 Pro 48 Go | ~40–60 tok/s | ~10–15 tok/s |
| Mac Studio M3 Ultra 192 Go | ~50–70 tok/s | ~12–18 tok/s |
| AMD Ryzen AI Max PRO (192 Go) | ~25–35 tok/s | ~4–6 tok/s |
| RTX 4090 (24 Go VRAM) | ~50–80 tok/s | Partiel offloading |
| CPU seul (pas de GPU) | ~3–8 tok/s | < 2 tok/s |

---

## Prochaines étapes

- **Choisir le bon modèle pour votre tâche** → [[03-stack-logicielle/choose-your-model|🗺️ Choisir son modèle local]]
- **Passer à la production multi-utilisateurs** → [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ vLLM en production]]
- **Évaluer la qualité** → [[06-mise-en-oeuvre/evaluate-local-model|🧪 Évaluer un modèle local]]
- **Connecter un agent ou un RAG** → [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]
