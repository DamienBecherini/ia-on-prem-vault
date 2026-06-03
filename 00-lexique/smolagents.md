---
title: SmolAgents
description: Framework léger de Hugging Face pour l'orchestration agentique locale, alternative souveraine à LangChain.
aliases:
  - smolagents
  - Smol Agents
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Bibliothèque Python open-source de Hugging Face pour construire des agents LLM minimalistes, sans télémétrie externe — alternative souveraine à LangChain.

## 📖 Définition détaillée
SmolAgents suit la boucle **ReAct** (Reason + Act) en donnant des outils au LLM. Sa philosophie est la sobriété : code minimal, pas de dépendances cloud obligatoires, pas de télémétrie par défaut. Compatible avec tous les modèles HuggingFace et les endpoints OpenAI-compatibles (Ollama, vLLM).

Contraste avec LangChain/LlamaIndex : ces frameworks sont plus complets mais incluent de la télémétrie qui peut faire transiter vos prompts vers des serveurs externes — risque incompatible avec une politique on-premise stricte.

## 💡 Pourquoi c'est important en IA on-premise
Permet de construire des [[00-lexique/agent-autonome|agents autonomes]] souverains sans dépendance cloud. Recommandé dans le chapitre RAG & Agents pour les déploiements OpenHuman.

## ⚠️ Pièges fréquents
- Plus léger = moins de fonctionnalités prêtes à l'emploi que LangChain. Certaines intégrations doivent être codées à la main.
- Auditer la télémétrie même dans SmolAgents si vous mettez à jour les dépendances.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/rag-et-agents-openhuman|🧩 RAG & Agents]] *(SmolAgents dans le contexte Agentic RAG)*
2. [[00-lexique/agent-autonome|Agent autonome]] *(le concept général)*

## 🔗 Voir aussi
- [[00-lexique/agent-autonome|Agent autonome]]
- [[00-lexique/rag|RAG]]
- [[00-lexique/llm|LLM]]
- [[00-lexique/glossaire-ia|📖 Glossaire IA]]
