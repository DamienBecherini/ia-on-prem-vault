---
title: "⚙️ Configure vLLM for multi-GPU production"
description: Installation, tensor parallel configuration, multi-node deployment with Ray, and production best practices for vLLM on NVIDIA GPUs.
sidebar:
  order: 5
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> vLLM turns a GPU server into a high-performance inference API. This guide covers installation, single- and multi-GPU configuration, multi-node deployment via Ray, and critical production parameters.

> [!info] Prerequisites
> This guide assumes NVIDIA GPUs with CUDA 12.x and Python 3.10+. For Apple Silicon or AMD ROCm, installation steps differ — see the [official vLLM documentation](https://docs.vllm.ai/en/stable/getting_started/installation.html).

---

## 1. Installation

### Via pip (recommended)

```bash
# Python 3.10-3.12, CUDA 12.1+
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

> [!warning] GGUF not natively supported
> vLLM does not read GGUF files (Ollama/llama.cpp format). Use native HuggingFace weights (safetensors) or AWQ/GPTQ quantization. To convert a model, see [[06-mise-en-oeuvre/migrate-ollama-to-vllm|Ollama → vLLM migration]].

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
  --host 0.0.0.0 \
  --port 8000
```

vLLM and Ray handle distribution automatically: the first 4 GPUs (node 0) run early layers, the next 4 (node 1) run the rest[^4].

### Prefill / Decode disaggregation (2026)

Advanced architecture available since vLLM v0.6+: nodes dedicated to **Prefill** (prompt read, CPU-bound) and others to **Decode** (generation, memory-bandwidth-bound)[^5]. Reduces TTFT by 30 to 50% on long prompts.

```bash
# Prefill node (compute-optimized)
vllm serve ... --num-speculative-tokens 5 --role prefill

# Decode node (memory-optimized)
vllm serve ... --role decode
```

> [!note] Stability
> Prefill/Decode disaggregation is available but still actively evolving in 2026. Test in staging before any production deployment.

---

## 5. Production configuration — advanced parameters

### API authentication

```bash
vllm serve ... \
  --api-key "sk-your-secret-token"
```

Or via environment variable:
```bash
export VLLM_API_KEY="sk-your-secret-token"
vllm serve ...
```

Clients must send `Authorization: Bearer sk-your-secret-token`.

### Limits and timeouts

```bash
vllm serve ... \
  --max-num-seqs 512 \              # max queue (beyond: 503 error)
  --request-timeout 120 \           # per-request timeout in seconds
  --disable-log-requests            # disable request logs in production
```

### KV Cache optimization — FP8 quantization

On NVIDIA Hopper GPUs (H100, H200), FP8 KV Cache quantization cuts footprint by ~50% with little noticeable quality loss[^6]:

```bash
vllm serve ... \
  --kv-cache-dtype fp8 \
  --calculate-kv-cache-size         # show configured KV cache size
```

### Automatic Prefix Caching (APC) — essential for RAG and agents

In multi-user or multi-agent setups, several requests often share the same **System Prompt** (500–2000 tokens) or the same RAG document in context. Without APC, vLLM computes and stores that prefix KV Cache **N times** — once per request — wasting VRAM and compute.

```bash
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --enable-prefix-caching \            # enable prompt block hashing
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90
```

**How it works:** vLLM hashes each 16-token block. If a new request starts with the same block sequence as a prior request still in GPU cache, Key/Value vectors are reused directly — without recomputing Prefill[^7].

**Measured impact:**

| Scenario | Without APC | With APC |
| :-- | :-- | :-- |
| 20 parallel agents, same 800-token system prompt | TTFT 3–8s each | TTFT < 100ms from 2nd request |
| RAG pipeline: shared document context | full recompute × N | cache hit: ~96% VRAM saved on prefix |

> [!note] Compatibility
> APC is **incompatible** with Prefill/Decode disaggregation (`--role prefill/decode`). Do not enable both at once. Compatible with Tensor Parallelism and FP8 KV Cache quantization[^7].

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
ExecStart=/usr/bin/python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-3.1-70B-Instruct \
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
  -H "Authorization: Bearer sk-your-token" \
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

[^1]: vLLM Project, *Installation — Docker* (official image `vllm/vllm-openai`, CUDA 12.x, dependencies). [https://docs.vllm.ai/en/stable/getting_started/installation.html](https://docs.vllm.ai/en/stable/getting_started/installation.html)
[^2]: vLLM Project, *Engine Arguments* (`--gpu-memory-utilization`, `--max-model-len`, `--max-num-seqs`, KV Cache behavior). [https://docs.vllm.ai/en/stable/serving/engine_args.html](https://docs.vllm.ai/en/stable/serving/engine_args.html)
[^3]: vLLM Project, *Parallelism and Scaling — Tensor Parallelism* (`--tensor-parallel-size`, weight sharding, NVLink recommendations). [https://docs.vllm.ai/en/stable/serving/parallelism_scaling/](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/)
[^4]: Anyscale & vLLM Blog, *Streamlined multi-node serving with Ray symmetric-run* (Ray cluster configuration, inter-node pipeline parallelism). [https://www.anyscale.com/blog/streamlined-multi-node-serving](https://www.anyscale.com/blog/streamlined-multi-node-serving), November 2025.
[^5]: vLLM Project, *Disaggregated Prefill and Decode* (phase separation architecture, TTFT reduction). [https://docs.vllm.ai/en/stable/features/disagg_prefill.html](https://docs.vllm.ai/en/stable/features/disagg_prefill.html)
[^6]: vLLM Project, *KV Cache Quantization* (FP8 KV cache, NVIDIA Hopper support, memory impact). [https://docs.vllm.ai/en/stable/features/quantization/fp8_kv_cache.html](https://docs.vllm.ai/en/stable/features/quantization/fp8_kv_cache.html)
[^7]: vLLM Project, *Automatic Prefix Caching* (16-token blocks, TTFT impact, tensor parallelism compatibility). [https://docs.vllm.ai/en/stable/features/automatic_prefix_caching.html](https://docs.vllm.ai/en/stable/features/automatic_prefix_caching.html)
