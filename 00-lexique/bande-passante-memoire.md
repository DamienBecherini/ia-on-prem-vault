---
title: Bande passante mémoire
description: Débit auquel la mémoire alimente les unités de calcul.
aliases:
  - Memory bandwidth
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Quantité de données transférées par seconde entre mémoire et processeur/GPU, généralement en Go/s.

## 📖 Définition détaillée
Plus la bande passante est élevée, plus le modèle peut être "relu" rapidement pendant la génération.
Pour une estimation rapide en inférence locale : tokens/s théorique ~= Go/s mémoire divisés par taille du modèle en Go.

## 💡 Pourquoi c'est important en IA on-premise
C'est l'indicateur clé pour prévoir la fluidité en génération sur des LLM volumineux.

## ⚠️ Pièges fréquents
- Prendre la formule tokens/s comme valeur réelle garantie.
- Confondre bande passante mémoire locale et bande passante réseau.

## 🔗 Voir aussi
- [[00-lexique/memory-wall|Memory Wall]]
- [[00-lexique/tokens-par-seconde|Tokens par seconde]]
- [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire & Le "Memory Wall"]]
