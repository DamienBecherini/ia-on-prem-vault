---
title: SoC
description: "System on a Chip: a single chip that combines processor, graphics, AI accelerator and memory controller; the basis of Apple Silicon Macs and DGX Spark."
aliases:
  - System on a Chip
  - Système sur puce
tags:
  - lexique
  - materiel
last_modified: "2026-10-11"
---

## 📝 Short definition

A single chip that contains nearly a whole computer: processor (CPU), graphics chip (GPU), often an AI accelerator ([[00-lexique/npu|NPU]]) and the memory controller.

## 📖 Detailed definition

In a conventional PC, the processor and the graphics card are two separate components, each with its own memory, connected by the [[00-lexique/pcie|PCIe]] bus. A SoC (*System on a Chip*) brings these blocks together in a single package. Apple describes it this way for its first M1 chip: "As a system on a chip (SoC), M1 combines numerous powerful technologies into a single chip", with a [[00-lexique/unified-memory|unified memory]] architecture[^1].

Examples in local AI:

- **Apple M5 Max / M5 Ultra** (Mac Studio): CPU and GPU on the same chip, sharing up to 128 GB (M5 Max) or 512 GB (M5 Ultra) of unified memory[^2].
- **AMD Ryzen AI Max PRO 400**: Zen 5 CPU and Radeon 8065S GPU on the same chip, with up to 192 GB of shared memory; it is called an [[00-lexique/apu|APU]][^3].
- **NVIDIA GB10** (DGX Spark), which NVIDIA calls a *Superchip*: 20-core ARM CPU and Blackwell GPU with 128 GB of LPDDR5x unified memory[^4].

## 💡 Why it matters for on-premise AI

Because the CPU and GPU share the same memory, a SoC can give the GPU 128 GB or more, whereas a consumer graphics card remains limited to its own [[00-lexique/vram|VRAM]]. This is what makes it possible to run large models on a desktop workstation.

## ⚠️ Common pitfalls

- Confusing SoC and APU: an APU is a SoC (or a package) that combines CPU and GPU; the term is mostly used by AMD.
- Assuming a SoC's memory can be expanded after purchase: it is generally soldered ([[00-lexique/lpddr5x|LPDDR5X]]).

## 📚 To go deeper

- [[02-materiel/apu-and-unified-memory|🧠 APU & Unified Memory]] *(Apple, AMD, NVIDIA comparison)*
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Unified Memory vs RAM vs VRAM]]

## 🔗 See also

- [[00-lexique/apu|APU]]
- [[00-lexique/unified-memory|Unified memory]]
- [[00-lexique/npu|NPU]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: Apple Newsroom, *Apple unleashes M1* ("As a system on a chip (SoC), M1 combines numerous powerful technologies into a single chip", unified memory architecture), November 10, 2020. [https://www.apple.com/newsroom/2020/11/apple-unleashes-m1/](https://www.apple.com/newsroom/2020/11/apple-unleashes-m1/)
[^2]: Apple Newsroom, *Apple introduces new Mac Studio with M5 Max and M5 Ultra* (CPU up to 36 cores, GPU up to 80 cores, up to 512 GB of unified memory), August 25, 2026. [https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/)
[^3]: AMD, *AMD Ryzen AI Max+ PRO 495* — product sheet (16 Zen 5 cores, Radeon 8065S, 192 GB LPDDR5X-8533, 256-bit bus), accessed 2026-10-09. [https://www.amd.com/en/products/processors/laptop/ryzen-pro/ai-max-pro-400-series/amd-ryzen-ai-max-plus-pro-495.html](https://www.amd.com/en/products/processors/laptop/ryzen-pro/ai-max-pro-400-series/amd-ryzen-ai-max-plus-pro-495.html)
[^4]: NVIDIA, *DGX Spark* — official product page (GB10 Grace Blackwell Superchip, 20-core ARM CPU, 128 GB LPDDR5x unified memory), accessed 2026-10-11. [https://www.nvidia.com/en-us/products/workstations/dgx-spark/](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
