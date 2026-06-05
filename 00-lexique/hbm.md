---
title: HBM
description: Mémoire empilée à très haute bande passante, utilisée sur les accélérateurs IA professionnels.
aliases:
  - High Bandwidth Memory
tags:
  - lexique
  - materiel
last_modified: "2026-06-04"
---

## 📝 Définition courte

Technologie mémoire qui empile plusieurs puces DRAM en vertical pour atteindre des bandes passantes très supérieures à la GDDR grand public — réservée aux accélérateurs professionnels (H100, MI300X, TPU).

## 📖 Définition détaillée

Là où une RTX 4090 grand public offre ~1 008 Go/s via GDDR6X, une puce HBM3 atteint des bandes passantes de :

| Puce | Mémoire | Bande passante |
| :-- | :-- | :-- |
| NVIDIA H100 SXM5 | HBM3 80 Go | **3,35 To/s** |
| AMD MI300X | HBM3 192 Go | **5,3 To/s** |
| Apple M3 Ultra | LPDDR5X 192 Go | 819 Go/s |
| RTX 4090 (grand public) | GDDR6X 24 Go | ~1 008 Go/s |

Cette différence explique pourquoi le [[00-lexique/memory-wall|Memory Wall]] est bien moins contraignant sur un H100 : il peut saturer le débit de génération d'un modèle 70B sans être memory-bound au même degré qu'une carte de workstation.

La HBM est empilée directement sur le substrat de la puce via des interconnexions TSV (Through-Silicon Via), ce qui raccourcit le chemin électrique et réduit la latence.

## 💡 Pourquoi c'est important en IA on-premise

La HBM est présente dans les puces datacenter — hors de portée budgétaire on-premise sauf au [[04-blueprints/scenario-d-datacenter|Scénario D]]. Comprendre ses chiffres permet de calibrer ses attentes : un H100 loué 3 €/h via API n'est pas comparable à une RTX 4090 à 2 000 €, même si les deux "font de l'IA".

## ⚠️ Pièges fréquents

- Confondre HBM et VRAM GDDR dans les comparatifs : les ordres de grandeur de bande passante sont totalement différents.
- Croire qu'une puce HBM est "juste une meilleure GDDR" : c'est une technologie d'empilement 3D avec des contraintes thermiques et de coût radicalement différentes.

## 📚 Pour comprendre en profondeur

- [[01-fondations/memory-bandwidth|🏎️ La Bande Passante Mémoire & Le Memory Wall]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]

## 🔗 Voir aussi

- [[00-lexique/vram|VRAM]]
- [[00-lexique/memory-wall|Memory Wall]]
- [[00-lexique/memory-bandwidth|Bande passante mémoire]]
