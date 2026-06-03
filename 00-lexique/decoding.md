---
title: Decoding
description: Phase de génération auto-régressive token par token.
aliases:
  - Génération auto-régressive
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Phase où le modèle génère un token, puis recommence itérativement pour le token suivant.

## 📖 Définition détaillée
Le decoding est séquentiel et, à faible batch, souvent dominé par les transferts mémoire.
La bande passante mémoire et le KV cache deviennent déterminants.

## 💡 Pourquoi c'est important en IA on-premise
C'est cette phase qui gouverne le débit "tokens/s" observé dans la plupart des usages chat.

## 🔗 Voir aussi
- [[00-lexique/inference|Inférence (LLM)]]
- [[00-lexique/prefill|Prefill]]
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/tokens-par-seconde|Tokens par seconde]]
