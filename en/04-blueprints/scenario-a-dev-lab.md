---
title: "🛠️ Scenario A: Dev Lab (GPU PC or unified memory)"
description: Blueprint to get started with local AI at low cost. RTX PC with CPU offloading, or laptop/station with unified memory for better solo comfort.
sidebar:
  order: 1
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

You are a solo developer, a hobbyist (*homelab*), or a very small business that wants to test autonomous agents without immediately investing €5,000 to €10,000 in a dedicated AI machine.

This first blueprint covers two solo AI lab realities:

1. **Option A1 — Standard PC with 24 GB GPU:** excellent for 8B–14B models, but penalized by **[[00-lexique/offloading|CPU Offloading]]** as soon as a model exceeds VRAM.
2. **Option A2 — Laptop or station with 64–128 GB unified memory:** often the best comfort for a solo AI developer in 2026, because large quantized models can fit in a single memory pool without constant PCIe round-trips.

---

## 🏗️ Hardware architecture

### Option A1 — Standard PC with 24 GB GPU

*   **Machine:** A standard tower PC.
*   **Processor (CPU):** A modern processor (AMD Ryzen 9 or Intel Core i9).
*   **System memory ([[00-lexique/ram|RAM]]):** 64 GB DDR5 RAM (essential for offloading — DDR4 would completely throttle performance; buy early: DRAM prices have risen every quarter since early 2026 and a shortage is expected for 2027)[^4].
*   **Graphics card (GPU):** A single consumer NVIDIA card with 24 GB [[00-lexique/vram|VRAM]] or more (e.g. a used RTX 3090 or 4090; the 32 GB RTX 5090, unobtainable at MSRP and selling for $5,000 and up since September 2026, falls outside a lab's budget — new 24 GB+ GeForce supply is scarce in Q4 2026)[^3].

**Estimated budget (Q4 2026):** between €1,500 and €2,500 with a used RTX 3090/4090; above €6,000 with a new RTX 5090 at observed prices — plus DDR5 modules whose price rises every quarter (TrendForce: +10 to 15% per quarter on DRAM in Q4 2026)[^3][^4]. The 64 GB of DDR5 and the used 24 GB GPU are the two moving line items: buy them early.

### Option A2 — Laptop / station with 64–128 GB unified memory

*   **Machine:** MacBook Pro Max, entry-level Mac Studio, or mini-station APU with large unified memory. Named options in Q4 2026: Mac mini M5 Pro 64 GB (307 GB/s, Thunderbolt 5) at the entry level, Mac Studio M5 Max 64 GB (460 to 614 GB/s depending on GPU, €3,659 incl. VAT), Framework Desktop 64 GB (€2,209 incl. VAT, often out of stock), or DGX Spark 64 GB ($4,999 from OEMs starting 2026-10-23, native CUDA)[^8][^9][^10].
*   **Memory:** 64 to 128 GB [[00-lexique/unified-memory|unified memory]].
*   **Engine:** MLX (Ollama ≥ 0.40's default engine on Apple Silicon; experimental Splash alternative for Qwen3.8) / llama.cpp (default port 9931 since October 2026) / Ollama depending on platform[^11].
*   **Ideal case:** solo developer who wants to test 30B–70B quantized models with better interactive comfort than DDR5 CPU offloading.

**Estimated budget (Q4 2026):** between €2,200 (Framework Desktop 64 GB, often out of stock) and €3,700 (Mac Studio M5 Max 64 GB, €3,659 incl. VAT) for 64 GB; from €3,900 to €7,000 for 128 GB (Framework 128 GB, Mac Studio M5 Max 128 GB, DGX Spark 128 GB)[^8][^9][^10]. More expensive than a used gaming PC, but much more coherent if your goal is to regularly work with large local models. Soldered memory follows the DRAM increase: prices captured in October 2026 must be re-checked at purchase time[^4].

---

## ⚙️ Software stack

*   **Inference engine:** **Ollama** or **llama.cpp** compiled with CUDA support.
*   **Model format:** [[00-lexique/gguf|GGUF]] in [[00-lexique/quantification-q4|Q4_K_M quantization]].

On this machine, an **8B to 30B** class model (e.g. *Qwen3.8-27B* ≈ 18 GB in Q4, *Granite 4.2 8B*, or a light MoE such as *Nemotron 3.5 Lightning 30B-A3B* ≈ 22 GB in NVFP4) will fit entirely in the graphics card's 24 GB VRAM[^5][^6]. Qwen3.8-27B (Apache 2.0, 262k context, vision and tools) has been the reference 24 GB model since August 2026; Meta publishes *Muse Glimmer 30B* (Apache 2.0) with explicit VRAM tiers — 64 GB at full precision, 32 GB and 24 GB in K-Quant[^7]. You will get high performance — typically **50 to 100 [[00-lexique/tokens-per-second|tokens/s]]** for an 8B–14B, 30 to 60 t/s for a 27B Q4 — more with speculative decoding (Meta announces ≈ 230 t/s on RTX 5090 for Muse Glimmer 30B with DFlash, vendor figure)[^7].

But what happens if you want to test a heavy 70B dense model (**Llama 3.3 70B**, still very widespread) or a 120B MoE such as **gpt-oss-120b**[^12]?

---

## 🧠 The mechanism: CPU Offloading

A 70B model quantized in Q4 weighs about **40 GB**. It is physically impossible to fit it into a 24 GB card. This is where **CPU Offloading** comes in.

Rather than giving up with an *Out Of Memory (OOM)* error, the `llama.cpp` engine splits the model:
1.  It loads as many neural network layers as possible into the GPU's ultra-fast **VRAM** (about 20 to 22 GB to leave headroom for context).
2.  It places the remaining layers (about 18 to 20 GB) in the motherboard's **system RAM**.

### ⚠️ The performance wall
During response generation ([[00-lexique/decoding|Decoding]]), data must constantly travel back and forth between RAM, the processor, and the graphics card via the PCIe bus.

As explained in the chapter on [[01-fondations/unified-memory-vs-ram-vs-vram|VRAM vs RAM]], classic RAM is physically capped at about 80–100 GB/s. The result is immediate: generation speed collapses.
On an RTX 4090 paired with 64 GB DDR5, a 70B Q4 model in CPU Offloading will generate **between 4 and 12 tokens per second** depending on the share of offloaded layers and the RAM: theoretical bound of ~4–5 t/s if half the weights travel through DDR5 (~100 GB/s, see [[01-fondations/memory-bandwidth|memory bandwidth]] — the ~2.5 t/s bound assumes the whole model goes through RAM), 8–12 t/s reported by unverified community feedback; the mechanism (`-ngl` option, GPU vs CPU layers) is documented by llama.cpp and Ollama[^1][^2]. It is readable (slightly below human reading speed), but unsuitable for serving a reactive application or several concurrent users.

### Why unified memory changes the experience

On a [[00-lexique/unified-memory|unified memory]] machine, model weights are not split between fast VRAM and slow RAM connected by PCIe. CPU, GPU, and accelerators share the same memory pool. Bandwidth remains lower than a high-end NVIDIA card (RTX 5090: 1.8 TB/s; Mac Studio M5 Max: 614 GB/s, M5 Ultra: 1.2 TB/s)[^13], but it avoids the worst trap of the standard PC: constant round-trips between DDR5 RAM and VRAM.

For a solo developer, this often makes the difference between *"I can test a quantized 70B and reason comfortably"* and *"I watch tokens arrive one by one"*.

---

## 📋 The architect's verdict

### ✅ When to use this blueprint?
*   To **learn** and prototype applications (RAG, agents) on small models (8B/14B) that fit 100% in VRAM.
*   To run **background tasks** (batch processing, overnight summarization of long documents) with a 70B model, where the user is not waiting for the response live on screen.
*   For a solo developer with a 64–128 GB unified memory machine who wants to test larger models without building a server appliance.

### ❌ When to avoid this blueprint?
*   If you need to deploy an internal API for **more than 2 concurrent collaborators**. CPU Offloading handles concurrency very poorly: beyond one request at a time, response time collapses.
*   If employee usability comfort is an absolute priority.

For daily SME use with 70B models without suffering this heavy transfer penalty, you need to change the hardware paradigm and move from a solo workstation to a service machine. That is the subject of the next blueprint: **The Unified Appliance** (APU/Mac Unified Memory).

---

## 📚 Sources and references

[^1]: ggml-org, *llama.cpp — llama-server README* (`-ngl` / `--n-gpu-layers` option: number of layers placed in VRAM, the rest computed on CPU), re-read on 2026-10-10. [https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
[^2]: Ollama Documentation, *FAQ — GPU layer offloading and partial CPU inference* (Performance penalty during RAM offloading), 2026. [https://docs.ollama.com/faq](https://docs.ollama.com/faq)
[^3]: Tom's Hardware, *Nvidia's RTX 5090 vanishes from online retail in the US — third-party sellers now demand as much as $9,500* (MSRP $1,999), 14 September 2026. [https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu](https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu)
[^4]: TrendForce, press release of 30 September 2026 (contract DRAM prices up 10–15% in Q4 2026). [https://www.trendforce.com/presscenter/news/20260930-13258.html](https://www.trendforce.com/presscenter/news/20260930-13258.html)
[^5]: Qwen, *Qwen3.8-27B* (dense, Apache 2.0, 262k context, vision and tools; BF16 ≈ 56 GB, Q4 via Ollama ≈ 18 GB), August 2026. [https://huggingface.co/Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) · Ollama, *qwen3.8*. [https://ollama.com/library/qwen3.8](https://ollama.com/library/qwen3.8)
[^6]: NVIDIA, *Nemotron-3.5-Lightning-30B-A3B* (BF16 / NVFP4 ≈ 22 GB / GGUF, OpenMDW 1.1 license), August 2026. [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16)
[^7]: Meta, *Muse Glimmer 30B* (Apache 2.0, 29.6B including vision encoder; tiers 64 GB full precision, 32 GB K-Quant-Dynamic, 24 GB K-Quant-17GB; 74.9 tok/s without speculation and 233.4 tok/s with DFlash on RTX 5090, vendor figures), August 2026, re-read on 2026-10-10. [https://huggingface.co/meta-models/Muse-Glimmer-30B](https://huggingface.co/meta-models/Muse-Glimmer-30B)
[^8]: Apple, *Mac Studio* — Apple Store France (Mac Studio M5 Max 64 GB €3,659 incl. VAT), captured 2026-10-09. [https://www.apple.com/fr/shop/buy-mac/mac-studio](https://www.apple.com/fr/shop/buy-mac/mac-studio) · Apple Newsroom, *Apple unveils a more powerful Mac mini featuring the all-new M6 and M5 Pro* (Mac mini M5 Pro: up to 64 GB, 307 GB/s, Thunderbolt 5), August 2026. [https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/](https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/)
[^9]: Framework, *Framework Desktop — AMD Ryzen AI Max+ 395* (64 GB €2,209 incl. VAT, 128 GB €3,889 incl. VAT, out of stock), captured 2026-10-09. [https://frame.work/fr/fr/products/desktop-diy-amd-aimax300](https://frame.work/fr/fr/products/desktop-diy-amd-aimax300)
[^10]: ServeTheHome, *NVIDIA DGX Spark 64GB Launched and Big 128GB GB10 Price Increases* (DGX Spark 128 GB ≈ $6,950, launched at $3,999; 64 GB version at $4,999 via OEMs from 2026-10-23), 2026-10-03. [https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/](https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/) · NVIDIA, *DGX Spark* — product page, re-read on 2026-10-09. [https://www.nvidia.com/en-us/products/workstations/dgx-spark/](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
[^11]: Ollama, *Release v0.40.0* (MLX used by default on Apple Silicon), 25 September 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0) · ggml-org, *llama.cpp — Release b11521* (`llama-server` default port changed from 8080 to 9931), 9 October 2026. [https://github.com/ggml-org/llama.cpp/releases/tag/b11521](https://github.com/ggml-org/llama.cpp/releases/tag/b11521) · incoai, *Splash* (experimental Metal engine, M3+ and ≥ 36 GB, Qwen3.8; throughput announced by the publisher, not independently verified), 18 September 2026. [https://github.com/incoai/splash](https://github.com/incoai/splash)
[^12]: OpenAI, *gpt-oss-120b* (117B MoE, 5.1B active, MXFP4, Apache 2.0; ≈ 60–70 GB), August 2025, re-read on 2026-10-09. [https://huggingface.co/openai/gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b)
[^13]: Apple Newsroom, *Apple introduces new Mac Studio with M5 Max and M5 Ultra* (M5 Max 614 GB/s, M5 Ultra 1.2 TB/s), 25 August 2026. [https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/) · NVIDIA, *GeForce RTX 5090* (32 GB GDDR7, 512-bit bus). [https://www.nvidia.com/fr-fr/geforce/graphics-cards/50-series/rtx-5090/](https://www.nvidia.com/fr-fr/geforce/graphics-cards/50-series/rtx-5090/)
