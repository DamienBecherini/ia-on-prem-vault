---
title: APU
description: Puce combinant CPU, GPU et NPU sur un même SoC, avec mémoire unifiée partagée.
aliases:
  - Accelerated Processing Unit
tags:
  - lexique
  - materiel
---

## 📝 Définition courte

Puce qui intègre CPU, GPU (et souvent NPU) sur un même die ou package, partageant un pool mémoire commun sans copie PCIe.

## 📖 Définition détaillée

L'APU se distingue d'un PC classique (CPU + GPU discret) par l'absence de séparation physique entre la mémoire processeur et la mémoire graphique. CPU et GPU adressent le même pool LPDDR5X.

Les deux plateformes APU dominantes pour l'inférence LLM en 2026 :

| Plateforme | Exemple | VRAM allouable | Bande passante |
| :-- | :-- | :-- | :-- |
| Apple Silicon | Mac Studio M3 Ultra | ~160 Go (sur 192 Go) | 819 Go/s |
| AMD Gorgon Halo | Ryzen AI Max+ PRO 495 | 160 Go (BIOS, sur 192 Go) | ~273 Go/s |

Ces chiffres permettent de faire tourner un modèle **70B quantifié** (~40 Go) avec une grande fenêtre de contexte sur une station silencieuse de bureau — ce qui est impossible avec un GPU grand public même haut de gamme (24 Go de VRAM max en grand public).

## 💡 Pourquoi c'est important en IA on-premise

L'APU est la plateforme de référence pour le [[04-blueprints/scenario-b-sme-appliance|Scénario B (Appliance PME)]] : autonome, silencieuse, consommant moins de 60 W en charge légère, elle héberge un assistant local pour une équipe de 5 à 20 personnes.

## ⚠️ Pièges fréquents

- La mémoire LPDDR5X est **soudée** : impossible d'upgrader après achat. Prévoyez grand dès le départ.
- Bande passante partagée CPU + GPU : plus l'OS et les applications chargent la RAM, moins le GPU en bénéficie pendant l'inférence.
- Les NPU intégrés (Apple Neural Engine, AMD XDNA) **ne sont pas utilisés** par les moteurs LLM actuels (Ollama, llama.cpp, vLLM) — l'inférence reste sur le GPU iGPU.

## 📚 Pour comprendre en profondeur

- [[02-materiel/apu-and-unified-memory|🧠 APU & Mémoire Unifiée — comparatif complet]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]

## 🔗 Voir aussi

- [[00-lexique/unified-memory|Mémoire unifiée]]
- [[00-lexique/npu|NPU]]
- [[00-lexique/vram|VRAM]]
