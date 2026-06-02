---
title: RAM
description: Mémoire vive système.
aliases:
  - Random Access Memory
  - Mémoire vive
tags:
  - lexique
  - materiel
---


## Définition courte
Mémoire principale de la machine, utilisée par le CPU et parfois comme extension pour l'inférence.

## Définition détaillée
En IA locale, la RAM peut héberger tout ou partie du modèle si la VRAM est insuffisante.
Son principal atout est la capacité et le coût/Go ; sa limite est le débit comparé à la VRAM.

## Pourquoi c'est important en IA on-premise
Elle conditionne la possibilité de charger de gros modèles à coût réduit, mais avec des performances plus modestes.

## Pièges fréquents
- Penser que beaucoup de RAM compense toujours un manque de VRAM.
- Ignorer le rôle du bus (PCIe) quand des données doivent circuler entre RAM et GPU.

## Voir aussi
- [[00-lexique/vram|VRAM]]
- [[00-lexique/offloading|Offloading]]
- [[01-fondations/memoire-unifiee-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]
