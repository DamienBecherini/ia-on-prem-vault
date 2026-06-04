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


## 📝 Définition courte
Mémoire à très haut débit attachée au GPU (ex: GDDR7).

## 📖 Définition détaillée
La VRAM sert à stocker poids, activations, [[00-lexique/kv-cache|KV Cache]] et buffers de modèles exécutés sur GPU. Elle offre un débit nettement supérieur à la RAM système :

| Mémoire | Type | Débit typique |
| :-- | :-- | :-- |
| DDR5 (RAM PC) | SDRAM | ~100–200 Go/s |
| GDDR7 (RTX 50xx) | GDDR | ~1 700 Go/s |
| HBM3e (H100) | HBM | ~3 350 Go/s |

Le débit VRAM est le facteur limitant du [[00-lexique/decoding|Decoding]] : c'est le principe du [[00-lexique/memory-wall|Memory Wall]].

## 💡 Pourquoi c'est important en IA on-premise
La disponibilité et le débit VRAM déterminent quels modèles peuvent tourner vite sans offloading massif. Pour estimer la VRAM nécessaire : taille du modèle (Go) + ≈20 % pour le KV Cache et les activations.

## ⚠️ Pièges fréquents
- Ne regarder que la capacité VRAM et ignorer la bande passante mémoire.
- Sur un setup multi-GPU sans NVLink, la VRAM de chaque GPU n'est **pas** une pool unifiée : chaque GPU ne voit directement que sa propre VRAM.

## 🔗 Voir aussi
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/memory-wall|Memory Wall]]
- [[00-lexique/hbm|HBM]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/unified-memory|Mémoire unifiée]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]
