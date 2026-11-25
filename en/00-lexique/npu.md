---
title: NPU
description: Neural Processing Unit — AI accelerator in modern SoCs, useful for some tasks but limited for large LLMs.
aliases:
  - Neural Processing Unit
tags:
  - lexique
  - materiel
last_modified: "2026-11-25"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Hardware accelerator specialized for neural-network ops, integrated in most modern SoCs (Apple Neural Engine, AMD XDNA, Qualcomm Hexagon, Intel NPU).

## 📖 Detailed definition

An NPU is optimized for low-precision matrix ops (INT8, INT4) with very low power draw. It excels at **light, repetitive** tasks: speech recognition, image classification, short translation, keyword spotting.

For **large LLMs** (7B+), NPUs are usually unused by current inference engines for two reasons:

1. **Insufficient memory capacity**: the NPU accesses system memory on channels often more limited than the iGPU.
2. **Weak software support**: Ollama, llama.cpp, and vLLM do not route to NPUs — they use Metal (Apple), ROCm (AMD), or CUDA (NVIDIA).

| NPU | SoC | TOPS (INT8) | Used for LLM? |
| :-- | :-- | :-- | :-- |
| Apple Neural Engine | M5 Max / M5 Ultra (16 / 32 cores) | not published by Apple[^1] | No: Ollama (MLX) runs its computations on the Metal GPU and, on macOS 26.2+, on its Neural Accelerators[^1] |
| AMD XDNA 2 | Gorgon Halo | ~50 TOPS | No (ROCm/Vulkan → iGPU) |
| Qualcomm Hexagon | Snapdragon X Elite | ~45 TOPS | Partially (Copilot+ on Windows) |

## 💡 Why it matters for on-prem AI

The NPU matters for **edge and embedded** tasks: local transcription, data filtering, video streams. For an on-prem LLM assistant appliance, the NPU is transparent — the iGPU does the work.

## ⚠️ Common pitfalls

- Buying an “AI PC” on NPU TOPS for LLM inference: GPU memory bandwidth matters, not NPU TOPS.
- Confusing vendor NPU benchmarks (INT4-tuned tasks) with general LLM performance.

## 📚 Go deeper

- [[02-materiel/apu-and-unified-memory|🧠 APU & unified memory]]
- [[01-fondations/memory-bandwidth|🏎️ Memory bandwidth]]

## 🔗 See also

- [[00-lexique/apu|APU]]
- [[00-lexique/unified-memory|Unified memory]]
- [[00-lexique/tokens-per-second|Tokens per second]]

[^1]: Apple Newsroom, *Apple unleashes M5, the next big leap in AI performance for Apple silicon* (“faster” 16-core Neural Engine, a Neural Accelerator in each GPU core, programmable through Metal 4's Tensor APIs; no TOPS figure), October 15, 2025 · Apple Support, *Mac Studio (M5 Max or M5 Ultra) — Tech Specs* (16-core Neural Engine on M5 Max, 32-core on M5 Ultra, Neural Accelerators in the GPU), accessed 2026-11-25 · Apple Machine Learning Research, *Exploring LLMs with MLX and the Neural Accelerators in the M5 GPU* (MLX uses the GPU's Neural Accelerators through TensorOps and Metal Performance Primitives; macOS 26.2 or later required), November 19, 2025. <https://www.apple.com/newsroom/2025/10/apple-unleashes-m5-the-next-big-leap-in-ai-performance-for-apple-silicon/> · <https://support.apple.com/en-us/128107> · <https://machinelearning.apple.com/research/exploring-llms-mlx-m5>
