---
title: TensorRT-LLM
description: NVIDIA SDK for compiling and running ultra-optimized LLM inference on datacenter GPUs.
aliases:
  - TensorRT LLM
  - TRT-LLM
tags:
  - lexique
  - fondations
---


## 📝 Short definition
Official NVIDIA SDK that compiles an LLM into a proprietary engine tuned to squeeze maximum performance from datacenter GPUs (H100, B200).

## 📖 Detailed definition
TensorRT-LLM works **Ahead-of-Time (AoT)**: before serving requests, the model is compiled into an "engine" specific to the target GPU generation. That engine embeds very low-level kernel optimizations (Flash-Decoding, native FP8/FP4, operation fusion).

On Blackwell chips (B200, RTX 5090), TensorRT-LLM natively supports **FP4**, halving [[00-lexique/vram|VRAM]] footprint compared to FP8.

Contrast with vLLM: TensorRT-LLM hits a higher ceiling but is far harder to deploy (long compilation, GPU-specific, steep learning curve).

## 💡 Why it matters for on-prem AI
Essential to amortize professional accelerators in the datacenter. The reference stack for Scenario D.

## ⚠️ Common pitfalls
- AoT compilation is heavy and strictly tied to the target GPU generation: an H100 engine does not run on A100.
- Not suited to workstations or Macs.

## 📚 Go deeper
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference Engines]] *(llama.cpp / vLLM / TensorRT-LLM comparison)*
2. [[04-blueprints/scenario-d-datacenter|🏢 Scenario D: Datacenter]] *(TensorRT-LLM in production)*

## 🔗 See also
- [[00-lexique/vram|VRAM]]
- [[00-lexique/quantification|Quantization]]
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
