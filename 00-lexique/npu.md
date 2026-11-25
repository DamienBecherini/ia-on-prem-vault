---
title: NPU
description: Neural Processing Unit — accélérateur spécialisé IA intégré aux SoC modernes, utile pour certaines tâches mais limité pour les grands LLM.
aliases:
  - Neural Processing Unit
tags:
  - lexique
  - materiel
last_modified: "2026-11-25"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Accélérateur matériel spécialisé dans les opérations de réseaux de neurones, intégré dans la plupart des SoC modernes (Apple Neural Engine, AMD XDNA, Qualcomm Hexagon, Intel NPU).

## 📖 Définition détaillée

Un NPU est optimisé pour des opérations matricielles à faible précision (INT8, INT4) avec une consommation énergétique très faible. Il excelle sur des tâches **légères et répétitives** : reconnaissance vocale, classification d'images, traduction courte, détection de mots-clés.

Pour les **grands LLM** (7B+), le NPU est généralement inutilisé par les moteurs d'inférence actuels pour deux raisons :

1. **Capacité mémoire insuffisante** : le NPU accède à la mémoire système via ses propres canaux, souvent plus limités que le GPU iGPU.
2. **Support logiciel lacunaire** : Ollama, llama.cpp et vLLM ne routent pas vers les NPU — ils utilisent Metal (Apple), ROCm (AMD) ou CUDA (NVIDIA).

| NPU | SoC | TOPS (INT8) | Utilisé pour LLM ? |
| :-- | :-- | :-- | :-- |
| Apple Neural Engine | M5 Max / M5 Ultra (16 / 32 cœurs) | non publié par Apple[^1] | Non : Ollama et MLX calculent sur le GPU Metal ; MLX, sous macOS 26.2+, aussi sur ses Neural Accelerators[^1] |
| AMD XDNA 2 | Gorgon Halo | ~50 TOPS | Non (ROCm/Vulkan → iGPU) |
| Qualcomm Hexagon | Snapdragon X Elite | ~45 TOPS | Partiellement (Copilot+ sur Windows) |

## 💡 Pourquoi c'est important en IA on-premise

Le NPU est pertinent pour des tâches **edge et embarquées** : transcription locale, filtrage de données, traitement de flux vidéo. Pour une appliance IA on-premise qui fait tourner un assistant LLM, le NPU est transparent — le GPU iGPU fait le travail.

## ⚠️ Pièges fréquents

- Acheter un PC "IA" en se basant sur les TOPS NPU pour de l'inférence LLM : c'est la bande passante mémoire du GPU qui compte, pas les TOPS NPU.
- Confondre les benchmarks NPU des constructeurs (tâches optimisées INT4) avec des performances LLM générales.

## 📚 Pour comprendre en profondeur

- [[02-materiel/apu-and-unified-memory|🧠 APU & Mémoire Unifiée]]
- [[01-fondations/memory-bandwidth|🏎️ La Bande Passante Mémoire]]

## 🔗 Voir aussi

- [[00-lexique/apu|APU]]
- [[00-lexique/unified-memory|Mémoire unifiée]]
- [[00-lexique/tokens-per-second|Tokens par seconde]]

[^1]: Apple Newsroom, *Apple unleashes M5, the next big leap in AI performance for Apple silicon* (Neural Engine 16 cœurs « plus rapide », un Neural Accelerator dans chaque cœur GPU, programmable via les Tensor APIs de Metal 4 ; aucun chiffre de TOPS), 15 octobre 2025 · Apple Support, *Mac Studio (M5 Max or M5 Ultra) — Tech Specs* (Neural Engine 16 cœurs sur M5 Max, 32 cœurs sur M5 Ultra, Neural Accelerators dans le GPU), consulté le 2026-11-25 · Apple Machine Learning Research, *Exploring LLMs with MLX and the Neural Accelerators in the M5 GPU* (MLX exploite les Neural Accelerators du GPU via TensorOps et Metal Performance Primitives ; macOS 26.2 ou plus récent requis), 19 novembre 2025. <https://www.apple.com/newsroom/2025/10/apple-unleashes-m5-the-next-big-leap-in-ai-performance-for-apple-silicon/> · <https://support.apple.com/en-us/128107> · <https://machinelearning.apple.com/research/exploring-llms-mlx-m5>
