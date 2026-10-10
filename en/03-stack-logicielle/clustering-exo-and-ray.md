---
title: "🌐 AI Clustering: Connecting GPUs with Exo and Ray"
description: How to merge memory across multiple machines for local AI. Comparison between Exo (Apple Silicon / homelab) and Ray Serve (datacenter).
sidebar:
  order: 2
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> When no single machine can load the model, clustering distributes weights across multiple nodes. Exo is built to connect Apple Silicon Macs via Thunderbolt 5. Ray Serve handles datacenter production. One expands your homelab; the other scales in production.

Even with the best [[01-fondations/quantization-4bit-8bit|quantization]], a massive model like DeepSeek V3 (671 billion parameters) requires more than 400 GB of video memory. No consumer graphics card has that capacity alone.

The hardware solution is to use a [[02-materiel/stations-multi-gpu|multi-GPU server]]. But how does software handle this distribution? And what if you don't have a huge server, but rather several Mac Studios connected over a network?

In 2026, two software schools compete for AI clustering: **Exo** for desktop hardware, and **Ray** for datacenters.

---

## 1. Exo: The desktop P2P cluster

[Exo](https://github.com/exo-explore/exo) (developed by *Exo Labs*) is the revolution in "mainstream" local inference. Its goal is simple: create an AI cluster from Apple Silicon Macs connected on the same network; as of Q4 2026 Exo relies solely on **MLX**, Linux is supported only on **CPU** (GPU is "in development", experimental `mlx-cuda12/13` extras), and Windows is not supported[^1].

> [!warning] Project slowing down (status as of 2026-10-09)
> Exo has not published a release since v1.0.71 (2026-04-23) and its repository has received only two commits since June 2026; the project remains usable but no longer keeps pace with new models or macOS at MLX's rhythm[^1][^5]. Since macOS 26.2 and MLX 0.32, Apple ships the maintained equivalent directly: `mlx.launch` runs a distributed program over a *hostfile* of Macs linked via Thunderbolt 5 (**JACCL** backend, RDMA) or Ethernet (*ring* backend)[^6]. For a new Mac cluster, compare distributed MLX (maintained by Apple) and Exo (simpler interface, project slowing down).

### 🌟 How it works
Exo runs Peer-to-Peer (P2P). You run the `uv run exo` command on each machine. They automatically discover each other on the local network and merge their available memory[^1]. When a request is sent, Exo splits the model either in *pipeline* mode (successive layers on successive machines: machine A computes the first layers of the neural network, then sends the result to machine B, which computes the next layers) or in *tensor parallel* mode (each layer spread across all machines, via Thunderbolt 5 RDMA), depending on the bandwidth measured between nodes[^1].

### 🚀 Use case: The Mac cluster
Exo shines particularly on Apple Silicon. By linking the Macs over **Thunderbolt 5** under **macOS 26.2 or later**, Exo enables **RDMA over Thunderbolt** (to be enabled once via `rdma_ctl enable` from Recovery mode, with the same macOS build on every node) and gets enough bandwidth to compensate for inter-machine latency; over Thunderbolt 4 you only get an IP link, enough for testing but not for tensor parallelism[^1].
Exo Labs measured, on a cluster of 8 Mac mini M4 Pro 64 GB (512 GB aggregated), DeepSeek V3 671B in 4-bit at **5.4 tokens/s** (TTFT 2.9 s); the Mac mini M5 Pro generation (307 GB/s, Thunderbolt 5) has replaced it since September 2026 with no new published figure[^2][^8].

### ⚠️ Limitations
If the network connection is slow (Wi-Fi or plain 1 Gigabit Ethernet cable), transferring activations between machines becomes a fatal bottleneck. Total capacity increases, but [[00-lexique/tokens-per-second|tokens/s]] collapse.

---

## 2. Ray & vLLM: The datacenter standard

For enterprise production (like Apple's or OpenAI's infrastructure), consumer networking has no place. The industry standard relies on the distributed orchestrator **Ray** (often coupled with the **vLLM** engine covered earlier). Ray Serve LLM reached general availability with Ray 2.59.0 (October 2, 2026): vLLM and SGLang backends, prefill/decode disaggregation, prefix-aware and KV-cache-occupancy routing, multi-LoRA; the vLLM version pinned by Ray (0.27.0) lags a few releases behind upstream vLLM (0.31.0), to be checked before aligning CUDA 13 / PyTorch[^3][^7].

### 🌟 How it works
Ray manages entire server farms. Instead of P2P, it relies on a Master/Worker architecture. The `ray symmetric-run` command, for example, lets you launch and synchronize the vLLM engine across multiple physical servers in a unified way[^3].

Ray orchestrates the combination of several mathematical strategies:
*   **Tensor Parallelism (TP):** Splits the mathematical matrices of the same layer across GPUs *inside* one server (requires an [[00-lexique/nvlink|NVLink]] bus).
*   **Pipeline Parallelism (PP):** Splits model layer blocks *across* different servers (requires [[00-lexique/roce|RoCE]] or InfiniBand networking).

### 🚀 Use case: Disaggregation and MoE
In 2026, the Ray + vLLM architecture enables extreme optimizations, such as **Prefill/Decode disaggregation**: a dedicated server (optimized for pure compute) handles reading the initial prompt ([[00-lexique/prefill|Prefill]]), then transfers the [[00-lexique/kv-cache|KV Cache]] over the network to another server (optimized for memory capacity) that generates the response ([[00-lexique/decoding|Decoding]])[^4]. This is essential for efficiently serving Mixture-of-Experts (MoE) models at scale.

### ⚠️ Limitations
Ray is very complex to administer. It requires enterprise-class infrastructure, shared storage, and an extremely high-performance AI network configured specifically to reduce latency.

---

## 3. Operational comparison: Exo vs Ray

| Criterion | Exo | Ray + vLLM |
| :-- | :-- | :-- |
| **Installation** | `brew install --cask exo` (macOS app) or `uv sync --extra mlx` + `uv run exo` | Ray cluster + vLLM, YAML configuration |
| **Node discovery** | Automatic (zenoh since June 2026; IP or Thunderbolt)[^9] | Manual (IP/DNS or explicit config) |
| **Recommended network** | Thunderbolt 5 + RDMA (macOS 26.2+); TB4 / Ethernet for testing | RoCE v2 or InfiniBand (200/400 Gb) |
| **Target hardware** | Apple Silicon Macs (Mac mini M5 Pro, Mac Studio M5 Max / Ultra); Linux CPU-only | NVIDIA rack servers (H100/H200/B200/B300), AMD MI300X/MI355X via vLLM/SGLang |
| **Parallelism** | Pipeline + Tensor (automatic choice based on topology; TP advertised up to 1.8× on 2 nodes, 3.2× on 4)[^1] | TP + PP + Prefill/Decode disaggregation |
| **Monitoring** | Web dashboard and API on `localhost:52415`; no Prometheus metrics[^1] | Prometheus, Grafana (vLLM / SGLang dashboards), Ray traces |
| **Fault tolerance** | Low (loss of one node = crash) | Strong (Ray restarts workers) |
| **Budget threshold** | < €15,000–25,000 (2–4 Mac Studio M5 depending on memory) | > €100,000 (GPU server + network) |
| **Operational complexity** | ⭐ (very simple) | ⭐⭐⭐⭐⭐ (HPC expertise required) |

## 4. Quick start — Exo on two Macs

```bash
# On each machine in the cluster (from source; or `brew install --cask exo`)
git clone https://github.com/exo-explore/exo && cd exo && uv sync --extra mlx

# Machine 1 (P2P cluster startup)
uv run exo

# Machine 2 (automatic join, zenoh discovery)
uv run exo

# Verify that nodes see each other
# Exo displays in logs: "Discovered peer: <hostname>"

# Send a request to the cluster (OpenAI-compatible API) — "model" = Hugging Face identifier
# as shown in the dashboard (http://localhost:52415); example from the Exo README
curl http://localhost:52415/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mlx-community/Llama-3.2-1B-Instruct-4bit",
    "messages": [{"role": "user", "content": "How many nodes in this cluster?"}]
  }'
```

> [!note] Thunderbolt vs Ethernet for Exo
> On Wi-Fi or 1 Gb Ethernet, Exo works but performance drops drastically. For 70B+ models, prefer **Thunderbolt 5** (80 Gb/s, 120 Gb/s asymmetric) under macOS 26.2+ to benefit from RDMA; Thunderbolt 4 (40 Gb/s) only provides an IP-over-Thunderbolt interface, created automatically by macOS[^1][^6].

---

## 📋 The architect's advice

To deploy on-premise autonomous agents for clients:

1.  **In testing phase or for an SME lab:** if your models exceed the memory of a single Mac (DeepSeek, Kimi, Qwen 3.x-480B, etc.), link two to four Apple Silicon Macs over Thunderbolt 5 with **distributed MLX** (`mlx.launch`, JACCL backend) or **Exo**; a 70B Q4 fits in a 64–128 GB Mac Studio without a cluster. Linux/Windows PCs with GPUs are not served by Exo as of Q4 2026[^1][^6]. In a few minutes, your cluster is ready and the model runs without additional cloud investment.
2.  **In critical multi-user production:** Forget P2P. Use **Ray Serve with vLLM** on Linux servers equipped with dedicated GPUs. This is the only software architecture that guarantees precise monitoring, intelligent routing of concurrent requests, and real fault tolerance at the local datacenter level.

---

## 📚 Sources and references
[^1]: Exo Labs, *GitHub - exo-explore/exo: Run frontier AI locally* (README: API and dashboard on `localhost:52415`, API examples with `mlx-community/Llama-3.2-1B-Instruct-4bit`, MLX backend only, Linux CPU-only, Thunderbolt 5 RDMA + macOS 26.2, `rdma_ctl enable`, automatically chosen pipeline and tensor parallelism — TP "up to 1.8× on 2 devices, 3.2× on 4" —, `brew` / `uv sync --extra mlx` install), re-read on 2026-10-09. [https://github.com/exo-explore/exo](https://github.com/exo-explore/exo)
[^2]: Exo Labs, *Running DeepSeek V3 671B on M4 Mac Mini Cluster — 12 days of EXO* (8 × Mac mini M4 Pro 64 GB, 4-bit, 5.37 tok/s, TTFT 2.91 s; undated page, December 2024 series), re-read on 2026-10-09. [https://blog.exolabs.net/day-2](https://blog.exolabs.net/day-2)
[^3]: Anyscale & vLLM Blog, *Streamlined multi-node serving with Ray symmetric-run* (Multi-node vLLM launch), November 2025. [https://vllm.ai/blog/2025-11-22-ray-symmetric-run](https://vllm.ai/blog/2025-11-22-ray-symmetric-run)
[^4]: Anyscale, *Ray Serve LLM — Wide-EP disaggregated serving with vLLM* (Prefill/Decode disaggregation, MoE), 2025. [https://www.anyscale.com/blog/ray-serve-llm-anyscale-apis-wide-ep-disaggregated-serving-vllm](https://www.anyscale.com/blog/ray-serve-llm-anyscale-apis-wide-ep-disaggregated-serving-vllm)
[^5]: Exo Labs, *exo — Releases* (latest version v1.0.71, 2026-04-23), accessed 2026-10-09. [https://github.com/exo-explore/exo/releases](https://github.com/exo-explore/exo/releases)
[^6]: Apple MLX, *Distributed Communication* (`mlx.launch`, JACCL / ring backends, Thunderbolt 5 RDMA), accessed 2026-10-09. [https://ml-explore.github.io/mlx/build/html/usage/distributed.html](https://ml-explore.github.io/mlx/build/html/usage/distributed.html)
[^7]: Ray Project, *Release ray-2.59.0* ("LLM APIs graduate to general availability": vLLM 0.27.0 and SGLang, prefill/decode disaggregation, KV-aware routing, multi-LoRA), 2026-10-02 · Ray Docs, *Serving LLMs*. [https://github.com/ray-project/ray/releases/tag/ray-2.59.0](https://github.com/ray-project/ray/releases/tag/ray-2.59.0) · [https://docs.ray.io/en/latest/serve/llm/index.html](https://docs.ray.io/en/latest/serve/llm/index.html)
[^8]: Apple Newsroom, *Apple unveils a more powerful Mac mini featuring the all-new M6 and M5 Pro* (Mac mini M5 Pro: up to 64 GB, 307 GB/s, Thunderbolt 5), August 2026 · Apple, *Mac mini — Technical Specifications*, accessed 2026-10-09. [https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/](https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/) · [https://www.apple.com/mac-mini/specs/](https://www.apple.com/mac-mini/specs/)
[^9]: Exo Labs, `exo-explore/exo` repository, PR #2132 "libp2p -> zenoh" (replacement of the discovery layer), merged 2026-06-03. [https://github.com/exo-explore/exo/pull/2132](https://github.com/exo-explore/exo/pull/2132)
