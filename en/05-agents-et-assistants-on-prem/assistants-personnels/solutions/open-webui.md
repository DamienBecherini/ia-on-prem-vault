---
title: "Open WebUI"
description: Self-hosted web interface for Ollama and OpenAI-compatible backends, suited to local multi-user deployments.
sidebar:
  order: 2
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

Open WebUI is a self-hosted web platform for exposing local models via Ollama, vLLM, or any OpenAI-compatible API. The project presents itself as extensible, feature-rich, and capable of running entirely offline[^1][^2].

> [!tip] The right use case
> Open WebUI is often the best first choice for an SME or lab that wants to turn an Ollama server into a shared interface: user accounts, history, files, RAG, multiple models, and centralized administration. Mind the legal framework: since v0.6.6 (April 2025), the "Open WebUI License" (BSD-3 with a branding clause, not recognized by the OSI) forbids removing or hiding the Open WebUI branding beyond 50 users over 30 days, unless you hold an enterprise license[^5].

## 💡 Why this project interests us

Open WebUI occupies the "internal ChatGPT portal" place in an on-premise stack. It does not replace the inference engine: it orchestrates model access, interface, users, files, and plugins.

In this vault, it is the reference solution for the **simple multi-user** scenario: a local backend, a web interface, permissions, easy adoption.

## ✅ Strengths

- **Self-hosted**: Docker, Kubernetes, Python, images with Ollama or CUDA as needed[^1].
- **Provider-agnostic**: Ollama, OpenAI-compatible APIs, vLLM, and other backends[^2].
- **Mature user experience**: history, files, RAG, plugins, multiple models.
- **Credible local deployment**: can be linked to Ollama via `OLLAMA_BASE_URL`[^3].
- **Controllable observability**: OpenTelemetry available for your own traces/logs in production[^3].
- **Recent team features**: versions 0.10 (June 2026) and 0.11 (July 2026) add shared folders with per-group permissions, external knowledge bases, automatic context compaction, **sub-agents**, and LDAP group synchronization: features that bring Open WebUI closer to an enterprise portal, and just as many surfaces to administer[^6].

## ⚠️ Limitations and risks

- **Not an inference engine**: Ollama/vLLM must be sized separately.
- **Administration surface**: accounts, plugins, CORS, secrets, and network exposure must be hardened.
- **Cloud provider possible**: if connected to OpenAI/Anthropic, data follows the chosen provider.
- **Telemetry/analytics to verify**: the official Docker image sets `SCARF_NO_ANALYTICS=true`, `DO_NOT_TRACK=true`, and `ANONYMIZED_TELEMETRY=false` by default; for a pip install or a rebuilt image, set them explicitly and enable `OFFLINE_MODE=true` in a strict context[^3][^7].

## 🔒 Sovereignty and privacy

- **Data:** stored in the self-hosted instance.
- **Model:** local if `OLLAMA_BASE_URL` / local vLLM; cloud if external provider configured.
- **Memory:** history and RAG in the instance.
- **Telemetry:** disable recommended via environment variables[^3].
- **100% offline mode:** yes if images, models, and dependencies are preloaded; `OFFLINE_MODE=true` and `HF_HUB_OFFLINE=1` cut downloads and network checks[^3].
- **Verdict:** ⚠️ configurable — excellent on-prem if hardened, but multi-provider by nature.

See the full grid: [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

## 🔗 Possible integration in this vault

Open WebUI is a good companion to the blueprints:

- [[04-blueprints/scenario-a-dev-lab|Scenario A]]: local personal UI in front of Ollama.
- [[04-blueprints/scenario-b-sme-appliance|Scenario B]]: SME portal for a few users.
- [[04-blueprints/scenario-d-datacenter|Scenario D]]: access front on vLLM/TensorRT-LLM behind proxy.

## 📊 Project maturity

Very widely used and actively maintained project (about 154,000 GitHub stars, v0.11.4 as of 2026-09-21), with a large GitHub community and plugin ecosystem. Product maturity is good, but the attack surface follows: 88 security advisories published between June and September 2026, including about thirty of high severity (account takeover via OAuth, SSRF toward internal services, cross-user tool execution) and three exploitable without an account. Fixes ship only in current releases: an SME must follow the release train without ever staying below 0.11.4 (2026-09-21), which fixes the 15 advisories published in late September 2026, including a session token theft that can be triggered from any website as long as community sharing (on by default) stays open. It must not pin a version and must apply the official hardening guide[^4].

## 🔗 See also

- [[00-lexique/ollama|Ollama]] · [[00-lexique/vllm|vLLM]] — inference backends
- [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] · [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Inference engines]]
- [[04-blueprints/scenario-b-sme-appliance|Scenario B]] · [[04-blueprints/scenario-d-datacenter|Scenario D]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] — RAG/UI alternatives
- [[06-mise-en-oeuvre/local-inference-security|🔐 Inference security]] · [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluate a model]]

## 📚 Sources

[^1]: Open WebUI GitHub — self-hosted offline platform, Ollama support, and Docker/Kubernetes images. [https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)
[^2]: Open WebUI Docs — home, providers, and features. [https://docs.openwebui.com/](https://docs.openwebui.com/)
[^3]: Open WebUI — *Environment Variable Configuration*: `OLLAMA_BASE_URL`, `OFFLINE_MODE`, `HF_HUB_OFFLINE`, `ENABLE_OTEL*`, `OTEL_EXPORTER_OTLP_ENDPOINT`, read on 2026-10-09. [https://docs.openwebui.com/reference/env-configuration/](https://docs.openwebui.com/reference/env-configuration/)
[^4]: Open WebUI — *Security advisories* (88 advisories published between 2026-06-11 and 2026-09-28: 30 high, 53 medium, 5 low; GitHub API count of 2026-10-10) and *Hardening* guide. [https://github.com/open-webui/open-webui/security/advisories](https://github.com/open-webui/open-webui/security/advisories) · [https://docs.openwebui.com/getting-started/advanced-topics/hardening](https://docs.openwebui.com/getting-started/advanced-topics/hardening)
[^5]: Open WebUI — *License* (BSD-3 up to v0.6.5; branding clause since v0.6.6 of 2025-04-19, "50 users or fewer over 30 days" exemption, not OSI-approved), accessed 2026-10-10. [https://docs.openwebui.com/license/](https://docs.openwebui.com/license/)
[^6]: Open WebUI — *Releases* v0.10.0 (2026-06-29: shared folders, external knowledge bases, context compaction) and v0.11.0 (2026-07-27: sub-agents, LDAP group synchronization). [https://github.com/open-webui/open-webui/releases/tag/v0.10.0](https://github.com/open-webui/open-webui/releases/tag/v0.10.0) · [https://github.com/open-webui/open-webui/releases/tag/v0.11.0](https://github.com/open-webui/open-webui/releases/tag/v0.11.0)
[^7]: Open WebUI — *Dockerfile* (`SCARF_NO_ANALYTICS=true`, `DO_NOT_TRACK=true`, `ANONYMIZED_TELEMETRY=false` by default), read on 2026-10-09. [https://github.com/open-webui/open-webui/blob/main/Dockerfile](https://github.com/open-webui/open-webui/blob/main/Dockerfile)
