---
title: "🏭 Scenario D: Datacenter (RoCE & Multi-GPU)"
description: The Enterprise AI blueprint. HGX 8-GPU nodes, RoCE/InfiniBand network, and Tensor Parallelism for very high-concurrency production.
sidebar:
  order: 4
last_modified: "2026-06-04"
---

Your client is a large enterprise, a sovereign cloud host, or a public institution. The requirements are uncompromising: host a 70B-class model or a 400B+ giant, and above all, **serve dozens or even hundreds of users at the same time** with instant response time.

[[04-blueprints/scenario-b-sme-appliance|Scenario B]] (the Appliance) would choke under concurrent load, and [[04-blueprints/scenario-c-desktop-cluster|Scenario C]] (Exo Cluster) has a TTFT that is far too slow. For massive production, there is no secret: you must switch to the standard AI datacenter architecture.

---

## 🏗️ Hardware Architecture

Here, the basic unit is no longer the graphics card, but the **Server Node** and the **Fabric Network**.

*   **The Node (Scale-Up):** A rack-format server (e.g. NVIDIA HGX architecture) containing **8 datacenter-class GPUs** (NVIDIA H200 or B200). Unlike a classic PC, these 8 chips do not communicate over PCIe, but via **[[00-lexique/nvlink|NVLink]]** and **[[00-lexique/nvswitch|NVSwitch]]**. This bus lets chips exchange data at **1,800 GB/s** (on Blackwell)[^1].
*   **The Network (Scale-Out):** To connect several nodes together, very high-throughput network cards (400 Gbps or 800 Gbps) compatible with **[[00-lexique/rdma|RDMA]]** are used. The standard is **InfiniBand** or **[[00-lexique/roce|RoCEv2]]** (RDMA over Converged Ethernet)[^2].
*   **Storage:** Distributed NVMe flash storage accessible via *GPUDirect Storage*, to load terabytes of model weights in seconds at startup.

**Estimated budget (2026):** From €300,000 to over €1 million per node, excluding network infrastructure, energy, and cooling costs.

---

## ⚙️ Software Stack and Mechanism

This hardware extravagance demands inference engines that can exploit it to the millisecond: **[[00-lexique/pagedattention|vLLM]]** or the official **[[00-lexique/tensorrt-llm|TensorRT-LLM]]** SDK behind a Triton server. Multi-node orchestration is handled by **[[00-lexique/ray|Ray]]**.

### The Magic of Tensor Parallelism
On the Mac Cluster (Scenario C), we saw *Pipeline Parallelism* (layer-by-layer splitting), which increases latency.
In an HGX node, the incredible speed of NVLink enables **[[00-lexique/tensor-parallelism|Tensor Parallelism]]** (TP). A single mathematical operation (a matrix) is split and computed *at the same time* by the 8 GPUs.
*   **Result:** The 8 cards act as one giant GPU. Generation latency collapses, and [[00-lexique/tokens-per-second|tokens/s]] explode, even on a massive model.

### Extreme Formats (FP4)
If you deploy NVIDIA Blackwell (B200) chips, the software will natively use **FP4** or **FP8** quantization. This lets gigantic models fit in a single 8-GPU node, avoiding having to cross the RoCE network for every computation[^3].

---

## The Network Engineering Trap (The RoCE drama)

> [!warning] RoCE is not plug-and-play
> Many companies buy GPU servers, then plug everything into their standard Ethernet network hoping RDMA will work on its own.
> This is the biggest trap of this blueprint: **RoCE is not plug-and-play**. It requires a so-called "Lossless" network. If your network switches are not rigorously configured with strict congestion control protocols ([[00-lexique/pfc|PFC]], [[00-lexique/ecn|ECN]]), AI-related data packets will saturate the cables, causing retransmissions.
> **Network latency going from 2 microseconds to 5 milliseconds is enough to divide your AI cluster speed by ten**[^2].

---

## 📋 The Architect's Verdict

### ✅ When to use this Blueprint?
*   **Production at scale:** This is the only viable architecture for serving real sovereign SaaS applications (like an internal enterprise ChatGPT for 1,000 employees).
*   **Need for guarantees (SLA):** When [[00-lexique/ttft|TTFT]] must always stay below 500 ms, regardless of the number of connected users.

### ❌ When to avoid this Blueprint?
*   **If you do not have a dedicated network engineer.** Operating a RoCE/InfiniBand fabric and a Ray cluster requires very specialized administration skills, often from the High Performance Computing (HPC) world.
*   **Datacenter constraints:** These machines are giant radiators. A standard rack often cannot cool such a node without heavy upgrades (Direct Liquid Cooling).

