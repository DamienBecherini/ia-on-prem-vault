---
title: "🧑‍💼 On-Premise Personal Assistants"
description: >
  Comparison of local AI assistants that learn from your data — evaluated on real sovereignty,
  model control, and memory persistence.
sidebar:
  order: 1
last_modified: "2026-06-04"
---

A local personal assistant lets you interact with an LLM **that knows your context** — your notes, documents, exchange history — without sending that data to a third-party service.

The challenge: many tools present a local interface while silently routing requests to a cloud model. This page helps you tell the difference.

---

## 🧭 Quick decision table

*Identify your main priority, then follow the matching row.*

| Priority | Constraint | Recommended tool | Verdict |
|----------|-----------|-----------------|---------|
| Native sovereignty, zero cloud | Everything must stay on machine, offline mode required | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai|Jan.ai]] | ✅ native |
| Long memory on personal documents | Markdown vault / notes, not just files | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] | ⚠️ configurable |
| Multi-model web interface | Multiple users, multiple engines | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] | ⚠️ configurable |
| Enterprise knowledge + agents | Structured RAG + workflows | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] | ⚠️ configurable |
| Memory + hybrid [[00-lexique/memory-tree|Memory Tree]] | Doc-first approach, acceptable if configured sovereign | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] | ⚠️ configurable |

> [!tip] Quick read
> If you want to start without accidental cloud use, begin with Jan.ai. For a team interface, look at Open WebUI. For RAG + workflows, compare AnythingLLM and Khoj. OpenHuman is mainly interesting for its [[00-lexique/memory-tree|Memory Tree]] architecture, but must be explicitly configured for a sovereign posture.

---

## 📋 Shared evaluation criteria

Each solution sheet in this section evaluates the project against the same 6 criteria:

1. **Data location** — do your files stay on your machine?
2. **Model routing** — does inference run locally (Ollama, llama.cpp) or via a cloud API?
3. **Persistent memory** — does the assistant remember your context between sessions? Where is it stored?
4. **Telemetry** — does the software send metrics, logs, or prompts to its servers?
5. **Offline mode** — does it work without an Internet connection?
6. **Sovereignty verdict** — ✅ native sovereign / ⚠️ configurable / ❌ strict on-prem incompatible

The full grid and audit protocol are detailed in [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

---

## 📂 Solution sheets

- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] — local-first Memory Tree, managed backend by default
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] — self-hosted web portal for Ollama/vLLM and teams
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] — RAG, workspaces, and agents in one all-in-one app
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai|Jan.ai]] — local/offline desktop, local API server
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] — self-hostable second brain, documents, web, and agents

---

## 🔗 See also

- [[05-agents-et-assistants-on-prem/index|🤖 Overview: Agents & Assistants]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 Custodian Agents — AI that acts for you]]
- [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents: The knowledge architecture]]
