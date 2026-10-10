---
title: "💰 TCO Comparison: On-Premise vs Cloud API"
description: Total cost of ownership (TCO) analysis of the four on-premise blueprints versus cloud AI APIs — hardware, energy, maintenance, and break-even point.
sidebar:
  order: 5
prices_valid_as_of: "2026-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
last_modified: "2026-10-10"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Cloud AI costs little at startup but a lot at scale. On-premise requires a high initial investment but marginal cost tends toward zero. At October 2026 prices, the break-even point of an SME appliance (Blueprint B) is about 7 months against Claude Fable 5.1, 13 months against GPT-5.5, 19 months against Claude Opus 5.5, and is never reached against the budget tiers billed under $1 per million tokens — including Chinese APIs such as DeepSeek, whose data is processed outside the EU: in 2026, sovereignty, not cost, is the decisive argument for on-premise in an SME.

---

## TCO calculation parameters

Before comparing, align the units. LLM usage is measured in **millions of tokens processed per month** — that is the cloud billing unit, and it is also the right denominator for calculating on-premise cost.

**Cloud side:** providers bill per token (input + output separately). Reference rates captured in October 2026, from budget model to frontier model:

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
| Anthropic Claude Fable 5.1 / Mythos 5.1 (captured 2026-10-10)[^2] | $10.00/M tok | $50.00/M tok | Proprietary, frontier + (Mythos 5.1 in limited availability) |
| Anthropic Claude Opus 5.5[^2] | $4.00/M tok | $20.00/M tok | Proprietary, high-end |
| Anthropic Claude Sonnet 5.5[^2] | $2.00/M tok | $10.00/M tok | Proprietary, mid-range |
| Anthropic Claude Haiku 5.5 (prompt ≤ 100k)[^2] | $0.10/M tok | $0.50/M tok | Proprietary, budget |
| Mistral Large 3[^3] | $0.50/M tok | $1.50/M tok | Proprietary (open weights) |
| Mistral Large 4 (API preview of 2026-10-06)[^3] | $1.36/M tok | $4.18/M tok | Preview; open weights announced for late October 2026 |
| Groq (openai/gpt-oss-120b)[^4] | $0.15/M tok | $0.60/M tok | Open weights, cloud (Llama 3.3 70B: quote-based pricing since 2026) |
| Together AI (Llama 3.3 70B)[^5] | $1.04/M tok | $1.04/M tok | Open weights, cloud |
| DeepSeek V4.1 Flash (DeepSeek API, `deepseek-flash` model, peak hours; captured 2026-10-10)[^11] | $0.30/M tok | $1.20/M tok | Open weights, Chinese cloud — half price off-peak; **data processed in China, outside the EU and the United States** |
| Open-weights cloud API (70B–300B MoE)[^4][^5] | ~$0.15–1.40/M tok | ~$0.30–4.40/M tok | Together AI / Groq range, October 2026 |

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

## Blueprint A — Dev Lab (used 24 GB GPU or 64 GB unified memory)

**Suitable usage:** solo developer or team of 2–3 people, 8B–14B models.

| Item | Amount |
| :-- | :-- |
| Hardware (used RTX 3090/4090 PC, or Mac Studio M5 Max 64 GB at €3,659 incl. VAT, or Framework Desktop 64 GB at €2,209 incl. VAT — French prices captured 2026-10-09)[^7][^8] | €2,200 – €3,700 (4-year amortization) |
| Monthly amortization | ~€45 – €75/month |
| Electricity (150 W × 8 h/day × 30 days × €0.20/kWh, regulated tariff August 2026)[^12] | ~€7/month |
| **Total monthly cost** | **~€55 – €85/month** |

**Cloud equivalent (5 M input tokens + 2.5 M output tokens per month, October 2026 prices):**
- Haiku 5.5 or GPT-6 Luna ($0.10 / $0.50): 0.5 + 1.25 = **~$1.75/month (~€2)**
- Sonnet 5.5 or GPT-6 Sol ($2 / $10): 10 + 25 = **$35/month (~€32)**
- GPT-5.5 ($5 / $30): 25 + 75 = **$100/month (~€92)**
- Claude Fable 5.1 ($10 / $50): 50 + 125 = **$175/month (~€161)**

