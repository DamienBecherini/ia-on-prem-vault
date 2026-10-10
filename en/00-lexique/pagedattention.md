---
title: PagedAttention
description: KV Cache management technique using virtual memory blocks, popularized by vLLM.
aliases:
  - Paged Attention
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
Algorithm that manages [[00-lexique/kv-cache|KV Cache]] memory in non-contiguous blocks (like OS virtual memory), greatly reducing fragmentation.

## 📖 Detailed definition
In classic engines, the KV Cache is pre-allocated in contiguous VRAM blocks: unused regions stay wasted. PagedAttention splits the cache into fixed-size pages that can be allocated, freed, and shared dynamically.

Result: memory waste drops from 60–80% to under 4% according to the original paper (Woosuk Kwon et al., SOSP 2023)[^2]. This enables **Continuous Batching**: requests are processed continuously without draining the server between each one, maximizing GPU throughput.

## 💡 Why it matters for on-prem AI
This is the innovation that made vLLM's continuous batching possible — together with block-based prefix caching (enabled by default), it explains why vLLM outperforms Ollama in multi-user production[^3]. Without PagedAttention, the server wastes VRAM and cannot batch concurrent requests efficiently.

## ⚠️ Common pitfalls
- PagedAttention now designates a **principle** more than a component: vLLM removed the historical implementation in v0.25 (July 2026) in favor of its V1 engine's attention backends, which keep block-based KV Cache management (`--block-size` option, `vllm:kv_cache_usage_perc` metric)[^1]. Workstation-oriented engines (llama.cpp/Ollama) rely on a different memory model and do not offer equivalent continuous batching.
- Does not remove total capacity limits: if model + caches exceed total VRAM, OOM still occurs.

## 📚 Go deeper
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference Engines]] *(why vLLM > Ollama in production)*
2. [[01-fondations/kv-cache-and-context|💾 KV Cache & Context]] *(the cache mechanism PagedAttention optimizes)*

## 🔗 See also
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/vram|VRAM]]
- [[00-lexique/tokens-per-second|Tokens per second]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: vLLM Project, *Release v0.25.0* ("PagedAttention has been removed — the legacy attention implementation is deleted now that V1/MRv2 backends are the standard path"), 11 July 2026. [https://github.com/vllm-project/vllm/releases/tag/v0.25.0](https://github.com/vllm-project/vllm/releases/tag/v0.25.0) · vLLM Project, *Engine Arguments* (`--block-size`, block-based KV cache), accessed 2026-10-10. [https://docs.vllm.ai/en/stable/configuration/engine_args/](https://docs.vllm.ai/en/stable/configuration/engine_args/)
[^2]: W. Kwon et al., *vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention* ("existing systems waste 60% – 80% of memory", "a mere waste of under 4%"), 20 June 2023; *Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP 2023). [https://vllm.ai/blog/2023-06-20-vllm](https://vllm.ai/blog/2023-06-20-vllm) · [https://arxiv.org/abs/2309.06180](https://arxiv.org/abs/2309.06180)
[^3]: vLLM Project, *Automatic Prefix Caching* (`enable_prefix_caching` enabled by default, block hashing), accessed 2026-10-10. [https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/](https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/)
