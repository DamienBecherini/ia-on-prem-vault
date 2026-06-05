---
title: Embedding
description: Représentation numérique dense d'un token ou d'un document dans un espace vectoriel.
aliases:
  - Embeddings
  - Vecteur d'embedding
  - Représentation vectorielle
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Définition courte
Vecteur de coordonnées qui encode le sens d'un token ou d'un document dans un espace mathématique — les concepts proches sont proches dans cet espace.

## 📖 Définition détaillée
Après [[00-lexique/tokenisation|tokenisation]], chaque token est converti en un vecteur de dimension fixe (ex : 4096 dimensions pour Llama 3.1 8B). Dans cet espace, « Roi » et « Reine » sont proches ; « Paris » et « France » aussi. C'est cette géographie qui permet au modèle de raisonner par analogie.

**Deux usages distincts à ne pas confondre :**
- **Embeddings internes d'un LLM** : vecteurs calculés à chaque couche pendant le Prefill/Decoding — ils servent au mécanisme d'[[00-lexique/attention|attention]].
- **Embeddings de recherche (RAG)** : produits par des modèles spécialisés (ex : `nomic-embed-text`, `sentence-transformers`) pour indexer des documents dans une [[00-lexique/vectordb|base vectorielle]].

## 💡 Pourquoi c'est important en IA on-premise
La qualité du RAG dépend fortement du modèle d'embedding choisi. Un mauvais modèle d'embedding donne de mauvais résultats de recherche, quelle que soit la qualité du LLM en aval.

## ⚠️ Pièges fréquents
- Les embeddings d'un LLM (internes) et les embeddings de recherche (RAG) sont des modèles distincts avec des usages différents.
- Choisir un modèle d'embedding entraîné uniquement en anglais pour un corpus français dégradent fortement la qualité.

## 📚 Pour comprendre en profondeur
1. [[01-fondations/journey-of-a-prompt|🧠 Le Voyage d'un Prompt]] *(Étape 2 : de token à vecteur)*
2. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] *(comment les embeddings de recherche alimentent le RAG)*

## 🔗 Voir aussi
- [[00-lexique/tokenisation|Tokenisation]]
- [[00-lexique/attention|Attention]]
- [[00-lexique/rag|RAG]]
- [[00-lexique/vectordb|Base de données vectorielle]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
