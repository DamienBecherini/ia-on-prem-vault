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
last_modified: "2026-06-04"
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

## 📚 Go deeper
1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] *(full RAG pipeline and agentic alternatives)*

## 🔗 See also
- [[00-lexique/rag|RAG]]
- [[00-lexique/graphrag|GraphRAG]]
- [[00-lexique/context-window|Context window]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
