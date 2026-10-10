---
title: "🗺️ Choosing your local model"
description: Practical guide to navigating the open-weights LLM landscape — families, sizes, specializations, and on-premise scenario mapping.
sidebar:
  order: 4
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> There is no "best model." There is the model that fits in your VRAM, responds fast enough for your users, and passes your tests on your data. This chapter gives you the keys to narrow the list to three candidates — and [[06-mise-en-oeuvre/evaluate-local-model|the evaluation chapter]] tells you how to choose among them.

---

## Three questions before choosing

Before looking at a leaderboard, answer these three questions in order:

**1. What is your primary task?**

| Task | Recommended model profile |
| :-- | :-- |
| Chat / general assistant | Generalist instruction-tuned model |
| Document RAG (in French) | Strong instruction-following model, good long context |
| Custodian agent / code editing | Specialized coder model, 14B minimum |
| Summarization, extraction, classification | Compact fast model, 7–8B often sufficient |
| Reasoning / complex calculation | "Thinking" model (built-in chain-of-thought) |

**2. How much VRAM do you have?**

See [[01-fondations/quantization-4bit-8bit|Quantization]] to calculate exact footprint. In Q4_K_M, approximate rule[^1]:

| Available VRAM | Accessible model size |
| :-- | :-- |
| 8–12 GB | 7–8B |
| 16–24 GB | 14B — 24B with Q4 |
| 48 GB | 32–34B comfortably |
| 80 GB (H100) | 70B in FP8/Q8 (~70 GB) or ~120–140B in Q4[^7] |
| 128–160 GB (APU) | 70B Q8 or 120B Q4 |

**3. How many concurrent users?**

The more users, the smaller the model must be to leave VRAM for concurrent [[00-lexique/kv-cache|KV Cache]]. A 70B model that responds perfectly to one user can collapse at five.

> [!note] Direct link
> For the right inference engine by user count, see [[03-stack-logicielle/inference-engines-vllm-ollama|Inference engines]]. For the right hardware, see [[04-blueprints/scenario-a-dev-lab|Blueprints A–D]].

---

## The 2026 open-weights landscape

The market has stabilized around a few dominant families. Here is how to read them.

### Llama 3.x (Meta)

The generalist reference of previous generations. Llama 3.1/3.3 models are available in 8B, 70B, and 405B. Well documented, supported by all engines (Ollama, vLLM, TensorRT-LLM), with a permissive commercial license.

- **Llama 3.3 70B**: best quality/size ratio for most SME use cases. Strong instruction following, reasoning, and multilingual (including French).
- **Llama 3.1 8B**: good for constrained workstations or simple tasks. Visible limits on complex reasoning tasks.
- **Llama 3.1 405B**: requires a multi-GPU cluster (Scenario D). Performance close to frontier models on general tasks.

> [!note] Llama 4: MoE architecture, not suited to consumer GPUs
> Llama 4 Scout (109B total, 17B active, 16 experts) and Llama 4 Maverick (400B total, 17B active, 128 experts) were released in April 2025[^2]. **These models require datacenter servers** (H100 minimum with int4 quantization for Scout). They do not fit Scenarios A, B, or C in this vault. See [[04-blueprints/scenario-d-datacenter|Scenario D]].

### Llama 4 (Meta) — Scenario D only

Natively multimodal (text + image), MoE architecture.

- **Llama 4 Scout (109B total / 17B active, 16 experts)**: 10M token context. Fits on a single H100 with int4 quantization. Relevant only for Scenario D (datacenter).
- **Llama 4 Maverick (400B total / 17B active, 128 experts)**: 1M token context. Requires a full DGX host in FP8 or BF16. Performance comparable to frontier models on STEM benchmarks.

> [!warning] Llama 4 ≠ replacement for Llama 3.x for SMEs
> There is still no Llama 4 usable on a desktop machine, and Meta has not released any Llama since April 2025: its open line is now called **Muse Glimmer 30B** (Apache 2.0, text + image, ~24 GB in 4-bit)[^8]. For Scenarios A, B, and C, the Q4 2026 references are **Qwen3.8-27B**[^7] and **Muse Glimmer 30B**[^8]; Llama 3.3 70B remains a safe choice but is outclassed at equal size.

### Qwen3.8 / Qwen3 (Alibaba)

The most versatile family in the open-weights landscape, with excellent multilingual coverage (including French). As of Q4 2026:

- **Qwen3.8-27B** (dense, Apache 2.0, vision + video, 262k tokens): ~18 GB in Q4 via Ollama, the default choice for a 24 GB GPU and for code agents (SWE-bench Pro 61.7)[^7].
- **Qwen3-30B-A3B** (MoE, Apache 2.0): 3B active, ~18 GB in Q4, excellent throughput on APUs.
- **Qwen3.8-Flash-Next** and **Qwen3.8-2.4T-A95B** ("Qwen3.8-Max"): flagships under **custom** licenses (qwen-community-1.0, qwen3.8-max), to be read before any commercial use; datacenter size.

