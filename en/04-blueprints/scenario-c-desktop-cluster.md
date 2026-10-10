---
title: "🖥️ Scenario C: Desktop Cluster (Exo & Thunderbolt)"
description: The scalability blueprint. Connect several Mac Minis or compact PCs via Thunderbolt to run massive models inaccessible on a single machine.
sidebar:
  order: 3
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

[[04-blueprints/scenario-b-sme-appliance|Scenario B]] (the Appliance) has a major flaw: its memory is fixed. If your client's needs evolve and they want to deploy a colossal [[00-lexique/moe|MoE]] model of more than 400 billion parameters (requiring more than 300 GB of memory), only a high-end unified-memory workstation can host it — the Mac Studio M5 Ultra, configurable up to 512 GB (1.2 TB/s), from €6,599 incl. VAT in the 96 GB configuration, with the 512 GB configuration shipping in late October 2026 — and none exceeds 512 GB[^2].

Before 2025, the only solution was to rent a cloud server or buy a prohibitively expensive datacenter rack. Today, software architecture allows merging several affordable small machines: the **Desktop Cluster**.

---

## 🏗️ Hardware architecture

The idea is to create a compute "farm" sitting on a shelf.
*   **Nodes:** 4 to 8 compact machines. The standard in 2026 for this scenario is the **Mac mini M5 Pro** (64 GB unified memory, 307 GB/s, Thunderbolt 5, from €1,999 incl. VAT at 24 GB; it replaced the Mac mini M4 Pro on 2026-08-25) — or, pricier but faster, the Mac Studio M5 Max 64 GB (€3,659 incl. VAT) — and recent AMD Ryzen AI Max mini-PCs[^3].
*   **Network:** This is the heart of the system. To prevent data transfer from killing performance, machines are connected in a daisy chain or via a hub with **[[00-lexique/thunderbolt|Thunderbolt 4 or 5]]** cables, offering bidirectional throughput up to 80 Gb/s.
*   **Total capacity:** With 6 Mac Minis at 64 GB, you get a silent cluster with **384 GB aggregated unified memory**.

