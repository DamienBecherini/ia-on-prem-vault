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
- **NVLink est mort sur workstation depuis Ada Lovelace.** Les cartes RTX workstation (RTX 6000 Ada, RTX PRO 6000 Blackwell) et grand public (RTX 40xx, RTX 50xx) **n'ont plus de connecteur NVLink physique**. NVIDIA a supprimé les ponts NVLink externes de toutes ces gammes. Il est impossible de relier deux RTX PRO 6000 via NVLink : le connecteur n'existe pas. NVLink est aujourd'hui strictement réservé aux GPU SXM (A100, H100, H200, B200) dans des systèmes HGX/DGX.
- Deux GPU reliés en NVLink point-à-point n'atteignent pas les débits d'un fabric NVSwitch complet.
- Confondre "supporte CUDA" et "supporte NVLink" — une carte peut être compatible CUDA/vLLM sans avoir la moindre capacité NVLink.

## 🔗 Voir aussi
- [[00-lexique/nvswitch|NVSwitch]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[00-lexique/pcie|PCIe]]
- [[00-lexique/hbm|HBM]]
