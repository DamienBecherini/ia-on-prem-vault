---
title: LLM benchmark
description: Standardized test suite to compare capabilities, limits, and risks of language models.
aliases:
  - model benchmark
  - LLM leaderboard
tags:
  - lexique
  - evaluation
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Standardized test measuring one or more capabilities of an [[00-lexique/llm|LLM]]: reasoning, code, factuality, instruction following, robustness, or performance.

## 📖 Detailed definition

An LLM benchmark helps compare models quickly, but it always measures a **specific protocol**. MMLU is not the same as SWE-bench Pro; TruthfulQA is not the same as tokens/s.

Public benchmarks are a starting point, not a final decision.

## 💡 Why it matters for on-prem AI

Locally, the best model is not necessarily the top leaderboard entry. It must also fit [[00-lexique/vram|VRAM]], respect confidentiality, respond fast enough, and pass your domain tests.

## ⚠️ Common pitfalls

- Confusing leaderboard score with quality on your documents.
- Comparing models with different quantization, prompts, or engines.
- Reading a saturated benchmark: when the best models exceed 95% (SWE-bench Verified in 2026, 97% at the top), the gap between two candidates is noise; move to the harder variant (SWE-bench Pro, Terminal-Bench)[^1].
- Comparing two scores from a composite index without checking the index version (Artificial Analysis v4.3 replaced sub-benchmarks on 7 September 2026)[^2].
- Confusing the overall ranking with the open-weights ranking: on Arena, no open-weights model is in the top 15 as of Q4 2026 — compare open models among themselves[^3].
- Ignoring local metrics: [[00-lexique/ttft|TTFT]], [[00-lexique/tokens-per-second|tokens/s]], stability, memory use.

## 🔗 See also

- [[06-mise-en-oeuvre/evaluate-local-model|Evaluate a local model]]
- [[00-lexique/llm-as-a-judge|LLM-as-a-judge]]
- [[00-lexique/ragas|RAGAS]]
- [[03-stack-logicielle/choose-your-model|Choose your local model]] — read a leaderboard without getting it wrong

[^1]: Vals AI, *SWE-bench Verified* ("performance on this benchmark has saturated, we no longer run this benchmark on new model releases", top 97.0%), updated 2026-09-01. [https://www.vals.ai/benchmarks/swebench](https://www.vals.ai/benchmarks/swebench)
[^2]: Artificial Analysis, *Intelligence Index v4.3* (Terminal-Bench 2.1 → 4.0, AutomationBench-AA, 45% private tasks), 2026-09-07. [https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3](https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3)
[^3]: Arena, *Text Leaderboard* (snapshot of 2026-10-08: no open-weights model in the top 15, kimi-k3-max at rank 16). [https://arena.ai/leaderboard/text](https://arena.ai/leaderboard/text)
