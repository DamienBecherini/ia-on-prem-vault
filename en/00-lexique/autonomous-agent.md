---
title: Autonomous agent (LLM)
description: System where an LLM drives tools and decisions itself to complete a multi-step task.
aliases:
  - LLM agent
  - AI Agent
  - Agentic AI
tags:
  - lexique
  - fondations
---

## 📝 Short definition

An LLM equipped with tools (search, code, APIs) that decides how to chain them to complete a task — unlike a simple prompt → answer flow.

## 📖 Detailed definition

In a classic pipeline, the LLM answers in one shot. In an agent, the LLM **loops** (ReAct: Reason + Act):
1. *Thinks*: what information do I need?
2. *Calls* a tool (search a base, run code, query an API).
3. *Observes* the result and decides whether to search again.
4. *Writes* the final answer once enough information is gathered.

Common frameworks in 2026: [[00-lexique/smolagents|SmolAgents]] (Hugging Face), LangGraph, AutoGen.

## 💡 Why it matters for on-prem AI

Turns a static LLM into an active assistant that can maintain document vaults, audit code, or monitor systems — core to local personal assistant architectures and [[00-lexique/agent-custodian|custodian agents]].

## ⚠️ Common pitfalls

- A poorly bounded agent can loop forever or call tools unintentionally.
- Smaller pilot LLMs make routing decisions less reliable.
- Frameworks like LangChain may include telemetry that leaks prompts to external APIs.

## 📚 Go deeper

1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] *(Agentic RAG, SmolAgents, Memory Tree approach)*
2. [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 On-Prem Custodian Agents]] *(human-in-the-loop workflow, branches, PRs, human validation)*

## 🔗 See also

- [[00-lexique/rag|RAG]]
- [[00-lexique/smolagents|SmolAgents]]
- [[00-lexique/agent-custodian|Custodian agent]]
- [[00-lexique/human-in-the-loop|Human-in-the-loop]]
- [[00-lexique/graphrag|GraphRAG]]
- [[00-lexique/llm|LLM]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
