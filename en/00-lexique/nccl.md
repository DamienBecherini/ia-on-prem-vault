---
title: NCCL
description: NVIDIA collective communication library optimized for large-scale GPU-to-GPU transfers.
aliases:
  - NVIDIA Collective Communications Library
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---

## 📝 Short definition

NVIDIA software library handling collective ops (AllReduce, AllGather, Broadcast) across GPUs, using NVLink, InfiniBand, or PCIe per topology.

## 📖 Detailed definition

NCCL (pronounced “nickel”) underpins PyTorch, vLLM, TensorRT-LLM, and Ray for synchronizing gradients or activations across GPUs.

Main operations:
- **AllReduce**: sum/average a tensor on all GPUs (distributed training and Tensor Parallelism).
- **AllGather**: each GPU collects fragments from others.
- **Broadcast**: sends one tensor from a master GPU to all others.

NCCL auto-detects topology (NVLink > InfiniBand > PCIe > Ethernet) and optimizes communication paths.

## 💡 Why it matters for on-prem AI

Invisible but critical layer: if NCCL is not configured for NVLink or InfiniBand, all inter-GPU traffic goes over PCIe and sharply degrades [[00-lexique/tensor-parallelism|Tensor Parallelism]] throughput.

## ⚠️ Common pitfalls

- `NCCL_P2P_DISABLE=1` disables direct peer-to-peer transfers — a common misconfiguration that can cut performance fivefold.
- NCCL logs show detected topology: always verify NVLink is selected on HGX nodes.

## 🔗 See also

- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
