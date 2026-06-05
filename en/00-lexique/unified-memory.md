---
title: Unified Memory
description: Memory architecture shared between CPU, GPU, and NPU.
aliases:
  - Unified memory
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
Architecture where CPU, GPU, and sometimes NPU share one memory pool.

## 📖 Detailed definition
Unlike separate RAM + VRAM, unified memory avoids some copies over PCIe.
It appears notably on Apple Silicon and some recent AMD APU platforms.

## 💡 Why it matters for on-prem AI
Can offer an excellent trade-off between capacity the GPU can use and architectural simplicity.

## 🔗 See also
- [[00-lexique/vram|VRAM]]
- [[00-lexique/pcie|PCIe]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Unified Memory vs RAM vs VRAM]]
