---
title: Pipeline Parallelism
description: Strategy for distributing an LLM in layer slices across multiple machines.
aliases:
  - PP
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Short definition
Splitting a model into layer blocks across multiple nodes: each node processes its slice and passes the result to the next.

## 📖 Detailed definition
Machine A computes layers 1 to N, sends the result (*activations*) over the network to machine B, which computes the next layers, and so on until the last node. This is the strategy used by [[00-lexique/exo|Exo]] on desktop clusters.

**Key difference from [[00-lexique/tensor-parallelism|Tensor Parallelism]]**:
- Pipeline Parallelism: split *between* layers (needs a fast network but not extreme).
- Tensor Parallelism: split *within* a layer (needs NVLink or equivalent very fast links).

Pipeline Parallelism *increases memory capacity* but *adds latency* at each node boundary (the famous "pipeline bubbles" — idle time between slices).

## 💡 Why it matters for on-prem AI
The only viable option for office clusters where NVLink is unavailable. Key to understanding why [[00-lexique/ttft|TTFT]] degrades in Scenario C.

## ⚠️ Common pitfalls
- Pipeline bubbles hurt latency, especially on long prompts (prefill).
- Poorly suited to massive concurrent requests.
- A slow network (Wi-Fi, 1 GbE) can negate all capacity gains.

## 📚 Go deeper
1. [[03-stack-logicielle/clustering-exo-and-ray|🌐 AI Clustering: Exo and Ray]] *(how Exo uses this strategy)*
2. [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scenario C: Desktop Cluster]] *(TTFT impact in practice)*
3. [[00-lexique/tensor-parallelism|Tensor Parallelism]] *(the alternative strategy for NVLink nodes)*

## 🔗 See also
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/exo|Exo]]
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
