---
title: Prefill
description: Inference phase that processes the initial prompt in parallel before word-by-word generation.
aliases:
  - Prompt ingestion
tags:
  - lexique
  - fondations
---

## 📝 Short definition
Initialization phase where the model "reads" and encodes the entire user prompt before it starts writing its response.

## 🔬 How it works (not magic)
The model does not read text; it ingests a large grid of numbers (tokens converted to embeddings). During Prefill, the model cross-relates all those tokens in parallel (via the Attention mechanism) to understand context, and saves intermediate computations in memory. That requires massive compute.

## 💡 Why it matters for on-prem AI
Prefill directly affects the initial responsiveness feeling called [[00-lexique/ttft|TTFT]] (Time To First Token). If the prompt contains 100 pages of text, an undersized server can block for several minutes before showing the first word.

## 📚 Go deeper
*Not clear on the difference from generation? Follow this path:*
1. [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt]] *(the "it's not magic" chapter)*
2. [[01-fondations/kv-cache-and-context|💾 KV Cache]] *(what is stored during this phase)*
3. [[01-fondations/memory-bandwidth|🏎️ Memory Bandwidth]] *(hardware impact)*

## 🔗 See also
- [[00-lexique/inference|Inference (LLM)]]
- [[00-lexique/decoding|Decoding]]
