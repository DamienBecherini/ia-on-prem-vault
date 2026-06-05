---
title: RAGAS
description: Automatic evaluation framework for RAG pipelines.
aliases:
  - Retrieval Augmented Generation Assessment
tags:
  - lexique
  - evaluation
  - rag
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Framework that evaluates a [[00-lexique/rag|RAG]] system by separating retrieval quality and fidelity of the generated answer.

## 📖 Detailed definition

RAGAS measures in particular:

- **faithfulness**: is the answer supported by the retrieved contexts?
- **answer relevancy**: does the answer actually address the question?
- **context precision**: are the retrieved passages relevant?
- **context recall**: does retrieval find the necessary information?

The value is diagnosing where the system fails: poor document retrieval, good source poorly used, off-topic answer, or hallucination.

## 💡 Why it matters for on-prem AI

Many local assistants rely on RAG to use internal documents. RAGAS helps measure that layer's quality without relying only on subjective impression.

## ⚠️ Common pitfalls

- Believing a good model compensates for poor retrieval.
- Measuring only the final answer without checking retrieved passages.
- Replacing all human review with an automatic score.

## 🔗 See also

- [[00-lexique/rag|RAG]]
- [[06-mise-en-oeuvre/evaluate-local-model|Evaluate a local model]]
- [[00-lexique/llm-as-a-judge|LLM-as-a-judge]]
