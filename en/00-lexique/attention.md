---
title: Attention (mechanism)
description: Core Transformer mechanism that lets each token weight the importance of other tokens in context.
aliases:
  - Self-attention
  - Attention mechanism
  - Multi-Head Attention
  - MHA
tags:
  - lexique
  - fondations
last_modified: "2026-11-17"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Computation that determines the relative importance of each token in context to build the representation of a given token — the heart of the Transformer.

## 📖 Detailed definition

For each token, the model computes three vectors from its [[00-lexique/embedding|embedding]]:
- **Query (Q)**: “what is this token looking for?”
- **Key (K)**: “what does each other token contain?”
- **Value (V)**: “what information to pull from each other token?”

The attention score between two tokens is the dot product Q·K. Those scores weight the Values to produce the token’s final representation. This calculation repeats in every Transformer layer.

**Link to KV Cache**: during [[00-lexique/prefill|Prefill]], K and V vectors for each token are computed and stored in the [[00-lexique/kv-cache|KV Cache]]. In [[00-lexique/decoding|Decoding]], the model reuses them without recomputing.

Attention cost is quadratic O(n²) in context length: doubling the prompt multiplies the cost of the attention part of prefill by 4 (the dense layers only cost 2 times more).

## 💡 Why it matters for on-prem AI

The quadratic cost of attention at Prefill explains why very long prompts (100K+ tokens) spike [[00-lexique/ttft|TTFT]]; VRAM saturation comes instead from the [[00-lexique/kv-cache|KV Cache]], which grows linearly with context — hence Flash Attention (computing without materializing the n² matrix) and GQA (smaller KV Cache).

## ⚠️ Common pitfalls

- O(n²) applies to prefill. In decoding, the KV Cache brings cost to O(n) per generated token.
- GQA (Grouped-Query Attention, used in Llama 3+) shrinks KV Cache size by sharing K/V heads across several Q heads — without removing attention itself.

## 📚 Go deeper

1. [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt]] *(Step 3: prefill and attention in action)*
2. [[01-fondations/kv-cache-and-context|💾 KV Cache & context]] *(what attention stores and why it weighs on VRAM)*

## 🔗 See also

- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/prefill|Prefill]]
- [[00-lexique/embedding|Embedding]]
- [[00-lexique/context-window|Context window]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
