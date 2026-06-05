---
title: Attention (mécanisme)
description: Mécanisme central du Transformer qui permet à chaque token de pondérer l'importance des autres tokens du contexte.
aliases:
  - Self-attention
  - Mécanisme d'attention
  - Multi-Head Attention
  - MHA
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Définition courte
Calcul qui détermine l'importance relative de chaque token du contexte pour produire la représentation d'un token donné — le cœur du Transformer.

## 📖 Définition détaillée
Pour chaque token, le modèle calcule trois vecteurs à partir de son [[00-lexique/embedding|embedding]] :
- **Query (Q)** : « que cherche ce token ? »
- **Key (K)** : « que contient chaque autre token ? »
- **Value (V)** : « quelle information extraire de chaque autre token ? »

Le score d'attention entre deux tokens est le produit scalaire Q·K. Ces scores pondèrent les Values pour produire la représentation finale du token. C'est ce calcul qui est répété dans toutes les couches du Transformer.

**Lien avec le KV Cache** : pendant le [[00-lexique/prefill|Prefill]], les vecteurs K et V de chaque token sont calculés et sauvegardés dans le [[00-lexique/kv-cache|KV Cache]]. En [[00-lexique/decoding|Decoding]], le modèle les relira sans les recalculer.

Le coût du calcul d'attention est quadratique O(n²) en longueur de contexte : doubler le prompt multiplie par 4 le coût du prefill.

## 💡 Pourquoi c'est important en IA on-premise
Le coût quadratique du Prefill explique pourquoi les prompts très longs (100K+ tokens) saturent la VRAM et font exploser le TTFT — et pourquoi des optimisations comme Flash Attention ou GQA existent.

## ⚠️ Pièges fréquents
- La complexité O(n²) s'applique au prefill. En decoding, le KV Cache ramène le coût à O(n) par token généré.
- GQA (Grouped-Query Attention, utilisé dans Llama 3+) réduit la taille du KV Cache en partageant les têtes K/V entre plusieurs têtes Q — sans supprimer le mécanisme d'attention.

## 📚 Pour comprendre en profondeur
1. [[01-fondations/journey-of-a-prompt|🧠 Le Voyage d'un Prompt]] *(Étape 3 : le Prefill et l'attention en action)*
2. [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]] *(ce que l'attention stocke et pourquoi ça pèse sur la VRAM)*

## 🔗 Voir aussi
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/prefill|Prefill]]
- [[00-lexique/embedding|Embedding]]
- [[00-lexique/context-window|Fenêtre de contexte]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
