---
title: NVSwitch
description: Commutateur NVIDIA qui connecte plusieurs GPU en un fabric NVLink totalement non bloquant à l'intérieur d'un nœud.
aliases:
  - NV Switch
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
Puce NVIDIA qui relie tous les GPU d'un nœud HGX entre eux via [[00-lexique/nvlink|NVLink]], permettant une bande passante totale uniforme entre chaque paire de GPU.

## 📖 Définition détaillée
Dans une station multi-GPU classique sur PCIe, les GPU communiquent via le bus CPU — lent et asymétrique. NVSwitch remplace cette topologie par un fabric non bloquant : chaque GPU peut envoyer et recevoir des données à pleine vitesse NVLink simultanément vers tous les autres.

Un nœud HGX B200 (8 GPU) embarque plusieurs NVSwitch qui permettent une bande passante agrégée de **1 800 Go/s** bidirectionnelle entre les 8 puces — condition nécessaire au [[00-lexique/tensor-parallelism|Tensor Parallelism]] efficace.

**NVLink vs NVSwitch :** NVLink est le protocole/câble ; NVSwitch est la puce de routage qui forme le fabric complet.

## 💡 Pourquoi c'est important en IA on-premise
NVSwitch est la frontière architecturale entre une station multi-GPU de bureau (PCIe, communication lente) et un vrai nœud datacenter (HGX, fabric NVLink uniforme). C'est ce qui rend le Scénario D possible.

## ⚠️ Pièges fréquents
- Deux GPU reliés par NVLink sans NVSwitch (topologie point-à-point) n'ont pas la même bande passante que dans un fabric NVSwitch complet.
- Absent de toutes les cartes grand public — réservé aux gammes professionnelles HGX/DGX.

## 🔗 Voir aussi
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[04-blueprints/scenario-d-datacenter|🏢 Scénario D : Datacenter]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
