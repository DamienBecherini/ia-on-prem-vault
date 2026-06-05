---
title: Tensor Parallelism
description: Strategy for distributing an LLM by splitting weight matrices across multiple GPUs on the same node.
aliases:
  - Parallélisme de tenseurs
  - TP
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Short definition
Matrix operations for a single layer are split and computed in parallel across several GPUs—they act as one giant GPU.

## 📖 Detailed definition
Unlike [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] (splitting *between* layers), the split here is *within* a single layer: each GPU computes part of the matrix, then GPUs synchronize partial results over the interconnect.

That synchronization happens very often (every layer), so it needs an extremely fast interconnect: [[00-lexique/nvlink|NVLink]] or NVSwitch on HGX nodes. On PCIe alone, insufficient bandwidth wipes out the benefit.

Used natively by vLLM and TensorRT-LLM. Setting `tp=8` on an 8-GPU HGX node spreads the model across all eight chips.

## 💡 Why it matters for on-prem AI
Directly reduces generation latency (tokens/s ×N) in datacenter production. Key to Scenario D: lets the eight GPUs on an HGX node act as one accelerator.

## ⚠️ Common pitfalls
- Inefficient on PCIe alone (bus too slow for inter-GPU sync).
- Requires the number of attention heads to be divisible by TP.
- Does not apply across nodes without pairing with Pipeline Parallelism.

## 📚 Go deeper
1. [[04-blueprints/scenario-d-datacenter|🏢 Scenario D: Datacenter]] *(Tensor Parallelism + NVLink + Ray in practice)*
2. [[03-stack-logicielle/clustering-exo-and-ray|🌐 AI Clustering: Exo and Ray]] *(comparison with Pipeline Parallelism)*
3. [[02-materiel/stations-multi-gpu|🧩 Multi-GPU Workstations]] *(NVLink architecture that makes TP possible)*

## 🔗 See also
- [[00-lexique/pipeline-parallelism|Pipeline Parallelism]]
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/ray|Ray]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
