---
title: "AnythingLLM"
description: Local-first application for RAG, agents, documents, and workflows, with Ollama support and disableable telemetry.
sidebar:
  order: 3
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

AnythingLLM is an all-in-one application to build a private ChatGPT around your documents: ingestion, workspaces, agents, vector database, users, and local or cloud providers[^1].

The self-hosted version is designed as **local-first**: Mintplex Labs does not host your documents, histories, embeddings, or settings if you operate your own instance[^2].

## 💡 Why this project interests us

AnythingLLM is interesting when needs go beyond simple local chat: document RAG, separate workspaces, team, agents, and integrated pipelines. It is a natural candidate for an SME that wants a ready-to-use app without manually assembling UI + vector DB + ingestion + auth.

## ✅ Strengths

- **All-in-one:** documents, workspaces, agents, multi-user, vector DB, and pipelines[^1].
- **Ollama support:** LLM and embeddings can go through Ollama in Docker[^3].
- **On-prem storage:** in self-host, data resides on infrastructure you operate[^2].
- **Air-gap possible:** if LLM, embeddings, and vector database are local[^2].
- **Documented telemetry:** optional PostHog, disable via `DISABLE_TELEMETRY=true`[^1].

## ⚠️ Limitations and risks

- **Opt-out telemetry:** it exists; must be explicitly disabled in a strict context[^1].
- **External providers possible:** OpenAI, Anthropic, Pinecone, or others can break sovereignty if configured[^2].
- **Useful outbound connections:** models, CDN, GitHub, or external services per configuration[^1].
- **Application complexity:** simpler than a home-built stack, but larger than a minimal Ollama UI.

## 🔒 Sovereignty and privacy

- **Data:** local in self-host; Mintplex has no access to instance documents and histories[^2].
- **Model:** local with Ollama/LocalAI; cloud if external provider configured[^3].
- **Memory:** workspaces, documents, and embeddings in instance storage.
- **Telemetry:** optional, anonymous, disable via UI or `DISABLE_TELEMETRY=true`[^1].
- **100% offline mode:** yes if local providers and dependencies preloaded[^2].
- **Verdict:** ⚠️ configurable — very strong when self-host hardened, not sovereign if connected to cloud providers.

See the full grid: [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

## 🔗 Possible integration in this vault

AnythingLLM is relevant for:

- an SME document portal;
- spaces separated by team or client;
- RAG workflows where the administrator wants to avoid composing Open WebUI + vector DB + ingestion manually.

## 📊 Project maturity

Mature project with strong GitHub following. License/edition model should be verified before commercial use, but the self-hosted version is documented enough for an on-prem pilot.

## 📚 Sources

[^1]: AnythingLLM README — features, providers, telemetry, and `DISABLE_TELEMETRY`. [https://github.com/Mintplex-Labs/anything-llm/blob/master/README.md](https://github.com/Mintplex-Labs/anything-llm/blob/master/README.md)
[^2]: AnythingLLM Self-Hosted Terms — local-first, air-gap, on-prem storage. [https://github.com/Mintplex-Labs/anything-llm/blob/master/TERMS_SELF_HOSTED.md](https://github.com/Mintplex-Labs/anything-llm/blob/master/TERMS_SELF_HOSTED.md)
[^3]: AnythingLLM Docker guide — Ollama as LLM and embedding provider. [https://github.com/Mintplex-Labs/anything-llm/blob/master/docker/HOW_TO_USE_DOCKER.md](https://github.com/Mintplex-Labs/anything-llm/blob/master/docker/HOW_TO_USE_DOCKER.md)
