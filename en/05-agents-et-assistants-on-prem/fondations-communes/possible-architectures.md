---
title: "🏗️ Possible Architectures"
description: >
  Taxonomy of local AI application patterns: pure assistant, custodian agent, hybrid.
  Comparison table, hardware requirements, and relationship between the two tracks.
sidebar:
  order: 3
last_modified: "2026-06-07"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Not all local AI applications do the same thing. Before choosing a tool, it helps to understand which **architectural category** it belongs to — and what that category implies for hardware, complexity, and sovereignty.

---

## 🗂️ Taxonomy: three main families

### 1. Personal Assistant ("AI that knows you")

**Definition:** A personal assistant is an interactive system. You ask questions; it answers using its memory (your documents, notes, past conversations).

**Characteristics:**
- Primary interaction: real-time text dialogue
- Memory: persistent, centered on *your* context (notes, files, past conversations)
- Trigger: a human asks a question
- Autonomy: low — it responds, it does not *act*

**Examples:** Open WebUI, Jan.ai, Khoj, AnythingLLM, OpenHuman

**Analogy:** a colleague very well informed on your cases, available 24/7, but who waits for you to speak.

---

### 2. Custodian Agent ("AI that acts for you")

**Definition:** A custodian agent runs tasks autonomously on a trigger. It does not answer questions — it *acts*: reads files, detects issues, generates proposals, creates Git branches, waits for human validation.

**Characteristics:**
- Primary interaction: scheduled or event-driven trigger, then report
- Memory: task context (the vault, the repo, error logs)
- Trigger: cron, webhook, Git event, CLI command
- Autonomy: high for read/analysis, **always human-in-the-loop for irreversible actions**

**Examples:** Aider, OpenHands, a Cursor CLI + systemd script pipeline

**Analogy:** a junior research assistant who works overnight, leaves proposals on your desk in the morning, and signs nothing without your approval.

---

### 3. Hybrid ("AI that knows you and acts for you")

**Definition:** A combination of both. The assistant remembers your context *and* can trigger actions — web search, file updates, notifications — with or without validation depending on action risk level.

**Characteristics:**
- Can both answer and act
- Requires fine-grained permission and autonomy level management
- Higher complexity; risk of unwanted side effects if misconfigured

**Examples:** Khoj (agent mode enabled), Open WebUI with tools, OpenHands in interactive mode

**Warning:** hybrid complexity is real. A poorly designed implementation can give the AI the ability to modify files, send email, or run commands without sufficient guardrails. Prefer an explicit architecture (assistant or custodian) to start.

---

## 📊 Comparison table of the three patterns

| Criterion | Personal Assistant | Custodian Agent | Hybrid |
| :-- | :-- | :-- | :-- |
| **Interaction mode** | Real-time dialogue | Batch / event-driven | Both |
| **Trigger** | Human | Cron / webhook | Human or automatic |
| **Action autonomy** | Low (responses) | High (tasks) | Variable |
| **Memory required** | Long, personal | Short, task context | Both |
| **LLM model** | Large (response quality) | Small OK (routing) + large (synthesis) | Both |
| **Minimum VRAM** | 8–24 GB (7–14B model) | 8 GB (7B often enough) | 24+ GB |
| **Install complexity** | Low to medium | Medium to high | High |
| **Side-effect risk** | Low | Medium (without guardrails) | High without guardrails |
| **Sovereignty** | Varies by tool | Controllable if open stack | Controllable if well architected |

---

## 🔗 Relationship between the two tracks

The two tracks in this section are not competitors — they are **complementary** and can coexist on the same infrastructure.