---

## 📊 Recommended Monitoring

Scenario D is the only blueprint that justifies tooling monitoring in production. Minimum elements:

**GPU and VRAM (per node):**

```bash
# Real-time monitoring of all GPUs
watch -n 1 nvidia-smi

# CSV format for Prometheus export
nvidia-smi --query-gpu=timestamp,name,utilization.gpu,utilization.memory,\
memory.used,memory.free,temperature.gpu,power.draw \
--format=csv -l 5
```

**vLLM — native Prometheus metrics:**

vLLM exposes a `/metrics` endpoint compatible with Prometheus. Key metrics:

| vLLM metric | Description |
| :-- | :-- |
| `vllm:prompt_tokens_total` | Prompt tokens processed |
| `vllm:generation_tokens_total` | Tokens generated |
| `vllm:request_success_total` | Completed requests |
| `vllm:avg_generation_throughput_toks_per_s` | Average generation throughput |
| `vllm:gpu_cache_usage_perc` | KV Cache occupancy rate |
| `vllm:num_requests_running` | Requests in progress (continuous batching) |

```bash
# Check metrics endpoint
curl http://localhost:8000/metrics | grep vllm
```

**Recommended stack:**

```
nvidia-smi (GPU) ──► node-exporter ──► Prometheus ──► Grafana
vLLM /metrics ──────────────────────────────────────► Grafana
```

Grafana dashboards for vLLM are available at [grafana.com/grafana/dashboards](https://grafana.com/grafana/dashboards) (search for "vLLM").

**Network (RoCE/InfiniBand):**

```bash
# RDMA counters (errors, retransmissions)
rdma statistic show

# Packet loss on RoCE interface
ethtool -S <interface> | grep -E "rx_discards|tx_discards"
```

> [!warning] Monitor RoCE congestion
> An increase in RDMA retransmissions is the first signal of misconfigured PFC/ECN. Monitor actively — undetected network degradation can divide cluster throughput by ten without a visible application error.

### Storage Wall — SSD→VRAM boot time (MTTR impact)

The "Memory Wall" covers steady-state performance. The "Storage Wall" covers **restarts**: each vLLM restart requires reloading model weights from SSD to VRAM.

| Model | BF16 size | PCIe 3.0 SSD (3 GB/s) | PCIe 5.0 NVMe SSD (10 GB/s) | GPUDirect Storage |
| :-- | :-- | :-- | :-- | :-- |
| 70B | ~140 GB | **~47 seconds** | ~14 seconds | ~8 seconds |
| 405B | ~810 GB | **~4.5 minutes** | ~81 seconds | ~45 seconds |

For a datacenter SLA with an MTTR (Mean Time To Recovery) target under 2 minutes, a 405B in BF16 on a PCIe 3.0 SSD is **incompatible with that objective**. Solutions:

- **PCIe 5.0 NVMe in RAID 0:** doubles sequential throughput (~20 GB/s real), MTTR < 45 seconds on a 405B
- **GPUDirect Storage** (NVIDIA Magnum IO): direct SSD→VRAM transfer without CPU copy, reduces system load and improves throughput[^4]
- **Quantized model:** a 405B in Q4 (~230 GB) reduces load time by ~65% vs BF16

> [!note] Link with enterprise SLAs
> For critical deployments (AI in production in business workflows), reload time must be documented in service level agreements. Plan a scheduled restart process (rolling restart with double instance) for updates without downtime.

---

## 📚 Sources and References

[^1]: NVIDIA Technical Blog, *NVIDIA NVLink and NVIDIA NVSwitch Supercharge Large Language Model Inference* (HGX architecture, Blackwell NVLink 1.8 TB/s), 2024-2026.
[^2]: NVIDIA, *RDMA over Converged Ethernet - RoCE | Cumulus Linux* (Critical importance of PFC/ECN to avoid LLM performance collapse), 2026.
[^3]: NVIDIA, *Optimizing Inference for Long Context and Large Batch Sizes with NVFP4 KV Cache* (Blackwell, native TensorRT-LLM), December 2025.
[^4]: NVIDIA, *GPUDirect Storage Overview* (direct NVMe→VRAM transfer, no CPU copy, Magnum IO). [https://developer.nvidia.com/gpudirect-storage](https://developer.nvidia.com/gpudirect-storage)
