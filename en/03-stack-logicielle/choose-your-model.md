---
title: "🗺️ Choosing your local model"
description: Practical guide to navigating the open-weights LLM landscape in 2026 — families, sizes, specializations, and mapping to on-premise scenarios.
sidebar:
  order: 4
last_modified: "2026-06-04"
---

> [!tip] In brief
> There is no single "best model." There is the model that fits your VRAM, responds fast enough for your users, and passes your tests on your data. This chapter gives you the keys to narrow the list to three candidates — and [[06-mise-en-oeuvre/evaluate-local-model|the evaluation chapter]] tells you how to pick among them.

---

## Three questions before you choose

Before looking at a leaderboard, answer these three questions in order:

**1. What is your primary task?**

| Task | Recommended model profile |
| :-- | :-- |
| Chat / general assistant | Generalist instruction-tuned model |
| Document RAG (in French) | Strong instruction following, good long context |
| Custodian agent / code editing | Specialized coder model, 14B minimum |
| Summarization, extraction, classification | Compact fast model, 7–8B often enough |
| Reasoning / complex calculation | "Thinking" model (built-in chain-of-thought) |

**2. How much VRAM do you have?**

See [[01-fondations/quantization-4bit-8bit|Quantization]] to compute exact footprint. In Q4_K_M, rough rule:

| Available VRAM | Accessible model size |
| :-- | :-- |
| 8–12 GB | 7–8B |
| 16–24 GB | 14B — 24B with Q4 |
| 48 GB | 32–34B comfortably |
| 80 GB (H100) | 70B in BF16 or 140B in Q4 |
| 128–160 GB (APU) | 70B Q8 or 120B Q4 |

**3. How many concurrent users?**

The more users, the smaller the model must be to leave VRAM for concurrent [[00-lexique/kv-cache|KV Cache]]. A 70B model that answers perfectly for one user can collapse at five.

> [!note] Direct link
> For the right inference engine by user count, see [[03-stack-logicielle/inference-engines-vllm-ollama|Inference engines]]. For the right hardware, see [[04-blueprints/scenario-a-dev-lab|Blueprints A–D]].

---

## The open-weights landscape in 2026

The market has stabilized around a few dominant families. Here is how to read them.

### Llama 3.x (Meta)

The generalist reference. Llama 3.1/3.3 models are available in 8B, 70B, and 405B. Well documented, supported by all engines (Ollama, vLLM, TensorRT-LLM), with a permissive commercial license.

- **Llama 3.3 70B:** Best quality/size ratio for most SMB use cases. Strong instruction following, reasoning, and multilingual (including French).
- **Llama 3.1 8B:** Good for constrained workstations or simple tasks. Visible limits on complex reasoning tasks.
- **Llama 3.1 405B:** Requires a multi-GPU cluster (scenario D). Performance close to frontier models on general tasks.

### Qwen 2.5 / Qwen3 (Alibaba)

The most versatile family in the 2026 open-weights landscape, with excellent multilingual coverage (including French) and specialized variants.

- **Qwen 2.5 72B:** Direct competitor to Llama 3.3 70B, often slightly ahead on code and reasoning tasks.
- **Qwen 2.5 Coder 32B:** Best candidate for custodian agents — specialized in code editing, search-and-replace, patch generation. 32B fits on a 48 GB VRAM workstation.
- **Qwen3-A3B (MoE):** 3B active parameters, ~18 GB in Q4. Excellent throughput, surprising quality for its active size, ideal on constrained APUs.

### DeepSeek (DeepSeek AI)

- **DeepSeek-R1:** Reasoning model with built-in chain-of-thought. Excellent on math and logic tasks. Available in 7B–70B distillations and full 671B (MoE) version.
- **DeepSeek V3 (MoE, 671B):** Very high total parameters but ~37B active per token. Quality close to GPT-4o on many benchmarks. Requires a cluster (scenario C or D).

> [!warning] MoE: do not confuse total and active
> A 671B MoE model requires **loading all experts into VRAM** even if only 2/64 are active per token. DeepSeek V3 needs ~390 GB total VRAM. See [[00-lexique/moe|MoE]] for detail.

### Mistral / Mixtral (Mistral AI)

- **Mistral 7B:** Compact, capable model, Apache 2.0 license. Good starting point for tests.
- **Mixtral 8x7B (MoE):** 47B total parameters, ~13B active. 26 GB in Q4 — fits on a 32 GB workstation. Good throughput on synthesis and RAG tasks.
- **Mistral Large 2 (123B):** Performance comparable to Llama 3.1 405B on some benchmarks, but less used on-premise due to size.

### Phi-4 / Phi-3 (Microsoft)

