---
title: "🔐 Zero Data Retention (ZDR)"
description: "Cloud LLM API contractual clause guaranteeing no persistence, reuse, or human review of prompts and responses."
aliases:
  - ZDR
  - Zero Retention Policy
  - Zero retention policy
tags:
  - lexique
  - compliance
sidebar:
  order: 71
last_modified: "2026-06-09"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
---

## 📝 Short definition

Contractual clause (*Zero Data Retention*, ZDR) in enterprise API agreements with cloud LLM providers (OpenAI, Anthropic, Mistral, etc.): prompts and model outputs are neither persisted, reused for training, nor subject to human review.

## 📖 Detailed definition

Under a ZDR clause, the provider commits to:

- processing prompts and responses **in memory only**, with no writes to disk or application logs;
- **never using** that data for model training or fine-tuning;
- **excluding any human review** of request content.

This is the minimum contractual bar for organizations that want to use cloud LLM APIs while meeting their GDPR data-processing obligations[^1][^2].

## ⚠️ Important nuance: persistence ≠ transit

ZDR addresses data **persistence** at the provider, not **transit**. Data still leaves the organization's infrastructure and transits to the vendor's servers. For organizations that accept no external transit — defense, healthcare with patient identifiers — ZDR is **insufficient**: a fully [[00-lexique/on-premise|on-premise]] deployment (Tier 3) is required.

| Requirement | ZDR cloud | On-premise |
| :-- | :-- | :-- |
| No storage at provider | ✅ | ✅ |
| No transit outside perimeter | ❌ | ✅ |
| Full control over processing | Partial | ✅ |

## 💡 Why it matters

For teams that cannot yet migrate to [[00-lexique/on-premise|on-premise]] but must process sensitive data via API, a ZDR clause is an audit prerequisite — not a guarantee of full sovereignty. See [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]] for the full evaluation grid.

## 🔗 See also

- [[00-lexique/on-premise|On-Premise (AI)]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: OpenAI, *Enterprise Privacy — Zero Data Retention*. [https://platform.openai.com/docs/guides/your-data](https://platform.openai.com/docs/guides/your-data)
[^2]: Microsoft, *Azure OpenAI Service — Data privacy*. [https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/data-privacy](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/data-privacy)
