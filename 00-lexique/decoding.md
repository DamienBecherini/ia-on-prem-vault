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
Phase où le modèle génère sa réponse de manière séquentielle, en prédisant un token (mot), puis en l'ajoutant au contexte pour prédire le suivant, et ainsi de suite.

## 🔬 Ce n'est pas de la magie (Le mécanisme)
Une fois que le prompt initial a été lu (la phase de [[00-lexique/prefill|Prefill]]), le modèle passe en boucle de génération. Pour deviner le mot suivant, il n'a pas besoin de recalculer tout l'historique : il relit les états passés stockés dans le [[00-lexique/kv-cache|KV Cache]]. Cependant, comme il génère un seul mot à la fois, le processeur passe son temps à attendre que la mémoire (VRAM) lui envoie les données du cache et du modèle.

## 💡 Pourquoi c'est important en IA on-premise
C'est cette phase qui gouverne le débit "tokens/s" observé par vos utilisateurs. C'est ici que l'on heurte le [[00-lexique/memory-wall|Memory Wall]] : ce n'est pas la puissance de la puce qui limite la vitesse, mais la largeur des tuyaux mémoires.

## 📚 Pour comprendre en profondeur
*Vous ne saisissez pas bien pourquoi c'est lent ? Suivez ce chemin :*
1. [[01-fondations/le-voyage-d-un-prompt|🧠 Le Voyage d'un Prompt]] *(Le chapitre "C'est pas sorcier")*
2. [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire & Le Memory Wall]] *(L'explication physique)*
3. [[00-lexique/tokens-par-seconde|Tokens par seconde]] *(La métrique clé)*

## 🔗 Voir aussi
- [[00-lexique/inference|Inférence (LLM)]]
- [[00-lexique/kv-cache|KV Cache]]