---
title: "🏭 GPU rack servers"
description: Guide to choosing 1U/2U/4U servers and HGX nodes for on-premise LLM inference — between workstation and datacenter.
sidebar:
  order: 3
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Rack servers bridge the gap between **multi-GPU workstations** (office) and **HGX nodes** (datacenter). They host 1 to 8 GPUs with power, cooling, and [[00-lexique/pcie|PCIe]]/[[00-lexique/nvlink|NVLink]] suited to 24/7 [[00-lexique/vllm|vLLM]] load.

After [[02-materiel/apu-and-unified-memory|unified-memory APUs]] (light SMB) and [[02-materiel/stations-multi-gpu|office workstations]], **GPU rack servers** are the standard building block for scenarios **B** (rackable appliance) and **D** (datacenter) — see [[04-blueprints/scenario-b-sme-appliance|Scenario B]] and [[04-blueprints/scenario-d-datacenter|Scenario D]].

---

## 1. Form factors and GPU capacity

| Format | Typical GPUs | Inference use |
| :-- | :-- | :-- |
| **1U** | 1–2 GPU (often RTX/L40S) | SMB, edge, models ≤ 30B quantized |
| **2U** | 2–4 PCIe GPUs | SMB / mid-market sweet spot — multi-user [[00-lexique/vllm|vLLM]] |
| **4U** | 4–8 GPU, sometimes intra-node NVLink | 70B+ models, tensor parallelism |
| **HGX / OAM / NVL72** | 8× H100/H200/B200/**B300**, [[00-lexique/nvswitch|NVSwitch]]; Vera Rubin (NVL72) in full production since August 2026, first for the large clouds[^5] | Datacenter, 405B+ models, massive [[00-lexique/tensor-parallelism|TP]] |

Constraint #1 remains **total addressable [[00-lexique/vram|VRAM]]**: a Llama 3 70B in FP16 needs ~140 GB of weights alone, not counting concurrent [[00-lexique/kv-cache|KV Cache]].

Outside NVIDIA, three 2026 announcements complete the rack landscape without changing it for an SMB. On the AMD side, the **Helios** rack (72 Instinct MI455X HBM4, 18 EPYC "Venice", Pensando networking) has been declared "in production" since 2026-07-23, with Bull, HPE, Lenovo, and Supermicro as integrators, and AMD maintains its second-half 2026 target despite delay rumors: for a sovereign datacenter, it is an alternative to qualify in 2027, not a 2026 purchase[^3][^10]. The **Cerebras CS-4** (2026-08-18, three Wafer Scale Engine 3 Turbo, on-chip SRAM, "up to 30×" the inference throughput of a GPU system according to Cerebras) targets neoclouds and hyperscalers, sold direct with no public price[^7]. Finally, Intel is preparing **Crescent Island**, a 350 W PCIe inference GPU with 160 GB of LPDDR5X (up to 480 GB from partners), with no published bandwidth or date[^8].

---

## 2. Consumer RTX vs datacenter GPU

| Criterion | RTX 5090 / RTX PRO 6000 (workstation/rack 2U) | H100 / H200 / B200 / B300 (HGX) |
| :-- | :-- | :-- |
| **VRAM** | 32–96 GB GDDR7 | 80–288 GB [[00-lexique/hbm|HBM]] |
| **Memory bandwidth** | ~1.8 TB/s[^6] | ~3–8 TB/s |
| **Multi-GPU NVLink** | None (no NVLink since Ada; PCIe only)[^6] | [[00-lexique/nvswitch|NVSwitch]] full mesh |
| **Acquisition cost** | Significantly lower than HGX, but the gap is narrowing with the 2026 rise in GDDR7 GPU prices (RTX PRO 6000 ~$16,000, RTX 5090 ≥ $5,000); an 8× RTX PRO 6000 server is listed at ~$266k by an OEM in July 2026[^3][^4] | Datacenter TCO, enterprise support; no public list price for HGX B300 / GB300 |
| **Best for** | Scenario B, moderate-load lab | Scenario D, strict SLA, large models |

> [!warning] Do not extrapolate office benchmarks
> An excellent solo RTX 5090 bench does not replace an HGX node for 50 concurrent requests on a 70B — the bottleneck becomes KV Cache + [[00-lexique/memory-bandwidth|memory bandwidth]], not peak TFLOPS.

Previous generations remain safe purchases: NVIDIA AI Enterprise Infra 8.x (May 2026) keeps A100, H100/H200, L40/L40S, and RTX 6000 Ada among supported GPUs; only V100, RTX 4000 SFF Ada, RTX A4000, and Quadro RTX have been retired (still supported on the 7.x LTSB line)[^9].

---

## 3. Quick sizing

**Step 1 — Target model weight**  
Use [[01-fondations/quantization-4bit-8bit|4/8-bit quantization]] and [[03-stack-logicielle/choose-your-model|Choosing your model]] to estimate weight VRAM.

**Step 2 — Concurrent KV Cache**  
Refer to [[01-fondations/kv-cache-and-context|KV Cache and context]]: each active session consumes VRAM proportional to context length.

**Step 3 — Engine**  
[[00-lexique/ollama|Ollama]] on a single RTX GPU suits testing; multi-user production switches to [[00-lexique/vllm|vLLM]][^2] or TensorRT-LLM[^1] — [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]].

**Step 4 — Multi-node network**  
Beyond one node, the [[02-materiel/network-roce-infiniband-thunderbolt|RoCE or InfiniBand]] fabric becomes mandatory for inter-server [[00-lexique/tensor-parallelism|tensor parallelism]].

---

## 4. Purchase pitfalls

- **Underestimating cooling and power**: datacenter GPUs in 1U = extreme noise and thermals; plan for a suitable room or rack.
- **Shared PCIe x16**: check lane splitting when 4 GPUs share the same CPU — see [[02-materiel/stations-multi-gpu|Multi-GPU workstations]] (same principles).
- **Licenses and support**: some vendors restrict "datacenter" use of gaming cards — read EULAs before production deployment.
- **Forgetting the application front end**: the GPU rack serves [[00-lexique/vllm|vLLM]]; the user UI remains [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] or equivalent.
- **Underestimating system RAM**: contract DRAM is still rising 10–15% per quarter in Q4 2026 (TrendForce); nodes that offload KV cache or weights to RAM are now also priced in euros per GB[^11].

---

## 📋 The architect's advice

For an **SMB** wanting a 2U rack × 2× L40S (48 GB, 350 W) or RTX PRO 6000 (96 GB, ~$16,000 in Q3 2026): size for a 32B–70B quantized model + 10–20 concurrent users, Open WebUI front, [[00-lexique/vllm|vLLM]] behind a reverse proxy — blueprint [[04-blueprints/scenario-b-sme-appliance|B]].

For a **datacenter**: start with the target model (405B? 70B dense? MoE?) and work down to the number of HGX GPUs — blueprint [[04-blueprints/scenario-d-datacenter|D]].

---

## 📚 Sources

[^1]: NVIDIA, *TensorRT-LLM* and datacenter GPU documentation. [https://nvidia.github.io/TensorRT-LLM/](https://nvidia.github.io/TensorRT-LLM/)
[^2]: vLLM, *Parallelism and Scaling* (tensor parallel, pipeline parallel, multi-GPU requirements). [https://docs.vllm.ai/en/stable/serving/parallelism_scaling/](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/)
[^3]: AMD, *AAI 2026: AMD Delivers Full-Stack Compute for the Agentic AI Era* (Helios "now in production", 72 MI455X + 18 EPYC Venice, OEMs Bull / HPE / Lenovo / Supermicro; note 8: RTX PRO 6000-based server at OEM list price of $265,928.24 as of 2026-07-16), 23 July 2026. [https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era](https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era)
[^4]: Tom's Hardware, *Nvidia doubles RTX PRO 6000 Blackwell's MSRP to a staggering $16,000* (96 GB, pre-orders under $8,000 in 2025), August 2026. [https://www.tomshardware.com/pc-components/gpus/nvidia-doubles-rtx-pro-6000-blackwells-msrp-to-a-staggering-usd16-000-96gb-card-started-pre-orders-below-usd8-000-last-year](https://www.tomshardware.com/pc-components/gpus/nvidia-doubles-rtx-pro-6000-blackwells-msrp-to-a-staggering-usd16-000-96gb-card-started-pre-orders-below-usd8-000-last-year) · Tom's Hardware, *Nvidia's RTX 5090 vanishes from online retail in the US* (≥ $5,000 from third-party sellers, MSRP $1,999), 14 September 2026. [https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu](https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu)
[^5]: NVIDIA Newsroom, *NVIDIA Announces Financial Results for Second Quarter Fiscal 2027* ("Vera Rubin, now in full production", racks at CoreWeave, Google Cloud, Microsoft Azure, OCI, Nebius), 26 August 2026. [https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)
[^6]: NVIDIA, *RTX PRO 6000 Blackwell Workstation Edition* (96 GB GDDR7 ECC, 1,792 GB/s, PCIe Gen 5, 600 W, no NVLink connector). [https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/) · NVIDIA, *GeForce RTX 5090* (32 GB GDDR7, 512-bit bus, 575 W). [https://www.nvidia.com/fr-fr/geforce/graphics-cards/50-series/rtx-5090/](https://www.nvidia.com/fr-fr/geforce/graphics-cards/50-series/rtx-5090/)
[^7]: Cerebras, *Introducing Cerebras CS-4* (three WSE-3 Turbo, "up to 30 times faster inference than GPU systems", targets neoclouds and hyperscalers, no public price), 18 August 2026. [https://www.cerebras.ai/blog/introducing-cerebras-cs-4](https://www.cerebras.ai/blog/introducing-cerebras-cs-4)
[^8]: ServeTheHome, *Intel Crescent Island 160GB to 480GB LPDDR5X AI GPU at Hot Chips 2026* (350 W air-cooled PCIe, vLLM / SGLang, bandwidth not disclosed), 24 August 2026. [https://www.servethehome.com/intel-crescent-island-160gb-to-480gb-lpddr5x-ai-gpu-at-hot-chips-2026/](https://www.servethehome.com/intel-crescent-island-160gb-to-480gb-lpddr5x-ai-gpu-at-hot-chips-2026/)
[^9]: NVIDIA, *NVIDIA AI Enterprise — End-of-Life Notices* (GPUs retired from Infra 8.0 onward: Tesla V100, RTX 4000 SFF Ada, RTX A4000, Quadro RTX; A100, H100/H200, L40/L40S, and RTX 6000 Ada still supported), re-read on 2026-10-10. [https://docs.nvidia.com/ai-enterprise/lifecycle/latest/eol-notices.html](https://docs.nvidia.com/ai-enterprise/lifecycle/latest/eol-notices.html)
[^10]: Tom's Hardware, *AMD denies report of MI455X delays as Nvidia VR200 systems are rumored to arrive early — company says Helios systems on target for 2H 2026*, September 2026. [https://www.tomshardware.com/tech-industry/artificial-intelligence/amd-denies-report-of-mi455x-delays-as-nvidia-vr200-systems-are-rumored-to-arrive-early-company-says-helios-systems-on-target-for-2h-2026](https://www.tomshardware.com/tech-industry/artificial-intelligence/amd-denies-report-of-mi455x-delays-as-nvidia-vr200-systems-are-rumored-to-arrive-early-company-says-helios-systems-on-target-for-2h-2026)
[^11]: TrendForce, press release of 30 September 2026 (contract DRAM prices up 10–15% in Q4 2026). [https://www.trendforce.com/presscenter/news/20260930-13258.html](https://www.trendforce.com/presscenter/news/20260930-13258.html)
