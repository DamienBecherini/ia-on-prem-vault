---
title: Quantization
description: Reducing numerical precision of LLM weights to lower memory footprint and speed up inference.
aliases:
  - Quantification
tags:
  - lexique
  - fondations
---

## 📝 Short definition

Technique that reduces the numerical precision of model weights (e.g. FP16 → INT8 → Q4) to lower VRAM footprint and, in some cases, speed up inference.

## 📖 Detailed definition

An LLM stores its parameters as floating-point values. Native training precision is BF16 or FP16 (2 bytes per parameter). Quantization compresses those values toward less precise formats:

| Format | Bytes/parameter | 70B footprint | Quality loss |
| :-- | :-- | :-- | :-- |
| BF16 / FP16 | 2.0 | ~140 GB | Reference |
| INT8 / Q8 | 1.0 | ~70 GB | Very low |
| Q4_K_M | ~0.5 | ~40 GB | Low to moderate |
| Q2 | ~0.25 | ~18 GB | Significant |

Three main families of methods:

- **GGUF / llama.cpp**: portable format for Ollama and workstations. Includes Q2 through Q8 variants, with "K" (K-means) variants that preserve quality better.
- **AWQ / GPTQ**: activation-aware quantization, optimized for vLLM on production GPUs. Better quality preservation than GGUF Q4 at equal footprint.
- **FP8 / FP4**: low-resolution floating precisions natively supported on NVIDIA Hopper (H100) and Blackwell (H200, B200) GPUs — mainly relevant in datacenter.

## 💡 Why it matters for on-prem AI

Quantization is the number one lever for fitting a large model on your hardware. A 70B model inaccessible in BF16 (140 GB) becomes usable in Q4_K_M (~40 GB) on an APU with 128 GB of unified memory.

## ⚠️ Common pitfalls

- Confusing **weights** footprint (fixed) with **KV Cache** footprint (dynamic, depends on context). A Q4 model can still OOM if context is long.
- Assuming Q4 is always enough: on critical tasks (code editing, medical extraction), Q4 can measurably degrade reliability. Test with your golden dataset.
- Comparing benchmark scores between a BF16 model and a Q4 model as if they were identical.

## 📚 Go deeper

- [[01-fondations/quantization-4bit-8bit|🗜️ 4-bit & 8-bit Quantization]] — math mechanism, formula, perplexity/VRAM trade-off

## 🔗 See also

- [[00-lexique/quantification-q4|Q4_K_M Quantization]] — the most common practical format, uses and limits
- [[00-lexique/vram|VRAM]]
- [[00-lexique/gguf|GGUF]]
