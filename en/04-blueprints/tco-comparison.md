---
title: "💰 TCO Comparison: On-Premise vs Cloud API"
description: Total cost of ownership (TCO) analysis of the four on-premise blueprints versus cloud AI APIs — hardware, energy, maintenance, and break-even point.
sidebar:
  order: 5
prices_valid_as_of: "2026-10"
last_verified: "2026-10-09"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
last_modified: "2026-10-09"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Cloud AI costs little at startup but a lot at scale. On-premise requires a high initial investment but marginal cost tends toward zero. At October 2026 prices, the break-even point of an SME appliance (Blueprint B) is about 13 months against GPT-5.5, 19 months against Claude Opus 5.5, and is never reached against the budget tiers billed under $1 per million tokens: in 2026, sovereignty, not cost, is the decisive argument for on-premise in an SME.

---

## TCO calculation parameters

Before comparing, align the units. LLM usage is measured in **millions of tokens processed per month** — that is the cloud billing unit, and it is also the right denominator for calculating on-premise cost.

**Cloud side:** providers bill per token (input + output separately). In 2026, reference rates for 70B-class models:

> [!warning] Prices — validity
> Prices captured in **October 2026** (snapshot of 2026-10-09, USD excluding tax; indicative conversion $1 ≈ €0.92). Cloud API prices change frequently: OpenAI doubled GPT-5.5 in April 2026, Google has scheduled a doubling of Gemini Flash prices on 1 January 2027, Groq withdrew the public price of Llama 3.3 70B.
> Verify official pricing pages before building a business case:
> [OpenAI](https://developers.openai.com/api/docs/pricing) · [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) · [Mistral](https://mistral.ai/pricing) · [Google Gemini](https://ai.google.dev/gemini-api/docs/pricing) · [Groq](https://console.groq.com/docs/models) · [Together AI](https://www.together.ai/pricing)

| API (prices captured 2026-10-09, USD excluding tax) | Input rate | Output rate | Model |
| :-- | :-- | :-- | :-- |
| OpenAI GPT-5.5[^1] | $5.00/M tok | $30.00/M tok | Proprietary, frontier |
| OpenAI GPT-5.6 Sol (promo at least until 2026-11-21)[^1] | $4.00/M tok | $20.00/M tok | Proprietary, high-end |
| OpenAI GPT-6 Sol[^1] | $2.00/M tok | $10.00/M tok | Proprietary, mid-range |
| OpenAI GPT-6 Luna[^1] | $0.10/M tok | $0.50/M tok | Proprietary, budget |
| OpenAI GPT-4o (legacy)[^1] | $2.50/M tok | $10.00/M tok | Proprietary, previous generation |
| Anthropic Claude Opus 5.5[^2] | $4.00/M tok | $20.00/M tok | Proprietary, high-end |
| Anthropic Claude Sonnet 5.5[^2] | $2.00/M tok | $10.00/M tok | Proprietary, mid-range |
| Anthropic Claude Haiku 5.5 (prompt ≤ 100k)[^2] | $0.10/M tok | $0.50/M tok | Proprietary, budget |
| Mistral Large 3[^3] | $0.50/M tok | $1.50/M tok | Proprietary (open weights) |
| Mistral Large 4 (API preview of 2026-10-06)[^3] | $1.36/M tok | $4.18/M tok | Preview; open weights announced for late October 2026 |
| Groq (openai/gpt-oss-120b)[^4] | $0.15/M tok | $0.60/M tok | Open weights, cloud (Llama 3.3 70B: quote-based pricing since 2026) |
| Together AI (Llama 3.3 70B)[^5] | $1.04/M tok | $1.04/M tok | Open weights, cloud |
| Generic 70B cloud API | ~$1.00–3.00/M tok | ~$1.00–4.00/M tok | Range |

*Note: prices change frequently. Verify current rates before building a business case.*

**On-premise side:** cost is fixed (hardware amortization) + variable (electricity, maintenance). No per-token billing.

---

## Reference scenario for comparison

To make the comparison concrete, use a typical SME case:

- **Usage:** 10 active users, ~50 requests/day/user
- **Average exchange size:** ~1,000 input tokens + ~500 output tokens
- **Monthly volume:** ~22,500 exchanges × 1,500 tokens = **~33.75 M tokens/month**
- **Target model:** Quantized 70B (Q4_K_M) — quality sufficient for most business cases

---

## Blueprint A — Dev Lab (RTX 4090 or 64 GB unified memory)

**Suitable usage:** solo developer or team of 2–3 people, 8B–14B models.

| Item | Amount |
| :-- | :-- |
| Hardware (RTX 4090 PC or Mac Pro 64 GB) | €2,500 – €3,500 (4-year amortization) |
| Monthly amortization | ~€55 – €75/month |
| Electricity (150W × 8h/day × 30 days × €0.20/kWh) | ~€7/month |
| **Total monthly cost** | **~€65 – €85/month** |

**Cloud equivalent (GPT-4o-class API, ~5 M tokens/month):**
- Input: 5 M × $2.50 = $12.50/month
- Output: 2.5 M × $10.00 = $25.00/month
- **Cloud total ≈ $37/month (~€35)**

> [!note] Break-even point A
> At low volume (< 5 M tokens/month), cloud is often cheaper than a dedicated workstation — unless **data sovereignty** is non-negotiable. On-premise is justified from the first token if your data cannot leave your premises.

---

## Blueprint B — SME Appliance (Mac Studio / 128 GB APU)

**Suitable usage:** 10 to 50 users, 70B model, maximum confidentiality.

| Item | Amount |
| :-- | :-- |
| Mac Studio M4 Max 128 GB | €4,500 (4-year amortization) |
| Monthly amortization | ~€95/month |
| Electricity (100W × 12h/day × 30 days × €0.20/kWh) | ~€7/month |
| Maintenance, backup, support | ~€50/month |
| **Total monthly cost** | **~€155/month** |

**Cloud equivalent (22.5 M input tokens + 11.25 M output tokens per month, prices of 2026-10-09):**
- Haiku 5.5 or GPT-6 Luna ($0.10 / $0.50): 2.25 + 5.6 = **~$8/month** (~€7, budget tier)
- Sonnet 5.5 or GPT-6 Sol ($2 / $10): 45 + 112.5 = **~$158/month** (~€145, mid-range)
- GPT-5.5 ($5 / $30): 112.5 + 337.5 = **~$450/month** (~€414, frontier model)

| API choice (prices of 2026-10-09, $1 ≈ €0.92) | Cloud cost/month | Break-even |
| :-- | :-- | :-- |
| Budget: Haiku 5.5, GPT-6 Luna, Mistral Large 3 ($0.10–0.50 / $0.50–1.50)[^1][^2][^3] | ~€7 – 26/month | ❌ Never amortized on cost alone |
| Open-weights cloud (Together AI Llama 3.3 70B, $1.04/M)[^5] | ~€32/month | ❌ Never amortized on cost alone |
| Mid-range: Sonnet 5.5, GPT-6 Sol ($2 / $10)[^1][^2] | ~€145/month | ~51 months (beyond the amortization period) |
| High-end: Opus 5.5, GPT-5.6 Sol ($4 / $20)[^1][^2] | ~€290/month | ~19 months |
| Frontier: GPT-5.5 ($5 / $30)[^1] | ~€414/month | **~13 months** |

*Break-even = €4,500 of capital / (monthly cloud cost − €57/month of on-premise running cost excluding amortization), formula from the "Calculate your own TCO" section.*

> [!tip] Sovereignty changes the calculation
> For an SME subject to GDPR processing client data, "open-weights cloud is cheaper" is not enough — a third-party host remains a recipient under GDPR. Against budget APIs (Haiku 5.5, Mistral Large 3, open-weights cloud), the on-premise premium is in the range of €120 to €150/month; against frontier models (GPT-5.5, Opus 5.5), on-premise is already cheaper. In the first case, that premium can avoid much higher legal fees.

---

## Blueprint C — Desktop Cluster (Exo / Thunderbolt)

**Suitable usage:** prototyping models > 100B, asynchronous batch processing.

| Item | Amount |
| :-- | :-- |
| 4× Mac Mini M4 Pro 64 GB | 4 × €1,800 = €7,200 (4-year amortization) |
| Thunderbolt hub + cables | ~€300 |
| Monthly amortization | ~€190/month |
| Electricity (4 × 30W × 16h/day × 30 days × €0.20) | ~€12/month |
| Maintenance and administration | ~€80/month |
| **Total monthly cost** | **~€280/month** |

**Cloud equivalent for models > 100B:**

Open-weights models in this class (DeepSeek V4, GLM-5.3, Kimi K3) are available via OpenAI-compatible APIs from specialized hosts (Together AI, Groq) at rates often lower than proprietary models — but hosted outside your premises[^5]:

| Service | Estimated 100B+ rate | Cost for 33 M tok/month |
| :-- | :-- | :-- |
| Together AI (DeepSeek V3) | ~$2.7/M tok | ~€90/month |
| Self-hosted GPU cloud (A100 × 4, spot) | ~$3–6/GPU-hour | ~€500–€1,500/month |

> [!note] Break-even point C
> For frontier models (100B+), the desktop cluster is competitive from 3–6 months versus on-demand GPU cloud. Its main advantage remains permanent, predictable access, without quota risk or API deprecation.

---

## Blueprint D — Datacenter (HGX 8-GPU)

**Suitable usage:** high-concurrency production, 50+ simultaneous users, strict SLA.

| Item | Amount |
| :-- | :-- |
| HGX H200 node (8× GPU) | ~€400,000 (5-year amortization) |
| Infrastructure (network, cooling, power) | ~€20,000/year |
| Monthly hardware amortization | ~€6,700/month |
| Infrastructure + ops | ~€1,700/month |
| Dedicated infrastructure engineer (0.5 FTE) | ~€4,000/month |
| **Total monthly cost** | **~€12,400/month** |

**Cloud equivalent for SaaS production 50+ users:**

| Service | Estimated cost | Comment |
| :-- | :-- | :-- |
| GPT-4o API (500 M tok/month) | ~$3,000–5,000/month | No custom SLA guarantee |
| Dedicated GPU cloud (A100 × 8, on-demand) | ~$15,000–20,000/month | Strong SLA, but high cost |
| Reserved GPU cloud (1 year, H100 × 8) | ~$8,000–12,000/month | 1-year commitment |

> [!note] Break-even point D
> The HGX node becomes competitive after 24–36 months versus dedicated GPU cloud. Its real value is not purely economic: **full control** (data, models, SLA, model evolution), **5-year cost control**, and maximum regulatory compliance.

---

## Summary — When to choose what?

```
Monthly token volume          Sovereignty constraint   → Recommended blueprint
─────────────────────────────────────────────────────────────────────────────
< 5 M tokens/month            Low                      → Cloud API (cost < on-prem)
< 5 M tokens/month            Strong (GDPR, trade secret) → Blueprint A or B
5–50 M tokens/month           Moderate                 → Blueprint B (TCO < GPT-4o cloud)
5–50 M tokens/month           Strong                   → Blueprint B mandatory
> 50 M tokens/month           Any                      → Blueprint B or D
100B+ models                  Any                      → Blueprint C (prototyping) or D (prod)
50+ simultaneous users        Strong                   → Blueprint D
```

### 3-year TCO — visual recap

| Blueprint | Cost/month | 3-year total | Equivalent cloud API 3 years |
| :-- | :-- | :-- | :-- |
| A (dev lab, 5 M tok/month) | ~€75 | ~€2,700 | ~€1,260 (Groq) / ~€7,400 (GPT-4o) |
| B (SME, 34 M tok/month) | ~€155 | ~€5,580 | ~€1,200 (Groq) / ~€7,400 (GPT-4o) |
| C (cluster, 34 M tok/month) | ~€280 | ~€10,080 | ~€3,200 (Together AI) |
| D (datacenter, 500 M tok/month) | ~€12,400 | ~€446,400 | ~€108,000–720,000 (GPU cloud) |

> [!warning] Hidden costs not to forget
> - **Training and onboarding** of the team on the on-premise stack
> - **Administration time** (updates, monitoring, backups) — often underestimated
> - **Hardware obsolescence:** 2024–2025 GPUs may not optimally support 2027 models
> - **Cooling and space costs** for blueprints C and D

---

## Software FinOps: reduce cost per request before hardware

Before investing in more GPUs, two software optimizations can divide the real per-token cost by a significant factor:

**1. RAG pre-filtering:** by limiting the context sent to the LLM to the K best results (Top-3 instead of Top-20), input tokens are reduced by a factor of 5 to 10 without perceptible quality degradation. On a cloud API billed per input token, the savings are direct. On a local model, that frees VRAM and compute time. See [[03-stack-logicielle/rag-and-agents|RAG & Agents — FinOps section]].

**2. CPU/GPU routing:** offloading embeddings and voice transcription (Whisper) to CPU frees all GPU VRAM for generation. On a 2× L40S server, this routing can multiply by 2 to 3 the number of simultaneous users served without changing a single hardware line.

These two levers apply to all blueprints, but their impact is strongest on Blueprints B and D where multi-user concurrency is the sizing factor.

---

## Calculate your own TCO

To build your business case, collect this data:

1. **Token volume/month:** estimate from number of users × requests/day × tokens per exchange
2. **Reference cloud rate:** identify the API matching your required quality level
3. **Hardware amortization:** hardware price / amortization period (36–60 months)
4. **Electricity cost:** power in kW × hours/day × 30 × local kWh rate
5. **Ops cost:** administrator time × daily rate
6. **Break-even point:** `(Hardware cost) / (Monthly cloud cost - Monthly on-prem cost)`

---

## Choosing hardware by phase

The TCO comparison above focuses mainly on **inference** (frozen model, text generation). The required hardware profile changes significantly depending on the model lifecycle phase.

| Phase | Memory need | Suitable hardware profile | Example |
| :-- | :-- | :-- | :-- |
| **Inference** (frozen model, generation) | Weights + KV cache | Fast GPU with sufficient VRAM | RTX 4090 (24 GB), L40S (48 GB), APU 128 GB |
| **LoRA fine-tuning** (adapters only) | Weights + gradients + optimizer states (~2–3× inference) | High-capacity unified memory or multi-GPU | Mac Studio 192 GB, AMD Gorgon Halo, DGX Spark 128 GB |
| **Full fine-tuning (complete SFT)** | Very high — often 2–4× raw weights in FP16 | Multi-GPU server or datacenter | 2–4× A100 80 GB, or DGX Station |
| **Full training (pre-training)** | Several hundred GB to several TB | Datacenter clusters — beyond SMB on-prem scope | H100, HGX/DGX systems |

> [!warning] Do not confuse profiles
> A GPU fast at inference (RTX 4090, 24 GB VRAM) can crash immediately on LoRA fine-tuning of a 70B model in FP16 — optimizer states inflate required memory to ~60–70 GB, well beyond available VRAM. Conversely, a high-capacity but slow-bandwidth system (e.g. AMD Gorgon Halo at ~273 GB/s) is suboptimal for serving 50 simultaneous users on a 7B model.

### The "tokens/s per k€" KPI for comparing inference options

To arbitrate between two inference hardware options, the ratio **tokens per second per thousand euros invested** (tokens/s/k€) is more meaningful than raw speed alone.

Example reading:
- RTX 4090 (24 GB, ~€2,000): if it delivers ~60 tok/s on an 8B model → **~30 tok/s/k€**
- Mac Studio M4 Max 128 GB (~€5,000): if it delivers ~10 tok/s on a 70B Q4 → **~2 tok/s/k€**

These two figures are consistent: the Mac Studio serves much larger models than the RTX 4090, so direct comparison only makes sense for the **same model and same quantization**.

> [!warning] Limits of the tokens/s/k€ ratio
> This ratio depends strongly on **model**, **quantization**, and **batch size**:
> - **Batch size = 1 (single user):** favors GPUs with high GDDR bandwidth (RTX 4090, L40S) — autoregressive decoding is memory-bound, and GDDR is faster than LPDDR5x.
> - **High batch size (10–50 simultaneous requests):** favors high-memory-capacity systems and engines optimizing batching (vLLM with PagedAttention) — bandwidth is less limiting, capacity takes priority.
> - **Models > 70B:** only systems with 128 GB+ memory can compete — RTX 4090 vs DGX Spark comparison on a 70B is not possible on RTX 4090.

---

## See also

- [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A — Dev Lab]]
- [[04-blueprints/scenario-b-sme-appliance|🏢 Scenario B — SME Appliance]]
- [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scenario C — Desktop Cluster]]
- [[04-blueprints/scenario-d-datacenter|🏭 Scenario D — Datacenter]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|🔒 Sovereignty & Privacy]]
- [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluate a local model]]

