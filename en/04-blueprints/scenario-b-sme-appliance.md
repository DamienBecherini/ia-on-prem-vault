---
title: "🏢 Scenario B: The SME Appliance (Unified Memory)"
description: The ideal blueprint for SMEs. How to serve a team of 10 to 50 people with a 70B model using a Mac Studio or an AMD APU.
sidebar:
  order: 2
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Your client (a law firm, a medical practice, an SME) needs a local assistant capable of processing confidential documents. The chosen model is a heavy LLM (70B quantized class, ~40 GB of weights).

As seen in [[04-blueprints/scenario-a-dev-lab|Scenario A]], a classic PC collapses because of [[00-lexique/offloading|CPU Offloading]]. Buying a multi-GPU server is very expensive, sounds like an airplane at takeoff, and consumes a huge amount of electricity. The most elegant solution in 2026 is the **Unified Memory Appliance**.

---

## 🏗️ Hardware Architecture

The goal is to have a single chip (SoC) where the CPU and GPU draw from the same large memory reserve.
Two choices are available:

*   **Apple option (The silence standard):** A Mac Studio M4 Max (128 GB) or M3 Ultra (192 GB).
*   **x86 PC option (Docker sovereignty):** A workstation based on the AMD Ryzen AI Max PRO 400 APU ("Gorgon Halo") with 192 GB RAM.

**Estimated budget (2026):** Between €3,700 and €7,500 (depending on chip and soldered memory quantity).
**Physical advantages:** Very low power consumption (often under 150W at full load), compact form factor, no excessive fan noise.

---

## ⚙️ Software Stack

Here, the software stack differs depending on the hardware chosen:

*   **On Mac Studio:** The reference engine is **llama.cpp** (or its native server derivative **MLX Server** optimized by Apple). It exploits maximum bandwidth via the Metal graphics API.
*   **On AMD Gorgon Halo (Linux):** You can use **vLLM** via AMD's ROCm software layer, which enables server optimizations such as *Continuous Batching*.

### Expected Performance
Since the 40 GB model fits entirely in [[00-lexique/unified-memory|unified memory]] (which here acts as a huge [[00-lexique/vram|VRAM]]), generation speeds are excellent and stable:
*   **Mac Studio (M4 Max, ~546 GB/s):** Between 10 and 15 [[00-lexique/tokens-per-second|tokens/s]] during [[00-lexique/decoding|Decoding]][^1] — consistent with the theoretical bound of ~13.6 t/s calculated in [[01-fondations/memory-bandwidth|the memory bandwidth chapter]].
*   **AMD Ryzen AI Max PRO 400 (~273 GB/s):** On the order of 5 to 7 tokens/s according to available benchmarks[^2] — also consistent with the formula (theoretical bound ~6.8 t/s).

---

## The Concurrent KV Cache Trap

> [!warning] Concurrent KV Cache
> If 40 GB of model fits comfortably in 128 GB of memory, why not settle for a 64 GB machine?
>
> The answer is the **[[01-fondations/kv-cache-and-context|KV Cache]]**. In this scenario, you are serving an **entire SME**.
> If 5 employees simultaneously send 100-page PDF documents to the assistant (RAG), the inference engine must store each user's context *at the same time*.
> On a 70B model, the KV Cache for 5 long requests can easily swallow **30 to 50 GB of additional dynamic memory** in an instant. If you exceed total physical RAM (model + OS + requests), the machine will crash instantly (OOM error — *Out Of Memory*).

---

## 📋 The Architect's Verdict

### ✅ When to use this Blueprint?
*   This is the **core target** of on-premise AI for SMEs.
*   Perfect for an "under the desk" deployment or in a small non-air-conditioned wiring closet.
*   Excellent for running a sovereign local assistant or agent serving about ten moderate concurrent requests.

### ❌ When to avoid this Blueprint?
*   **If your client has unpredictable growth needs.** Unified memory is **soldered** to the motherboard. It is impossible to add RAM to a Mac Studio or Gorgon Halo APU after purchase. If the company's business model moves from 70B to 200B the following year, you will have to discard the machine and buy a new one.

To overcome this fixed capacity constraint while staying on affordable desktop hardware, the next blueprint proposes an evolutionary approach: **[[04-blueprints/scenario-c-desktop-cluster|The Desktop Cluster]]** — connecting several machines via Thunderbolt.

---

## 📚 Sources and References

[^1]: llmhardware.io, *Mac Studio M4 Max / M3 Ultra for LLMs* (Llama 3 70B Q4_K_M performance with MLX and maximum Metal memory allocation), 2025-2026.
[^2]: ServeTheHome & ignasivt (GitHub), *Strix Halo / Gorgon Halo 192GB Unified Memory Benchmarks* (Expected decoding throughput on dense 70B model), May 2026.
