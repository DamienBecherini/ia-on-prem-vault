---
title: Quantification
description: Réduction de précision numérique des poids d'un LLM pour diminuer l'empreinte mémoire et accélérer l'inférence.
aliases:
  - Quantization
tags:
  - lexique
  - fondations
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
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

- **GGUF / llama.cpp** : format portable pour Ollama et les postes de travail. Inclut des variantes Q2 à Q8 ; les variantes "K" (K-quants) découpent les poids en super-blocs de 256 valeurs avec plusieurs échelles et gardent les tenseurs sensibles en précision plus haute, ce qui préserve mieux la qualité à taille égale[^1].
- **AWQ / GPTQ** : quantification activations-aware, optimisée pour vLLM en production GPU. Meilleure préservation de qualité que GGUF Q4 à empreinte égale.
- **FP8 / FP4** : précisions flottantes basse résolution. FP8 est natif sur Hopper (H100, H200) et Blackwell ; FP4 (NVFP4, MXFP4) est natif sur Blackwell uniquement (B200, RTX 50, RTX PRO 6000, DGX Spark). Depuis 2026, des éditeurs livrent directement des poids FP4 (gpt-oss et Kimi K3 en MXFP4 ; Nemotron 3.5 Lightning en NVFP4, ≈ 22 Go), y compris pour des GPU de station[^2].

Quatrième tendance en 2026 : la **quantification à l'entraînement** (QAT). Kimi K3 est entraîné en MXFP4 dès la phase SFT, et NVIDIA publie Nemotron 3.5 Lightning en NVFP4 comme « chemin recommandé pour le déploiement », les poids BF16 étant réservés au post-entraînement. Le checkpoint 4-bit de l'éditeur devient alors la version canonique, et requantifier soi-même n'apporte rien[^2].

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

[^1]: J. Wang et al., *Which Quantization Should I Use? A Unified Evaluation of llama.cpp Quantization on Llama-3.1-8B-Instruct* (arXiv:2601.14277 ; description des K-quants par super-blocs), janvier 2026. [https://arxiv.org/abs/2601.14277](https://arxiv.org/abs/2601.14277)
[^2]: OpenAI, *gpt-oss-120b* (« post-trained with MXFP4 quantization of the MoE weights », 20b dans 16 Go, Apache 2.0), août 2025. [https://huggingface.co/openai/gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b) ; Moonshot AI, *Kimi K3* (« MXFP4 weights / MXFP8 activations (quantization-aware training) » dès le SFT), juillet 2026. [https://huggingface.co/moonshotai/Kimi-K3](https://huggingface.co/moonshotai/Kimi-K3) ; NVIDIA, *NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4* (≈ 21,6 Go de safetensors ; « the NVFP4 release is the recommended path » pour le déploiement), août 2026. [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4)
