---
title: TensorRT-LLM
description: SDK NVIDIA de compilation et d'inférence ultra-optimisée pour GPU datacenter.
aliases:
  - TensorRT LLM
  - TRT-LLM
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
SDK officiel NVIDIA qui compile un LLM en un moteur propriétaire ultra-optimisé pour tirer le maximum physique des GPU datacenter (H100, B200).

## 📖 Définition détaillée
TensorRT-LLM fonctionne en **Ahead-of-Time (AoT)** : avant de servir des requêtes, le modèle est compilé en un « engine » spécifique à la génération physique du GPU cible. Ce moteur intègre des optimisations kernel très bas niveau (Flash-Decoding, FP8/FP4 natif, fusion d'opérations).

Sur les puces Blackwell (B200, RTX 5090), TensorRT-LLM supporte nativement le format **FP4**, divisant par deux l'empreinte [[00-lexique/vram|VRAM]] par rapport au FP8.

Contraste avec vLLM : TensorRT-LLM est plus performant au plafond mais bien plus complexe à déployer (compilation longue, GPU-spécifique, courbe d'apprentissage ardue).

## 💡 Pourquoi c'est important en IA on-premise
Incontournable pour amortir le coût des accélérateurs professionnels en datacenter. La référence du Scénario D.

## ⚠️ Pièges fréquents
- La compilation AoT est lourde et strictement liée à la génération du GPU cible : un engine H100 ne tourne pas sur A100.
- Pas adapté aux postes de travail ou aux Mac.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence]] *(comparatif llama.cpp / vLLM / TensorRT-LLM)*
2. [[04-blueprints/scenario-d-datacenter|🏢 Scénario D : Datacenter]] *(TensorRT-LLM en production)*

## 🔗 Voir aussi
- [[00-lexique/vram|VRAM]]
- [[00-lexique/quantification|Quantification]]
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