Compact models (3.8B–14B) with high reasoning quality for their size. Interesting for desktop use with little VRAM.

- **Phi-4 14B:** Performance close to some 70B models on reasoning and code tasks, for 8 GB VRAM in Q4.

---

## Model → on-premise scenario mapping

| Scenario | Typical hardware | Recommended model | Use case |
| :-- | :-- | :-- | :-- |
| [[04-blueprints/scenario-a-dev-lab\|A — Dev Lab]] | PC 16 GB VRAM + offloading | Llama 3.1 8B / Phi-4 14B | Solo dev, tests, prototyping |
| [[04-blueprints/scenario-b-sme-appliance\|B — SMB Appliance]] | APU 128 GB unified memory | Qwen 2.5 72B Q4 or Llama 3.3 70B Q4 | Team assistant, document RAG |
| [[04-blueprints/scenario-c-desktop-cluster\|C — Desktop Cluster]] | 2–4 Thunderbolt machines | DeepSeek V3 (MoE) or Llama 405B | Advanced SMB, very capable model |
| [[04-blueprints/scenario-d-datacenter\|D — Datacenter]] | Multi-H100 / MI300X | Llama 3.1 405B BF16, DeepSeek V3 | 50+ users production, SLA |

---

## Specializations: when to choose a coder model?

Generalist models (Llama, general Qwen) can write code, but they are not built to **reliably modify an existing repository**. A custodian agent that must perform precise search-and-replace in Markdown or code needs a coder model.

Practical rule:

| Use | Minimum model | Recommended model |
| :-- | :-- | :-- |
| Code completion in an IDE | Qwen 2.5 Coder 7B | Qwen 2.5 Coder 14B |
| Custodian agent (controlled fixes) | Qwen 2.5 Coder 14B | Qwen 2.5 Coder 32B |
| Autonomous agent (regular maintenance) | Qwen 2.5 Coder 32B | DeepSeek Coder V2 (16B active) |

> [!warning] The 7B generalist trap for agents
> A 7B/8B generalist can answer a code question, but it often misses search-and-replace, corrupts YAML frontmatter, or loops on partial fixes. Infrastructure sovereignty does not compensate for a model too weak for the task. See [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] and [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Target architecture]].

---

## Reasoning models: when do you need them?

"Thinking" models (DeepSeek-R1, Qwen3 in thinking mode, Llama with chain-of-thought prompting) generate internal reasoning before the answer. They are useful for:

- math or logic problems;
- multi-step analysis (due diligence, audit);
- tasks where a reasoning error is costly.

Trade-offs:
- TTFT is longer (the model "thinks" before answering);
- reasoning tokens consume context and VRAM;
- they are oversized for simple tasks (extraction, classification, chat).

> [!note] Tip
> Use a reasoning model only if your task requires it. For a conversational RAG assistant, a good 70B generalist is faster and equally accurate.

---

## How to read a leaderboard without getting it wrong

Public rankings (Chatbot Arena, Open LLM Leaderboard, HELM) are useful for **initial orientation**, but do not replace your own tests.

> [!warning] Benchmark contamination
> Large static benchmarks (MMLU, HumanEval, MATH) are saturated in 2026 — their test data has partially leaked into training corpora. A high MMLU score does not predict performance on your internal documents. See [[06-mise-en-oeuvre/evaluate-local-model|Evaluate a local model]] for the full protocol.

What leaderboards still tell you usefully:

- **Chatbot Arena (LMSYS):** Human preference comparison, multi-turn — good indicator of general conversational quality.
- **Open LLM Leaderboard (HuggingFace):** Tracking of open-weights models, versions, and available quantizations.
- **SWE-bench:** The only leaderboard truly representative for code agents — measures on real GitHub issues.

---

## Selection checklist

Before downloading a model:

- [ ] Does the license allow commercial use? (Apache 2.0, MIT, Llama Community License)
- [ ] Does the model fit your VRAM with target quantization + KV Cache headroom?
- [ ] Does your target inference engine support it? (GGUF for Ollama, safetensors for vLLM)
- [ ] Do community evaluations exist for your language? (French is less covered than English)
- [ ] Do you have a golden dataset to test on your real data?
- [ ] For an agent: do you have a 14B+ coder, not a 7B generalist?

---

## See also

- [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluate a local model]] — test protocol, KPIs, golden dataset
- [[01-fondations/quantization-4bit-8bit|🗜️ Quantization]] — compute VRAM footprint
- [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]] — choose the right engine by use case
- [[00-lexique/moe|MoE]] — understand Mixture of Experts architectures
- [[00-lexique/benchmark-llm|Benchmark LLM]]
