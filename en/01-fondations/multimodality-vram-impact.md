---
title: "🖼️ Multimodality: Hardware Impact (VRAM & KV Cache)"
description: What changes in your infrastructure when processing images, scanned documents, or audio — visual encoders, VRAM cost, KV Cache interaction, and blueprint mapping.
sidebar:
  order: 6
last_modified: "2026-06-05"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] In brief
> Adding vision to an LLM adds a **visual encoder** that consumes 1–4 GB of VRAM and converts each image into hundreds to thousands of tokens — the equivalent of a long document in terms of KV Cache usage. A 1024×1024 image can occupy as much context space as a 2,000-word document.

---

## Why multimodality changes the hardware equation

A pure LLM processes text: each token is a numerical vector from a vocabulary. Memory complexity is predictable and well-documented.

A **VLM (Vision Language Model)** adds an upstream component: a **visual encoder** that transforms image pixels into a sequence of vectors the LLM can "read". This additional path has direct consequences for [[00-lexique/vram|VRAM]], the [[00-lexique/kv-cache|KV Cache]], and latency.

---

## The visual encoder: anatomy and VRAM footprint

### How it works

```
Image (pixels)
    │
    ▼
Visual encoder (e.g. CLIP-ViT-L/14, SigLIP)
    │  splits image into patches (e.g. 14×14 px)
    │  encodes each patch as a vector
    ▼
Visual token sequence (e.g. 256 to 1,024 tokens)
    │
    ▼
Projector (MLP bridge) ──► LLM backbone (Qwen, Mistral, LLaMA…)
```

The encoder and projector are additional weights loaded **on top of** the LLM backbone.

### Approximate VRAM footprint by model family

| VLM model | LLM backbone | Visual encoder | Total VRAM (FP16) | Visual tokens / image |
| :-- | :-- | :-- | :-- | :-- |
| LLaVA 1.6 (Mistral 7B) | 7B | CLIP-ViT-L/14 (~0.3 GB) | ~15 GB | 256–576 |
| Qwen2-VL 7B | 7B | SigLIP-SO400M (~0.4 GB) | ~16 GB | 256–1,024 (dynamic) |
| Qwen2-VL 72B | 72B | SigLIP-SO400M (~0.4 GB) | ~144 GB | 256–1,024 (dynamic) |
| Pixtral 12B (Mistral) | 12B | Vision encoder 400M (~0.8 GB) | ~26 GB | up to 1,024 |
| Gemma 3 27B Vision | 27B | SigLIP (~0.4 GB) | ~54 GB | 256–729 |

> [!note] Order of magnitude
> The visual encoder itself typically weighs **0.3 to 1 GB** of VRAM — negligible compared to the backbone. The dominant memory impact comes from **visual tokens injected into the KV Cache**, not from the encoder itself.

---

## Impact on the KV Cache

The KV Cache stores intermediate states for each token in the context. Visual tokens behave **exactly like text tokens**: they occupy the same amount of space per token.

### Reference formula

For an FP16 model:

```
KV Cache per token = 2 (K+V) × num_layers × head_dim × 2 bytes
```

For a typical 7B LLM (32 layers, 128 head dim):

```
≈ 2 × 32 × 128 × 2 = 16,384 bytes ≈ 16 KB per token
```

### Text vs image comparison

| Input | Typical tokens | Estimated KV Cache (7B) |
| :-- | :-- | :-- |
| 500-word text document | ~650 tokens | ~10 MB |
| 512×512 image (LLaVA 1.6) | ~256 tokens | ~4 MB |
| 1024×1024 image (LLaVA 1.6 HD) | ~576 tokens | ~9 MB |
| 1024×1024 image (Qwen2-VL dynamic) | ~1,024 tokens | ~16 MB |
| 10-page PDF converted to images | ~5,000–10,000 tokens | ~80–160 MB |

> [!warning] Cumulative effect in a batch
> In production with multiple concurrent requests (vLLM continuous batching), each image in the batch occupies its KV Cache slot. Ten simultaneous 1024×1024 images on a Qwen2-VL 7B: ~160 MB of KV Cache for images alone, before any text context.

