---
title: Multi-GPU
description: Joint use of several GPUs.
aliases:
  - Multi GPU
tags:
  - lexique
  - materiel
last_modified: "2026-06-04"
---

## 📝 Short definition

Architecture using several GPU cards in one machine or cluster.

## 📖 Detailed definition

Multi-GPU increases total memory capacity, throughput, or both. Gains depend directly on inter-GPU links:

| Topology | Inter-GPU bandwidth | Typical use |
| :-- | :-- | :-- |
| PCIe x16 | ~64 GB/s (Gen5) | desktop builds, Exo |
| NVLink (H100) | 900 GB/s | pro/datacenter nodes |
| NVLink + NVSwitch (HGX) | 1,800 GB/s full fabric | HGX B200 clusters |

Two parallelism strategies use multi-GPU: [[00-lexique/tensor-parallelism|Tensor Parallelism]] (splits work within a layer) and [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] (splits layers across nodes).

## 💡 Why it matters for on-prem AI

Required for models exceeding one GPU’s VRAM (e.g. Llama 3.1 405B in FP8 ≈ 200 GB). Interconnect speed is often more limiting than raw compute.

## ⚠️ Common pitfalls

- Several GPUs’ VRAM is not one unified pool on PCIe: each GPU reaches another’s weights over the bus with latency.
- On PCIe, Tensor Parallelism is inefficient: prefer Pipeline Parallelism to reduce exchange frequency.

## 🔗 See also

- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/nvswitch|NVSwitch]]
- [[00-lexique/pcie|PCIe]]
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/pipeline-parallelism|Pipeline Parallelism]]
- [[00-lexique/rdma|RDMA]]
