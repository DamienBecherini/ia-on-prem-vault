---
title: Multi-GPU
description: Utilisation conjointe de plusieurs GPU.
aliases:
  - Multi GPU
tags:
  - lexique
  - materiel
---


## 📝 Définition courte
Architecture utilisant plusieurs cartes GPU dans une même machine ou un cluster.

## 📖 Définition détaillée
Le multi-GPU sert à augmenter la capacité mémoire totale, le débit, ou les deux. Les gains dépendent directement de l'interconnexion entre GPU :

| Topologie | Bande passante inter-GPU | Usage typique |
| :-- | :-- | :-- |
| PCIe x16 | ~64 Go/s (Gen5) | assemblages bureau, Exo |
| NVLink (H100) | 900 Go/s | nœuds pro/datacenter |
| NVLink + NVSwitch (HGX) | 1 800 Go/s fabric complet | clusters HGX B200 |

Deux stratégies de parallélisme utilisent le multi-GPU : le [[00-lexique/tensor-parallelism|Tensor Parallelism]] (distribue les calculs dans une couche) et le [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] (distribue les couches entre nœuds).

## 💡 Pourquoi c'est important en IA on-premise
Indispensable pour les modèles dépassant la VRAM d'un seul GPU (ex. Llama 3.1 405B en FP8 = ~200 Go). La vitesse de l'interconnexion est souvent plus limitante que la puissance de calcul brute.

## ⚠️ Pièges fréquents
- La VRAM totale de plusieurs GPU n'est pas une pool unifiée sur PCIe : chaque GPU n'accède aux poids de l'autre qu'en passant par le bus, avec latence.
- Sur PCIe, le Tensor Parallelism est peu efficient : préférer le Pipeline Parallelism pour réduire la fréquence des échanges.

## 🔗 Voir aussi
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/nvswitch|NVSwitch]]
- [[00-lexique/pcie|PCIe]]
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/pipeline-parallelism|Pipeline Parallelism]]
- [[00-lexique/rdma|RDMA]]
