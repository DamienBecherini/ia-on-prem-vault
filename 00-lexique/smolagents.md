---
title: SmolAgents
description: Framework léger de Hugging Face pour l'orchestration agentique locale, alternative souveraine à LangChain.
aliases:
  - smolagents
  - Smol Agents
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Définition courte
Bibliothèque Python open-source de Hugging Face pour construire des agents LLM minimalistes, sans télémétrie externe — alternative souveraine à LangChain.

## 📖 Définition détaillée
SmolAgents suit la boucle **ReAct** (Reason + Act) en donnant des outils au LLM. Sa philosophie est la sobriété : code minimal, pas de dépendances cloud obligatoires, pas de télémétrie par défaut. Compatible avec tous les modèles HuggingFace et les endpoints OpenAI-compatibles (Ollama, vLLM).

Contraste avec LangChain/LlamaIndex : ces frameworks sont plus complets mais incluent de la télémétrie qui peut faire transiter vos prompts vers des serveurs externes — risque incompatible avec une politique on-premise stricte.

## 💡 Pourquoi c'est important en IA on-premise
Permet de construire des [[00-lexique/autonomous-agent|agents autonomes]] souverains sans dépendance cloud. Recommandé pour tout déploiement on-premise agentique soucieux de la confidentialité des prompts.

## ⚠️ Pièges fréquents
- Plus léger = moins de fonctionnalités prêtes à l'emploi que LangChain. Certaines intégrations doivent être codées à la main.
- Auditer la télémétrie même dans SmolAgents si vous mettez à jour les dépendances.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] *(SmolAgents dans le contexte Agentic RAG)*
2. [[00-lexique/autonomous-agent|Agent autonome]] *(le concept général)*
3. [[05-agents-et-assistants-on-prem/agents-custodiens/index|Agents Custodiens]] *(où SmolAgents peut servir de framework minimaliste pour des agents on-premise)*

## 🔗 Voir aussi
- [[00-lexique/autonomous-agent|Agent autonome]]
- [[00-lexique/agent-custodian|Agent custodien]]
- [[00-lexique/rag|RAG]]
- [[00-lexique/llm|LLM]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