> [!note] Break-even point A
> At low volume (< 5 M tokens/month), cloud is often cheaper than a dedicated workstation — except against the most expensive frontier models (Fable 5.1: ~€161/month versus €55 to €85 on-premise) or if **data sovereignty** is non-negotiable. On-premise is justified from the first token if your data cannot leave your premises.

---

## Blueprint B — SME Appliance (Mac Studio / 128 GB APU)

**Suitable usage:** 10 to 50 users, 70B model, maximum confidentiality.

| Item | Amount |
| :-- | :-- |
| 128 GB appliance (Framework Desktop 128 GB at €3,889 incl. VAT, out of stock · Mac Studio M5 Max 128 GB, price on Apple's configurator · DGX Spark 128 GB ≈ $6,950 ≈ €6,400 — captured 2026-10-09)[^7][^8][^9] | €3,900 – €6,400, €4,500 retained (4-year amortization) |
| Monthly amortization | ~€95/month |
| Electricity (100 W × 12 h/day × 30 days × €0.20/kWh, regulated tariff August 2026)[^12] | ~€7/month |
| Maintenance, backup, support | ~€50/month |
| **Total monthly cost** | **~€155/month** |

**Cloud equivalent (22.5 M input tokens + 11.25 M output tokens per month, prices of 2026-10-09; Fable 5.1 and DeepSeek captured 2026-10-10):**
- Haiku 5.5 or GPT-6 Luna ($0.10 / $0.50): 2.25 + 5.6 = **~$8/month** (~€7, budget tier)
- DeepSeek V4.1 Flash, DeepSeek API at peak hours ($0.30 / $1.20): 6.75 + 13.5 = **~$20/month** (~€19, ~€9 off-peak — data processed in China)
- Sonnet 5.5 or GPT-6 Sol ($2 / $10): 45 + 112.5 = **~$158/month** (~€145, mid-range)
- GPT-5.5 ($5 / $30): 112.5 + 337.5 = **~$450/month** (~€414, frontier model)
- Claude Fable 5.1 ($10 / $50): 225 + 562.5 = **~$787/month** (~€724, frontier +)

| API choice (prices of 2026-10-09, $1 ≈ €0.92) | Cloud cost/month | Break-even |
| :-- | :-- | :-- |
| Budget: Haiku 5.5, GPT-6 Luna, Mistral Large 3 ($0.10–0.50 / $0.50–1.50)[^1][^2][^3] | ~€7 – 26/month | ❌ Never amortized on cost alone |
| Chinese budget: DeepSeek V4.1 Flash, DeepSeek API ($0.30 / $1.20 at peak hours, half off-peak)[^11] | ~€9 – 19/month | ❌ Never amortized on cost alone — and data processed in China, outside the EU |
| Open-weights cloud (Together AI Llama 3.3 70B, $1.04/M)[^5] | ~€32/month | ❌ Never amortized on cost alone |
| Mid-range: Sonnet 5.5, GPT-6 Sol ($2 / $10)[^1][^2] | ~€145/month | ~51 months (beyond the amortization period) |
| High-end: Opus 5.5, GPT-5.6 Sol ($4 / $20)[^1][^2] | ~€290/month | ~19 months |
| Frontier: GPT-5.5 ($5 / $30)[^1] | ~€414/month | **~13 months** |
| Frontier +: Claude Fable 5.1 ($10 / $50)[^2] | ~€724/month | **~7 months** |

*Break-even = €4,500 of capital / (monthly cloud cost − €57/month of on-premise running cost excluding amortization), formula from the "Calculate your own TCO" section: 4,500 / (724 − 57) ≈ 6.7 months against Fable 5.1; 4,500 / (414 − 57) ≈ 12.6 months against GPT-5.5.*

> [!tip] Sovereignty changes the calculation
> For an SME subject to GDPR processing client data, "open-weights cloud is cheaper" is not enough — a third-party host remains a recipient under GDPR, and an API operated from China (DeepSeek) adds a transfer outside the EU. Against budget APIs (Haiku 5.5, Mistral Large 3, DeepSeek, open-weights cloud), the on-premise premium is in the range of €120 to €150/month; against frontier models (GPT-5.5, Opus 5.5, Fable 5.1), on-premise is already cheaper. In the first case, that premium can avoid much higher legal fees.

---

## Blueprint C — Desktop Cluster (Exo / Thunderbolt)

**Suitable usage:** prototyping models > 100B, asynchronous batch processing.

| Item | Amount |
| :-- | :-- |
| 4× Mac mini M5 Pro 64 GB (base 24 GB at €1,999 incl. VAT, 64 GB option on Apple's configurator) or 4× Mac Studio M5 Max 64 GB at €3,659 incl. VAT — French prices captured 2026-10-09[^7] | ~€9,000 – €14,600 (4-year amortization) |
| Thunderbolt hub + cables | ~€300 |
| Monthly amortization | ~€195 – €310/month |
| Electricity (4 × 30 W × 16 h/day × 30 days × €0.20/kWh, regulated tariff August 2026)[^12] | ~€12/month |
| Maintenance and administration | ~€80/month |
| **Total monthly cost** | **~€285 – €400/month** |

**Cloud equivalent for models > 100B:**

Open-weights models in this class (DeepSeek V4, GLM-5.3, Kimi K3) are available via OpenAI-compatible APIs from specialized hosts (Together AI, Groq) at rates often lower than proprietary models — but hosted outside your premises[^5]:

| Service (prices of 2026-10-09, USD excluding tax) | 100B+ rate | Cost for 33.75 M tok/month (2/3 input) |
| :-- | :-- | :-- |
| Together AI (DeepSeek V4 Pro)[^5] | $1.32 / $3.96/M tok | ~$74 ≈ €68/month |
| Together AI (DeepSeek V4.1 Flash)[^5] | $0.30 / $1.20/M tok | ~$20 ≈ €18/month |
| On-demand GPU cloud (4× A100 80 GB at $2.79/h, or 4× H100 at $3.99/h, 24/7)[^6] | ~$8,150 – 11,650/month | ~€7,500 – €10,700/month (≈ €2,500 – €3,500 at 8 h/day) |

> [!note] Break-even point C
> Against 24/7 GPU cloud rental (€7,500 to €10,700/month), the desktop cluster is amortized in one to two months. Against serverless APIs serving the same open-weights models (DeepSeek V4 at Together AI: €18 to €68/month for 33.75 M tokens), it is never amortized on cost alone: its advantage is confidentiality, permanent access, and the absence of quotas.

*Calculation: €9,300 to €14,900 of capital / (€7,500/month of GPU cloud − €92/month of cluster running cost excluding amortization) ≈ 1.3 to 2 months.*

---

## Blueprint D — Datacenter (HGX 8-GPU)

**Suitable usage:** high-concurrency production, 50+ simultaneous users, strict SLA.

| Item | Amount |
| :-- | :-- |
| 8-GPU node (HGX H200; 8× RTX PRO 6000 server: $266k OEM list price; B300 node: on quote, ≈ $400k)[^13] | ~€300,000 – €450,000, €400,000 used (5-year amortization) |
| Infrastructure (network, cooling) + electricity (~10 kW × 8,760 h × €0.15–0.20/kWh ≈ €13,000 – €17,500/year)[^12] | ~€30,000 – €40,000/year, €35,000 used |
| Monthly hardware amortization | ~€6,700/month |
| Infrastructure + ops | ~€2,900/month |
| Dedicated infrastructure engineer (0.5 FTE) | ~€4,000/month |
| **Total monthly cost** | **~€13,600/month** |

**Cloud equivalent for SaaS production 50+ users:**

| Service | Estimated cost | Comment |
| :-- | :-- | :-- |
| Cloud API (500 M tok/month, 2/3 input, prices of 2026-10-09)[^1][^2] | ~$120 (Haiku 5.5) to ~$6,700/month (GPT-5.5); ~$11,700 (Fable 5.1) | No custom SLA guarantee; the HGX node only becomes cheaper beyond ~1 G tokens/month against GPT-5.5 (~0.6 G against Fable 5.1) |
| Dedicated GPU cloud (8× A100 80 GB on-demand, $2.79/GPU-h)[^6] | ~$16,000/month (8× H100: ~$23,000) | Strong SLA, but high cost |
| Reserved GPU cloud (1 year, H100 × 8)[^6] | ~$11,000/month ($1.9/GPU-h) to ~$32,000/month depending on the provider | 1-year commitment; request a quote |

> [!note] Break-even point D
> The HGX node becomes competitive after 28 to 49 months versus on-demand dedicated GPU cloud (Lambda prices of 2026-10-09)[^6], and only beyond about 1 billion tokens per month against a frontier API. Its real value is not purely economic: **full control** (data, models, SLA, model evolution), **5-year cost control**, and maximum regulatory compliance.

*Calculation: €400,000 / (€15,000/month of 8× A100 on-demand − €6,900/month of ops and infrastructure) ≈ 49 months; €400,000 / (€21,400/month of 8× H100 on-demand − €6,900) ≈ 28 months. API threshold: €13,600 ≈ $14,800/month ÷ $13.3/M weighted (GPT-5.5) ≈ 1.1 G tokens/month.*

---

## Summary — When to choose what?

```
Monthly token volume          Sovereignty constraint   → Recommended blueprint
─────────────────────────────────────────────────────────────────────────────
< 5 M tokens/month            Low                      → Cloud API (cost < on-prem)
< 5 M tokens/month            Strong (GDPR, trade secret) → Blueprint A or B
5–50 M tokens/month           Moderate                 → Blueprint B if the comparator is a frontier model (GPT-5.5, Opus 5.5, Fable 5.1); otherwise API
5–50 M tokens/month           Strong                   → Blueprint B mandatory
> 50 M tokens/month           Any                      → Blueprint B or D
100B+ models                  Any                      → Blueprint C (prototyping) or D (prod)
50+ simultaneous users        Strong                   → Blueprint D
```

### 3-year TCO — visual recap

| Blueprint | Cost/month | 3-year total | Equivalent cloud API 3 years (October 2026 prices, $1 ≈ €0.92) |
| :-- | :-- | :-- | :-- |
| A (dev lab, 5 M in + 2.5 M out/month) | ~€55 – €85 | ~€2,000 – €3,100 | ~€60 (Haiku 5.5) / ~€1,160 (Sonnet 5.5, GPT-6 Sol) / ~€3,300 (GPT-5.5) / ~€5,800 (Fable 5.1) |
| B (SME, 34 M tok/month) | ~€155 | ~€5,580 | ~€260 (Haiku 5.5) / ~€670 (DeepSeek V4.1 Flash) / ~€1,160 (Together AI Llama 3.3 70B) / ~€5,200 (Sonnet 5.5) / ~€10,400 (Opus 5.5) / ~€14,900 (GPT-5.5) / ~€26,100 (Fable 5.1) |
| C (cluster, 34 M tok/month, 100B+ models) | ~€285 – €400 | ~€10,300 – €14,400 | ~€670 (DeepSeek V4.1 Flash) / ~€2,460 (DeepSeek V4 Pro, Together AI) / ~€270,000 (4× A100 on-demand 24/7) |
| D (datacenter, 500 M tok/month) | ~€13,600 | ~€489,600 | ~€77,000 (Sonnet 5.5) / ~€221,000 (GPT-5.5) / ~€386,000 (Fable 5.1) / ~€365,000 – €540,000 (8 GPUs, from 1-year reserved H100 at $1.9/GPU-h to on-demand A100) |

*Calculation: monthly cloud cost from sections A to D × 36 months (Fable 5.1 and DeepSeek captured 2026-10-10); GPU cloud: ~$11,000/month reserved for 1 year at $1.9/GPU-h (table D) and 8× A100 on-demand ≈ $16,300/month (Lambda, 2026-10-09)[^6].*

> [!warning] Hidden costs not to forget
> - **Training and onboarding** of the team on the on-premise stack
> - **Administration time** (updates, monitoring, backups) — often underestimated
> - **Hardware obsolescence:** 2024–2025 GPUs may not optimally support 2027 models
> - **Memory prices:** contract DRAM +10–15% per quarter in Q4 2026 and increases expected every quarter through 2027 (TrendForce); DGX Spark 128 GB went from $3,999 to ≈ $6,950, RTX PRO 6000 from under $8,000 to $16,000 in one year. A hardware quote is only valid for a few weeks[^9][^14][^15].
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
| **Inference** (frozen model, generation) | Weights + KV cache | Fast GPU with sufficient VRAM | RTX 5090 (32 GB), L40S (48 GB), APU 128 GB |
| **LoRA fine-tuning** (adapters only) | Weights + gradients + optimizer states (~2–3× inference) | High-capacity unified memory or multi-GPU | Mac Studio M5 Ultra 256–512 GB, AMD Gorgon Halo 192 GB, DGX Spark 128 GB |
| **Full fine-tuning (complete SFT)** | Very high — often 2–4× raw weights in FP16 | Multi-GPU server or datacenter | 2–4× A100 80 GB, or DGX Station |
| **Full training (pre-training)** | Several hundred GB to several TB | Datacenter clusters — beyond SMB on-prem scope | H100, HGX/DGX systems |

> [!warning] Do not confuse profiles
> A GPU fast at inference (RTX 5090, 32 GB VRAM) can crash immediately on LoRA fine-tuning of a 70B model in FP16 — optimizer states inflate required memory to ~60–70 GB, well beyond available VRAM. Conversely, a high-capacity but slow-bandwidth system (e.g. AMD Gorgon Halo at ~273 GB/s) is suboptimal for serving 50 simultaneous users on a 7B model.

### The "tokens/s per k€" KPI for comparing inference options

To arbitrate between two inference hardware options, the ratio **tokens per second per thousand euros invested** (tokens/s/k€) is more meaningful than raw speed alone.

Example reading:
- RTX 5090 (32 GB, MSRP $1,999, but ≥ $5,000 ≈ €4,600 in stores in September 2026)[^10]: at ~60 tok/s on an 8B model → **~13 tok/s/k€** at the observed price, ~30 at MSRP — the ratio now depends as much on the shortage as on the silicon
- Mac Studio M5 Max 128 GB (~€5,000, 614 GB/s): if it delivers ~12–15 tok/s on a 70B Q4 → **~2.5–3 tok/s/k€**[^7]

These two figures are consistent: the Mac Studio serves much larger models than the RTX 5090 (32 GB), so direct comparison only makes sense for the **same model and same quantization**.

> [!warning] Limits of the tokens/s/k€ ratio
> This ratio depends strongly on **model**, **quantization**, and **batch size**:
> - **Batch size = 1 (single user):** favors GPUs with high GDDR bandwidth (RTX 5090, L40S) — autoregressive decoding is memory-bound, and GDDR is faster than LPDDR5x.
> - **High batch size (10–50 simultaneous requests):** favors high-memory-capacity systems and engines optimizing batching (vLLM with PagedAttention) — bandwidth is less limiting, capacity takes priority.
> - **Models > 70B:** only systems with 128 GB+ memory can compete — RTX 5090 vs DGX Spark comparison on a 70B is not possible on the RTX 5090 (32 GB); the DGX Spark 64 GB announced at $4,999 for 23 October 2026 does not change this rule: 64 GB remains tight for a 70B Q4 with context[^9].

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
[^2]: Anthropic, *Pricing* (Claude Opus 5.5 $4 / $20, Sonnet 5.5 $2 / $10, Haiku 5.5 $0.10 / $0.50 per million tokens, captured 2026-10-09; Claude Fable 5.1 and Claude Mythos 5.1 $10 / $50, captured 2026-10-10, Mythos 5.1 in limited availability; Claude 3.5 Sonnet removed from the page). [https://platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing)
[^3]: Mistral AI, *Pricing* (Mistral Large 3: $0.50 / $1.50 per million tokens), captured 2026-10-09. [https://mistral.ai/pricing](https://mistral.ai/pricing) · Mistral AI, *Mistral Large 4* (API preview $1.36 / $4.18, open weights announced for late October 2026), 2026-10-06. [https://mistral.ai/news/mistral-large-4](https://mistral.ai/news/mistral-large-4)
[^4]: Groq, *GroqCloud — Models* (openai/gpt-oss-120b $0.15 / $0.60 per million tokens; Llama 3.3 70B and Llama 3.1 8B moved to "Enterprise / Contact sales", no public price), captured 2026-10-09. [https://console.groq.com/docs/models](https://console.groq.com/docs/models)
[^5]: Together AI, *Pricing* (Llama 3.3 70B $1.04 / $1.04; DeepSeek V4 Pro $1.32 / $3.96, DeepSeek V4.1 Flash $0.30 / $1.20, GLM-5.3 $1.40 / $4.40 and Kimi K3 $3 / $15 via OpenAI-compatible API), captured 2026-10-09. [https://www.together.ai/pricing](https://www.together.ai/pricing)
[^6]: Lambda, *GPU Cloud Pricing* (on-demand: H100 SXM $3.99, A100 80 GB $2.79 per GPU-hour; H100 reserved 2 weeks to 1 year: $5.54 – 6.16), captured 2026-10-09. [https://lambda.ai/pricing](https://lambda.ai/pricing)
[^7]: Apple, *Mac Studio* and *Mac mini* — Apple Store France (Mac Studio M5 Max 64 GB €3,659 incl. VAT; Mac mini M5 Pro 24 GB €1,999 incl. VAT; 128 GB and 64 GB options on the configurator only), captured 2026-10-09. [https://www.apple.com/fr/shop/buy-mac/mac-studio](https://www.apple.com/fr/shop/buy-mac/mac-studio) · [https://www.apple.com/fr/shop/buy-mac/mac-mini](https://www.apple.com/fr/shop/buy-mac/mac-mini)
[^8]: Framework, *Framework Desktop — AMD Ryzen AI Max+ 395* (64 GB €2,209 incl. VAT, 128 GB €3,889 incl. VAT, out of stock), captured 2026-10-09. [https://frame.work/fr/fr/products/desktop-diy-amd-aimax300](https://frame.work/fr/fr/products/desktop-diy-amd-aimax300)
[^9]: ServeTheHome, *NVIDIA DGX Spark 64GB Launched and Big 128GB GB10 Price Increases* (DGX Spark 128 GB ≈ $6,950, launched at $3,999; 64 GB version at $4,999 via OEMs), 2026-10-03. [https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/](https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/) · NVIDIA Blog, *NVIDIA DGX Spark 64GB Gives Developers More Ways to Build and Scale Local AI* (same GB10, from $4,999, models up to 100B parameters, OEMs Acer, ASUS, Dell, Gigabyte, HP, MSI from Friday 23 October; two units linked over QSFP = 128 GB, models up to 200B), 2 October 2026. [https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/](https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/)
[^10]: Tom's Hardware, *Nvidia's RTX 5090 vanishes from online retail in the US* (up to $9,500 from third-party sellers for an MSRP of $1,999), 2026-09-14. [https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu](https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu)
[^11]: DeepSeek, *Models & Pricing* (`deepseek-flash`, served by DeepSeek-V4.1-Flash: $0.30 / $1.20 per million tokens at peak hours — 01:00–04:00 and 06:00–10:00 UTC, Monday to Friday excluding Chinese public holidays — and half price the rest of the time; `deepseek-v4-pro` $1.32 / $3.96), captured 2026-10-10. [https://api-docs.deepseek.com/quick_start/pricing](https://api-docs.deepseek.com/quick_start/pricing) · DeepSeek, *Privacy Policy* ("we directly collect, process and store your Personal Data in People's Republic of China"), 2026-02-10. [https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html)
[^12]: EDF, *Tarif Bleu — offre d'électricité au tarif réglementé* (Base option: €0.2001 incl. VAT/kWh since 2026-08-01), captured 2026-10-09. [https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html](https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html)
[^13]: AMD, *AAI 2026: AMD Delivers Full-Stack Compute for the Agentic AI Era* (note 8: 8× RTX PRO 6000 server at an OEM list price of $265,928 as of 2026-07-16; MI350P server estimated at $327,238), 23 July 2026. [https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era](https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era)
[^14]: TrendForce, press release of 30 September 2026 (contract DRAM prices up 10–15% in Q4 2026, increases expected over the following quarters). [https://www.trendforce.com/presscenter/news/20260930-13258.html](https://www.trendforce.com/presscenter/news/20260930-13258.html)
[^15]: Tom's Hardware, *Nvidia doubles RTX PRO 6000 Blackwell's MSRP to a staggering $16,000* (96 GB, pre-orders below $8,000 in 2025), August 2026. [https://www.tomshardware.com/pc-components/gpus/nvidia-doubles-rtx-pro-6000-blackwells-msrp-to-a-staggering-usd16-000-96gb-card-started-pre-orders-below-usd8-000-last-year](https://www.tomshardware.com/pc-components/gpus/nvidia-doubles-rtx-pro-6000-blackwells-msrp-to-a-staggering-usd16-000-96gb-card-started-pre-orders-below-usd8-000-last-year)
