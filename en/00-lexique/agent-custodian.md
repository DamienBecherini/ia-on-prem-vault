---
title: Custodian agent
description: Autonomous agent responsible for maintaining a vault, repository, or document corpus by proposing human-validated corrections.
aliases:
  - Custodian Agent
  - Maintenance agent
  - Maintainer agent
tags:
  - lexique
  - agents
last_modified: "2026-06-04"
---

## 📝 Short definition

Subtype of [[00-lexique/autonomous-agent|autonomous agent]] that monitors a corpus, detects issues, proposes corrections on a branch or in a report, and waits for human validation before publication.

## 📖 Detailed definition

A custodian agent acts like a junior maintainer: it audits links, flags stale sources, suggests lexicon additions, checks claims, and prepares diffs. Its scope is bounded by editorial rules, active plans, and a [[00-lexique/human-in-the-loop|human-in-the-loop]] workflow.

It is especially suited to Markdown vaults, technical documentation, and living knowledge bases.

## 💡 Why it matters for on-prem AI

An on-prem vault quickly becomes too large to maintain by hand. The custodian agent automates monitoring and correction prep without handing merge or publication to an opaque system.

## ⚠️ Common pitfalls

- Granting direct write access to `main`.
- Mixing active and archived plans.
- Letting the agent invent a source to satisfy a constraint.
- Failing to log editorial decisions.

## 📚 Go deeper

1. [[05-agents-et-assistants-on-prem/agents-custodiens/index|On-Prem Custodian Agents]]
2. [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Human-in-the-loop workflow]]
3. [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Target architecture]]

## 🔗 See also

- [[00-lexique/human-in-the-loop|Human-in-the-loop]]
- [[00-lexique/autonomous-agent|Autonomous agent]]
- [[00-lexique/litellm|LiteLLM]]
