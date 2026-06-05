---
title: NCCL
description: Bibliothèque NVIDIA de communication collective optimisée pour les transferts GPU-à-GPU à grande échelle.
aliases:
  - NVIDIA Collective Communications Library
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Définition courte
Bibliothèque logicielle NVIDIA qui gère les opérations collectives (AllReduce, AllGather, Broadcast) entre GPU, en exploitant NVLink, InfiniBand ou PCIe selon la topologie disponible.

## 📖 Définition détaillée
NCCL (prononcé « nickel ») est la couche de communication sur laquelle s'appuient PyTorch, vLLM, TensorRT-LLM et Ray pour synchroniser les gradients ou les activations entre GPU.

Opérations principales :
- **AllReduce** : somme/moyenne d'un tenseur sur tous les GPU (utilisé en entraînement distribué et Tensor Parallelism).
- **AllGather** : chaque GPU collecte les fragments des autres.
- **Broadcast** : diffuse un tenseur d'un GPU maître vers tous les autres.

NCCL détecte automatiquement la topologie (NVLink > InfiniBand > PCIe > Ethernet) et optimise les chemins de communication en conséquence.

## 💡 Pourquoi c'est important en IA on-premise
Couche invisible mais critique : si NCCL n'est pas configuré pour exploiter NVLink ou InfiniBand, toutes les communications inter-GPU transitent par PCIe et dégradent fortement le débit du [[00-lexique/tensor-parallelism|Tensor Parallelism]].

## ⚠️ Pièges fréquents
- La variable d'environnement `NCCL_P2P_DISABLE=1` désactive les transferts peer-to-peer directs — une erreur de configuration fréquente qui peut diviser les performances par 5.
- Les logs NCCL révèlent la topologie détectée : toujours vérifier que NVLink est bien sélectionné sur les nœuds HGX.

## 🔗 Voir aussi
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
