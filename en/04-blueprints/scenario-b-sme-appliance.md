---
title: "🏢 Scenario B: SME Appliance (Unified Memory)"
description: The ideal blueprint for SMEs. How to serve a team of 10 to 50 people with a 70B model using a Mac Studio or AMD APU.
sidebar:
  order: 2
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Your client (a law firm, medical practice, SME) needs a local assistant capable of processing confidential documents. The chosen model is a heavy LLM: either a quantized dense 70B (~40 GB of weights, the capacity benchmark of this blueprint), or — faster on this hardware — a light MoE such as gpt-oss-120b (~70 GB, 34–38 t/s measured on a 128 GB APU) or a 27–30B dense model such as Qwen3.8-27B (~18 GB in Q4)[^6].

As seen in [[04-blueprints/scenario-a-dev-lab|Scenario A]], a standard PC collapses due to [[00-lexique/offloading|CPU Offloading]]. Buying a multi-GPU server is very expensive, sounds like a jet taking off, and consumes a lot of electricity. The most elegant solution in 2026 is the **Unified Memory Appliance**.

---

## 🏗️ Hardware architecture

The goal is to have a single chip (SoC) where the CPU and GPU draw from the same large memory reserve.
Three choices are available:

*   **Apple option (The silent standard):** A Mac Studio M5 Max (up to 128 GB, 614 GB/s, from €2,999 incl. VAT) or M5 Ultra (up to 512 GB, 1.2 TB/s, from €6,599 incl. VAT) — the M4 Max / M3 Ultra generation has no longer been sold since 2026-08-25[^1][^3].
*   **x86 PC option (Docker sovereignty):** A workstation based on the AMD Ryzen AI Max PRO 400 APU ("Gorgon Halo") with 192 GB RAM — on pre-order at Framework for $6,799 with delivery in November 2026; the previous 128 GB generation (Ryzen AI Max+ 395) is listed at €3,889 incl. VAT but out of stock as of 2026-10-09[^4].
*   **NVIDIA option (CUDA without friction):** A DGX Spark 128 GB (≈ $6,950 as of 2026-10-02, launched at $3,999) or its 64 GB variant at $4,999 from OEMs starting 2026-10-23 — same 273 GB/s bus as Gorgon Halo, native CUDA and FP4[^8].

> [!note] Beyond 128 GB
> The Mac Studio M5 Ultra can be configured up to 512 GB of unified memory (1.2 TB/s, from €6,599 incl. VAT at 96 GB, 512 GB configuration shipping late October 2026) and chains into an RDMA cluster over Thunderbolt 5 (up to four machines). For an SMB, it is the option that pushes the "soldered memory" limit of the verdict below the furthest[^1][^3].

**Estimated budget (Q4 2026):** between €3,900 and more than €8,000 incl. VAT depending on chip and soldered memory — and rising: TrendForce still records +10 to 15% per quarter on contract DRAM in Q4 2026 and Framework announces memory price increases across all capacities for six months[^4][^5]. The prices quoted here are those of October 2026: re-check at purchase time.
**Physical advantages:** Very low power consumption (often under 150W at full load), compact form factor, no excessive fan noise.

---

## ⚙️ Software stack

Here, the software stack differs depending on hardware chosen:

*   **On Mac Studio:** **MLX** (`mlx_lm.server`, or Ollama ≥ 0.40, which uses it by default on Apple Silicon) or **llama.cpp** via Metal (`llama-server` default port changed to 9931 in October 2026)[^9]. Both exploit the maximum bandwidth of unified memory.
*   **On AMD Gorgon Halo (Linux):** llama.cpp (Vulkan or ROCm) or SGLang (ROCm image for `gfx1151` since 0.5.20), which brings server optimizations like *Continuous Batching*; vLLM on ROCm remains to be validated on this chip[^10].

### Expected performance
Since the 40 GB model fits entirely in [[00-lexique/unified-memory|unified memory]] (which here acts as a huge [[00-lexique/vram|VRAM]]), generation speeds are excellent and stable:
*   **Mac Studio (M5 Max, ~614 GB/s):** theoretical bound of about 15 [[00-lexique/tokens-per-second|tokens/s]] during [[00-lexique/decoding|Decoding]] on a 70B Q4 (~40 GB), calculated with the formula from [[01-fondations/memory-bandwidth|the memory bandwidth chapter]] based on the bandwidth announced by Apple in August 2026[^1] — i.e. 10 to 15 t/s expected in practice, to be confirmed by a published benchmark.
*   **AMD Ryzen AI Max PRO 400 (~273 GB/s):** on the order of 5 tokens/s measured (4.7–4.9 t/s on Llama 3.1 70B Q4_K_M, Strix Halo 128 GB, same bus)[^2][^6] — consistent with the ~6.8 t/s theoretical bound given by the formula.

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

