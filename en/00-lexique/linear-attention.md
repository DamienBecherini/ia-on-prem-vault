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
last_modified: "2026-10-11"
---

## 📝 Short definition

A variant of [[00-lexique/attention|attention]] that keeps the memory of the context in **a fixed-size state**, updated at each token, instead of a [[00-lexique/kv-cache|KV cache]] that grows with the conversation.

## 📖 Detailed definition

With classic attention, each token adds its keys and values to the cache: memory grows in proportion to the context. Linear attention replaces this cache with **a fixed-size notebook**: at each token, the model erases a little, corrects and adds the essentials. The notebook does not grow, even over 1 million tokens.

Recent variants add a forgetting mechanism (*gating*) to erase quickly and a "delta rule" to correct a specific piece of information (Gated DeltaNet)[^1]. Because a fixed notebook retains fewer details than a full cache, models keep **a few classic attention layers**: this is called a **hybrid** architecture. Examples:

- **Qwen3-Next** and **Qwen3.8-27B**: 3 Gated DeltaNet layers for 1 classic attention layer[^2].
- **Kimi Linear**: Kimi Delta Attention (KDA) with a fixed state, with one MLA layer every three KDA layers; up to 75% less KV cache compared with a full-MLA model, according to Moonshot AI[^3].
- **MiniMax-M1**: Lightning Attention, a variant of linear attention, with one classic layer every seven layers[^4].

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

[^1]: S. Yang, J. Kautz, A. Hatamizadeh, *Gated Delta Networks: Improving Mamba2 with Delta Rule* (arXiv:2412.06464), December 2024. [https://arxiv.org/abs/2412.06464](https://arxiv.org/abs/2412.06464)
[^2]: Qwen, *Qwen3-Next-80B-A3B-Instruct* (12 × (3 × Gated DeltaNet → 1 × Gated Attention)), 2025. [https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct); Qwen, *Qwen3.8-27B* (16 × (3 × Gated DeltaNet → 1 × Gated Attention)), August 2026. [https://huggingface.co/Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)
[^3]: Kimi Team, *Kimi Linear: An Expressive, Efficient Attention Architecture* (arXiv:2510.26692; fixed-size state, 3:1 KDA / MLA ratio, up to −75% KV cache vs full MLA), October 2025. [https://arxiv.org/abs/2510.26692](https://arxiv.org/abs/2510.26692)
[^4]: MiniMax, *MiniMax-M1* (arXiv:2506.13585; Lightning Attention, one softmax block after every seven linear blocks), June 2025. [https://arxiv.org/abs/2506.13585](https://arxiv.org/abs/2506.13585)
