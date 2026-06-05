---
title: LLM-as-a-judge
description: Technique d'évaluation où un modèle de langage sert de juge pour noter ou comparer des réponses.
aliases:
  - LLM judge
  - modèle juge
  - juge LLM
tags:
  - lexique
  - evaluation
last_modified: "2026-06-05"
---

## 📝 Définition courte

Méthode qui utilise un [[00-lexique/llm|LLM]] pour noter, comparer ou expliquer la qualité de réponses produites par d'autres modèles.

## 📖 Définition détaillée

Un LLM juge peut être utilisé pour :

- comparer deux réponses à une même question ;
- attribuer une note selon une grille ;
- vérifier si une réponse respecte une consigne ;
- signaler des incohérences ou hallucinations probables.

Cette approche est pratique pour accélérer les évaluations ouvertes, mais elle reste imparfaite. Les juges LLM peuvent favoriser les réponses longues, être sensibles à l'ordre des réponses ou préférer leur propre style.

## 💡 Pourquoi c'est important en IA on-premise

Pour choisir un modèle local, un LLM juge peut pré-trier beaucoup de réponses avant revue humaine. Il ne doit pas décider seul sur des usages critiques.

## ⚠️ Pièges fréquents

- Utiliser le même modèle comme candidat et comme juge.
- Oublier d'inverser l'ordre des réponses dans les comparaisons A/B.
- Donner une note sans grille explicite.
- Confondre jugement automatique et validation métier.

## 🔗 Voir aussi

- [[06-mise-en-oeuvre/evaluate-local-model|Évaluer un modèle local]]
- [[00-lexique/benchmark-llm|Benchmark LLM]]
- [[00-lexique/ragas|RAGAS]]
