---
title: "Ollama"
description: "Simplified local runtime to download and run LLMs via llama.cpp or MLX, with OpenAI-compatible API."
aliases:
  - Ollama runtime
tags:
  - lexique
  - stack
sidebar:
  order: 64
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
---

## 📝 Short definition

A distribution and CLI that runs [[00-lexique/llm|LLMs]] locally in a few commands, via **llama.cpp** (Linux, Windows, [[00-lexique/gguf|GGUF]] format) or, since version 0.40 (October 2026) on Apple Silicon, via Apple's **MLX** engine by default, with an OpenAI-compatible API server on port 11434[^1][^3].

## 📖 Detailed definition

[Ollama](https://ollama.com/) is the shortest path to **test** an [[00-lexique/llm|LLM]] on-premise: `ollama pull`, `ollama run`, then connect a UI ([[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]], Python script, etc.).

Under the hood, Ollama relies on **llama.cpp** (C/C++) — aggressive [[00-lexique/quantification|quantization]] (Q4_K_M, etc.), CPU/GPU [[00-lexique/offloading|offloading]] on modest machines, [[00-lexique/gguf|GGUF]] format — and, on Apple Silicon, on the **MLX** engine (safetensors weights, unified memory), used by default since 0.40 for supported architectures[^3].

## 💡 Why it matters for on-prem AI

- **Scenario A** (dev lab) and first steps of **Scenario B** (SMB): validate model, prompts, light RAG before switching to [[00-lexique/vllm|vLLM]].
- Reference for [[06-mise-en-oeuvre/getting-started-with-ollama|Getting started with Ollama]] and [[06-mise-en-oeuvre/evaluate-local-model|evaluating a local model]] guides.
- Local embedding models (`nomic-embed-text`, etc.) via the same API.

## ⚠️ Common pitfalls

- Serving **multiple simultaneous users** in production: by default Ollama handles only one request at a time per model (`OLLAMA_NUM_PARALLEL=1`) and queues the others; raising this parallelism costs memory (∝ parallelism × context) and does not replace the continuous batching of a production engine[^2].
- Pulling a `:cloud` model believing you stay on-prem: some library models exist only in a hosted version (`kimi-k3:cloud`, `glm-5.2:cloud`, offered by default by the `ollama` agent since 0.32) and send requests off the machine; the account offered at first launch (0.34.2) is only used for these cloud models and private repositories, local inference does not need it[^4].
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
[^2]: Ollama, *FAQ — How does Ollama handle concurrent requests?* (`OLLAMA_NUM_PARALLEL` defaults to 1, `OLLAMA_MAX_LOADED_MODELS`, queueing), accessed 2026-10-10. [https://docs.ollama.com/faq](https://docs.ollama.com/faq) — see also [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]].
[^3]: Ollama, *Release v0.40.0* ("Models run on MLX on Apple Silicon by default"), October 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0)
[^4]: Ollama, *Release v0.32.0* (`ollama` with no argument launches an agent, default entry `glm-5.2:cloud`), 11 July 2026 · *Release v0.32.6* (`ollama run kimi-k3` offers `kimi-k3:cloud` "for cloud-only models that publish no default tag"), 4 August 2026 · *Release v0.34.2* (first-run screen "sign in or continue locally"), 15 September 2026. [https://github.com/ollama/ollama/releases/tag/v0.32.0](https://github.com/ollama/ollama/releases/tag/v0.32.0) · [https://github.com/ollama/ollama/releases/tag/v0.32.6](https://github.com/ollama/ollama/releases/tag/v0.32.6) · [https://github.com/ollama/ollama/releases/tag/v0.34.2](https://github.com/ollama/ollama/releases/tag/v0.34.2)
