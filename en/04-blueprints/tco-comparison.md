---
title: "💰 TCO Comparison: On-Premise vs Cloud API"
description: Total cost of ownership (TCO) analysis of the four on-premise blueprints versus cloud AI APIs in 2026 — hardware, energy, maintenance, and break-even point.
sidebar:
  order: 5
prices_valid_as_of: "2026-06"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
last_modified: "2026-06-09"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Cloud AI costs little at startup but a lot at scale. On-premise requires a high initial investment but marginal cost tends toward zero. The break-even point generally falls between 6 and 18 months depending on usage and blueprint.

---

## TCO calculation parameters

Before comparing, align the units. LLM usage is measured in **millions of tokens processed per month** — that is the cloud billing unit, and it is also the right denominator for calculating on-premise cost.

**Cloud side:** providers bill per token (input + output separately). In 2026, reference rates for 70B-class models:

> [!warning] Prices — validity
> Rates captured in **June 2026**. Cloud API prices change frequently (sometimes every 6–8 weeks).
> Verify official pricing pages before building a business case:
> [OpenAI Pricing](https://openai.com/pricing) · [Anthropic Pricing](https://www.anthropic.com/pricing) · [Mistral Pricing](https://mistral.ai/technology/#pricing) · [Groq Pricing](https://groq.com/pricing/)

| API | Input rate | Output rate | Model |
| :-- | :-- | :-- | :-- |
| OpenAI GPT-4o | ~$2.50/M tok | ~$10.00/M tok | Proprietary |
| Anthropic Claude 3.5 Sonnet | ~$3.00/M tok | ~$15.00/M tok | Proprietary |
| Mistral Large | ~$2.00/M tok | ~$6.00/M tok | Proprietary/open |
| Groq (Llama 3.3 70B) | ~$0.59/M tok | ~$0.79/M tok | Open weights, cloud |
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

**Cloud equivalent (33.75 M tokens/month, API rate ~$1.50/M tok average):**
- ~33.75 M × $1.50 = **~$50/month** (optimistic, open-weights cloud model)
- ~33.75 M × $5.00 = **~$170/month** (proprietary model)

| API choice | Cloud cost/month | Break-even |
| :-- | :-- | :-- |
| Groq / open-weights cloud (~$1/M tok) | ~€34/month | ❌ Never amortized on cost alone |
| Mistral / entry-level Claude (~$2/M tok) | ~€68/month | ~18 months |
| GPT-4o / Claude 3.5 (~$6/M tok average) | ~€205/month | **< 4 months** |

> [!tip] Sovereignty changes the calculation
> For an SME subject to GDPR processing client data, "open-weights cloud is cheaper" is not enough — a third-party host remains a recipient under GDPR. The on-premise premium of €80/month can avoid much higher legal fees.

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

Models in this class (DeepSeek V3 671B, Llama 400B) are not available directly via a standard API in 2026 — or only via specialized services at high prices (Together AI, Fireworks AI):

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

## See also

- [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A — Dev Lab]]
- [[04-blueprints/scenario-b-sme-appliance|🏢 Scenario B — SME Appliance]]
- [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scenario C — Desktop Cluster]]
- [[04-blueprints/scenario-d-datacenter|🏭 Scenario D — Datacenter]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|🔒 Sovereignty & Privacy]]
- [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluate a local model]]
