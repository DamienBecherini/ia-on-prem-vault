---
title: NVLink
description: High-bandwidth interconnect between NVIDIA GPUs.
aliases:
  - NVIDIA NVLink
tags:
  - lexique
  - materiel
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Dedicated hardware link accelerating exchanges between compatible NVIDIA GPUs.

## 📖 Detailed definition

NVLink is the protocol and cabling technology connecting NVIDIA GPUs at very high speed, bypassing PCIe. Throughput varies by generation:

| Version | Total bidirectional bandwidth | Compatible GPUs |
| :-- | :-- | :-- |
| NVLink 3 (A100) | 600 GB/s | A100 SXM |
| NVLink 4 (H100) | 900 GB/s | H100 SXM |
| NVLink 5 (B200) | 1,800 GB/s | B200 (with NVSwitch) |

**NVLink vs [[00-lexique/nvswitch|NVSwitch]]**: NVLink is point-to-point between two GPUs; NVSwitch is the chip forming a non-blocking fabric among all GPUs in an HGX node.

## 💡 Why it matters for on-prem AI

NVLink throughput is a prerequisite for efficient [[00-lexique/tensor-parallelism|Tensor Parallelism]]. Without NVLink, inter-GPU traffic over PCIe (~64 GB/s) becomes the bottleneck.

## ⚠️ Common pitfalls

- **NVLink is gone on workstations since Ada Lovelace.** RTX workstation (RTX 6000 Ada, RTX PRO 6000 Blackwell) and consumer (RTX 40xx, RTX 50xx) cards **no longer have a physical NVLink connector**. NVIDIA removed external NVLink bridges from those lines. You cannot link two RTX PRO 6000 via NVLink — the connector does not exist. NVLink today is strictly for SXM GPUs (A100, H100, H200, B200) in HGX/DGX systems.
- Two GPUs in point-to-point NVLink do not reach full NVSwitch fabric bandwidth.
- Do not confuse “supports CUDA” with “supports NVLink” — a card can run CUDA/vLLM with zero NVLink capability.

## 🔗 See also

- [[00-lexique/nvswitch|NVSwitch]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[00-lexique/pcie|PCIe]]
- [[00-lexique/hbm|HBM]]
