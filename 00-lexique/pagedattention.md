---
title: PagedAttention
description: Technique de gestion du KV Cache par blocs de mémoire virtuelle, popularisée par vLLM.
aliases:
  - Paged Attention
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
Algorithme qui gère la mémoire du [[00-lexique/kv-cache|KV Cache]] par blocs non contigus (comme la mémoire virtuelle d'un OS), réduisant fortement la fragmentation.

## 📖 Définition détaillée
Dans les moteurs classiques, le KV Cache est pré-alloué en blocs contigus en VRAM : les zones non utilisées restent gaspillées. PagedAttention découpe le cache en pages de taille fixe qui peuvent être allouées, libérées et partagées dynamiquement.

Résultat : le gaspillage mémoire passe de 60 à 80 % à moins de 4 % selon les mesures du papier original (Woosuk Kwon et al., SOSP 2023)[^2]. Cela permet le **Continuous Batching** : les requêtes sont traitées en continu sans vider le serveur entre chaque, maximisant le débit GPU.

## 💡 Pourquoi c'est important en IA on-premise
C'est l'innovation qui a rendu possible le batching continu de vLLM — avec le cache de préfixes par blocs (actif par défaut), elle explique pourquoi vLLM surpasse Ollama en production multi-utilisateurs[^3]. Sans PagedAttention, le serveur gaspille de la VRAM et ne peut pas batche efficacement les requêtes concurrentes.

## ⚠️ Pièges fréquents
- PagedAttention désigne aujourd'hui un **principe** plus qu'un composant : vLLM a retiré en v0.25 (juillet 2026) l'implémentation historique au profit des backends d'attention de son moteur V1, qui conservent la gestion du KV Cache par blocs (option `--block-size`, métrique `vllm:kv_cache_usage_perc`)[^1]. Les moteurs orientés poste de travail (llama.cpp/Ollama) reposent sur un autre modèle mémoire et n'offrent pas de batching continu équivalent.
- Ne résout pas les contraintes de capacité totale : si le modèle + les caches dépassent la VRAM totale, l'OOM survient quand même.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence]] *(pourquoi vLLM > Ollama en production)*
2. [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]] *(le mécanisme du cache que PagedAttention optimise)*

## 🔗 Voir aussi
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/vram|VRAM]]
- [[00-lexique/tokens-per-second|Tokens par seconde]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: vLLM Project, *Release v0.25.0* (« PagedAttention has been removed — the legacy attention implementation is deleted now that V1/MRv2 backends are the standard path »), 11 juillet 2026. [https://github.com/vllm-project/vllm/releases/tag/v0.25.0](https://github.com/vllm-project/vllm/releases/tag/v0.25.0) · vLLM Project, *Engine Arguments* (`--block-size`, KV cache par blocs), consulté le 2026-10-10. [https://docs.vllm.ai/en/stable/configuration/engine_args/](https://docs.vllm.ai/en/stable/configuration/engine_args/)
[^2]: W. Kwon et al., *vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention* (« existing systems waste 60% – 80% of memory », « a mere waste of under 4% »), 20 juin 2023 ; *Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP 2023). [https://vllm.ai/blog/2023-06-20-vllm](https://vllm.ai/blog/2023-06-20-vllm) · [https://arxiv.org/abs/2309.06180](https://arxiv.org/abs/2309.06180)
[^3]: vLLM Project, *Automatic Prefix Caching* (`enable_prefix_caching` actif par défaut, hachage de blocs), consulté le 2026-10-10. [https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/](https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/)
