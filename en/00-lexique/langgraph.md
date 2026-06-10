---
title: "LangGraph"
description: "State-graph framework for orchestrating multi-step LLM agents with loops, memory, and flow control."
aliases:
  - LangGraph framework
tags:
  - lexique
  - stack
sidebar:
  order: 65
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
---

## 📝 Short definition

A library (LangChain ecosystem) that models an agent or [[00-lexique/rag|RAG]] pipeline as a **directed graph**: nodes (LLM actions, tools, retrieval), edges (transitions), shared state, and controlled cycles[^1].

## 📖 Detailed definition

LangGraph lets you build explicit **agentic** workflows: instead of a linear chain, you define replayable steps (e.g. "retrieve → grade → rewrite → generate"), with state persistence between turns and stop points for [[00-lexique/human-in-the-loop|human-in-the-loop]].

On-premise, LangGraph is often used with a local [[00-lexique/vllm|vLLM]] or [[00-lexique/ollama|Ollama]] backend, a [[00-lexique/vectordb|vector database]], and business tools (SQL, internal APIs). It is a structured alternative to more minimal frameworks like [[00-lexique/smolagents|SmolAgents]] when the flow becomes complex.

## 💡 Why it matters for on-prem AI

- **Agentic RAG** pattern: self-correcting retrieval, re-planning after tool failure.
- Governance: a readable graph = auditable steps (vs monolithic black box).
- Complements [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] for teams already on the LangChain ecosystem.

## ⚠️ Common pitfalls

- Stacking LangGraph + LangChain without auditing **telemetry**: some components may contact cloud services by default — configure offline/on-prem mode.
- Graphs too deep without turn limits: risk of [[00-lexique/excessive-agency|Excessive Agency]] (OWASP LLM06) and cost/latency explosion.
- Forgetting state persistence: restart = lost agent context if not externalized (Redis, SQLite).

## 📚 To go deeper

1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] — Agentic RAG and orchestration
2. [[00-lexique/autonomous-agent|Autonomous agent]]
3. [[00-lexique/appel-outils|Tool calling]]

## 🔗 See also

- [[00-lexique/rag|RAG]]
- [[00-lexique/smolagents|SmolAgents]]
- [[00-lexique/human-in-the-loop|Human-in-the-loop]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: LangGraph — official documentation. [https://langchain-ai.github.io/langgraph/](https://langchain-ai.github.io/langgraph/)
