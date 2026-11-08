---
title: Offloading
description: Technique that places part of the model in RAM or on SSD when VRAM is insufficient, at the cost of reduced throughput.
aliases:
  - CPU offloading
tags:
  - lexique
  - stack
last_modified: "2026-11-08"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Technique that moves part of a model's weights out of VRAM (into system RAM or on SSD) so a model too large for VRAM can still run, accepting reduced generation throughput.

## 📖 Detailed definition

When a 40 GB model does not fit in 24 GB of VRAM, llama.cpp can load about twenty GB into VRAM and keep the rest in RAM. During inference, the "off VRAM" layers are computed by the CPU directly in RAM (`-ngl` option): only the activations cross PCIe.

The bottleneck is **system RAM bandwidth** (~80–100 GB/s with dual-channel DDR5); PCIe only becomes limiting if weights are copied to the GPU on every pass:

| Connection | Effective bandwidth | Impact on tokens/s |
| :-- | :-- | :-- |
| PCIe 5.0 x16 | ~64 GB/s per direction (~128 GB/s bidirectional) | Limiting if weights are copied on every pass |
| PCIe 4.0 x16 | ~32 GB/s per direction (~64 GB/s bidirectional) | Same, twice as slow |
| Thunderbolt 4 | ~5 GB/s | Prohibitive for LLMs |

Approximate throughput formula for partial offloading (P_VRAM and P_RAM: GB of weights placed in VRAM and in RAM; D: bandwidth in GB/s):

$$\text{tokens/s} \approx \frac{1}{\frac{P_{VRAM}}{D_{VRAM}} + \frac{P_{RAM}}{D_{RAM}}}$$

## 💡 Why it matters for on-prem AI

Offloading is at the heart of **Scenario A (Dev Lab)**: a machine under €3,500 with 16–24 GB VRAM can run a 70B model in Q4 (~40 GB) by offloading excess layers to DDR5. Throughput will be about 4–5 tokens/s as a theoretical bound (8–12 reported by the community, see [[04-blueprints/scenario-a-dev-lab|Scenario A]]) rather than 15–40 tokens/s, but that is enough for development and testing.

## ⚠️ Common pitfalls

- Offloading and **concurrency do not mix well**: with 5 simultaneous users, each request rereads the layers left in RAM, which are already bounded by DDR5 bandwidth, collapsing global throughput.
- Offloading to SSD (instead of RAM) is possible but ~10× slower — reserve it for initial loading, not real-time inference.
- Assuming more RAM always compensates: capacity lets you load the model, but throughput remains bounded by RAM bandwidth (~80–100 GB/s with dual-channel DDR5), not by its size.

## 📚 Go deeper

- [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A: Dev Lab (CPU Offloading)]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Unified Memory vs RAM vs VRAM]]

## 🔗 See also

- [[00-lexique/pcie|PCIe]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/vram|VRAM]]
- [[00-lexique/memory-bandwidth|Memory bandwidth]]
