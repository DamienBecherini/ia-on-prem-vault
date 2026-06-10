---
title: "vLLM"
description: "Moteur open-source d'inférence LLM haut débit pour GPU NVIDIA/AMD, standard de production multi-utilisateurs."
aliases:
  - Virtual Large Language Model
tags:
  - lexique
  - stack
sidebar:
  order: 63
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
---

## 📝 Définition courte

Moteur d'inférence open-source (Python/C++) conçu pour servir des [[00-lexique/llm|LLM]] à **haut débit** sur GPU dédiés, avec gestion avancée du [[00-lexique/kv-cache|KV Cache]] et requêtes concurrentes[^1].

## 📖 Définition détaillée

[vLLM](https://github.com/vllm-project/vllm) est devenu la référence on-premise pour l'inférence **multi-utilisateurs** sur serveurs équipés de GPU NVIDIA (CUDA) ou AMD (ROCm). Contrairement aux outils orientés poste de travail, vLLM vise la **production** : API OpenAI-compatible, batching continu, parallélisme tensoriel et quantification FP8/AWQ pour architectures récentes.

Son mécanisme emblématique est [[00-lexique/pagedattention|PagedAttention]] : le KV Cache est découpé en blocs réutilisables, réduisant la fragmentation mémoire et permettant de regrouper de nombreuses requêtes simultanées sans saturer la [[00-lexique/vram|VRAM]][^2].

## 💡 Pourquoi c'est important en IA on-premise

- **Scénarios B, C et D** du vault : appliance PME, cluster bureau derrière proxy, datacenter multi-GPU.
- Alternative naturelle à une API cloud quand le volume de requêtes internes justifie l'amortissement matériel.
- Point d'ancrage pour [[06-mise-en-oeuvre/configure-vllm-multi-gpu|configurer vLLM multi-GPU]] et [[06-mise-en-oeuvre/migrate-ollama-to-vllm|migrer depuis Ollama]].

## ⚠️ Pièges fréquents

- Déployer vLLM sur poste sans GPU dédié ou avec offloading RAM massif : ce n'est **pas** son cas d'usage (préférer [[00-lexique/ollama|Ollama]] / llama.cpp).
- Comparer vLLM et [[00-lexique/ollama|Ollama]] sur une seule requête séquentielle : l'avantage vLLM apparaît sous **concurrence**.
- Oublier le dimensionnement VRAM : le modèle + KV Cache concurrent doivent tenir dans la mémoire GPU disponible.
- Sur charges **agentiques** à préfixes très partagés, évaluer [[00-lexique/sglang|SGLang]] en parallèle (RadixAttention).

## 📚 Pour comprendre en profondeur

1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]] — comparatif vLLM, Ollama, TensorRT-LLM, SGLang
2. [[00-lexique/pagedattention|PagedAttention]] — optimisation mémoire clé de vLLM
3. [[06-mise-en-oeuvre/local-inference-security|🔐 Sécurité de l'inférence locale]] — durcissement API en production

## 🔗 Voir aussi

- [[00-lexique/ollama|Ollama]]
- [[00-lexique/pagedattention|PagedAttention]]
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/sglang|SGLang]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: vLLM Project, dépôt officiel. [https://github.com/vllm-project/vllm](https://github.com/vllm-project/vllm)
[^2]: Kwon et al., *Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP 2023). [https://arxiv.org/abs/2309.06180](https://arxiv.org/abs/2309.06180)
