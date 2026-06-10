---
title: "🏢 Multi-tenant"
description: "AI SaaS architecture where a single infrastructure serves multiple isolated organizations, with inter-tenant leakage risk in RAG."
aliases:
  - Multi-locataire
  - Multitenancy
tags:
  - lexique
  - architecture
  - security
sidebar:
  order: 39
last_modified: "2026-06-10"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
---

## 📝 Short definition

In AI SaaS architecture, **multi-tenant** (*multi-locataire*) refers to deploying a single infrastructure — inference server, vector database, [[00-lexique/embedding|embedding]] pipeline — that simultaneously serves multiple independent organizations (*tenants*), with strict data isolation between them.

## 📖 Detailed definition

The central risk of a multi-tenant [[00-lexique/rag|RAG]] system: embeddings or documents from Tenant A are accidentally returned in response to a query from Tenant B. OWASP classifies this type of flaw under **LLM08: Vector and Embedding Weaknesses** in the LLM Top 10 (2025 edition)[^1].

Isolation cannot rely solely on the application layer — a forgotten `tenant_id` filter in a query is enough to cause a leak.

## 💡 Mitigation patterns

### Row-Level Security (RLS) with pgvector

PostgreSQL RLS applies a `tenant_id` filter **at the engine level** during each vector similarity search. Even if the application omits the filter, the RLS policy blocks access to another tenant's rows[^2].

### Payload partitioning with Qdrant

Qdrant allows scoping vector searches via *payload* filters (tenant-specific access keys), without multiplying collections — one shared collection, logical partitions per tenant[^3].

| Pattern | Engine | Advantage |
| :-- | :-- | :-- |
| RLS + pgvector | PostgreSQL | SQL-level isolation, native auditability |
| Payload partitioning | Qdrant | Vector scalability, native per-tenant filtering |

## ⚠️ Common pitfalls

- Believing one vector collection per tenant is enough without controlling shared API keys.
- Forgetting to also isolate indexing pipelines: a worker that indexes the wrong corpus contaminates the entire database.
- Neglecting non-regression tests on isolation with every schema or query change.

## 📚 To go deeper

1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] — multi-tenant section
2. [[06-mise-en-oeuvre/local-inference-security|🔒 Local inference security]] — LLM08 OWASP

## 🔗 See also

- [[00-lexique/rag|RAG]]
- [[00-lexique/vectordb|Vector database]]
- [[00-lexique/embedding|Embedding]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: OWASP GenAI Security Project, *LLM Top 10 for LLM Applications (2025)*. [https://genai.owasp.org/llm-top-10/](https://genai.owasp.org/llm-top-10/)
[^2]: Crunchy Data, *Row Level Security for Tenants in Postgres*. [https://www.crunchydata.com/blog/row-level-security-for-tenants-in-postgres](https://www.crunchydata.com/blog/row-level-security-for-tenants-in-postgres)
[^3]: Qdrant, *Multitenancy — multiple partitions guide*. [https://qdrant.tech/documentation/guides/multiple-partitions/](https://qdrant.tech/documentation/guides/multiple-partitions/)
