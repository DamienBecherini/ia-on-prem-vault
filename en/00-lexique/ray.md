---
title: Ray
description: Distributed computing framework for multi-node LLM orchestration in production.
aliases:
  - Ray Serve
  - Ray distributed
tags:
  - lexique
  - fondations
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
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
- Leaving a multi-node cluster without authentication: since Ray 2.59 (2 October 2026), token authentication is on by default only for local clusters; a remote or multi-node cluster stays open until Ray 2.61, unless `RAY_AUTH_MODE=token` is set on every node[^1].
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

[^1]: Ray Project, *Release ray-2.59.0* ("token authentication by default for local clusters … Remote and multi-node clusters are unchanged"), 2026-10-02; Ray Docs, *Token authentication* ("Ray 2.61 extends the default to all clusters"), consulted on 2026-10-10. [https://github.com/ray-project/ray/releases/tag/ray-2.59.0](https://github.com/ray-project/ray/releases/tag/ray-2.59.0) · [https://docs.ray.io/en/latest/ray-security/token-auth.html](https://docs.ray.io/en/latest/ray-security/token-auth.html)