```
┌─────────────────────────────────────────────────────────────────┐
│  Your machine (or your on-premise server)                       │
│                                                                 │
│  ┌──────────────────────┐     ┌──────────────────────────────┐  │
│  │  Track A             │     │  Track B                     │  │
│  │  Personal Assistant  │────▶│  Custodian Agent             │  │
│  │                      │     │                              │  │
│  │  • Knows you         │     │  • Maintains your vault       │  │
│  │  • Answers your      │     │  • Proposes fixes             │  │
│  │    questions         │     │  • Creates branches/PRs       │  │
│  │  • Long memory       │     │  • Notifies you               │  │
│  └──────────────────────┘     └──────────────────────────────┘  │
│           │                              │                      │
│           └──────────────┬───────────────┘                      │
│                          ▼                                      │
│              ┌─────────────────────┐                            │
│              │  Inference engine   │                            │
│              │  (Ollama / vLLM)    │                            │
│              └─────────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

**How they feed each other:**
- The custodian agent keeps the vault up to date → the personal assistant has a fresh knowledge base to query.
- The personal assistant identifies unclear areas in your notes → the custodian agent can be triggered to enrich them.
- Both share the same inference engine → one Ollama or vLLM server is enough for both tracks.

---

## 🧭 Which architecture for which need?

| Your situation | Recommended architecture |
| :-- | :-- |
| You want a ChatGPT that knows your documents | Personal Assistant → [[05-agents-et-assistants-on-prem/assistants-personnels/index\|Track A]] |
| You want to automate vault maintenance | Custodian Agent → [[05-agents-et-assistants-on-prem/agents-custodiens/index\|Track B]] |
| You are starting out, hardware budget < €3,500 | [[04-blueprints/scenario-a-dev-lab\|Blueprint A]] + a simple assistant (Jan.ai or Open WebUI) |
| SME, 5–20 concurrent users | [[04-blueprints/scenario-b-sme-appliance\|Blueprint B]] + Open WebUI or AnythingLLM |
| You want both (knows + acts) | Start with Track A, add Track B after validation |
| Production, multi-site, strict SLA | [[04-blueprints/scenario-d-datacenter\|Blueprint D]] + controlled hybrid architecture |

---

## 📐 Hardware sizing

Both tracks share the same inference engine but do not have the same requirements.

| Track | Typical LLM model | Minimum VRAM | Comment |
| :-- | :-- | :-- | :-- |
| Personal Assistant (dialogue quality) | 14B–70B | 16–48 GB | Response quality matters — avoid < 7B |
| Custodian Agent (routing + synthesis) | 7B for routing, 14–32B for synthesis | 8–24 GB | Routing does not need a large model |
| Hybrid | 14B–70B | 24–48 GB | Compromise between the two |

For detailed sizing, see [[04-blueprints/scenario-a-dev-lab|Blueprints A–D]].

---

## 💻 Getting started with code (external resources)

This guide covers architecture theory. To move to practice, here are the recommended entry points for each track:

### Track A — Personal Assistant

| Tool | Starting point |
| :-- | :-- |
| **Open WebUI** | [Official documentation](https://docs.openwebui.com/) — Docker install in 5 minutes, Ollama connection |
| **AnythingLLM** | [AnythingLLM GitHub](https://github.com/Mintplex-Labs/anything-llm) — full local RAG, multi-model interface |
| **Khoj** | [Khoj self-hosted guide](https://docs.khoj.dev/clients/desktop/) — personal memory + local file access |

### Track B — Custodian Agent

| Tool | Starting point |
| :-- | :-- |
| **Aider** | [Aider quickstart](https://aider.chat/docs/usage/tutorials.html) — local coding agent, Ollama-compatible |
| **OpenHands** | [OpenHands Docker setup](https://github.com/OpenHands/OpenHands) — autonomous task-execution agent |
| **LiteLLM + Ollama** | [LiteLLM proxy quickstart](https://docs.litellm.ai/docs/proxy/quick_start) — unified routing to a local model |
| **SmolAgents** | [SmolAgents cookbook](https://huggingface.co/docs/smolagents/tutorials/building_good_agents) — minimal agent framework, HuggingFace |
| **LangGraph** | [LangGraph "local agent" tutorial](https://langchain-ai.github.io/langgraph/tutorials/introduction/) — agent orchestration with state graphs |

> [!note] No inline code in this vault
> This guide is an architecture reference, not a step-by-step tutorial. Code snippets have a short shelf life (APIs and versions evolve) — the links above point to the maintained sources. A companion repository `ia-on-prem-starter-kit` is planned to host versioned code examples separately.

---

## 🔗 See also

- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|🔒 Sovereignty & Privacy]] — tool evaluation grid
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 On-Premise Personal Assistants]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 On-Premise Custodian Agents]]
- [[00-lexique/autonomous-agent|Autonomous agent]] · [[00-lexique/rag|RAG]]
