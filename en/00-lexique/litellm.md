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

## 📚 Go deeper

1. [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM solution sheet]]
2. [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Target custodian agent architecture]]

## 🔗 See also

- [[00-lexique/on-premise|On-Premise]]
- [[00-lexique/agent-custodian|Custodian agent]]
- [[03-stack-logicielle/inference-engines-vllm-ollama|Inference engines]]
