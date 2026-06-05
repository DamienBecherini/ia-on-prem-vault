---
title: GraphRAG
description: RAG evolution based on a knowledge graph rather than a vector database alone.
aliases:
  - Graph RAG
  - Knowledge Graph RAG
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

RAG architecture that extracts entities and relations into a knowledge graph, enabling global queries classic vector search cannot answer.

## 📖 Detailed definition

Popularized by Microsoft research (2024), GraphRAG replaces (or complements) the [[00-lexique/vectordb|vector database]] with a **Knowledge Graph**: the system extracts entities (people, places, concepts) and relations from documents. At query time, the LLM can traverse the graph for global or relational questions.

Example impossible for classic vector RAG but feasible with GraphRAG: *“What cross-cutting themes appear across all product-team documents this month?”*

Downside: graph construction is costlier and more complex than simple vector indexing.

## 💡 Why it matters for on-prem AI

Relevant when the document base is relation-heavy (legal corpora, source code, technical docs). Prefer it when vector RAG fails on global synthesis questions.

## ⚠️ Common pitfalls

- High entity-extraction cost (often needs a dedicated LLM to build the graph).
- Harder to update than a vector index.
- Not always better than vector RAG for localized factual lookup.

## 📚 Go deeper

1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] *(GraphRAG in the agentic evolution context)*

## 🔗 See also

- [[00-lexique/rag|RAG]]
- [[00-lexique/vectordb|Vector database]]
- [[00-lexique/autonomous-agent|Autonomous agent]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
