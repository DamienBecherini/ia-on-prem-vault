---
title: RDMA
description: Accès mémoire distant direct sans copie CPU classique.
aliases:
  - Remote Direct Memory Access
tags:
  - lexique
  - reseau
---


## 📝 Définition courte
Technique réseau permettant d'écrire/lire en mémoire distante avec faible surcharge CPU.

## 📖 Définition détaillée
Dans un transfert réseau classique (TCP/IP), les données passent par le CPU (copie en espace user → kernel → carte réseau). RDMA court-circuite ce chemin : la carte réseau accède directement à la mémoire de l'application, avec une latence de ~1–2 µs et une charge CPU quasi nulle.

Deux implémentations principales :
- **[[00-lexique/infiniband|InfiniBand]]** : fabric dédié, lossless natif, standard HPC/IA haute performance.
- **[[00-lexique/roce|RoCE]]** : RDMA sur Ethernet, moins coûteux mais nécessite une configuration lossless (PFC/ECN).

Avec **[[00-lexique/gpudirect-rdma|GPUDirect RDMA]]**, le DMA va encore plus loin : la carte réseau accède directement à la VRAM du GPU, sans passer par la RAM CPU.

## 💡 Pourquoi c'est important en IA on-premise
Dès qu'on distribue des charges IA sur plusieurs nœuds, RDMA est le facteur différenciant entre un cluster efficace et un cluster limité par les latences réseau.

## ⚠️ Pièges fréquents
- Comparer RDMA et TCP/IP sans considérer la charge CPU et la latence microseconde.
- Surévaluer l'impact d'RDMA sur de petits workloads qui sont surtout compute-bound.

## 🔗 Voir aussi
- [[00-lexique/gpudirect-rdma|GPUDirect RDMA]]
- [[00-lexique/roce|RoCE]]
- [[00-lexique/infiniband|InfiniBand]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire & Le "Memory Wall"]]
