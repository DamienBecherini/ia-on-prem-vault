---
title: Exo
description: Open-source P2P orchestrator to merge memory across machines into a local AI cluster.
aliases:
  - Exo Labs
  - Exo cluster
tags:
  - lexique
  - fondations
---

## 📝 Short definition

Open-source software that turns several ordinary machines (Mac, PC, smartphones) into a P2P AI cluster able to run very large models.

## 📖 Detailed definition

Exo (by *Exo Labs*) uses automatic discovery on the local network: each machine runs `uv run exo`, they detect each other and merge available memory. The model is split into layer slices per [[00-lexique/pipeline-parallelism|Pipeline Parallelism]]: machine A runs early layers, passes activations to machine B, and so on.

Especially effective on Apple Silicon over [[00-lexique/thunderbolt|Thunderbolt]] cables (enough bandwidth to offset inter-machine latency).

## 💡 Why it matters for on-prem AI

Lets you exceed a single machine’s limits without datacenter investment. A cluster of 4–8 Mac Minis can host 200B–600B+ models inaccessible on one box.

## ⚠️ Common pitfalls

- Wi-Fi or 1 Gbps Ethernet destroys performance: the network becomes the bottleneck.
- TTFT explodes on long prompts (prefill moves a lot of data between nodes).
- Poor support for high concurrency: not suited to 50 simultaneous users.

## 📚 Go deeper

1. [[03-stack-logicielle/clustering-exo-and-ray|🌐 AI clustering: Exo and Ray]] *(full chapter with benchmarks and use cases)*
2. [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scenario C: desktop cluster]] *(Exo + Thunderbolt blueprint)*
3. [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] *(splitting strategy used)*

## 🔗 See also

- [[00-lexique/ray|Ray]]
- [[00-lexique/thunderbolt|Thunderbolt]]
- [[00-lexique/pipeline-parallelism|Pipeline Parallelism]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
