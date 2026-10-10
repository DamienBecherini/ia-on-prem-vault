---
title: "🔐 Zero Data Retention (ZDR)"
description: "Cloud LLM API contractual clause: no persistence, reuse or human review of prompts and responses for the covered models and endpoints, negotiated per model."
aliases:
  - ZDR
  - Zero Retention Policy
  - Zero retention policy
tags:
  - lexique
  - compliance
sidebar:
  order: 71
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
---

## 📝 Short definition

Contractual clause (*Zero Data Retention*, ZDR) in enterprise API agreements with cloud LLM providers (OpenAI, Anthropic, Mistral, etc.): for the covered models and endpoints, prompts and model outputs are neither retained after the response, nor reused for training, nor subject to routine human review. As of Q4 2026, coverage is negotiated model by model: it is no longer a given for frontier models[^3].

## 📖 Detailed definition

Under a ZDR clause, the provider commits to:

- **not retaining** prompts and responses beyond the processing of the request: no durable storage or logging of the content (except abuse monitoring, see below);
- **never using** that data for model training or fine-tuning;
- **excluding any human review** of request content.

This is the minimum contractual bar for organizations that want to use cloud LLM APIs while meeting their GDPR data-processing obligations[^1][^2].

## ⚠️ What ZDR does not cover (as of Q4 2026)

- **Frontier models**: since 9 June 2026, Anthropic has designated *Covered Models* (Claude Fable 5 and 5.1, Mythos 5 and 5.1) subject to a minimum 30-day retention on all platforms (API, Bedrock, Google Cloud, Microsoft Foundry); ZDR is unavailable for them, and a ZDR organization must enable retention on the relevant workspace, otherwise the API returns `400`[^3].
- **Stateful endpoints**: files, batch, agents, conversations, and fine-tuning store by design; OpenAI and Mistral explicitly exclude them from ZDR[^1][^4].
- **Experimental models**: at Mistral, Labs/Preview models are excluded from ZDR and from the training opt-out (Terms of 25 September 2026)[^4].
- **Abuse monitoring**: without ZDR, OpenAI retains up to 30 days of logs; under ZDR, flagged image/file inputs may still be retained for review[^1]. Anthropic is preparing a variant where this data stays in the customer's cloud (*Enterprise Frontier Safeguards*, announced on 1 September 2026)[^3].

## ⚠️ Important nuance: persistence ≠ transit

ZDR addresses data **persistence** at the provider, not **transit**. Data still leaves the organization's infrastructure and transits to the vendor's servers. For organizations that accept no external transit — defense, healthcare with patient identifiers — ZDR is **insufficient**: a fully [[00-lexique/on-premise|on-premise]] deployment (Tier 3) is required.

| Requirement | ZDR cloud | On-premise |
| :-- | :-- | :-- |
| No storage at provider | ✅ for covered models/endpoints | ✅ |
| No transit outside perimeter | ❌ | ✅ |
| Full control over processing | Partial | ✅ |

## 💡 Why it matters

For teams that cannot yet migrate to [[00-lexique/on-premise|on-premise]] but must process sensitive data via API, a ZDR clause is an audit prerequisite — not a guarantee of full sovereignty. See [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]] for the full evaluation grid.

## 🔗 See also

- [[00-lexique/on-premise|On-Premise (AI)]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: OpenAI, *Your data — data controls in the OpenAI platform* (Zero Data Retention, Modified Abuse Monitoring, Private Safety Processing), read on 2026-10-09. [https://developers.openai.com/api/docs/guides/your-data](https://developers.openai.com/api/docs/guides/your-data)
[^2]: Microsoft, *Data, privacy, and security for Foundry Models sold by Azure in Microsoft Foundry* (modified abuse monitoring, no training on prompts), updated 2026-06-05. [https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy)
[^3]: Anthropic, *Covered Models* (Claude Fable 5 / 5.1 and Mythos 5 / 5.1: retention of at least 30 days on all platforms, ZDR unavailable; designations of 2026-06-09 and 2026-08-31), *API and data retention* and the *Enterprise Frontier Safeguards* announcement (2026-09-01), read on 2026-10-10. [https://support.claude.com/en/articles/15425695-covered-models](https://support.claude.com/en/articles/15425695-covered-models) · [https://platform.claude.com/docs/en/manage-claude/api-and-data-retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) · [https://www.anthropic.com/news/enterprise-frontier-safeguards](https://www.anthropic.com/news/enterprise-frontier-safeguards)
[^4]: Mistral AI, *Commercial Terms of Service* (effective 2026-09-25: Labs/Preview models excluded from ZDR and from the training opt-out) and *Can I activate Zero Data Retention (ZDR)?* (paid plans, on request, stateless calls only; agents, conversations, libraries, batch, and `/v1/files` excluded), read on 2026-10-09. [https://legal.mistral.ai/terms/commercial-terms-of-service](https://legal.mistral.ai/terms/commercial-terms-of-service) · [https://help.mistral.ai/en/articles/347612-can-i-activate-zero-data-retention-zdr](https://help.mistral.ai/en/articles/347612-can-i-activate-zero-data-retention-zdr)
