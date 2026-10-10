---
title: "OpenHuman"
description: Open-source agent harness (Rust + Tauri) with hosted memory by default, optional managed subscription, and a local-only Privacy mode; must be deliberately configured for an on-premise posture.
sidebar:
  order: 1
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

OpenHuman is an open-source agent (GPL-3.0) based on **Tauri + Rust**, shipped as a desktop app, a terminal, or a headless server. As of 2026-10-09, its memory is no longer the local [[00-lexique/memory-tree|Memory Tree]] of the early versions: documents, conversations, and "learnings" are stored in **CortexDB**, either hosted by TinyHumans (login required) or on a CortexDB endpoint you operate; before each turn, a token-bounded "memory pack" is recalled with citations[^1][^2].

However, it is not a 100% on-premise tool by default. The documentation is explicit: by default, the OpenHuman backend relays LLM calls, OAuth tokens (119 applications via Composio), web search, and hosted memory; even with local models, login, billing, and integration management go through that backend[^5][^7].

> [!warning] Sovereignty verdict
> **⚠️ Configurable** — interesting for its local-only Privacy mode, but a strict on-prem posture requires deliberate configuration: local model, a CortexDB you operate, self-hosted search, direct integrations, and disabling managed paths.

## 💡 Why this project interests us

OpenHuman was, up to its version 1, the most readable example of a "memory-first" assistant: it structured documents into summary trees and kept a human-readable Markdown equivalent. In Q4 2026, that architecture has disappeared from the product in favor of hosted memory (CortexDB)[^2].

For this vault, it served as the reference for the [[00-lexique/memory-tree|Memory Tree]] pattern up to its version 1; since memory v2 (CortexDB, 2026), it mainly illustrates two other lessons: an assistant's memory can leave the machine even when the model is local, and a "local-only" mode enforced in code is worth more than a configuration[^4][^5].

## ✅ Strengths

- **Pluggable memory**: hosted or self-hosted CortexDB engine, "learnings" and "beliefs" built in the background, recall via memory pack with citations; secrets and credentials scrubbed before storage, full erasure possible[^2].
- **Local-only Privacy mode**: a switch enforced in the Rust core refuses every cloud provider (including BYOK and Composio) and only lets through the local runtimes Ollama, LM Studio, MLX, or OpenAI-compatible[^4].
- **Tooled agent**: search, web fetch, files, Git, lint/test/grep, integrations, and voice per configuration[^3].
- **Local AI possible**: Ollama/LM Studio can take some workloads on-device[^3].

## ⚠️ Limitations and risks

- **Cloud by default for several critical functions**: LLM routing, proxy web search, managed OAuth/integrations[^3].
- **Non-trivial sovereignty**: managed paths must be replaced one by one.
- **Fast-changing product**: still "early beta" according to its authors despite strong adoption (GPL-3.0, near-daily releases, 674 PRs for v0.64.0 in September 2026); a managed subscription (Free, Basic $19.99/month, Pro $199.99/month) funds the hosted model routing[^6].
- **Broad integration surface**: Gmail, Slack, GitHub, Notion, etc. require strict permission governance.

## 🔒 Sovereignty and privacy

- **Data:** workspace files, settings, and audio buffers on the machine; **memory, no**: it lives in CortexDB (TinyHumans-hosted or an endpoint you operate)[^5].
- **Model:** managed routing by default; Ollama/LM Studio possible for local workloads[^3].
- **Memory:** CortexDB, hosted or self-hosted; without a login or CortexDB key, memory is disabled[^2][^5].
- **Telemetry:** to verify in deployed instance.
- **100% offline mode:** partial; managed features and real-time integrations may require the backend.
- **Verdict:** ⚠️ configurable.

See the full grid: [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

## 🔗 Possible integration in this vault

OpenHuman is relevant as:

- a reminder that an assistant's memory can leave the machine even with a local model (local Memory Tree dropped in favor of CortexDB);
- a comparison page to explain the "local-first ≠ sovereign by default" trap;
- an example of a hybrid solution not to present as strict on-prem without caveat.

## 📊 Project maturity

Open-source project (GPL-3.0) evolving very rapidly (v0.57.5 in June 2026, v0.64.15 as of 2026-10-09), repositioned as an agent harness (desktop, terminal, headless server, Rust library). Audit before client deployment: OAuth token retention on the backend side, dependency on the backend for login, billing, and integrations even in local-only mode, and self-host options (your own CortexDB, headless core in Docker)[^5][^6].

## 🔗 See also

- [[00-lexique/memory-tree|Memory Tree]] · [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty]] — "local-first ≠ sovereign" trap
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]]
- [[04-blueprints/scenario-a-dev-lab|Scenario A]]

## 📚 Sources

[^1]: OpenHuman, *Architecture* — React + Tauri v2, Rust core, desktop / terminal / headless modes (read on 2026-10-09). [https://github.com/tinyhumansai/openhuman/blob/main/gitbooks/developing/architecture/README.md](https://github.com/tinyhumansai/openhuman/blob/main/gitbooks/developing/architecture/README.md)
[^2]: OpenHuman, *How memory works* — "The current memory has no memory tree … or Obsidian vault"; TinyHumans Hosted / CortexDB engines, memory pack, secret scrubbing (docs read on 2026-10-09). [https://tinyhumans.gitbook.io/openhuman/features/memory](https://tinyhumans.gitbook.io/openhuman/features/memory)
[^3]: OpenHuman README — "Local + managed services, upfront", Ollama/LM Studio, Composio, and managed backend. [https://github.com/tinyhumansai/openhuman/blob/main/README.md](https://github.com/tinyhumansai/openhuman/blob/main/README.md)
[^4]: OpenHuman, *Privacy mode* (`local_only`, enforced in the Rust core; allowed local runtimes), docs read on 2026-10-09. [https://tinyhumans.gitbook.io/openhuman/features/privacy-mode](https://tinyhumans.gitbook.io/openhuman/features/privacy-mode)
[^5]: OpenHuman, *Privacy and security* (where memory lives, what the backend relays), docs read on 2026-10-09. [https://tinyhumans.gitbook.io/openhuman/features/privacy-and-security](https://tinyhumans.gitbook.io/openhuman/features/privacy-and-security)
[^6]: OpenHuman, *Releases* (v0.64.15 as of 2026-10-09, 674 PRs for v0.64.0 "Intelligence Upgrade" of 2026-09-25) and *Billing and usage* (Free, Basic $19.99/month, Pro $199.99/month plans), read on 2026-10-09. [https://github.com/tinyhumansai/openhuman/releases](https://github.com/tinyhumansai/openhuman/releases) · [https://tinyhumans.gitbook.io/openhuman/features/billing-and-usage](https://tinyhumans.gitbook.io/openhuman/features/billing-and-usage)
[^7]: OpenHuman, *Local and BYOK models* (model routing: login, billing, and integrations via the backend even with local models), docs read on 2026-10-09. [https://tinyhumans.gitbook.io/openhuman/features/model-routing/local-and-byok-models](https://tinyhumans.gitbook.io/openhuman/features/model-routing/local-and-byok-models)
