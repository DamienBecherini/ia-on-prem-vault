---
title: "🏢 Scenario B: SME Appliance (Unified Memory)"
description: The ideal blueprint for SMEs. How to serve a team of 10 to 50 people with a 70B model using a Mac Studio or AMD APU.
sidebar:
  order: 2
last_modified: "2026-06-10"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Your client (a law firm, medical practice, SME) needs a local assistant capable of processing confidential documents. The chosen model is a heavy LLM (70B quantized class, ~40 GB of weights).

As seen in [[04-blueprints/scenario-a-dev-lab|Scenario A]], a standard PC collapses due to [[00-lexique/offloading|CPU Offloading]]. Buying a multi-GPU server is very expensive, sounds like a jet taking off, and consumes a lot of electricity. The most elegant solution in 2026 is the **Unified Memory Appliance**.

---

## 🏗️ Hardware architecture

The goal is to have a single chip (SoC) where the CPU and GPU draw from the same large memory reserve.
Two choices are available:

*   **Apple option (The silent standard):** A Mac Studio M4 Max (128 GB) or M3 Ultra (192 GB).
*   **x86 PC option (Docker sovereignty):** A workstation based on the AMD Ryzen AI Max PRO 400 APU ("Gorgon Halo") with 192 GB RAM.

**Estimated budget (2026):** Between €3,700 and €7,500 (depending on chip and soldered memory quantity).
**Physical advantages:** Very low power consumption (often under 150W at full load), compact form factor, no excessive fan noise.

---

## ⚙️ Software stack

Here, the software stack differs depending on hardware chosen:

*   **On Mac Studio:** The reference engine is **llama.cpp** (or its native server derivative **MLX Server** optimized by Apple). It exploits maximum bandwidth via the Metal graphics API.
*   **On AMD Gorgon Halo (Linux):** You can use **vLLM** via AMD's ROCm software layer, enabling server optimizations like *Continuous Batching*.

### Expected performance
Since the 40 GB model fits entirely in [[00-lexique/unified-memory|unified memory]] (which here acts as a huge [[00-lexique/vram|VRAM]]), generation speeds are excellent and stable:
*   **Mac Studio (M4 Max, ~546 GB/s):** Between 10 and 15 [[00-lexique/tokens-per-second|tokens/s]] during [[00-lexique/decoding|Decoding]][^1] — consistent with the theoretical bound of ~13.6 t/s calculated in [[01-fondations/memory-bandwidth|the memory bandwidth chapter]].
*   **AMD Ryzen AI Max PRO 400 (~273 GB/s):** On the order of 5 to 7 tokens/s according to available benchmarks[^2] — also consistent with the formula (theoretical bound ~6.8 t/s).

---

## The concurrent KV Cache trap

> [!warning] Concurrent KV Cache
> If 40 GB of model fits easily in 128 GB of memory, why not settle for a 64 GB machine?
>
> The answer is the **[[01-fondations/kv-cache-and-context|KV Cache]]**. In this scenario, you serve an **entire SME**.
> If 5 employees simultaneously send 100-page PDF documents to the assistant (RAG), the inference engine must store each user's context *at the same time*.
> On a 70B model, the KV Cache for 5 long requests can easily consume **30 to 50 GB of additional dynamic memory** in an instant. If you exceed total physical RAM (model + OS + requests), the machine will crash instantly (OOM error — *Out Of Memory*).

---

## 📋 The architect's verdict

### ✅ When to use this blueprint?
*   This is the **core target** of on-premise AI for SMEs.
*   Perfect for an "under the desk" deployment or in a small non-air-conditioned network rack.
*   Excellent for running a sovereign local assistant or agent serving a dozen moderate concurrent requests.

### ❌ When to avoid this blueprint?
*   **If your client has unpredictable growth needs.** Unified memory is **soldered** to the motherboard. It is impossible to add RAM to a Mac Studio or Gorgon Halo APU after purchase. If the company's business model moves from 70B to 200B the following year, you will have to discard the machine and buy a new one.

To overcome this fixed capacity constraint while staying on affordable desktop hardware, the next blueprint proposes an scalable approach: **[[04-blueprints/scenario-c-desktop-cluster|The Desktop Cluster]]** — connecting several machines via Thunderbolt.

---

## 🛡️ Backup and recovery (DRP)

> [!warning] Unified memory is soldered — data is not
> In case of hardware failure on a Mac Studio or Gorgon Halo APU, replacement takes several days. Backing up application data allows resuming service on a loaner machine or temporary cloud in under an hour.

### What to back up on Blueprint B

| Data | Typical location | Frequency |
| :-- | :-- | :-- |
| Vector database (Qdrant / Chroma) | `/qdrant/storage/` or Docker volume | Daily — API snapshot |
| Conversation histories (SQLite) | `~/.open-webui/data/` or Docker volume | Daily or hourly |
| Ollama / vLLM configuration | `~/.ollama/` or `config.yaml` | On every change (Git) |
| Fine-tuned LoRA adapters | Dedicated directory | After each training session |
| Base models (GGUF) | `~/.ollama/models/` | Low priority — re-downloadable |

### Minimal recovery procedure

1. Start a temporary instance (another Mac, sovereign cloud VM) with Ollama
2. Restore the vector database from the latest snapshot
3. Restore the SQLite history
4. Point clients (Open WebUI, LiteLLM) to the new IP

**Indicative RTO for Blueprint B: < 45 minutes** with an up-to-date daily backup.

---

## 📚 Sources and references

[^1]: llmhardware.io, *Mac Studio M4 Max / M3 Ultra for LLMs* (Llama 3 70B Q4_K_M performance with MLX and maximum Metal memory allocation), 2025-2026. [https://llmhardware.io/guides/mac-studio-m4-max-llm-guide](https://llmhardware.io/guides/mac-studio-m4-max-llm-guide)
[^2]: ServeTheHome & ignasivt (GitHub), *Strix Halo / Gorgon Halo 192GB Unified Memory Benchmarks* (Expected decoding throughput on dense 70B model), May 2026. [https://www.servethehome.com/amd-reveals-ryzen-ai-max-pro-400-series-192gb-ram-for-ai-systems/](https://www.servethehome.com/amd-reveals-ryzen-ai-max-pro-400-series-192gb-ram-for-ai-systems/) · [https://github.com/ignasivt/strix-halo-guide](https://github.com/ignasivt/strix-halo-guide)
