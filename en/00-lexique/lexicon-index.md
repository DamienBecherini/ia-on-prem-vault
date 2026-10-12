---
title: Lexicon index
description: Alphabetical index of all on-premise AI lexicon entries, from LLM and VRAM to KV Cache, quantization, interconnects and the other notions in the vault.
---

Auto-generated at build time. For a guided read, see [[00-lexique/ai-glossary|AI Glossary]].

| Term | Definition |
| :-- | :-- |
| [⚡ SGLang](/en/00-lexique/sglang/) | Open-source LLM inference and serving framework, an alternative to vLLM for agentic workloads and structured outputs. |
| [🌳 RadixAttention](/en/00-lexique/radixattention/) | KV Cache management technique using a prefix tree, introduced by SGLang to reuse common contexts across requests. |
| [🏢 Multi-tenant](/en/00-lexique/multi-tenant/) | AI SaaS architecture where a single infrastructure serves multiple isolated organizations, with inter-tenant leakage risk in RAG. |
| [🔐 Zero Data Retention (ZDR)](/en/00-lexique/zero-data-retention/) | Cloud LLM API contractual clause: no persistence, reuse or human review of prompts and responses for the covered models and endpoints, negotiated per model. |
| [APU](/en/00-lexique/apu/) | Chip combining CPU, GPU, and NPU on one SoC with shared unified memory. |
| [Attention (mechanism)](/en/00-lexique/attention/) | Core Transformer mechanism that lets each token weight the importance of other tokens in context. |
| [Autonomous agent (LLM)](/en/00-lexique/autonomous-agent/) | System where an LLM drives tools and decisions itself to complete a multi-step task. |
| [Context window](/en/00-lexique/context-window/) | Maximum number of tokens an LLM can handle in active input — drives dynamic inference memory cost. |
| [CUDA](/en/00-lexique/cuda/) | NVIDIA's software platform for programming its GPUs; most local AI engines target it first, which weighs on the choice of hardware for on-premise AI. |
| [Custodian agent](/en/00-lexique/agent-custodian/) | Autonomous agent responsible for maintaining a vault, repository, or document corpus by proposing human-validated corrections. |
| [Decoding](/en/00-lexique/decoding/) | Generation phase where the model predicts one token at a time by rereading the KV Cache; it governs tokens per second and runs into the Memory Wall. |
| [ECN](/en/00-lexique/ecn/) | Explicit Congestion Notification — network congestion signaling used with RoCE to avoid packet loss. |
| [Embedding](/en/00-lexique/embedding/) | Dense numerical representation of a token or document in vector space. |
| [Excessive Agency](/en/00-lexique/excessive-agency/) | OWASP Top 10 for LLM applications vulnerability: an AI agent has too many features, permissions or too much autonomy, allowing unintended real-world actions. |
| [Exo](/en/00-lexique/exo/) | Open-source P2P orchestrator to merge memory across machines into a local AI cluster. |
| [GGUF](/en/00-lexique/gguf/) | Portable file format for local inference with llama.cpp, optimized for K-quant quantization. |
| [GPUDirect RDMA](/en/00-lexique/gpudirect-rdma/) | Mechanism letting GPUs exchange data directly with network devices without CPU copies. |
| [GraphRAG](/en/00-lexique/graphrag/) | RAG evolution based on a knowledge graph rather than a vector database alone. |
| [HBM](/en/00-lexique/hbm/) | Stacked memory with very high bandwidth, used on professional AI accelerators. |
| [Human-in-the-loop](/en/00-lexique/human-in-the-loop/) | Governance mode where an important automated action waits for human validation before it is applied. |
| [InfiniBand](/en/00-lexique/infiniband/) | Dedicated high-performance network fabric for GPU clusters, HPC and AI datacenter standard. |
| [KV Cache](/en/00-lexique/kv-cache/) | Memory that keeps the attention keys and values already computed to avoid recomputing them, at the cost of memory use that grows with context length. |
| [LangGraph](/en/00-lexique/langgraph/) | State-graph framework for orchestrating multi-step LLM agents with loops, memory, and flow control. |
| [Linear attention](/en/00-lexique/linear-attention/) | Family of attention that summarizes the context in a fixed-size state instead of a growing KV cache; often mixed with a few classic layers (hybrid). |
| [LiteLLM](/en/00-lexique/litellm/) | OpenAI-compatible gateway routing LLM calls to local or cloud models through one interface. |
| [LLM](/en/00-lexique/llm/) | AI model trained on very large text corpora, most often of the Transformer type; locally, its performance depends as much on memory as on the model itself. |
| [LLM benchmark](/en/00-lexique/benchmark-llm/) | Standardized test suite to compare capabilities, limits, and risks of language models. |
| [LLM inference](/en/00-lexique/inference/) | Phase where an already trained LLM produces a response token by token, in two steps (prefill then decoding); it is what sizes on-premise hardware. |
| [LLM-as-a-judge](/en/00-lexique/llm-as-a-judge/) | Evaluation technique where a language model judges or scores responses. |
| [LPDDR5X](/en/00-lexique/lpddr5x/) | Low-power RAM standardized by JEDEC and soldered next to the chip; it powers unified-memory machines such as Macs, AMD Ryzen AI Max and DGX Spark. |
| [Memory bandwidth](/en/00-lexique/memory-bandwidth/) | Amount of data transferred per second between memory and the processor or GPU, in GB/s; the key indicator for estimating how smooth text generation will be. |
| [Memory Tree](/en/00-lexique/memory-tree/) | Memory architecture organizing documents and summaries in a hierarchy to limit context injected into the LLM. |
| [Memory Wall](/en/00-lexique/memory-wall/) | Situation where memory throughput limits performance more than raw compute power, especially in autoregressive generation; not to be judged on TFLOPS alone. |
| [MLA (Multi-head Latent Attention)](/en/00-lexique/mla/) | Attention variant that stores one small compressed vector per token in the KV cache instead of the full keys and values, introduced by DeepSeek-V2. |
| [MoE](/en/00-lexique/moe/) | Mixture of Experts — architecture activating only some sub-networks per token, enabling huge models with controlled inference cost. |
| [Multi-GPU](/en/00-lexique/multi-gpu/) | Architecture using several GPUs in one machine or a cluster to increase memory and throughput; the gains depend on the interconnect (PCIe, NVLink). |
| [NCCL](/en/00-lexique/nccl/) | NVIDIA collective communication library optimized for large-scale GPU-to-GPU transfers. |
| [NPU](/en/00-lexique/npu/) | Neural Processing Unit — AI accelerator in modern SoCs, useful for some tasks but limited for large LLMs. |
| [NVLink](/en/00-lexique/nvlink/) | Dedicated hardware link that connects NVIDIA GPUs at very high speed, bypassing the PCIe bus; it is gone from recent workstation and consumer cards. |
| [NVSwitch](/en/00-lexique/nvswitch/) | NVIDIA switch that connects multiple GPUs into a fully non-blocking NVLink fabric inside a node. |
| [Offloading](/en/00-lexique/offloading/) | Technique that places part of the model in RAM or on SSD when VRAM is insufficient, at the cost of reduced throughput. |
| [Ollama](/en/00-lexique/ollama/) | Simplified local runtime to download and run LLMs via llama.cpp or MLX, with OpenAI-compatible API. |
| [On-Premise (AI)](/en/00-lexique/on-premise/) | AI infrastructure hosted and operated on the organization's own equipment, without delegating to a cloud provider. |
| [PagedAttention](/en/00-lexique/pagedattention/) | KV Cache management technique using virtual memory blocks, popularized by vLLM. |
| [PCIe](/en/00-lexique/pcie/) | Standard bus connecting CPU, GPU, SSD and other peripherals; it limits CPU-to-GPU offloading and Tensor Parallelism on multi-GPU setups without NVLink. |
| [PFC](/en/00-lexique/pfc/) | Priority Flow Control — Ethernet per-priority pause mechanism for a lossless network required by RoCE. |
| [Pipeline Parallelism](/en/00-lexique/pipeline-parallelism/) | Strategy for distributing an LLM in layer slices across multiple machines. |
| [Prefill](/en/00-lexique/prefill/) | Inference phase that processes the initial prompt in parallel before word-by-word generation. |
| [Prompt injection](/en/00-lexique/prompt-injection/) | Attack where untrusted content in the LLM context hijacks system instructions to exfiltrate data or execute unauthorized actions. |
| [Q4 Quantization](/en/00-lexique/quantification-q4/) | The most widely used 4-bit quantization format for local inference — especially Q4_K_M in the GGUF/Ollama ecosystem. |
| [Quantization](/en/00-lexique/quantification/) | Reducing numerical precision of LLM weights to lower memory footprint and speed up inference. |
| [RAG](/en/00-lexique/rag/) | Architecture that combines document retrieval and LLM generation to ground answers in internal sources. |
| [RAGAS](/en/00-lexique/ragas/) | Framework that evaluates a RAG system by separating retrieval quality from answer faithfulness, to diagnose where the pipeline fails. |
| [RAM](/en/00-lexique/ram/) | System main memory, second choice for LLM inference when VRAM is insufficient. |
| [Ray](/en/00-lexique/ray/) | Distributed computing framework for multi-node LLM orchestration in production. |
| [RDMA](/en/00-lexique/rdma/) | Network technique that reads and writes remote memory without going through the CPU, with low latency; it comes in InfiniBand and RoCE implementations. |
| [RoCE](/en/00-lexique/roce/) | Protocol bringing RDMA benefits to standard Ethernet, without a dedicated InfiniBand fabric, at the cost of configuring a lossless network (PFC, ECN). |
| [SmolAgents](/en/00-lexique/smolagents/) | Lightweight Hugging Face framework for local agentic orchestration—a sovereign alternative to LangChain. |
| [SoC](/en/00-lexique/soc/) | System on a Chip: a single chip that combines processor, graphics, AI accelerator and memory controller; the basis of Apple Silicon Macs and DGX Spark. |
| [Sparse attention](/en/00-lexique/sparse-attention/) | Attention where each token rereads only a selection of past tokens judged relevant, instead of the whole history, to cut the cost of long contexts. |
| [Speculative Decoding](/en/00-lexique/speculative-decoding/) | Inference acceleration technique where a small fast model proposes tokens that the large model verifies in a single pass; both models must be loaded. |
| [Tensor Parallelism](/en/00-lexique/tensor-parallelism/) | Strategy for distributing an LLM by splitting weight matrices across multiple GPUs on the same node. |
| [TensorRT-LLM](/en/00-lexique/tensorrt-llm/) | NVIDIA SDK for optimized LLM inference (native PyTorch, FP8/NVFP4) on datacenter GPUs. |
| [TFLOPS](/en/00-lexique/tflops/) | Unit measuring floating-point compute capacity per second; useful to compare raw compute, but not enough on its own to predict LLM performance. |
| [Thunderbolt](/en/00-lexique/thunderbolt/) | High-throughput wired interface for workstations and desktop AI clusters. |
| [Tokenization](/en/00-lexique/tokenisation/) | Splitting text into numeric units (tokens) before an LLM processes it. |
| [Tokens per second](/en/00-lexique/tokens-per-second/) | Number of tokens generated per second during generation; a smoothness indicator, to be read alongside TTFT given the model, engine and hardware. |
| [Tool calling (Function / Tool Calling)](/en/00-lexique/appel-outils/) | An LLM's ability to emit structured requests to external functions (API, SQL, code) rather than free-form text. |
| [TTFT](/en/00-lexique/ttft/) | Time To First Token: time between sending a request and receiving the first response token, which mostly reflects prefill and complements the tokens/s metric. |
| [Unified Memory](/en/00-lexique/unified-memory/) | Architecture where CPU, GPU and sometimes NPU share a single memory pool, avoiding some copies over PCIe; found on Apple Silicon and some recent AMD APUs. |
| [Vector database](/en/00-lexique/vectordb/) | Database specialized in storing and searching embedding vectors for RAG. |
| [vLLM](/en/00-lexique/vllm/) | Open-source high-throughput LLM inference engine for NVIDIA/AMD GPUs, multi-user production standard. |
| [VRAM](/en/00-lexique/vram/) | Very high-bandwidth memory attached to the GPU, storing weights, KV Cache and buffers; its capacity and bandwidth determine which models run without offloading. |
