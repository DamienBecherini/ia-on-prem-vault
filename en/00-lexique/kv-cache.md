---
title: KV Cache
description: Cache of attention keys/values used during generation.
aliases:
  - Key-Value Cache
  - KV cache
tags:
  - lexique
  - fondations
---

## 📝 Short definition

Memory holding already-computed attention states to avoid costly recomputation.

## 📖 Detailed definition

In a Transformer, each new token reuses keys/values from prior tokens.
The KV cache speeds that reuse but increases memory use as context grows.

## 💡 Why it matters for on-prem AI

It strongly affects practical context capacity and stability on long conversations.

## 🔬 How it works (not magic)

Each generated token must consult all past context. Instead of recomputing history from scratch (quadratic cost), the model stores intermediate states (attention layer keys and values) computed during prefill — in VRAM.

## 📚 Go deeper

*Want to know why this cache can saturate your machine?*
1. [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt]] *(Step 4: how KV cache fills during prefill)*
2. [[01-fondations/kv-cache-and-context|💾 KV Cache & context]] *(full chapter: formula, GQA, PagedAttention)*
3. [[01-fondations/memory-bandwidth|🏎️ Memory bandwidth]] *(why cache size slows generation)*

## 🔗 See also

- [[00-lexique/context-window|Context window]]
- [[00-lexique/decoding|Decoding]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
