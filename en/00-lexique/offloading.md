---
title: Offloading
description: Technique that places part of the model in RAM or on SSD when VRAM is insufficient, at the cost of reduced throughput.
aliases:
  - CPU offloading
tags:
  - lexique
  - stack
last_modified: "2026-11-22"
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
| Thunderbolt 4 (external GPU) | ~4 GB/s (32 Gb/s PCIe tunnel) | Prohibitive if weights are copied on every pass; otherwise, only slows down initial loading |

Approximate throughput formula for partial offloading (P_VRAM and P_RAM: GB of weights placed in VRAM and in RAM; D: bandwidth in GB/s):

$$\text{tokens/s} \approx \frac{1}{\frac{P_{VRAM}}{D_{VRAM}} + \frac{P_{RAM}}{D_{RAM}}}$$

## 💡 Why it matters for on-prem AI

Offloading is at the heart of **Scenario A (Dev Lab)**: a machine under €3,500 with 16–24 GB VRAM can run a 70B model in Q4 (~40 GB) by offloading excess layers to DDR5. Throughput will cap at about 4–5 tokens/s (theoretical bound; measured throughput is lower, see [[04-blueprints/scenario-a-dev-lab|Scenario A]]) rather than 15–40 tokens/s, but that is enough for development and testing.

## ⚠️ Common pitfalls

- Offloading and **concurrency do not mix well**: with 5 simultaneous users, each request rereads the layers left in RAM, which are already bounded by DDR5 bandwidth, collapsing global throughput.
- Offloading to SSD (instead of RAM) is possible but ~10× slower: for a dense model, reserve it for initial loading, not real-time inference. Since Q4 2026, MoEs are an exception: dedicated engines such as InferSSD (Apache-2.0, first release on 30 October 2026) read from NVMe only the routed experts missing from the VRAM/RAM cache, in aligned 4 KiB blocks. This lets a single workstation run an MoE larger than RAM + VRAM: according to the vendor's repository, DeepSeek-V4.1-Flash generates ~7 tokens/s on an RTX 5090 with 32 GB of RAM[^1]. Throughput stays in the single digits and publications measure one request at a time. The KV cache takes fast memory away from the expert cache, and energy per token can increase by up to ~12×[^2]. It is therefore a test bench, not a team server; if the model fits in RAM, stay on llama.cpp.
- Assuming more RAM always compensates: capacity lets you load the model, but throughput remains bounded by RAM bandwidth (~80–100 GB/s with dual-channel DDR5), not by its size.

## 📚 Go deeper

- [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A: Dev Lab (CPU Offloading)]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Unified Memory vs RAM vs VRAM]]

## 🔗 See also

- [[00-lexique/pcie|PCIe]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/vram|VRAM]]
- [[00-lexique/memory-bandwidth|Memory bandwidth]]

[^1]: WiCi, *InferSSD* (Apache-2.0; expert slices aligned on 4 KiB, RAM and VRAM expert cache; DeepSeek-V4.1-Flash-1017 Q8_0 on RTX 5090 + 32 GB of RAM: 7.27 tokens/s in generation versus 0.87 for llama.cpp, vendor measurements; first release v0.1.0 of 2026-10-30), accessed 2026-11-22. <https://github.com/wici-ai/inferssd>; F. Liang et al., *SSD-LLaMA: SSD-Native Inference for Trillion-Parameter MoE at 1+ Token/s on a Consumer PC* (RTX 5090, 16–32 GB of RAM, 4 TB NVMe; Kimi-K2.7-Code at 1.03 tokens/s; batch 1 only), arXiv:2609.18110, 16 September 2026. <https://arxiv.org/abs/2609.18110>; sybil-solutions, *dsv41-flash-offload* ("Every extra GiB of KV is a GiB less for the expert cache, which lowers decode speed"), accessed 2026-11-22. <https://github.com/sybil-solutions/dsv41-flash-offload>
[^2]: K. Kyung, S. Yun, J. H. Ahn, *SSD Offloading for LLM Mixture-of-Experts Weights Considered Harmful in Energy Efficiency* (energy per token up to ~12× the HBM baseline), IEEE CAL, 2025. <https://arxiv.org/abs/2508.06978>
