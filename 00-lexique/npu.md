---
title: NPU
description: Neural Processing Unit — accélérateur spécialisé IA intégré aux SoC modernes, utile pour certaines tâches mais limité pour les grands LLM.
aliases:
  - Neural Processing Unit
tags:
  - lexique
  - materiel
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
| Apple Neural Engine | M4 Max | ~38 TOPS | Non (Ollama/MLX → GPU Metal) |
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
