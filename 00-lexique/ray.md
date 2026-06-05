---
title: Ray
description: Framework de calcul distribué pour l'orchestration multi-nœuds de LLM en production.
aliases:
  - Ray Serve
  - Ray distributed
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Définition courte
Orchestrateur Python open-source pour déployer et scaler des applications IA sur plusieurs serveurs, souvent couplé à vLLM.

## 📖 Définition détaillée
Ray repose sur une architecture Maître/Travailleur sur des fermes de serveurs. Couplé à vLLM, il orchestre le [[00-lexique/tensor-parallelism|Tensor Parallelism]] (découpage des matrices au sein d'un nœud) et le [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] (découpage entre nœuds). Il permet aussi la **désagrégation Prefill/Decode** : un serveur dédié au calcul du prompt ([[00-lexique/prefill|Prefill]]), un autre dédié à la génération ([[00-lexique/decoding|Decoding]]).

Contraste avec [[00-lexique/exo|Exo]] : Ray vise la production d'entreprise (monitoring, tolérance aux pannes, routage intelligent) ; Exo vise le bureau/homelab.

## 💡 Pourquoi c'est important en IA on-premise
Standard de facto pour les datacenters souverains. La seule architecture qui garantit SLA, concurrence élevée et tolérance aux pannes sur un cluster GPU multi-nœuds.

## ⚠️ Pièges fréquents
- Complexe à administrer : nécessite réseau IA configuré (RoCE/InfiniBand), stockage partagé, compétences HPC.
- Inutile et surdimensionné pour les scénarios bureau ou PME.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/clustering-exo-and-ray|🌐 Clustering IA : Exo et Ray]] *(le chapitre complet)*
2. [[04-blueprints/scenario-d-datacenter|🏢 Scénario D : Datacenter]] *(blueprint Ray + vLLM + RoCE)*
3. [[00-lexique/tensor-parallelism|Tensor Parallelism]] *(la stratégie intra-nœud exploitée par Ray)*

## 🔗 Voir aussi
- [[00-lexique/exo|Exo]]
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/roce|RoCE]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
