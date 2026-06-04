---
title: LLM benchmark
description: Standardized test suite to compare capabilities, limits, and risks of language models.
aliases:
  - model benchmark
  - LLM leaderboard
tags:
  - lexique
  - evaluation
---

## 📝 Short definition

Standardized test measuring one or more capabilities of an [[00-lexique/llm|LLM]]: reasoning, code, factuality, instruction following, robustness, or performance.

## 📖 Detailed definition

An LLM benchmark helps compare models quickly, but it always measures a **specific protocol**. MMLU is not the same as SWE-bench; TruthfulQA is not the same as tokens/s.

Public benchmarks are a starting point, not a final decision.

## 💡 Why it matters for on-prem AI

Locally, the best model is not necessarily the top leaderboard entry. It must also fit [[00-lexique/vram|VRAM]], respect confidentiality, respond fast enough, and pass your domain tests.

## ⚠️ Common pitfalls

- Confusing leaderboard score with quality on your documents.
- Comparing models with different quantization, prompts, or engines.
- Ignoring local metrics: [[00-lexique/ttft|TTFT]], [[00-lexique/tokens-per-second|tokens/s]], stability, memory use.

## 🔗 See also

- [[06-mise-en-oeuvre/evaluate-local-model|Evaluate a local model]]
- [[00-lexique/llm-as-a-judge|LLM-as-a-judge]]
- [[00-lexique/ragas|RAGAS]]
