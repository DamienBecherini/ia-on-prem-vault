---
title: "🤖 On-Premise Custodian Agents"
description: >
  Autonomous agents that maintain your vault, audit code, propose fixes in branches/PRs,
  and wait for human validation before acting.
sidebar:
  order: 1
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

A [[00-lexique/agent-custodian|custodian agent]] is not an assistant: you do not talk to it to ask questions. You assign it **recurring or event-driven tasks** — keeping a vault up to date, detecting obsolete code, proposing sourced fixes — and it works autonomously while leaving the final decision to a human.

> [!tip] Live example (meta-pedagogical)
> **In this demonstration vault**, part of maintenance is orchestrated by a custodian agent: the `.agents/` folder (not published on the site) contains skills, prompts, and execution logs. The pattern remains reproducible with OpenHands (including Agent Canvas), Aider — frozen since May 2026[^4] — or any CI runner — see the [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|solution pages]].

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

Human validation protects the output (merge, publication), not the input: what the agent reads and executes before review remains the weak link. OWASP now ranks "Excessive Agency" third in its Top 10 for LLM applications (2026 edition, per its 2026-09-01 announcement), the CNIL and the Conseil de l'IA et du Numérique published an exploratory note on agentic AI and personal data in July 2026, and an Ollama vulnerability (CVE-2026-102697, fixed in 0.31.2) showed that a human-approved shell command could be extended by the model. See [[05-agents-et-assistants-on-prem/agents-custodiens/vision-agent-custodian|Vision]] and [[00-lexique/excessive-agency|Excessive agency]][^1][^2][^3].

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
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] | Code agent, terminal-first, supports Ollama — development frozen since May 2026[^4] | ✅ if local, ⚠️ unmaintained |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] | Docker/sandbox agent, Agent Canvas (scheduled automations, third-party agents via ACP), local models supported[^6] | ⚠️ configurable |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]] / [[00-lexique/litellm|lexicon]] | Unifying proxy (Ollama, vLLM, cloud); vulnerabilities exploited in 2026, patch every month[^5] | ✅ if local-only and up to date |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng|SearXNG]] | Self-hosted meta-search, no API key | ✅ web privacy |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]] | Powerful MVP, but Cursor cloud routing (SpaceX since August 2026)[^7] | ❌ strict |

---

## 🔗 See also

- [[05-agents-et-assistants-on-prem/index|🤖 Overview: Agents & Assistants]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 Personal Assistants — AI that knows you]]
- [[00-lexique/autonomous-agent|Autonomous agent]] · [[00-lexique/smolagents|SmolAgents]]

## 📚 Sources and References

[^1]: OWASP GenAI Security Project, *OWASP GenAI LLM Top 10 — 2026 Edition* (published 2026-08-03) and 2026-09-01 announcement ("Excessive Agency, now number three"). [https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) · [https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members/](https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members/)
[^2]: CNIL and Conseil de l'IA et du Numérique, *IA agentique et données personnelles : note exploratoire* (increased decision-making autonomy, diluted responsibilities, cyber risks extended to every connected service), 2026-07-20. [https://www.cnil.fr/fr/ia-agentique-cnil-cianum-note](https://www.cnil.fr/fr/ia-agentique-cnil-cianum-note)
[^3]: MITRE, *CVE-2026-102697* (Ollama 0.14.0 → < 0.31.2: shell control operators appended to an approved command in agent mode, CVSS 3.1 7.8 / 4.0 8.5), published 2026-09-29. [https://cveawg.mitre.org/api/cve/CVE-2026-102697](https://cveawg.mitre.org/api/cve/CVE-2026-102697)
[^4]: Aider-AI, *aider* (GitHub repository: last commit on 2026-05-22, latest release v0.86.0 of 2025-08-09), accessed 2026-10-10. [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)
[^5]: CISA, *Known Exploited Vulnerabilities Catalog* (CVE-2026-42208, CVE-2026-42271, CVE-2026-59822 LiteLLM), catalog dated 2026-10-08; LiteLLM, *Version Support Policy* (four minor lines maintained since 2026-06-29), 2026-06-20. [https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json) · [https://docs.litellm.ai/blog/version-support](https://docs.litellm.ai/blog/version-support)
[^6]: OpenHands GitHub README (repository presented as "Agent Canvas (beta)", MIT), accessed 2026-10-10; OpenHands, *Introducing Agent Canvas* (2026-06-16) and *Use any coding agent in OpenHands with ACP* (2026-06-18). [https://github.com/OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) · [https://www.openhands.dev/blog/introducing-agent-canvas](https://www.openhands.dev/blog/introducing-agent-canvas) · [https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp](https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp)
[^7]: Cursor, *Cursor is now a part of SpaceX*, 2026-08-14. [https://cursor.com/blog/joining-spacex](https://cursor.com/blog/joining-spacex)
