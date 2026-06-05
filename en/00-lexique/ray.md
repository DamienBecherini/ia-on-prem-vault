---
title: Ray
description: Distributed computing framework for multi-node LLM orchestration in production.
aliases:
  - Ray Serve
  - Ray distributed
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
Open-source Python orchestrator to deploy and scale AI applications across multiple servers, often paired with vLLM.

## 📖 Detailed definition
Ray uses a Master/Worker architecture on server farms. Paired with vLLM, it orchestrates [[00-lexique/tensor-parallelism|Tensor Parallelism]] (matrix split within a node) and [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] (split across nodes). It also enables **Prefill/Decode disaggregation**: one server dedicated to prompt computation ([[00-lexique/prefill|Prefill]]), another to generation ([[00-lexique/decoding|Decoding]]).

Contrast with [[00-lexique/exo|Exo]]: Ray targets enterprise production (monitoring, fault tolerance, smart routing); Exo targets desktop/homelab.

## 💡 Why it matters for on-prem AI
De facto standard for sovereign datacenters. The only architecture that guarantees SLA, high concurrency, and fault tolerance on a multi-node GPU cluster.

## ⚠️ Common pitfalls
- Complex to operate: requires configured AI networking (RoCE/InfiniBand), shared storage, HPC skills.
- Unnecessary and oversized for office or SMB scenarios.

## 📚 Go deeper
1. [[03-stack-logicielle/clustering-exo-and-ray|🌐 AI Clustering: Exo and Ray]] *(full chapter)*
2. [[04-blueprints/scenario-d-datacenter|🏢 Scenario D: Datacenter]] *(Ray + vLLM + RoCE blueprint)*
3. [[00-lexique/tensor-parallelism|Tensor Parallelism]] *(intra-node strategy used by Ray)*

## 🔗 See also
- [[00-lexique/exo|Exo]]
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/roce|RoCE]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
