---
title: 🚀 Zero to Hero Index
description: Your entry point for On-Premise AI training
last_modified: "2026-06-10"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Welcome to the Local AI "Zero to Hero" guide. This vault is designed as a digital garden: don't read it linearly. Follow your needs, click on concepts you haven't mastered yet, and build your expertise step by step.

> [!tip] Goal
> Learn how to size, deploy, and understand the hardware and software infrastructure required to run massive AI models ([[00-lexique/llm|Large Language Models]]) in a 100% local, private, and high-performance way.

---

## 🔒 Why run AI on-premises?

You may already use ChatGPT or Claude daily. Why bother hosting a model yourself?

**1. Data sovereignty**
Every prompt sent to a cloud service is processed on third-party servers, often outside the European Union. In medical practices, legal departments, public administration, or industrial companies, some data cannot legally leave your premises — GDPR, professional secrecy, classification. [[00-lexique/on-premise|On-premise AI]] is the only technical answer to that constraint. For a 6-criteria audit grid and the GDPR/AI Act framework, see [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|🔒 Sovereignty & Privacy]].

**2. Predictable cost at scale**
Cloud APIs bill per request. At low volume, that's negligible. With 50 employees querying an assistant all day, the monthly bill can exceed the amortized cost of a dedicated machine within a few months.

**3. Full control: model, behavior, availability**
On-premises, you choose the model, customize it, run without an Internet connection, and availability does not depend on a third party's pricing or terms of service.

> [!tip] Reading
> This vault gives you the keys to understand these trade-offs and choose the architecture suited to your situation — from a solo developer machine to a sovereign datacenter cluster.

---

## 🗺️ Vault contents

### 📁 01 - Foundations (The physics of AI)
*Understand why a €4,000 computer can still be too slow for AI.*
- [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt (How it works)]]
- [[01-fondations/memory-bandwidth|🏎️ Memory Bandwidth]] (Memory Bandwidth)
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Unified Memory vs RAM vs VRAM]]
- [[01-fondations/kv-cache-and-context|💾 KV Cache and Context]]
- [[01-fondations/quantization-4bit-8bit|🗜️ 4-bit & 8-bit Quantization]]

### 📁 02 - Hardware
*A catalog of architectures.*
- [[02-materiel/index|🖥️ Hardware Index]] — blueprint-guided tour
- [[02-materiel/apu-and-unified-memory|🧠 APU & Unified Memory]] (AMD Strix Halo & Mac)
- [[02-materiel/stations-multi-gpu|🧩 Multi-GPU Workstations]] (Nvidia, PCIe)
- [[02-materiel/gpu-rack-servers|🏭 GPU rack servers]] (1U–HGX, RTX vs datacenter)
- [[02-materiel/network-roce-infiniband-thunderbolt|🌐 AI Networking: RoCE, InfiniBand, and Thunderbolt]]

### 📁 03 - Software stack (The engines)
*How to bring the silicon to life.*
- [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference Engines: vLLM, Ollama, and TensorRT-LLM]]
- [[03-stack-logicielle/clustering-exo-and-ray|🌐 AI Clustering: Connecting GPUs with Exo and Ray]]
- [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents: The knowledge architecture]]
- [[03-stack-logicielle/choose-your-model|🗺️ Choosing your local model]] — 2026 families, sizes, specializations, blueprint mapping

### 📁 04 - Architecture blueprints (Scenarios)
*Ready-to-propose configurations for your clients.*
- [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A: Dev Lab (CPU Offloading)]]
- [[04-blueprints/scenario-b-sme-appliance|🏢 Scenario B: SME Appliance (Unified Memory)]]
- [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scenario C: Desktop Cluster (Exo & Thunderbolt)]]
- [[04-blueprints/scenario-d-datacenter|🏭 Scenario D: Datacenter (RoCE & Multi-GPU)]]
- [[04-blueprints/tco-comparison|💰 TCO comparison: On-premise vs Cloud API]] — break-even by scenario

