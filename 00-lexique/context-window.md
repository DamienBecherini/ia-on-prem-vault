---
title: Fenêtre de contexte
description: Nombre maximal de tokens qu'un LLM peut traiter en entrée active — détermine le coût mémoire dynamique de l'inférence.
aliases:
  - Context window
  - Taille de contexte
tags:
  - lexique
  - fondations
---

## 📝 Définition courte

Nombre maximal de tokens (prompt + historique + réponse en cours) qu'un modèle peut "voir" et prendre en compte pendant une inférence. Au-delà de cette limite, les tokens les plus anciens sont ignorés ou tronqués.

## 📖 Définition détaillée

La fenêtre de contexte détermine deux choses distinctes :

1. **Ce que le modèle peut lire** : si votre document fait 50 000 tokens et que le modèle a une fenêtre de 32K, il ne peut pas tout lire en une requête.
2. **La VRAM dynamique consommée** : chaque token en contexte occupe de l'espace dans le [[00-lexique/kv-cache|KV Cache]]. Plus la fenêtre est longue, plus le KV Cache grossit.

Ordres de grandeur du KV Cache pour un modèle 70B (Llama 3.1) selon la longueur du contexte :

| Contexte | KV Cache estimé (BF16) | KV Cache (Q8) |
| :-- | :-- | :-- |
| 4K tokens | ~4 Go | ~2 Go |
| 32K tokens | ~32 Go | ~16 Go |
| 128K tokens | ~128 Go | ~64 Go |

Un contexte 128K peut donc **doubler ou tripler** la VRAM nécessaire par rapport aux poids seuls. En pratique, c'est la fenêtre de contexte qui provoque les OOM inattendus sur les machines locales.

## 💡 Pourquoi c'est important en IA on-premise

Sur un APU avec 128 Go alloués au GPU, un modèle 70B Q4 (~40 Go) laisse ~88 Go pour le KV Cache — soit ~88K tokens en BF16. C'est confortable pour la plupart des usages. Sur une machine avec 24 Go de VRAM, le KV Cache est le premier élément à ajuster.

## ⚠️ Pièges fréquents

- Acheter un modèle "128K context" en croyant que les performances sont identiques sur 4K et 128K : le débit ([[00-lexique/ttft|TTFT]] en particulier) se dégrade fortement sur les longs contextes.
- Augmenter la fenêtre de contexte via des paramètres comme `--ctx-size` sans vérifier la VRAM disponible : l'OOM arrivera au milieu d'une conversation longue, pas au lancement.
- Croire que RAG et fenêtre de contexte sont équivalents : le RAG sélectionne les passages pertinents pour rester dans une fenêtre courte ; la fenêtre longue permet de tout lire d'un coup mais coûte plus cher.

## 📚 Pour comprendre en profondeur

- [[01-fondations/kv-cache-and-context|💾 KV Cache & La Gestion du Contexte]]
- [[01-fondations/quantization-4bit-8bit|🗜️ La Quantification]]

## 🔗 Voir aussi

- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/rag|RAG]]
- [[00-lexique/vram|VRAM]]
