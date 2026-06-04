---
title: "🧩 RAG & Agents: The knowledge architecture"
description: How to give a local LLM private memory and autonomy. From standard RAG to agentic workflows (SmolAgents, LangGraph) and the Memory Tree approach for VRAM savings.
sidebar:
  order: 3
---

> [!tip] In brief
> A standalone LLM does not know your documents. RAG gives it access to your document base without retraining. Agents add the ability to act and reason in a loop. Together they form the backbone of a sovereign enterprise assistant.

A "bare" [[00-lexique/llm|LLM]] fresh from the factory is frozen in time. Its internal weights hold broad general knowledge, but it knows nothing about your company documents, yesterday's meetings, or the state of your database. Worse: if you try to teach it that information via retraining (fine-tuning), it is very expensive for often disappointing results on precise fact retrieval.

To turn this blind statistical engine into a sovereign enterprise assistant, the standard software solution is **RAG** (Retrieval-Augmented Generation)[^1]. And since 2025, this concept has evolved toward autonomous **Agentic Workflows**.

---

## 1. Standard RAG: Vector search

Classic RAG (very popular between 2023 and 2024) is a linear chain:
1.  **Ingestion:** Your documents (PDF, Word, code) are split into small blocks (*chunks*). A specialized model converts these blocks into number lists (embeddings) and stores them in a **[[00-lexique/vectordb|Vector Database]]** (such as Qdrant, Milvus, or Chroma).
2.  **Search:** When the user asks a question, the system finds the blocks mathematically closest to the question.
3.  **Generation:** The system pastes these blocks into the user's prompt invisibly, then sends everything to the LLM to generate the answer.

### ⚠️ The physical limit (The KV Cache wall)
Standard RAG has an architectural flaw on-premise: it is blind. To avoid missing anything, developers often configure the database to return the top 20 results. The final prompt swells enormously, saturating the model's [[00-lexique/context-window|context window]].
As we saw in the hardware chapter, a huge context explodes the **[[01-fondations/kv-cache-and-context|KV Cache]]** size, destroying your server VRAM and collapsing [[00-lexique/inference|inference]] performance[^2].

---

## 2. The 2026 evolution: Agentic RAG and GraphRAG

To avoid saturating memory with useless information, the market has shifted to **Agentic RAG**[^1][^3]. Instead of being a passive pipe, the LLM becomes the driver.

### The agent framework
With libraries like [[00-lexique/smolagents|SmolAgents]] (Hugging Face) or LangGraph, developers give the LLM **Tools** (*Tool Calling* / *Function Calling*).
The flow becomes dynamic:
1. The user asks a complex question.
2. The agent reasons: *"Do I need to search the HR database or the source code?"*
3. The agent calls the search tool, reads a summary, and **decides itself** whether the information is sufficient or whether it needs a finer search before writing the final answer[^4].

### GraphRAG
Popularized by Microsoft research, **[[00-lexique/graphrag|GraphRAG]]** replaces the "dumb" vector database with a **Knowledge Graph**[^5]. The system extracts entities (people, places, concepts) and their relationships. This lets the LLM answer global questions (e.g. *"What are the main themes discussed by the product team this month?"*) that systematically failed classic vector RAG.

---

## 3. The [[00-lexique/memory-tree|Memory Tree]] approach

Rather than using a heavy vector database, an alternative architecture relies on **hierarchical Markdown folders** and a local SQLite metadata store[^6]. The idea is to give the agent a *summarized* view of available knowledge, and load detail only when needed. This pattern is detailed in the [[00-lexique/memory-tree|Memory Tree]] entry.

*   **Hierarchy:** The agent never loads a full document into memory. It uses the LLM to read the "title" and a "one-line summary" of the file tree.
*   **Selective injection:** If it judges a file relevant, the agent calls a function to "unfold" that specific tree node and read its exact content.
*   **Architectural advantage:** Context stays tiny (a few hundred tokens for summaries), keeping [[00-lexique/ttft|TTFT]] (time to first token) under one second and preserving hardware resources, even with a heavy dense model.

> [!tip] Go further
> This approach is implemented by several local personal assistants — with varying degrees of sovereignty depending on the project. See the comparison [[05-agents-et-assistants-on-prem/assistants-personnels/index|On-Premise Personal Assistants]] and the [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] entry for a documented Memory Tree example.

