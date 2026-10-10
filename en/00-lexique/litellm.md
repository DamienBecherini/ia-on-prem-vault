---
title: LiteLLM
description: OpenAI-compatible gateway routing LLM calls to local or cloud models through one interface.
aliases:
  - Lite LLM
  - LiteLLM Proxy
  - LLM Gateway
tags:
  - lexique
  - stack-logicielle
  - agents
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Proxy/gateway exposing an OpenAI-compatible API and routing requests to Ollama, vLLM, OpenAI, Anthropic, Azure, Bedrock, or other providers.

## 📖 Detailed definition

LiteLLM is an abstraction layer between an agentic app and model engines. Instead of coding one connector per provider, the agent speaks one interface; the operator then chooses local models, a vLLM cluster, or a cloud provider.

It can also centralize keys, routing, quotas, logs, and observability.

## 💡 Why it matters for on-prem AI

In a sovereign setup, LiteLLM can enforce **local-only** routing to Ollama or vLLM. In a hybrid architecture, it keeps a stable API while migrating gradually from cloud to local.

## ⚠️ Common pitfalls

- Assuming LiteLLM makes a stack sovereign automatically: everything depends on configured backends.
- Enabling prompt/response logs without a retention policy.
- Leaving a silent cloud fallback in a supposed on-prem configuration.
- Deploying the proxy and then forgetting it: since June 2026, LiteLLM only maintains its last four minor lines (about one month of fixes each)[^1], and several of its 2026 flaws are actively exploited (CISA KEV catalog). A gateway exposed to users must keep up with releases — see the [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|solution sheet]].

## 📚 Go deeper

1. [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM solution sheet]]
2. [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Target custodian agent architecture]]

## 🔗 See also

- [[00-lexique/on-premise|On-Premise]]
- [[00-lexique/agent-custodian|Custodian agent]]
- [[03-stack-logicielle/inference-engines-vllm-ollama|Inference engines]]

[^1]: LiteLLM, *Version Support Policy* (four stable minor lines maintained, rolling window of about one month per line, effective 2026-06-29), 2026-06-20. [https://docs.litellm.ai/blog/version-support](https://docs.litellm.ai/blog/version-support)
