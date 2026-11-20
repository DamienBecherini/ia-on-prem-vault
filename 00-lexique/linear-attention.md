---
title: Attention linéaire
description: "Famille d'attention qui résume le contexte dans un état de taille fixe au lieu d'un KV cache croissant ; souvent mêlée à quelques couches classiques (hybride)."
aliases:
  - Linear attention
  - Attention linéaire hybride
  - Gated DeltaNet
  - Kimi Delta Attention
  - KDA
  - Lightning Attention
tags:
  - lexique
  - fondations
last_modified: "2026-11-20"
---

## 📝 Définition courte

Variante de l'[[00-lexique/attention|attention]] qui garde la mémoire du contexte dans **un état de taille fixe**, mis à jour à chaque token, au lieu d'un [[00-lexique/kv-cache|KV cache]] qui grandit avec la conversation.

## 📖 Définition détaillée

Avec l'attention classique, chaque token ajoute ses clés et ses valeurs au cache : la mémoire grandit en proportion du contexte. L'attention linéaire remplace ce cache par un **carnet de taille fixe** : à chaque token, le modèle efface un peu, corrige et ajoute l'essentiel. Le carnet ne grossit pas, même sur 1 million de tokens.

Les variantes récentes ajoutent un mécanisme d'oubli (*gating*) pour effacer vite et une « règle delta » pour corriger une information précise (Gated DeltaNet)[^1]. Comme un carnet fixe retient moins de détails qu'un cache complet, les modèles gardent **quelques couches d'attention classique** : on parle d'architecture **hybride** (Gated DeltaNet de Qwen3-Next et Qwen3.8-27B, Kimi Delta Attention de Kimi Linear, Lightning Attention de MiniMax-M1 ; ratios et gains dans [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]]).

## 💡 Pourquoi c'est important en IA on-premise

Ces modèles acceptent de très longs contextes avec bien moins de VRAM de cache. Pour dimensionner un serveur, la formule GQA classique les surestime : seule une minorité de couches stocke un vrai KV cache.

## ⚠️ Pièges fréquents

- Appliquer la formule du KV cache à toutes les couches du modèle : seules les couches d'attention classique en ont un.
- Supposer que tous les moteurs les supportent : vérifiez la liste des modèles de votre moteur et sa version minimale.

## 📚 Pour comprendre en profondeur

- [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]] *(section « Quand le modèle lui-même réduit sa mémoire »)*

## 🔗 Voir aussi

- [[00-lexique/attention|Attention]]
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/mla|MLA]]
- [[00-lexique/sparse-attention|Attention sparse]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: S. Yang, J. Kautz, A. Hatamizadeh, *Gated Delta Networks: Improving Mamba2 with Delta Rule* (arXiv:2412.06464), décembre 2024. <https://arxiv.org/abs/2412.06464>
