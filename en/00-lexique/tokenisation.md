---
title: Tokenization
description: Splitting text into numeric units (tokens) before an LLM processes it.
aliases:
  - Tokenization
  - BPE
  - Byte Pair Encoding
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Short definition
Turning text into a sequence of numeric identifiers (tokens) the model can process, using a vocabulary learned during training.

## 📖 Detailed definition
Text is split into tokens (words, subwords, or characters) with an algorithm learned during training—the most common being **BPE** (Byte Pair Encoding). Each token gets a unique number in the model vocabulary. That number is what the model actually sees.

Example: *"Where is Paris?"* → `[4502, 381, 1920, 30]`

Vocabulary size varies by model: Llama 3 uses 128,256 tokens. A rare word may split into several subwords, increasing the token count consumed.

## 💡 Why it matters for on-prem AI
Token count for a text directly sets [[00-lexique/kv-cache|KV Cache]] size in [[00-lexique/vram|VRAM]] and the cost of [[00-lexique/prefill|Prefill]]. A 200-page PDF can represent hundreds of thousands of tokens.

## ⚠️ Common pitfalls
- The same text yields different token counts per model tokenizer—do not assume "1 page ≈ 500 tokens" is universal.
- French often uses more tokens than English (more subwords created).

## 📚 Go deeper
1. [[01-fondations/journey-of-a-prompt|🧠 The Journey of a Prompt]] *(Step 1: tokenization in action)*
2. [[01-fondations/kv-cache-and-context|💾 KV Cache & Context]] *(why token count affects VRAM)*

## 🔗 See also
- [[00-lexique/embedding|Embedding]]
- [[00-lexique/context-window|Context window]]
- [[00-lexique/prefill|Prefill]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
