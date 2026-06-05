---
title: "Open WebUI"
description: Self-hosted web interface for Ollama and OpenAI-compatible backends, suited to local multi-user deployments.
sidebar:
  order: 2
last_modified: "2026-06-04"
---

## 🔍 Quick overview

Open WebUI is a self-hosted web platform to expose local models via Ollama, vLLM, or any OpenAI-compatible API. The project presents itself as extensible, feature-rich, and capable of running fully offline[^1][^2].

> [!tip] The right use case
> Open WebUI is often the best first choice for an SME or lab that wants to turn an Ollama server into a shared interface: user accounts, history, files, RAG, multiple models, and centralized administration.

## 💡 Why this project interests us

Open WebUI occupies the "internal ChatGPT portal" place in an on-prem stack. It does not replace the inference engine: it orchestrates access to models, the interface, users, files, and plugins.

In this vault, it is the reference solution for the **simple multi-user** scenario: one local backend, one web interface, permissions, easy adoption.

## ✅ Strengths

- **Self-hosted:** Docker, Kubernetes, Python, images with Ollama or CUDA as needed[^1].
- **Provider-agnostic:** Ollama, OpenAI-compatible APIs, vLLM, and other backends[^2].
- **Mature UX:** history, files, RAG, plugins, multiple models.
- **Credible local deployment:** can link to Ollama via `OLLAMA_BASE_URL`[^3].
- **Controllable observability:** OpenTelemetry available for your own production traces/logs[^3].

## ⚠️ Limitations and risks

- **Not an inference engine:** Ollama/vLLM must be sized separately.
- **Administration surface:** accounts, plugins, CORS, secrets, and network exposure must be hardened.
- **Cloud provider possible:** if connected to OpenAI/Anthropic, data follows the chosen provider.
- **Telemetry/analytics to verify:** variables `SCARF_NO_ANALYTICS`, `DO_NOT_TRACK`, `ANONYMIZED_TELEMETRY` must be set in a strict context[^3].

## 🔒 Sovereignty and privacy

- **Data:** stored in the self-hosted instance.
- **Model:** local if `OLLAMA_BASE_URL` / local vLLM; cloud if external provider configured.
- **Memory:** history and RAG in the instance.
- **Telemetry:** disable recommended via environment variables[^3].
- **100% offline mode:** yes if images, models, and dependencies are preloaded.
- **Verdict:** ⚠️ configurable — excellent on-prem if hardened, but multi-provider by nature.

See the full grid: [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

## 🔗 Possible integration in this vault

Open WebUI is a good companion to the blueprints:

- [[04-blueprints/scenario-a-dev-lab|Scenario A]]: local personal UI in front of Ollama.
- [[04-blueprints/scenario-b-sme-appliance|Scenario B]]: SME portal for a few users.
- [[04-blueprints/scenario-d-datacenter|Scenario D]]: access front on vLLM/TensorRT-LLM behind a proxy.

## 📊 Project maturity

Widely used, actively maintained, large GitHub community and plugin ecosystem. Good product maturity, but security hardening remains the operator's responsibility.

## 📚 Sources

[^1]: Open WebUI GitHub — offline self-hosted platform, Ollama support and Docker/Kubernetes images. [https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)
[^2]: Open WebUI Docs — home, providers, and features. [https://docs.openwebui.com/](https://docs.openwebui.com/)
[^3]: Open WebUI Configuration — `OLLAMA_BASE_URL`, telemetry, secrets, OpenTelemetry. [https://www.mintlify.com/open-webui/open-webui/configuration](https://www.mintlify.com/open-webui/open-webui/configuration)
