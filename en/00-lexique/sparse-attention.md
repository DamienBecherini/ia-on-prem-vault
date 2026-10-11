---
title: Sparse attention
description: "Attention where each token rereads only a selection of past tokens judged relevant, instead of the whole history, to cut the cost of long contexts."
aliases:
  - Sparse attention
  - DSA
  - DeepSeek Sparse Attention
tags:
  - lexique
  - fondations
last_modified: "2026-10-11"
---

## 📝 Short definition

A variant of [[00-lexique/attention|attention]] where each new token looks at **only part** of the previous tokens, chosen for their relevance, instead of rereading the whole context.

## 📖 Detailed definition

In classic attention, each token compares its content with **all** previous tokens. The cost grows with the square of the context length. Sparse attention limits this work to a selection.

An analogy: to find a piece of information in a long file, you read the table of contents, then open only the useful pages.

Example: **DeepSeek Sparse Attention (DSA)** in DeepSeek-V3.2. A small, fast module, the *lightning indexer*, scores the relevance of each past token, then the model runs full attention only on the 2,048 tokens with the best scores. DeepSeek states that the cost of core attention goes from $O(L^2)$ to $O(L \cdot k)$, $k$ being the number of selected tokens[^1].

## 💡 Why it matters for on-premise AI

Sparse attention makes long contexts (100K tokens and more) cheaper to compute and faster. On an on-premise server, this means more long requests handled with the same hardware.

## ⚠️ Common pitfalls

- Believing that sparse attention reduces cache VRAM: with DSA, all tokens remain stored in the [[00-lexique/kv-cache|KV cache]] (in the compressed form of [[00-lexique/mla|MLA]])[^1]. What goes down is the amount of cache reread and computed for each token.

## 📚 To go deeper

- [[01-fondations/kv-cache-and-context|💾 KV Cache & Context]] *(section "When the model itself shrinks its memory")*

## 🔗 See also

- [[00-lexique/attention|Attention]]
- [[00-lexique/mla|MLA]]
- [[00-lexique/linear-attention|Linear attention]]
- [[00-lexique/context-window|Context window]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: DeepSeek-AI, *DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models* (arXiv:2512.02556, section 2.1: lightning indexer, 2,048 selected tokens, O(L²) → O(Lk), DSA implemented on MLA), December 2025. [https://arxiv.org/abs/2512.02556](https://arxiv.org/abs/2512.02556)
