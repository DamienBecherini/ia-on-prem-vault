---
title: TTFT
description: Time To First Token.
aliases:
  - Time To First Token
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Short definition
Time between sending a request and receiving the first response token.

## 📖 Detailed definition
TTFT mainly reflects prefill latency, context initialization, and runtime overhead.
It complements tokens/s: you can have good throughput but a poor start.

## 💡 Why it matters for on-prem AI
For interactive use, perceived quality depends heavily on TTFT.

## ⚠️ Common pitfalls
- Measuring only tokens/s and ignoring time before the first word.
- Comparing TTFT without stating input prompt length.

## 🔗 See also
- [[00-lexique/prefill|Prefill]]
- [[00-lexique/tokens-per-second|Tokens per second]]
- [[00-lexique/context-window|Context window]]
