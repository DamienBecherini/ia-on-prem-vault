---
title: "⚙️ Inference Engines: vLLM, Ollama, and TensorRT-LLM"
description: Comparison of local deployment engines in 2026. When to use GGUF and llama.cpp on Mac, and when to switch to vLLM or TensorRT-LLM in production.
sidebar:
  order: 1
last_modified: "2026-06-10"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Ollama simplifies local testing in minutes. vLLM optimizes throughput in multi-user production. TensorRT-LLM pushes NVIDIA GPUs to the limit in the datacenter. The right engine depends on your use case, not the model.

Having the weights of a large [[00-lexique/llm|LLM]] and a powerful server is not enough. To use AI, you need an **inference engine** capable of loading weights into [[00-lexique/vram|VRAM]], managing the [[00-lexique/kv-cache|KV Cache]], and executing matrix math.

In 2026, the ecosystem has become highly specialized. Engine choice dictates [[00-lexique/tokens-per-second|tokens/s]] performance, initial response time ([[00-lexique/ttft|TTFT]]), and the ability to handle concurrent requests.

---

## 1. llama.cpp & Ollama: Kings of the workstation

[Ollama](https://ollama.com/) has become the de facto standard for quickly testing models — a community benchmark from Q1 2026 estimated its audience at more than 50 million monthly downloads[^1]. Under the hood, Ollama relies primarily on the **llama.cpp** engine, written in pure C/C++.

### 🌟 Strengths
*   **Hardware versatility:** Optimized to use unified memory on Mac Studio, handle [[00-lexique/offloading|offloading]] between RAM and GPU on modest workstations, and run on almost any CPU.
*   **[[00-lexique/gguf|GGUF]] format:** Uses aggressive [[00-lexique/quantification|quantization]] formats (e.g. `Q4_K_M`), fitting massive models into very limited VRAM without complex dependencies[^2].
*   **Simplicity:** A single executable, one `ollama run` command, and an OpenAI-compatible API ready to use.

### ⚠️ Limits (The production wall)
The classic mistake is deploying Ollama to serve an SMB application with several simultaneous users. Designed for sequential processing, the underlying architecture collapses under heavy concurrency. Beyond 5 to 10 concurrent users, latency explodes (requests often going from a few seconds to more than a minute)[^1].

---

## 2. vLLM: The production standard

[vLLM](https://github.com/vllm-project/vllm) is the reference open-source Python/C++ engine for high-throughput inference. Built for servers with NVIDIA chips (and AMD ROCm), it is designed to maximize GPU utilization under heavy load.

### 🌟 Strengths
*   **[[00-lexique/pagedattention|PagedAttention]]:** vLLM popularized this technique, which manages KV Cache memory in blocks (like an OS virtual memory). This reduces memory fragmentation from ~60% to under 4% and enables massive request batching (*Continuous Batching*)[^3].
*   **High concurrent throughput:** On multi-user architectures, vLLM can deliver overall throughput well above Ollama under concurrent load — community comparisons cite factors of ×5 to ×16 depending on configuration and model[^1][^4].
*   **Cutting-edge format support:** It handles production quantization (FP8, AWQ) via kernels natively optimized for NVIDIA Hopper and Blackwell architectures, and natively supports [[00-lexique/tensor-parallelism|Tensor Parallelism]] in [[00-lexique/multi-gpu|multi-GPU]] setups[^5].

### ⚠️ Limits
vLLM is not designed for offloading to classic CPU RAM, nor for Apple silicon. It requires robust hardware (dedicated GPUs) and finer server parameter tuning.

---

## 3. TensorRT-LLM: Extreme NVIDIA acceleration

[TensorRT-LLM](https://nvidia.github.io/TensorRT-LLM/) is NVIDIA's official SDK for extracting maximum physical performance from its own GPUs. It compiles the model into an ultra-optimized proprietary format (an "engine").

### 🌟 Strengths
*   **Performance ceiling:** It often beats all other engines on datacenter GPUs (H100, B200) thanks to techniques like *Flash-Decoding*.
*   **Native FP4:** On new Blackwell chips (B200, RTX 5090), TensorRT-LLM natively supports FP4 to halve VRAM footprint compared to FP8 while maintaining datacenter-class precision[^6].
*   **Massive parallelism:** It orchestrates execution graphs perfectly across multi-GPU nodes connected by [[00-lexique/nvlink|NVLink]].

### ⚠️ Limits
Compiling a TensorRT engine is heavy (*Ahead-of-Time*), very strict about the target GPU generation, and the learning curve is much steeper than vLLM's.

---

## 4. SGLang: Agentic orchestration and structured generation

[SGLang](https://github.com/sgl-project/sglang) (Structured Generation Language) is an open-source inference engine developed by LMSys (Berkeley). Emerging as a direct competitor to vLLM in late 2023, it gained the upper hand in 2026 in two specific areas where vLLM remains less optimized: **agentic loops** and **constrained JSON generation**[^7].

### 🌟 Strengths

*   **[[00-lexique/radixattention|RadixAttention]] — Shared prefix cache:** SGLang organizes the [[00-lexique/kv-cache|KV Cache]] as a radix tree. When multiple requests share a long common prefix — a system prompt, retrieved RAG context, or a tool schema — that prefix is computed only once and reused by all requests that share it. In an agentic loop where the agent calls a tool, reads the result, then calls the tool again over several turns, most of the context stays identical. SGLang avoids recalculating the KV Cache on every turn, which significantly reduces [[00-lexique/ttft|TTFT]] on these repetitive workloads[^8].
*   **Structured JSON generation without penalty:** SGLang constrains the LLM to produce output strictly conforming to a defined JSON schema, without degrading generation speed. This is a critical property for architectures where the inference engine must communicate with an application backend via typed tool calls (*function calling* / *tool calling*)[^7].

### ⚠️ Limits

*   SGLang is optimized for Linux + NVIDIA GPU. AMD ROCm and macOS support remains more limited than vLLM's.
*   On **raw throughput** benchmarks (independent requests without shared prefix), vLLM remains the reference or equivalent[^9].

### When to choose SGLang over vLLM?

| Criterion | vLLM | SGLang |
| :-- | :-- | :-- |
| Raw throughput, independent requests | ✅ Reference | Comparable |
| Agentic loops, shared prefixes | ⚠️ No native prefix cache | ✅ RadixAttention |
| Constrained JSON generation | ⚠️ Possible, slower | ✅ Native, no penalty |
| Hardware compatibility (AMD, Mac) | ✅ Broad | ⚠️ NVIDIA primarily |
| Ecosystem maturity | ✅ Very broad | ✅ Mature since 2025 |

> [!tip] Practical rule
> **Deploy vLLM** for simple RAG or concurrent text generation. **Switch to SGLang** if your application uses intensive *tool calling*, agentic loops with shared context, or if you need strict guarantees on the JSON format of model outputs.

---

## 🔧 Common vLLM startup troubleshooting

The following issues are common during first vLLM installation. They occur before the server even responds to a request.

| Symptom | Probable cause | Solution |
| :-- | :-- | :-- |
| `torch.cuda.is_available()` returns `False` | Mismatch between installed PyTorch version and system CUDA driver | Reinstall PyTorch with the matching CUDA variant: `pip install torch --index-url https://download.pytorch.org/whl/cu124` (adapt `cu124` to installed CUDA version) |
| OOM on load — KV Cache too large | Maximum context length requested exceeds available VRAM after weight loading | Add `--max-model-len 4096` (or a lower value) to `vllm serve` startup to reduce pre-allocated KV Cache |
| Two vLLM servers in conflict | Port 8000 already occupied by a previous instance | Add `--port 8001` for the second instance; `lsof -i :8000` / `netstat -tulpn` to identify the process occupying the port |
| Quickly test the local API | — | Use the OpenAI Python client with `base_url="http://localhost:8000/v1/"` and `api_key="any"` (vLLM accepts any key value in unsecured mode) |

**Quick test example from Python:**

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1/", api_key="any")
response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Hello, are you working?"}],
    max_tokens=64,
)
print(response.choices[0].message.content)
```

> [!warning] vLLM and Tenstorrent accelerators
> Standard vLLM is **not compatible** with Tenstorrent accelerators (Wormhole N150/N300, Blackhole). To use these chips, you need the `tenstorrent/vllm` fork, compiled with the `tt-metal` (TT-Forge) environment assembled manually — a non-trivial procedure. This fork is not maintained by the main vLLM team. Community source [^10] — consider this before any Tenstorrent hardware purchase if vLLM is a prerequisite for your stack.

---

## 📋 The Architect's Advice

For an on-premise agent project deployed at customer sites, engine choice depends purely on the architecture scenario:

1.  **"Local Copilot" use case (one user, desktop):**
    Choose **Ollama / llama.cpp**. Native support for `GGUF` models in [[00-lexique/quantification-q4|Q4]] on Mac or a small Windows PC delivers excellent responsiveness without server infrastructure.
2.  **"SMB Appliance" use case (10–50 users, GPU server):**
    **Switch to vLLM without hesitation.** PagedAttention and continuous batching ensure the AI will not collapse when five collaborators launch RAG requests at the same time. Use weights in **AWQ or FP8** precision.
3.  **"Sovereign Datacenter" use case (high volume, multi-node):**
    Use **TensorRT-LLM** behind NVIDIA's Triton server. This is the most efficient way to amortize the cost of professional accelerators.
4.  **"Agents and backend integration" use case (tool calling, structured JSON):**
    Prefer **[[00-lexique/sglang|SGLang]]**. Its native prefix cache management ([[00-lexique/radixattention|RadixAttention]]) reduces latency in agentic loops, and its constrained JSON generation guarantees reliable interfaces with any application backend.

---

## 📚 Sources and References

[^1]: Particula Tech, *Ollama vs vLLM: Which LLM Server Actually Fits in 2026* (benchmark communautaire, estimation d'audience et limites de concurrence), Mars 2026.
[^2]: J. Wang et al., *Which Quantization Should I Use? A Unified Evaluation of llama.cpp Quantization* (arXiv:2601.14277, GGUF formats), Janvier 2026.
[^3]: Woosuk Kwon et al., *Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP 2023).
[^4]: Ayi NEDJIMI Consultants, *LLM Local 2026 : Ollama vs LM Studio vs vLLM* (article de blog, comparaison d'architectures, Continuous Batching), Février 2026.
[^5]: vLLM Project Documentation & Spheron Blog, *vLLM Production Deployment 2026: Multi-GPU Tensor Parallel + FP8* (Model Runner V2, Hopper/Blackwell support), Mai 2026.
[^6]: NVIDIA, *TensorRT-LLM Documentation* (FP4 Support, Blackwell optimization, DeepSeek-R1 performance records), Mai 2026.
[^7]: SGLang Project, *SGLang — Fast Serving Framework for LLMs and VLMs* (RadixAttention, structured output). https://github.com/sgl-project/sglang
[^8]: Lianmin Zheng et al., *Efficiently Programming Large Language Models using SGLang* (RadixAttention, prefix cache, TTFT reduction). https://lmsys.org/blog/2024-01-17-sglang/
[^9]: SGLang Contributors, *SGLang vs vLLM — scaling benchmark under high concurrency* (throughput comparison). https://github.com/sgl-project/sglang/issues/21061
[^10]: Community source, *Tenstorrent N150 vs RTX 4090 — LLM inference benchmark* (tenstorrent/vllm fork, tt-metal, standard vLLM incompatibility), 2025. Not published by Tenstorrent Inc. — verify before deployment.
