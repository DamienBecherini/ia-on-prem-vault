---
title: "🔄 Migrate from Ollama to vLLM"
description: When and how to move from Ollama to vLLM without breaking existing clients — API compatibility, model conversion, cutover strategy, and rollback plan.
sidebar:
  order: 7
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Migrating from Ollama to vLLM usually does not require changing clients — both expose an OpenAI-compatible API. The real effort is converting GGUF models to native HuggingFace formats and re-qualifying performance.

---

## When to migrate?

Ollama remains the best choice for solo development and small teams. Migration to vLLM is justified when:

| Signal | Indicative threshold |
| :-- | :-- |
| Simultaneous users | several concurrent requests on the same model (Ollama handles only one at a time by default, `OLLAMA_NUM_PARALLEL=1`)[^7] |
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
client = OpenAI(base_url="http://localhost:8000/v1", api_key="YOUR-TOKEN-TO-REPLACE")

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
| Authentication | None (key ignored) | `--api-key` (only covers `/v1`, `/v2` and `/inference`; reverse proxy for the rest)[^8] |
| Model format | GGUF (native) | HuggingFace safetensors, AWQ, GPTQ |
| Pull model endpoint | `POST /api/pull` | Not supported (pre-load) |
| Generate endpoint (legacy) | `POST /api/generate` | Not supported (use `/v1/`) |
| Stream | Supported | Supported |
| Embeddings | `POST /api/embeddings` | `POST /v1/embeddings` |
| Responses API | `POST /v1/responses` (since 0.13.3, stateless variant) | `POST /v1/responses` |

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

vLLM can load a GGUF (`vllm-gguf-plugin` plugin, e.g. `vllm serve unsloth/Qwen3-0.6B-GGUF:Q4_K_M --tokenizer Qwen/Qwen3-0.6B`), but as of Q4 2026 the project describes this support as "highly experimental and under-optimized": it is suitable for validating a model, not for production[^5]. Three options, in order of preference:

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

These equivalences remain valid, but these models belong to the generation that Ollama ≥ 0.32 (July 2026) flags as "legacy" at `ollama launch` (CodeLlama, Qwen2.5, Llama 3.x, Mistral, base DeepSeek-R1); the current library as of Q4 2026 is `qwen3.5` / `qwen3.6`, `gemma4`, `qwen3-coder`, whose Hugging Face weights are found the same way[^9].

```bash
# Download via Hugging Face CLI (`hf` command, which replaces `huggingface-cli`)
pip install huggingface_hub
hf auth login  # HF token required for gated models (Llama)

hf download meta-llama/Llama-3.1-8B-Instruct \
  --local-dir /data/models/llama3.1-8b
```

Target **safetensors** repositories exclusively: never accept `.bin` / pickle weights, even "scanned" ones — malicious pickle loads evade model scanners (ShadowPickle, July 2026)[^11]. The `hf` command is the documented form of the Hugging Face CLI as of Q4 2026[^10].

### Option B — Use a pre-quantized AWQ version

For heavy models (70B+), AWQ versions are lighter and natively handled by vLLM[^3]:

```bash
# AWQ 4-bit — quality close to BF16 with ~25% of VRAM
vllm serve hugging-quants/Meta-Llama-3.1-70B-Instruct-AWQ-INT4 \
  --quantization awq_marlin \
  --dtype half
```

### Option C — Convert GGUF to safetensors (advanced)

If you have a custom GGUF model (fine-tuned, merged), conversion is possible via the Transformers GGUF loader (`llama.cpp` only does the reverse direction, HF → GGUF, with `convert_hf_to_gguf.py`)[^6]:

```bash
pip install transformers gguf

# Convert GGUF → safetensors with Transformers (dequantizes to bf16)
python - <<'PY'
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, GgufConfig
repo, f = "/path/to/model-dir", "model.gguf"
m = AutoModelForCausalLM.from_pretrained(
    repo, gguf_file=f,
    quantization_config=GgufConfig(dequantize=True),
    dtype=torch.bfloat16,
)
t = AutoTokenizer.from_pretrained(repo, gguf_file=f)
m.save_pretrained("/path/to/output"); t.save_pretrained("/path/to/output")
PY
```

The loader dequantizes Llama, Mistral, Qwen2, Phi3, etc.; check the list of supported architectures in the Transformers documentation[^6].

