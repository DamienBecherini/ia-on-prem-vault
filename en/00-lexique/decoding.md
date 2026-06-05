---
title: Decoding
description: Autoregressive token-by-token generation phase.
aliases:
  - Autoregressive generation
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---

## 📝 Short definition

Phase where the model generates its answer sequentially, predicting one token (word), adding it to context, then predicting the next, and so on.

## 🔬 How it works (not magic)

Once the initial prompt has been read ([[00-lexique/prefill|Prefill]] phase), the model enters a generation loop. To guess the next word, it does not recompute full history: it reads past states stored in the [[00-lexique/kv-cache|KV Cache]]. Because it generates one word at a time, the processor often waits for memory (VRAM) to deliver cache and model data.

## 💡 Why it matters for on-prem AI

This phase governs the “tokens/s” throughput users see. Here you hit the [[00-lexique/memory-wall|Memory Wall]]: speed is limited by memory pipes, not chip compute power.

## 📚 Go deeper

*Not clear why it’s slow? Follow this path:*
1. [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt]] *(“It’s not magic” chapter)*
2. [[01-fondations/memory-bandwidth|🏎️ Memory bandwidth & the Memory Wall]] *(physical explanation)*
3. [[00-lexique/tokens-per-second|Tokens per second]] *(key metric)*

## 🔗 See also

- [[00-lexique/inference|LLM inference]]
- [[00-lexique/kv-cache|KV Cache]]
