---
title: MLA (Multi-head Latent Attention)
description: "Attention variant that stores one small compressed vector per token in the KV cache instead of the full keys and values, introduced by DeepSeek-V2."
aliases:
  - Multi-head Latent Attention
  - MLA
tags:
  - lexique
  - fondations
last_modified: "2026-10-11"
---

## 📝 Short definition

A way of computing attention that keeps **a compressed summary** of each token in memory (a "latent vector") instead of its full keys (K) and values (V). The [[00-lexique/kv-cache|KV cache]] becomes much smaller.

## 📖 Detailed definition

In classic [[00-lexique/attention|attention]], each layer of the model stores, for each token, one K vector and one V vector per attention head. MLA compresses this information into **a single small vector** per token and per layer. At compute time, the model "unfolds" this vector to recover the K and V it needs.

An analogy: instead of keeping full notes on every speaker in a meeting, you keep a summary of a few lines from which you can recover the essentials.

MLA was introduced by DeepSeek-V2 (May 2024). The paper reports a KV cache reduced by 93.3% compared with DeepSeek 67B, and a cache equivalent to that of a GQA with only 2.25 groups, with better results than classic attention[^1]. DeepSeek-V3 kept it[^2], and Moonshot AI's Kimi K2 uses it too[^3].

## 💡 Why it matters for on-premise AI

On an on-premise server, the VRAM available for the cache limits conversation length and the number of concurrent users. A model with MLA uses far less cache per token than a classic model of comparable size. The usual GQA formula does not apply: it greatly overestimates the memory needed.

## ⚠️ Common pitfalls

- Sizing an MLA model with the GQA formula ($2 \times L \times H_{kv} \times D$…): the result is heavily overestimated. Start from the model card or from the cache size reported by the engine.
- Confusing MLA with [[00-lexique/sparse-attention|sparse attention]]: MLA reduces the **space** taken by each token; sparse attention reduces the number of tokens **reread**.

## 📚 To go deeper

- [[01-fondations/kv-cache-and-context|💾 KV Cache & Context]] *(section "When the model itself shrinks its memory": MLA, sparse attention, linear attention)*

## 🔗 See also

- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/attention|Attention]]
- [[00-lexique/sparse-attention|Sparse attention]]
- [[00-lexique/linear-attention|Linear attention]]
- [[00-lexique/moe|MoE]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: DeepSeek-AI, *DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model* (arXiv:2405.04434; KV cache compressed into a latent vector, −93.3% vs DeepSeek 67B, equivalent to GQA with 2.25 groups), May 2024. [https://arxiv.org/abs/2405.04434](https://arxiv.org/abs/2405.04434)
[^2]: DeepSeek-AI, *DeepSeek-V3 Technical Report* (arXiv:2412.19437; MLA and DeepSeekMoE), December 2024. [https://arxiv.org/abs/2412.19437](https://arxiv.org/abs/2412.19437)
[^3]: Moonshot AI, *Kimi-K2-Instruct* (attention mechanism "MLA"), July 2025. [https://huggingface.co/moonshotai/Kimi-K2-Instruct](https://huggingface.co/moonshotai/Kimi-K2-Instruct)
