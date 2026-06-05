---
title: GraphRAG
description: Évolution du RAG basée sur un graphe de connaissances plutôt qu'une base vectorielle.
aliases:
  - Graph RAG
  - Knowledge Graph RAG
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Définition courte
Architecture RAG qui extrait des entités et leurs relations dans un graphe de connaissances, permettant des requêtes globales qu'une recherche vectorielle classique ne peut pas répondre.

## 📖 Définition détaillée
Popularisé par les recherches de Microsoft (2024), GraphRAG remplace (ou complète) la [[00-lexique/vectordb|base vectorielle]] par un **Knowledge Graph** : le système extrait les entités (Personnes, Lieux, Concepts) et leurs relations depuis les documents. Lors d'une requête, le LLM peut naviguer ce graphe pour répondre à des questions globales ou relationnelles.

Exemple de question impossible pour le RAG vectoriel classique, mais faisable avec GraphRAG : *"Quels sont les thèmes transversaux entre tous les documents produits par l'équipe produit ce mois-ci ?"*

Inconvénient : la construction du graphe est plus coûteuse et complexe qu'un simple indexing vectoriel.

## 💡 Pourquoi c'est important en IA on-premise
Pertinent quand la base documentaire est dense en relations (ex : base légale, code source, documentation technique). À privilégier si le RAG vectoriel échoue sur les questions de synthèse globale.

## ⚠️ Pièges fréquents
- Coût d'extraction des entités élevé (nécessite souvent un LLM dédié à la construction du graphe).
- Plus complexe à mettre à jour qu'un index vectoriel.
- Pas toujours supérieur au RAG vectoriel pour les recherches factuelles localisées.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] *(GraphRAG dans le contexte de l'évolution agentique)*

## 🔗 Voir aussi
- [[00-lexique/rag|RAG]]
- [[00-lexique/vectordb|Base de données vectorielle]]
- [[00-lexique/autonomous-agent|Agent autonome]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
