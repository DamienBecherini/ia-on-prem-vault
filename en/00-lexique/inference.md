---
title: LLM inference
description: Using a trained model to generate text on demand.
aliases:
  - LLM inference
  - Inference
tags:
  - lexique
  - fondations
---

## 📝 Short definition

Phase where a trained [[00-lexique/llm|LLM]] produces a response from a prompt, token by token.

## 📖 Detailed definition

**Training** (learning weights on large corpora) is distinct from **inference** (running the model to answer). In on-prem AI, local inference dominates: Ollama, llama.cpp, vLLM, etc.

A request splits into two phases: [[00-lexique/prefill|Prefill]] (processing the prompt) then [[00-lexique/decoding|Decoding]] (autoregressive generation).

## 💡 Why it matters for on-prem AI

All hardware sizing (RAM, VRAM, bandwidth, [[00-lexique/tokens-per-second|tokens/s]], [[00-lexique/ttft|TTFT]]) targets inference, not training. The [[00-lexique/memory-wall|Memory Wall]] bottleneck appears mainly in decoding.

## ⚠️ Common pitfalls

- Confusing advertised TFLOPS with real generation throughput.
- Forgetting inference and training have different hardware constraints.

## 📚 Go deeper

*Want inference step by step?*
1. [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt]] *(full cycle: tokenisation → prefill → decoding)*
2. [[01-fondations/memory-bandwidth|🏎️ Memory bandwidth]] *(why memory caps generation speed)*
3. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]] *(Ollama, vLLM, TensorRT-LLM)*

## 🔗 See also

- [[00-lexique/llm|LLM]]
- [[00-lexique/prefill|Prefill]]
- [[00-lexique/decoding|Decoding]]
- [[00-lexique/memory-wall|Memory Wall]]
- [[01-fondations/memory-bandwidth|🏎️ Memory bandwidth & the Memory Wall]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
