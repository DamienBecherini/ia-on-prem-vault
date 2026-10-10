---
title: "🚀 Getting started with Ollama"
description: Installation, first model, API testing, and initial best practices for local inference in under 15 minutes.
sidebar:
  order: 3
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Ollama is the fastest way to run an LLM locally. This guide covers installation, your first model, the OpenAI-compatible API, and basic tuning. Allow 15 minutes to have an 8B model answering your first requests.

---

## Prerequisites

- **macOS** (Apple Silicon recommended — since Ollama 0.40, September 2026, compatible architectures run on Apple's MLX engine by default[^3]) or **Linux** (NVIDIA or AMD GPU, or CPU only)
- Windows: supported via WSL2 or native installer — GPU performance requires CUDA or ROCm drivers
- At least 8 GB RAM (16+ recommended for a comfortable 7B/8B)
- Disk space: 5–50 GB depending on the downloaded model

> [!note] Which hardware for which model?
> See [[03-stack-logicielle/choose-your-model|🗺️ Choose your model]] and [[01-fondations/quantization-4bit-8bit|Quantization]] to estimate VRAM/RAM footprint before downloading.

---

## Installation

### macOS / Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Ollama installs a system service that starts automatically at boot.

Verification:

```bash
ollama --version
# ollama version is 0.x.x

# Is the service running?
curl http://localhost:11434/
# Ollama is running
```

### Windows

Download the installer from [ollama.com/download](https://ollama.com/download). The installer configures the background service and adds `ollama` to PATH.

> [!note] `ollama` with no argument
> Since version 0.32 (July 2026), simply typing `ollama` launches an interactive coding agent that defaults to a *cloud* model (`glm-5.2:cloud`); since 0.34.2 (September 2026), a first-run screen offers to sign in or "continue locally". Choose **continue locally**: local inference requires no account, and `ollama run <model>` remains the command to use in this guide. The same version 0.32 shows a "legacy model" warning when launching CodeLlama, Qwen2.5, Llama 3.x, Mistral or base DeepSeek-R1[^4].

---

## First model

```bash
# Download and run a small recent model (~6.5 GB in Q4_K_M)
ollama run qwen3.5:9b

# Or a very light 3B (~2 GB)
ollama run llama3.2

# Or a smaller model for a quick test (~2.5 GB)
ollama run phi4-mini

# Or a coding model
ollama run qwen2.5-coder:14b
```

The first run downloads the model from [ollama.com/library](https://ollama.com/library) (sizes read from the registry on 2026-10-09[^1]). Later runs use the local cache.

To exit the interactive session: `/bye` or `Ctrl+D`.

---

## Essential commands

```bash
# List downloaded models
ollama list

# See models available online
# → https://ollama.com/library

# Download without launching
ollama pull qwen2.5:72b

# Remove a model from cache
ollama rm llama3.2

# See running processes
ollama ps

# Service logs (Linux systemd) — there is no `ollama logs` subcommand
journalctl -u ollama --no-pager --follow --pager-end
# macOS: cat ~/.ollama/logs/server.log
```

Per-platform log locations are described in Ollama's troubleshooting page[^2].

Since Ollama 0.40.2 (October 2026), models downloaded with an earlier version are rewritten in the background on first launch (originals kept as backups); rolling back to a version < 0.40 forces you to re-pull the models — on an appliance, pin the Ollama version[^5].

---

## OpenAI-compatible API

Ollama exposes a REST API on `http://localhost:11434` compatible with the OpenAI format. Any library that uses the OpenAI API works without changes by switching the base URL.

### Direct request

```bash
curl http://localhost:11434/api/generate \
  -d '{
    "model": "llama3.2",
    "prompt": "Explain KV Cache in 3 sentences.",
    "stream": false
  }'
```

### OpenAI-compatible format (`/v1/chat/completions`)

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2",
    "messages": [
      {"role": "system", "content": "You are a technical assistant."},
      {"role": "user", "content": "What is the difference between prefill and decoding?"}
    ]
  }'
```

### Python (openai SDK)

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # arbitrary value, Ollama does not verify the key
)

response = client.chat.completions.create(
    model="llama3.2",
    messages=[
        {"role": "user", "content": "Summarize unified memory in 2 sentences."}
    ]
)
print(response.choices[0].message.content)
```

---

## Useful settings

### Longer context

By default, the Ollama server uses a 4,096-token window (`OLLAMA_CONTEXT_LENGTH`); the desktop app picks a value based on VRAM (4k under 24 GiB, 32k between 24 and 48 GiB, 256k above)[^6]. To extend:

```bash
# For the whole server (environment variable)
OLLAMA_CONTEXT_LENGTH=8192 ollama serve

# Via API (per request)
curl http://localhost:11434/api/generate \
  -d '{"model": "llama3.2", "prompt": "...", "options": {"num_ctx": 8192}}'

# Via Modelfile (persistent)
ollama show llama3.2 --modelfile > Modelfile
# Add to the Modelfile:
# PARAMETER num_ctx 8192
ollama create llama3.2-8k -f Modelfile
```

> [!warning] VRAM and context
> Doubling the context window can double the footprint of the [[00-lexique/kv-cache|KV Cache]]. Check that your VRAM/RAM can handle it before extending to 32K or 128K. See [[01-fondations/kv-cache-and-context|KV Cache & Context]].

### Concurrent requests

By default, each model handles only one request at a time (`OLLAMA_NUM_PARALLEL=1`): the second one waits in the queue. Raising this value multiplies the memory reserved for context (parallelism × `OLLAMA_CONTEXT_LENGTH`); `OLLAMA_MAX_LOADED_MODELS` (3 × number of GPUs by default) caps the number of models loaded simultaneously[^6]. For several regular users, see [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]].

### Temperature and generation parameters

```bash
curl http://localhost:11434/api/generate \
  -d '{
    "model": "llama3.2",
    "prompt": "...",
    "options": {
      "temperature": 0.1,    # 0 = deterministic, 1 = creative
      "top_p": 0.9,
      "num_predict": 512     # max tokens to generate
    }
  }'
```

### Expose Ollama on the local network

By default, Ollama listens only on `localhost`. To make it reachable from other machines:

```bash
# Linux: service environment variable
OLLAMA_HOST=0.0.0.0 ollama serve

# Or via systemd (edit /etc/systemd/system/ollama.service)
# Environment="OLLAMA_HOST=0.0.0.0"
```

> [!warning] Network security
> Without authentication, anyone on your network can query the model. In production, place a reverse proxy (nginx, Caddy) with basic auth or a token in front of Ollama, or use [[00-lexique/litellm|LiteLLM]] as a gateway.

> [!warning] Updates
> Ollama fixes vulnerabilities without always detailing them in its release notes: 0.31.2 (July 2026) closes CVE-2026-102697 (execution of additional commands via agent mode through prompt injection, CVSS 7.8) and "hardens" GGUF creation. Keep Ollama up to date (≥ 0.31.2 at a minimum as of Q4 2026)[^7].

---

## Check performance

```bash
# Run a request and measure throughput
curl http://localhost:11434/api/generate \
  -d '{"model": "llama3.2", "prompt": "Say hello in 10 languages.", "stream": false}' \
  | python3 -c "import sys,json; r=json.load(sys.stdin); \
    print(f\"Duration: {r['total_duration']/1e9:.1f}s | \
    Tokens generated: {r['eval_count']} | \
    Throughput: {r['eval_count']/(r['eval_duration']/1e9):.1f} tok/s\")"
```

Indicative orders of magnitude (community measurements on llama.cpp, mid-2026, not individually sourced; on Apple Silicon, Ollama ≥ 0.40 uses MLX by default and throughputs may differ — measure with the command above and the protocol in [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluate a local model]]):