---

## Audio: Whisper as pre-processing

Audio transcription (meetings, dictation, client calls) is often mentioned alongside vision, but its architecture is fundamentally different.

**Whisper is not a VLM.** It is an independent sequence-to-sequence model:

```
Audio (WAV/MP3)
    │
    ▼
Whisper (separate model — 39 MB to 1.5 GB depending on size)
    │  transcribes to text
    ▼
Text (normal tokens)
    │
    ▼
LLM backbone (if transcript analysis is needed)
```

### Whisper VRAM footprint

| Whisper model | Parameters | VRAM |
| :-- | :-- | :-- |
| tiny | 39 M | ~80 MB |
| base | 74 M | ~145 MB |
| small | 244 M | ~480 MB |
| medium | 769 M | ~1.5 GB |
| large-v3 | 1.5 B | ~3 GB |

> [!tip] Whisper can run on CPU
> For non-real-time transcription (batch), Whisper works well on CPU with `whisper.cpp`. GPU VRAM is only mobilised if you force GPU transcription for real-time latency.

**Architectural consequence:** Whisper can coexist with a VLM on the same machine without significant VRAM competition, provided they are not run simultaneously on the GPU. In an asynchronous pipeline (transcription → LLM summary), a sequential approach works perfectly on Blueprint B.

---

## Blueprint map

| Blueprint | VLM feasible? | Recommended model | Main constraint |
| :-- | :-- | :-- | :-- |
| A — Dev Lab (RTX 4090, 24 GB) | ✅ Yes | LLaVA 1.6 7B, Qwen2-VL 7B | HD images limited in simultaneous batch |
| A — Dev Lab (64 GB unified memory) | ✅ Yes | Qwen2-VL 7B or Pixtral 12B | Unified memory bandwidth is the limiting factor |
| B — SME Appliance (128 GB unified memory) | ✅ Yes | Qwen2-VL 7B or 72B Q4 | 70B with vision is slow but functional |
| C — Desktop Cluster (4× 64 GB unified) | ✅ Yes | Pixtral 12B, Qwen2-VL 72B distributed | Exo required to distribute a 72B vision model |
| D — Datacenter (8× 80 GB GPU) | ✅ Yes | Qwen2-VL 72B, Pixtral Large | High-concurrency production use case |

> [!note] VRAM budgeting
> To add vision to your blueprint, estimate: **backbone VRAM + 0.5–1 GB (encoder) + 20–30% additional KV Cache margin** for visual requests in batch.

---

## Production watchpoints

1. **Context length surprises**: a "simple" request (image + short question) can consume 1,500–2,000 tokens, where the equivalent text-only question used only 50. Adjust `max_model_len` in vLLM accordingly.

2. **Asymmetric prefill**: prefilling an image (passing all visual tokens through the transformer) is computationally denser than an equivalent text prefill in tokens. Time-to-first-token (TTFT) is higher.

3. **Resolution and tiling**: modern VLMs (LLaVA 1.6 HD, Qwen2-VL) dynamically adapt the number of visual tokens to image resolution. Sending unresized images can multiply cost by 4–8×.

4. **Partial quantisation**: visual encoders handle aggressive quantisation poorly (Q4 or Q2). If you quantise the backbone to save VRAM, keep the visual encoder in FP16 or Q8.

---

## See also

- [[00-lexique/kv-cache|KV Cache]] — detailed attention cache mechanics
- [[00-lexique/vram|VRAM]] — model memory footprint
- [[01-fondations/quantization-4bit-8bit|🗜️ Quantisation 4-bit & 8-bit]] — reducing VRAM footprint
- [[01-fondations/kv-cache-and-context|🧠 KV Cache and context window]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|💾 Unified memory vs RAM vs VRAM]]
- [[04-blueprints/scenario-b-sme-appliance|🏢 Scenario B — SME Appliance]]
