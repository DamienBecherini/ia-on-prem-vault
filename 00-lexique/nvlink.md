---
title: NVLink
description: Interconnexion haut débit entre GPU NVIDIA.
aliases:
  - NVIDIA NVLink
tags:
  - lexique
  - materiel
---


## 📝 Définition courte
Lien matériel dédié pour accélérer les échanges entre GPU NVIDIA compatibles.

## 📖 Définition détaillée
NVLink est le protocole et la technologie de câblage qui relie les GPU NVIDIA à très haute vitesse, en contournant le bus PCIe. Les débits varient selon la génération :

| Version | Bande passante bidirectionnelle totale | GPU compatibles |
| :-- | :-- | :-- |
| NVLink 3 (A100) | 600 Go/s | A100 SXM |
| NVLink 4 (H100) | 900 Go/s | H100 SXM |
| NVLink 5 (B200) | 1 800 Go/s | B200 (avec NVSwitch) |

**NVLink vs [[00-lexique/nvswitch|NVSwitch]]** : NVLink est le lien point-à-point entre deux GPU ; NVSwitch est la puce qui forme un fabric non bloquant entre tous les GPU d'un nœud HGX.

## 💡 Pourquoi c'est important en IA on-premise
Le débit NVLink est la condition sine qua non d'un [[00-lexique/tensor-parallelism|Tensor Parallelism]] efficace. Sans NVLink, les échanges inter-GPU via PCIe (~64 Go/s) deviennent le goulot d'étranglement.

## ⚠️ Pièges fréquents
- NVLink n'est pas disponible sur les GPU grand public (RTX 40xx, RTX 50xx) — réservé aux gammes SXM et HGX.
- Deux GPU reliés en NVLink point-à-point n'atteignent pas les débits d'un fabric NVSwitch complet.

## 🔗 Voir aussi
- [[00-lexique/nvswitch|NVSwitch]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[00-lexique/pcie|PCIe]]
- [[00-lexique/hbm|HBM]]
