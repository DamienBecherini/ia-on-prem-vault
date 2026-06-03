---
title: Prefill
description: Phase d'inférence qui traite le prompt initial en parallèle avant la génération mot à mot.
aliases:
  - Prompt ingestion
tags:
  - lexique
  - fondations
---

## 📝 Définition courte
Phase d'initialisation où le modèle "lit" et encode l'intégralité du prompt utilisateur avant de commencer à écrire sa réponse.

## 🔬 Ce n'est pas de la magie (Le mécanisme)
Le modèle ne lit pas du texte, il ingère une immense grille de nombres (les tokens convertis en embeddings). Pendant le Prefill, le modèle croise tous ces mots entre eux en parallèle (via le mécanisme d'Attention) pour comprendre le contexte, et sauvegarde les calculs intermédiaires en mémoire. Cela demande une force de calcul massive.

## 💡 Pourquoi c'est important en IA on-premise
Le prefill impacte directement la sensation de réactivité initiale, appelée le [[00-lexique/ttft|TTFT]] (Time To First Token). Si le prompt contient 100 pages de texte, un serveur mal dimensionné peut bloquer pendant plusieurs minutes avant d'afficher le premier mot.

## 📚 Pour comprendre en profondeur
*Vous ne saisissez pas bien la différence avec la génération ? Suivez ce chemin :*
1. [[01-fondations/le-voyage-d-un-prompt|🧠 Le Voyage d'un Prompt]] *(Le chapitre "C'est pas sorcier")*
2. [[01-fondations/kv-cache-et-contexte|💾 Le KV Cache]] *(Ce qui est stocké pendant cette phase)*
3. [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire]] *(L'impact matériel)*

## 🔗 Voir aussi
- [[00-lexique/inference|Inférence (LLM)]]
- [[00-lexique/decoding|Decoding]]
