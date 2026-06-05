---
title: Q4 Quantization
description: The most widely used 4-bit quantization format for local inference — especially Q4_K_M in the GGUF/Ollama ecosystem.
aliases:
  - Q4
  - Q4_K_M
  - 4-bit quantization
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Quantization where weights are compressed to about 4 bits per parameter, dividing memory footprint by ~4 compared to native BF16. The `Q4_K_M` format is the most used in the Ollama / llama.cpp ecosystem.

> [!note] General context
> This entry covers practical Q4 format. For mathematical foundations and other formats (Q8, AWQ, FP8), see [[00-lexique/quantification|Quantization]].

## 📖 Detailed definition

`Q4_K_M` means:
- **Q4**: 4 bits per parameter (~0.5 effective byte with block metadata)
- **K**: K-means method that groups weights into clusters to minimize precision loss
- **M**: "medium" block size — quality/speed compromise recommended for most uses

Typical VRAM footprints in Q4_K_M:

| Model | Q4_K_M | BF16 (reference) | Gain |
| :-- | :-- | :-- | :-- |
| 7B / 8B | ~5 GB | ~14 GB | ×2.8 |
| 14B | ~9 GB | ~28 GB | ×3.1 |
| 32B | ~20 GB | ~64 GB | ×3.2 |
| 70B | ~40 GB | ~140 GB | ×3.5 |

## 💡 Why it matters for on-prem AI

Q4_K_M lets a user with a ~€3,500 machine (16–24 GB VRAM) run a 70B model with [[00-lexique/offloading|offloading]], or load a 70B comfortably on a 128 GB APU with headroom for [[00-lexique/kv-cache|KV Cache]].

It is also Ollama's default download format: `ollama pull llama3.1:70b` automatically downloads a Q4_K_M build.

## ⚠️ Common pitfalls

- Q4 is not suited to every task: for sensitive uses (precise code editing, medical or legal extraction, custodian agents), overly aggressive quantization can miss nuances or produce partially correct outputs. Prefer Q6_K or Q8 if VRAM allows.
- Do not confuse with Q4_0 (simpler, lower quality than Q4_K_M) or Q4_K_S (lighter, slightly less accurate than K_M).
- Stated footprint is **weights only**: KV Cache adds on top depending on context length.

## 📚 Go deeper

- [[01-fondations/quantization-4bit-8bit|🗜️ 4-bit & 8-bit Quantization]] — full mathematical mechanism
- [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A]] — concrete Q4 usage with offloading

## 🔗 See also

- [[00-lexique/quantification|Quantization]] — overview (Q8, AWQ, FP8)
- [[00-lexique/gguf|GGUF]] — file format that embeds quantization
- [[00-lexique/offloading|Offloading]]
