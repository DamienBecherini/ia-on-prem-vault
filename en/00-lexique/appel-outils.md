---
title: "Tool calling (Function / Tool Calling)"
description: "An LLM's ability to emit structured requests to external functions (API, SQL, code) rather than free-form text."
aliases:
  - Function Calling
  - Tool Calling
  - Tool Use
tags:
  - lexique
  - stack
sidebar:
  order: 66
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
---

## 📝 Short definition

A mechanism where the [[00-lexique/llm|LLM]] chooses and parameterizes an **external function** (JSON schema) instead of answering directly: search, calculation, database query, script execution[^1].

## 📖 Detailed definition

**Tool calling** (*function calling* / *tool calling*) turns the LLM into an orchestrator: the model receives a list of described tools (name, parameters, types), decides which to invoke, produces a structured payload, then integrates the result into the rest of its reasoning.

In an on-premise stack, the engine ([[00-lexique/vllm|vLLM]], [[00-lexique/ollama|Ollama]], [[00-lexique/sglang|SGLang]]) often exposes an OpenAI-compatible "tools" API; the application actually executes the tool **server-side** (never with blind trust).

Typical pattern: a fast small model for tool routing, a large model for the final synthesis — see [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]].

## 💡 Why it matters for on-prem AI

- Foundation of [[00-lexique/autonomous-agent|autonomous agents]] and agentic RAG (retrieve, filter, rewrite).
- Connects the LLM to internal systems **without** fine-tuning: tool contracts = security boundary.
- Related to OWASP LLM06 ([[00-lexique/excessive-agency|Excessive Agency]]): attack surface if too many tools or excessive permissions.

## ⚠️ Common pitfalls

- Giving the agent **destructive** tools (shell, DELETE SQL) without sandbox or HITL validation.
- Parsing "almost valid" JSON without a downstream validator — prefer [[00-lexique/sglang|SGLang]] or strict constraints for structured outputs.
- Ignoring latency: each tool turn = new prefill; optimize shared context (RadixAttention).

## 📚 To go deeper

1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]
2. [[06-mise-en-oeuvre/local-inference-security|🔐 Inference security]] — LLM06 Excessive Agency
3. [[00-lexique/langgraph|LangGraph]] — multi-step orchestration

## 🔗 See also

- [[00-lexique/autonomous-agent|Autonomous agent]]
- [[00-lexique/excessive-agency|Excessive Agency]]
- [[00-lexique/sglang|SGLang]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: OpenAI API — Function calling (de facto pattern adopted by vLLM/Ollama). [https://platform.openai.com/docs/guides/function-calling](https://platform.openai.com/docs/guides/function-calling)
