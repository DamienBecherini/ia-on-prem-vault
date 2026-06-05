---
title: RAGAS
description: Framework d'évaluation automatique pour pipelines RAG.
aliases:
  - Retrieval Augmented Generation Assessment
tags:
  - lexique
  - evaluation
  - rag
last_modified: "2026-06-05"
---

## 📝 Définition courte

Framework qui évalue un système [[00-lexique/rag|RAG]] en séparant la qualité du retrieval et la fidélité de la réponse générée.

## 📖 Définition détaillée

RAGAS mesure notamment :

- **faithfulness** : la réponse est-elle supportée par les contextes récupérés ?
- **answer relevancy** : la réponse répond-elle vraiment à la question ?
- **context precision** : les passages récupérés sont-ils pertinents ?
- **context recall** : le retrieval retrouve-t-il les informations nécessaires ?

L'intérêt est de diagnostiquer où le système échoue : mauvais documents récupérés, bonne source mal exploitée, réponse hors sujet ou hallucination.

## 💡 Pourquoi c'est important en IA on-premise

Beaucoup d'assistants locaux reposent sur le RAG pour exploiter des documents internes. RAGAS aide à mesurer la qualité de cette couche sans se limiter à une impression subjective.

## ⚠️ Pièges fréquents

- Croire qu'un bon modèle compense un mauvais retrieval.
- Mesurer seulement la réponse finale sans vérifier les passages récupérés.
- Remplacer toute revue humaine par un score automatique.

## 🔗 Voir aussi

- [[00-lexique/rag|RAG]]
- [[06-mise-en-oeuvre/evaluate-local-model|Évaluer un modèle local]]
- [[00-lexique/llm-as-a-judge|LLM-as-a-judge]]
