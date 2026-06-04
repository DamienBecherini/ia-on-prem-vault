---
title: Offloading
description: Technique that places part of the model in RAM or on SSD when VRAM is insufficient, at the cost of reduced throughput.
aliases:
  - CPU offloading
tags:
  - lexique
  - stack
---

## 📝 Short definition

Technique that moves part of a model's weights out of VRAM (into system RAM or on SSD) so a model too large for VRAM can still run, accepting reduced generation throughput.

## 📖 Detailed definition

When a 40 GB model does not fit in 24 GB of VRAM, llama.cpp can load 24 GB into VRAM and keep the rest in RAM. During inference, each layer "off VRAM" must be transferred over PCIe before computation.

The bottleneck is **PCIe throughput**:

| Connection | Effective bandwidth | Impact on tokens/s |
| :-- | :-- | :-- |
| PCIe 5.0 x16 | ~60 GB/s (bidirectional) | Strong if many layers are offloaded |
| PCIe 4.0 x16 | ~30 GB/s | Significant on 70B models |
| Thunderbolt 4 | ~5 GB/s | Prohibitive for LLMs |

Rough throughput formula for partial offloading (k layers in VRAM out of N total):

$$\text{tokens/s} \approx \frac{1}{\frac{k}{D_{VRAM}} + \frac{N-k}{D_{PCIe}}}$$

## 💡 Why it matters for on-prem AI

Offloading is at the heart of **Scenario A (Dev Lab)**: a machine under €3,500 with 16–24 GB VRAM can run a 70B model in Q4 (~40 GB) by offloading excess layers to DDR5. Throughput will be 3–8 tokens/s rather than 15–40 tokens/s, but that is enough for development and testing.

## ⚠️ Common pitfalls

- Offloading and **concurrency do not mix well**: with 5 simultaneous users, each triggers parallel PCIe transfers, collapsing global throughput.
- Offloading to SSD (instead of RAM) is possible but ~10× slower — reserve it for initial loading, not real-time inference.
- Assuming more RAM always compensates: beyond 64–128 GB, RAM is no longer the bottleneck — PCIe is.

## 📚 Go deeper

- [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A: Dev Lab (CPU Offloading)]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Unified Memory vs RAM vs VRAM]]

## 🔗 See also

- [[00-lexique/pcie|PCIe]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/vram|VRAM]]
- [[00-lexique/memory-bandwidth|Memory bandwidth]]
