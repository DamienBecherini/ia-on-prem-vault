---
title: APU
description: Chip combining CPU, GPU, and NPU on one SoC with shared unified memory.
aliases:
  - Accelerated Processing Unit
tags:
  - lexique
  - materiel
---

## 📝 Short definition

Chip that integrates CPU, GPU (and often NPU) on one die or package, sharing one memory pool without PCIe copies.

## 📖 Detailed definition

An APU differs from a classic PC (CPU + discrete GPU) because processor and graphics memory are not physically separate. CPU and GPU address the same LPDDR5X pool.

Dominant APU platforms for LLM inference in 2026:

| Platform | Example | Allocatable VRAM | Bandwidth |
| :-- | :-- | :-- | :-- |
| Apple Silicon | Mac Studio M3 Ultra | ~160 GB (of 192 GB) | 819 GB/s |
| AMD Gorgon Halo | Ryzen AI Max+ PRO 495 | 160 GB (BIOS, of 192 GB) | ~273 GB/s |

These figures allow running a **quantized 70B model** (~40 GB) with a large context window on a quiet desktop station — impossible on consumer high-end GPUs (24 GB VRAM max in consumer tiers).

## 💡 Why it matters for on-prem AI

The APU is the reference platform for [[04-blueprints/scenario-b-sme-appliance|Scenario B (SME appliance)]]: self-contained, quiet, under ~60 W at light load, hosting a local assistant for teams of 5–20 people.

## ⚠️ Common pitfalls

- LPDDR5X is **soldered**: no post-purchase upgrade. Size the machine upfront.
- Shared CPU + GPU bandwidth: the more the OS and apps load RAM, the less the GPU gets during inference.
- Integrated NPUs (Apple Neural Engine, AMD XDNA) are **not used** by current LLM engines (Ollama, llama.cpp, vLLM) — inference stays on the iGPU.

## 📚 Go deeper

- [[02-materiel/apu-and-unified-memory|🧠 APU & unified memory — full comparison]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Unified memory vs RAM vs VRAM]]

## 🔗 See also

- [[00-lexique/unified-memory|Unified memory]]
- [[00-lexique/npu|NPU]]
- [[00-lexique/vram|VRAM]]
