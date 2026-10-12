---
title: CUDA
description: "Plateforme logicielle de NVIDIA pour programmer ses GPU ; la plupart des moteurs d'IA locale la visent en priorité, ce qui pèse sur le choix du matériel."
aliases:
  - Compute Unified Device Architecture
tags:
  - lexique
  - materiel
last_modified: "2026-10-11"
---

## 📝 Définition courte

La plateforme logicielle de NVIDIA qui permet aux programmes d'utiliser les GPU NVIDIA pour calculer, et donc de faire tourner les modèles d'IA sur ces cartes.

## 📖 Définition détaillée

NVIDIA la définit comme « une plateforme de calcul parallèle et un modèle de programmation » qui accélère les calculs en exploitant le GPU[^1]. Elle comprend le pilote, le compilateur et des bibliothèques optimisées sur lesquelles s'appuient les frameworks (PyTorch) et les moteurs d'inférence ([[00-lexique/vllm|vLLM]], [[00-lexique/sglang|SGLang]], [[00-lexique/tensorrt-llm|TensorRT-LLM]]).

CUDA ne fonctionne que sur du matériel NVIDIA. Les autres constructeurs ont leur propre pile :

| Constructeur | Pile logicielle | Rôle |
| :-- | :-- | :-- |
| NVIDIA | CUDA | référence de l'écosystème IA[^1] |
| AMD | ROCm | « pile logicielle ouverte d'AMD pour le calcul accéléré par GPU »[^2] |
| Apple | Metal, MLX | MLX est « un framework de tableaux pour l'apprentissage automatique sur Apple silicon »[^3] |

## 💡 Pourquoi c'est important en IA on-premise

Une nouveauté (modèle, format, optimisation) arrive souvent d'abord sur CUDA. Choisir une machine NVIDIA simplifie l'installation des moteurs ; choisir AMD ou Apple impose de vérifier que le moteur et le modèle visés sont supportés sur ROCm ou MLX.

## ⚠️ Pièges fréquents

- Supposer qu'un outil « GPU » marche sur tout GPU : beaucoup ne supportent que CUDA, ou supportent ROCm et Metal avec retard.
- Ignorer la version : un moteur exige souvent une version minimale de CUDA et du pilote.

## 📚 Pour comprendre en profondeur

- [[02-materiel/apu-and-unified-memory|🧠 APU & Mémoire Unifiée]] *(CUDA, ROCm et MLX selon la machine)*

## 🔗 Voir aussi

- [[00-lexique/vllm|vLLM]]
- [[00-lexique/tensorrt-llm|TensorRT-LLM]]
- [[00-lexique/soc|SoC]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: NVIDIA, *CUDA Programming Guide* (« CUDA is a parallel computing platform and programming model developed by NVIDIA… by harnessing the power of the GPU »), consulté le 2026-10-11. [https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html)
[^2]: AMD, *What is ROCm?* (« ROCm is the AMD open software stack for GPU-accelerated computing »), consulté le 2026-10-11. [https://rocm.docs.amd.com/en/latest/what-is-rocm.html](https://rocm.docs.amd.com/en/latest/what-is-rocm.html)
[^3]: Apple ml-explore, *MLX* — dépôt GitHub (« MLX is an array framework for machine learning on Apple silicon », modèle de mémoire unifiée), consulté le 2026-10-11. [https://github.com/ml-explore/mlx](https://github.com/ml-explore/mlx)
