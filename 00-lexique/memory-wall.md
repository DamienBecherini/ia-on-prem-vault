---
title: Memory Wall
description: Limite de performance causée par la mémoire plus que par le calcul.
aliases:
  - Mur de la mémoire
tags:
  - lexique
  - fondations
---


## Définition courte
Situation où le débit mémoire limite la performance plus que la puissance de calcul brute.

## Définition détaillée
Dans les charges IA modernes, surtout en génération auto-régressive, les unités de calcul peuvent attendre les données.
Le ratio calcul/transfert (intensité arithmétique) devient alors défavorable, ce qui dégrade le débit final.

## Pourquoi c'est important en IA on-premise
Le choix machine ne se fait pas uniquement sur les TFLOPS : bande passante mémoire, type de mémoire et interconnexions ont un impact direct sur l'expérience utilisateur.

## Pièges fréquents
- Acheter une machine sur la base des TFLOPS seuls.
- Ignorer la différence entre performance prefill et performance decoding.

## Voir aussi
- [[00-lexique/bande-passante-memoire|Bande passante mémoire]]
- [[00-lexique/decoding|Decoding]]
- [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire & Le "Memory Wall"]]