> [!warning] Quantization loss
> GGUF → safetensors conversion dequantizes the model (back to bf16). To re-quantize to AWQ, use [llm-compressor](https://github.com/vllm-project/llm-compressor) — the vLLM project took over AutoAWQ, archived in May 2025[^3]. This process needs VRAM and time (several hours on a 70B).

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

Compare results on your real prompts[^4]; `vllm bench serve --model … --dataset-name sharegpt` additionally measures throughput and TTFT under load.

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

> [!note] Ollama ≥ 0.40
> If you updated Ollama during the migration, its models may have been rewritten to the new format on first launch (Ollama 0.40.2, October 2026; backups kept on disk); rolling back to a version < 0.40 forces you to re-pull the models[^12]. Pin the Ollama version during the cutover window.

---

## Migration checklist

```
□ vLLM ≥ 0.31.0 installed, trust_remote_code disabled
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

The minimum version is not a detail: between August and October 2026, vLLM fixed several remote code executions and denials of service (including GHSA-h3rc-6mm3-gc2m, closed in 0.31.0)[^13]; full hardening is described in [[06-mise-en-oeuvre/configure-vllm-multi-gpu|Configure vLLM multi-GPU]] and [[06-mise-en-oeuvre/local-inference-security|Local inference security]].

---

## See also

- [[06-mise-en-oeuvre/getting-started-with-ollama|🚀 Getting started with Ollama]] — if you roll back or test in parallel
- [[06-mise-en-oeuvre/configure-vllm-multi-gpu|⚙️ Configure vLLM multi-GPU]] — full configuration of the new backend
- [[06-mise-en-oeuvre/monitoring-inference-stack|📊 Prometheus + Grafana monitoring]] — essential before production cutover
- [[06-mise-en-oeuvre/local-inference-security|🔒 Local inference security]] — authentication and reverse proxy

---

## Sources and references

[^1]: vLLM Project, *vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention* (continuous batching, dynamic KV Cache management), 20 June 2023, verified 2026-10-10. [https://vllm.ai/blog/2023-06-20-vllm](https://vllm.ai/blog/2023-06-20-vllm)
[^2]: vLLM Project, *Online Serving — OpenAI-Compatible Server* (supported endpoints `/v1/chat/completions`, `/v1/completions`, `/v1/embeddings`, `/v1/responses`), accessed 2026-10-10 · Ollama, *OpenAI compatibility* (`/v1/responses` since 0.13.3, API key "required but ignored"), accessed 2026-10-10. [https://docs.vllm.ai/en/stable/serving/online_serving/](https://docs.vllm.ai/en/stable/serving/online_serving/) · [https://docs.ollama.com/api/openai-compatibility](https://docs.ollama.com/api/openai-compatibility)
[^3]: vLLM Project, *Quantization — AWQ* ("The AutoAWQ library is deprecated", workflow taken over by `llm-compressor`, Marlin kernels), accessed 2026-10-10 · casper-hansen, *AutoAWQ* (repository archived on 2025-05-11, "officially deprecated"). [https://docs.vllm.ai/en/stable/features/quantization/auto_awq/](https://docs.vllm.ai/en/stable/features/quantization/auto_awq/) · [https://github.com/casper-hansen/AutoAWQ](https://github.com/casper-hansen/AutoAWQ)
[^4]: vLLM Project, *Benchmarking* (`vllm bench serve`, `latency`, `throughput`), accessed 2026-10-10. [https://docs.vllm.ai/en/stable/benchmarking/](https://docs.vllm.ai/en/stable/benchmarking/)
[^5]: vLLM Project, *Quantization — GGUF* (`vllm-gguf-plugin` plugin, "highly experimental and under-optimized" support, base model tokenizer recommended), accessed 2026-10-09. [https://docs.vllm.ai/en/stable/features/quantization/gguf/](https://docs.vllm.ai/en/stable/features/quantization/gguf/)
[^6]: Hugging Face, *Transformers — GGUF* (`from_pretrained(gguf_file=…)`, `GgufConfig(dequantize=True)`, supported architectures, export via `save_pretrained`), accessed 2026-10-09. [https://huggingface.co/docs/transformers/gguf](https://huggingface.co/docs/transformers/gguf)
[^7]: Ollama, *FAQ — How does Ollama handle concurrent requests?* (`OLLAMA_NUM_PARALLEL` defaults to 1, queueing), accessed 2026-10-10. [https://docs.ollama.com/faq](https://docs.ollama.com/faq)
[^8]: vLLM Project, *CLI Reference — `vllm serve`* (`--api-key`: protected paths `/v1`, `/v2`, `/inference`), accessed 2026-10-10 · vLLM Project, advisory GHSA-h3rc-6mm3-gc2m (`/tokenize` not covered by `--api-key`), 6 October 2026. [https://docs.vllm.ai/en/stable/cli/serve/](https://docs.vllm.ai/en/stable/cli/serve/) · [https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m](https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m)
[^9]: Ollama, *Release v0.32.0* (deprecation warning for CodeLlama, Qwen2.5(-coder), Llama 3.x, Mistral, StarCoder and base DeepSeek-R1), 11 July 2026 · Ollama, *Library* (`qwen3.5`, `qwen3.6`, `gemma4`, `qwen3-coder`), accessed 2026-10-10. [https://github.com/ollama/ollama/releases/tag/v0.32.0](https://github.com/ollama/ollama/releases/tag/v0.32.0) · [https://ollama.com/library](https://ollama.com/library)
[^10]: Hugging Face, *Command Line Interface (CLI)* (`hf auth login`, `hf download … --local-dir`), accessed 2026-10-10. [https://huggingface.co/docs/huggingface_hub/guides/cli](https://huggingface.co/docs/huggingface_hub/guides/cli)
[^11]: *ShadowPickle: Evading Machine Learning Model Scanners via Stealthy Pickle Deserialization Attacks* (arXiv:2607.17503; ten model scanners bypassed), July 2026. [https://arxiv.org/abs/2607.17503](https://arxiv.org/abs/2607.17503)
[^12]: Ollama, *Release v0.40.2* (models "upgraded in the background the first time you run them", backups kept, re-pull required when rolling back to < 0.40), 8 October 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.2](https://github.com/ollama/ollama/releases/tag/v0.40.2)
[^13]: vLLM Project, *Release v0.31.0* (per-request `mm_processor_kwargs` rejected unless `--trust-request-mm-kwargs`, `fp8` → `fp8_per_tensor`), 5 October 2026 · advisory GHSA-h3rc-6mm3-gc2m, 6 October 2026. [https://github.com/vllm-project/vllm/releases/tag/v0.31.0](https://github.com/vllm-project/vllm/releases/tag/v0.31.0) · [https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m](https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m)
