---
title: "LiteLLM"
description: OpenAI-compatible gateway to route agents and applications to Ollama, vLLM, cloud providers, or internal models.
sidebar:
  order: 4
last_modified: "2026-06-04"
---

## 🔍 Quick overview

LiteLLM is an open-source proxy/gateway that exposes an OpenAI-compatible interface to 100+ providers: Ollama, vLLM, OpenAI, Anthropic, Azure, Bedrock, Vertex AI, Hugging Face, and others[^1].

## 💡 Why this project interests us

For a custodian agent, LiteLLM serves as the **model abstraction layer**. The agent speaks OpenAI-compatible; the operator decides whether the request goes to local Ollama, vLLM, or a cloud provider.

This avoids rewriting the agent on every model change.

## ✅ Strengths

- Unified API for local and cloud models[^1].
- Documented Ollama/vLLM support[^1][^2].
- Central proxy with virtual keys, routing, costs, logs, and guardrails.
- Useful for gradual cloud → local migration.

## ⚠️ Limitations and risks

- Not a model: it routes to backends.
- Bad config = leak to cloud.
- Logging/observability can capture prompts/responses if enabled without care[^3].
- Adds a critical layer to secure.

## 🔒 Sovereignty and privacy

- **Data:** transits through the proxy; destination per backend.
- **Model:** local if local Ollama/vLLM backend; cloud if cloud provider.
- **Memory:** not application memory, except logs/observability.
- **Telemetry/logging:** configurable; disable message logging for sensitive data[^3].
- **100% offline mode:** yes with local backends.
- **Verdict:** ✅ sovereign if configured local-only; ⚠️ otherwise.

## 🔗 Possible integration in this vault

LiteLLM is the target layer between:

- Aider/OpenHands;
- Ollama/vLLM;
- routing policies;
- local logs;
- optional cloud failover.

## 📊 Project maturity

Widely used as an LLM gateway in stacks. Its power comes with responsibility: configuration, secrets, logs, and routing rules must be versioned and audited.

## 📚 Sources

[^1]: LiteLLM GitHub README. [https://github.com/BerriAI/litellm](https://github.com/BerriAI/litellm)
[^2]: LiteLLM Proxy docs — local proxy, Ollama, vLLM. [https://docs.litellm.ai/docs/proxy_server](https://docs.litellm.ai/docs/proxy_server)
[^3]: LiteLLM Docs, *Logging* — callbacks, OpenTelemetry, `turn_off_message_logging`. [https://docs.litellm.ai/docs/proxy/logging](https://docs.litellm.ai/docs/proxy/logging)
