---
title: RAG
description: Architecture qui combine recherche documentaire et génération LLM.
aliases:
  - Retrieval-Augmented Generation
tags:
  - lexique
  - stack
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Définition courte
Méthode qui récupère des documents pertinents avant de générer une réponse avec un LLM.

## 📖 Définition détaillée
Le RAG combine un moteur de recherche (souvent vectoriel) et un modèle génératif.
Le contexte injecté est ciblé, ce qui améliore précision métier et réduit les hallucinations.

## 💡 Pourquoi c'est important en IA on-premise
Il permet d'exploiter la connaissance interne d'une organisation sans réentraîner le modèle.

## 🔗 Voir aussi
- [[00-lexique/context-window|Fenêtre de contexte]]
- [[00-lexique/llm|LLM]]
- [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents : L'architecture de la connaissance]]
