---
title: GPUDirect RDMA
description: Mécanisme permettant aux GPU d'échanger des données directement avec des périphériques réseau sans copie CPU.
aliases:
  - GPUDirect
  - GPU Direct RDMA
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Technologie NVIDIA qui permet à un GPU d'envoyer ou recevoir des données directement depuis/vers une carte réseau compatible, sans passer par la mémoire CPU (zero-copy).

## 📖 Définition détaillée
Dans un pipeline classique, un transfert GPU → réseau requiert : GPU VRAM → RAM CPU → carte réseau (deux copies). GPUDirect RDMA supprime la copie CPU en permettant à la carte réseau d'accéder directement à la VRAM du GPU via PCIe (DMA-BUF).

Prérequis :
- GPU NVIDIA et carte réseau Mellanox/ConnectX compatibles.
- InfiniBand ou RoCE configuré en mode lossless.
- Pilotes `nvidia-peermem` chargés.

Utilisé par NCCL pour les communications inter-nœuds dans les clusters distribués.

## 💡 Pourquoi c'est important en IA on-premise
Réduit la latence et la charge CPU lors des synchronisations inter-GPU sur InfiniBand ou RoCE. Critique pour maintenir le débit du [[00-lexique/tensor-parallelism|Tensor Parallelism]] et du [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] à grande échelle.

## ⚠️ Pièges fréquents
- Ne fonctionne pas si le GPU et la carte réseau sont sur des branches PCIe séparées avec une topologie NUMA défavorable.
- Nécessite `nvidia-peermem` : son absence silencieuse fait basculer NCCL en mode copie CPU sans avertissement clair.

## 🔗 Voir aussi
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/nccl|NCCL]]
- [[00-lexique/infiniband|InfiniBand]]
- [[00-lexique/pcie|PCIe]]
- [[00-lexique/glossaire-ia|📖 Glossaire IA]]
