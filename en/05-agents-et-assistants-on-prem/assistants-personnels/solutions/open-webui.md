---
title: "Open WebUI"
description: Self-hosted web interface for Ollama and OpenAI-compatible backends, suited to local multi-user deployments.
sidebar:
  order: 2
last_modified: "2026-06-10"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

Open WebUI is a self-hosted web platform for exposing local models via Ollama, vLLM, or any OpenAI-compatible API. The project presents itself as extensible, feature-rich, and capable of running entirely offline[^1][^2].

> [!tip] The right use case
> Open WebUI is often the best first choice for an SME or lab that wants to turn an Ollama server into a shared interface: user accounts, history, files, RAG, multiple models, and centralized administration.

## 💡 Why this project interests us

Open WebUI occupies the "internal ChatGPT portal" place in an on-premise stack. It does not replace the inference engine: it orchestrates model access, interface, users, files, and plugins.

In this vault, it is the reference solution for the **simple multi-user** scenario: a local backend, a web interface, permissions, easy adoption.

## ✅ Strengths

- **Self-hosted**: Docker, Kubernetes, Python, images with Ollama or CUDA as needed[^1].
- **Provider-agnostic**: Ollama, OpenAI-compatible APIs, vLLM, and other backends[^2].
- **Mature user experience**: history, files, RAG, plugins, multiple models.
- **Credible local deployment**: can be linked to Ollama via `OLLAMA_BASE_URL`[^3].
- **Controllable observability**: OpenTelemetry available for your own traces/logs in production[^3].

## ⚠️ Limitations and risks

- **Not an inference engine**: Ollama/vLLM must be sized separately.
- **Administration surface**: accounts, plugins, CORS, secrets, and network exposure must be hardened.
- **Cloud provider possible**: if connected to OpenAI/Anthropic, data follows the chosen provider.
- **Telemetry/analytics to verify**: `SCARF_NO_ANALYTICS`, `DO_NOT_TRACK`, `ANONYMIZED_TELEMETRY` variables must be set in a strict context[^3].

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
- [[04-blueprints/scenario-d-datacenter|Scenario D]]: access front on vLLM/TensorRT-LLM behind proxy.

## 📊 Project maturity

Very widely used and actively maintained project, with a large GitHub community and plugin ecosystem. Product maturity is good, but security hardening remains the operator's responsibility.

## 🔗 See also

- [[00-lexique/ollama|Ollama]] · [[00-lexique/vllm|vLLM]] — inference backends
- [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] · [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]]
- [[04-blueprints/scenario-b-sme-appliance|Scenario B]] · [[04-blueprints/scenario-d-datacenter|Scenario D]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] — RAG/UI alternatives
- [[06-mise-en-oeuvre/local-inference-security|🔐 Inference security]] · [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluate a model]]

## 📚 Sources

[^1]: Open WebUI GitHub — self-hosted offline platform, Ollama support, and Docker/Kubernetes images. [https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)
[^2]: Open WebUI Docs — home, providers, and features. [https://docs.openwebui.com/](https://docs.openwebui.com/)
[^3]: Open WebUI Configuration — `OLLAMA_BASE_URL`, telemetry, secrets, OpenTelemetry. [https://docs.openwebui.com/getting-started/advanced-topics/](https://docs.openwebui.com/getting-started/advanced-topics/)