---

## 📚 Sources and References

[^1]: OpenAI, *API pricing* (GPT-5.5 $5 / $30, GPT-5.6 Sol $4 / $20 on promotion at least until 2026-11-21, GPT-6 Sol $2 / $10, GPT-6 Luna $0.10 / $0.50, GPT-4o legacy $2.50 / $10 per million tokens), captured 2026-10-09. [https://developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing)
[^2]: Anthropic, *Pricing* (Claude Opus 5.5 $4 / $20, Sonnet 5.5 $2 / $10, Haiku 5.5 $0.10 / $0.50 per million tokens; Claude 3.5 Sonnet removed from the page), captured 2026-10-09. [https://platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing)
[^3]: Mistral AI, *Pricing* (Mistral Large 3: $0.50 / $1.50 per million tokens), captured 2026-10-09. [https://mistral.ai/pricing](https://mistral.ai/pricing) · Mistral AI, *Mistral Large 4* (API preview $1.36 / $4.18, open weights announced for late October 2026), 2026-10-06. [https://mistral.ai/news/mistral-large-4](https://mistral.ai/news/mistral-large-4)
[^4]: Groq, *GroqCloud — Models* (openai/gpt-oss-120b $0.15 / $0.60 per million tokens; Llama 3.3 70B and Llama 3.1 8B moved to "Enterprise / Contact sales", no public price), captured 2026-10-09. [https://console.groq.com/docs/models](https://console.groq.com/docs/models)
[^5]: Together AI, *Pricing* (Llama 3.3 70B $1.04 / $1.04; DeepSeek V4 Pro $1.32 / $3.96, DeepSeek V4.1 Flash $0.30 / $1.20, GLM-5.3 and Kimi K3 via OpenAI-compatible API), captured 2026-10-09. [https://www.together.ai/pricing](https://www.together.ai/pricing)
