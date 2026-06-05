---
title: SmolAgents
description: Lightweight Hugging Face framework for local agentic orchestration—a sovereign alternative to LangChain.
aliases:
  - smolagents
  - Smol Agents
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Short definition
Open-source Python library from Hugging Face for building minimalist LLM agents, with no external telemetry—a sovereign alternative to LangChain.

## 📖 Detailed definition
SmolAgents follows the **ReAct** loop (Reason + Act) by giving tools to the LLM. Its philosophy is minimalism: little code, no mandatory cloud dependencies, no telemetry by default. Compatible with all Hugging Face models and OpenAI-compatible endpoints (Ollama, vLLM).

Contrast with LangChain/LlamaIndex: those frameworks are more complete but include telemetry that can route your prompts to external servers—a risk incompatible with a strict on-prem policy.

## 💡 Why it matters for on-prem AI
Lets you build sovereign [[00-lexique/autonomous-agent|autonomous agents]] without cloud dependency. Recommended for any agentic on-prem deployment that cares about prompt confidentiality.

## ⚠️ Common pitfalls
- Lighter weight means fewer ready-made features than LangChain. Some integrations must be coded by hand.
- Audit telemetry even in SmolAgents when you update dependencies.

## 📚 Go deeper
1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] *(SmolAgents in the Agentic RAG context)*
2. [[00-lexique/autonomous-agent|Autonomous agent]] *(the general concept)*
3. [[05-agents-et-assistants-on-prem/agents-custodiens/index|Custodian Agents]] *(where SmolAgents can serve as a minimalist framework for on-prem agents)*

## 🔗 See also
- [[00-lexique/autonomous-agent|Autonomous agent]]
- [[00-lexique/agent-custodian|Custodian agent]]
- [[00-lexique/rag|RAG]]
- [[00-lexique/llm|LLM]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
