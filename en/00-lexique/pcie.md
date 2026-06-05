---
title: PCIe
description: High-bandwidth interconnect bus between components.
aliases:
  - PCI Express
  - Peripheral Component Interconnect Express
tags:
  - lexique
  - materiel
last_modified: "2026-06-04"
---


## 📝 Short definition
Standard bus linking CPU, GPU, SSD, and other peripherals.

## 📖 Detailed definition
In local AI, PCIe carries data between system RAM and discrete GPU (offloading) and between GPUs in multi-GPU setups without NVLink.

Maximum throughput by generation:

| Generation | Unidirectional x16 | Bidirectional x16 |
| :-- | :-- | :-- |
| PCIe 4.0 | ~32 GB/s | ~64 GB/s |
| PCIe 5.0 | ~64 GB/s | ~128 GB/s |
| PCIe 6.0 | ~128 GB/s | ~256 GB/s |

For comparison, NVLink 4 (H100) offers 900 GB/s — about **14×** more than a PCIe 5.0 x16 link.

## 💡 Why it matters for on-prem AI
PCIe transfer cost strongly affects CPU→GPU offloading and is the limiting factor for Tensor Parallelism on desktop setups without NVLink.

## ⚠️ Common pitfalls
- Theoretical PCIe bandwidth is divided by the number of GPUs sharing the same CPU controller.
- PCIe 5.0 x8 (common on mid-range motherboards) offers only as much as PCIe 4.0 x16.

## 🔗 See also
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[00-lexique/unified-memory|Unified memory]]
