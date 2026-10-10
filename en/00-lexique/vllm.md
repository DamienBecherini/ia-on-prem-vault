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
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
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
- Believing vLLM does not reuse prefixes: Automatic Prefix Caching is **enabled by default**[^3]; on **agentic** workloads with highly shared prefixes, still evaluate [[00-lexique/sglang|SGLang]] in parallel (RadixAttention, finer-grained sharing).
- Exposing the server with `--api-key` alone: it only protects `/v1`, `/v2` and `/inference`; `/tokenize` and `/metrics` remain open — a reverse proxy is mandatory[^4].
- Staying on a version earlier than 0.31.0 (October 2026): several remote code executions and denials of service were fixed between 0.28 and 0.31, and the default wheels have targeted CUDA 13.0 since 0.28 (August 2026)[^5].

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
[^3]: vLLM Project, *Automatic Prefix Caching* (`enable_prefix_caching` enabled by default, block hashing), accessed 2026-10-10. [https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/](https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/)
[^4]: vLLM Project, *CLI Reference — `vllm serve`* (`--api-key`: protected paths `/v1`, `/v2`, `/inference`), accessed 2026-10-10 · advisory GHSA-h3rc-6mm3-gc2m (`/tokenize` not covered by `--api-key`), 6 October 2026. [https://docs.vllm.ai/en/stable/cli/serve/](https://docs.vllm.ai/en/stable/cli/serve/) · [https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m](https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m)
[^5]: vLLM Project, *Release v0.31.0* (per-request `mm_processor_kwargs` rejected unless `--trust-request-mm-kwargs`), 5 October 2026 · *Release v0.28.0* (default PyPI wheel and Docker image on CUDA 13.0), 26 August 2026. [https://github.com/vllm-project/vllm/releases/tag/v0.31.0](https://github.com/vllm-project/vllm/releases/tag/v0.31.0) · [https://github.com/vllm-project/vllm/releases/tag/v0.28.0](https://github.com/vllm-project/vllm/releases/tag/v0.28.0)
