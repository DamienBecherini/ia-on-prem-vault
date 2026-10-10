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
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
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
- Croire que vLLM ne réutilise pas les préfixes : l'Automatic Prefix Caching est **actif par défaut**[^3] ; sur charges **agentiques** à préfixes très partagés, évaluer tout de même [[00-lexique/sglang|SGLang]] en parallèle (RadixAttention, partage plus fin).
- Exposer le serveur avec le seul `--api-key` : il ne protège que `/v1`, `/v2` et `/inference` ; `/tokenize` et `/metrics` restent ouverts — reverse proxy obligatoire[^4].
- Rester sur une version antérieure à 0.31.0 (octobre 2026) : plusieurs exécutions de code à distance et dénis de service ont été corrigés entre 0.28 et 0.31, et les roues par défaut ciblent CUDA 13.0 depuis la 0.28 (août 2026)[^5].

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
[^3]: vLLM Project, *Automatic Prefix Caching* (`enable_prefix_caching` actif par défaut, hachage de blocs), consulté le 2026-10-10. [https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/](https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/)
[^4]: vLLM Project, *CLI Reference — `vllm serve`* (`--api-key` : chemins protégés `/v1`, `/v2`, `/inference`), consulté le 2026-10-10 · advisory GHSA-h3rc-6mm3-gc2m (`/tokenize` non couvert par `--api-key`), 6 octobre 2026. [https://docs.vllm.ai/en/stable/cli/serve/](https://docs.vllm.ai/en/stable/cli/serve/) · [https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m](https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m)
[^5]: vLLM Project, *Release v0.31.0* (`mm_processor_kwargs` par requête refusés sauf `--trust-request-mm-kwargs`), 5 octobre 2026 · *Release v0.28.0* (roue PyPI et image Docker par défaut en CUDA 13.0), 26 août 2026. [https://github.com/vllm-project/vllm/releases/tag/v0.31.0](https://github.com/vllm-project/vllm/releases/tag/v0.31.0) · [https://github.com/vllm-project/vllm/releases/tag/v0.28.0](https://github.com/vllm-project/vllm/releases/tag/v0.28.0)
