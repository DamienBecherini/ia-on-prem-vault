---
title: LLM
description: Large Language Model.
aliases:
  - Large Language Model
tags:
  - lexique
  - fondations
---

## 📝 Short definition

AI model trained on very large text corpora, able to understand and generate text.

## 📖 Detailed definition

Modern LLMs mostly use the Transformer architecture.
Once trained, they mainly serve [[00-lexique/inference|inference]]: on-demand text generation from a prompt.
Practical local performance depends as much on memory hardware as on model size and quantization.

## 💡 Why it matters for on-prem AI

Central stack component: all sizing (RAM/VRAM, throughput, latency) follows from it, especially for local inference — rarely for training from scratch.

## ⚠️ Common pitfalls

- Assuming a “bigger model” is always better for every use case.
- Forgetting performance depends as much on machine memory as on the model.

## 📚 Go deeper

*Want to see what an LLM does when you talk to it?*
1. [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt]] *(tokenisation, prefill, decoding — full cycle)*
2. [[00-lexique/inference|LLM inference]] *(day-to-day use of a trained LLM)*
3. [[01-fondations/quantization-4bit-8bit|🗜️ 4-bit & 8-bit quantization]] *(shrinking a model to fit memory)*

## 🔗 See also

- [[00-lexique/inference|LLM inference]]
- [[00-lexique/quantification|Quantization]]
- [[00-lexique/memory-wall|Memory Wall]]
- [[00-lexique/rag|RAG]]