---

## 4. Choosing your vector database

Vector database choice depends on data volume, required sovereignty level, and available resources.

| Solution | Type | Strengths | Limits | Best for |
| :-- | :-- | :-- | :-- | :-- |
| **Chroma** | In-process (Python) | Zero configuration, embedded | Not suited to > 1M chunks | Prototyping, dev lab |
| **Qdrant** | Docker server | Rich payload filtering, REST/gRPC, scalable | Infra to operate | SMB, modern production |
| **Milvus** | Distributed server | Billions of vectors, high availability | Complex to operate | Datacenter, large volumes |
| **pgvector** | PostgreSQL extension | Vectors in existing database | Performance < native vector DBs | Existing Postgres stack |
| **SQLite + vss** | Local file | Zero dependencies, max sovereignty | No H-scale scalability | Solo, Memory Tree patterns |

> [!tip] Quick start with Qdrant locally
> ```bash
> # Run Qdrant in Docker (persistent data in ./qdrant_storage)
> docker run -p 6333:6333 -p 6334:6334 \
>   -v ./qdrant_storage:/qdrant/storage \
>   qdrant/qdrant
>
> # Create a collection via the REST API
> curl -X PUT http://localhost:6333/collections/ma-base \
>   -H 'Content-Type: application/json' \
>   -d '{"vectors": {"size": 1024, "distance": "Cosine"}}'
> ```

## 5. Reference architecture — Sovereign RAG stack

```
Documents (PDF, MD, DOCX)
        │
        ▼
  Chunking + Embedding
  (local model: nomic-embed-text, mxbai-embed via Ollama)
        │
        ▼
  Local vector database (Qdrant)
        │
        ▼
  Routing agent (fast 7–8B model)
  ┌─────┴─────┐
  │           │
  ▼           ▼
Vector DB   Web / FS tool
  │
  ▼
Assembled context
  │
  ▼
Main LLM (70B) — answer generation
```

**Recommended local embedding models:**

```bash
# Via Ollama
ollama pull nomic-embed-text   # 137M parameters, 768 dim, very fast
ollama pull mxbai-embed-large  # 335M parameters, 1024 dim, better quality

# Quick test
curl http://localhost:11434/api/embeddings \
  -d '{"model": "nomic-embed-text", "prompt": "Memory bandwidth limits inference."}'
```

---

## 📋 The Architect's Advice

To build a sovereign enterprise software stack in 2026:

1.  **Dedicate a small model to routing:** Do not use your large 70B model to choose which tool to call. Use an ultra-fast model (e.g. Qwen 2.5 7B or Llama 3 8B) configured specifically for *Function Calling*. It will call the database.
2.  **Keep large models for synthesis:** Once the small agent has retrieved the right text blocks, send everything to the heavy model (the "brain") to write the final answer.
3.  **Avoid cloud dependencies:** If you use LangChain or LlamaIndex, audit telemetry. In pure on-premise setups, minimal frameworks like [[00-lexique/smolagents|SmolAgents]] ensure your prompts will not leak to an external API during orchestration[^4].

---

## 📚 Sources and References

[^1]: Lyzr Blog, *What is Agentic RAG? Everything You Need to Know in 2026* (Évolution des pipelines statiques vers l'adaptation intelligente), Janvier 2026.
[^2]: NVIDIA Technical Blog, *Mastering LLM Techniques: Inference Optimization* (Impact du contexte long sur le KV Cache), Novembre 2023.
[^3]: Vinod Rane (Medium), *Next-Generation Agentic RAG with LangGraph (2026 Edition)* (Graph orchestration, self-correcting RAG), Mars 2026.
[^4]: Hugging Face, *Agentic RAG with SmolAgents* (RAG orchestration via Hugging Face light framework), 2025.
[^5]: Neo4j Developer Blog, *What is agentic RAG? A developer's guide* (GraphRAG, ReAct, multi-agent RAG patterns), Mai 2026.
[^6]: OpenHuman, *Memory Trees* (GitBook — pipeline local SQLite + Markdown, injection sélective pour économie VRAM), 2025. Note : OpenHuman utilise par défaut un backend cloud pour le routage des modèles. Le *pattern* Memory Tree reste applicable dans une implémentation 100% on-premise indépendante du projet.
