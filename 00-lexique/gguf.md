---
title: GGUF
description: Format de fichier portable pour l'inférence locale avec llama.cpp, optimisé pour les quantifications K-quant.
aliases:
  - GPT-Generated Unified Format
  - GGUF format
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Définition courte
Format de fichier unique et portable qui encapsule poids, métadonnées et schéma de [[00-lexique/quantification|quantification]] d'un LLM pour l'inférence locale via llama.cpp/Ollama.

## 📖 Définition détaillée
GGUF (successeur de GGML) regroupe tout ce dont le moteur a besoin en un seul fichier : les poids quantifiés, le tokenizer, les hyperparamètres et les métadonnées. Les variantes **K-quant** (ex : `Q4_K_M`, `Q5_K_S`) offrent différents compromis taille/qualité via des schémas de quantification par blocs.

Avantages majeurs : chargement immédiat sans compilation, portabilité entre CPU/GPU/Mac, et gestion native de l'[[00-lexique/offloading|offloading]] partiel vers la RAM si la VRAM est insuffisante.

## 💡 Pourquoi c'est important en IA on-premise
Standard de fait pour les postes de travail, Mac et homelab. La plupart des modèles sur HuggingFace/Ollama sont distribués en GGUF. À connaître pour le Scénario A (labo dev) et le Scénario B (Mac Studio).

## ⚠️ Pièges fréquents
- GGUF n'est pas adapté à la production multi-utilisateurs : llama.cpp ne gère pas le Continuous Batching comme vLLM.
- Plusieurs variantes de quantification (Q2 à Q8) ont des compromis très différents — Q2 peut dégrader fortement la qualité de réponse.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence]] *(GGUF + llama.cpp vs vLLM en production)*
2. [[01-fondations/quantization-4bit-8bit|🗜️ Quantification 4-bit & 8-bit]] *(les schémas de précision derrière les K-quants)*

## 🔗 Voir aussi
- [[00-lexique/quantification|Quantification]]
- [[00-lexique/quantification-q4|Quantification Q4]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
