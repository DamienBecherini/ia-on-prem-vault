---
title: Memory Wall
description: Performance limit caused by memory rather than compute.
aliases:
  - Memory wall
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---

## 📝 Short definition

Situation where memory throughput limits performance more than raw compute power.

## 📖 Detailed definition

In modern AI workloads, especially autoregressive generation, compute units often wait for data.
When the arithmetic intensity ratio turns unfavorable, final throughput drops.

## 💡 Why it matters for on-prem AI

Machine choice is not TFLOPS alone: memory bandwidth, memory type, and interconnects directly affect user experience.

## ⚠️ Common pitfalls

- Buying hardware on TFLOPS alone.
- Ignoring the gap between prefill and decoding performance.

## 🔗 See also

- [[00-lexique/memory-bandwidth|Memory bandwidth]]
- [[00-lexique/decoding|Decoding]]
- [[01-fondations/memory-bandwidth|🏎️ Memory bandwidth & the Memory Wall]]
