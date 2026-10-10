---
title: "Khoj"
description: Self-hostable personal assistant oriented toward second brain, documents, web, agents, and automations, with local model support via Ollama.
sidebar:
  order: 5
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

Khoj presents itself as an **AI second brain**: answers from the web or your documents, custom agents, scheduled automations, deep research, and access from browser, Obsidian, Emacs, desktop, mobile, or WhatsApp[^1].

The project is open-source and self-hostable, but an official cloud application also exists. The sovereignty verdict therefore depends heavily on deployment mode.

## 💡 Why this project interests us

Khoj is probably closest to the "augmented personal assistant" idea: it connects documents, web, agents, and automations, with an interesting Obsidian integration for vault users.

In this vault, it bridges Track A (assistant that knows you) and Track B (agent that acts): it can remember, search, answer, and trigger actions.

## ✅ Strengths

- **Self-hostable**: local install or private server possible[^1] — but do not expose it beyond a trusted network: a June 2026 advisory (unauthenticated path traversal on `/home/`) lists no fixed version as of 2026-10-10[^5].
- **Varied documents**: PDF, Markdown, org-mode, Word, Notion, images per configuration[^1].
- **Local LLM possible**: Ollama integration via local OpenAI-compatible server[^2].
- **Agents and automations**: custom agents, schedules, deep research[^1].
- **Personal ecosystem**: browser, Obsidian, Emacs, desktop, phone.

## ⚠️ Limitations and risks

- **Official cloud available**: easy to use, but outside strict on-prem.
- **Telemetry to disable**: `KHOJ_TELEMETRY_DISABLE=True` in Docker/env for sensitive context[^3].
- **Web/search features**: may involve network calls per enabled tools.
- **Ollama configuration to test**: Docker URL, `/v1/`, exact model, and local network can be friction sources[^2].

## 🔒 Sovereignty and privacy

- **Data:** local if self-host; cloud if `app.khoj.dev`.
- **Model:** local via Ollama/OpenAI-compatible base URL; cloud if external provider chosen[^2].
- **Memory:** document index in the instance.
- **Telemetry:** disableable via `KHOJ_TELEMETRY_DISABLE=True`[^3].
- **100% offline mode:** partial; possible for documents + local model, limited for web/deep research.
- **Verdict:** ⚠️ configurable — good self-host candidate, but not sovereign by default if using the cloud app.

See the full grid: [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

## 🔗 Possible integration in this vault

Khoj is interesting if the vault must become real personal memory:

- Markdown/Obsidian indexing;
- chat with citations;
- personal agent for search and synthesis;
- simple automations around notes and documents.

## 📊 Project maturity

Open-source project with a long history in this sector (created in 2021, AGPL-3.0), but **stagnating since spring 2026**: latest version 2.0.0-beta.28 in March 2026, a dozen commits over the summer (the last on 2026-08-02), and the team is focusing its effort on Pipali, its new local AI "co-worker"[^4]. Nothing indicates abandonment, but a recommendation in a regulated context assumes verifying that a security fix would be published; test self-host mode precisely before committing to it.

Since 2026 the Khoj team has been publishing **Pipali** (Apache-2.0, 0.10.0 on 2026-09-14), a desktop "co-worker" agent that reads and writes files, browses the web, and integrates with Jira, Linear, or Slack via MCP. Its GitHub page highlights cloud models (Claude, GPT, Kimi, DeepSeek, Gemini…) served by the Pipali platform; local model support has not been verified in this vault. It is a Track B candidate more than a Track A one, and it explains Khoj's drop in activity[^4].

## 🔗 See also

- [[00-lexique/memory-tree|Memory Tree]] · [[00-lexique/rag|RAG]] · [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]
- [[00-lexique/ollama|Ollama]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai|Jan.ai]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] — hierarchical memory comparison
- [[04-blueprints/scenario-a-dev-lab|Scenario A]] · [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluate a model]]

## 📚 Sources

[^1]: Khoj GitHub — second brain, self-hostable, documents, agents, and automations. [https://github.com/khoj-ai/khoj](https://github.com/khoj-ai/khoj)
[^2]: Khoj docs — Ollama integration and `OPENAI_BASE_URL`. [https://docs.khoj.dev/advanced/ollama](https://docs.khoj.dev/advanced/ollama)
[^3]: Khoj Docker Compose — `KHOJ_TELEMETRY_DISABLE=True` and Ollama config. [https://github.com/khoj-ai/khoj/blob/master/docker-compose.yml](https://github.com/khoj-ai/khoj/blob/master/docker-compose.yml)
[^4]: khoj-ai — *khoj* Releases (2.0.0-beta.28 of 2026-03-26), commits (last on 2026-08-02), and README (mention of Pipali); *pipali* (Apache-2.0, release 0.10.0 of 2026-09-14), accessed 2026-10-10. [https://github.com/khoj-ai/khoj/releases](https://github.com/khoj-ai/khoj/releases) · [https://github.com/khoj-ai/khoj/commits/master](https://github.com/khoj-ai/khoj/commits/master) · [https://github.com/khoj-ai/pipali](https://github.com/khoj-ai/pipali)
[^5]: khoj-ai, *GHSA-62mm-xwmv-crhg* — "Unauthenticated path traversal in /home/ endpoint allows file read from server filesystem" (affected versions "<= latest", no fixed version listed), 2026-06-24. [https://github.com/khoj-ai/khoj/security/advisories/GHSA-62mm-xwmv-crhg](https://github.com/khoj-ai/khoj/security/advisories/GHSA-62mm-xwmv-crhg)
