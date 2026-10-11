---
title: Speculative Decoding
description: "Inference acceleration technique where a small fast model proposes tokens that the large model verifies in a single pass; both models must be loaded."
aliases:
  - Speculative Decoding
  - speculative sampling
tags:
  - lexique
  - fondations
  - inférence
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Short definition

Inference acceleration technique where a **small fast model** ("draft model") generates candidate tokens ahead of time, then a **large model** ("target model") verifies and corrects the batch in a single parallel pass.

## 📖 Detailed definition

The bottleneck in LLM generation is its **autoregressive** nature: each token must wait for the previous one before being computed. Speculative decoding works around this constraint in two phases:

1. **Draft phase:** a lightweight model (e.g. a 1B or 7B) generates γ candidate tokens in γ fast passes.
2. **Verification phase:** the large target model evaluates the γ candidates **in a single parallel forward pass** — as fast as generating 1 token. It accepts valid tokens and rejects incorrect ones from the first mismatch.

If the draft model correctly predicts k tokens out of γ, you get k+1 tokens at the cost of a single call to the large model.

```
Draft model (7B)  →  [tok1, tok2, tok3, tok4]  (4 candidate tokens)
                              ↓
Target model (70B) →  ✅ tok1  ✅ tok2  ❌ tok3  [stop, correction]
                     →  Result: tok1, tok2, tok3-corrected  (3 tokens in 1 pass)
```

### Efficiency condition

Real gains depend on the **acceptance rate** of candidate tokens. When the draft model correctly predicts 70 to 90% of tokens (strong distribution correlation with the target model), acceleration is significant. If the acceptance rate is low (< 50%), frequent verifications cancel the benefit.

> [!warning] Memory prerequisite — critical point on-premise
> Speculative decoding requires loading **two models simultaneously** in memory: the draft model and the target model. On a machine with 24 GB of VRAM (e.g. RTX 4090), this is often impractical for 70B models. The technique becomes relevant on systems with **128 GB+ unified memory** (e.g. [[02-materiel/apu-and-unified-memory|Mac Studio M3 Ultra, AMD Gorgon Halo, NVIDIA DGX Spark]]) or on **multi-GPU servers** with enough cumulative VRAM.

## ⚙️ Support in vLLM

[[03-stack-logicielle/inference-engines-vllm-ollama|vLLM]] supports speculative decoding via the `--speculative-config` parameter (JSON object) at server startup; the former `--speculative-model` flag no longer appears in the documentation as of 2026-10-10 [^1]:

```bash
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --speculative-config '{"method": "draft_model", "model": "meta-llama/Llama-3.2-1B-Instruct", "num_speculative_tokens": 5}'
```

The `num_speculative_tokens` key (γ) controls how many tokens the draft model generates at each step. A value between 3 and 8 is generally recommended per vLLM docs.

> [!note] Eagle / Eagle-2 variant
> vLLM also supports advanced variants like **Eagle** (draft model trained specifically to align with the target), which can achieve a higher acceptance rate than a generic draft model. See vLLM documentation for available Eagle models.

## 💡 Why it matters for on-prem AI

For a sovereign stack with a single 70B model in service, speculative decoding can reduce perceived user latency (TTFT and generation time) without changing hardware — provided you have the memory capacity for the second model.

It is particularly attractive on high-capacity blueprints ([[02-materiel/apu-and-unified-memory|128 GB+ unified memory]]) where loading a 1B–7B draft model adds only a few extra gigabytes.

## ⚠️ Common pitfalls

- **Do not load the same model twice.** The draft model must be a *different*, smaller model aligned with the target.
- **Does not improve total throughput (multi-user).** The gain is on **per-request latency**. Under heavy concurrent load, [[00-lexique/pagedattention|PagedAttention]] and continuous batching remain priorities.
- **Incompatible with some quantization modes.** Very aggressive quantizations (Q2) can degrade acceptance rate and cancel the benefit.
- **Gain figures: highly variable.** Do not cite a speed multiplier without specifying the model, draft model, measured acceptance rate, and batch size.

## 📚 To understand in depth

1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference Engines — vLLM]] *( `--speculative-config` parameter, configuration)*
2. [[02-materiel/apu-and-unified-memory|🧠 APU & Unified Memory]] *(hardware prerequisite: 128 GB+)*
3. [[01-fondations/kv-cache-and-context|💾 KV Cache & Context]] *(understanding why autoregressivity is the bottleneck)*

## 🔗 See also

- [[00-lexique/inference|Inference]]
- [[00-lexique/tokens-per-second|Tokens per second]]
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/pagedattention|PagedAttention]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

## 📚 Sources

[^1]: vLLM Project, *Speculative Decoding* — official documentation (`--speculative-config` with the `method`, `model`, `num_speculative_tokens` keys; draft model, EAGLE, MTP, n-gram variants), accessed 2026-10-10. [https://docs.vllm.ai/en/stable/features/speculative_decoding/](https://docs.vllm.ai/en/stable/features/speculative_decoding/)
