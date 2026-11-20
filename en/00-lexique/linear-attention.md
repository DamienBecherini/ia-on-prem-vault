---
title: Linear attention
description: "Family of attention that summarizes the context in a fixed-size state instead of a growing KV cache; often mixed with a few classic layers (hybrid)."
aliases:
  - Linear attention
  - Hybrid linear attention
  - Gated DeltaNet
  - Kimi Delta Attention
  - KDA
  - Lightning Attention
tags:
  - lexique
  - fondations
last_modified: "2026-11-20"
---

## 📝 Short definition

A variant of [[00-lexique/attention|attention]] that keeps the memory of the context in **a fixed-size state**, updated at each token, instead of a [[00-lexique/kv-cache|KV cache]] that grows with the conversation.

## 📖 Detailed definition

With classic attention, each token adds its keys and values to the cache: memory grows in proportion to the context. Linear attention replaces this cache with **a fixed-size notebook**: at each token, the model erases a little, corrects and adds the essentials. The notebook does not grow, even over 1 million tokens.

Recent variants add a forgetting mechanism (*gating*) to erase quickly and a "delta rule" to correct a specific piece of information (Gated DeltaNet)[^1]. Because a fixed notebook retains fewer details than a full cache, models keep **a few classic attention layers**: this is called a **hybrid** architecture (Gated DeltaNet in Qwen3-Next and Qwen3.8-27B, Kimi Delta Attention in Kimi Linear, Lightning Attention in MiniMax-M1; ratios and gains in [[01-fondations/kv-cache-and-context|💾 KV Cache & Context]]).

## 💡 Why it matters for on-premise AI

These models accept very long contexts with far less cache VRAM. When sizing a server, the classic GQA formula overestimates them: only a minority of layers stores a real KV cache.

## ⚠️ Common pitfalls

- Applying the KV cache formula to every layer of the model: only the classic attention layers have one.
- Assuming every engine supports them: check your engine's model list and its minimum version.

## 📚 To go deeper

- [[01-fondations/kv-cache-and-context|💾 KV Cache & Context]] *(section "When the model itself shrinks its memory")*

## 🔗 See also

- [[00-lexique/attention|Attention]]
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/mla|MLA]]
- [[00-lexique/sparse-attention|Sparse attention]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: S. Yang, J. Kautz, A. Hatamizadeh, *Gated Delta Networks: Improving Mamba2 with Delta Rule* (arXiv:2412.06464), December 2024. <https://arxiv.org/abs/2412.06464>
