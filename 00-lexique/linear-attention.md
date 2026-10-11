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
last_modified: "2026-10-11"
---

## 📝 Définition courte

Variante de l'[[00-lexique/attention|attention]] qui garde la mémoire du contexte dans **un état de taille fixe**, mis à jour à chaque token, au lieu d'un [[00-lexique/kv-cache|KV cache]] qui grandit avec la conversation.

## 📖 Définition détaillée

Avec l'attention classique, chaque token ajoute ses clés et ses valeurs au cache : la mémoire grandit en proportion du contexte. L'attention linéaire remplace ce cache par un **carnet de taille fixe** : à chaque token, le modèle efface un peu, corrige et ajoute l'essentiel. Le carnet ne grossit pas, même sur 1 million de tokens.

Les variantes récentes ajoutent un mécanisme d'oubli (*gating*) pour effacer vite et une « règle delta » pour corriger une information précise (Gated DeltaNet)[^1]. Comme un carnet fixe retient moins de détails qu'un cache complet, les modèles gardent **quelques couches d'attention classique** : on parle d'architecture **hybride**. Exemples :

- **Qwen3-Next** et **Qwen3.8-27B** : 3 couches Gated DeltaNet pour 1 couche d'attention classique[^2].
- **Kimi Linear** : Kimi Delta Attention (KDA) à état fixe, avec une couche MLA toutes les trois couches KDA ; jusqu'à 75 % de KV cache en moins par rapport à un modèle tout en MLA, selon Moonshot AI[^3].
- **MiniMax-M1** : Lightning Attention, une variante d'attention linéaire, avec une couche classique toutes les sept couches[^4].

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

[^1]: S. Yang, J. Kautz, A. Hatamizadeh, *Gated Delta Networks: Improving Mamba2 with Delta Rule* (arXiv:2412.06464), décembre 2024. [https://arxiv.org/abs/2412.06464](https://arxiv.org/abs/2412.06464)
[^2]: Qwen, *Qwen3-Next-80B-A3B-Instruct* (12 × (3 × Gated DeltaNet → 1 × Gated Attention)), 2025. [https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct) ; Qwen, *Qwen3.8-27B* (16 × (3 × Gated DeltaNet → 1 × Gated Attention)), août 2026. [https://huggingface.co/Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)
[^3]: Kimi Team, *Kimi Linear: An Expressive, Efficient Attention Architecture* (arXiv:2510.26692 ; état de taille fixe, ratio 3:1 KDA / MLA, jusqu'à −75 % de KV cache vs full MLA), octobre 2025. [https://arxiv.org/abs/2510.26692](https://arxiv.org/abs/2510.26692)
[^4]: MiniMax, *MiniMax-M1* (arXiv:2506.13585 ; Lightning Attention, un bloc softmax après sept blocs linéaires), juin 2025. [https://arxiv.org/abs/2506.13585](https://arxiv.org/abs/2506.13585)
