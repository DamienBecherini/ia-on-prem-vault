---
title: "🤖 On-Premise Custodian Agents"
description: >
  Autonomous agents that maintain your vault, audit code, propose fixes in branches/PRs,
  and wait for human validation before acting.
sidebar:
  order: 1
last_modified: "2026-06-10"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

A [[00-lexique/agent-custodian|custodian agent]] is not an assistant: you do not talk to it to ask questions. You assign it **recurring or event-driven tasks** — keeping a vault up to date, detecting obsolete code, proposing sourced fixes — and it works autonomously while leaving the final decision to a human.

> [!tip] Live example (meta-pedagogical)
> **In this demonstration vault**, part of maintenance is orchestrated by a custodian agent: the `.agents/` folder (not published on the site) contains skills, prompts, and execution logs. The pattern remains reproducible with OpenHands, Aider, or any CI runner — see the [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|solution pages]].

---

## 🧭 Key concept: [[00-lexique/human-in-the-loop|Human-in-the-loop]]

A sovereign custodian agent does not "commit", "merge", or "publish" without human validation.

The typical cycle is:
1. **Trigger** — scheduled (cron) or event-driven (new file, open PR)
2. **Execution** — the agent reads, analyzes, generates proposals
3. **Branch + diff** — changes are isolated in a dedicated Git branch
4. **Report** — the agent produces a readable summary (PR description, email, message)
5. **Human validation** — you merge, or you don't
6. **Publication** — only if approved

Autonomy levels vary: from "report only" up to "automatic commit on a feature branch" — but never automatic merge or publication to `main` without explicit agreement.

---

## 📋 Reference pages

### Understand

- [[05-agents-et-assistants-on-prem/agents-custodiens/vision-agent-custodian|🔭 Vision: What is a custodian agent?]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|⚙️ Workflow: End-to-end Human-in-the-loop]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|🏗️ Recommended stack: MVP → sovereign target]]

### Go further

- [[05-agents-et-assistants-on-prem/agents-custodiens/github-branches-pr-notifications|🌿 Branches, PRs & Notifications]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/recherche-web-et-sources|🔍 Web Search & Sources]]

---

## 🛠️ Solution pages

| Tool | Role in the stack | Sovereignty |
|------|-------------------|-------------|
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] | Code agent, terminal-first, supports Ollama | ✅ if local |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] | Docker/sandbox agent, local models supported | ⚠️ configurable |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]] / [[00-lexique/litellm|lexicon]] | Unifying proxy (Ollama, vLLM, cloud) | ✅ if local-only |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng|SearXNG]] | Self-hosted meta-search, no API key | ✅ web privacy |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]] | Powerful MVP, but Cursor cloud routing | ❌ strict |

---

## 🔗 See also

- [[05-agents-et-assistants-on-prem/index|🤖 Overview: Agents & Assistants]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 Personal Assistants — AI that knows you]]
- [[00-lexique/autonomous-agent|Autonomous agent]] · [[00-lexique/smolagents|SmolAgents]]
