---
title: HBM
description: Stacked high-bandwidth memory used on professional AI accelerators.
aliases:
  - High Bandwidth Memory
tags:
  - lexique
  - materiel
---

## 📝 Short definition

Memory technology stacking several DRAM dies vertically for bandwidth far above consumer GDDR — reserved for professional accelerators (H100, MI300X, TPU).

## 📖 Detailed definition

Where a consumer RTX 4090 offers ~1,008 GB/s via GDDR6X, HBM3 reaches:

| Chip | Memory | Bandwidth |
| :-- | :-- | :-- |
| NVIDIA H100 SXM5 | HBM3 80 GB | **3.35 TB/s** |
| AMD MI300X | HBM3 192 GB | **5.3 TB/s** |
| Apple M3 Ultra | LPDDR5X 192 GB | 819 GB/s |
| RTX 4090 (consumer) | GDDR6X 24 GB | ~1,008 GB/s |

That gap explains why the [[00-lexique/memory-wall|Memory Wall]] is less constraining on an H100: it can sustain 70B generation throughput without being as memory-bound as a workstation card.

HBM is stacked on the die substrate via TSV (Through-Silicon Via), shortening electrical paths and lowering latency.

## 💡 Why it matters for on-prem AI

HBM appears in datacenter chips — out of typical on-prem budgets except in [[04-blueprints/scenario-d-datacenter|Scenario D]]. Knowing these numbers calibrates expectations: a rented H100 at €3/h is not comparable to a €2,000 RTX 4090 even if both “do AI.”

## ⚠️ Common pitfalls

- Confusing HBM and GDDR VRAM in comparisons: bandwidth orders of magnitude differ.
- Treating HBM as “just better GDDR”: it is 3D stacking with radically different thermal and cost constraints.

## 📚 Go deeper

- [[01-fondations/memory-bandwidth|🏎️ Memory bandwidth & the Memory Wall]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Unified memory vs RAM vs VRAM]]

## 🔗 See also

- [[00-lexique/vram|VRAM]]
- [[00-lexique/memory-wall|Memory Wall]]
- [[00-lexique/memory-bandwidth|Memory bandwidth]]
