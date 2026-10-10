---
title: "🧑‍💼 On-Premise Personal Assistants"
description: >
  Comparison of local AI assistants that learn from your data — evaluated on real sovereignty,
  model control, and memory persistence.
sidebar:
  order: 1
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

A local personal assistant lets you interact with an LLM **that knows your context** — your notes, documents, exchange history — without sending that data to a third-party service.

The challenge: many tools present a local interface while silently routing requests to a cloud model. This page helps you tell the difference.

---

## 🧭 Quick decision table

*Identify your main priority, then follow the matching row.*

| Priority | Constraint | Recommended tool | Verdict |
|----------|-----------|-----------------|---------|
| Native sovereignty, zero cloud | Everything must stay on machine, offline mode required | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai|Jan.ai]] | ✅ native |
| Long memory on personal documents | Markdown vault / notes, not just files | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] (maintenance slowed since March 2026)[^1] | ⚠️ configurable |
| Multi-model web interface | Multiple users, multiple engines | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] | ⚠️ configurable |
| Enterprise knowledge + agents | Structured RAG + workflows | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] | ⚠️ configurable |
| Multi-channel agent with hosted memory and a local-only mode | Accept memory living off-machine, or operate your own CortexDB | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] | ⚠️ configurable |

> [!tip] Quick read
> If you want to start without accidental cloud use, begin with Jan.ai (Apple Silicon, Windows, or Linux; Intel Macs no longer load local models since v0.8.5)[^4]. For a team interface, look at Open WebUI — accepting its license with a branding clause beyond 50 users and a stream of security fixes to follow closely[^5]. For RAG + workflows, compare AnythingLLM and Khoj. OpenHuman has dropped its local [[00-lexique/memory-tree|Memory Tree]] in favor of hosted memory (CortexDB); it remains interesting for its local-only Privacy mode enforced in code, but its memory stays on-site only if you operate your own CortexDB.

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

- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] — Rust agent harness, hosted memory by default, local-only mode
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] — self-hosted web portal for Ollama/vLLM and teams
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] — RAG, workspaces, and agents in one all-in-one app
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai|Jan.ai]] — local/offline desktop, local API server
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] — self-hostable second brain, documents, web, and agents

Two tools that appeared in 2026 do not (yet) have a solution sheet: **LM Studio Bionic** (July 2026), an agent application "for open models" from the same publisher as LM Studio — proprietary software, local models via the LM Studio runtime, with an optional cloud path (account and billing required, zero data retention announced): to be treated as a freemium product with a cloud path[^2]; and **Pipali** (Khoj team, Apache-2.0, 0.10.0 in September 2026), an action-oriented desktop "co-worker" (files, web, Jira/Linear/Slack via MCP) whose project page highlights cloud models served through its platform; local model support has not been verified[^3].

---

## 🔗 See also

- [[05-agents-et-assistants-on-prem/index|🤖 Overview: Agents & Assistants]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 Custodian Agents — AI that acts for you]]
- [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents: The knowledge architecture]]

## 📚 Sources and References

[^1]: khoj-ai, *khoj* — Releases (latest version 2.0.0-beta.28 of 2026-03-26) and commit history (last commit on 2026-08-02), accessed 2026-10-10. [https://github.com/khoj-ai/khoj/releases](https://github.com/khoj-ai/khoj/releases) · [https://github.com/khoj-ai/khoj/commits/master](https://github.com/khoj-ai/khoj/commits/master)
[^2]: LM Studio, *Introducing LM Studio Bionic* (agent for open models, local models via the LM Studio runtime, cloud models with account and billing, Zero Data Retention commitment), 2026-07-16. [https://lmstudio.ai/blog/introducing-lm-studio-bionic](https://lmstudio.ai/blog/introducing-lm-studio-bionic)
[^3]: khoj-ai, *pipali* (GitHub repository: Apache-2.0, release 0.10.0 of 2026-09-14, cloud models via the Pipali platform, MCP integrations), accessed 2026-10-10. [https://github.com/khoj-ai/pipali](https://github.com/khoj-ai/pipali)
[^4]: janhq, *Jan v0.8.5* — release notes (Intel Macs without local models), 2026-10-08. [https://github.com/janhq/jan/releases/tag/v0.8.5](https://github.com/janhq/jan/releases/tag/v0.8.5)
[^5]: Open WebUI — *License* (branding clause beyond 50 users over 30 days, not OSI-approved) and *Security advisories* (88 advisories between 2026-06-11 and 2026-09-28), accessed 2026-10-10. [https://docs.openwebui.com/license/](https://docs.openwebui.com/license/) · [https://github.com/open-webui/open-webui/security/advisories](https://github.com/open-webui/open-webui/security/advisories)
