---
title: GGUF
description: Format de fichier portable pour l'inférence locale avec llama.cpp, optimisé pour les quantifications K-quant.
aliases:
  - GPT-Generated Unified Format
  - GGUF format
tags:
  - lexique
  - fondations
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Définition courte
Format de fichier unique et portable qui encapsule poids, métadonnées et schéma de [[00-lexique/quantification|quantification]] d'un LLM pour l'inférence locale via llama.cpp/Ollama.

## 📖 Définition détaillée
GGUF (successeur de GGML) regroupe tout ce dont le moteur a besoin en un seul fichier : les poids quantifiés, le tokenizer, les hyperparamètres et les métadonnées. Les variantes **K-quant** (ex : `Q4_K_M`, `Q5_K_S`) offrent différents compromis taille/qualité via des schémas de quantification par blocs.

Avantages majeurs : chargement immédiat sans compilation, portabilité entre CPU/GPU/Mac, et gestion native de l'[[00-lexique/offloading|offloading]] partiel vers la RAM si la VRAM est insuffisante.

## 💡 Pourquoi c'est important en IA on-premise
Standard de fait pour les postes de travail, Mac et homelab. Une grande partie des modèles du Hub a une déclinaison GGUF (souvent communautaire : unsloth, bartowski, ggml-org) ; sur Apple Silicon, Ollama exécute depuis la 0.40 (octobre 2026) les architectures prises en charge via MLX plutôt que GGUF, et les éditeurs publient d'abord des checkpoints FP8/NVFP4 officiels[^2]. À connaître pour le Scénario A (labo dev) et le Scénario B (Mac Studio).

## ⚠️ Pièges fréquents
- GGUF/llama.cpp sert plusieurs utilisateurs (continuous batching activé par défaut dans `llama-server`, slots parallèles `-np`), mais sans la gestion mémoire paginée ni le parallélisme multi-GPU de vLLM/SGLang : au-delà de quelques utilisateurs simultanés sur un modèle lourd, le débit par utilisateur s'effondre plus vite qu'avec un moteur GPU de production[^1].
- Plusieurs variantes de quantification (Q2 à Q8) ont des compromis très différents — Q2 et Q3_K_S dégradent nettement la qualité (perte mesurée de 4 points en moyenne sur les tâches aval pour Q3_K_S sur Llama 3.1-8B)[^3].

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence]] *(GGUF + llama.cpp vs vLLM en production)*
2. [[01-fondations/quantization-4bit-8bit|🗜️ Quantification 4-bit & 8-bit]] *(les schémas de précision derrière les K-quants)*

## 🔗 Voir aussi
- [[00-lexique/quantification|Quantification]]
- [[00-lexique/quantification-q4|Quantification Q4]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: ggml-org, *llama.cpp — llama-server README* (« Continuous batching », « Parallel decoding with multi-user support », `-cb` activé par défaut, `-np N`), lu le 2026-10-09. [https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
[^2]: Ollama, *Release v0.40.0* (« Models run on MLX on Apple Silicon by default »), octobre 2026 ; NVIDIA, *NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16* (checkpoints BF16 / NVFP4 officiels, GGUF fourni via ggml-org), août 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0) · [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16)
[^3]: J. Wang et al., *Which Quantization Should I Use? A Unified Evaluation of llama.cpp Quantization on Llama-3.1-8B-Instruct* (arXiv:2601.14277 : Q3_K_S perd environ 4 points en moyenne sur les tâches aval), janvier 2026. [https://arxiv.org/abs/2601.14277](https://arxiv.org/abs/2601.14277)