### DeepSeek (DeepSeek AI)

- **DeepSeek V4 / V4.1 (MIT)**: the current generation. **V4-Flash** (~300B, 1M tokens) and **V4.1-Flash** (552B + 196B of conditional memory, 8 to 16B active, FP4 KV cache) replace V3 and R1; reasoning is built in (adjustable effort), no more separate "R" model. Datacenter size (8× 80 GB GPU node minimum)[^10].
- **DeepSeek-R1 / V3 (2025)**: still available and well supported, but outclassed at equal cost.

> [!warning] MoE: do not confuse total and active
> A 671B MoE model requires **loading all experts in VRAM** even if only 8 experts out of 256 are active per token. DeepSeek V3 in Q4_K_M weighs ~404 GB of weights[^3]. See [[00-lexique/moe|MoE]] for details.

### Mistral / Mixtral (Mistral AI)

- **Mistral Small 4 (119B)** and **Mistral Medium 3.5 (128B)**: the current open line, with official NVFP4 checkpoints for Small 4[^11]. Mistral 7B and Mixtral 8x7B remain usable but date from 2023-2024.
- **Mistral Large 4** (~1T MoE, 52B active): announced on 6 October 2026 in API preview; open weights promised for late October, license not published at the time of writing — verify before planning a deployment[^12].

### Phi-4 / Phi-3 (Microsoft)

Compact models (3.8B–14B) with high reasoning quality for their size. Interesting for desktop use with little VRAM.

- **Phi-4 14B**: performance close to some 70B models on reasoning and code tasks, for 8 GB VRAM in Q4.

---

## Model → on-premise scenario mapping

| Scenario | Typical hardware | Recommended model | Use case |
| :-- | :-- | :-- | :-- |
| [[04-blueprints/scenario-a-dev-lab|A — Dev Lab]] | PC 16 GB VRAM + offloading | Qwen3.8-27B Q4 (~18 GB)[^7], Granite 4.2 8B[^9] or Gemma 4 E4B[^16] | Solo dev, testing, prototyping |
| [[04-blueprints/scenario-b-sme-appliance\|B — SME Appliance]] | APU 128 GB unified memory | Qwen3.8-27B[^7] or Muse Glimmer 30B[^8] (Q8 possible); Nemotron 3.5 Lightning 30B-A3B NVFP4 (~22 GB, 256k) for throughput[^13] | Team assistant, document RAG |
| [[04-blueprints/scenario-c-desktop-cluster\|C — Desktop Cluster]] | 2–4 Thunderbolt machines | GLM-5.3-Flash (320B / 18B active, MIT)[^14] or DeepSeek V4-Flash (MIT)[^10] | Advanced SME, highly capable model |
| [[04-blueprints/scenario-d-datacenter\|D — Datacenter]] | Multi-H100 / MI300X | DeepSeek V4.1-Flash / V4-Pro (MIT)[^10], GLM-5.3 (custom license)[^14], Kimi K3 (native MXFP4, custom license)[^15], Qwen3.8-2.4T-A95B (custom license); Llama 4 Scout / Maverick remain valid[^2] | Production 50+ users, SLA, multimodal |

---

## Specializations: when to choose a coder model?

Generalist models (Llama, general Qwen) can write code, but they are not built to **reliably modify an existing repository**. A custodian agent that must perform precise search-and-replace in Markdown or code needs a coder model.

Since 2026, 27–30B generalist models trained for agentic use (Qwen3.8-27B, Muse Glimmer 30B, Granite 4.2) have replaced the dedicated "Coder" variants: they outperform the 2024 Coder models on SWE-bench, and the coder / generalist distinction has blurred.

Practical rule (Q4 2026):

| Use | Minimum model | Recommended model |
| :-- | :-- | :-- |
| Code completion in an IDE | Granite 4.2 8B[^9] | Qwen3.8-27B[^7] |
| Custodian agent (controlled corrections) | Qwen3.8-27B[^7] | Muse Glimmer 30B[^8] |
| Autonomous agent (regular maintenance) | Qwen3.8-27B (Apache 2.0, 262k)[^7] | Muse Glimmer 30B (Apache 2.0, SWE-bench Verified 76.0)[^8] or Granite 4.2 30B (Apache 2.0)[^9] |

> [!warning] The 7B generalist trap for agents
> A 7B/8B generalist can answer a code question, but it often misses search-and-replace, corrupts YAML frontmatter, or loops on partial corrections. Infrastructure sovereignty does not compensate for a model too weak for the task. See [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] and [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Target architecture]].

