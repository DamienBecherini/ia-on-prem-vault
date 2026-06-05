---
title: VRAM
description: Video memory dedicated to the GPU.
aliases:
  - Video RAM
  - Mémoire vidéo
tags:
  - lexique
  - materiel
last_modified: "2026-06-04"
---


## 📝 Short definition
Very high-bandwidth memory attached to the GPU (e.g. GDDR7).

## 📖 Detailed definition
VRAM holds weights, activations, [[00-lexique/kv-cache|KV Cache]], and buffers for models running on the GPU. It delivers far higher throughput than system RAM:

| Memory | Type | Typical throughput |
| :-- | :-- | :-- |
| DDR5 (PC RAM) | SDRAM | ~100–200 GB/s |
| GDDR7 (RTX 50xx) | GDDR | ~1,700 GB/s |
| HBM3e (H100) | HBM | ~3,350 GB/s |

VRAM bandwidth is the limiting factor for [[00-lexique/decoding|Decoding]]—the principle behind the [[00-lexique/memory-wall|Memory Wall]].

## 💡 Why it matters for on-prem AI
VRAM capacity and bandwidth determine which models can run fast without heavy offloading. To estimate VRAM needed: model size (GB) + ≈20% for KV Cache and activations.

## ⚠️ Common pitfalls
- Looking only at VRAM capacity and ignoring memory bandwidth.
- On multi-GPU setups without NVLink, VRAM on each GPU is **not** one unified pool: each GPU only sees its own VRAM directly.

## 🔗 See also
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/memory-wall|Memory Wall]]
- [[00-lexique/hbm|HBM]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/unified-memory|Unified memory]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Unified Memory vs RAM vs VRAM]]
