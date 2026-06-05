---
title: RAM
description: System main memory, second choice for LLM inference when VRAM is insufficient.
aliases:
  - Random Access Memory
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

The machine's primary memory, used by the CPU for the OS and applications. In local AI, it serves as overflow when VRAM is insufficient to load an entire model.

## 📖 Detailed definition

A DDR5-5600 stick in dual-channel offers about **85–90 GB/s** bandwidth under ideal conditions. That is roughly 15× less than GDDR6X VRAM (1,000+ GB/s) and 30× less than datacenter HBM3.

In LLM inference, this difference translates directly into generation throughput: a 7B model entirely in VRAM generates 40–60 tokens/s; the same model partly in RAM often falls to 5–15 tokens/s, because each layer must cross PCIe (~30–60 GB/s effective).

RAM remains useful in three cases:

| Case | Usage |
| :-- | :-- |
| **CPU offloading** (llama.cpp) | Part of the model in RAM, part in VRAM — capacity/throughput trade-off |
| **Unified memory** (Apple/AMD APU) | RAM *is* VRAM — no PCIe copy |
| **Preloading** | The GGUF file is read from SSD and paged into RAM cache before transfer to GPU |

## 💡 Why it matters for on-prem AI

Scenario A (Dev Lab) explicitly relies on RAM offloading to run a 70B model on a ~€3,500 machine without a powerful dedicated GPU. It is the accessible entry point for a solo developer.

## ⚠️ Common pitfalls

- Believing 128 GB of RAM replaces 128 GB of VRAM: throughput is 10–30× lower.
- Ignoring **page cache**: reading a 140 GB GGUF from SSD fills available RAM before inference even starts, risking OOM on tight machines.
- Forgetting that offloading is catastrophic under **concurrency**: each extra user multiplies RAM↔GPU transfers.

## 📚 Go deeper

- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Unified Memory vs RAM vs VRAM]]
- [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A: Dev Lab (CPU Offloading)]]

## 🔗 See also

- [[00-lexique/vram|VRAM]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/pcie|PCIe]]
