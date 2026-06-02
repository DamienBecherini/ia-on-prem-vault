---
title: PCIe
description: Bus d'interconnexion haut débit entre composants.
aliases:
  - PCI Express
  - Peripheral Component Interconnect Express
tags:
  - lexique
  - materiel
---


## Définition courte
Bus standard reliant CPU, GPU, SSD et autres périphériques.

## Définition détaillée
En IA locale, PCIe transporte les données entre RAM système et GPU discret.
Même en Gen5 x16, ce lien peut devenir le goulot lorsqu'il faut déplacer souvent des blocs volumineux.

## Pourquoi c'est important en IA on-premise
Le coût des transferts PCIe influence fortement l'offloading et les performances multi-GPU.

## Voir aussi
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[00-lexique/memoire-unifiee|Mémoire unifiée]]
