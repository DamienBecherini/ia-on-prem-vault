---
title: Agent autonome (LLM)
description: Système où un LLM pilote lui-même des outils et des décisions pour accomplir une tâche multi-étapes.
aliases:
  - Agent LLM
  - AI Agent
  - Agentic AI
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Un LLM équipé d'outils (recherche, code, API) qui décide lui-même comment les enchaîner pour accomplir une tâche — contrairement à un simple prompt → réponse.

## 📖 Définition détaillée
Dans un pipeline classique, le LLM répond à une question en un seul coup. Dans un agent, le LLM **raisonne en boucle** (boucle ReAct : Reason + Act) :
1. *Réfléchit* : de quelles informations ai-je besoin ?
2. *Appelle* un outil (chercher dans une base, exécuter du code, interroger une API).
3. *Observe* le résultat et décide si c'est suffisant ou s'il faut une nouvelle recherche.
4. *Rédige* la réponse finale une fois l'information collectée.

Frameworks courants en 2026 : [[00-lexique/smolagents|SmolAgents]] (Hugging Face), LangGraph, AutoGen.

## 💡 Pourquoi c'est important en IA on-premise
Transforme un LLM figé en assistant actif capable de maintenir des vaults documentaires, d'auditer du code ou de surveiller des systèmes. Clé du projet OpenHuman.

## ⚠️ Pièges fréquents
- Un agent mal borné peut boucler indéfiniment ou appeler des outils de manière non intentionnelle.
- Plus le LLM pilote est petit, moins fiables sont ses décisions de routage.
- Les frameworks comme LangChain intègrent de la télémétrie qui peut faire fuiter les prompts vers des APIs externes.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/rag-et-agents-openhuman|🧩 RAG & Agents]] *(Agentic RAG, SmolAgents et l'approche OpenHuman Memory Trees)*

## 🔗 Voir aussi
- [[00-lexique/rag|RAG]]
- [[00-lexique/smolagents|SmolAgents]]
- [[00-lexique/graphrag|GraphRAG]]
- [[00-lexique/llm|LLM]]
- [[00-lexique/glossaire-ia|📖 Glossaire IA]]
