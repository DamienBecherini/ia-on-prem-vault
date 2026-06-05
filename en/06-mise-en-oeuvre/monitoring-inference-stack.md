---
title: "📊 Monitoring the inference stack"
description: Setting up Prometheus + Grafana monitoring for a vLLM or Ollama stack — GPU metrics, KV Cache, throughput, and operational alerts.
sidebar:
  order: 6
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Without monitoring, throughput degradation or GPU OOM goes unnoticed until a user complains. This guide installs a Prometheus + Grafana stack in 15 minutes, covers key vLLM and GPU metrics, and provides minimal alerts for calm production operations.

---

## Monitoring architecture

```
┌─────────────────────────────────────────────┐
│  Metric sources                             │
│                                             │
│  vLLM /metrics ──────────────────────────┐  │
│  nvidia-smi ──► nvidia-dcgm-exporter ────┤  │
│  OS ──────────► node-exporter ───────────┤  │
└───────────────────────────────────────── │ ─┘
                                           │
                                           ▼
                                     Prometheus
                                     (scrape + store)
                                           │
                                           ▼
                                      Grafana
                                   (dashboards + alerts)
```

---

## 1. Full Docker Compose stack

```yaml
# docker-compose.monitoring.yml
services:

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'
    ports:
      - "9090:9090"
    restart: unless-stopped

  grafana:
    image: grafana/grafana-oss:latest
    container_name: grafana
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=changeme
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3000:3000"
    restart: unless-stopped
    depends_on:
      - prometheus

  nvidia-dcgm-exporter:
    image: nvcr.io/nvidia/k8s/dcgm-exporter:latest
    container_name: dcgm-exporter
    runtime: nvidia
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
    ports:
      - "9400:9400"
    restart: unless-stopped
    cap_add:
      - SYS_ADMIN

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
    ports:
      - "9100:9100"
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
```

```bash
docker compose -f docker-compose.monitoring.yml up -d
```

---

## 2. Prometheus configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:

  - job_name: 'vllm'
    static_configs:
      - targets: ['host.docker.internal:8000']  # adjust if vLLM on another machine
    metrics_path: '/metrics'

  - job_name: 'nvidia-gpu'
    static_configs:
      - targets: ['dcgm-exporter:9400']

  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']

  # If Ollama (no native /metrics — use community exporter)
  - job_name: 'ollama'
    static_configs:
      - targets: ['host.docker.internal:9462']  # ollama exporter port
