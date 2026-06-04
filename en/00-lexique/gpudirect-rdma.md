---
title: GPUDirect RDMA
description: Mechanism letting GPUs exchange data directly with network devices without CPU copies.
aliases:
  - GPUDirect
  - GPU Direct RDMA
tags:
  - lexique
  - fondations
---

## 📝 Short definition

NVIDIA technology letting a GPU send or receive data directly from/to a compatible NIC without CPU memory (zero-copy).

## 📖 Detailed definition

In a classic pipeline, GPU → network requires: GPU VRAM → CPU RAM → NIC (two copies). GPUDirect RDMA removes the CPU copy by letting the NIC access GPU VRAM directly over PCIe (DMA-BUF).

> [!info] Requirements
> - Compatible NVIDIA GPU and Mellanox/ConnectX NIC.
> - InfiniBand or RoCE configured in lossless mode.
> - `nvidia-peermem` drivers loaded.

Used by NCCL for inter-node communication in distributed clusters.

## 💡 Why it matters for on-prem AI

Cuts latency and CPU load during inter-GPU sync on InfiniBand or RoCE. Critical to sustain [[00-lexique/tensor-parallelism|Tensor Parallelism]] and [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] throughput at scale.

## ⚠️ Common pitfalls

- Fails if GPU and NIC sit on separate PCIe branches with unfavorable NUMA topology.
- Requires `nvidia-peermem`: if missing, NCCL silently falls back to CPU copy without a clear warning.

## 🔗 See also

- [[00-lexique/rdma|RDMA]]
- [[00-lexique/nccl|NCCL]]
- [[00-lexique/infiniband|InfiniBand]]
- [[00-lexique/pcie|PCIe]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
