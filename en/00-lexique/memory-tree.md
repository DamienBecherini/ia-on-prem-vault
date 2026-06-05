---
title: Memory Tree
description: Memory architecture organizing documents and summaries in a hierarchy to limit context injected into the LLM.
aliases:
  - Memory Trees
  - Memory tree
tags:
  - lexique
  - rag
  - agents
last_modified: "2026-06-04"
---

## 📝 Short definition

Long-memory pattern where documents are chunked, summarized, and arranged in a hierarchy so the agent loads only useful nodes into context.

## 📖 Detailed definition

A Memory Tree replaces or complements a classic vector database. Instead of only retrieving chunks similar to a question, the agent walks a hierarchy: titles, short summaries, sub-summaries, then exact content if needed.

The goal is to reduce injected tokens and thus pressure on the [[00-lexique/context-window|context window]] and [[00-lexique/kv-cache|KV Cache]].

## 💡 Why it matters for on-prem AI

On a local machine, VRAM and memory bandwidth are limited. A Memory Tree helps keep context short, lowering [[00-lexique/ttft|TTFT]] and avoiding saturating the server with full documents.

## ⚠️ Common pitfalls

- Assuming a Memory Tree replaces every vector-database use case.
- Trusting stale summaries if the tree is not regenerated.
- Forgetting to cite the exact source document after tree navigation.

## 📚 Go deeper

1. [[03-stack-logicielle/rag-and-agents|RAG & Agents: Memory Tree approach]]
2. [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] *(local-first Memory Tree example, hybrid cloud by default)*

## 🔗 See also

- [[00-lexique/rag|RAG]]
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/context-window|Context window]]
