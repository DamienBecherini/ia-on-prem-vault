---
title: PCIe
description: Bus d'interconnexion haut débit entre composants.
aliases:
  - PCI Express
  - Peripheral Component Interconnect Express
tags:
  - lexique
  - materiel
last_modified: "2026-06-04"
---


## 📝 Définition courte
Bus standard reliant CPU, GPU, SSD et autres périphériques.

## 📖 Définition détaillée
En IA locale, PCIe transporte les données entre RAM système et GPU discret (offloading) et entre GPU dans les setups multi-GPU sans NVLink.

Débits maximaux selon la génération :

| Génération | Débit unidirectionnel x16 | Bidirectionnel x16 |
| :-- | :-- | :-- |
| PCIe 4.0 | ~32 Go/s | ~64 Go/s |
| PCIe 5.0 | ~64 Go/s | ~128 Go/s |
| PCIe 6.0 | ~128 Go/s | ~256 Go/s |

À titre de comparaison, NVLink 4 (H100) offre 900 Go/s — soit ~14× plus qu'un lien PCIe 5.0 x16.

## 💡 Pourquoi c'est important en IA on-premise
Le coût des transferts PCIe influence fortement l'offloading CPU→GPU et est le facteur limitant du Tensor Parallelism sur des setups bureau sans NVLink.

## ⚠️ Pièges fréquents
- Le débit PCIe théorique est divisé par le nombre de GPU partagés sur le même contrôleur CPU.
- PCIe 5.0 x8 (config courante sur cartes mères mid-range) offre seulement autant que PCIe 4.0 x16.

## 🔗 Voir aussi
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[00-lexique/unified-memory|Mémoire unifiée]]