### 📁 05 - On-Premise Agents & Assistants
*The application layer: AI that knows you, and AI that acts for you.*
- [[05-agents-et-assistants-on-prem/index|🤖 Overview: two tracks, one sovereignty question]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|🔒 Sovereignty & Privacy]] — 6-criteria audit grid, GDPR/AI Act
- [[05-agents-et-assistants-on-prem/fondations-communes/possible-architectures|🏗️ Possible architectures]] — assistant, custodian, hybrid
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 Personal assistants (AI that learns from your data)]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 Custodian agents (AI that maintains your vault)]]
- [[00-lexique/agent-custodian|Custodian agent]] · [[00-lexique/human-in-the-loop|Human-in-the-loop]] · [[00-lexique/memory-tree|Memory Tree]]

### 📁 06 - Practical implementation
*How to test and decide before deploying.*
- [[06-mise-en-oeuvre/index|🧪 Overview: practical protocols]]
- [[06-mise-en-oeuvre/getting-started-with-ollama|🚀 Getting started with Ollama]] — install, first model, API, basic settings
- [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluating a local model]] — quality, hallucinations, RAG, agents, KPIs, performance
- [[06-mise-en-oeuvre/local-inference-security|🔒 Local inference security]] — API auth, network isolation, OWASP LLM Top 10, agents
- [[06-mise-en-oeuvre/configure-vllm-multi-gpu|⚙️ Configuring multi-GPU vLLM]] — tensor parallelism, Ray, production
- [[06-mise-en-oeuvre/monitoring-inference-stack|📊 Prometheus + Grafana monitoring]] — GPU metrics, KV Cache, alerts
- [[06-mise-en-oeuvre/migrate-ollama-to-vllm|🔄 Migrating from Ollama to vLLM]] — cutover without downtime, API compatibility

---

## 🧭 Which blueprint should you choose?

*Have a concrete need? This table points you in the right direction in 30 seconds.*

| Concurrent users | Model size | Hardware budget | → Blueprint |
| :--: | :--: | :--: | :-- |
| 1 (dev / test) | 8–14B | < €3,500 | [[04-blueprints/scenario-a-dev-lab|🛠️ A — Dev Lab]] |
| 1 (dev / test) | 70B with offloading | < €3,500 | [[04-blueprints/scenario-a-dev-lab|🛠️ A — Dev Lab]] *(limited performance)* |
| 2–20 (SME, team) | 70B | €4,000–8,000 | [[04-blueprints/scenario-b-sme-appliance|🏢 B — SME Appliance]] |
| 2–20 (SME, team) | 200B+ / MoE | €10,000–15,000 | [[04-blueprints/scenario-c-desktop-cluster|🖥️ C — Desktop Cluster]] |
| 50+ (production) | 70B–400B | > €300,000 | [[04-blueprints/scenario-d-datacenter|🏭 D — Datacenter]] |
| SLA constraint < 500 ms | Any | — | [[04-blueprints/scenario-d-datacenter|🏭 D — Datacenter]] |

> [!tip] Reading
> Start with the row that matches your user count, then check that the budget fits. When in doubt, read [[04-blueprints/scenario-a-dev-lab|Scenario A]] first to understand the mechanisms, then move up to your target scenario.

---

## 🚶 I'm new here: where do I start?

*First visit? Follow this path before exploring freely:*

1. [[00-lexique/llm|LLM]] *(what is a large language model?)*
2. [[00-lexique/inference|LLM inference]] *(how you use it day to day)*
3. [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt]] *(what really happens when you talk to it)*
4. [[01-fondations/memory-bandwidth|🏎️ Memory Bandwidth]] *(why your machine can feel slow)*
5. [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A: Dev Lab]] *(your first concrete blueprint)*

---

## 📖 Dictionary & concepts
*Quick definitions for all technical terms.*
👉 [[00-lexique/ai-glossary|AI Glossary]]
