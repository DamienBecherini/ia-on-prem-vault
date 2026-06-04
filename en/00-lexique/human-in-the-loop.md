---
title: Human-in-the-loop
description: Governance mode where an important automated action waits for human validation before it is applied.
aliases:
  - HITL
  - Human in the loop
  - Human validation
tags:
  - lexique
  - agents
---

## 📝 Short definition

Principle that an agent or automated system may analyze and propose, but must wait for human validation before a critical action: merge, publication, deletion, access to sensitive data.

## 📖 Detailed definition

In an [[00-lexique/autonomous-agent|agentic]] workflow, the LLM can read files, call tools, produce a patch, or open a PR. **Human-in-the-loop** places a human as the control point before the irreversible step.

This differs from *human-on-the-loop*, where a human supervises after the fact. For a document vault or Git repo, the recommended model is hybrid: the agent may work on a branch, but merge stays human.

## 💡 Why it matters for on-prem AI

On-prem does not guarantee safety by itself: a local agent can still delete, publish, or over-edit. Human-in-the-loop limits operational risk while keeping automation gains.

## ⚠️ Common pitfalls

- Confusing notification with validation: receiving a report is not approving the action.
- Allowing automatic merge to `main` for editorial tasks.
- Letting an agent read archived plans and execute stale TODOs.

## 📚 Go deeper

1. [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Human-in-the-loop workflow]]
2. [[05-agents-et-assistants-on-prem/agents-custodiens/vision-agent-custodian|Vision: custodian agent]]

## 🔗 See also

- [[00-lexique/agent-custodian|Custodian agent]]
- [[00-lexique/autonomous-agent|Autonomous agent]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|Custodian agents]]
