---
title: "Jan.ai"
description: Open-source ChatGPT alternative that runs models locally via llama.cpp, with a local OpenAI-compatible API server.
sidebar:
  order: 4
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

Jan.ai is an open-source desktop application that lets you download and run local models on your machine. The project emphasizes **100% offline** operation and a personal ChatGPT-like experience[^1][^2].

Jan also exposes a local OpenAI-compatible API server on `localhost:1337`, useful for connecting other tools to a local model without going through a cloud API[^3].

> [!tip] Sovereignty verdict
> **✅ Native sovereign** for desktop use with local models. Connections to cloud providers exist, but they are optional.

## 💡 Why this project interests us

Jan is probably the simplest entry point for an individual user who wants to try local AI without understanding Docker, vLLM, or web UI configuration.

It is less oriented toward "enterprise RAG" than Open WebUI or AnythingLLM, but excellent for the **sovereign personal workstation**: desktop install, GGUF models, llama.cpp engine bundled in the installer, Metal (Apple Silicon), CUDA 13 (NVIDIA Turing and newer), or Vulkan (AMD, Intel, and NVIDIA Pascal/GTX 10xx since v0.8.5 of 2026-10-08, the downloadable CUDA 11/12 backends having been removed) acceleration, local API[^5].

## ✅ Strengths

- **Simple desktop**: macOS (Apple Silicon; on Intel Macs, local models are no longer supported since v0.8.5, stay on 0.8.4), Windows, Linux[^5].
- **Local models**: llama.cpp, GGUF, GPU offload per platform[^2].
- **Offline**: works without Internet after model download[^1][^2].
- **Local API**: OpenAI-compatible endpoint for local integrations[^3].
- **Opt-in telemetry**: the Privacy documentation states that no data is collected until the user accepts product analytics at first launch (PostHog EU, random identifier, never the content of conversations); with local models, nothing leaves the machine[^6].

## ⚠️ Limitations and risks

- **Limited document memory**: not primarily a RAG/knowledge base system.
- **Optional cloud features**: user can connect OpenAI/Anthropic/Mistral/Groq, which completely changes the sovereignty verdict[^4].
- **Local API to secure**: if listening moves from `127.0.0.1` to `0.0.0.0`, network, API key, and CORS must be managed; since v0.8.5, Jan rejects (403) requests whose host is not localhost, a private IP, or a "Trusted Hosts" entry — declare your DNS name or reverse proxy there[^3][^5].
- **Not the best multi-user choice**: prefer Open WebUI or AnythingLLM for a team.

## 🔒 Sovereignty and privacy

- **Data:** local in desktop local use.
- **Model:** local via llama.cpp/GGUF; cloud only if external provider configured.
- **Memory:** local application history.
- **Telemetry:** opt-in (product analytics can be declined at first launch); nothing leaves the machine with local models[^6].
- **100% offline mode:** yes after model download.
- **Verdict:** ✅ native sovereign for local use; ⚠️ if cloud providers enabled.

See the full grid: [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

## 🔗 Possible integration in this vault

Jan is ideal as:

- a first tool to discover local models;
- a personal local runtime behind an OpenAI API-compatible tool;
- a simple desktop alternative to the Ollama + terminal duo.

## 📊 Project maturity

Active, popular project on GitHub (about 45,000 stars, v0.8.6 as of 2026-10-09), built on Tauri and llama.cpp, the engine now being bundled in the installer. Since v0.8.5, the `jan` CLI (terminal agent) is installed separately and the executable is named `Jan-Desktop`: adapt your scripts[^5]. Distinguish Jan Desktop local from Jan Web / any cloud offerings in every client recommendation.

## 🔗 See also

- [[00-lexique/ollama|Ollama]] · [[06-mise-en-oeuvre/getting-started-with-ollama|🚀 Getting started with Ollama]]
- [[04-blueprints/scenario-a-dev-lab|Scenario A]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]]
- [[02-materiel/apu-and-unified-memory|APU & unified memory]] — desktop workstation
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty]]

## 📚 Sources

[^1]: Jan GitHub README ("Privacy First: Everything runs locally when you want it to"), read on 2026-10-09. [https://github.com/janhq/jan](https://github.com/janhq/jan)
[^2]: Jan — documentation (llama.cpp / GGUF local models). [https://www.jan.ai/docs](https://www.jan.ai/docs)
[^3]: Jan Docs, *API Server* — local OpenAI-compatible server on `localhost:1337`, Trusted Hosts, read on 2026-10-09. [https://www.jan.ai/docs/desktop/api-server](https://www.jan.ai/docs/desktop/api-server)
[^4]: Jan GitHub README — local models and optional cloud integrations. [https://github.com/janhq/jan](https://github.com/janhq/jan)
[^5]: janhq, *Jan v0.8.5* — release notes, Migration section (bundled llama.cpp, CUDA 13 / Vulkan, end of CUDA 11/12 backends, Intel Macs without local models, `Jan-Desktop` executable, separate `jan` CLI, Trusted Hosts GHSA-x6p8-7cp8-c3p6), 2026-10-08; v0.8.6 released on 2026-10-09. [https://github.com/janhq/jan/releases/tag/v0.8.5](https://github.com/janhq/jan/releases/tag/v0.8.5)
[^6]: Jan Docs, *Privacy* ("Zero data collection until you say so": opt-in analytics at first launch, PostHog EU, random identifier, never conversations, files, or prompts), read on 2026-10-09. [https://www.jan.ai/docs/desktop/privacy](https://www.jan.ai/docs/desktop/privacy)
