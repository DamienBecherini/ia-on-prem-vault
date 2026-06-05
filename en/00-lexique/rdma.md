---
title: RDMA
description: Remote direct memory access without classic CPU copying.
aliases:
  - Remote Direct Memory Access
tags:
  - lexique
  - reseau
last_modified: "2026-06-04"
---


## 📝 Short definition
Network technique to read/write remote memory with low CPU overhead.

## 📖 Detailed definition
In a classic network transfer (TCP/IP), data passes through the CPU (copy user space → kernel → NIC). RDMA bypasses that path: the NIC accesses application memory directly, with ~1–2 µs latency and near-zero CPU load.

Two main implementations:
- **[[00-lexique/infiniband|InfiniBand]]**: dedicated fabric, natively lossless, HPC/high-performance AI standard.
- **[[00-lexique/roce|RoCE]]**: RDMA over Ethernet, lower cost but requires lossless configuration (PFC/ECN).

With **[[00-lexique/gpudirect-rdma|GPUDirect RDMA]]**, DMA goes further: the NIC accesses GPU VRAM directly, without passing through CPU RAM.

## 💡 Why it matters for on-prem AI
As soon as AI workloads are distributed across multiple nodes, RDMA is what separates an efficient cluster from one limited by network latency.

## ⚠️ Common pitfalls
- Comparing RDMA and TCP/IP without considering CPU load and microsecond latency.
- Overestimating RDMA impact on small workloads that are mostly compute-bound.

## 🔗 See also
- [[00-lexique/gpudirect-rdma|GPUDirect RDMA]]
- [[00-lexique/roce|RoCE]]
- [[00-lexique/infiniband|InfiniBand]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[01-fondations/memory-bandwidth|🏎️ Memory Bandwidth & the "Memory Wall"]]
