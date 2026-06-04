---
title: 📖 AI Glossary
description: Lexicon of technical terms and acronyms used in the vault.
---

This glossary centralizes key on-prem AI concepts.  
Use it as a quick entry point, then open detailed entries.

**Full index**: [[00-lexique/lexicon-index|all lexicon entries]] (alphabetical list, updated at build).

---

## 🚶 Beginner — getting started

*Not sure where to begin:*

[[00-lexique/llm|LLM]] → [[00-lexique/inference|LLM inference]] → [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt]] → [[00-lexique/prefill|Prefill]] / [[00-lexique/decoding|Decoding]] → [[00-lexique/memory-wall|Memory Wall]] → [[01-fondations/memory-bandwidth|🏎️ Memory Bandwidth]]

---

## Recommended paths

- **Inference performance**: [[00-lexique/inference|LLM inference]], [[00-lexique/memory-wall|Memory Wall]], [[00-lexique/memory-bandwidth|Memory bandwidth]], [[00-lexique/prefill|Prefill]], [[00-lexique/decoding|Decoding]], [[00-lexique/tokens-per-second|Tokens per second]], [[00-lexique/ttft|TTFT]].
- **Memory & hardware**: [[00-lexique/vram|VRAM]], [[00-lexique/ram|RAM]], [[00-lexique/unified-memory|Unified memory]], [[00-lexique/pcie|PCIe]], [[00-lexique/multi-gpu|Multi-GPU]], [[00-lexique/nvlink|NVLink]], [[00-lexique/nvswitch|NVSwitch]].
- **Production AI systems**: [[00-lexique/quantification|Quantization]], [[00-lexique/quantification-q4|Q4 quantization]], [[00-lexique/kv-cache|KV Cache]], [[00-lexique/rag|RAG]], [[00-lexique/rdma|RDMA]], [[00-lexique/roce|RoCE]], [[00-lexique/infiniband|InfiniBand]].
- **Datacenter networking**: [[00-lexique/pfc|PFC]], [[00-lexique/ecn|ECN]], [[00-lexique/nccl|NCCL]], [[00-lexique/gpudirect-rdma|GPUDirect RDMA]].
- **Model evaluation**: [[00-lexique/benchmark-llm|LLM benchmark]], [[00-lexique/llm-as-a-judge|LLM-as-a-judge]], [[00-lexique/ragas|RAGAS]].

---

## Acronym index

| Acronym | Meaning |
| :-- | :-- |
| [[00-lexique/apu\|APU]] | Accelerated Processing Unit |
| [[00-lexique/ecn\|ECN]] | Explicit Congestion Notification |
| [[00-lexique/hbm\|HBM]] | High Bandwidth Memory |
| [[00-lexique/infiniband\|IB]] | InfiniBand |
| [[00-lexique/kv-cache\|KV]] | Key-Value |
| [[00-lexique/llm\|LLM]] | Large Language Model |
| [[00-lexique/moe\|MoE]] | Mixture of Experts |
| [[00-lexique/nccl\|NCCL]] | NVIDIA Collective Communications Library |
| [[00-lexique/npu\|NPU]] | Neural Processing Unit |
| [[00-lexique/pcie\|PCIe]] | Peripheral Component Interconnect Express |
| [[00-lexique/pfc\|PFC]] | Priority Flow Control |
| [[00-lexique/quantification-q4\|Q4]] | 4-bit quantization |
| [[00-lexique/rag\|RAG]] | Retrieval-Augmented Generation |
| [[00-lexique/ram\|RAM]] | Random Access Memory |
| [[00-lexique/rdma\|RDMA]] | Remote Direct Memory Access |
| [[00-lexique/roce\|RoCE]] | RDMA over Converged Ethernet |
| [[00-lexique/tflops\|TFLOPS]] | Tera Floating Point Operations Per Second |
| [[00-lexique/ttft\|TTFT]] | Time To First Token |
| [[00-lexique/vram\|VRAM]] | Video RAM |

---

## LLM foundations

| Term | Quick definition |
| :-- | :-- |
| [[00-lexique/tokenisation\|Tokenisation]] | Splitting text into numeric units the model processes. |
| [[00-lexique/embedding\|Embedding]] | Coordinate vector encoding a token’s meaning. |
| [[00-lexique/attention\|Attention]] | Mechanism weighting each token’s importance in context. |

---

## Memory & performance

| Term | Quick definition |
| :-- | :-- |
| [[00-lexique/memory-wall\|Memory Wall]] | Performance limit from memory transfers rather than compute. |
| [[00-lexique/memory-bandwidth\|Memory bandwidth]] | Memory data transfer rate, often in GB/s. |
| [[00-lexique/prefill\|Prefill]] | Prompt ingestion phase, more parallel. |
| [[00-lexique/decoding\|Decoding]] | Autoregressive token-by-token phase, often memory-bound. |
| [[00-lexique/kv-cache\|KV Cache]] | Cached attention keys/values to speed generation. |
| [[00-lexique/tokens-per-second\|Tokens/s]] | Generation throughput in tokens per second. |

---

## Software stack

