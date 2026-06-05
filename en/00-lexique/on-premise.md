---
title: On-Premise (AI)
description: AI infrastructure hosted and operated on the organization's own equipment, without delegating to a cloud provider.
aliases:
  - On-Prem
  - Local AI
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
Deploying an AI model directly on the organization's machines — not on a cloud provider's servers such as AWS, Azure, or Google.

## 📖 Detailed definition
"On-premise" (literally "on site") refers to any IT infrastructure physically located on the organization's premises or in a datacenter it controls, as opposed to the *cloud*, where resources are rented from a third party.

Applied to AI, this means the [[00-lexique/llm|LLM]] runs on hardware owned by the organization: a desktop PC, a rack server, or a GPU cluster. Data never leaves that controlled perimeter.

[[00-lexique/inference|On-prem inference]] can be done with open-source tools (Ollama, vLLM, llama.cpp) without subscriptions or per-request billing.

## 💡 Why it matters

Three main motivations drive this choice:

**Regulatory compliance** — GDPR (personal data of EU residents), medical privilege, professional secrecy, and sector standards (HDS, ISO 27001, ANSSI) may prohibit sending certain data to third-party servers. On-prem AI is the only technical answer to those constraints.

**Economics at scale** — Cloud APIs bill per token. Beyond a threshold of intensive use (typically a team of 20–50 people using it daily), amortizing a dedicated machine costs less than the monthly cloud bill.

**Autonomy and customization** — Free choice of model, offline operation, no dependency on a vendor's terms of use or price increases.

## ⚠️ Common pitfalls
- Underestimating operational complexity: putting an on-prem LLM into production requires system administration, networking, and MLOps skills.
- Thinking "on-premise" means free: hardware, electricity, maintenance, and human skills have real cost.
- Comparing a local 7B model's performance to GPT-4 — model choice matters as much as hosting architecture.

## 📚 Learn more
1. [[00-lexique/llm|LLM]] *(what is a language model?)*
2. [[00-lexique/inference|Inference (LLM)]] *(how an LLM generates a response)*
3. [[04-blueprints/scenario-a-dev-lab|🛠️ Scenario A]] *(first concrete on-prem deployment)*

## 🔗 See also
- [[00-lexique/llm|LLM]]
- [[00-lexique/inference|Inference (LLM)]]
- [[00-lexique/rag|RAG]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
