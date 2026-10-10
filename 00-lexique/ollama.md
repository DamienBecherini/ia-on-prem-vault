---
title: "Ollama"
description: "Runtime local simplifié pour télécharger et exécuter des LLM via llama.cpp ou MLX, avec API OpenAI-compatible."
aliases:
  - Ollama runtime
tags:
  - lexique
  - stack
sidebar:
  order: 64
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
---

## 📝 Définition courte

Distribution et CLI qui exécute des [[00-lexique/llm|LLM]] localement en quelques commandes, via **llama.cpp** (Linux, Windows, format [[00-lexique/gguf|GGUF]]) ou, depuis la version 0.40 (septembre 2026) sur Apple Silicon, via le moteur **MLX** d'Apple par défaut, avec serveur API compatible OpenAI sur le port 11434[^1][^3].

## 📖 Définition détaillée

[Ollama](https://ollama.com/) est le chemin le plus court pour **tester** un [[00-lexique/llm|LLM]] on-premise : `ollama pull`, `ollama run`, puis branchement d'une UI ([[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]], script Python, etc.).

Sous le capot, Ollama s'appuie sur **llama.cpp** (C/C++) — [[00-lexique/quantification|quantification]] agressive (Q4_K_M, etc.), [[00-lexique/offloading|offloading]] CPU/GPU sur postes modestes, format [[00-lexique/gguf|GGUF]] — et, sur Apple Silicon, sur le moteur **MLX** (poids safetensors, mémoire unifiée), utilisé par défaut depuis la 0.40 pour les architectures prises en charge[^3].

## 💡 Pourquoi c'est important en IA on-premise

- **Scénario A** (labo dev) et premiers pas du **scénario B** (PME) : validation modèle, prompts, RAG léger avant bascule [[00-lexique/vllm|vLLM]].
- Référence pour les guides [[06-mise-en-oeuvre/getting-started-with-ollama|Démarrer avec Ollama]] et [[06-mise-en-oeuvre/evaluate-local-model|évaluer un modèle local]].
- Modèles d'embedding locaux (`nomic-embed-text`, etc.) via la même API.

## ⚠️ Pièges fréquents

- Servir **plusieurs utilisateurs simultanés** en production : par défaut Ollama ne traite qu'une requête à la fois par modèle (`OLLAMA_NUM_PARALLEL=1`) et met les autres en file ; relever ce parallélisme coûte de la mémoire (∝ parallélisme × contexte) et ne remplace pas le batching continu d'un moteur de production[^2].
- Tirer un modèle `:cloud` en croyant rester on-prem : certains modèles de la bibliothèque n'existent qu'en version hébergée (`kimi-k3:cloud`, `glm-5.2:cloud`, proposé par défaut par l'agent `ollama` depuis la 0.32) et envoient les requêtes hors du poste ; le compte proposé au premier lancement (0.34.2) ne sert qu'à ces modèles cloud et aux dépôts privés, l'inférence locale n'en a pas besoin[^4].
- Confondre « modèle téléchargé » et « modèle adapté au métier » : toujours valider avec un golden dataset.
- Exposer l'API 11434 sans authentification sur le réseau interne : voir [[06-mise-en-oeuvre/local-inference-security|sécurité inférence]].

## 📚 Pour comprendre en profondeur

1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]] — limites Ollama vs vLLM
2. [[06-mise-en-oeuvre/getting-started-with-ollama|🚀 Démarrer avec Ollama]]
3. [[04-blueprints/scenario-a-dev-lab|🛠️ Scénario A — Labo Dev]]

## 🔗 Voir aussi

- [[00-lexique/vllm|vLLM]]
- [[00-lexique/gguf|GGUF]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: Ollama — site et documentation. [https://ollama.com/](https://ollama.com/)
[^2]: Ollama, *FAQ — How does Ollama handle concurrent requests?* (`OLLAMA_NUM_PARALLEL` par défaut à 1, `OLLAMA_MAX_LOADED_MODELS`, file d'attente), consultée le 2026-10-10. [https://docs.ollama.com/faq](https://docs.ollama.com/faq) — voir aussi [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]].
[^3]: Ollama, *Release v0.40.0* (« Models run on MLX on Apple Silicon by default »), 25 septembre 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0)
[^4]: Ollama, *Release v0.32.0* (`ollama` sans argument lance un agent, entrée par défaut `glm-5.2:cloud`), 11 juillet 2026 · *Release v0.32.6* (`ollama run kimi-k3` propose `kimi-k3:cloud` « for cloud-only models that publish no default tag »), 4 août 2026 · *Release v0.34.2* (écran de première exécution « sign in or continue locally »), 15 septembre 2026. [https://github.com/ollama/ollama/releases/tag/v0.32.0](https://github.com/ollama/ollama/releases/tag/v0.32.0) · [https://github.com/ollama/ollama/releases/tag/v0.32.6](https://github.com/ollama/ollama/releases/tag/v0.32.6) · [https://github.com/ollama/ollama/releases/tag/v0.34.2](https://github.com/ollama/ollama/releases/tag/v0.34.2)
