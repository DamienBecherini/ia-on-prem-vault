---
title: Base de données vectorielle
description: Base de données spécialisée dans le stockage et la recherche de vecteurs d'embeddings pour le RAG.
aliases:
  - Vector database
  - Vector DB
  - Base vectorielle
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
Base de données qui stocke des représentations numériques (vecteurs) de documents et recherche les plus proches d'une requête par similarité mathématique.

## 📖 Définition détaillée
Chaque document est converti en un vecteur (embedding) par un modèle spécialisé. Lors d'une recherche, la requête est elle aussi convertie en vecteur et la base retourne les documents dont le vecteur est le plus proche (similarité cosinus ou produit scalaire).

Solutions courantes en 2026 : **Qdrant**, **Milvus**, **Chroma** (local léger), **Weaviate**. La plupart sont open-source et déployables on-premise.

Limite principale dans le RAG classique : la recherche est "aveugle" — elle trouve les passages *textuellement proches* mais peut rater des connexions sémantiques complexes ou des relations entre entités. C'est ce que le [[00-lexique/graphrag|GraphRAG]] tente de résoudre.

## 💡 Pourquoi c'est important en IA on-premise
Brique centrale du RAG standard. Doit être déployée localement pour préserver la souveraineté des données.

## ⚠️ Pièges fréquents
- Renvoyer trop de résultats (ex : top-20) gonfle le prompt et sature la [[00-lexique/context-window|Fenêtre de contexte]] du modèle.
- La qualité des embeddings est critique : un mauvais modèle d'embedding donne de mauvais résultats de recherche indépendamment de la base.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] *(le pipeline complet RAG et ses alternatives agentiques)*

## 🔗 Voir aussi
- [[00-lexique/rag|RAG]]
- [[00-lexique/graphrag|GraphRAG]]
- [[00-lexique/context-window|Fenêtre de contexte]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