```

> [!note] Ollama vs vLLM
> vLLM natively exposes a Prometheus-compatible `/metrics` endpoint[^1]. Ollama does not — you need a community exporter such as [ollama-exporter](https://github.com/marcboeker/go-ollama) or [prometheus-ollama-exporter](https://github.com/codereliant/ollama-prometheus-exporter). These projects are unofficial; evaluate before production use.

---

## 3. vLLM metrics — essentials

vLLM exposes metrics on `GET /metrics`[^1]. Priority metrics to watch:

### Throughput and queues

| Metric | Description | Alert threshold |
| :-- | :-- | :-- |
| `vllm:num_requests_running` | Requests in progress | > 80% of `--max-num-seqs` |
| `vllm:num_requests_waiting` | Queued requests | > 0 for > 30 s |
| `vllm:avg_generation_throughput_toks_per_s` | Average throughput tokens/s | < threshold defined by use case |
| `vllm:prompt_tokens_total` | Prompt tokens processed (cumulative) | — (trend) |
| `vllm:generation_tokens_total` | Generated tokens (cumulative) | — (trend) |

### KV Cache

| Metric | Description | Alert threshold |
| :-- | :-- | :-- |
| `vllm:gpu_cache_usage_perc` | % KV Cache used | > 90% |
| `vllm:cpu_cache_usage_perc` | % KV Cache swapped to CPU | > 0 (indicates swap) |
| `vllm:num_preemptions_total` | Preempted requests (KV Cache full) | > 0 regularly |

> [!warning] KV Cache swap
> If `cpu_cache_usage_perc > 0`, vLLM swaps KV Cache from VRAM to CPU RAM — a sign that VRAM is insufficient for current load. Performance collapses once swap starts[^2]. Reduce `--max-model-len` or `--max-num-seqs`, or increase `--gpu-memory-utilization`.

### Latencies

| Metric | Description |
| :-- | :-- |
| `vllm:time_to_first_token_seconds` | TTFT distribution per request |
| `vllm:time_per_output_token_seconds` | Latency per generated token |
| `vllm:e2e_request_latency_seconds` | End-to-end latency |

---

## 4. GPU metrics (DCGM Exporter)

NVIDIA DCGM Exporter exposes detailed GPU metrics[^3]:

| DCGM metric | Description | Alert threshold |
| :-- | :-- | :-- |
| `DCGM_FI_DEV_GPU_UTIL` | GPU utilization (%) | < 10% for > 5 min (waste) |
| `DCGM_FI_DEV_MEM_COPY_UTIL` | Memory bus utilization (%) | > 90% sustained |
| `DCGM_FI_DEV_FB_USED` | VRAM used (MiB) | > 95% of total VRAM |
| `DCGM_FI_DEV_GPU_TEMP` | GPU temperature (°C) | > 83°C (likely throttling) |
| `DCGM_FI_DEV_POWER_USAGE` | Power draw (W) | > declared TDP |
| `DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL` | NVLink throughput (GB/s) | — (trend on clusters) |

### Prometheus query — VRAM used per GPU

```promql
DCGM_FI_DEV_FB_USED{gpu=~".*"}
```

---

## 5. Recommended Grafana dashboards

### Import from Grafana.com

1. Open Grafana → **Dashboards → Import**
2. Enter dashboard ID:

| Dashboard | Grafana ID | Usage |
| :-- | :-- | :-- |
| NVIDIA DCGM Exporter | **12239** | GPU utilization, memory, temperature[^4] |
| Node Exporter Full | **1860** | Host CPU, RAM, network, disk[^5] |

> [!note] vLLM dashboard
> There is no official vLLM dashboard on Grafana.com in 2026. Build it manually from section 3 metrics, or search grafana.com for community "vLLM" dashboards (variable quality).

### Essential panels to build manually

**Panel "Throughput tokens/s":**
```promql
rate(vllm:generation_tokens_total[1m])
```

**Panel "KV Cache %":**
```promql
vllm:gpu_cache_usage_perc * 100
```

**Panel "Queue":**
```promql
vllm:num_requests_waiting
```

**Panel "TTFT P95" (95th percentile):**
```promql
histogram_quantile(0.95, rate(vllm:time_to_first_token_seconds_bucket[5m]))
```

---

## 6. Prometheus alerts

```yaml
# alerts.yml — reference in prometheus.yml under rule_files:
groups:
  - name: inference-alerts
    rules:

      - alert: VLLMKVCacheHigh
        expr: vllm:gpu_cache_usage_perc > 0.90
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "vLLM KV Cache > 90%"
          description: "KV Cache is at {{ $value | humanizePercentage }}. Risk of swap or preemption."

      - alert: VLLMRequestQueueBacklog
        expr: vllm:num_requests_waiting > 0
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "vLLM queue not empty"
          description: "{{ $value }} requests waiting for more than 1 minute."

      - alert: GPUTemperatureHigh
        expr: DCGM_FI_DEV_GPU_TEMP > 83
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "GPU {{ $labels.gpu }} overheating"
          description: "GPU temperature at {{ $value }}°C — likely throttling."

      - alert: VRAMAlmostFull
        expr: (DCGM_FI_DEV_FB_USED / DCGM_FI_DEV_FB_TOTAL) > 0.95
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "GPU {{ $labels.gpu }} VRAM critical"
          description: "{{ $value | humanizePercentage }} VRAM used."
```

To enable alerts in Prometheus:

```yaml
# prometheus.yml — add
rule_files:
  - "alerts.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']  # if Alertmanager deployed
```

---

## 7. Monitoring Ollama (without native Prometheus)

If you use Ollama, a few immediate monitoring commands:

```bash
# Loaded models and VRAM used
ollama ps

# Real-time logs (include generation durations)
ollama logs -f

# Metrics in API response (durations in nanoseconds)
curl -s http://localhost:11434/api/generate \
  -d '{"model":"llama3.2","prompt":"test","stream":false}' \
  | python3 -c "
import sys, json
r = json.load(sys.stdin)
print(f'TTFT: {r[\"prompt_eval_duration\"]/1e9:.2f}s')
print(f'Generation: {r[\"eval_duration\"]/1e9:.2f}s')
print(f'Throughput: {r[\"eval_count\"]/(r[\"eval_duration\"]/1e9):.1f} tok/s')
"
```

---

## 8. Traces vs. metrics — OpenTelemetry for agent stacks

Prometheus and Grafana answer *"Is the server healthy?"*. They do not answer *"Why did this request take 30 seconds?"*.

### The agent problem

In a RAG or multi-agent pipeline, one request crosses several services before producing an answer. If a user complains about 30s latency, Grafana may show the GPU at 70% utilization — not enough to diagnose the cause. You need the **full request trace**:

```
User request (30s total)
├── VectorDB Qdrant     — 4s  (semantic search)
├── Agent routing       — 2s  (tool selection)
├── SearXNG web search  — 20s (network timeout ⚠️)
└── LLM generation      — 4s  (200 tokens @ 50 tok/s)
```

Without traces, engineers search logs in each service separately. With OpenTelemetry traces, the full request appears as one waterfall in a dedicated tool.

### OpenTelemetry (OTEL) — native vLLM and LiteLLM integration

LiteLLM and vLLM support OpenTelemetry natively[^6][^7]:

```bash
# vLLM — enable OTEL (export to local collector)
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --otlp-traces-endpoint http://localhost:4317

