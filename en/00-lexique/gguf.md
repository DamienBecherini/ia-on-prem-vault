---
title: GGUF
description: Portable file format for local inference with llama.cpp, optimized for K-quant quantization.
aliases:
  - GPT-Generated Unified Format
  - GGUF format
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

Single portable file format bundling weights, metadata, and [[00-lexique/quantification|quantization]] schema for local inference via llama.cpp/Ollama.

## 📖 Detailed definition

GGUF (successor to GGML) packs everything the engine needs: quantized weights, tokenizer, hyperparameters, and metadata. **K-quant** variants (e.g. `Q4_K_M`, `Q5_K_S`) offer different size/quality trade-offs via block-wise quantization schemes.

Major advantages: immediate load without compilation, portability across CPU/GPU/Mac, and native partial [[00-lexique/offloading|offloading]] to RAM when VRAM is insufficient.

## 💡 Why it matters for on-prem AI

De facto standard for workstations, Macs, and homelabs. Most models on HuggingFace/Ollama ship as GGUF. Essential for Scenario A (dev lab) and Scenario B (Mac Studio).

## ⚠️ Common pitfalls

- GGUF is not ideal for multi-user production: llama.cpp lacks Continuous Batching like vLLM.
- Quantization variants (Q2 through Q8) differ sharply — Q2 can heavily hurt answer quality.

## 📚 Go deeper

1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]] *(GGUF + llama.cpp vs vLLM in production)*
2. [[01-fondations/quantization-4bit-8bit|🗜️ 4-bit & 8-bit quantization]] *(precision schemes behind K-quants)*

## 🔗 See also

- [[00-lexique/quantification|Quantization]]
- [[00-lexique/quantification-q4|Q4 quantization]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
