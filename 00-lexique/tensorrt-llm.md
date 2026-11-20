---
title: TensorRT-LLM
description: SDK NVIDIA d'inférence LLM optimisée (PyTorch natif, FP8/NVFP4) pour GPU datacenter.
aliases:
  - TensorRT LLM
  - TRT-LLM
tags:
  - lexique
  - fondations
last_modified: "2026-11-20"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Définition courte
SDK officiel NVIDIA d'inférence LLM à architecture PyTorch native, avec kernels bas niveau (FP8/NVFP4, attention optimisée) et serveur `trtllm-serve` compatible OpenAI, pour tirer le maximum des GPU datacenter (H100, B200)[^1].

## 📖 Définition détaillée
TensorRT-LLM repose sur une architecture PyTorch native : le modèle est chargé et servi directement (`trtllm-serve`, API LLM Python), les optimisations (FP8/NVFP4, fusion d'opérations, attention paginée) étant appliquées à l'exécution. L'ancien backend TensorRT et ses outils de compilation (`trtllm-build`) ont été retirés : il n'y a plus de compilation préalable d'un « engine » (historique des versions dans [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence]])[^1].

Sur Blackwell datacenter (B200, B300), TensorRT-LLM supporte nativement le format **NVFP4**, divisant par deux l'empreinte [[00-lexique/vram|VRAM]] par rapport au FP8 ; sur les cartes SM120 (RTX 5090, RTX PRO 6000) le support reste partiel au T3 2026 (modèles MoE NVFP4 non pris en charge selon les notes de version)[^3].

Contraste avec vLLM : TensorRT-LLM vise le plafond de performance sur GPU NVIDIA, mais son cycle de publication est moins lisible (voir les pièges ci-dessous) et ses changements cassants entre RC sont fréquents ; la courbe d'apprentissage reste plus ardue[^1][^2].

## 💡 Pourquoi c'est important en IA on-premise
Incontournable pour amortir le coût des accélérateurs professionnels en datacenter. La référence du Scénario D.

## ⚠️ Pièges fréquents
- Confondre version stable et *release candidates* : au T4 2026, la dernière stable est la 1.3.0 (20 novembre 2026, publiée après 30 RC), tandis que la 1.4 est déjà en *release candidates* (1.4.0rcN) ; les RC apportent les nouveaux modèles et kernels mais changent d'API d'une RC à l'autre, et le passage 1.2.x → 1.3.0 comporte des changements cassants (ex. priorité CLI > YAML). Épinglez la version en production et relisez les notes de version avant de monter[^1][^4].
- Depuis la 1.3, la télémétrie d'usage anonyme est activée par défaut : sur un déploiement souverain ou isolé, désactivez-la (`TRTLLM_NO_USAGE_STATS=1`, `DO_NOT_TRACK=1` ou `--no-telemetry`)[^4].
- Pas adapté aux Mac ; sur station de travail, le support se limite au DGX Spark (bêta mono-nœud depuis la 1.2) et aux RTX PRO 6000 / RTX 50 avec des problèmes connus au T3 2026[^1][^3].

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence]] *(comparatif llama.cpp / vLLM / TensorRT-LLM)*
2. [[04-blueprints/scenario-d-datacenter|🏢 Scénario D : Datacenter]] *(TensorRT-LLM en production)*

## 🔗 Voir aussi
- [[00-lexique/vram|VRAM]]
- [[00-lexique/quantification|Quantification]]
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: NVIDIA, *TensorRT-LLM Release Notes* (1.0 : PyTorch par défaut ; 1.2 : backend TensorRT et `trtllm-build` retirés ; 1.3 RC : backend MoE TRITON déprécié), consulté le 2026-10-09. <https://nvidia.github.io/TensorRT-LLM/release-notes.html>
[^2]: PyPI, `tensorrt-llm` (historique des versions : 1.3.0 stable du 2026-11-20, 1.4.0rc0 → rc4), consulté le 2026-11-20. <https://pypi.org/project/tensorrt-llm/>
[^3]: NVIDIA, *TensorRT-LLM — Releases* (notes 1.3.0rc26 / rc27 : problèmes connus SM120, modèles MoE NVFP4 non pris en charge sur RTX 50 / RTX PRO 6000), septembre 2026. <https://github.com/NVIDIA/TensorRT-LLM/releases>
[^4]: NVIDIA, *TensorRT-LLM — Release v1.3.0* (première version stable de la ligne 1.3 après 30 RC ; télémétrie d'usage activée par défaut, désactivable par `TRTLLM_NO_USAGE_STATS=1`, `DO_NOT_TRACK=1` ou `--no-telemetry`), 20 novembre 2026. <https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.3.0>
