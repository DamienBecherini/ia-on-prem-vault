---
title: "⚙️ Inference Engines: vLLM, Ollama, and TensorRT-LLM"
description: Comparison of local deployment engines. When to use GGUF and llama.cpp on Mac, and when to switch to vLLM or TensorRT-LLM in production.
sidebar:
  order: 1
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Ollama simplifies local testing in minutes. vLLM optimizes throughput in multi-user production. TensorRT-LLM pushes NVIDIA GPUs to the limit in the datacenter. The right engine depends on your use case, not the model.

Having the weights of a large [[00-lexique/llm|LLM]] and a powerful server is not enough. To use AI, you need an **inference engine** capable of loading weights into [[00-lexique/vram|VRAM]], managing the [[00-lexique/kv-cache|KV Cache]], and executing matrix math.

In 2026, the ecosystem has become highly specialized. Engine choice dictates [[00-lexique/tokens-per-second|tokens/s]] performance, initial response time ([[00-lexique/ttft|TTFT]]), and the ability to handle concurrent requests.

---

## 1. llama.cpp & Ollama: Kings of the workstation

[Ollama](https://ollama.com/) has become the de facto standard for quickly testing models — as of Q4 2026, its GitHub repository exceeds 180,000 stars and its official Docker image is approaching 185 million cumulative pulls[^1]. Under the hood, [[00-lexique/ollama|Ollama]] has become a dual-engine runtime: **llama.cpp** (C/C++) on Linux, Windows and for most architectures, and **MLX** (Apple) which, since version 0.40 (September 2026), handles compatible models by default on Apple Silicon[^13].

### 🌟 Strengths
*   **Hardware versatility:** Optimized to use unified memory on Mac Studio, handle [[00-lexique/offloading|offloading]] between RAM and GPU on modest workstations, and run on almost any CPU.
*   **[[00-lexique/gguf|GGUF]] format:** Uses aggressive [[00-lexique/quantification|quantization]] formats (e.g. `Q4_K_M`), fitting massive models into very limited VRAM without complex dependencies[^2].
*   **Simplicity:** A single executable, one `ollama run` command, and an OpenAI-compatible API ready to use.

### ⚠️ Limits (The production wall)
The classic mistake is deploying Ollama to serve an SMB application with several simultaneous users. By default, Ollama processes only one request at a time per model (`OLLAMA_NUM_PARALLEL=1`) and queues the others; this parallelism can be raised, but the memory required grows with `OLLAMA_NUM_PARALLEL × OLLAMA_CONTEXT_LENGTH`, and the server has neither continuous batching nor a production scheduler[^12]. As soon as a handful of users query the same model at the same time, latency visibly degrades — that is the signal to move to vLLM.

---

## 2. vLLM: The production standard

[vLLM](https://github.com/vllm-project/vllm) is the reference open-source Python/C++ engine for high-throughput inference. Built for servers with NVIDIA chips (and AMD ROCm), it is designed to maximize GPU utilization under heavy load.

### 🌟 Strengths
*   **[[00-lexique/pagedattention|PagedAttention]]:** vLLM popularized this technique, which manages KV Cache memory in blocks (like an OS virtual memory). This reduces memory fragmentation from ~60% to under 4% and enables massive request batching (*Continuous Batching*)[^3].
*   **High concurrent throughput:** On multi-user architectures, vLLM can deliver overall throughput well above Ollama under concurrent load; the gap depends heavily on hardware, model and quantization — measure it with `vllm bench serve` on your own prompts rather than relying on a generic factor[^4].
*   **Cutting-edge format support:** It handles production quantization (FP8 — `fp8_per_tensor` shorthand since vLLM 0.31, the former `fp8` name redirects[^16] —, AWQ, GPTQ) via kernels natively optimized for NVIDIA Hopper and Blackwell architectures, and natively supports [[00-lexique/tensor-parallelism|Tensor Parallelism]] in [[00-lexique/multi-gpu|multi-GPU]] setups[^5].

### ⚠️ Limits
vLLM is not designed for offloading to classic CPU RAM, nor for Apple silicon. It requires robust hardware (dedicated GPUs) and finer server parameter tuning.

---

## 3. TensorRT-LLM: Extreme NVIDIA acceleration

[TensorRT-LLM](https://nvidia.github.io/TensorRT-LLM/) is NVIDIA's official SDK for extracting maximum physical performance from its own GPUs. Since version 1.0 (September 2025) it is built on a native PyTorch architecture, and version 1.2 (March 2026) removed the legacy TensorRT backend: there is no longer any upfront "engine" compilation, the model is served directly by `trtllm-serve`[^6].

### 🌟 Strengths
*   **Performance ceiling:** It often beats all other engines on datacenter GPUs (H100, B200) thanks to techniques like *Flash-Decoding*.
*   **Native FP4:** On datacenter Blackwell (B200, B300), TensorRT-LLM natively supports NVFP4 to halve VRAM footprint compared to FP8 while maintaining datacenter-class precision; on SM120 cards (RTX 5090, RTX PRO 6000) support remains partial as of Q3 2026 (NVFP4 MoE models not supported according to the release notes)[^6].
*   **Massive parallelism:** It orchestrates execution graphs perfectly across multi-GPU nodes connected by [[00-lexique/nvlink|NVLink]].

### ⚠️ Limits
The constraint is no longer compilation but the release cadence: as of Q4 2026, the latest stable version is 1.2.1 (April 2026), 1.3 stayed in *release candidates* throughout summer 2026, and the release notes flag known issues on SM120 GPUs (RTX PRO 6000, RTX 50) for NVFP4 MoE and MLA models[^6]. The learning curve remains steeper than vLLM's.

---

## 4. SGLang: Agentic orchestration and structured generation

[SGLang](https://github.com/sgl-project/sglang) (Structured Generation Language) is an open-source inference engine developed by LMSys (Berkeley). Emerging as a direct competitor to vLLM in late 2023, it gained the upper hand in 2026 in two specific areas where its architecture is the most specialized: **agentic loops** and **constrained JSON generation**[^7].

### 🌟 Strengths

*   **[[00-lexique/radixattention|RadixAttention]] — Shared prefix cache:** SGLang organizes the [[00-lexique/kv-cache|KV Cache]] as a radix tree. When multiple requests share a long common prefix — a system prompt, retrieved RAG context, or a tool schema — that prefix is computed only once and reused by all requests that share it. In an agentic loop where the agent calls a tool, reads the result, then calls the tool again over several turns, most of the context stays identical. SGLang avoids recalculating the KV Cache on every turn, which significantly reduces [[00-lexique/ttft|TTFT]] on these repetitive workloads[^8].
*   **Structured JSON generation without penalty:** SGLang constrains the LLM to produce output strictly conforming to a defined JSON schema, without degrading generation speed. This is a critical property for architectures where the inference engine must communicate with an application backend via typed tool calls (*function calling* / *tool calling*)[^7].

### ⚠️ Limits

*   SGLang is primarily optimized for Linux + NVIDIA GPU (CUDA 13 required since 0.5.20, September 2026); AMD Instinct (MI300X → MI355X), Intel, TPU and Apple Silicon (Metal/MLX) are officially supported, with maturity varying by platform[^7][^14].
*   On **raw throughput** benchmarks (independent requests without shared prefix), vLLM remains the reference or equivalent[^9].

### When to choose SGLang over vLLM?

| Criterion | vLLM | SGLang |
| :-- | :-- | :-- |
| Raw throughput, independent requests | ✅ Reference | Comparable |
| Agentic loops, shared prefixes | ✅ Automatic Prefix Caching (on by default, hashed blocks)[^11] | ✅ RadixAttention (prefix tree, finer-grained sharing) |
| Constrained JSON generation | ✅ Native (xgrammar / guidance, enabled by default)[^18] | ✅ Native |
| Hardware compatibility (AMD, Mac) | ✅ Broad | ✅ Broad (NVIDIA CUDA 13, AMD Instinct, Intel, TPU, Apple)[^14] |
| Ecosystem maturity | ✅ Very broad | ✅ Mature since 2025 |

> [!tip] Practical rule
> **Deploy vLLM** for simple RAG or concurrent text generation. **Switch to SGLang** if your application uses intensive *tool calling*, agentic loops with shared context, or if you need strict guarantees on the JSON format of model outputs.

---

## 🔧 Common vLLM startup troubleshooting

The following issues are common during first vLLM installation. They occur before the server even responds to a request.

| Symptom | Probable cause | Solution |
| :-- | :-- | :-- |
| `torch.cuda.is_available()` returns `False` | Mismatch between installed PyTorch version and system CUDA driver | Reinstall PyTorch with the matching CUDA variant: `pip install torch --index-url https://download.pytorch.org/whl/cu130` (or `cu129`; since vLLM 0.28 the default wheel targets CUDA 13.0[^16] — adapt to installed CUDA version) |
| OOM on load — KV Cache too large | Maximum context length requested exceeds available VRAM after weight loading | Add `--max-model-len 4096` (or a lower value) to `vllm serve` startup to reduce pre-allocated KV Cache |
| Two vLLM servers in conflict | Port 8000 already occupied by a previous instance | Add `--port 8001` for the second instance; `lsof -i :8000` / `netstat -tulpn` to identify the process occupying the port |
| Quickly test the local API | — | Use the OpenAI Python client with `base_url="http://localhost:8000/v1/"` and `api_key="any"` (without `--api-key`, vLLM accepts any value; and even with `--api-key`, only `/v1`, `/v2` and `/inference` are protected — `/tokenize` and `/metrics` remain open, hence the reverse proxy in production)[^15] |

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
    Use **TensorRT-LLM** via `trtllm-serve` (OpenAI-compatible API) or, if you already run Triton, via its TensorRT-LLM backend[^17]. This is the most efficient way to amortize the cost of professional accelerators.
4.  **"Agents and backend integration" use case (tool calling, structured JSON):**
    Prefer **[[00-lexique/sglang|SGLang]]**. Its native prefix cache management ([[00-lexique/radixattention|RadixAttention]]) reduces latency in agentic loops, and its constrained JSON generation guarantees reliable interfaces with any application backend.

---

## 📚 Sources and References

[^1]: Ollama, GitHub repository `ollama/ollama` (star count) and Docker Hub image `ollama/ollama` (pull count), accessed 2026-10-09. [https://github.com/ollama/ollama](https://github.com/ollama/ollama) · [https://hub.docker.com/r/ollama/ollama](https://hub.docker.com/r/ollama/ollama)
[^2]: J. Wang et al., *Which Quantization Should I Use? A Unified Evaluation of llama.cpp Quantization* (arXiv:2601.14277, GGUF formats), January 2026. [https://arxiv.org/abs/2601.14277](https://arxiv.org/abs/2601.14277)
[^3]: Woosuk Kwon et al., *Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP 2023). [https://arxiv.org/abs/2309.06180](https://arxiv.org/abs/2309.06180)
[^4]: vLLM Project, *Benchmarking* (`vllm bench serve` / `latency` / `throughput`), stable documentation accessed 2026-10-09. [https://docs.vllm.ai/en/stable/benchmarking/](https://docs.vllm.ai/en/stable/benchmarking/)
[^5]: vLLM Project Documentation & Spheron Blog, *vLLM Production Deployment 2026: Multi-GPU Tensor Parallel + FP8* (Model Runner V2, Hopper/Blackwell support), May 2026. [https://docs.vllm.ai/en/stable/serving/parallelism_scaling/](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/) · [https://www.spheron.network/blog/vllm-production-deployment-2026/](https://www.spheron.network/blog/vllm-production-deployment-2026/)
[^6]: NVIDIA, *TensorRT-LLM Documentation & Release Notes* (1.0: PyTorch by default; 1.2: TensorRT backend and `trtllm-build` removed; SM120 known issues; Blackwell FP4), September 2026. [https://nvidia.github.io/TensorRT-LLM/](https://nvidia.github.io/TensorRT-LLM/) · [https://nvidia.github.io/TensorRT-LLM/release-notes.html](https://nvidia.github.io/TensorRT-LLM/release-notes.html) · PyPI `tensorrt-llm` (version history: 1.2.1 stable, 1.3.0rcN), accessed 2026-10-09. [https://pypi.org/project/tensorrt-llm/](https://pypi.org/project/tensorrt-llm/)
[^7]: SGLang Project, *SGLang — Fast Serving Framework for LLMs and VLMs* (RadixAttention, structured output). [https://github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)
[^8]: Lianmin Zheng et al., *Efficiently Programming Large Language Models using SGLang* (RadixAttention, prefix cache, TTFT reduction). [https://lmsys.org/blog/2024-01-17-sglang/](https://lmsys.org/blog/2024-01-17-sglang/)
[^9]: SGLang Contributors, *SGLang vs vLLM — scaling benchmark under high concurrency* (throughput comparison). [https://github.com/sgl-project/sglang/issues/21061](https://github.com/sgl-project/sglang/issues/21061)
[^10]: Tenstorrent, *vLLM integration with TT-Metal* (fork tenstorrent/vllm, tt-metal, standard vLLM incompatibility), 2025. [https://github.com/tenstorrent/tt-metal/blob/main/tech_reports/LLMs/vLLM_integration.md](https://github.com/tenstorrent/tt-metal/blob/main/tech_reports/LLMs/vLLM_integration.md)
[^11]: vLLM Project, *Automatic Prefix Caching* and *Engine Arguments* (`enable_prefix_caching` on by default, block hashing, `vllm:prefix_cache_hits/queries` metrics), accessed 2026-10-09. [https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/](https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/) · [https://docs.vllm.ai/en/stable/configuration/engine_args/](https://docs.vllm.ai/en/stable/configuration/engine_args/)
[^12]: Ollama, *FAQ — How does Ollama handle concurrent requests?* (`OLLAMA_NUM_PARALLEL`, `OLLAMA_MAX_LOADED_MODELS`, request queue), accessed 2026-10-09. [https://docs.ollama.com/faq](https://docs.ollama.com/faq)
[^13]: Ollama, *Release v0.40.0* ("Models run on MLX on Apple Silicon by default"), September 25, 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0)
[^14]: SGLang Project, *Release v0.5.20* (CUDA 12 dropped, CUDA 13 required; ROCm `gfx1151` image), September 18, 2026. [https://github.com/sgl-project/sglang/releases/tag/v0.5.20](https://github.com/sgl-project/sglang/releases/tag/v0.5.20)
[^15]: vLLM Project, *CLI Reference — `vllm serve`* (`--api-key`: protected paths `/v1`, `/v2`, `/inference`), accessed 2026-10-09 · vLLM Project, advisory GHSA-h3rc-6mm3-gc2m (`/tokenize` not covered by `--api-key`), October 6, 2026. [https://docs.vllm.ai/en/stable/cli/serve/](https://docs.vllm.ai/en/stable/cli/serve/) · [https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m](https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m)
[^16]: vLLM Project, *Release v0.28.0* (default PyPI wheel and Docker image on CUDA 13.0, `-cu129` variants), 2026-08-26 · *Release v0.31.0* (`quantization="fp8"` renamed `fp8_per_tensor`, former name redirected), 2026-10-05. [https://github.com/vllm-project/vllm/releases/tag/v0.28.0](https://github.com/vllm-project/vllm/releases/tag/v0.28.0) · [https://github.com/vllm-project/vllm/releases/tag/v0.31.0](https://github.com/vllm-project/vllm/releases/tag/v0.31.0)
[^17]: NVIDIA, *TensorRT-LLM — Quick Start* (`trtllm-serve`, OpenAI-compatible API), accessed 2026-10-09 · Triton Inference Server, `tensorrtllm_backend` repository (Triton backend for TensorRT-LLM, "PyTorch Backend (LLM API)" mode), accessed 2026-10-09. [https://nvidia.github.io/TensorRT-LLM/](https://nvidia.github.io/TensorRT-LLM/) · [https://github.com/triton-inference-server/tensorrtllm_backend](https://github.com/triton-inference-server/tensorrtllm_backend)
[^18]: vLLM Project, *Structured Outputs* (`xgrammar` / `guidance` backends, `auto` selection via `--structured-outputs-config`), accessed 2026-10-09. [https://docs.vllm.ai/en/stable/features/structured_outputs/](https://docs.vllm.ai/en/stable/features/structured_outputs/)
