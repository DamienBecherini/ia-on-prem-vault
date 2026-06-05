---
title: "🔄 Migrate from Ollama to vLLM"
description: When and how to move from Ollama to vLLM without breaking existing clients — API compatibility, model conversion, cutover strategy, and rollback plan.
sidebar:
  order: 7
last_modified: "2026-06-04"
---

> [!tip] In brief
> Migrating from Ollama to vLLM usually does not require changing clients — both expose an OpenAI-compatible API. The real effort is converting GGUF models to native HuggingFace formats and re-qualifying performance.

---

## When to migrate?

Ollama remains the best choice for solo development and small teams. Migration to vLLM is justified when:

| Signal | Indicative threshold |
| :-- | :-- |
| Simultaneous users | > 5–10 (visible queue) |
| p95 latency | > 10 s for an 8B model |
| Target throughput | > 50 tok/s aggregate |
| Concurrent requests | > 20/min at peak |
| Defined SLA | TTFT < 2 s guaranteed |

> [!note] Simple rule
> If users complain about wait times and `ollama ps` shows queued requests, that is the signal. vLLM handles concurrency via **Continuous Batching** (PagedAttention)[^1], which Ollama does not do natively.

---

## API compatibility — what changes, what does not

Both services expose an OpenAI-compatible API on `/v1/`. In most cases, **only the base URL changes**.

### What stays the same

```python
# Before (Ollama)
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# After (vLLM)
client = OpenAI(base_url="http://localhost:8000/v1", api_key="sk-your-token")

# The code below is identical in both cases
response = client.chat.completions.create(
    model="llama3.1",         # see "model names" section below
    messages=[{"role": "user", "content": "Hello"}],
    temperature=0.7,
    max_tokens=500
)
```

### What changes

| Feature | Ollama | vLLM |
| :-- | :-- | :-- |
| Default port | 11434 | 8000 |
| Authentication | None | Bearer token required in prod |
| Model format | GGUF (native) | HuggingFace safetensors, AWQ, GPTQ |
| Pull model endpoint | `POST /api/pull` | Not supported (pre-load) |
| Generate endpoint (legacy) | `POST /api/generate` | Not supported (use `/v1/`) |
| Stream | Supported | Supported |
| Embeddings | `POST /api/embeddings` | `POST /v1/embeddings` |

> [!warning] Clients using `/api/generate` or `/api/pull`
> If your scripts call native Ollama endpoints (`/api/generate`, `/api/pull`, `/api/tags`), they must be adapted. Endpoints `/v1/chat/completions`, `/v1/completions`, and `/v1/embeddings` are compatible without changes[^2].

---

## Model names

Ollama uses its own names (`llama3.2`, `qwen2.5:14b`). vLLM uses HuggingFace identifiers (`meta-llama/Llama-3.2-3B-Instruct`), but you can set an alias with `--served-model-name` to keep compatibility:

```bash
# vLLM with Ollama-compatible alias
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --served-model-name llama3.1 \    # ← client sends "llama3.1", vLLM understands
  --port 8000
```

---

## Converting GGUF models

vLLM does not natively read GGUF files. Two options:

### Option A — Download native HuggingFace weights (recommended)

Most Ollama models have an official HuggingFace equivalent:

| Ollama model | HuggingFace equivalent |
| :-- | :-- |
| `llama3.2` | `meta-llama/Llama-3.2-3B-Instruct` |
| `llama3.1:70b` | `meta-llama/Llama-3.1-70B-Instruct` |
| `qwen2.5:14b` | `Qwen/Qwen2.5-14B-Instruct` |
| `qwen2.5-coder:32b` | `Qwen/Qwen2.5-Coder-32B-Instruct` |
| `phi4` | `microsoft/phi-4` |
| `deepseek-r1:70b` | `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` |

```bash
# Download via Hugging Face CLI
pip install huggingface_hub
huggingface-cli login  # HF token required for gated models (Llama)

huggingface-cli download meta-llama/Llama-3.1-8B-Instruct \
  --local-dir /data/models/llama3.1-8b
```

### Option B — Use a pre-quantized AWQ version

For heavy models (70B+), AWQ versions are lighter and natively handled by vLLM[^3]:

```bash
# AWQ 4-bit — quality close to BF16 with ~25% of VRAM
vllm serve hugging-quants/Meta-Llama-3.1-70B-Instruct-AWQ-INT4 \
  --quantization awq_marlin \
  --dtype half
```

### Option C — Convert GGUF to safetensors (advanced)

If you have a custom GGUF model (fine-tuned, merged), conversion is possible via `llama.cpp`:

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
pip install -r requirements.txt

# Convert GGUF → safetensors (dequantize to fp16)
python convert_hf_to_gguf.py --outtype f16 \
  /path/to/model.gguf \
  --outfile /path/to/output/model.safetensors
