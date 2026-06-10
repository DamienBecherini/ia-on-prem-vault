---
title: "Ollama"
description: "Runtime local simplifié pour télécharger et exécuter des LLM via llama.cpp, avec API OpenAI-compatible."
aliases:
  - Ollama runtime
tags:
  - lexique
  - stack
sidebar:
  order: 64
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
---

## 📝 Définition courte

Distribution et CLI qui encapsule **llama.cpp** pour exécuter des modèles [[00-lexique/gguf|GGUF]] localement en quelques commandes, avec serveur API compatible OpenAI sur le port 11434[^1].

## 📖 Définition détaillée

[Ollama](https://ollama.com/) est le chemin le plus court pour **tester** un [[00-lexique/llm|LLM]] on-premise : `ollama pull`, `ollama run`, puis branchement d'une UI ([[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]], script Python, etc.).

Sous le capot, Ollama s'appuie sur **llama.cpp** (C/C++) : [[00-lexique/quantification|quantification]] agressive (Q4_K_M, etc.), [[00-lexique/offloading|offloading]] CPU/GPU sur postes modestes, support Apple Silicon via mémoire unifiée. Format natif : [[00-lexique/gguf|GGUF]].

## 💡 Pourquoi c'est important en IA on-premise

- **Scénario A** (labo dev) et premiers pas du **scénario B** (PME) : validation modèle, prompts, RAG léger avant bascule [[00-lexique/vllm|vLLM]].
- Référence pour les guides [[06-mise-en-oeuvre/getting-started-with-ollama|Démarrer avec Ollama]] et [[06-mise-en-oeuvre/evaluate-local-model|évaluer un modèle local]].
- Modèles d'embedding locaux (`nomic-embed-text`, etc.) via la même API.

## ⚠️ Pièges fréquents

- Servir **plusieurs utilisateurs simultanés** en production : l'architecture séquentielle de llama.cpp/Ollama sature rapidement (latence ×10 au-delà de ~5–10 requêtes parallèles selon config)[^2].
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
[^2]: Particula Tech, *Ollama vs vLLM: Which LLM Server Actually Fits in 2026* (comparatifs communautaires sous charge concurrente, ordre de grandeur ×5–×16 selon modèle/GPU), Mars 2026. [https://particula.tech/blog/ollama-vs-vllm-comparison](https://particula.tech/blog/ollama-vs-vllm-comparison) — voir aussi [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]].
