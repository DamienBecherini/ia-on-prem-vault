---
name: vault-log-run
description: Create or update IA on-premise vault agent run logs. Use when finishing content generation, verification, recurring maintenance, source audits, refresh work, or any agent task that changes files or produces a durable maintenance report.
paths:
  - "**/*.md"
  - "**/*.mdx"
---

# Vault Log Run

## Quick Start

Read `references/run-log-policy.md` before writing or updating a run log.

Create a run log for every significant agent task:

- content generation or rewrite
- verification or source audit
- recurring maintenance report
- lexicon maintenance
- branch/PR preparation
- failed run with useful diagnostics

Do not put run metadata inside public articles.

## Location

Write run logs under:

```text
.agents/vault-maintenance/runs/YYYY/MM/YYYY_MM_DD_HH-MM_<branch-slug>_<task-slug>.md
```

Use the current local time. Build `<branch-slug>` from the current Git branch by replacing `/` with `__`.

## Required Sections

Use this template:

```markdown
---
runId: YYYY_MM_DD_HH-MM_<branch-slug>_<task-slug>
timestamp: YYYY-MM-DDTHH:mm:ss+TZ
repo: ia-on-prem-vault
branch: <branch>
baseHead: <sha-or-unknown>
finalHead: <sha-or-no-commit>
status: completed | failed | partial
mode: generation | verification | maintenance | refresh | planning
commitCreated: true | false
prUrl:
plan:
skills:
  - vault-log-run
---

# Agent Run - <task>

## Objective

## Files Changed

## Git State

## Sources Consulted

## Validation

## Lexicon Follow-Up

## Retention Check

## Residual Risk
```

## Retention

After writing a run log:

1. Check whether older detailed logs appear ready for consolidation.
2. If consolidation is needed, create or update the monthly summary with the LLM.
3. Do not delete detailed logs unless a deterministic validation/prune script exists and confirms every run ID is summarized.
4. Until that script exists, record `Retention Check: summary recommended` or `Retention Check: no action`.