```

> [!warning] Quantization loss
> GGUF → safetensors conversion dequantizes the model (back to fp16). To re-quantize to AWQ, use [AutoAWQ](https://github.com/casper-hansen/AutoAWQ). This process needs VRAM and time (several hours on a 70B).

---

## Zero-downtime cutover strategy

### Phase 1 — Parallel deployment

Run vLLM on a different port (8001) alongside Ollama (11434). Do not touch clients yet.

```bash
# vLLM on port 8001 (staging)
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --served-model-name llama3.2 \
  --port 8001
```

### Phase 2 — Qualification

Compare results on your real prompts[^4]:

```bash
# A/B comparison script
for prompt in "Summarize this contract" "Draft an email" "Analyze this code"; do
  echo "=== Ollama ==="
  curl -s http://localhost:11434/v1/chat/completions \
    -d "{\"model\":\"llama3.2\",\"messages\":[{\"role\":\"user\",\"content\":\"$prompt\"}]}" \
    | python3 -c "import sys,json; r=json.load(sys.stdin); print(r['choices'][0]['message']['content'][:200])"

  echo "=== vLLM ==="
  curl -s http://localhost:8001/v1/chat/completions \
    -H "Authorization: Bearer sk-token" \
    -d "{\"model\":\"llama3.2\",\"messages\":[{\"role\":\"user\",\"content\":\"$prompt\"}]}" \
    | python3 -c "import sys,json; r=json.load(sys.stdin); print(r['choices'][0]['message']['content'][:200])"
done
```

### Phase 3 — Cutover via reverse proxy

Change only the reverse proxy configuration (Caddy or Nginx), not the clients.

**Caddy — switch backend:**
```
# Before
reverse_proxy localhost:11434

# After (change only this line)
reverse_proxy localhost:8000
```

Hot reload Caddy without downtime:
```bash
caddy reload --config Caddyfile
```

### Phase 4 — Stop Ollama

After 48 hours with no reported issues:

```bash
# Stop Ollama
sudo systemctl stop ollama
sudo systemctl disable ollama

# Free memory from Ollama cached models
# (optional, GGUF files remain on disk)
```

---

## Rollback plan

```bash
# 1. Restart Ollama
sudo systemctl start ollama

# 2. Point reverse proxy back to Ollama
# Change backend in Caddyfile/nginx.conf → port 11434
caddy reload --config Caddyfile

# 3. Verify
curl http://localhost/v1/models
```

Full rollback takes < 2 minutes if Ollama was only stopped (not uninstalled).

---

## Migration checklist

```
□ HuggingFace equivalent identified for each Ollama model in use
□ Models downloaded and loaded in vLLM (/health test OK)
□ --served-model-name configured for name compatibility
□ Bearer token authentication configured and tested on clients
□ Parallel deployment validated (phases 1–2 complete)
□ Performance compared on domain prompts (throughput, TTFT, quality)
□ Prometheus monitoring active before cutover
□ Reverse proxy reconfigured and reloaded without downtime
□ 48h monitoring period post-cutover
□ Rollback procedure documented and tested
```

---

## See also

- [[06-mise-en-oeuvre/getting-started-with-ollama|🚀 Getting started with Ollama]] — if you roll back or test in parallel
- [[06-mise-en-oeuvre/configure-vllm-multi-gpu|⚙️ Configure vLLM multi-GPU]] — full configuration of the new backend
- [[06-mise-en-oeuvre/monitoring-inference-stack|📊 Prometheus + Grafana monitoring]] — essential before production cutover
- [[06-mise-en-oeuvre/local-inference-security|🔒 Local inference security]] — authentication and reverse proxy

---

## Sources and references

[^1]: vLLM Project, *PagedAttention — Continuous Batching* (dynamic KV Cache management, comparison with Ollama under concurrency). [https://vllm.ai/blog/2023/06/20/vllm.html](https://vllm.ai/blog/2023/06/20/vllm.html)
[^2]: vLLM Project, *OpenAI-Compatible Server* (supported endpoints `/v1/chat/completions`, `/v1/completions`, `/v1/embeddings`, `--served-model-name`). [https://docs.vllm.ai/en/stable/serving/openai_compatible_server.html](https://docs.vllm.ai/en/stable/serving/openai_compatible_server.html)
[^3]: vLLM Project, *Quantization — AWQ* (AWQ Marlin kernel, performance vs GPTQ, compatible HuggingFace models). [https://docs.vllm.ai/en/stable/features/quantization/auto_awq.html](https://docs.vllm.ai/en/stable/features/quantization/auto_awq.html)
[^4]: vLLM Project, *Benchmarks* (comparative benchmarking scripts, latency and throughput). [https://docs.vllm.ai/en/stable/performance/benchmarks.html](https://docs.vllm.ai/en/stable/performance/benchmarks.html)