# LiteLLM — enable in litellm_config.yaml
general_settings:
  otel: true
  otel_endpoint: http://localhost:4317   # OTLP gRPC
```

### Recommended LLM observability stack

For a sovereign on-prem infrastructure, two options:

| Tool | Type | Strengths | Deployment |
| :-- | :-- | :-- | :-- |
| **Langfuse** (self-hosted) | Traces + LLM eval | LLM-focused UI, cost per token, quality evaluation | Docker Compose[^6] |
| **Jaeger** | Distributed traces | CNCF standard, lightweight, Kubernetes-ready | Docker `jaegertracing/all-in-one` |
| **Arize Phoenix** | Traces + agent debug | Specialized for agents/RAG, free and open-source | `pip install arize-phoenix`[^7] |

**Minimal recommended stack for a custodian agent:**

```yaml
# docker-compose.yml — add to existing stack
langfuse:
  image: langfuse/langfuse:latest
  ports:
    - "3001:3000"
  environment:
    DATABASE_URL: "postgresql://langfuse:langfuse@postgres:5432/langfuse"
    NEXTAUTH_SECRET: "your-secret"
    SALT: "your-salt"

otel-collector:
  image: otel/opentelemetry-collector-contrib:latest
  volumes:
    - ./otel-config.yaml:/etc/otel-config.yaml
  command: ["--config=/etc/otel-config.yaml"]
  ports:
    - "4317:4317"   # OTLP gRPC
    - "4318:4318"   # OTLP HTTP
```

> [!note] Metrics ≠ traces: both are complementary
> - **Prometheus/Grafana** → automatic alerting, health dashboards, SLOs
> - **OTEL/Langfuse** → per-request debugging, latency pattern analysis, agentic response quality evaluation
>
> In agent production, you need both. Metrics detect that there is a problem; traces explain why.

---

## See also

- [[06-mise-en-oeuvre/configure-vllm-multi-gpu|⚙️ Configure vLLM multi-GPU]] — `/metrics` endpoint and parameters
- [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scenario C]] — Exo/Thunderbolt monitoring
- [[04-blueprints/scenario-d-datacenter|🏭 Scenario D]] — datacenter RoCE monitoring

---

## Sources and references

[^1]: vLLM Project, *Production Metrics* (`/metrics` endpoint, full list of exposed Prometheus metrics, latency histograms). [https://docs.vllm.ai/en/stable/serving/metrics.html](https://docs.vllm.ai/en/stable/serving/metrics.html)
[^2]: vLLM Project, *Engine Arguments — `gpu-memory-utilization`* (CPU KV Cache swap behavior, performance impact). [https://docs.vllm.ai/en/stable/serving/engine_args.html](https://docs.vllm.ai/en/stable/serving/engine_args.html)
[^3]: NVIDIA, *DCGM Exporter — Metrics Reference* (list of DCGM_FI_DEV_* metrics, GPU utilization, memory, temperature, NVLink). [https://github.com/NVIDIA/dcgm-exporter](https://github.com/NVIDIA/dcgm-exporter)
[^4]: Grafana Labs, *NVIDIA DCGM Exporter Dashboard* (ID 12239, GPU metrics visualization). [https://grafana.com/grafana/dashboards/12239](https://grafana.com/grafana/dashboards/12239)
[^5]: Grafana Labs, *Node Exporter Full Dashboard* (ID 1860, system metrics — CPU, memory, disk, network). [https://grafana.com/grafana/dashboards/1860](https://grafana.com/grafana/dashboards/1860)
[^6]: Langfuse, *Self-Hosting Guide & LiteLLM Integration* (Docker Compose, OTEL ingestion, LLM observability). [https://langfuse.com/docs/deployment/self-host](https://langfuse.com/docs/deployment/self-host)
[^7]: Arize AI, *Arize Phoenix — Open-source LLM Observability* (agent traces, RAG debugging, OTEL-compatible). [https://docs.arize.com/phoenix](https://docs.arize.com/phoenix)
