---
name: vault-maintenance-report
description: Produce recurring read-only maintenance reports for the IA on-premise vault. Use for scheduled audits, freshness checks, source hygiene, lexicon backlog review, stale content detection, or repository health summaries.
paths:
  - "**/*.md"
  - "**/*.mdx"
---

# Vault Maintenance Report

## Quick Start

Read `references/maintenance-policy.md`.

Default mode is read-only. Do not edit article content during a maintenance report unless the user explicitly asks for implementation.

## Scope

Check:

- pages with old or missing review metadata when present
- source quality and likely stale references
- performance claims lacking strong support
- broken or suspicious internal links
- lexicon backlog items
- missing lexicon entries for recurring terms
- public content that contains agent-only maintenance notes
- publish safety for `.agents/**`, `.cursor/**`, `docs/plans/**`, `_private/**`

## Plan Archive Hygiene

When scanning implementation plans, treat `docs/plans/archive/**` as historical context only.
Do not infer active tasks from archived plans, even if they still contain pending TODOs.

If a plan is marked `SUPERSEDED`, `superseded`, `deprecated`, or clearly replaced by a newer plan,
recommend moving it to `docs/plans/archive/` unless the user explicitly needs it in the active plan list.

## Report Format

```markdown
## Executive Summary

## Highest Priority Findings

## Source Freshness

## Lexicon Maintenance

## Public Content Boundary

## Publish Safety

## Recommended Next Runs

## Run Log
```

## Run Log

For significant maintenance reports, invoke `vault-log-run` and write a run log under `.agents/vault-maintenance/runs/`.

If no files were changed, record the report path and `commitCreated: false`.

