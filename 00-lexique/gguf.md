---
title: GGUF
description: Format de fichier portable pour l'inférence locale avec llama.cpp, optimisé pour les quantifications K-quant.
aliases:
  - GPT-Generated Unified Format
  - GGUF format
tags:
  - lexique
  - fondations
last_modified: "2026-10-09"
last_verified: "2026-10-09"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Définition courte
Format de fichier unique et portable qui encapsule poids, métadonnées et schéma de [[00-lexique/quantification|quantification]] d'un LLM pour l'inférence locale via llama.cpp/Ollama.

## 📖 Définition détaillée
GGUF (successeur de GGML) regroupe tout ce dont le moteur a besoin en un seul fichier : les poids quantifiés, le tokenizer, les hyperparamètres et les métadonnées. Les variantes **K-quant** (ex : `Q4_K_M`, `Q5_K_S`) offrent différents compromis taille/qualité via des schémas de quantification par blocs.

Avantages majeurs : chargement immédiat sans compilation, portabilité entre CPU/GPU/Mac, et gestion native de l'[[00-lexique/offloading|offloading]] partiel vers la RAM si la VRAM est insuffisante.

## 💡 Pourquoi c'est important en IA on-premise
Standard de fait pour les postes de travail, Mac et homelab. La plupart des modèles sur HuggingFace/Ollama sont distribués en GGUF. À connaître pour le Scénario A (labo dev) et le Scénario B (Mac Studio).

## ⚠️ Pièges fréquents
- GGUF/llama.cpp sert plusieurs utilisateurs (continuous batching activé par défaut dans `llama-server`, slots parallèles `-np`), mais sans la gestion mémoire paginée ni le parallélisme multi-GPU de vLLM/SGLang : au-delà de quelques utilisateurs simultanés sur un modèle lourd, le débit par utilisateur s'effondre plus vite qu'avec un moteur GPU de production[^1].
- Plusieurs variantes de quantification (Q2 à Q8) ont des compromis très différents — Q2 peut dégrader fortement la qualité de réponse.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence]] *(GGUF + llama.cpp vs vLLM en production)*
2. [[01-fondations/quantization-4bit-8bit|🗜️ Quantification 4-bit & 8-bit]] *(les schémas de précision derrière les K-quants)*

## 🔗 Voir aussi
- [[00-lexique/quantification|Quantification]]
- [[00-lexique/quantification-q4|Quantification Q4]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: ggml-org, *llama.cpp — llama-server README* (« Continuous batching », « Parallel decoding with multi-user support », `-cb` activé par défaut, `-np N`), lu le 2026-10-09. [https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
