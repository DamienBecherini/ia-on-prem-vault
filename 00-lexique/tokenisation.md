---
title: Tokenisation
description: Découpage d'un texte en unités numériques (tokens) avant traitement par un LLM.
aliases:
  - Tokenization
  - BPE
  - Byte Pair Encoding
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Transformation du texte en une suite d'identifiants numériques (tokens) que le modèle peut traiter, selon un dictionnaire appris à l'entraînement.

## 📖 Définition détaillée
Le texte est découpé en tokens (mots, sous-mots ou caractères) selon un algorithme appris pendant l'entraînement — le plus courant étant **BPE** (Byte Pair Encoding). Chaque token reçoit un numéro unique dans le vocabulaire du modèle. Ce numéro est ce que le modèle voit réellement.

Exemple : *"Où est Paris ?"* → `[4502, 381, 1920, 30]`

La taille du vocabulaire varie selon le modèle : Llama 3 utilise 128 256 tokens. Un mot rare peut être découpé en plusieurs sous-mots, ce qui augmente le nombre de tokens consommés.

## 💡 Pourquoi c'est important en IA on-premise
Le nombre de tokens d'un texte détermine directement la taille du [[00-lexique/kv-cache|KV Cache]] en [[00-lexique/vram|VRAM]] et le coût du [[00-lexique/prefill|Prefill]]. Un PDF de 200 pages peut représenter des centaines de milliers de tokens.

## ⚠️ Pièges fréquents
- Un même texte produit un nombre de tokens différent selon le tokenizer de chaque modèle — ne pas supposer que « 1 page ≈ 500 tokens » est universel.
- Le français est souvent plus verbeux que l'anglais en tokens (plus de sous-mots créés).

## 📚 Pour comprendre en profondeur
1. [[01-fondations/le-voyage-d-un-prompt|🧠 Le Voyage d'un Prompt]] *(Étape 1 : la tokenisation en action)*
2. [[01-fondations/kv-cache-et-contexte|💾 KV Cache & Contexte]] *(pourquoi le nombre de tokens pèse sur la VRAM)*

## 🔗 Voir aussi
- [[00-lexique/embedding|Embedding]]
- [[00-lexique/fenetre-de-contexte|Fenêtre de contexte]]
- [[00-lexique/prefill|Prefill]]
- [[00-lexique/glossaire-ia|📖 Glossaire IA]]
