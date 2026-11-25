---
title: MoE
description: Mixture of Experts — architecture activating only some sub-networks per token, enabling huge models with controlled inference cost.
aliases:
  - Mixture of Experts
tags:
  - lexique
  - fondations
last_modified: "2026-11-25"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Neural network architecture splitting the model into specialized “experts.” Per token, routing activates only a small subset — lowering compute cost versus a dense model of the same total size.

## 📖 Detailed definition

In a classic dense model (Llama, Mistral…), **all parameters** activate for every token. In MoE, only **top-k experts** (from 2 of 8 for Mixtral to 16 of 896 for Kimi K3[^2]) participate per step.

Concrete examples (as of Q4 2026):

| Model | Total parameters | Active parameters/token | VRAM required (Q4) |
| :-- | :-- | :-- | :-- |
| Llama 3.1 70B (dense) | 70 B | 70 B | ~40 GB |
| DeepSeek-V4.1-Flash (MoE, MIT) | 552 B + 196 B of Engram memory | 8 B (prefill) / 16 B (decode), 6 experts of 384 | ~510 GB as a native checkpoint (MXFP4 experts, the rest in FP8); 4× H200 or 2× B200 by offloading the Engram tables (≈ 183 GiB) to host RAM[^1] |
| Kimi K3 (MoE, custom license) | 2,800 B | 104 B (16 of 896 experts) | ~1.4 TB in native MXFP4[^2] |
| Qwen3-30B-A3B (MoE, Apache 2.0) | ~30 B | ~3 B active (8 of 128 experts) | ~18 GB in Q4[^3] |
| Nemotron 3.5 Lightning 30B-A3B (hybrid Mamba-2 + MoE, OpenMDW) | ~30 B | ~3 B active | ~22 GB in official NVFP4[^4] |
| GLM-5.3-Flash (MoE, MIT) | 320 B | 18 B active | ~320 GB in FP8 (8-GPU node)[^5] |
| Mistral Large 4 (MoE, modified MIT) | ~1,000 B | 52 B (4 routed experts of 128 + 1 shared) | ~610 GB in official NVFP4, ~1.06 TB in FP8 (8-GPU Blackwell node)[^10] |

MoE offers **large-model quality** with **smaller-model compute cost** — but requires loading **all experts in VRAM** even when most stay inactive.

## 💡 Why it matters for on-prem AI

Small active-parameter MoEs (Qwen3-30B-A3B, Nemotron 3.5 Lightning, gpt-oss-20b[^3][^4][^6]) suit APUs well: good answer quality, acceptable VRAM, good generation throughput.

Giant MoEs (DeepSeek V4.1-Flash: ~510 GB as a native FP4/FP8 checkpoint, ≈ 614 GB with the margin recommended by vLLM; Kimi K3: > 1.4 TB even in native 4-bit; the 2024 DeepSeek V3 already weighed 404 GB in Q4_K_M) need, to serve them, a datacenter GPU node (4 to 8 GPUs) or a multi-node cluster — Scenarios C or D; a single workstation can at most try them by reading the experts from SSD (see the pitfalls below)[^1][^2].

Watch the licenses: several open frontier MoEs of 2026 (Kimi K3, GLM-5.3, Qwen3.8-2.4T-A95B) ship under custom licenses to read before any commercial use. The rule is not absolute: datacenter-sized MoEs also ship under MIT, such as DeepSeek V4 / V4.1 (552B + 196B of Engram memory for V4.1-Flash)[^1] and, since September 2026, Xiaomi's MiMo-V2.6-Pro (1.02T parameters, 42B active)[^8]. Most small to mid-sized MoEs (Qwen3-30B-A3B, GLM-5.3-Flash, Nemotron 3.5) remain under Apache 2.0, MIT or OpenMDW. On Ollama, `kimi-k3:cloud` or `glm-5.2:cloud` are **hosted** tags, not downloadable weights (see [[03-stack-logicielle/choose-your-model|🗺️ Choose your model]]).

## ⚠️ Common pitfalls

- Comparing a “671B” MoE to a “70B” dense assuming dense is always faster: throughput depends on **active** parameters, not total.
- Partial MoE loading with a general-purpose engine: if experts do not fit in fast memory, swap (mmap, OS paging) is catastrophic because missing experts are invoked unpredictably. Notable exception: the n-gram embeddings of Qwen3.8-Flash-Next (51 B) are designed to be offloaded to RAM without that cost, unlike the experts[^7]. Since October 2026, dedicated engines such as InferSSD (Apache-2.0) keep an expert cache in VRAM and RAM and read the other experts from the NVMe SSD: according to its repository, DeepSeek-V4.1-Flash in Q8_0 generates 7.3 tokens/s on an RTX 5090 with 32 GB of RAM, versus 0.87 for llama.cpp (vendor measurements). It is a test bench for a single workstation, not a team server (limits in [[00-lexique/offloading|Offloading]])[^9].
- Underestimating VRAM: all weights must load even if only 2/64 experts activate per token.