---

## Reasoning models: when do you need them?

"Thinking" models (DeepSeek-R1, Qwen3 in thinking mode, Llama with chain-of-thought prompting) generate internal reasoning before the response. They are useful for:

- mathematical or logical problems;
- multi-step analyses (due diligence, audit);
- tasks where a reasoning error is costly.

In exchange:
- TTFT is longer (the model "thinks" before answering);
- reasoning tokens consume context and VRAM;
- they are oversized for simple tasks (extraction, classification, chat).

> [!note] Tip
> Use a reasoning model only if your task requires it. For a conversational RAG assistant, a good 70B generalist is faster and equally accurate.

---

## How to read a leaderboard without getting it wrong

Public rankings (Arena, Artificial Analysis, SWE-bench Pro, HELM) are useful for **initial orientation**, but do not replace your own tests.

> [!warning] Benchmark contamination
> Large static benchmarks (MMLU, HumanEval, MATH) are saturated in 2026 — their test data has partially leaked into training corpora. A high MMLU score does not predict performance on your internal documents. See [[06-mise-en-oeuvre/evaluate-local-model|Evaluating a local model]] for the full protocol.

What leaderboards still tell you usefully:

- **Arena (formerly LMSYS Chatbot Arena)**[^4]: human preference comparison, multi-turn. Useful for conversational quality, but as of Q4 2026 no open-weights model appears in the top 15: read it to position open families against each other, not against the APIs.
- **Hugging Face**: the Open LLM Leaderboard has been archived since 2025; use the Hub to check license, file sizes, and available quantizations, and Artificial Analysis (checking the index version) for a composite view[^5].
- **SWE-bench Pro V2 (Scale)**[^6]: the most representative for code agents (real GitHub issues, protocol frozen since September 2026). SWE-bench Verified has been saturated since summer 2026 (scores > 96%) and no longer discriminates.

**Where do open weights stand against closed models (October 2026)?** On Artificial Analysis' Intelligence Index v4.3, Claude Opus 5.5 scores 58, Claude Fable 5.1 and GPT-6 Astra 53; the best open-weights models follow at 46 (MiMo-V2.6-Pro, MIT), 45 (GLM-5.3) and 44 (Kimi K3)[^17]. On arena.ai, no open model appears in the top 15 as of 2026-10-08; the first, kimi-k3-max, ranks 16th[^4]. The gap is real, but it closes within a few quarters with each new open generation. For an on-premise reader, the question is therefore not the podium but the **level sufficient for the task**, measured on your own data: a Qwen3.8-27B that passes your golden dataset is worth more than a frontier model you can neither host nor audit.

---

## Selection checklist

Before downloading a model:

- [ ] Does the license allow commercial use? (Apache 2.0, MIT, Llama Community License)
- [ ] Does the model fit in your VRAM with the target quantization + KV Cache headroom?
- [ ] Does the target inference engine support it? (GGUF for Ollama, safetensors for vLLM)
- [ ] Do community evaluations exist for your language? (French is less covered than English)
- [ ] Do you have a golden dataset to test on your real data?
- [ ] For an agent: do you have a 14B+ coder, not a 7B generalist?

---

## See also

- [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluating a local model]] — test protocol, KPIs, golden dataset
- [[01-fondations/quantization-4bit-8bit|🗜️ Quantization]] — calculate VRAM footprint
- [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]] — choose the right engine by use case
- [[00-lexique/moe|MoE]] — understand Mixture of Experts architectures
- [[00-lexique/benchmark-llm|LLM benchmark]]

---

## 📚 Sources and references

