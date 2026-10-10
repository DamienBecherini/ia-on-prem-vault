---
title: "⚙️ Configure vLLM for multi-GPU production"
description: Installation, tensor parallel configuration, multi-node deployment with Ray, and production best practices for vLLM on NVIDIA GPUs.
sidebar:
  order: 5
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> vLLM turns a GPU server into a high-performance inference API. This guide covers installation, single- and multi-GPU configuration, multi-node deployment via Ray, and critical production parameters.

> [!info] Prerequisites
> This guide assumes NVIDIA GPUs (compute capability ≥ 7.5) with a **CUDA 13.0**-compatible driver — the default target of vLLM wheels and images since 0.28 (August 2026; CUDA 12.9 variants are still published, tag `-cu129`) — and **Python 3.11 to 3.14**[^1][^9]. For Apple Silicon or AMD ROCm, installation steps differ — see the [official vLLM documentation](https://docs.vllm.ai/en/stable/getting_started/installation/gpu/).

---

## 1. Installation

### Via pip (recommended)

```bash
# Python 3.11-3.14; default wheel CUDA 13.0
# (CUDA 12.9 variant: pip install vllm --extra-index-url https://download.pytorch.org/whl/cu129)
pip install vllm

# Verification
python -c "import vllm; print(vllm.__version__)"
```

### Via Docker (recommended for production)

The official image avoids CUDA dependency conflicts[^1]:

```bash
docker pull vllm/vllm-openai:latest

docker run --runtime nvidia --gpus all \
  -p 8000:8000 \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  vllm/vllm-openai:latest \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --dtype auto
```

> [!note] Hugging Face cache
> Mount the HF cache to avoid re-downloading models on every container restart. In production, use a dedicated Docker volume rather than `~/.cache`.

---

## 2. Single-GPU configuration

### Minimal startup

```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --host 0.0.0.0 \
  --port 8000
```

### Essential parameters

```bash
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --host 0.0.0.0 \
  --port 8000 \
  --dtype bfloat16 \                    # native bf16 on Ampere+, more stable than fp16
  --max-model-len 8192 \               # max context window (limits KV Cache)
  --gpu-memory-utilization 0.90 \      # % VRAM allocated to KV Cache (0.85-0.95)
  --max-num-seqs 256 \                 # max concurrent requests in continuous batching
  --served-model-name llama-70b        # API alias (avoids exposing HF path)
```

**Critical parameter — `gpu-memory-utilization`:**
At startup, vLLM reserves the indicated fraction of VRAM for the KV Cache. If prompts are long or you have many concurrent requests, raise to 0.95. If OOM appears, lower to 0.85[^2].

> [!warning] Exceeding `max-model-len` → HTTP 400, not silent truncation
> If a client sends a prompt + history that exceeds `--max-model-len`, vLLM **rejects the request** with `HTTP 400 Bad Request: prompt is too long (X tokens > Y max)`. It does **not** truncate text automatically.
>
> **Solutions:**
> - **LiteLLM gateway**: enable `trim_messages: true` in `litellm_config.yaml` → LiteLLM removes oldest history turns before sending to the engine.
> - **Client side**: count tokens before send (`tiktoken` or `transformers.AutoTokenizer`) and show an explicit business message ("Document too long — limit: ~6,000 words").
> - **Prompt engineering**: enforce a reasonable `max_tokens` in the system prompt so long replies do not gradually fill history.

### Quantized models (AWQ / GPTQ)

```bash
# AWQ model (better quality per memory vs GGUF Q4)
vllm serve TheBloke/Llama-2-70B-Chat-AWQ \
  --quantization awq \
  --dtype auto

# GPTQ model
vllm serve TheBloke/Llama-2-70B-GPTQ \
  --quantization gptq \
  --dtype float16
```

> [!warning] GGUF: experimental only
> vLLM can load a GGUF via the `vllm-gguf-plugin` plugin (e.g. `vllm serve unsloth/Qwen3-0.6B-GGUF:Q4_K_M --tokenizer Qwen/Qwen3-0.6B`), but the project describes this support as "highly experimental and under-optimized"[^10]. In production, use native HuggingFace weights (safetensors) or AWQ/GPTQ/FP8 quantization. To convert a model, see [[06-mise-en-oeuvre/migrate-ollama-to-vllm|Ollama → vLLM migration]].

---

## 3. Multi-GPU configuration (Tensor Parallelism)

**Tensor Parallelism** splits weights of the same layer across several GPUs on one server via NVLink or PCIe. It is the recommended mode for models that do not fit on a single card[^3].

```bash
# 2 GPUs — 70B model in 2 × 40 GB
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --tensor-parallel-size 2 \
  --dtype bfloat16

# 4 GPUs — 70B model with comfortable headroom
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --tensor-parallel-size 4 \
  --gpu-memory-utilization 0.90

# 8 GPUs — 405B model or large MoE
vllm serve meta-llama/Llama-3.1-405B-Instruct \
  --tensor-parallel-size 8 \
  --pipeline-parallel-size 1 \
  --dtype bfloat16
```

**Sizing rule:**
- `tensor-parallel-size` must be a power of 2 (1, 2, 4, 8)
- Each GPU needs `model_size / tensor_parallel_size` VRAM
- Interconnect drives efficiency: NVLink >> PCIe (see [[02-materiel/stations-multi-gpu|Multi-GPU stations]])

```mermaid
graph LR
    A[API Request] --> B[vLLM Scheduler]
    B --> C[GPU 0 — layers 0-17]
    B --> D[GPU 1 — layers 18-35]
    B --> E[GPU 2 — layers 36-53]
    B --> F[GPU 3 — layers 54-71]
    C & D & E & F --> G[Response]
```

---

## 4. Multi-node deployment with Ray

To go beyond one server's capacity, vLLM uses **Ray** to distribute the model across machines[^4].

### Network prerequisites

Nodes must see each other on a low-latency network. Ideally RoCE/InfiniBand — in practice, 25 Gb Ethernet is enough for Pipeline Parallelism[^4].

### Ray cluster configuration

```bash
# === On HEAD node (node 0) ===
pip install ray vllm

# Start Ray head process
ray start --head --port=6379

# === On each WORKER node (nodes 1, 2, ...) ===
pip install ray vllm

# Join cluster (replace HEAD_IP with head node IP)
ray start --address='HEAD_IP:6379'

# === Verify cluster ===
ray status
# → shows connected nodes and available GPUs
```

### Launch vLLM on the cluster

```bash
# On HEAD node — vLLM uses Ray to distribute automatically
vllm serve meta-llama/Llama-3.1-405B-Instruct \
  --tensor-parallel-size 4 \        # 4 GPUs per node
  --pipeline-parallel-size 2 \      # 2 nodes
  --distributed-executor-backend ray \
  --host 0.0.0.0 \
  --port 8000
```

vLLM and Ray handle distribution automatically: the first 4 GPUs (node 0) run early layers, the next 4 (node 1) run the rest[^4]. The official docs provide `examples/ray_serving/run_cluster.sh` to start head and workers in the `vllm/vllm-openai` image (one `VLLM_HOST_IP` per node); without Ray, run `vllm serve … --nnodes 2 --node-rank 0 --master-addr HEAD_IP` on the head and `--node-rank 1 --headless` on the worker[^4].

### Prefill / Decode disaggregation (2026)

Advanced architecture available since vLLM v0.6+: nodes dedicated to **Prefill** (prompt read, CPU-bound) and others to **Decode** (generation, memory-bandwidth-bound)[^5]. Reduces TTFT by 30 to 50% on long prompts.

```bash
# P/D disaggregation — same flag on both roles, NIXL connector
# (kv_role: "kv_producer" on the Prefill side, "kv_consumer" on the Decode side, "kv_both" for both)
vllm serve ... \
  --kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_both"}'
```

The connectors available as of Q4 2026 are `NixlConnector`, `LMCacheConnectorV1`, `MooncakeConnector`, `OffloadingConnector` (CPU offload) and `MultiConnector`; the feature is documented as "experimental and subject to change"[^5]. The `--role` and `--num-speculative-tokens` flags do not exist in `vllm serve` (speculation is configured via `--speculative-config`)[^8].

> [!note] Stability
> Prefill/Decode disaggregation is available but still actively evolving in 2026. Test in staging before any production deployment.

---

## 5. Production configuration — advanced parameters

### API authentication

```bash
vllm serve ... \
  --api-key "YOUR-TOKEN-TO-REPLACE"
```

Or via environment variable:
```bash
export VLLM_API_KEY="YOUR-TOKEN-TO-REPLACE"
vllm serve ...
```

Clients must send `Authorization: Bearer YOUR-TOKEN-TO-REPLACE`. Caution: `--api-key` only protects the `/v1`, `/v2` and `/inference` paths — `/tokenize`, `/metrics` or `/invocations` remain reachable without a key[^8][^11]. In production, put an authenticating reverse proxy in front of *all* paths (see [[06-mise-en-oeuvre/local-inference-security|Security]]).

### Limits and timeouts

```bash
vllm serve ... \
  --max-num-seqs 512 \              # sequences processed per iteration (continuous batching)
  --max-num-queued-reqs 1024 \      # max in-flight requests; beyond: HTTP 503 (vLLM ≥ 0.29)
  --disable-log-requests            # disable request logs in production
```

`--max-num-seqs` bounds the number of sequences processed per iteration, not the queue (unbounded by default): it is `--max-num-queued-reqs` (vLLM 0.29) that produces the 503, to be sized around `data_parallel_size × max_num_seqs` plus the desired queue depth[^2][^8]. vLLM has no per-request timeout on the engine side: set it in the reverse proxy (Caddy `reverse_proxy … { transport http { response_header_timeout 120s } }`, Nginx `proxy_read_timeout 120s`) or on the client side[^8].

### KV Cache optimization — FP8 quantization

On NVIDIA GPUs (CUDA 11.8+) and AMD ROCm, FP8 KV Cache quantization halves its footprint compared to BF16; without calibration, all scales are 1.0 — the docs recommend calibrating with `llm-compressor` and excluding sliding-window layers (`--kv-cache-dtype-skip-layers sliding_window`)[^6]:

```bash
vllm serve ... \
  --kv-cache-dtype fp8
```

The KV Cache size actually allocated is written in the startup logs ("GPU KV cache size: … tokens"); there is no dedicated flag to display it[^8].

### Automatic Prefix Caching (APC) — essential for RAG and agents

In multi-user or multi-agent setups, several requests often share the same **System Prompt** (500–2000 tokens) or the same RAG document in context. Without APC, vLLM computes and stores that prefix KV Cache **N times** — once per request — wasting VRAM and compute. Since the V1 architecture, APC is enabled by default: there is nothing to do to benefit from it[^7].

```bash
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90
# APC is on by default; --no-enable-prefix-caching to turn it off,
# --prefix-caching-hash-algo xxhash for faster hashing (sha256 by default)
```

**How it works:** vLLM hashes each 16-token block. If a new request starts with the same block sequence as a prior request still in GPU cache, Key/Value vectors are reused directly — without recomputing Prefill[^7].

**Measured impact:**

| Scenario | Without APC | With APC |
| :-- | :-- | :-- |
| 20 parallel agents, same 800-token system prompt | TTFT 3–8s each | TTFT < 100ms from 2nd request |
| RAG pipeline: shared document context | full recompute × N | cache hit: ~96% VRAM saved on prefix |

> [!note] Compatibility
> Check the compatibility matrix of the chosen KV connector (NIXL, LMCache) before combining APC with Prefill/Decode disaggregation (`--kv-transfer-config`); the vLLM documentation states no general incompatibility[^5]. APC is compatible with Tensor Parallelism and FP8 KV Cache quantization[^7].

### Systemd service (Linux)

```ini
# /etc/systemd/system/vllm.service
[Unit]
Description=vLLM Inference Server
After=network.target

[Service]
Type=simple
User=vllm
Environment="HF_HOME=/data/models"
Environment="CUDA_VISIBLE_DEVICES=0,1,2,3"
# `python -m vllm.entrypoints.openai.api_server` is deprecated since vLLM 0.29: use `vllm serve`
# (adapt the `vllm` path to the virtual environment; the model is the positional argument)
ExecStart=/usr/local/bin/vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --tensor-parallel-size 4 \
  --host 127.0.0.1 \
  --port 8000 \
  --gpu-memory-utilization 0.90
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now vllm
sudo journalctl -u vllm -f   # follow logs
```

---

## 6. Verification and tests

```bash
# Health check
curl http://localhost:8000/health

# List loaded models
curl http://localhost:8000/v1/models | python3 -m json.tool

# Generation test
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR-TOKEN-TO-REPLACE" \
  -d '{
    "model": "llama-70b",
    "messages": [{"role": "user", "content": "Hello, are you working?"}],
    "max_tokens": 100
  }'

# Prometheus metrics
curl http://localhost:8000/metrics | grep vllm
```

---

## Next steps

- **Monitoring** → [[06-mise-en-oeuvre/monitoring-inference-stack|📊 Prometheus + Grafana monitoring]]
- **Migration from Ollama** → [[06-mise-en-oeuvre/migrate-ollama-to-vllm|🔄 Migrate from Ollama to vLLM]]
- **Hardening security** → [[06-mise-en-oeuvre/local-inference-security|🔒 Local inference security]]

---

## Sources and references

[^1]: vLLM Project, *Installation — GPU* (official image `vllm/vllm-openai`, Python 3.11–3.14, compute capability ≥ 7.5, default CUDA 13.0 wheel and `cu129` variant), accessed 2026-10-09. [https://docs.vllm.ai/en/stable/getting_started/installation/gpu/](https://docs.vllm.ai/en/stable/getting_started/installation/gpu/)
[^2]: vLLM Project, *Engine Arguments* (`--gpu-memory-utilization`, `--max-model-len`, `--max-num-seqs`, `--max-num-queued-reqs`, KV Cache behavior), accessed 2026-10-09. [https://docs.vllm.ai/en/stable/configuration/engine_args/](https://docs.vllm.ai/en/stable/configuration/engine_args/)
[^3]: vLLM Project, *Parallelism and Scaling — Tensor Parallelism* (`--tensor-parallel-size`, weight sharding, NVLink recommendations). [https://docs.vllm.ai/en/stable/serving/parallelism_scaling/](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/)
[^4]: vLLM Project, *Parallelism and Scaling — Multi-node deployment* (`run_cluster.sh`, `--distributed-executor-backend ray`, `--nnodes` / `--node-rank` / `--headless`, InfiniBand and NCCL), accessed 2026-10-09. [https://docs.vllm.ai/en/stable/serving/parallelism_scaling/](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/)
[^5]: vLLM Project, *Disaggregated Prefill and Decode* (`--kv-transfer-config`, NIXL / LMCache / Mooncake / Offloading connectors, experimental status), accessed 2026-10-09. [https://docs.vllm.ai/en/stable/features/disagg_prefill/](https://docs.vllm.ai/en/stable/features/disagg_prefill/)
[^6]: vLLM Project, *Quantized KV Cache* (`--kv-cache-dtype fp8` / `fp8_e5m2`, CUDA 11.8+ and ROCm, `llm-compressor` calibration, `--kv-cache-dtype-skip-layers`), accessed 2026-10-09. [https://docs.vllm.ai/en/stable/features/quantization/quantized_kvcache/](https://docs.vllm.ai/en/stable/features/quantization/quantized_kvcache/)
[^7]: vLLM Project, *Automatic Prefix Caching* (16-token blocks, TTFT impact, tensor parallelism compatibility). [https://docs.vllm.ai/en/stable/features/automatic_prefix_caching.html](https://docs.vllm.ai/en/stable/features/automatic_prefix_caching.html)
[^8]: vLLM Project, *CLI Reference — `vllm serve`* (exhaustive flag list: no `--role`, `--request-timeout`, `--calculate-kv-cache-size`; `--speculative-config`), accessed 2026-10-09 · vLLM Project, *Release v0.29.0* (addition of `--max-num-queued-reqs`), 2026-09-09. [https://docs.vllm.ai/en/stable/cli/serve/](https://docs.vllm.ai/en/stable/cli/serve/) · [https://github.com/vllm-project/vllm/releases/tag/v0.29.0](https://github.com/vllm-project/vllm/releases/tag/v0.29.0)
[^9]: vLLM Project, *Release v0.28.0* (PyPI wheel and Docker image defaulting to CUDA 13.0, `-cu129` variants), 2026-08-26. [https://github.com/vllm-project/vllm/releases/tag/v0.28.0](https://github.com/vllm-project/vllm/releases/tag/v0.28.0)
[^10]: vLLM Project, *GGUF* (`vllm-gguf-plugin` plugin, "highly experimental and under-optimized" support, base model tokenizer), accessed 2026-10-09. [https://docs.vllm.ai/en/stable/features/quantization/gguf/](https://docs.vllm.ai/en/stable/features/quantization/gguf/)
[^11]: vLLM Project, advisory GHSA-h3rc-6mm3-gc2m (`--api-key` limited to `/v1`, `/v2`, `/inference`; `/tokenize` unauthenticated), 2026-10-06. [https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m](https://github.com/vllm-project/vllm/security/advisories/GHSA-h3rc-6mm3-gc2m)
