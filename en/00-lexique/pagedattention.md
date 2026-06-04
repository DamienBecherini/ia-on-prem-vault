---
title: PagedAttention
description: KV Cache management technique using virtual memory blocks, popularized by vLLM.
aliases:
  - Paged Attention
tags:
  - lexique
  - fondations
---


## 📝 Short definition
Algorithm that manages [[00-lexique/kv-cache|KV Cache]] memory in non-contiguous blocks (like OS virtual memory), greatly reducing fragmentation.

## 📖 Detailed definition
In classic engines, the KV Cache is pre-allocated in contiguous VRAM blocks: unused regions stay wasted. PagedAttention splits the cache into fixed-size pages that can be allocated, freed, and shared dynamically.

Result: memory fragmentation drops from ~60% to under 4% according to the original paper (Woosuk Kwon et al., SOSP 2023). This enables **Continuous Batching**: requests are processed continuously without draining the server between each one, maximizing GPU throughput.

## 💡 Why it matters for on-prem AI
This is the main innovation explaining why vLLM outperforms Ollama in multi-user production. Without PagedAttention, the server wastes VRAM and cannot batch concurrent requests efficiently.

## ⚠️ Common pitfalls
- Available mainly with vLLM (and a few compatible engines). Ollama/llama.cpp do not implement PagedAttention natively.
- Does not remove total capacity limits: if model + caches exceed total VRAM, OOM still occurs.

## 📚 Go deeper
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference Engines]] *(why vLLM > Ollama in production)*
2. [[01-fondations/kv-cache-and-context|💾 KV Cache & Context]] *(the cache mechanism PagedAttention optimizes)*

## 🔗 See also
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/vram|VRAM]]
- [[00-lexique/tokens-per-second|Tokens per second]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
