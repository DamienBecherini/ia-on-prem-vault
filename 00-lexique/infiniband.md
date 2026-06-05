---
title: InfiniBand
description: Fabric réseau dédié hautes performances pour les clusters GPU, standard HPC et datacenter IA.
aliases:
  - IB
  - HDR InfiniBand
  - NDR InfiniBand
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Définition courte
Réseau dédié à très faible latence et très haute bande passante (jusqu'à 400–800 Gb/s par lien) conçu pour le calcul haute performance et les clusters GPU IA.

## 📖 Définition détaillée
InfiniBand est à la fois un protocole et un fabric physique (câbles, switches, cartes HCA). Il supporte nativement le [[00-lexique/rdma|RDMA]] — les GPU peuvent s'envoyer des données directement sans passer par le CPU.

Générations : HDR (200 Gb/s), NDR (400 Gb/s), XDR (800 Gb/s par port).

**InfiniBand vs [[00-lexique/roce|RoCE]] :**
- InfiniBand : fabric dédié, lossless natif, latence la plus basse (~1 µs), coût élevé.
- RoCE : RDMA sur Ethernet standard, moins coûteux mais nécessite une configuration réseau stricte (PFC/ECN) pour éviter les pertes de paquets.

## 💡 Pourquoi c'est important en IA on-premise
Standard de facto pour les clusters GPU de production (datacenters IA, HPC). Condition pour le [[00-lexique/tensor-parallelism|Tensor Parallelism]] et [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] inter-nœuds à plein débit.

## ⚠️ Pièges fréquents
- Nécessite du matériel dédié et des compétences réseau HPC spécifiques.
- Infrastructure propriétaire (essentiellement NVIDIA/Mellanox) : migration vers Ethernet difficile.
- Le coût total (switchs, câbles, cartes HCA) peut dépasser le coût des serveurs GPU eux-mêmes.

## 🔗 Voir aussi
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/roce|RoCE]]
- [[00-lexique/gpudirect-rdma|GPUDirect RDMA]]
- [[04-blueprints/scenario-d-datacenter|🏢 Scénario D : Datacenter]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
