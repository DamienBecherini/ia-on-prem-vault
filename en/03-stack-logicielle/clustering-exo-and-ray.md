---
title: "🌐 AI Clustering: Connecting GPUs with Exo and Ray"
description: How to merge memory across multiple machines for local AI. Comparison between Exo (Apple Silicon / homelab) and Ray Serve (datacenter).
sidebar:
  order: 2
last_modified: "2026-06-10"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> When no single machine can load the model, clustering distributes weights across multiple nodes. Exo is built to connect Macs or desktop PCs via Thunderbolt. Ray Serve handles datacenter production. One expands your homelab; the other scales in production.

Even with the best [[01-fondations/quantization-4bit-8bit|quantization]], a massive model like DeepSeek V3 (671 billion parameters) requires more than 400 GB of video memory. No consumer graphics card has that capacity alone.

The hardware solution is to use a [[02-materiel/stations-multi-gpu|multi-GPU server]]. But how does software handle this distribution? And what if you don't have a huge server, but rather several Mac Studios or PCs connected over a network?

In 2026, two software schools compete for AI clustering: **Exo** for desktop hardware, and **Ray** for datacenters.

---

## 1. Exo: The desktop P2P cluster

[Exo](https://github.com/exo-explore/exo) (developed by *Exo Labs*) is the revolution in "mainstream" local inference. Its goal is simple: create a unified AI cluster from everyday devices (Mac, Linux PC, NVIDIA cards, even smartphones) connected on the same network[^1].

### 🌟 How it works
Exo runs Peer-to-Peer (P2P). You run the `uv run exo` command on each machine. They automatically discover each other on the local network and merge their available memory[^1]. When a request is sent, Exo splits the model (*Pipeline Parallelism* strategy): machine A computes the first layers of the neural network, then sends the result to machine B over the network, which computes the next layers.

### 🚀 Use case: The Mac cluster
Exo shines particularly on Apple Silicon. Using Thunderbolt 4 or 5 cables (which enable **RDMA-over-Thunderbolt** between chips), you get enough network bandwidth to compensate for inter-machine latency.
Community benchmarks indicate that a cluster of 8 Mac Mini M4 Pro (512 GB aggregated unified memory) can run the colossal DeepSeek V3 671B with throughput on the order of **3 to 5 tokens/s** in this configuration[^2].

### ⚠️ Limitations
If the network connection is slow (Wi-Fi or plain 1 Gigabit Ethernet cable), transferring activations between machines becomes a fatal bottleneck. Total capacity increases, but [[00-lexique/tokens-per-second|tokens/s]] collapse.

---

## 2. Ray & vLLM: The datacenter standard

For enterprise production (like Apple's or OpenAI's infrastructure), consumer networking has no place. The industry standard relies on the distributed orchestrator **Ray** (often coupled with the **vLLM** engine covered earlier).

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
| **Installation** | `pip install exo` then `uv run exo` | Ray cluster + vLLM, YAML configuration |
| **Node discovery** | Automatic (mDNS / Thunderbolt) | Manual (IP/DNS or explicit config) |
| **Recommended network** | Thunderbolt 4/5, Wi-Fi 6E possible | RoCE v2 or InfiniBand (100/200 Gb) |
| **Target hardware** | Mac Mini, Mac Studio, Linux PC, AMD GPU | Rack servers, NVIDIA H100/H200, A100 |
| **Parallelism** | Pipeline Parallelism only | TP + PP + Prefill/Decode disaggregation |
| **Monitoring** | Text logs, no native observability | Prometheus, Grafana, Ray traces |
| **Fault tolerance** | Low (loss of one node = crash) | Strong (Ray restarts workers) |
| **Budget threshold** | < €15,000 (desktop cluster) | > €100,000 (GPU server + network) |
| **Operational complexity** | ⭐ (very simple) | ⭐⭐⭐⭐⭐ (HPC expertise required) |

## 4. Quick start — Exo on two Macs

```bash
# On each machine in the cluster
pip install exo

# Machine 1 (P2P cluster startup)
uv run exo

# Machine 2 (automatic join via mDNS)
uv run exo

# Verify that nodes see each other
# Exo displays in logs: "Discovered peer: <hostname>"

# Send a request to the cluster (OpenAI-compatible API)
curl http://localhost:52415/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b",
    "messages": [{"role": "user", "content": "How many nodes in this cluster?"}]
  }'
```

> [!note] Thunderbolt vs Ethernet for Exo
> On Wi-Fi or 1 Gb Ethernet, Exo works but performance drops drastically. For 70B+ models, prefer Thunderbolt 4 (40 Gb/s) or Thunderbolt 5 (80 Gb/s). Thunderbolt cables automatically create an IP-over-Thunderbolt network interface on macOS.

---

## 📋 The architect's advice

To deploy on-premise autonomous agents for clients:

1.  **In testing phase or for an SME lab:** If you need to run a 70B model and you have two Mac Studios or two 32 GB gaming PCs, **install Exo**. In 5 minutes, your cluster is ready and the model runs without additional cloud investment.
2.  **In critical multi-user production:** Forget P2P. Use **Ray Serve with vLLM** on Linux servers equipped with dedicated GPUs. This is the only software architecture that guarantees precise monitoring, intelligent routing of concurrent requests, and real fault tolerance at the local datacenter level.

---

## 📚 Sources and references
[^1]: Exo Labs, *GitHub - exo-explore/exo: Run frontier AI locally* (2026). [https://github.com/exo-explore/exo](https://github.com/exo-explore/exo)
[^2]: Exo Labs, *Running DeepSeek V3 671B on M4 Mac Mini Cluster* (Performance via Thunderbolt 5 and Exo, 3–5 tok/s), March 2026. [https://blog.exolabs.net/day-2](https://blog.exolabs.net/day-2)
[^3]: Anyscale & vLLM Blog, *Streamlined multi-node serving with Ray symmetric-run* (Multi-node vLLM launch), November 2025. [https://vllm.ai/blog/2025-11-22-ray-symmetric-run](https://vllm.ai/blog/2025-11-22-ray-symmetric-run)
[^4]: Anyscale, *Ray Serve LLM — Wide-EP disaggregated serving with vLLM* (Prefill/Decode disaggregation, MoE), 2025. [https://www.anyscale.com/blog/ray-serve-llm-anyscale-apis-wide-ep-disaggregated-serving-vllm](https://www.anyscale.com/blog/ray-serve-llm-anyscale-apis-wide-ep-disaggregated-serving-vllm)
