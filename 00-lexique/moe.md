---
title: MoE
description: Mixture of Experts — architecture où seuls certains sous-réseaux sont activés par token, permettant des modèles énormes avec un coût d'inférence maîtrisé.
aliases:
  - Mixture of Experts
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---

## 📝 Définition courte

Architecture de réseau de neurones où le modèle est divisé en plusieurs "experts" spécialisés. Pour chaque token, un mécanisme de routage n'active qu'un petit sous-ensemble d'experts — ce qui réduit le coût de calcul par rapport à un modèle dense de même taille.

## 📖 Définition détaillée

Dans un modèle dense classique (Llama, Mistral…), **tous les paramètres** sont activés pour chaque token. Dans un MoE, seuls les **top-k experts** (généralement 2 à 8 sur 64 ou plus) participent à chaque calcul.

Exemples concrets en 2026 :

| Modèle | Paramètres totaux | Paramètres actifs/token | VRAM requise (Q4) |
| :-- | :-- | :-- | :-- |
| Llama 3.1 70B (dense) | 70 B | 70 B | ~40 Go |
| DeepSeek V3 (MoE) | 671 B | ~37 B actifs | ~390 Go (poids complets) |
| Qwen3-A3B (MoE) | ~30 B | ~3 B actifs | ~18 Go |
| Mixtral 8x7B | 47 B | ~13 B actifs | ~26 Go en Q4 |

Le MoE offre donc la **qualité d'un grand modèle** avec le **coût de calcul d'un modèle plus petit** — mais exige de charger **tous les experts en VRAM** même si la plupart sont inactifs.

## 💡 Pourquoi c'est important en IA on-premise

Les MoE de petite taille active (comme Qwen3-A3B ou Phi-MoE) sont particulièrement intéressants sur les APU : ils offrent une bonne qualité de réponse avec des besoins VRAM acceptables et un bon débit de génération.

Pour les MoE géants (DeepSeek V3 : 390 Go), il faut un cluster multi-GPU ou multi-nœuds — les scénarios C ou D.

## ⚠️ Pièges fréquents

- Comparer un MoE "671B" à un dense "70B" en croyant que le dense est forcément plus rapide : le débit dépend des paramètres **actifs**, pas totaux.
- Charger partiellement un MoE : si tous les experts ne tiennent pas en VRAM, le swap est catastrophique car les experts absents sont convoqués de façon non-prévisible.
- Sous-estimer la VRAM requise : tous les poids doivent être chargés même si seuls 2/64 experts sont activés par token.

## 📚 Pour comprendre en profondeur

- [[01-fondations/quantization-4bit-8bit|🗜️ La Quantification]]
- [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]]

## 🔗 Voir aussi

- [[00-lexique/llm|LLM]]
- [[00-lexique/quantification|Quantification]]
- [[00-lexique/tokens-per-second|Tokens par seconde]]
- [[00-lexique/vram|VRAM]]
