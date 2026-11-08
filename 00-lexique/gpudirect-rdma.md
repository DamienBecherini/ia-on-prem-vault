---
title: GPUDirect RDMA
description: Mécanisme permettant aux GPU d'échanger des données directement avec des périphériques réseau sans copie CPU.
aliases:
  - GPUDirect
  - GPU Direct RDMA
tags:
  - lexique
  - fondations
last_modified: "2026-11-08"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Définition courte
Technologie NVIDIA qui permet à un GPU d'envoyer ou recevoir des données directement depuis/vers une carte réseau compatible, sans passer par la mémoire CPU (zero-copy).

## 📖 Définition détaillée
Dans un pipeline classique, un transfert GPU → réseau requiert : GPU VRAM → RAM CPU → carte réseau (deux copies). GPUDirect RDMA supprime la copie CPU en permettant à la carte réseau d'accéder directement à la VRAM du GPU via PCIe (DMA-BUF).

> [!info] Prérequis
> - GPU NVIDIA et carte réseau Mellanox/ConnectX compatibles.
> - InfiniBand ou RoCE configuré en mode lossless.
> - Support noyau : DMA-BUF (approche recommandée par NVIDIA quand noyau et pilote le permettent) ou, à défaut, le module historique `nvidia-peermem`.

Utilisé par NCCL pour les communications inter-nœuds dans les clusters distribués.

## 💡 Pourquoi c'est important en IA on-premise
Réduit la latence et la charge CPU lors des synchronisations inter-GPU sur InfiniBand ou RoCE. Critique pour maintenir le débit du [[00-lexique/tensor-parallelism|Tensor Parallelism]] et du [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] à grande échelle.

## ⚠️ Pièges fréquents
- Ne fonctionne pas si le GPU et la carte réseau sont sur des branches PCIe séparées avec une topologie NUMA défavorable.
- Sans DMA-BUF ni `nvidia-peermem` chargé, NCCL bascule silencieusement en mode copie CPU : vérifier dans les logs (`NCCL_DEBUG=INFO`) que le chemin `NET/IB/GDRDMA` est bien utilisé.

## 🔗 Voir aussi
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/nccl|NCCL]]
- [[00-lexique/infiniband|InfiniBand]]
- [[00-lexique/pcie|PCIe]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
