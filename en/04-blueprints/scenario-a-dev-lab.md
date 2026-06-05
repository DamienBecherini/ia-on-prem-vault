---
title: "🛠️ Scenario A: The Dev Lab (GPU PC or unified memory)"
description: The blueprint for getting started with local AI at low cost. RTX PC with CPU offloading, or laptop/station with unified memory for better solo comfort.
sidebar:
  order: 1
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

You are a solo developer, a hobbyist (*homelab*), or a small business that wants to test autonomous agents without immediately investing €5,000 to €10,000 in a dedicated AI machine.

This first blueprint covers two realities of the solo AI lab:

1. **Option A1 — Standard PC with 24 GB GPU:** excellent for 8B–14B models, but penalized by **[[00-lexique/offloading|CPU Offloading]]** as soon as a model exceeds VRAM.
2. **Option A2 — Laptop or station with 64–128 GB unified memory:** often the best comfort for a solo AI developer in 2026, because large quantized models can fit in a single memory pool without constant PCIe round-trips.

---

## 🏗️ Hardware Architecture

### Option A1 — Standard PC with 24 GB GPU

*   **Machine:** A standard desktop tower.
*   **Processor (CPU):** A modern processor (AMD Ryzen 9 or Intel Core i9).
*   **System Memory ([[00-lexique/ram|RAM]]):** 64 GB DDR5 RAM (very important — DDR4 would completely choke performance).
*   **Graphics Card (GPU):** A single consumer NVIDIA card with 24 GB of [[00-lexique/vram|VRAM]] (e.g. a used RTX 3090, an RTX 4090, or the RTX 5090).

**Estimated budget (2026):** Between €1,500 and €3,500 (depending on GPU choice).

### Option A2 — Laptop / station with 64–128 GB unified memory

*   **Machine:** MacBook Pro Max, entry-level Mac Studio, or a mini-station APU with large unified memory.
*   **Memory:** 64 to 128 GB of [[00-lexique/unified-memory|unified memory]].
*   **Engine:** MLX / llama.cpp / Ollama depending on platform.
*   **Ideal use case:** solo developer who wants to test quantized 30B–70B models with interactive comfort superior to DDR5 CPU offloading.

**Estimated budget (2026):** often between €3,000 and €6,000 depending on configuration. More expensive than a used gaming PC, but much more coherent if your goal is to regularly work with large models locally.

---

## ⚙️ Software Stack

*   **Inference engine:** **Ollama** or **llama.cpp** compiled with CUDA support.
*   **Model format:** [[00-lexique/gguf|GGUF]] in [[00-lexique/quantification-q4|Q4_K_M Quantization]].

On this machine, a model in the **8B to 14B** class (e.g. *Llama 3.1 8B* or *Qwen 2.5 14B*) will fit entirely in the graphics card's 24 GB VRAM. You will get high performance — typically **50 to 100 [[00-lexique/tokens-per-second|tokens/s]]** depending on the model, quantization, and engine used.

But what happens if you want to test a heavy, GPT-4-class intelligent model, like **Llama 3.1 70B**?

---

## 🧠 The Mechanism: CPU Offloading

A 70B model quantized in Q4 weighs about **40 GB**. It is physically impossible to fit it on a 24 GB card. This is where **CPU Offloading** (offloading to the processor) comes in.

Rather than giving up with an *Out Of Memory (OOM)* error, the `llama.cpp` engine splits the model:

1.  It loads as many layers of the neural network as possible into the GPU's ultra-fast **VRAM** (about 20 to 22 GB to leave margin for context).
2.  It places the remaining layers (about 18 to 20 GB) in your motherboard's **system RAM**.

### ⚠️ The Performance Wall
During response generation ([[00-lexique/decoding|Decoding]]), data must constantly travel back and forth between RAM, the processor, and the graphics card over the PCIe bus.

As explained in the chapter on [[01-fondations/unified-memory-vs-ram-vs-vram|VRAM vs RAM]], classic RAM is physically capped at about 80–100 GB/s. The result is immediate: generation speed collapses.
On an RTX 4090 paired with 64 GB DDR5, a 70B model in CPU Offloading will generally produce **between 2 and 5 tokens per second**[^1][^2] — an order of magnitude consistent with the analysis in [[01-fondations/memory-bandwidth|the memory bandwidth chapter]]: DDR5 ≈ 100 GB/s for a ~40 GB model gives a theoretical bound of ~2.5 t/s. It is readable (slightly below human reading speed), but unsuitable for serving a reactive application or multiple simultaneous users.

### Why the unified memory option changes the experience

On a [[00-lexique/unified-memory|unified memory]] machine, model weights are not split between fast VRAM and slow RAM linked by PCIe. CPU, GPU, and accelerators share the same memory pool. Bandwidth remains lower than a high-end large NVIDIA card, but it avoids the worst trap of the classic PC: constant round-trips between DDR5 RAM and VRAM.

For a solo developer, this often makes the difference between *"I can test a quantized 70B and reason calmly"* and *"I watch tokens arrive one by one"*.

---

## 📋 The Architect's Verdict

### ✅ When to use this Blueprint?
*   To **learn** and prototype applications (RAG, Agents) on small models (8B/14B) that fit 100% in VRAM.
*   To run **background tasks** (batch processing, overnight summarization of long documents) with a 70B model, where the user is not waiting for the answer live on screen.
*   For a solo developer with a 64–128 GB unified memory machine who wants to test larger models without building a server appliance.

### ❌ When to avoid this Blueprint?
*   If you need to deploy an internal API for **more than 2 simultaneous collaborators**. CPU Offloading handles concurrency very poorly: beyond one request at a time, response time collapses.
*   If employee user comfort is an absolute priority.

For everyday SME use with 70B models without suffering this heavy transfer penalty, you need to change the hardware paradigm and move from a solo workstation to a service machine. That is the subject of the next blueprint: **The Unified Appliance** (Unified Memory APU/Mac).

---

## 📚 Sources and References

[^1]: Particula Tech & Reddit Community Benchmarks (r/LocalLLaMA), *Hybrid Inference Llama 3 70B on RTX 4090 24GB + 64GB RAM* (Decoding speed estimated at ~2-5 tokens/s depending on DDR5 configuration), 2024-2026.
[^2]: Documentation locale Ollama, *Ollama System Requirements 2026: CPU-only and Partial GPU Offloading penalties* (5x to 10x performance drop during RAM offloading), 2026.
