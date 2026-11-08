---
title: GPUDirect RDMA
description: Mechanism letting GPUs exchange data directly with network devices without CPU copies.
aliases:
  - GPUDirect
  - GPU Direct RDMA
tags:
  - lexique
  - fondations
last_modified: "2026-11-08"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

NVIDIA technology letting a GPU send or receive data directly from/to a compatible NIC without CPU memory (zero-copy).

## 📖 Detailed definition

In a classic pipeline, GPU → network requires: GPU VRAM → CPU RAM → NIC (two copies). GPUDirect RDMA removes the CPU copy by letting the NIC access GPU VRAM directly over PCIe (DMA-BUF).

> [!info] Requirements
> - Compatible NVIDIA GPU and Mellanox/ConnectX NIC.
> - InfiniBand or RoCE configured in lossless mode.
> - Kernel support: DMA-BUF (the approach recommended by NVIDIA when the kernel and driver allow it) or, failing that, the legacy `nvidia-peermem` module.

Used by NCCL for inter-node communication in distributed clusters.

## 💡 Why it matters for on-prem AI

Cuts latency and CPU load during inter-GPU sync on InfiniBand or RoCE. Critical to sustain [[00-lexique/tensor-parallelism|Tensor Parallelism]] and [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] throughput at scale.

## ⚠️ Common pitfalls

- Fails if GPU and NIC sit on separate PCIe branches with unfavorable NUMA topology.
- Without DMA-BUF or a loaded `nvidia-peermem`, NCCL silently falls back to CPU copy: check in the logs (`NCCL_DEBUG=INFO`) that the `NET/IB/GDRDMA` path is actually used.

## 🔗 See also

- [[00-lexique/rdma|RDMA]]
- [[00-lexique/nccl|NCCL]]
- [[00-lexique/infiniband|InfiniBand]]
- [[00-lexique/pcie|PCIe]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