| Hardware | 8B Q4 model | 70B Q4 model |
| :-- | :-- | :-- |
| MacBook M4 Pro 48 GB | ~40–60 tok/s | ~10–15 tok/s |
| Mac Studio M3 Ultra 192 GB | ~50–70 tok/s | ~12–18 tok/s |
| AMD Ryzen AI Max PRO (192 GB) | ~25–35 tok/s | ~4–6 tok/s |
| RTX 4090 (24 GB VRAM) | ~50–80 tok/s | Partial offloading |
| CPU only (no GPU) | ~3–8 tok/s | < 2 tok/s |

---

## Next steps

- **Choose the right model for your task** → [[03-stack-logicielle/choose-your-model|🗺️ Choose your local model]]
- **Move to multi-user production** → [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ vLLM in production]]
- **Evaluate quality** → [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluate a local model]]
- **Connect an agent or RAG** → [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]

---

## Sources and references

[^1]: Ollama, *Library* and `registry.ollama.ai` registry (manifests: `llama3.2` = 3B, 2.02 GB; `qwen3.5:9b` ≈ 6.5 GB), accessed 2026-10-09. [https://ollama.com/library](https://ollama.com/library) · [https://registry.ollama.ai](https://registry.ollama.ai)
[^2]: Ollama, *Troubleshooting* (log locations: `journalctl -u ollama`, `~/.ollama/logs/server.log`), accessed 2026-10-09 · `ollama/ollama` repository, `cmd/cmd.go` (subcommand list, no `logs`). [https://docs.ollama.com/troubleshooting](https://docs.ollama.com/troubleshooting) · [https://github.com/ollama/ollama](https://github.com/ollama/ollama)
[^3]: Ollama, *Release v0.40.0* ("Models run on MLX on Apple Silicon by default"), 25 September 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0)
[^4]: Ollama, *Release v0.32.0* (`ollama` with no argument launches an agent, default entry `glm-5.2:cloud`; deprecation warning for legacy agent models), 11 July 2026 · Ollama, *Release v0.34.2* ("first-run setup … with options to sign in or continue locally"), 15 September 2026. [https://github.com/ollama/ollama/releases/tag/v0.32.0](https://github.com/ollama/ollama/releases/tag/v0.32.0) · [https://github.com/ollama/ollama/releases/tag/v0.34.2](https://github.com/ollama/ollama/releases/tag/v0.34.2)
[^5]: Ollama, *Release v0.40.2* (models "upgraded in the background the first time you run them", backups kept, re-pull required when rolling back to < 0.40), 8 October 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.2](https://github.com/ollama/ollama/releases/tag/v0.40.2)
[^6]: Ollama, *FAQ* ("By default, Ollama uses a context window size of 4096 tokens", `OLLAMA_CONTEXT_LENGTH`, `OLLAMA_NUM_PARALLEL` = 1, `OLLAMA_MAX_LOADED_MODELS` = 3 × GPU) and *Context length* (app defaults: 4k / 32k / 256k depending on VRAM), accessed 2026-10-10. [https://docs.ollama.com/faq](https://docs.ollama.com/faq) · [https://docs.ollama.com/context-length](https://docs.ollama.com/context-length)
[^7]: MITRE, *CVE-2026-102697* (Ollama 0.14.0 → < 0.31.2, bypass of agent-mode Bash command approval, CVSS v3.1 7.8), published 2026-09-29 · Ollama, *Release v0.31.2* ("Hardened GGUF model creation"), 6 July 2026. [https://cveawg.mitre.org/api/cve/CVE-2026-102697](https://cveawg.mitre.org/api/cve/CVE-2026-102697) · [https://github.com/ollama/ollama/releases/tag/v0.31.2](https://github.com/ollama/ollama/releases/tag/v0.31.2)
