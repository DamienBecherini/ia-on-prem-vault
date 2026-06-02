---
title: VRAM
description: Mémoire vidéo dédiée au GPU.
aliases:
  - Video RAM
  - Mémoire vidéo
tags:
  - lexique
  - materiel
---


## Définition courte
Mémoire à très haut débit attachée au GPU (ex: GDDR7).

## Définition détaillée
La VRAM sert à stocker poids, activations et cache de modèles exécutés sur GPU.
Elle offre un débit bien plus élevé que la RAM système, au prix d'une capacité souvent plus limitée sur le grand public.

## Pourquoi c'est important en IA on-premise
La disponibilité et le débit VRAM déterminent quels modèles peuvent tourner vite sans offloading massif.

## Pièges fréquents
- Ne regarder que la capacité VRAM et ignorer la bande passante.
- Confondre VRAM totale de plusieurs GPU avec VRAM directement mutualisable sans contrainte.

## Voir aussi
- [[00-lexique/ram|RAM]]
- [[00-lexique/memoire-unifiee|Mémoire unifiée]]
- [[01-fondations/memoire-unifiee-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]
