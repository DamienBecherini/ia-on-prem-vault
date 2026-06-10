---
title: "🖥️ Scenario C: Desktop Cluster (Exo & Thunderbolt)"
description: The scalability blueprint. Connect several Mac Minis or compact PCs via Thunderbolt to run massive models inaccessible on a single machine.
sidebar:
  order: 3
last_modified: "2026-06-10"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

[[04-blueprints/scenario-b-sme-appliance|Scenario B]] (the Appliance) has a major flaw: its memory is fixed. If your client's needs evolve and they want to deploy a colossal [[00-lexique/moe|MoE]] model of more than 400 billion parameters (requiring more than 300 GB of memory), no single desktop machine in the world can host it.

Before 2025, the only solution was to rent a cloud server or buy a prohibitively expensive datacenter rack. Today, software architecture allows merging several affordable small machines: the **Desktop Cluster**.

---

## 🏗️ Hardware architecture

The idea is to create a compute "farm" sitting on a shelf.
*   **Nodes:** 4 to 8 compact machines. The absolute standard in 2026 for this scenario is the **Mac Mini M4 Pro** (each equipped with 64 GB unified RAM) or recent AMD Ryzen mini-PCs.
*   **Network:** This is the heart of the system. To prevent data transfer from killing performance, machines are connected in a daisy chain or via a hub with **[[00-lexique/thunderbolt|Thunderbolt 4 or 5]]** cables, offering bidirectional throughput up to 80 Gb/s.
*   **Total capacity:** With 6 Mac Minis at 64 GB, you get a silent cluster with **384 GB aggregated unified memory**.

**Estimated budget (2026):** ~€10,000 to €15,000 (for a cluster of 4 to 6 machines). About 10 times cheaper than an equivalent NVIDIA DGX server in VRAM.

---

## ⚙️ Software stack and mechanism

This hardware miracle is made possible by the local orchestrator **[[00-lexique/exo|Exo]]** (covered in the [[03-stack-logicielle/clustering-exo-and-ray|AI Clustering]] chapter).

1.  The Exo engine installs on all Mac Minis.
2.  They automatically discover each other via the Thunderbolt network (which simulates an ultra-fast local IP-over-Thunderbolt connection).
3.  The massive LLM (e.g. DeepSeek V3 671B) is split into slices according to **[[00-lexique/pipeline-parallelism|Pipeline Parallelism]]**.
4.  Mac #1 computes the first 10 layers of the neural network, sends its raw result via Thunderbolt to Mac #2, which computes the next 10 layers, and so on.

### Expected performance
The gain is purely capacity-based: **you do not gain speed, you gain the right to run the model**.
Network latency, even over Thunderbolt, is infinitely slower than internal RAM speed. On a cluster of 8 Mac Minis running a 600B+ quantized model, available community benchmarks indicate generation speed on the order of **3 to 5 [[00-lexique/tokens-per-second|tokens/s]]**[^1].

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
> For centralized monitoring (Prometheus + Grafana), the community project [ollama-exporter](https://github.com/marcboeker/go-ollama) exposes compatible metrics. Unofficial — validate before production use.

### Storage Wall — model reload time

> [!warning] SLA and restarts
> Restarting the Exo cluster (crash, update) requires reloading the model from SSD into each node's unified memory. For a 70B Q4 model (~40 GB per node) on a PCIe 3.0 SSD (~2.5 GB/s real):
>
> **Estimated reload time:** ~16 seconds per node, but if nodes reload sequentially, the cluster can remain unavailable for **30 to 60 seconds** before becoming operational.
>
> **Recommendation:** Prefer an NVMe PCIe 4.0 or 5.0 SSD to reduce this cold-start time. On a cluster of 3 Mac Studios, parallel reload over Thunderbolt 5 can bring this delay below 10 seconds.

---

## 📚 Sources and references

[^1]: Exo Labs, *Running DeepSeek V3 671B on M4 Mac Mini Cluster* (Performance via Thunderbolt 5 and Exo, Pipeline Parallelism constraints, 3–5 tok/s), March 2026. [https://blog.exolabs.net/day-2](https://blog.exolabs.net/day-2)
