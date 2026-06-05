---
title: Tensor Parallelism
description: Stratégie de distribution d'un LLM par découpage des matrices mathématiques entre plusieurs GPU d'un même nœud.
aliases:
  - Parallélisme de tenseurs
  - TP
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
Les opérations matricielles d'une même couche sont découpées et calculées simultanément par plusieurs GPU — ils agissent comme un seul GPU géant.

## 📖 Définition détaillée
Contrairement au [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] (découpage *entre* couches), le découpage ici est *au sein* d'une même couche : chaque GPU calcule une partie de la matrice, puis les GPU synchronisent leurs résultats partiels via l'interconnexion.

Cette synchronisation est très fréquente (à chaque couche), donc elle nécessite une interconnexion extrêmement rapide : [[00-lexique/nvlink|NVLink]] ou NVSwitch dans les nœuds HGX. Sur PCIe seul, la bande passante insuffisante annule le bénéfice.

Exploité nativement par vLLM et TensorRT-LLM. La configuration `tp=8` sur un nœud HGX 8-GPU répartit le modèle sur les 8 puces.

## 💡 Pourquoi c'est important en IA on-premise
Réduit directement la latence de génération (tokens/s ×N) en production datacenter. Clé du Scénario D : permet aux 8 GPU d'un nœud HGX d'agir comme un seul accélérateur.

## ⚠️ Pièges fréquents
- Inefficace sur PCIe seul (bus trop lent pour la synchronisation inter-GPU).
- Nécessite que le nombre de têtes d'attention soit divisible par TP.
- Ne s'applique pas au-delà d'un nœud sans coupler avec du Pipeline Parallelism.

## 📚 Pour comprendre en profondeur
1. [[04-blueprints/scenario-d-datacenter|🏢 Scénario D : Datacenter]] *(Tensor Parallelism + NVLink + Ray en pratique)*
2. [[03-stack-logicielle/clustering-exo-and-ray|🌐 Clustering IA : Exo et Ray]] *(comparaison avec Pipeline Parallelism)*
3. [[02-materiel/stations-multi-gpu|🧩 Stations Multi-GPU]] *(architecture NVLink qui rend le TP possible)*

## 🔗 Voir aussi
- [[00-lexique/pipeline-parallelism|Pipeline Parallelism]]
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/ray|Ray]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
