---
title: MoE
description: Mixture of Experts — architecture activating only some sub-networks per token, enabling huge models with controlled inference cost.
aliases:
  - Mixture of Experts
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Neural network architecture splitting the model into specialized “experts.” Per token, routing activates only a small subset — lowering compute cost versus a dense model of the same total size.

## 📖 Detailed definition

In a classic dense model (Llama, Mistral…), **all parameters** activate for every token. In MoE, only **top-k experts** (typically 2–8 of 64+) participate per step.

Concrete examples in 2026:

| Model | Total parameters | Active parameters/token | VRAM required (Q4) |
| :-- | :-- | :-- | :-- |
| Llama 3.1 70B (dense) | 70 B | 70 B | ~40 GB |
| DeepSeek V3 (MoE) | 671 B | ~37 B active | ~390 GB (full weights) |
| Qwen3-A3B (MoE) | ~30 B | ~3 B active | ~18 GB |
| Mixtral 8x7B | 47 B | ~13 B active | ~26 GB in Q4 |

MoE offers **large-model quality** with **smaller-model compute cost** — but requires loading **all experts in VRAM** even when most stay inactive.

## 💡 Why it matters for on-prem AI

Small active-parameter MoEs (Qwen3-A3B, Phi-MoE) suit APUs well: good answer quality, acceptable VRAM, good generation throughput.

Giant MoEs (DeepSeek V3: 390 GB) need multi-GPU or multi-node clusters — Scenarios C or D.

## ⚠️ Common pitfalls

- Comparing a “671B” MoE to a “70B” dense assuming dense is always faster: throughput depends on **active** parameters, not total.
- Partial MoE loading: if experts do not fit in VRAM, swap is catastrophic because missing experts are invoked unpredictably.
- Underestimating VRAM: all weights must load even if only 2/64 experts activate per token.

## 📚 Go deeper

- [[01-fondations/quantization-4bit-8bit|🗜️ Quantization]]
- [[01-fondations/kv-cache-and-context|💾 KV Cache & context]]

## 🔗 See also

- [[00-lexique/llm|LLM]]
- [[00-lexique/quantification|Quantization]]
- [[00-lexique/tokens-per-second|Tokens per second]]
- [[00-lexique/vram|VRAM]]