> [!note] The "one big machine" alternative
> Since August 2026, a Mac Studio M5 Ultra can be configured up to 512 GB (1.2 TB/s, 512 GB configuration shipping late October): a 671B in 4-bit fits on a single machine, with no Thunderbolt or pipeline parallelism. Beyond that, Apple documents RDMA clustering over Thunderbolt 5 directly in MLX (four Mac Studios "up to 3×" faster than one, Apple's measurement)[^2][^5]. On the CUDA side, NVIDIA documents pairing two DGX Sparks (64 or 128 GB) via their 200 Gbps ConnectX-7 port, at $4,999 (64 GB, OEMs from 2026-10-23) or ≈ $6,950 (128 GB) per unit[^6]. The Mac mini cluster remains the cheapest option per GB, but no longer the only one.

**Estimated budget (2026):** ~€10,000 to €15,000 (for a cluster of 4 to 6 machines). About 10 times cheaper than an equivalent NVIDIA DGX server in VRAM. 64 GB machines follow the DRAM increase (TrendForce: +10 to 15% per quarter in Q4 2026): prices captured in October 2026 must be re-checked at purchase time[^7].

---

## ⚙️ Software stack and mechanism

This hardware miracle is made possible by **MLX** distributed inference (`mlx.launch` with a hostfile, pipeline parallelism, RDMA over Thunderbolt 5 since macOS 26.2) — the **[[00-lexique/exo|Exo]]** orchestrator, which popularized the approach (covered in the [[03-stack-logicielle/clustering-exo-and-ray|AI Clustering]] chapter), has had no release since v1.0.71 in April 2026, supports only the MLX backend (Linux is CPU-only), and must be considered unmaintained in Q4 2026[^4][^5].

1.  The distributed runtime (MLX, or Exo) installs on all Mac Minis.
2.  They discover each other via the Thunderbolt network (IP-over-Thunderbolt on Thunderbolt 4; RDMA on Thunderbolt 5 under macOS 26.2).
3.  The massive LLM (e.g. DeepSeek V3 671B) is split into slices according to **[[00-lexique/pipeline-parallelism|Pipeline Parallelism]]**.
4.  Mac #1 computes the first 10 layers of the neural network, sends its raw result via Thunderbolt to Mac #2, which computes the next 10 layers, and so on.

### Expected performance
The gain is purely capacity-based: **you do not gain speed, you gain the right to run the model**.
Network latency, even over Thunderbolt, is infinitely slower than internal RAM speed. On a cluster of 8 Mac Minis running a 600B+ quantized model, available community benchmarks indicate generation speed on the order of **3 to 5 [[00-lexique/tokens-per-second|tokens/s]]**[^1]. On the model side, DeepSeek V4.1 Flash (September 2026) introduces an FP4 KV cache of about 890 bytes per token, which relieves precisely the memory and TTFT constraint of this scenario[^8].

---

## The latency trap (TTFT)

> [!warning] Latency before the first token
> The biggest problem with this architecture is not read throughput, but **[[00-lexique/ttft|TTFT]]** (Time To First Token).
> During the prompt reading phase (Prefill), a huge amount of data must transit between machines. If you send a 50-page document to analyze to your cluster, the network ping-pong between the 6 Mac Minis can take **several tens of seconds** before the first word of the response appears on screen.

---

## 📋 The architect's verdict

### ✅ When to use this blueprint?
*   **Frontier model prototyping:** For research or engineering teams that must absolutely test monumental LLMs (Grok, DeepSeek, Llama 400B) without data leaving the company.
*   **Background processing:** Perfect for asynchronous document analysis (where latency does not matter).
*   **Budget scalability:** You can start with 2 machines and add a 3rd the following year to increase your VRAM capacity.

### ❌ When to avoid this blueprint?
*   **For a real-time conversational RAG assistant.** Waiting 45 seconds for the first word after asking a question about a PDF will frustrate your users.
*   **To serve many concurrent collaborators.** Thunderbolt networking and Pipeline Parallelism handle massive concurrent requests very poorly. If you need to serve 50 users in real time on a giant model, you must switch to a real datacenter network (RoCE/InfiniBand) and multi-GPU servers — that is the subject of **[[04-blueprints/scenario-d-datacenter|🏭 Scenario D: Datacenter]]**.

---

## 📊 Recommended monitoring

On an Exo cluster, monitoring is more manual than in datacenter production, but a few commands cover the essentials.

**On each Mac node:**

```bash
# GPU load and unified memory (macOS)
sudo powermetrics --samplers gpu_power -i 1000 | grep -E "GPU|ANE"

# Thunderbolt network activity
nettop -m tcp -J bytes_in,bytes_out
```

**Via Ollama (if used as frontend):**

```bash
# Status of loaded models
curl http://localhost:11434/api/tags

# Generation metrics in logs
ollama logs
```

**Key indicators to watch:**

| Metric | Alert threshold | Tool |
| :-- | :-- | :-- |
| TTFT | > 30 s on short prompt | Exo logs |
| Tokens/s | < 2 tok/s | Exo logs |
| Unified memory per node | > 90 % | `vm_stat` / Activity Monitor |
| Thunderbolt bandwidth | > 70 Gb/s sustained | `nettop` |

> [!note] Advanced monitoring
> For centralized monitoring (Prometheus + Grafana), there is no official Ollama exporter as of October 2026; go through the gateway (LiteLLM) or vLLM metrics, or node-exporter for memory and network. See [[06-mise-en-oeuvre/monitoring-inference-stack|Monitoring]].

### Storage Wall — model reload time

> [!warning] SLA and restarts
> Restarting the Exo cluster (crash, update) requires reloading the model from SSD into each node's unified memory. For a 70B Q4 model (~40 GB per node) on a PCIe 3.0 SSD (~2.5 GB/s real):
>
> **Estimated reload time:** ~16 seconds per node, but if nodes reload sequentially, the cluster can remain unavailable for **30 to 60 seconds** before becoming operational.
>
> **Recommendation:** Prefer an NVMe PCIe 4.0 or 5.0 SSD to reduce this cold-start time. On a cluster of 3 Mac Studios, parallel reload over Thunderbolt 5 can bring this delay below 10 seconds.

---

## 📚 Sources and references

[^1]: Exo Labs, *Running DeepSeek V3 671B on M4 Mac Mini Cluster — 12 days of EXO, day 2* (8× Mac mini M4 Pro 64 GB, DeepSeek V3 4-bit, TTFT and tokens/s; undated page, December 2024 series), re-read on 2026-10-09. [https://blog.exolabs.net/day-2](https://blog.exolabs.net/day-2)
[^2]: Apple Newsroom, *Apple introduces new Mac Studio with M5 Max and M5 Ultra* (M5 Ultra up to 512 GB unified memory, 1.2 TB/s, 512 GB configuration available late October 2026), 2026-08-25. [https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/) · Apple Store France, *Mac Studio* (M5 Ultra 96 GB from €6,599 incl. VAT), captured 2026-10-09. [https://www.apple.com/fr/shop/buy-mac/mac-studio](https://www.apple.com/fr/shop/buy-mac/mac-studio)
[^3]: Apple Newsroom, *Apple unveils a more powerful Mac mini featuring the all-new M6 and M5 Pro* (Mac mini M5 Pro: up to 64 GB, 307 GB/s, Thunderbolt 5), August 2026. [https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/](https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/) · Apple Store France, *Mac mini* (M5 Pro 24 GB €1,999 incl. VAT) and *Mac Studio* (M5 Max 64 GB €3,659 incl. VAT), captured 2026-10-09. [https://www.apple.com/fr/shop/buy-mac/mac-mini](https://www.apple.com/fr/shop/buy-mac/mac-mini)
[^4]: Exo Labs, *exo — Releases* (latest version v1.0.71 of 2026-04-23), consulted 2026-10-09. [https://github.com/exo-explore/exo/releases](https://github.com/exo-explore/exo/releases) · Exo Labs, *GitHub - exo-explore/exo* (README: MLX backend only, Linux CPU-only, RDMA Thunderbolt 5 + macOS 26.2), re-read on 2026-10-09. [https://github.com/exo-explore/exo](https://github.com/exo-explore/exo)
[^5]: Apple MLX, *Distributed Communication* (`mlx.launch` and hostfile, JACCL backends — RDMA over Thunderbolt since macOS 26.2, Thunderbolt 5 — and ring), consulted 2026-10-10. [https://ml-explore.github.io/mlx/build/html/usage/distributed.html](https://ml-explore.github.io/mlx/build/html/usage/distributed.html)
[^6]: NVIDIA, *DGX Spark* — product page (GB10, ConnectX-7 200 Gbps, multi-system cluster, 64 GB variant from OEMs), re-read on 2026-10-09. [https://www.nvidia.com/en-us/products/workstations/dgx-spark/](https://www.nvidia.com/en-us/products/workstations/dgx-spark/) · ServeTheHome, *NVIDIA DGX Spark 64GB Launched and Big 128GB GB10 Price Increases* (128 GB ≈ $6,950, 64 GB $4,999 OEM from 2026-10-23), 2026-10-03. [https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/](https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/)
[^7]: TrendForce, press release of 30 September 2026 (contract DRAM prices up 10–15% in Q4 2026). [https://www.trendforce.com/presscenter/news/20260930-13258.html](https://www.trendforce.com/presscenter/news/20260930-13258.html)
[^8]: DeepSeek AI, *DeepSeek-V4.1-Flash* (MIT, 8–16B active, FP4 KV cache 890 bytes/token), September 2026. [https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
