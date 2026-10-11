---
title: Attention sparse
description: "Attention où chaque token ne relit qu'une sélection des tokens passés jugés pertinents, au lieu de tout l'historique, pour réduire le coût des contextes longs."
aliases:
  - Sparse attention
  - Attention clairsemée
  - DSA
  - DeepSeek Sparse Attention
tags:
  - lexique
  - fondations
last_modified: "2026-10-11"
---

## 📝 Définition courte

Variante de l'[[00-lexique/attention|attention]] où chaque nouveau token ne regarde **qu'une partie** des tokens précédents, choisie pour sa pertinence, au lieu de relire tout le contexte.

## 📖 Définition détaillée

Dans l'attention classique, chaque token compare son contenu à **tous** les tokens précédents. Le coût grandit avec le carré de la longueur du contexte. L'attention sparse (« clairsemée ») limite ce travail à une sélection.

Une analogie : pour retrouver une information dans un long dossier, vous lisez la table des matières, puis vous n'ouvrez que les pages utiles.

Exemple : la **DeepSeek Sparse Attention (DSA)** de DeepSeek-V3.2. Un petit module rapide, le *lightning indexer*, note la pertinence de chaque token passé, puis le modèle ne fait l'attention complète que sur les 2 048 tokens les mieux notés. DeepSeek indique que le coût de l'attention principale passe de $O(L^2)$ à $O(L \cdot k)$, $k$ étant le nombre de tokens retenus[^1].

## 💡 Pourquoi c'est important en IA on-premise

L'attention sparse rend les contextes longs (100K tokens et plus) moins coûteux en calcul et plus rapides. Sur un serveur on-premise, cela signifie plus de requêtes longues traitées avec le même matériel.

## ⚠️ Pièges fréquents

- Croire que l'attention sparse réduit la VRAM du cache : avec DSA, tous les tokens restent stockés dans le [[00-lexique/kv-cache|KV cache]] (sous la forme compressée de [[00-lexique/mla|MLA]])[^1]. Ce qui baisse, c'est la quantité de cache relue et calculée à chaque token.

## 📚 Pour comprendre en profondeur

- [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]] *(section « Quand le modèle lui-même réduit sa mémoire »)*

## 🔗 Voir aussi

- [[00-lexique/attention|Attention]]
- [[00-lexique/mla|MLA]]
- [[00-lexique/linear-attention|Attention linéaire]]
- [[00-lexique/context-window|Fenêtre de contexte]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: DeepSeek-AI, *DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models* (arXiv:2512.02556, section 2.1 : lightning indexer, 2 048 tokens sélectionnés, O(L²) → O(Lk), DSA implémentée sur MLA), décembre 2025. [https://arxiv.org/abs/2512.02556](https://arxiv.org/abs/2512.02556)
