---
title: Embedding
description: Dense numerical representation of a token or document in vector space.
aliases:
  - Embeddings
  - Embedding vector
  - Vector representation
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

Coordinate vector encoding the meaning of a token or document in mathematical space — nearby concepts are nearby in that space.

## 📖 Detailed definition

After [[00-lexique/tokenisation|tokenisation]], each token becomes a fixed-size vector (e.g. 4096 dimensions for Llama 3.1 8B). In that space, “King” and “Queen” are close; “Paris” and “France” too. That geometry lets the model reason by analogy.

**Two distinct uses — do not conflate:**
- **Internal LLM embeddings**: vectors computed at each layer during Prefill/Decoding — they feed [[00-lexique/attention|attention]].
- **Search embeddings (RAG)**: produced by specialized models (e.g. `nomic-embed-text`, `sentence-transformers`) to index documents in a [[00-lexique/vectordb|vector database]].

## 💡 Why it matters for on-prem AI

RAG quality depends heavily on the embedding model chosen. A poor embedding model yields poor retrieval regardless of downstream LLM quality.

## ⚠️ Common pitfalls

- Internal LLM embeddings and RAG search embeddings are different models for different jobs.
- Using an English-only embedding model on a French corpus strongly degrades quality.

## 📚 Go deeper

1. [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt]] *(Step 2: from token to vector)*
2. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] *(how search embeddings feed RAG)*

## 🔗 See also

- [[00-lexique/tokenisation|Tokenisation]]
- [[00-lexique/attention|Attention]]
- [[00-lexique/rag|RAG]]
- [[00-lexique/vectordb|Vector database]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
