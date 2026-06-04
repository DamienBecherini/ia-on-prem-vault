---
title: InfiniBand
description: Dedicated high-performance network fabric for GPU clusters, HPC and AI datacenter standard.
aliases:
  - IB
  - HDR InfiniBand
  - NDR InfiniBand
tags:
  - lexique
  - fondations
---

## 📝 Short definition

Dedicated low-latency, high-bandwidth network (up to 400–800 Gb/s per link) built for HPC and GPU AI clusters.

## 📖 Detailed definition

InfiniBand is both a protocol and physical fabric (cables, switches, HCA cards). It natively supports [[00-lexique/rdma|RDMA]] — GPUs can send data directly without the CPU.

Generations: HDR (200 Gb/s), NDR (400 Gb/s), XDR (800 Gb/s per port).

**InfiniBand vs [[00-lexique/roce|RoCE]]:**
- InfiniBand: dedicated fabric, natively lossless, lowest latency (~1 µs), high cost.
- RoCE: RDMA on standard Ethernet, cheaper but needs strict network config (PFC/ECN) to avoid packet loss.

## 💡 Why it matters for on-prem AI

De facto standard for production GPU clusters (AI datacenters, HPC). Required for full-throughput [[00-lexique/tensor-parallelism|Tensor Parallelism]] and [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] across nodes.

## ⚠️ Common pitfalls

- Needs dedicated hardware and HPC networking skills.
- Mostly proprietary stack (NVIDIA/Mellanox): hard migration to Ethernet.
- Total cost (switches, cables, HCAs) can exceed GPU server cost.

## 🔗 See also

- [[00-lexique/rdma|RDMA]]
- [[00-lexique/roce|RoCE]]
- [[00-lexique/gpudirect-rdma|GPUDirect RDMA]]
- [[04-blueprints/scenario-d-datacenter|🏢 Scenario D: datacenter]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
