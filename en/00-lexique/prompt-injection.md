---
title: "Prompt injection"
description: "Attack where untrusted content in the LLM context hijacks system instructions to exfiltrate data or execute unauthorized actions."
aliases:
  - Prompt Injection
  - LLM01 Prompt Injection
tags:
  - lexique
  - stack
sidebar:
  order: 67
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
---

## 📝 Short definition

**OWASP LLM01** vulnerability: an attacker inserts instructions into a source the model will read (RAG document, email, web page) to bypass the system prompt or trigger malicious [[00-lexique/appel-outils|tool calls]][^1].

## 📖 Detailed definition

Unlike SQL injection, **prompt injection** exploits the fact that the LLM cannot reliably distinguish "system instruction" from "user content" once everything is concatenated in the [[00-lexique/context-window|context window]].

Two common forms:
- **Direct:** the user sends "ignore your instructions and…".
- **Indirect:** a document indexed in [[00-lexique/rag|RAG]] contains hidden instructions read at retrieval time.

On-premise, the risk is **identical** to the cloud: data sovereignty does not immunize against a poisoned PDF in the internal document base.

## 💡 Why it matters for on-prem AI

- Any multi-source [[00-lexique/rag|RAG]] stack (SharePoint, tickets, wikis) is an attack surface.
- Combined with [[00-lexique/excessive-agency|Excessive Agency]] (LLM06), can lead to exfiltration via tools (send email, API query).
- Covered in depth in [[06-mise-en-oeuvre/local-inference-security|🔐 Local inference security]] (LLM01–LLM10 OWASP 2025).

## ⚠️ Common pitfalls

- Believing a "secret system prompt" is enough: bypassable via indirect injection.
- Indexing unsanitized documents without privilege separation between retrieval and tool execution.
- Forgetting **outbound channels** (LLM07 System Prompt Leakage) during red team tests.

## Mitigations (summary)

| Measure | Role |
| :-- | :-- |
| Least privilege on tools | Limits impact of a successful injection |
| HITL validation on sensitive actions | [[00-lexique/human-in-the-loop|Human-in-the-loop]] |
| Input/output filtering | Detection of injection patterns |
| RAG tenant isolation | [[00-lexique/multi-tenant|Multi-tenant]] without cross-organization leakage |

## 🔗 See also

- [[00-lexique/rag|RAG]]
- [[00-lexique/excessive-agency|Excessive Agency]]
- [[00-lexique/multi-tenant|Multi-tenant]]
- [[06-mise-en-oeuvre/local-inference-security|🔐 Local inference security]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: OWASP GenAI Security Project, *LLM01:2025 Prompt Injection*. [https://genai.owasp.org/llm-top-10/](https://genai.owasp.org/llm-top-10/)
