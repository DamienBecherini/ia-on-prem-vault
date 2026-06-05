---
title: Tokens per second
description: Measure of a model's generation throughput.
aliases:
  - tokens/s
  - tok/s
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
Number of tokens the model generates per second during the generation phase.

## 📖 Detailed definition
This metric depends on the model, quantization, inference engine, batch size, and hardware.
It is a practical indicator of user-facing "smoothness," but it must be read together with TTFT.

## 💡 Why it matters for on-prem AI
The most intuitive metric for comparing hardware setups in conversational use.

## 🔗 See also
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/decoding|Decoding]]
- [[00-lexique/memory-bandwidth|Memory bandwidth]]
