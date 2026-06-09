---
title: "🚀 Getting started with Ollama"
description: Installation, first model, API testing, and initial best practices for local inference in under 15 minutes.
sidebar:
  order: 3
last_modified: "2026-06-05"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Ollama is the fastest way to run an LLM locally. This guide covers installation, your first model, the OpenAI-compatible API, and basic tuning. Allow 15 minutes to have an 8B model answering your first requests.

---

## Prerequisites

- **macOS** (Apple Silicon recommended) or **Linux** (NVIDIA or AMD GPU, or CPU only)
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

---

## First model

```bash
# Download and run an 8B model (~5 GB in Q4_K_M)
ollama run llama3.2

# Or a smaller model for a quick test (~1.3 GB)
ollama run phi4-mini

# Or a coding model
ollama run qwen2.5-coder:14b
```

The first run downloads the model from [ollama.com/library](https://ollama.com/library). Later runs use the local cache.

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

# Service logs
ollama logs
```

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

By default, Ollama limits context to 2048 tokens. To extend:

```bash
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

Expected indicators by hardware:

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
