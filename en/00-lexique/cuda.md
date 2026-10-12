---
title: CUDA
description: "NVIDIA's software platform for programming its GPUs; most local AI engines target it first, which weighs on the choice of hardware for on-premise AI."
aliases:
  - Compute Unified Device Architecture
tags:
  - lexique
  - materiel
last_modified: "2026-10-11"
---

## 📝 Short definition

NVIDIA's software platform that lets programs use NVIDIA GPUs for computation, and therefore run AI models on these cards.

## 📖 Detailed definition

NVIDIA defines it as "a parallel computing platform and programming model" that speeds up computation by harnessing the GPU[^1]. It includes the driver, the compiler and optimized libraries on which frameworks (PyTorch) and inference engines ([[00-lexique/vllm|vLLM]], [[00-lexique/sglang|SGLang]], [[00-lexique/tensorrt-llm|TensorRT-LLM]]) rely.

CUDA only runs on NVIDIA hardware. Other vendors have their own stack:

| Vendor | Software stack | Role |
| :-- | :-- | :-- |
| NVIDIA | CUDA | reference of the AI ecosystem[^1] |
| AMD | ROCm | "the AMD open software stack for GPU-accelerated computing"[^2] |
| Apple | Metal, MLX | MLX is "an array framework for machine learning on Apple silicon"[^3] |

## 💡 Why it matters for on-premise AI

Something new (model, format, optimization) often lands on CUDA first. Choosing an NVIDIA machine simplifies installing the engines; choosing AMD or Apple means checking that the target engine and model are supported on ROCm or MLX.

## ⚠️ Common pitfalls

- Assuming a "GPU" tool works on any GPU: many only support CUDA, or support ROCm and Metal with a delay.
- Ignoring the version: an engine often requires a minimum CUDA and driver version.

## 📚 To go deeper

- [[02-materiel/apu-and-unified-memory|🧠 APU & Unified Memory]] *(CUDA, ROCm and MLX depending on the machine)*

## 🔗 See also

- [[00-lexique/vllm|vLLM]]
- [[00-lexique/tensorrt-llm|TensorRT-LLM]]
- [[00-lexique/soc|SoC]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: NVIDIA, *CUDA Programming Guide* ("CUDA is a parallel computing platform and programming model developed by NVIDIA… by harnessing the power of the GPU"), accessed 2026-10-11. [https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html)
[^2]: AMD, *What is ROCm?* ("ROCm is the AMD open software stack for GPU-accelerated computing"), accessed 2026-10-11. [https://rocm.docs.amd.com/en/latest/what-is-rocm.html](https://rocm.docs.amd.com/en/latest/what-is-rocm.html)
[^3]: Apple ml-explore, *MLX* — GitHub repository ("MLX is an array framework for machine learning on Apple silicon", unified memory model), accessed 2026-10-11. [https://github.com/ml-explore/mlx](https://github.com/ml-explore/mlx)
