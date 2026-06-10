---
title: "🏭 GPU rack servers"
description: Guide to choosing 1U/2U/4U servers and HGX nodes for on-premise LLM inference — between workstation and datacenter.
sidebar:
  order: 3
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
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
| **HGX / OAM** | 8× H100/H200/B200, [[00-lexique/nvswitch|NVSwitch]] | Datacenter, 405B+ models, massive [[00-lexique/tensor-parallelism|TP]] |

Constraint #1 remains **total addressable [[00-lexique/vram|VRAM]]**: a Llama 3 70B in FP16 needs ~140 GB of weights alone, not counting concurrent [[00-lexique/kv-cache|KV Cache]].

---

## 2. Consumer RTX vs datacenter GPU

| Criterion | RTX 4090 / 5090 (workstation/rack 2U) | H100 / H200 / B200 (HGX) |
| :-- | :-- | :-- |
| **VRAM** | 24–32 GB | 80–192 GB [[00-lexique/hbm|HBM]] |
| **Memory bandwidth** | ~1–1.5 TB/s | ~3–8 TB/s |
| **Multi-GPU NVLink** | Limited (2-GPU bridge) | [[00-lexique/nvswitch|NVSwitch]] full mesh |
| **Acquisition cost** | Order of magnitude ×5–×10 lower than HGX | Datacenter TCO, enterprise support |
| **Best for** | Scenario B, moderate-load lab | Scenario D, strict SLA, large models |

> [!warning] Do not extrapolate office benchmarks
> An excellent solo RTX 5090 bench does not replace an HGX node for 50 concurrent requests on a 70B — the bottleneck becomes KV Cache + [[00-lexique/memory-bandwidth|memory bandwidth]], not peak TFLOPS.

---

## 3. Quick sizing

**Step 1 — Target model weight**  
Use [[01-fondations/quantization-4bit-8bit|4/8-bit quantization]] and [[03-stack-logicielle/choose-your-model|Choosing your model]] to estimate weight VRAM.

**Step 2 — Concurrent KV Cache**  
Refer to [[01-fondations/kv-cache-and-context|KV Cache and context]]: each active session consumes VRAM proportional to context length.

**Step 3 — Engine**  
[[00-lexique/ollama|Ollama]] on a single RTX GPU suits testing; multi-user production switches to [[00-lexique/vllm|vLLM]] or TensorRT-LLM — [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]].

**Step 4 — Multi-node network**  
Beyond one node, the [[02-materiel/network-roce-infiniband-thunderbolt|RoCE or InfiniBand]] fabric becomes mandatory for inter-server [[00-lexique/tensor-parallelism|tensor parallelism]].

---

## 4. Purchase pitfalls

- **Underestimating cooling and power**: datacenter GPUs in 1U = extreme noise and thermals; plan for a suitable room or rack.
- **Shared PCIe x16**: check lane splitting when 4 GPUs share the same CPU — see [[02-materiel/stations-multi-gpu|Multi-GPU workstations]] (same principles).
- **Licenses and support**: some vendors restrict "datacenter" use of gaming cards — read EULAs before production deployment.
- **Forgetting the application front end**: the GPU rack serves [[00-lexique/vllm|vLLM]]; the user UI remains [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] or equivalent.

---

## 📋 The architect's advice

For an **SMB** wanting a 2U rack × 2× L40S or pro RTX: size for a 32B–70B quantized model + 10–20 concurrent users, Open WebUI front, [[00-lexique/vllm|vLLM]] behind a reverse proxy — blueprint [[04-blueprints/scenario-b-sme-appliance|B]].

For a **datacenter**: start with the target model (405B? 70B dense? MoE?) and work down to the number of HGX GPUs — blueprint [[04-blueprints/scenario-d-datacenter|D]].

---

## 📚 Sources

[^1]: NVIDIA, *TensorRT-LLM* and datacenter GPU documentation. [https://nvidia.github.io/TensorRT-LLM/](https://nvidia.github.io/TensorRT-LLM/)
[^2]: vLLM Project — hardware requirements and tensor parallelism. [https://docs.vllm.ai/](https://docs.vllm.ai/)