To overcome this fixed capacity constraint while staying on affordable desktop hardware, the next blueprint proposes a scalable approach: **[[04-blueprints/scenario-c-desktop-cluster|The Desktop Cluster]]** — connecting several machines via Thunderbolt.

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
4. Point clients (Open WebUI, LiteLLM) to the new IP — on up-to-date versions: LiteLLM ≥ 1.100.4 or the latest patch of its line (two LiteLLM CVEs are in CISA's KEV catalog), and Open WebUI tracked release by release, the project having published a series of High-severity security advisories in September 2026; never pin a version[^7]

**Indicative RTO for Blueprint B: < 45 minutes** with an up-to-date daily backup.

---

## 📚 Sources and references

[^1]: Apple Newsroom, *Apple introduces new Mac Studio with M5 Max and M5 Ultra* (M5 Max memory bandwidth 614 GB/s and M5 Ultra 1.2 TB/s, capacities up to 128 GB and 512 GB, Thunderbolt 5 clustering), 2026-08-25. [https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/)
[^2]: ServeTheHome & ignasivt (GitHub), *Strix Halo / Gorgon Halo 192GB Unified Memory Benchmarks* (Expected decoding throughput on dense 70B model), May 2026. [https://www.servethehome.com/amd-reveals-ryzen-ai-max-pro-400-series-192gb-ram-for-ai-systems/](https://www.servethehome.com/amd-reveals-ryzen-ai-max-pro-400-series-192gb-ram-for-ai-systems/) · [https://github.com/ignasivt/strix-halo-guide](https://github.com/ignasivt/strix-halo-guide)
[^3]: Apple, *Mac Studio* — Apple Store France (M5 Max 36 GB from €2,999 incl. VAT, M5 Max 64 GB €3,659 incl. VAT, M5 Ultra 96 GB from €6,599 incl. VAT, 512 GB option "late October"), captured 2026-10-09. [https://www.apple.com/fr/shop/buy-mac/mac-studio](https://www.apple.com/fr/shop/buy-mac/mac-studio)
[^4]: Framework, *The 192GB Framework Desktop is open for pre-order* (Ryzen AI Max+ PRO 495, 192 GB at $6,799, pre-orders from 2026-09-30, deliveries November 2026, warning about memory price increases), 30 September 2026. [https://frame.work/blog/192gb-framework-desktop-open-for-pre-order](https://frame.work/blog/192gb-framework-desktop-open-for-pre-order) · Framework, *Framework Desktop — AMD Ryzen AI Max+ 395* (128 GB €3,889 incl. VAT, out of stock), captured 2026-10-09. [https://frame.work/fr/fr/products/desktop-diy-amd-aimax300](https://frame.work/fr/fr/products/desktop-diy-amd-aimax300)
[^5]: TrendForce, press release of 30 September 2026 (contract DRAM prices up 10–15% in Q4 2026). [https://www.trendforce.com/presscenter/news/20260930-13258.html](https://www.trendforce.com/presscenter/news/20260930-13258.html)
[^6]: Qwen, *Qwen3.8-27B* (dense, Apache 2.0, 262k context; Q4 via Ollama ≈ 18 GB), August 2026. [https://huggingface.co/Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) · Ollama, *qwen3.8*. [https://ollama.com/library/qwen3.8](https://ollama.com/library/qwen3.8) · ignasivt, *Strix Halo Guide* (gpt-oss-120b ≈ 70 GB, 34–38 tok/s; Llama 3.1 70B Q4_K_M 4.7–4.9 tok/s on Ryzen AI Max+ 395 128 GB), re-read on 2026-10-10. [https://github.com/ignasivt/strix-halo-guide](https://github.com/ignasivt/strix-halo-guide)
[^7]: BerriAI, *GHSA-7hp6-4w63-5g45* (`internal_user` → `proxy_admin` escalation → execution on the host, CVSS 9.9, fixed in 1.100.4 / 1.101.3 / 1.102.2 / 1.103.1), 2026-09-30. [https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45](https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45) · LiteLLM, *Version Support Policy*. [https://docs.litellm.ai/blog/version-support](https://docs.litellm.ai/blog/version-support) · Open WebUI, *Security Advisories* (series of High advisories published 27–28 September 2026), consulted 2026-10-10. [https://github.com/open-webui/open-webui/security/advisories](https://github.com/open-webui/open-webui/security/advisories)
[^8]: ServeTheHome, *NVIDIA DGX Spark 64GB Launched and Big 128GB GB10 Price Increases* (DGX Spark 128 GB ≈ $6,950, launched at $3,999; 64 GB version at $4,999 via OEMs from 2026-10-23), 2026-10-03. [https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/](https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/) · NVIDIA, *DGX Spark* — product page (GB10, 128 GB LPDDR5x, ~273 GB/s), re-read on 2026-10-09. [https://www.nvidia.com/en-us/products/workstations/dgx-spark/](https://www.nvidia.com/en-us/products/workstations/dgx-spark/) · NVIDIA Blog, *NVIDIA DGX Spark 64GB Gives Developers More Ways to Build and Scale Local AI* (same GB10, from $4,999, models up to 100B parameters, OEMs Acer, ASUS, Dell, Gigabyte, HP, MSI from Friday 23 October; two units linked over QSFP = 128 GB, models up to 200B), 2 October 2026. [https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/](https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/)
[^9]: Ollama, *Release v0.40.0* (MLX used by default on Apple Silicon), October 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0) · ggml-org, *llama.cpp — Release b11521* (`llama-server` default port changed from 8080 to 9931), 9 October 2026. [https://github.com/ggml-org/llama.cpp/releases/tag/b11521](https://github.com/ggml-org/llama.cpp/releases/tag/b11521)
[^10]: SGLang Project, *Release v0.5.20* (ROCm image for `gfx1151` Strix / Gorgon Halo), 18 September 2026. [https://github.com/sgl-project/sglang/releases/tag/v0.5.20](https://github.com/sgl-project/sglang/releases/tag/v0.5.20) · ignasivt, *Strix Halo Guide* (llama.cpp Vulkan / ROCm paths verified on gfx1151), re-read on 2026-10-09. [https://github.com/ignasivt/strix-halo-guide](https://github.com/ignasivt/strix-halo-guide)
