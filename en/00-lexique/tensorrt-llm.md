---
title: TensorRT-LLM
description: NVIDIA SDK for optimized LLM inference (native PyTorch, FP8/NVFP4) on datacenter GPUs.
aliases:
  - TensorRT LLM
  - TRT-LLM
tags:
  - lexique
  - fondations
last_modified: "2026-11-20"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Short definition
Official NVIDIA SDK for LLM inference with a native PyTorch architecture, low-level kernels (FP8/NVFP4, optimized attention) and an OpenAI-compatible `trtllm-serve` server, to squeeze maximum performance from datacenter GPUs (H100, B200)[^1].

## 📖 Detailed definition
TensorRT-LLM is built on a native PyTorch architecture: the model is loaded and served directly (`trtllm-serve`, Python LLM API), with optimizations (FP8/NVFP4, operation fusion, paged attention) applied at runtime. The legacy TensorRT backend and its compilation tools (`trtllm-build`) have been removed: there is no longer any upfront "engine" compilation (version history in [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference Engines]])[^1].

On datacenter Blackwell (B200, B300), TensorRT-LLM natively supports **NVFP4**, halving [[00-lexique/vram|VRAM]] footprint compared to FP8; on SM120 cards (RTX 5090, RTX PRO 6000) support remains partial as of Q3 2026 (NVFP4 MoE models not supported according to the release notes)[^3].

Contrast with vLLM: TensorRT-LLM targets the performance ceiling on NVIDIA GPUs, but its release cycle is less legible (see the pitfalls below) and breaking changes between RCs are frequent; the learning curve remains steeper[^1][^2].

## 💡 Why it matters for on-prem AI
Essential to amortize professional accelerators in the datacenter. The reference stack for Scenario D.

## ⚠️ Common pitfalls
- Confusing the stable version with *release candidates*: as of Q4 2026, the latest stable is 1.3.0 (November 20, 2026, released after 30 RCs), while 1.4 is already in *release candidates* (1.4.0rcN); the RCs bring new models and kernels but change API from one RC to the next, and the move from 1.2.x to 1.3.0 includes breaking changes (e.g. CLI > YAML precedence). Pin the version in production and read the release notes before upgrading[^1][^4].
- Since 1.3, anonymous usage telemetry is enabled by default: on a sovereign or air-gapped deployment, disable it (`TRTLLM_NO_USAGE_STATS=1`, `DO_NOT_TRACK=1` or `--no-telemetry`)[^4].
- Not suited to Macs; on workstations, support is limited to DGX Spark (single-node beta since 1.2) and to RTX PRO 6000 / RTX 50 with known issues in Q3 2026[^1][^3].

## 📚 Go deeper
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference Engines]] *(llama.cpp / vLLM / TensorRT-LLM comparison)*
2. [[04-blueprints/scenario-d-datacenter|🏢 Scenario D: Datacenter]] *(TensorRT-LLM in production)*

## 🔗 See also
- [[00-lexique/vram|VRAM]]
- [[00-lexique/quantification|Quantization]]
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: NVIDIA, *TensorRT-LLM Release Notes* (1.0: PyTorch by default; 1.2: TensorRT backend and `trtllm-build` removed; 1.3 RC: TRITON MoE backend deprecated), accessed 2026-10-09. <https://nvidia.github.io/TensorRT-LLM/release-notes.html>
[^2]: PyPI, `tensorrt-llm` (version history: 1.3.0 stable of 2026-11-20, 1.4.0rc0 → rc4), accessed 2026-11-20. <https://pypi.org/project/tensorrt-llm/>
[^3]: NVIDIA, *TensorRT-LLM — Releases* (1.3.0rc26 / rc27 notes: SM120 known issues, NVFP4 MoE models not supported on RTX 50 / RTX PRO 6000), September 2026. <https://github.com/NVIDIA/TensorRT-LLM/releases>
[^4]: NVIDIA, *TensorRT-LLM — Release v1.3.0* (first stable release of the 1.3 line after 30 RCs; usage telemetry enabled by default, can be disabled with `TRTLLM_NO_USAGE_STATS=1`, `DO_NOT_TRACK=1` or `--no-telemetry`), November 20, 2026. <https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.3.0>
