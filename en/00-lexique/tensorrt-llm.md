---
title: TensorRT-LLM
description: NVIDIA SDK for optimized LLM inference (native PyTorch, FP8/NVFP4) on datacenter GPUs.
aliases:
  - TensorRT LLM
  - TRT-LLM
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
Official NVIDIA SDK for LLM inference with a native PyTorch architecture, low-level kernels (FP8/NVFP4, optimized attention) and an OpenAI-compatible `trtllm-serve` server, to squeeze maximum performance from datacenter GPUs (H100, B200)[^1].

## 📖 Detailed definition
Since version 1.0 (September 2025), TensorRT-LLM is built on a native PyTorch architecture: the model is loaded and served directly (`trtllm-serve`, Python LLM API), with optimizations (FP8/NVFP4, operation fusion, paged attention) applied at runtime. Version 1.2 (March 2026) removed the legacy TensorRT backend and its compilation tools (`trtllm-build`): there is no longer any upfront "engine" compilation[^1].

On datacenter Blackwell (B200, B300), TensorRT-LLM natively supports **NVFP4**, halving [[00-lexique/vram|VRAM]] footprint compared to FP8; on SM120 cards (RTX 5090, RTX PRO 6000) support remains partial as of Q3 2026 (NVFP4 MoE models not supported according to the release notes)[^3].

Contrast with vLLM: TensorRT-LLM targets the performance ceiling on NVIDIA GPUs, but its release cycle is less legible (latest stable version 1.2.1 in April 2026, with 1.3 still in *release candidates* as of Q3 2026) and breaking changes between RCs are frequent; the learning curve remains steeper[^1][^2].

## 💡 Why it matters for on-prem AI
Essential to amortize professional accelerators in the datacenter. The reference stack for Scenario D.

## ⚠️ Common pitfalls
- Confusing the stable version (1.2.x) with the 1.3.0rcN *release candidates*: as of Q4 2026, the latest stable is 1.2.1 (April 2026); the RCs bring new models and kernels but change API from one RC to the next (e.g. CLI > YAML precedence since rc18). Pin the version in production[^1][^2].
- Not suited to workstations or Macs.

## 📚 Go deeper
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference Engines]] *(llama.cpp / vLLM / TensorRT-LLM comparison)*
2. [[04-blueprints/scenario-d-datacenter|🏢 Scenario D: Datacenter]] *(TensorRT-LLM in production)*

## 🔗 See also
- [[00-lexique/vram|VRAM]]
- [[00-lexique/quantification|Quantization]]
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: NVIDIA, *TensorRT-LLM Release Notes* (1.0: PyTorch by default; 1.2: TensorRT backend and `trtllm-build` removed; 1.3 RC: TRITON MoE backend deprecated), accessed 2026-10-09. [https://nvidia.github.io/TensorRT-LLM/release-notes.html](https://nvidia.github.io/TensorRT-LLM/release-notes.html)
[^2]: PyPI, `tensorrt-llm` (version history: 1.2.1 stable, 1.3.0rc29), accessed 2026-10-09. [https://pypi.org/project/tensorrt-llm/](https://pypi.org/project/tensorrt-llm/)
[^3]: NVIDIA, *TensorRT-LLM — Releases* (1.3.0rc26 / rc27 notes: SM120 known issues, NVFP4 MoE models not supported on RTX 50 / RTX PRO 6000), September 2026. [https://github.com/NVIDIA/TensorRT-LLM/releases](https://github.com/NVIDIA/TensorRT-LLM/releases)
