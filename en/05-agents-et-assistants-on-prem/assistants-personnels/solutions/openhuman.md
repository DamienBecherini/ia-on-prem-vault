---
title: "OpenHuman"
description: Local-first personal assistant with Memory Tree, but managed cloud experience by default for model routing, OAuth, and some integrations.
sidebar:
  order: 1
last_modified: "2026-06-10"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

OpenHuman is an open-source personal assistant based on **Tauri + Rust**. Its core idea is the **[[00-lexique/memory-tree|Memory Tree]]**: your sources are transformed into Markdown chunks, summarized hierarchically, stored in SQLite, and exposed as an Obsidian-compatible vault[^1][^2].

However, it is not a 100% on-premise tool by default. The README is explicit: the managed experience still uses OpenHuman services for account login, model routing, proxied web search, and some OAuth flows via Composio[^3].

> [!warning] Sovereignty verdict
> **⚠️ Configurable** — very interesting for memory architecture, but a strict on-prem posture requires deliberate configuration: local model, self-hosted search, direct integrations, and disabling managed paths.

## 💡 Why this project interests us

OpenHuman is the best current example of a "memory-first" assistant: it does not simply attach a vector database under a chat. It structures documents into summary trees and keeps a human-readable Markdown equivalent.

For this vault, it mainly serves as an **architectural reference** for the [[00-lexique/memory-tree|Memory Tree]] pattern: how to give an assistant long memory without injecting all history into the prompt.

## ✅ Strengths

- **Readable local memory**: SQLite + Markdown in an Obsidian-compatible vault[^1][^2].
- **Memory Tree approach**: hierarchy of summaries rather than simple "vector soup"[^2].
- **Tooled agent**: search, web fetch, files, Git, lint/test/grep, integrations, and voice per configuration[^3].
- **Local AI possible**: Ollama/LM Studio can take some workloads on-device[^3].

## ⚠️ Limitations and risks

- **Cloud by default for several critical functions**: LLM routing, proxy web search, managed OAuth/integrations[^3].
- **Non-trivial sovereignty**: managed paths must be replaced one by one.
- **Young project**: interesting but to audit before sensitive enterprise use.
- **Broad integration surface**: Gmail, Slack, GitHub, Notion, etc. require strict permission governance.

## 🔒 Sovereignty and privacy

- **Data:** memory, Markdown vault, workspace configuration, and local runtime stored on the machine[^3].
- **Model:** managed routing by default; Ollama/LM Studio possible for local workloads[^3].
- **Memory:** local SQLite + local Markdown; `agentmemory` backend possible for shared store[^3].
- **Telemetry:** to verify in deployed instance.
- **100% offline mode:** partial; managed features and real-time integrations may require the backend.
- **Verdict:** ⚠️ configurable.

See the full grid: [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

## 🔗 Possible integration in this vault

OpenHuman is relevant as:

- inspiration for Markdown/SQLite memory;
- a comparison page to explain the "local-first ≠ sovereign by default" trap;
- an example of a hybrid solution not to present as strict on-prem without caveat.

## 📊 Project maturity

Open-source project evolving rapidly. Audit before client deployment: release frequency, network dependencies, authentication model, OAuth token retention policy, and real self-host options.

## 🔗 See also

- [[00-lexique/memory-tree|Memory Tree]] · [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty]] — "local-first ≠ sovereign" trap
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]]
- [[04-blueprints/scenario-a-dev-lab|Scenario A]]

## 📚 Sources

[^1]: OpenHuman, *Architecture* — React + Tauri v2, Rust core, Memory Tree, SQLite, and Markdown vault. [https://github.com/tinyhumansai/openhuman/blob/main/gitbooks/developing/architecture/README.md](https://github.com/tinyhumansai/openhuman/blob/main/gitbooks/developing/architecture/README.md)
[^2]: OpenHuman, *Memory Trees* — Memory Tree pipeline and local storage. [https://tinyhumans.gitbook.io/openhuman/features/memory-tree](https://tinyhumans.gitbook.io/openhuman/features/memory-tree)
[^3]: OpenHuman README — "Local + managed services, upfront", Ollama/LM Studio, Composio, and managed backend. [https://github.com/tinyhumansai/openhuman/blob/main/README.md](https://github.com/tinyhumansai/openhuman/blob/main/README.md)
