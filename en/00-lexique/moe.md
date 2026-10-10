---
title: MoE
description: Mixture of Experts — architecture activating only some sub-networks per token, enabling huge models with controlled inference cost.
aliases:
  - Mixture of Experts
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

Neural network architecture splitting the model into specialized “experts.” Per token, routing activates only a small subset — lowering compute cost versus a dense model of the same total size.

## 📖 Detailed definition

In a classic dense model (Llama, Mistral…), **all parameters** activate for every token. In MoE, only **top-k experts** (typically 2–8 of 64+) participate per step.

Concrete examples in 2026:

| Model | Total parameters | Active parameters/token | VRAM required (Q4) |
| :-- | :-- | :-- | :-- |
| Llama 3.1 70B (dense) | 70 B | 70 B | ~40 GB |
| DeepSeek-V4.1-Flash (MoE, MIT) | 552 B + 196 B of Engram memory | 8 B (prefill) / 16 B (decode) | ~750 GB in FP8 (8-GPU node)[^1] |
| Kimi K3 (MoE, custom license) | 2,800 B | 104 B (16 of 896 experts) | ~1.4 TB in native MXFP4[^2] |
| Qwen3-30B-A3B (MoE, Apache 2.0) | ~30 B | ~3 B active (8 of 128 experts) | ~18 GB in Q4[^3] |
| Nemotron 3.5 Lightning 30B-A3B (hybrid Mamba-2 + MoE, OpenMDW) | ~30 B | ~3 B active | ~22 GB in official NVFP4[^4] |
| GLM-5.3-Flash (MoE, MIT) | 320 B | 18 B active | ~320 GB in FP8 (8-GPU node)[^5] |

MoE offers **large-model quality** with **smaller-model compute cost** — but requires loading **all experts in VRAM** even when most stay inactive.

## 💡 Why it matters for on-prem AI

Small active-parameter MoEs (Qwen3-A3B, Phi-MoE) suit APUs well: good answer quality, acceptable VRAM, good generation throughput.

Giant MoEs (DeepSeek V4.1: > 750 GB in FP8; Kimi K3: > 1.4 TB even in native 4-bit; the 2024 DeepSeek V3 already weighed 404 GB in Q4_K_M) need an 8-GPU node or a multi-node cluster — Scenarios C or D[^1][^2].

Watch the licenses: the open frontier MoEs of 2026 (Kimi K3, GLM-5.3, Qwen3.8-2.4T-A95B) ship under custom licenses to read before any commercial use; only small to mid-sized MoEs (Qwen3-30B-A3B, GLM-5.3-Flash, DeepSeek V4 / V4.1, Nemotron 3.5) remain under Apache 2.0, MIT or OpenMDW. On Ollama, `kimi-k3:cloud` or `glm-5.2:cloud` are **hosted** tags, not downloadable weights (see [[03-stack-logicielle/choose-your-model|🗺️ Choose your model]]).

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

[^1]: DeepSeek AI, *DeepSeek-V4.1-Flash* (MIT; 552 B + 196 B of Engram conditional memory, 8 B active in prefill / 16 B in decode, FP4 KV cache), 2026. [https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash); unsloth, *DeepSeek-V3-GGUF* (Q4_K_M ≈ 404 GB), January 2025. [https://huggingface.co/unsloth/DeepSeek-V3-GGUF](https://huggingface.co/unsloth/DeepSeek-V3-GGUF)
[^2]: Moonshot AI, *Kimi K3* (2.8 T parameters, 104 B active, 16 routed experts of 896 + 2 shared, native MXFP4 via QAT, Kimi K3 License), July 2026. [https://huggingface.co/moonshotai/Kimi-K3](https://huggingface.co/moonshotai/Kimi-K3)
[^3]: Qwen, *Qwen3-30B-A3B* (30.5 B total, 3.3 B activated, 8 of 128 experts, Apache 2.0), 2025. [https://huggingface.co/Qwen/Qwen3-30B-A3B](https://huggingface.co/Qwen/Qwen3-30B-A3B)
[^4]: NVIDIA, *NVIDIA-Nemotron-3.5-Lightning-30B-A3B* (hybrid Mamba-2 + MoE + attention, 30 B / 3 B active, OpenMDW 1.1; NVFP4 checkpoint ≈ 21.6 GB recommended for deployment), August 2026. [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16) · [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4)
[^5]: Z.ai, *GLM-5.3-Flash* (320 B total, 18 B active, hybrid sparse + linear attention, MIT), 2026. [https://huggingface.co/zai-org/GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash)
