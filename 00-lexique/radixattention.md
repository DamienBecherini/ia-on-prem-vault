---
title: "🌳 RadixAttention"
description: "Technique de gestion du KV Cache par arbre de préfixes, introduite par SGLang pour réutiliser les contextes communs entre requêtes."
aliases:
  - Radix Attention
tags:
  - lexique
  - stack
sidebar:
  order: 58
last_modified: "2026-06-09"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
---

## 📝 Définition courte

Technique de gestion du [[00-lexique/kv-cache|KV Cache]] qui organise les entrées clé/valeur dans un arbre radix (arbre de préfixes) plutôt que dans un tampon plat — les préfixes communs entre requêtes ne sont calculés qu'une fois.

## 📖 Définition détaillée

Introduite par [[00-lexique/sglang|SGLang]][^1], RadixAttention stocke les entrées du KV Cache dans une structure d'arbre : chaque nœud correspond à un segment de tokens. Lorsque plusieurs requêtes partagent un préfixe identique — long prompt système, contexte RAG récupéré, schéma d'outils répété — les entrées KV correspondantes sont conservées une seule fois et réutilisées par toutes les requêtes qui empruntent ce chemin.

**Effet principal :** réduction significative du [[00-lexique/ttft|TTFT]] dans les boucles agentiques (le LLM appelle des outils plusieurs fois avec le même cadre contextuel) et dans les déploiements où de nombreux utilisateurs partagent le même prompt système.

## 💡 Relation avec PagedAttention

Les deux techniques optimisent la gestion mémoire du KV Cache, mais pour des objectifs différents :

| Technique | Objectif principal |
| :-- | :-- |
| [[00-lexique/pagedattention|PagedAttention]] | Éliminer la fragmentation mémoire pour augmenter la concurrence |
| RadixAttention | Maximiser la réutilisation des préfixes pour réduire la latence |

Elles ne s'excluent pas conceptuellement : PagedAttention adresse le débit sous charge ; RadixAttention adresse la latence quand le contexte se répète.

## 🔗 Voir aussi

- [[00-lexique/sglang|SGLang]]
- [[00-lexique/pagedattention|PagedAttention]]
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: LMSys, *Fast and Expressive LLM Inference with RadixAttention*, janvier 2024. [https://lmsys.org/blog/2024-01-17-sglang/](https://lmsys.org/blog/2024-01-17-sglang/)
