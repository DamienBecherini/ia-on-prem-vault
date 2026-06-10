---
title: "LangGraph"
description: "Framework de graphe d'états pour orchestrer des agents LLM multi-étapes avec boucles, mémoire et contrôle de flux."
aliases:
  - LangGraph framework
tags:
  - lexique
  - stack
sidebar:
  order: 65
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
---

## 📝 Définition courte

Bibliothèque (écosystème LangChain) qui modélise un agent ou un pipeline [[00-lexique/rag|RAG]] comme un **graphe orienté** : nœuds (actions LLM, outils, retrieval), arêtes (transitions), état partagé et cycles contrôlés[^1].

## 📖 Définition détaillée

LangGraph permet de construire des workflows **agentiques** explicites : au lieu d'une chaîne linéaire, on définit des étapes rejouables (ex. « retrieve → grade → rewrite → generate »), avec persistance d'état entre tours et points d'arrêt pour [[00-lexique/human-in-the-loop|human-in-the-loop]].

En on-premise, LangGraph s'utilise souvent avec un backend [[00-lexique/vllm|vLLM]] ou [[00-lexique/ollama|Ollama]] local, une [[00-lexique/vectordb|base vectorielle]] et des outils métier (SQL, API internes). C'est une alternative structurée à des frameworks plus minimalistes comme [[00-lexique/smolagents|SmolAgents]] quand le flux devient complexe.

## 💡 Pourquoi c'est important en IA on-premise

- Pattern **Agentic RAG** : self-correcting retrieval, re-planification après échec d'outil.
- Gouvernance : graphe lisible = auditabilité des étapes (vs boîte noire monolithique).
- Complète [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] pour les équipes déjà sur l'écosystème LangChain.

## ⚠️ Pièges fréquents

- Empiler LangGraph + LangChain sans auditer la **télémétrie** : certains composants peuvent contacter des services cloud par défaut — configurer en mode offline/on-prem.
- Graphes trop profonds sans limite de tours : risque [[00-lexique/excessive-agency|Excessive Agency]] (OWASP LLM06) et explosion de coût/latence.
- Oublier la persistance d'état : redémarrage = perte de contexte agent si non externalisé (Redis, SQLite).

## 📚 Pour comprendre en profondeur

1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] — Agentic RAG et orchestration
2. [[00-lexique/autonomous-agent|Agent autonome]]
3. [[00-lexique/appel-outils|Appel d'outils]]

## 🔗 Voir aussi

- [[00-lexique/rag|RAG]]
- [[00-lexique/smolagents|SmolAgents]]
- [[00-lexique/human-in-the-loop|Human-in-the-loop]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: LangGraph — documentation officielle. [https://langchain-ai.github.io/langgraph/](https://langchain-ai.github.io/langgraph/)
