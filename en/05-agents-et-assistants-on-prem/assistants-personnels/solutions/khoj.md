---
title: "Khoj"
description: Self-hostable personal assistant oriented second brain, documents, web, agents, and automations, with local model support via Ollama.
sidebar:
  order: 5
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

Khoj presents itself as an **AI second brain**: answers from the web or your documents, custom agents, scheduled automations, deep research, and access from browser, Obsidian, Emacs, desktop, mobile, or WhatsApp[^1].

The project is open-source and self-hostable, but there is also an official cloud app. The sovereignty verdict depends heavily on deployment mode.

## 💡 Why this project interests us

Khoj is probably closest to the "augmented personal assistant" idea: it connects documents, web, agents, and automations, with an interesting Obsidian integration for vault users.

In this vault, it bridges Track A (assistant that knows you) and Track B (agent that acts): it can remember, search, answer, and trigger actions.

## ✅ Strengths

- **Self-hostable:** local or private server install possible[^1].
- **Varied documents:** PDF, Markdown, org-mode, Word, Notion, images per configuration[^1].
- **Local LLM possible:** Ollama integration via local OpenAI-compatible server[^2].
- **Agents and automations:** custom agents, schedules, deep research[^1].
- **Personal ecosystem:** browser, Obsidian, Emacs, desktop, phone.

## ⚠️ Limitations and risks

- **Official cloud available:** easy to use, but outside strict on-prem.
- **Telemetry to disable:** `KHOJ_TELEMETRY_DISABLE=True` in Docker/env for sensitive context[^3].
- **Web/search features:** may involve network calls depending on enabled tools.
- **Ollama configuration to test:** Docker URL, `/v1/`, exact model, and local network can be friction sources[^2].

## 🔒 Sovereignty and privacy

- **Data:** local if self-host; cloud if `app.khoj.dev`.
- **Model:** local via Ollama/OpenAI-compatible base URL; cloud if external provider chosen[^2].
- **Memory:** document index in the instance.
- **Telemetry:** disable via `KHOJ_TELEMETRY_DISABLE=True`[^3].
- **100% offline mode:** partial; possible for documents + local model, limited for web/deep research.
- **Verdict:** ⚠️ configurable — good self-host candidate, but not sovereign by default if using the cloud app.

See the full grid: [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

## 🔗 Possible integration in this vault

Khoj is interesting if the vault should become real personal memory:

- Markdown/Obsidian indexing;
- chat with citations;
- personal agent for research and synthesis;
- simple automations around notes and documents.

## 📊 Project maturity

Open-source project with a long history in this space (created 2021) and actively maintained. Its functional richness requires testing self-host mode precisely before recommendation in a regulated context.

## 📚 Sources

[^1]: Khoj GitHub — second brain, self-hostable, documents, agents, and automations. [https://github.com/khoj-ai/khoj](https://github.com/khoj-ai/khoj)
[^2]: Khoj docs — Ollama integration and `OPENAI_BASE_URL`. [https://docs.khoj.dev/advanced/ollama](https://docs.khoj.dev/advanced/ollama)
[^3]: Khoj Docker Compose — `KHOJ_TELEMETRY_DISABLE=True` and Ollama config. [https://github.com/khoj-ai/khoj/blob/master/docker-compose.yml](https://github.com/khoj-ai/khoj/blob/master/docker-compose.yml)
