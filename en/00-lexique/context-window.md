---
title: Context window
description: Maximum number of tokens an LLM can handle in active input — drives dynamic inference memory cost.
aliases:
  - Context window
  - Context size
tags:
  - lexique
  - fondations
---

## 📝 Short definition

Maximum number of tokens (prompt + history + response in progress) the model can “see” and use during inference. Beyond that limit, oldest tokens are ignored or truncated.

## 📖 Detailed definition

The context window determines two distinct things:

1. **What the model can read**: if your document is 50,000 tokens and the model has a 32K window, it cannot read everything in one request.
2. **Dynamic VRAM consumed**: each token in context uses space in the [[00-lexique/kv-cache|KV Cache]]. Longer windows mean a larger KV Cache.

Rough KV Cache sizes for a 70B model (Llama 3.1) by context length:

| Context | Estimated KV Cache (BF16) | KV Cache (Q8) |
| :-- | :-- | :-- |
| 4K tokens | ~4 GB | ~2 GB |
| 32K tokens | ~32 GB | ~16 GB |
| 128K tokens | ~128 GB | ~64 GB |

A 128K context can **double or triple** VRAM needs versus weights alone. In practice, context window size causes unexpected OOM on local machines.

## 💡 Why it matters for on-prem AI

On an APU with 128 GB allocated to the GPU, a 70B Q4 model (~40 GB) leaves ~88 GB for KV Cache — roughly ~88K tokens in BF16. Comfortable for most uses. On a 24 GB VRAM machine, KV Cache is the first knob to adjust.

## ⚠️ Common pitfalls

- Buying a “128K context” model assuming 4K and 128K perform the same: throughput ([[00-lexique/ttft|TTFT]] especially) degrades sharply on long contexts.
- Raising context via `--ctx-size` without checking available VRAM: OOM hits mid-conversation, not at launch.
- Treating RAG and context window as equivalent: RAG picks relevant passages to stay in a short window; a long window reads everything at once but costs more.

## 📚 Go deeper

- [[01-fondations/kv-cache-and-context|💾 KV Cache & context management]]
- [[01-fondations/quantization-4bit-8bit|🗜️ Quantization]]

## 🔗 See also

- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/rag|RAG]]
- [[00-lexique/vram|VRAM]]
