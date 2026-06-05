---
title: Quantification
description: Réduction de précision numérique des poids d'un LLM pour diminuer l'empreinte mémoire et accélérer l'inférence.
aliases:
  - Quantization
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---

## 📝 Définition courte

Technique qui réduit la précision numérique des poids d'un modèle (ex : FP16 → INT8 → Q4) pour diminuer l'empreinte VRAM et, dans certains cas, accélérer l'inférence.

## 📖 Définition détaillée

Un modèle LLM stocke ses paramètres en virgule flottante. La précision native d'entraînement est BF16 ou FP16 (2 octets par paramètre). La quantification compresse ces valeurs vers des formats moins précis :

| Format | Octets/paramètre | Empreinte 70B | Perte qualité |
| :-- | :-- | :-- | :-- |
| BF16 / FP16 | 2,0 | ~140 Go | Référence |
| INT8 / Q8 | 1,0 | ~70 Go | Très faible |
| Q4_K_M | ~0,5 | ~40 Go | Faible à modérée |
| Q2 | ~0,25 | ~18 Go | Significative |

Trois grandes familles de méthodes :

- **GGUF / llama.cpp** : format portable pour Ollama et les postes de travail. Inclut des variantes Q2 à Q8, avec des variantes "K" (K-means) qui préservent mieux la qualité.
- **AWQ / GPTQ** : quantification activations-aware, optimisée pour vLLM en production GPU. Meilleure préservation de qualité que GGUF Q4 à empreinte égale.
- **FP8 / FP4** : précisions flottantes basse résolution supportées nativement par les GPU NVIDIA Hopper (H100) et Blackwell (H200, B200) — surtout pertinentes en datacenter.

## 💡 Pourquoi c'est important en IA on-premise

La quantification est le levier numéro un pour faire tenir un grand modèle dans votre matériel. Un modèle 70B inaccessible en BF16 (140 Go) devient exploitable en Q4_K_M (~40 Go) sur un APU avec 128 Go de mémoire unifiée.

## ⚠️ Pièges fréquents

- Confondre l'empreinte des **poids** (fixe) et celle du **KV Cache** (dynamique, dépend du contexte). Un modèle Q4 peut quand même provoquer un OOM si le contexte est long.
- Croire que Q4 est toujours suffisant : sur des tâches critiques (code editing, extraction médicale), Q4 peut dégrader la fiabilité de façon mesurable. Testez avec votre golden dataset.
- Comparer des scores de benchmarks entre un modèle BF16 et un modèle Q4 comme s'ils étaient identiques.

## 📚 Pour comprendre en profondeur

- [[01-fondations/quantization-4bit-8bit|🗜️ La Quantification 4-bit & 8-bit]] — mécanisme mathématique, formule, arbitrage perplexité/VRAM

## 🔗 Voir aussi

- [[00-lexique/quantification-q4|Quantification Q4_K_M]] — le format pratique le plus courant, ses usages et limites
- [[00-lexique/vram|VRAM]]
- [[00-lexique/gguf|GGUF]]
