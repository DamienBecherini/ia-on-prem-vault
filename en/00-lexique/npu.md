---
title: NPU
description: Neural Processing Unit — AI accelerator in modern SoCs, useful for some tasks but limited for large LLMs.
aliases:
  - Neural Processing Unit
tags:
  - lexique
  - materiel
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
| Apple Neural Engine | M4 Max | ~38 TOPS | No (Ollama/MLX → Metal GPU) |
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
