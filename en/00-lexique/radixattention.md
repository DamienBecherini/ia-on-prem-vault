---
title: "🌳 RadixAttention"
description: "KV Cache management technique using a prefix tree, introduced by SGLang to reuse common contexts across requests."
aliases:
  - Radix Attention
tags:
  - lexique
  - stack
sidebar:
  order: 58
last_modified: "2026-06-09"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
---

## 📝 Short definition

KV Cache management technique that organizes key/value entries in a radix tree (prefix tree) rather than in a flat buffer — common prefixes across requests are computed only once.

## 📖 Detailed definition

Introduced by [[00-lexique/sglang|SGLang]][^1], RadixAttention stores KV Cache entries in a tree structure: each node corresponds to a token segment. When multiple requests share an identical prefix — long system prompt, retrieved RAG context, repeated tool schema — the corresponding KV entries are stored once and reused by all requests that follow that path.

**Primary effect:** significant reduction in [[00-lexique/ttft|TTFT]] in agentic loops (the LLM calls tools multiple times with the same contextual framework) and in deployments where many users share the same system prompt.

## 💡 Relation with PagedAttention

Both techniques optimize KV Cache memory management, but for different goals:

| Technique | Primary objective |
| :-- | :-- |
| [[00-lexique/pagedattention|PagedAttention]] | Eliminate memory fragmentation to increase concurrency |
| RadixAttention | Maximize prefix reuse to reduce latency |

They are not mutually exclusive conceptually: PagedAttention addresses throughput under load; RadixAttention addresses latency when context repeats.

## 🔗 See also

- [[00-lexique/sglang|SGLang]]
- [[00-lexique/pagedattention|PagedAttention]]
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: LMSys, *Fast and Expressive LLM Inference with RadixAttention*, January 2024. [https://lmsys.org/blog/2024-01-17-sglang/](https://lmsys.org/blog/2024-01-17-sglang/)
