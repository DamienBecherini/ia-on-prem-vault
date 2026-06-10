---
title: RAG
description: Architecture that combines document retrieval and LLM generation to ground answers in internal sources.
aliases:
  - Retrieval-Augmented Generation
tags:
  - lexique
  - stack
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Method that **retrieves** relevant passages from a document base, then **generates** a response with an [[00-lexique/llm|LLM]] enriched by that context[^1].

## 📖 Detailed definition

RAG (*Retrieval-Augmented Generation*) separates two phases:

1. **Retrieval** — query → [[00-lexique/embedding|embeddings]] → similarity search in a [[00-lexique/vectordb|vector database]] (or hybrid BM25 + vectors).
2. **Generation** — concatenation of system prompt + retrieved chunks + user question → model response.

Variants covered in the vault: **Agentic RAG** (retrieve/grade/rewrite loops), [[00-lexique/graphrag|GraphRAG]], [[00-lexique/memory-tree|Memory Tree]] for long contexts.

## 💡 Why it matters for on-prem AI

- Exploits **internal** knowledge without retraining the model — suited to GDPR and sovereignty constraints.
- Reduces hallucinations **if** retrieval is good; does not eliminate them (see pitfalls).
- Coupled with [[00-lexique/multi-tenant|multi-tenant]], requires strict index isolation (OWASP LLM08).

## ⚠️ Common pitfalls

- **Naive chunking**: pieces too large or cut mid-sentence → useless retrieval.
- **Confusing RAG with security**: a poisoned document can trigger indirect [[00-lexique/prompt-injection|prompt injection]].
- **Ignoring evaluation**: measure retrieval + faithfulness ([[00-lexique/ragas|RAGAS]], golden dataset) — see [[06-mise-en-oeuvre/evaluate-local-model|evaluating a local model]].
- **Oversizing the model** to compensate for a poor index: optimize embeddings and re-ranking first.

## 📚 To go deeper

1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] — full 2026 architecture
2. [[06-mise-en-oeuvre/evaluate-local-model|🧪 Evaluating a local model]]
3. [[00-lexique/langgraph|LangGraph]] — agentic orchestration

## 🔗 See also

- [[00-lexique/vectordb|Vector database]]
- [[00-lexique/graphrag|GraphRAG]]
- [[00-lexique/prompt-injection|Prompt injection]]
- [[00-lexique/appel-outils|Tool calling]]
- [[00-lexique/context-window|Context window]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: Lewis et al., *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks* (NeurIPS 2020). [https://arxiv.org/abs/2005.11401](https://arxiv.org/abs/2005.11401)
