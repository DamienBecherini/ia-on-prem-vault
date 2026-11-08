---
title: Fenêtre de contexte
description: Nombre maximal de tokens qu'un LLM peut traiter en entrée active — détermine le coût mémoire dynamique de l'inférence.
aliases:
  - Context window
  - Taille de contexte
tags:
  - lexique
  - fondations
last_modified: "2026-11-09"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Nombre maximal de tokens (prompt + historique + réponse en cours) qu'un modèle peut "voir" et prendre en compte pendant une inférence. Au-delà de cette limite, les tokens les plus anciens sont ignorés ou tronqués.

## 📖 Définition détaillée

La fenêtre de contexte détermine deux choses distinctes :

1. **Ce que le modèle peut lire** : si votre document fait 50 000 tokens et que le modèle a une fenêtre de 32K, il ne peut pas tout lire en une requête.
2. **La VRAM dynamique consommée** : chaque token en contexte occupe de l'espace dans le [[00-lexique/kv-cache|KV Cache]]. Plus la fenêtre est longue, plus le KV Cache grossit.

Ordres de grandeur du KV Cache pour un modèle 70B (Llama 3.1 : 80 couches, 8 têtes KV en GQA, dimension 128), pour une seule requête, selon la longueur du contexte :

| Contexte | KV Cache estimé (BF16) | KV Cache (Q8) |
| :-- | :-- | :-- |
| 4K tokens | ~1,3 Go | ~0,7 Go |
| 32K tokens | ~10,7 Go | ~5,4 Go |
| 128K tokens | ~42 Go | ~21 Go |

Un contexte 128K peut donc **doubler** la VRAM nécessaire par rapport aux poids quantifiés en Q4 (~40 Go de poids + ~42 Go de KV Cache en BF16). En pratique, c'est la fenêtre de contexte qui provoque les OOM inattendus sur les machines locales.

## 💡 Pourquoi c'est important en IA on-premise

Sur un APU de 128 Go (~120 Go allouables au GPU sur Mac via `sysctl`), un modèle 70B Q4 (~40 Go) laisse ~80 Go pour le KV Cache : la fenêtre native de 128K tokens (~42 Go en BF16) tient pour une requête, avec ~38 Go de marge. C'est confortable pour la plupart des usages. Sur une machine avec 24 Go de VRAM, le KV Cache est le premier élément à ajuster.

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
