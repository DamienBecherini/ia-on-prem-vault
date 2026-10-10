---
title: "🚀 Démarrer avec Ollama"
description: Installation, premier modèle, test API et premières bonnes pratiques pour une inférence locale en moins de 15 minutes.
sidebar:
  order: 3
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] En bref
> Ollama est le moyen le plus rapide de faire tourner un LLM en local. Ce guide couvre l'installation, le premier modèle, l'API compatible OpenAI et les réglages de base. Comptez 15 minutes pour avoir un modèle 8B qui répond à vos premières requêtes.

---

## Prérequis

- **macOS** (Apple Silicon recommandé — depuis Ollama 0.40, septembre 2026, les architectures compatibles tournent par défaut sur le moteur MLX d'Apple[^3]) ou **Linux** (GPU NVIDIA ou AMD, ou CPU seul)
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
# ollama version is 0.40.x (0.40.2 au 2026-10-08)

# Le service tourne ?
curl http://localhost:11434/
# Ollama is running
```

### Windows

Télécharger l'installeur depuis [ollama.com/download](https://ollama.com/download). L'installeur configure le service en arrière-plan et ajoute `ollama` au PATH.

> [!note] `ollama` sans argument
> Depuis la version 0.32 (juillet 2026), taper simplement `ollama` lance un agent de codage interactif qui propose par défaut un modèle *cloud* (`glm-5.2:cloud`) ; depuis la 0.34.2 (septembre 2026), un écran de première exécution propose de se connecter ou de « continuer en local ». Choisissez **continuer en local** : l'inférence locale ne requiert aucun compte, et `ollama run <modèle>` reste la commande à utiliser dans ce guide. La même version 0.32 affiche un avertissement « modèle ancien » au lancement de CodeLlama, Qwen2.5, Llama 3.x, Mistral ou DeepSeek-R1 de base[^4].

---

## Premier modèle

```bash
# Télécharger et lancer un petit modèle récent (~6,5 Go en Q4_K_M)
ollama run qwen3.5:9b

# Ou un 3B très léger (~2 Go)
ollama run llama3.2

# Ou un modèle plus compact pour tester rapidement (~2,5 Go)
ollama run phi4-mini

# Ou un modèle coder (~18,6 Go)
ollama run qwen3-coder:30b
# qwen2.5-coder:14b (~9 Go) reste disponible mais est signalé comme ancien par Ollama ≥ 0.32
```

La première exécution télécharge le modèle depuis [ollama.com/library](https://ollama.com/library) (tailles relevées sur le registre au 2026-10-09[^1]). Les suivantes utilisent le cache local.

Pour quitter la session interactive : `/bye` ou `Ctrl+D`.

---

## Commandes essentielles

```bash
# Lister les modèles téléchargés
ollama list

# Voir les modèles disponibles en ligne
# → https://ollama.com/library

# Télécharger sans lancer
ollama pull qwen3.6:35b   # ~22,6 Go

# Supprimer un modèle du cache
ollama rm llama3.2

# Voir les processus en cours
ollama ps

# Logs du service (Linux systemd) — il n'existe pas de sous-commande `ollama logs`
journalctl -u ollama --no-pager --follow --pager-end
# macOS : cat ~/.ollama/logs/server.log
```

Les emplacements des logs par plateforme sont décrits dans la page de dépannage d'Ollama[^2].

Depuis Ollama 0.40.2 (octobre 2026), les modèles téléchargés avec une version antérieure sont réécrits en arrière-plan au premier lancement (originaux conservés comme sauvegardes) ; revenir à une version < 0.40 oblige à re-tirer les modèles — sur une appliance, épinglez la version d'Ollama[^5].

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

Par défaut, le serveur Ollama utilise une fenêtre de 4 096 tokens (`OLLAMA_CONTEXT_LENGTH`) ; l'application de bureau choisit une valeur selon la VRAM (4k sous 24 Gio, 32k entre 24 et 48 Gio, 256k au-delà)[^6]. Pour étendre :

```bash
# Pour tout le serveur (variable d'environnement)
OLLAMA_CONTEXT_LENGTH=8192 ollama serve

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

### Requêtes concurrentes

Par défaut, chaque modèle ne traite qu'une requête à la fois (`OLLAMA_NUM_PARALLEL=1`) : la deuxième attend en file. Relever cette valeur multiplie la mémoire réservée au contexte (parallélisme × `OLLAMA_CONTEXT_LENGTH`) ; `OLLAMA_MAX_LOADED_MODELS` (3 × nombre de GPU par défaut) borne le nombre de modèles chargés simultanément[^6]. Pour plusieurs utilisateurs réguliers, voir [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]].

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

> [!warning] Mises à jour
> Ollama corrige des vulnérabilités sans toujours les détailler dans ses notes de version : la 0.31.2 (juillet 2026) ferme CVE-2026-102697 (exécution de commandes supplémentaires via le mode agent par injection de prompt, CVSS 7.8) et « durcit » la création de GGUF. Gardez Ollama à jour (≥ 0.31.2 au minimum au T4 2026)[^7].

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

Ordres de grandeur indicatifs (mesures communautaires sur llama.cpp, mi-2026, non sourcées individuellement ; sur Apple Silicon, Ollama ≥ 0.40 utilise MLX par défaut et les débits peuvent différer — mesurez avec la commande ci-dessus et le protocole de [[06-mise-en-oeuvre/evaluate-local-model|🧪 Évaluer un modèle local]]) :

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

---

## Sources et Références

[^1]: Ollama, *Library* et registre `registry.ollama.ai` (manifestes : `llama3.2` = 3B, 2,02 Go ; `qwen3.5:9b` ≈ 6,5 Go ; `qwen3-coder:30b` ≈ 18,6 Go ; `qwen3.6:35b` ≈ 22,6 Go ; `qwen2.5-coder:14b` ≈ 9 Go), consultés le 2026-10-09. [https://ollama.com/library](https://ollama.com/library) · [https://registry.ollama.ai](https://registry.ollama.ai)
[^2]: Ollama, *Troubleshooting* (emplacement des logs : `journalctl -u ollama`, `~/.ollama/logs/server.log`), consulté le 2026-10-09 · dépôt `ollama/ollama`, `cmd/cmd.go` (liste des sous-commandes, sans `logs`). [https://docs.ollama.com/troubleshooting](https://docs.ollama.com/troubleshooting) · [https://github.com/ollama/ollama](https://github.com/ollama/ollama)
[^3]: Ollama, *Release v0.40.0* (« Models run on MLX on Apple Silicon by default »), 25 septembre 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0)
[^4]: Ollama, *Release v0.32.0* (`ollama` sans argument lance un agent, entrée par défaut `glm-5.2:cloud` ; avertissement de dépréciation des anciens modèles agent), 11 juillet 2026 · Ollama, *Release v0.34.2* (« first-run setup … with options to sign in or continue locally »), 15 septembre 2026. [https://github.com/ollama/ollama/releases/tag/v0.32.0](https://github.com/ollama/ollama/releases/tag/v0.32.0) · [https://github.com/ollama/ollama/releases/tag/v0.34.2](https://github.com/ollama/ollama/releases/tag/v0.34.2)
[^5]: Ollama, *Release v0.40.2* (modèles « upgraded in the background the first time you run them », sauvegardes conservées, re-pull nécessaire en cas de retour < 0.40), 8 octobre 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.2](https://github.com/ollama/ollama/releases/tag/v0.40.2)
[^6]: Ollama, *FAQ* (« By default, Ollama uses a context window size of 4096 tokens », `OLLAMA_CONTEXT_LENGTH`, `OLLAMA_NUM_PARALLEL` = 1, `OLLAMA_MAX_LOADED_MODELS` = 3 × GPU) et *Context length* (défauts de l'application : 4k / 32k / 256k selon la VRAM), consultées le 2026-10-10. [https://docs.ollama.com/faq](https://docs.ollama.com/faq) · [https://docs.ollama.com/context-length](https://docs.ollama.com/context-length)
[^7]: MITRE, *CVE-2026-102697* (Ollama 0.14.0 → < 0.31.2, contournement de l'approbation des commandes Bash du mode agent, CVSS v3.1 7.8), publiée le 2026-09-29 · Ollama, *Release v0.31.2* (« Hardened GGUF model creation »), 6 juillet 2026. [https://cveawg.mitre.org/api/cve/CVE-2026-102697](https://cveawg.mitre.org/api/cve/CVE-2026-102697) · [https://github.com/ollama/ollama/releases/tag/v0.31.2](https://github.com/ollama/ollama/releases/tag/v0.31.2)