## 📚 Go deeper

- [[01-fondations/quantization-4bit-8bit|🗜️ Quantization]]
- [[01-fondations/kv-cache-and-context|💾 KV Cache & context]]

## 🔗 See also

- [[00-lexique/llm|LLM]]
- [[00-lexique/quantification|Quantization]]
- [[00-lexique/tokens-per-second|Tokens per second]]
- [[00-lexique/vram|VRAM]]

[^1]: DeepSeek AI, *DeepSeek-V4.1-Flash* (MIT; 552 B + 196 B of Engram conditional memory, 8 B active in prefill / 16 B in decode, 1 shared expert + 384 routed, 6 of them active, FP4 KV cache; `config.json`: `expert_dtype` fp4, the rest in FP8; `model.safetensors.index.json`: 510,286,023,000 bytes), 2026-09-09. <https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash>; vLLM, *DeepSeek-V4.1-Flash — serving recipe* (checkpoint ≈ 511 GB / 476 GiB, MXFP4 experts, FP8 Engram tables ≈ 183 GiB, minimum 614 GB with margin; TP4 on H200 and TP2 on Blackwell with Engram tables in host RAM), accessed 2026-11-25. <https://recipes.vllm.ai/deepseek-ai/DeepSeek-V4.1-Flash.md>; unsloth, *DeepSeek-V3-GGUF* (Q4_K_M ≈ 404 GB), January 2025. <https://huggingface.co/unsloth/DeepSeek-V3-GGUF>
[^2]: Moonshot AI, *Kimi K3* (2.8 T parameters, 104 B active, 16 routed experts of 896 + 2 shared, native MXFP4 via QAT, Kimi K3 License), July 2026. <https://huggingface.co/moonshotai/Kimi-K3>
[^3]: Qwen, *Qwen3-30B-A3B* (30.5 B total, 3.3 B activated, 8 of 128 experts, Apache 2.0), 2025. <https://huggingface.co/Qwen/Qwen3-30B-A3B>
[^4]: NVIDIA, *NVIDIA-Nemotron-3.5-Lightning-30B-A3B* (hybrid Mamba-2 + MoE + attention, 30 B / 3 B active, OpenMDW 1.1; NVFP4 checkpoint ≈ 21.6 GB recommended for deployment), August 2026. <https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16> · <https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4>
[^5]: Z.ai, *GLM-5.3-Flash* (320 B total, 18 B active, hybrid sparse + linear attention, MIT), 2026. <https://huggingface.co/zai-org/GLM-5.3-Flash>
[^6]: OpenAI, *gpt-oss-120b / gpt-oss-20b* (gpt-oss-20b: 21 B total, 3.6 B active, MoE post-trained in MXFP4, fits in 16 GB), August 2025. <https://huggingface.co/openai/gpt-oss-120b>
[^7]: Qwen, *Qwen3.8-Flash-Next* (10 routed experts + 1 shared of 512; 51 B of n-gram embeddings "easier to offload than MoE experts"), August 2026. <https://huggingface.co/Qwen/Qwen3.8-Flash-Next>
[^8]: Xiaomi, *MiMo-V2.6-Pro-MOPD* (1.02T / 42B-active MoE, 1M context, text + image + video + audio, MIT license; RL checkpoint of 2026-09-21, MOPD update of 2026-09-27), Hugging Face. <https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-MOPD>
[^9]: WiCi, *InferSSD* (Apache-2.0; GGUF served from SSD, expert slices aligned on 4 KiB, RAM and VRAM expert cache; DeepSeek-V4.1-Flash-1017 Q8_0 on RTX 5090 + 32 GB of RAM: 164.5 tokens/s in prompt reading and 7.27 in generation, versus 8.06 and 0.87 for llama.cpp; vendor measurements, number of runs not published; first release v0.1.0 of 2026-10-30), accessed 2026-11-22. <https://github.com/wici-ai/inferssd> · <https://github.com/wici-ai/inferssd/blob/main/docs/benchmark.md>
[^10]: Mistral AI, *Mistral-Large-4-1T-A52B* (~1T total, 49 B active, 52 B with embeddings and output layer; 128 routed experts, 4 of them active + 1 shared; Mistral Ecosystem Open-Weight License), October 2026. <https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B> · vLLM Recipes, *mistralai/Mistral-Large-4-1T-A52B* (NVFP4 ≈ 610 GB, FP8 ≈ 1.06 TB), accessed 2026-11-25. <https://recipes.vllm.ai/mistralai/Mistral-Large-4-1T-A52B>
