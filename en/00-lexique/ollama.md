---
title: "Ollama"
description: "Simplified local runtime to download and run LLMs via llama.cpp, with OpenAI-compatible API."
aliases:
  - Ollama runtime
tags:
  - lexique
  - stack
sidebar:
  order: 64
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
---

## 📝 Short definition

A distribution and CLI that wraps **llama.cpp** to run [[00-lexique/gguf|GGUF]] models locally in a few commands, with an OpenAI-compatible API server on port 11434[^1].

## 📖 Detailed definition

[Ollama](https://ollama.com/) is the shortest path to **test** an [[00-lexique/llm|LLM]] on-premise: `ollama pull`, `ollama run`, then connect a UI ([[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]], Python script, etc.).

Under the hood, Ollama relies on **llama.cpp** (C/C++): aggressive [[00-lexique/quantification|quantization]] (Q4_K_M, etc.), CPU/GPU [[00-lexique/offloading|offloading]] on modest machines, Apple Silicon support via unified memory. Native format: [[00-lexique/gguf|GGUF]].

## 💡 Why it matters for on-prem AI

- **Scenario A** (dev lab) and first steps of **Scenario B** (SMB): validate model, prompts, light RAG before switching to [[00-lexique/vllm|vLLM]].
- Reference for [[06-mise-en-oeuvre/getting-started-with-ollama|Getting started with Ollama]] and [[06-mise-en-oeuvre/evaluate-local-model|evaluating a local model]] guides.
- Local embedding models (`nomic-embed-text`, etc.) via the same API.

## ⚠️ Common pitfalls

- Serving **multiple simultaneous users** in production: llama.cpp/Ollama's sequential architecture saturates quickly (latency ×10 beyond ~5–10 parallel requests depending on config)[^2].
- Confusing "downloaded model" with "model suited to the business": always validate with a golden dataset.
- Exposing API 11434 without authentication on the internal network: see [[06-mise-en-oeuvre/local-inference-security|inference security]].

## 📚 To go deeper

1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]] — Ollama vs vLLM limits
2. [[06-mise-en-oeuvre/getting-started-with-ollama|🚀 Getting started with Ollama]]
3. [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A — Dev Lab]]

## 🔗 See also

- [[00-lexique/vllm|vLLM]]
- [[00-lexique/gguf|GGUF]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: Ollama — site and documentation. [https://ollama.com/](https://ollama.com/)
[^2]: Particula Tech, *Ollama vs vLLM: Which LLM Server Actually Fits in 2026* (community comparisons under concurrent load, order of magnitude ×5–×16 depending on model/GPU), March 2026. [https://particula.tech/blog/ollama-vs-vllm-comparison](https://particula.tech/blog/ollama-vs-vllm-comparison) — see also [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]].
