---
title: Quantization
description: Reducing numerical precision of LLM weights to lower memory footprint and speed up inference.
aliases:
  - Quantification
tags:
  - lexique
  - fondations
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
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
| Q2_K | ~0.3–0.4 | ~25 GB | Significant[^4] |

Three main families of methods:

- **GGUF / llama.cpp**: portable format for Ollama and workstations. Includes Q2 through Q8 variants; the "K" variants (K-quants) split weights into 256-value super-blocks with several scales and keep sensitive tensors at higher precision, which preserves quality better at equal size[^1].
- **AWQ / GPTQ**: 4-bit quantizations for GPUs (AWQ protects ~1% of salient weights based on activations; GPTQ compensates rounding using the Hessian), optimized for vLLM/SGLang with dedicated kernels. Quality comparable to K-quants at equal bits, higher GPU throughput[^3].
- **FP8 / FP4**: low-resolution floating precisions. FP8 is native on Hopper (H100, H200) and Blackwell; FP4 (NVFP4, MXFP4) is native on Blackwell only (B200, RTX 50, RTX PRO 6000, DGX Spark). Since 2026, vendors ship FP4 weights directly (gpt-oss and Kimi K3 in MXFP4; Nemotron 3.5 Lightning in NVFP4, ≈ 22 GB), including for workstation GPUs[^2].

Fourth trend in 2026: **quantization-aware training** (QAT). Kimi K3 is trained in MXFP4 from the SFT phase onward, and NVIDIA publishes Nemotron 3.5 Lightning in NVFP4 as the "recommended path for deployment", with BF16 weights reserved for post-training. The vendor's 4-bit checkpoint then becomes the canonical version, and re-quantizing it yourself brings nothing[^2].

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

[^1]: J. Wang et al., *Which Quantization Should I Use? A Unified Evaluation of llama.cpp Quantization on Llama-3.1-8B-Instruct* (arXiv:2601.14277; description of K-quants by super-blocks), January 2026. [https://arxiv.org/abs/2601.14277](https://arxiv.org/abs/2601.14277)
[^2]: OpenAI, *gpt-oss-120b* ("post-trained with MXFP4 quantization of the MoE weights", 20b in 16 GB, Apache 2.0), August 2025. [https://huggingface.co/openai/gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b); Moonshot AI, *Kimi K3* ("MXFP4 weights / MXFP8 activations (quantization-aware training)" from SFT onward), July 2026. [https://huggingface.co/moonshotai/Kimi-K3](https://huggingface.co/moonshotai/Kimi-K3); NVIDIA, *NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4* (≈ 21.6 GB of safetensors; "the NVFP4 release is the recommended path" for deployment), August 2026. [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4)
[^3]: J. Lin et al., *AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration* (arXiv:2306.00978), 2023; E. Frantar et al., *GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers* (arXiv:2210.17323), 2022. [https://arxiv.org/abs/2306.00978](https://arxiv.org/abs/2306.00978) · [https://arxiv.org/abs/2210.17323](https://arxiv.org/abs/2210.17323)
[^4]: unsloth, *DeepSeek-V3-GGUF* (Q2_K_XS ≈ 221 GB for 671 B, i.e. ≈ 2.6 bits/weight; Q4_K_M ≈ 404 GB), January 2025; J. Wang et al., arXiv:2601.14277 (effective bits of K-quants), January 2026. [https://huggingface.co/unsloth/DeepSeek-V3-GGUF](https://huggingface.co/unsloth/DeepSeek-V3-GGUF) · [https://arxiv.org/abs/2601.14277](https://arxiv.org/abs/2601.14277)
