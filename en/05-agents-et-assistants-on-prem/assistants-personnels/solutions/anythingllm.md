---
title: "AnythingLLM"
description: Local-first application for RAG, agents, documents, and workflows, with Ollama support and disableable telemetry.
sidebar:
  order: 3
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

AnythingLLM is an "all-in-one" application for building a private ChatGPT around your documents: ingestion, workspaces, agents, vector database, users, and local or cloud providers[^1].

The self-hosted version is designed as **local-first**: Mintplex Labs does not host your documents, histories, embeddings, or settings if you operate your own instance[^2].

## 💡 Why this project interests us

AnythingLLM is interesting when the need goes beyond simple local chat: document RAG, separate workspaces, team, agents, and integrated pipelines. It is a natural candidate for an SME that wants a ready-to-use application without manually assembling UI + vector DB + ingestion + auth.

## ✅ Strengths

- **All-in-one**: documents, workspaces, agents, multi-user, vector DB, and pipelines[^1].
- **Ollama support**: LLM and embeddings can go through Ollama in Docker[^3].
- **On-prem storage**: in self-host, data resides on user-operated infrastructure[^2].
- **Air-gap possible**: if LLM, embeddings, and vector database are local[^2].
- **Documented telemetry**: optional PostHog, disableable via `DISABLE_TELEMETRY=true`[^1].

## ⚠️ Limitations and risks

- **Opt-out telemetry**: it exists; must be explicitly disabled in a strict context[^1].
- **External providers possible**: OpenAI, Anthropic, Pinecone, or others can break sovereignty if configured[^2].
- **Useful outbound connections**: models, CDN, GitHub, or external services per configuration[^1]; since September 2026, web search (chat and agents) uses You.com by default, with no API key, unless a provider is already configured or search is disabled by the administrator: disable or replace this provider (local SearXNG) before any use in a strict context[^5].
- **Application complexity**: simpler than a home-built assembly, but broader than a minimal Ollama UI.

## 🔒 Sovereignty and privacy

- **Data:** local in self-host; no Mintplex access to instance documents and histories[^2].
- **Model:** local with Ollama/LocalAI; cloud if external provider configured[^3].
- **Memory:** workspaces, documents, and embeddings in instance storage.
- **Telemetry:** optional, anonymous, disableable via UI or `DISABLE_TELEMETRY=true`[^1].
- **100% offline mode:** yes if local providers and dependencies preloaded[^2].
- **Verdict:** ⚠️ configurable — very solid when hardened self-host, not sovereign if connected to cloud providers.

See the full grid: [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

## 🔗 Possible integration in this vault

AnythingLLM is relevant for:

- an SME document portal;
- spaces separated by team or client;
- RAG workflows where the administrator wants to avoid composing Open WebUI + vector DB + ingestion manually.

## 📊 Project maturity

Mature project, very followed on GitHub (about 67,000 stars, v1.17.0 as of 2026-10-01). The license is MIT for the self-hosted edition (Docker/server); since v1.15.0 (June 2026), the Desktop application offers a paid **AnythingLLM Pro** subscription that lifts the daily limits of the "Magic" features (dictation, actions on highlighted text, system-wide autocomplete) and removes watermarks from generated documents — Mintplex commits that "whatever is free today stays free", and Pro exists only on Desktop v1.15.0+, not on the Docker side[^4]. The self-hosted version remains sufficiently documented for an on-prem pilot.

## 🔗 See also

- [[00-lexique/rag|RAG]] · [[00-lexique/vectordb|Vector database]] · [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]
- [[00-lexique/ollama|Ollama]] · [[06-mise-en-oeuvre/getting-started-with-ollama|🚀 Getting started with Ollama]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]]
- [[04-blueprints/scenario-b-sme-appliance|Scenario B]] · [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty]]

## 📚 Sources

[^1]: AnythingLLM README — features, providers, telemetry, and `DISABLE_TELEMETRY`. [https://github.com/Mintplex-Labs/anything-llm/blob/master/README.md](https://github.com/Mintplex-Labs/anything-llm/blob/master/README.md)
[^2]: AnythingLLM Self-Hosted Terms — local-first, air-gap, on-prem storage. [https://github.com/Mintplex-Labs/anything-llm/blob/master/TERMS_SELF_HOSTED.md](https://github.com/Mintplex-Labs/anything-llm/blob/master/TERMS_SELF_HOSTED.md)
[^3]: AnythingLLM Docker guide — Ollama as LLM and embedding provider. [https://github.com/Mintplex-Labs/anything-llm/blob/master/docker/HOW_TO_USE_DOCKER.md](https://github.com/Mintplex-Labs/anything-llm/blob/master/docker/HOW_TO_USE_DOCKER.md)
[^4]: Mintplex Labs — *Release v1.15.0* (2026-06-25, "Pro removes the daily limits", "Pro is purely additive"), *AnythingLLM Pro overview* ("only available on AnythingLLM Desktop v1.15.0 and later", "Whatever is free today stays free — forever"), and *LICENSE* (MIT), accessed 2026-10-10. [https://github.com/Mintplex-Labs/anything-llm/releases/tag/v1.15.0](https://github.com/Mintplex-Labs/anything-llm/releases/tag/v1.15.0) · [https://docs.anythingllm.com/pro/overview](https://docs.anythingllm.com/pro/overview) · [https://github.com/Mintplex-Labs/anything-llm/blob/master/LICENSE](https://github.com/Mintplex-Labs/anything-llm/blob/master/LICENSE)
[^5]: Mintplex Labs, *AnythingLLM and You.com bring real-time web search to everyone* ("Web search is on from your first chat, with no API key and nothing to setup"; You.com by default unless a provider is already configured, DuckDuckGo fallback), September 2026, read on 2026-10-10. [https://anythingllm.com/blog/you-com-search](https://anythingllm.com/blog/you-com-search)
