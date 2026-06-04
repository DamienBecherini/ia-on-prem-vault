---
title: LLM
description: Large Language Model.
aliases:
  - Large Language Model
  - Grand modèle de langage
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Modèle IA entraîné sur de très grands corpus textuels, capable de comprendre et générer du texte.

## 📖 Définition détaillée
Les LLM modernes reposent majoritairement sur l'architecture Transformer.
Une fois entraînés, ils servent surtout à l'[[00-lexique/inference|inférence]] : génération de texte à la demande à partir d'un prompt.
Leur performance pratique en local dépend autant du hardware mémoire que de la taille/quantification du modèle.

## 💡 Pourquoi c'est important en IA on-premise
C'est le composant central du stack : tout le dimensionnement (RAM/VRAM, débit, latence) en découle, surtout pour l'inférence locale — rarement pour un entraînement from scratch.

## ⚠️ Pièges fréquents
- Penser qu'un "plus gros modèle" est toujours meilleur pour tous les usages.
- Oublier que les performances dépendent autant de la mémoire machine que du modèle.

## 📚 Pour comprendre en profondeur
*Vous voulez voir ce qu'un LLM fait concrètement quand vous lui parlez ?*
1. [[01-fondations/journey-of-a-prompt|🧠 Le Voyage d'un Prompt]] *(tokenisation, prefill, decoding — le cycle complet, pas à pas)*
2. [[00-lexique/inference|Inférence (LLM)]] *(l'utilisation quotidienne d'un LLM déjà entraîné)*
3. [[01-fondations/quantization-4bit-8bit|🗜️ Quantification 4-bit & 8-bit]] *(comment réduire la taille d'un modèle pour qu'il tienne en mémoire)*

## 🔗 Voir aussi
- [[00-lexique/inference|Inférence (LLM)]]
- [[00-lexique/quantification|Quantification]]
- [[00-lexique/memory-wall|Memory Wall]]
- [[00-lexique/rag|RAG]]
