---
title: Vector database
description: Database specialized in storing and searching embedding vectors for RAG.
aliases:
  - Vector database
  - Vector DB
  - Base vectorielle
tags:
  - lexique
  - fondations
last_modified: "2026-11-21"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Short definition
Database that stores numeric representations (vectors) of documents and finds those closest to a query by mathematical similarity.

## 📖 Detailed definition
Each document is converted to a vector (embedding) by a specialized model. On search, the query is also embedded and the database returns documents whose vectors are closest (cosine similarity or dot product).

Common solutions in 2026: **Qdrant**, **Milvus**, **Chroma** (lightweight local), **Weaviate**. Most are open source and deployable on-prem.

Main limit in classic RAG: search is "blind"—it finds *textually close* passages but can miss complex semantic links or entity relationships. That is what [[00-lexique/graphrag|GraphRAG]] tries to address.

## 💡 Why it matters for on-prem AI
Central building block of standard RAG. Must be deployed locally to preserve data sovereignty.

## ⚠️ Common pitfalls
- Returning too many hits (e.g. top-20) bloats the prompt and saturates the model [[00-lexique/context-window|context window]].
- Embedding quality is critical: a poor embedding model gives poor search results regardless of the database.
- **Cross-tenant data leakage** — in a multi-user environment, a query can return documents from another tenant if no isolation filter (namespace, `tenant_id` in metadata) is applied **on every search**. ACLs at ingestion are not enough: the filter must be re-evaluated at query time. See [[06-mise-en-oeuvre/local-inference-security|LLM08 — Vector & Embedding Weaknesses]].

## 📚 Go deeper
1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] *(full RAG pipeline and agentic alternatives)*

## 🔗 See also
- [[00-lexique/rag|RAG]]
- [[00-lexique/graphrag|GraphRAG]]
- [[00-lexique/context-window|Context window]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
