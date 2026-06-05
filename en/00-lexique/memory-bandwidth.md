---
title: Memory bandwidth
description: Rate at which memory feeds compute units.
aliases:
  - Memory bandwidth
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---

## 📝 Short definition

Data transferred per second between memory and CPU/GPU, usually in GB/s.

## 📖 Detailed definition

Higher bandwidth lets the model be “re-read” faster during generation.
Quick local inference estimate: theoretical tokens/s ≈ memory GB/s divided by model size in GB.

## 💡 Why it matters for on-prem AI

Key indicator for predicting generation smoothness on large LLMs.

## ⚠️ Common pitfalls

- Treating the tokens/s formula as a guaranteed real value.
- Confusing local memory bandwidth with network bandwidth.

## 🔗 See also

- [[00-lexique/memory-wall|Memory Wall]]
- [[00-lexique/tokens-per-second|Tokens per second]]
- [[01-fondations/memory-bandwidth|🏎️ Memory bandwidth & the Memory Wall]]
