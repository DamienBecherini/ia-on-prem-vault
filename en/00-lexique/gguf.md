---
title: GGUF
description: Portable file format for local inference with llama.cpp, optimized for K-quant quantization.
aliases:
  - GPT-Generated Unified Format
  - GGUF format
tags:
  - lexique
  - fondations
last_modified: "2026-10-10"
last_verified: "2026-10-09"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Single portable file format bundling weights, metadata, and [[00-lexique/quantification|quantization]] schema for local inference via llama.cpp/Ollama.

## 📖 Detailed definition

GGUF (successor to GGML) packs everything the engine needs: quantized weights, tokenizer, hyperparameters, and metadata. **K-quant** variants (e.g. `Q4_K_M`, `Q5_K_S`) offer different size/quality trade-offs via block-wise quantization schemes.

Major advantages: immediate load without compilation, portability across CPU/GPU/Mac, and native partial [[00-lexique/offloading|offloading]] to RAM when VRAM is insufficient.

## 💡 Why it matters for on-prem AI

De facto standard for workstations, Macs, and homelabs. A large share of Hub models have a GGUF version (often community-made: unsloth, bartowski, ggml-org); on Apple Silicon, Ollama has run supported architectures via MLX rather than GGUF since 0.40 (September 2026), and vendors first publish official FP8/NVFP4 checkpoints[^2]. Essential for Scenario A (dev lab) and Scenario B (Mac Studio).

## ⚠️ Common pitfalls

- GGUF/llama.cpp can serve multiple users (continuous batching enabled by default in `llama-server`, parallel slots via `-np`), but without vLLM/SGLang's paged memory management or multi-GPU parallelism: beyond a handful of concurrent users on a heavy model, per-user throughput collapses faster than with a production GPU engine[^1].
- Quantization variants (Q2 through Q8) differ sharply — Q2 and Q3_K_S clearly degrade quality (a measured loss of 4 points on average on downstream tasks for Q3_K_S on Llama 3.1-8B)[^3].

## 📚 Go deeper

1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]] *(GGUF + llama.cpp vs vLLM in production)*
2. [[01-fondations/quantization-4bit-8bit|🗜️ 4-bit & 8-bit quantization]] *(precision schemes behind K-quants)*

## 🔗 See also

- [[00-lexique/quantification|Quantization]]
- [[00-lexique/quantification-q4|Q4 quantization]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: ggml-org, *llama.cpp — llama-server README* ("Continuous batching", "Parallel decoding with multi-user support", `-cb` enabled by default, `-np N`), read on 2026-10-09. [https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
[^2]: Ollama, *Release v0.40.0* ("Models run on MLX on Apple Silicon by default"), 25 September 2026; NVIDIA, *NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16* (official BF16 / NVFP4 checkpoints, GGUF provided via ggml-org), August 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0) · [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16)
[^3]: J. Wang et al., *Which Quantization Should I Use? A Unified Evaluation of llama.cpp Quantization on Llama-3.1-8B-Instruct* (arXiv:2601.14277: Q3_K_S loses about 4 points on average on downstream tasks), January 2026. [https://arxiv.org/abs/2601.14277](https://arxiv.org/abs/2601.14277)
