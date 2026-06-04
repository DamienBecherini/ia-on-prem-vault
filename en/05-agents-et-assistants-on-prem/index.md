---
title: "🤖 On-Premise Agents & Assistants"
description: >
  Overview of the local AI application layer: personal assistants that learn from your data,
  and custodian agents that act on your behalf — evaluated through the lens of sovereignty.
sidebar:
  order: 1
---

You have the hardware. You have the inference engine. The next question is inevitable:

> [!question] Starting question
> What do I put on top?

This section answers that question by distinguishing two complementary types of tools that most on-premise architectures end up combining.

---

## 🗺️ The two tracks

### 🧑‍💼 Track A — Personal Assistants
*AI that knows you.*

A local personal assistant is software that:
- remembers your documents, notes, and work context;
- lets you ask questions about **your own data**;
- ideally never sends your information outside.

👉 [[05-agents-et-assistants-on-prem/assistants-personnels/index|Compare personal assistants →]]

---

### 🤖 Track B — Custodian Agents
*AI that acts for you.*

A custodian agent is an autonomous agent that:
- runs on a trigger (scheduled or event-driven);
- maintains a vault, audits code, proposes sourced fixes in branches/PRs;
- **waits for human validation** before any irreversible change.

👉 [[05-agents-et-assistants-on-prem/agents-custodiens/index|Discover custodian agents →]]

---

## ❓ The question that comes first

Before evaluating any tool in this section, one question must be asked:

> [!warning] Key question
> Does this software actually run the model locally, or does it quietly delegate to a cloud backend?

The interface can be local, the marketing page can say "privacy-first", and yet the model may run on the vendor's servers. This trap is common — and often not documented on the first page.

The [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|sovereignty evaluation grid]] provides a 6-criterion protocol to audit any tool in under 15 minutes.

---

## Recommended prerequisites

> [!note] Suggested reading
> Before exploring this section, the following chapters give you hardware and software context:
>
> - [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents: The knowledge architecture]] — Memory Tree, Agentic RAG, and GraphRAG patterns
> - [[04-blueprints/scenario-a-dev-lab|🛠️ Blueprint A]] · [[04-blueprints/scenario-b-sme-appliance|🏢 B]] · [[04-blueprints/scenario-c-desktop-cluster|🖥️ C]] · [[04-blueprints/scenario-d-datacenter|🏭 D]] — size hardware for your use case
> - [[00-lexique/autonomous-agent|Autonomous agent]] · [[00-lexique/rag|RAG]] · [[00-lexique/smolagents|SmolAgents]] — lexicon concepts
