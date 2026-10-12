---
title: LPDDR5X
description: "Low-power RAM standardized by JEDEC and soldered next to the chip; it powers unified-memory machines such as Macs, AMD Ryzen AI Max and DGX Spark."
aliases:
  - LPDDR5x
  - Low Power DDR5X
tags:
  - lexique
  - materiel
last_modified: "2026-10-11"
---

## 📝 Short definition

A type of RAM ("Low Power DDR") designed to use little power, first for smartphones, now used as the shared memory of [[00-lexique/unified-memory|unified-memory]] machines.

## 📖 Detailed definition

JEDEC, the body that standardizes memory, published the JESD209-5B standard in July 2021: it raises the LPDDR5 data rate up to 8,533 Mbit/s and adds LPDDR5X, an optional extension aimed at mobile devices, automotive and edge AI[^1]. Unlike the DDR5 modules of a PC, LPDDR5X is generally soldered onto the board, as close as possible to the chip, and cannot be replaced.

[[00-lexique/memory-bandwidth|Bandwidth]] depends on the speed and the width of the bus. Example with the AMD Ryzen AI Max+ PRO 495 (LPDDR5X-8533, 256-bit bus)[^2]:

> 8,533 million transfers/s × 256 bits ÷ 8 = ~273 GB/s

That is much less than the GDDR7 [[00-lexique/vram|VRAM]] of a high-end graphics card, but with a much larger capacity (up to 192 GB on this chip)[^2].

## 💡 Why it matters for on-premise AI

On a unified-memory [[00-lexique/soc|SoC]], LPDDR5X sets both the size of the models that can be loaded (capacity) and their generation speed (bandwidth). Because it is soldered, the capacity chosen at purchase is final.

## ⚠️ Common pitfalls

- Comparing capacity only: at equal capacity, an LPDDR5X machine generates more slowly than a GPU with GDDR7 or [[00-lexique/hbm|HBM]] on a model that fits in its VRAM.
- Forgetting the bus width: the same LPDDR5X-8533 gives ~273 GB/s on 256 bits, twice that on 512 bits.
- Planning a "memory upgrade" later: impossible, the memory is soldered.

## 📚 To go deeper

- [[02-materiel/apu-and-unified-memory|🧠 APU & Unified Memory]] *(capacities and bandwidths by machine)*
- [[01-fondations/memory-bandwidth|🏎️ Memory Bandwidth]] *(why the data rate sets the generation speed)*

## 🔗 See also

- [[00-lexique/unified-memory|Unified memory]]
- [[00-lexique/memory-bandwidth|Memory bandwidth]]
- [[00-lexique/soc|SoC]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: JEDEC, *JEDEC Publishes New and Updated Standards for Low Power Memory Devices Used in 5G and AI Applications* (JESD209-5B: LPDDR5 up to 8,533 Mbit/s, LPDDR5X as an optional extension for mobile, automotive, AR/VR and edge AI), July 28, 2021. [https://www.jedec.org/news/pressreleases/jedec-publishes-new-and-updated-standards-low-power-memory-devices-used-5g-and-ai](https://www.jedec.org/news/pressreleases/jedec-publishes-new-and-updated-standards-low-power-memory-devices-used-5g-and-ai)
[^2]: AMD, *AMD Ryzen AI Max+ PRO 495* — product sheet (192 GB LPDDR5X-8533, 256-bit bus), accessed 2026-10-09. [https://www.amd.com/en/products/processors/laptop/ryzen-pro/ai-max-pro-400-series/amd-ryzen-ai-max-plus-pro-495.html](https://www.amd.com/en/products/processors/laptop/ryzen-pro/ai-max-pro-400-series/amd-ryzen-ai-max-plus-pro-495.html)