[^1]: J. Wang et al., *Which Quantization Should I Use? A Unified Evaluation of llama.cpp Quantization on Llama-3.1-8B-Instruct* (Q4_K_M size reduction ≈ 69%, i.e. ≈ 0.5 byte/parameter + KV Cache headroom), arXiv:2601.14277, January 2026. [https://arxiv.org/abs/2601.14277](https://arxiv.org/abs/2601.14277)
[^2]: Meta AI, *The Llama 4 herd: natively multimodal AI innovation* (Scout 109B/17B active, Maverick 400B/17B active, MoE architecture), April 2025. [https://ai.meta.com/blog/llama-4-multimodal-intelligence/](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
[^3]: DeepSeek AI, *DeepSeek-V3* (671B, 37B active, native FP8 weights). [https://huggingface.co/deepseek-ai/DeepSeek-V3](https://huggingface.co/deepseek-ai/DeepSeek-V3); unsloth, *DeepSeek-V3-GGUF* (Q4_K_M: 9 files, ≈ 404 GB — all experts resident in VRAM), January 2025. [https://huggingface.co/unsloth/DeepSeek-V3-GGUF](https://huggingface.co/unsloth/DeepSeek-V3-GGUF)
[^4]: Arena, *Text Leaderboard* (multi-turn human preference ranking; snapshot of 2026-10-08: no open-weights model in the top 15, kimi-k3-max at rank 16). [https://arena.ai/leaderboard/text](https://arena.ai/leaderboard/text)
[^5]: Hugging Face, *Open LLM Leaderboard — archive*. [https://huggingface.co/docs/leaderboards/en/open_llm_leaderboard/archive](https://huggingface.co/docs/leaderboards/en/open_llm_leaderboard/archive); Artificial Analysis, *Intelligence Index v4.3* (2026-09-07). [https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3](https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3)
[^6]: Scale AI, *SWE-Bench Pro V2* (642 tasks, 11 repositories, 2026-09-22). [https://labs.scale.com/leaderboard/swe_bench_pro_public_v2](https://labs.scale.com/leaderboard/swe_bench_pro_public_v2); Vals AI, *SWE-bench Verified* (runs stopped on 2026-09-01, top > 96%). [https://www.vals.ai/benchmarks/swebench](https://www.vals.ai/benchmarks/swebench)
[^7]: Qwen, *Qwen3.8-27B* (dense, Apache 2.0, 262k context; BF16 ≈ 56 GB, Q4 via Ollama ≈ 18 GB — i.e. ~2 bytes/parameter in BF16 and ~0.6 in Q4), August 2026. [https://huggingface.co/Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)
[^8]: Meta, *Muse Glimmer 30B* (Apache 2.0, text + image, SWE-bench Verified 76.0), August 2026. [https://huggingface.co/meta-models/Muse-Glimmer-30B](https://huggingface.co/meta-models/Muse-Glimmer-30B)
[^9]: IBM, *Granite 4.2 30B* (Apache 2.0, OpenAI-format tool calling), 2026-08-25. [https://huggingface.co/ibm-granite/granite-4.2-30b](https://huggingface.co/ibm-granite/granite-4.2-30b)
[^10]: DeepSeek AI, *DeepSeek-V4.1-Flash* (MIT, 552B + 196B of Engram conditional memory, 8–16B active, FP4 KV cache 890 bytes/token), September 2026. [https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash); DeepSeek AI, *DeepSeek-V4-Flash-0731* (MIT, ~304B, 1M tokens), 2026-07-31. [https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731)
[^11]: Mistral AI, Hugging Face repositories (Mistral-Small-4-119B-2603 and its NVFP4 variant, Mistral-Medium-3.5-128B), captured 2026-10-09. [https://huggingface.co/mistralai](https://huggingface.co/mistralai)
[^12]: Mistral AI, *Mistral Large 4* (API preview, open weights announced for late October 2026, license not published), 2026-10-06. [https://mistral.ai/news/mistral-large-4](https://mistral.ai/news/mistral-large-4)
[^13]: NVIDIA, *Nemotron-3.5-Lightning-30B-A3B* (BF16 / NVFP4 ≈ 22 GB / GGUF, OpenMDW 1.1 license, 256k context on an 80 GB GPU), August 2026. [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16)
[^14]: Z.ai, *GLM-5.3-Flash* (320B MoE, 18B active, MIT), 2026-08-26. [https://huggingface.co/zai-org/GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash); Z.ai, *GLM-5.3* (`glm-5.3` license). [https://huggingface.co/zai-org/GLM-5.3](https://huggingface.co/zai-org/GLM-5.3)
[^15]: Moonshot AI, *Kimi K3* (native MXFP4; Kimi K3 License: separate agreement above $20M of MaaS revenue over 12 months). [https://huggingface.co/moonshotai/Kimi-K3](https://huggingface.co/moonshotai/Kimi-K3)
[^16]: Google, *Gemma 4 31B IT* (Apache 2.0; E2B / E4B / 26B-A4B / 31B family), April 2026. [https://huggingface.co/google/gemma-4-31b-it](https://huggingface.co/google/gemma-4-31b-it)
[^17]: Artificial Analysis, *Intelligence Index — model ranking* (Claude Opus 5.5 58, Claude Fable 5.1 53, GPT-6 Astra 53, MiMo-V2.6-Pro 46, GLM-5.3 45, Kimi K3 44; index v4.3 or revision 4.3.x), captured 2026-10-10. [https://artificialanalysis.ai/leaderboards/models](https://artificialanalysis.ai/leaderboards/models); Artificial Analysis, *Claude Opus 5.5* (58, "the highest score we have measured by several points"), 2026-09-22. [https://artificialanalysis.ai/articles/claude-opus-5-5](https://artificialanalysis.ai/articles/claude-opus-5-5)