| Term | Quick definition |
| :-- | :-- |
| [[00-lexique/pagedattention\|PagedAttention]] | KV Cache managed in virtual blocks; key to vLLM production. |
| [[00-lexique/gguf\|GGUF]] | Portable format for local inference with llama.cpp/Ollama. |
| [[00-lexique/tensorrt-llm\|TensorRT-LLM]] | NVIDIA SDK for highly optimized datacenter GPU compilation. |
| [[00-lexique/exo\|Exo]] | P2P orchestrator for desktop AI clusters (Mac Mini + Thunderbolt). |
| [[00-lexique/ray\|Ray]] | Distributed framework for multi-node production deployment. |
| [[00-lexique/pipeline-parallelism\|Pipeline Parallelism]] | Splitting a model into layer slices across nodes. |
| [[00-lexique/tensor-parallelism\|Tensor Parallelism]] | Splitting matrices within one NVLink multi-GPU node. |
| [[00-lexique/thunderbolt\|Thunderbolt]] | Desktop interconnect up to 80 Gb/s for Exo clusters. |

---

## Infrastructure & architecture

| Term | Quick definition |
| :-- | :-- |
| [[00-lexique/unified-memory\|Unified memory]] | Shared CPU/GPU/NPU memory pool in an SoC. |
| [[00-lexique/offloading\|Offloading]] | Partial move of weights/activations across memory tiers by capacity. |
| [[00-lexique/multi-gpu\|Multi-GPU]] | Several GPUs for more capacity and/or throughput. |
| [[00-lexique/nvlink\|NVLink]] | High-bandwidth GPU interconnect (pro/datacenter tiers). |
| [[00-lexique/nvswitch\|NVSwitch]] | Non-blocking NVLink fabric among all GPUs in an HGX node. |
| [[00-lexique/pcie\|PCIe]] | Standard CPU↔GPU bus; inter-GPU bottleneck without NVLink. |

---

## Networking & clustering

| Term | Quick definition |
| :-- | :-- |
| [[00-lexique/rdma\|RDMA]] | Memory-to-memory transfer without CPU copy for multi-node clusters. |
| [[00-lexique/roce\|RoCE]] | RDMA over Ethernet; needs PFC + ECN for lossless operation. |
| [[00-lexique/infiniband\|InfiniBand]] | Dedicated HPC/AI network fabric, natively lossless, ~400–800 Gb/s. |
| [[00-lexique/gpudirect-rdma\|GPUDirect RDMA]] | Direct VRAM↔NIC transfer without CPU copy. |
| [[00-lexique/nccl\|NCCL]] | NVIDIA library for GPU-to-GPU collective communication. |
| [[00-lexique/pfc\|PFC]] | Priority Flow Control — per-priority pause for lossless RoCE. |
| [[00-lexique/ecn\|ECN]] | Explicit Congestion Notification — proactive congestion handling. |

---

## Foundational concepts

| Term | Quick definition |
| :-- | :-- |
| [[00-lexique/on-premise\|On-Premise]] | AI infrastructure hosted on the organization’s own hardware. |
| [[00-lexique/llm\|LLM]] | Large language model trained on vast text corpora. |
| [[00-lexique/inference\|LLM inference]] | Running a trained LLM to generate text on demand. |

---

## Applied AI

| Term | Quick definition |
| :-- | :-- |
| [[00-lexique/inference\|LLM inference]] | Running a trained LLM to generate text on demand. |
| [[00-lexique/rag\|RAG]] | Architecture enriching LLM context from a document base. |
| [[00-lexique/vectordb\|Vector database]] | Store and search documents by embedding similarity. |
| [[00-lexique/graphrag\|GraphRAG]] | RAG over a knowledge graph for global queries. |
| [[00-lexique/memory-tree\|Memory Tree]] | Hierarchical memory loading only useful summaries and nodes. |
| [[00-lexique/autonomous-agent\|Autonomous agent]] | LLM with tools that loops to complete tasks. |
| [[00-lexique/agent-custodian\|Custodian agent]] | Maintenance agent proposing corrections awaiting human validation. |
| [[00-lexique/human-in-the-loop\|Human-in-the-loop]] | Governance where humans validate critical actions before apply. |
| [[00-lexique/litellm\|LiteLLM]] | OpenAI-compatible gateway routing to local or cloud models. |
| [[00-lexique/smolagents\|SmolAgents]] | Lightweight Hugging Face agent framework without cloud telemetry. |
| [[00-lexique/context-window\|Context window]] | Maximum tokens the model can handle in active input. |
| [[00-lexique/quantification\|Quantization]] | Lower numeric precision to cut memory and compute cost. |
| [[00-lexique/moe\|MoE]] | Architecture with specialized experts partially activated per token. |

---

## Model evaluation

| Term | Quick definition |
| :-- | :-- |
| [[00-lexique/benchmark-llm\|LLM benchmark]] | Standardized tests to compare language models. |
| [[00-lexique/llm-as-a-judge\|LLM-as-a-judge]] | Using an LLM as judge to score or compare answers. |
| [[00-lexique/ragas\|RAGAS]] | Framework evaluating RAG pipelines: retrieval, faithfulness, relevance. |

---

## Related chapters

- [[01-fondations/memory-bandwidth]]
- [[01-fondations/unified-memory-vs-ram-vs-vram]]
