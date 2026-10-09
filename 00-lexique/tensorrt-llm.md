---
title: TensorRT-LLM
description: SDK NVIDIA d'inférence LLM optimisée (PyTorch natif, FP8/NVFP4) pour GPU datacenter.
aliases:
  - TensorRT LLM
  - TRT-LLM
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
SDK officiel NVIDIA d'inférence LLM à architecture PyTorch native, avec kernels bas niveau (FP8/NVFP4, attention optimisée) et serveur `trtllm-serve` compatible OpenAI, pour tirer le maximum des GPU datacenter (H100, B200)[^1].

## 📖 Définition détaillée
Depuis la version 1.0 (septembre 2025), TensorRT-LLM repose sur une architecture PyTorch native : le modèle est chargé et servi directement (`trtllm-serve`, API LLM Python), les optimisations (FP8/NVFP4, fusion d'opérations, attention paginée) étant appliquées à l'exécution. La version 1.2 (mars 2026) a retiré l'ancien backend TensorRT et ses outils de compilation (`trtllm-build`) : il n'y a plus de compilation préalable d'un « engine »[^1].

Sur les puces Blackwell (B200, RTX 5090), TensorRT-LLM supporte nativement le format **FP4**, divisant par deux l'empreinte [[00-lexique/vram|VRAM]] par rapport au FP8.

Contraste avec vLLM : TensorRT-LLM est plus performant au plafond mais bien plus complexe à déployer (compilation longue, GPU-spécifique, courbe d'apprentissage ardue).

## 💡 Pourquoi c'est important en IA on-premise
Incontournable pour amortir le coût des accélérateurs professionnels en datacenter. La référence du Scénario D.

## ⚠️ Pièges fréquents
- Confondre version stable (1.2.x) et *release candidates* 1.3.0rcN : au T4 2026, la dernière stable est la 1.2.1 (avril 2026) ; les RC apportent les nouveaux modèles et kernels mais changent d'API d'une RC à l'autre (ex. priorité CLI > YAML depuis rc18). Épinglez la version en production[^1][^2].
- Pas adapté aux postes de travail ou aux Mac.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence]] *(comparatif llama.cpp / vLLM / TensorRT-LLM)*
2. [[04-blueprints/scenario-d-datacenter|🏢 Scénario D : Datacenter]] *(TensorRT-LLM en production)*

## 🔗 Voir aussi
- [[00-lexique/vram|VRAM]]
- [[00-lexique/quantification|Quantification]]
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: NVIDIA, *TensorRT-LLM Release Notes* (1.0 : PyTorch par défaut ; 1.2 : backend TensorRT et `trtllm-build` retirés ; 1.3 RC : backend MoE TRITON déprécié), consulté le 2026-10-09. [https://nvidia.github.io/TensorRT-LLM/release-notes.html](https://nvidia.github.io/TensorRT-LLM/release-notes.html)
[^2]: PyPI, `tensorrt-llm` (historique des versions : 1.2.1 stable, 1.3.0rc29), consulté le 2026-10-09. [https://pypi.org/project/tensorrt-llm/](https://pypi.org/project/tensorrt-llm/)
