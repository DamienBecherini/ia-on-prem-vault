---
title: "vLLM"
description: "Open-source high-throughput LLM inference engine for NVIDIA/AMD GPUs, multi-user production standard."
aliases:
  - Virtual Large Language Model
tags:
  - lexique
  - stack
sidebar:
  order: 63
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
---

## 📝 Short definition

Open-source inference engine (Python/C++) designed to serve [[00-lexique/llm|LLMs]] at **high throughput** on dedicated GPUs, with advanced [[00-lexique/kv-cache|KV Cache]] management and concurrent requests[^1].

## 📖 Detailed definition

[vLLM](https://github.com/vllm-project/vllm) has become the on-premise reference for **multi-user** inference on servers with NVIDIA (CUDA) or AMD (ROCm) GPUs. Unlike workstation-oriented tools, vLLM targets **production**: OpenAI-compatible API, continuous batching, tensor parallelism, and FP8/AWQ quantization for recent architectures.

Its signature mechanism is [[00-lexique/pagedattention|PagedAttention]]: KV Cache is split into reusable blocks, reducing memory fragmentation and enabling many simultaneous requests without saturating [[00-lexique/vram|VRAM]][^2].

## 💡 Why it matters for on-prem AI

- **Scenarios B, C, and D** in this vault: SMB appliance, office cluster behind proxy, multi-GPU datacenter.
- Natural alternative to a cloud API when internal request volume justifies hardware amortization.
- Anchor point for [[06-mise-en-oeuvre/configure-vllm-multi-gpu|configuring vLLM multi-GPU]] and [[06-mise-en-oeuvre/migrate-ollama-to-vllm|migrating from Ollama]].

## ⚠️ Common pitfalls

- Deploying vLLM on a machine without a dedicated GPU or with massive RAM offloading: that is **not** its use case (prefer [[00-lexique/ollama|Ollama]] / llama.cpp).
- Comparing vLLM and [[00-lexique/ollama|Ollama]] on a single sequential request: vLLM's advantage appears under **concurrency**.
- Forgetting VRAM sizing: model + concurrent KV Cache must fit in available GPU memory.
- On **agentic** workloads with highly shared prefixes, evaluate [[00-lexique/sglang|SGLang]] in parallel (RadixAttention).

## 📚 To go deeper

1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]] — vLLM, Ollama, TensorRT-LLM, SGLang comparison
2. [[00-lexique/pagedattention|PagedAttention]] — vLLM's key memory optimization
3. [[06-mise-en-oeuvre/local-inference-security|🔐 Local inference security]] — hardening API in production

## 🔗 See also

- [[00-lexique/ollama|Ollama]]
- [[00-lexique/pagedattention|PagedAttention]]
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/sglang|SGLang]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: vLLM Project, official repository. [https://github.com/vllm-project/vllm](https://github.com/vllm-project/vllm)
[^2]: Kwon et al., *Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP 2023). [https://arxiv.org/abs/2309.06180](https://arxiv.org/abs/2309.06180)
