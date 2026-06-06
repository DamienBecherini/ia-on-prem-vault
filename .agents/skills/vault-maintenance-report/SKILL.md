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

## Lexicon Backlog Hygiene

The file `.agents/vault-maintenance/lexicon-backlog.md` is a live working document.
Its `## To Create` and `## To Verify Or Update` sections should remain short (under ~30 items).
The `## Done` and `## Already Linked From` sections accumulate over time.

When these history sections exceed ~150 lines total, recommend (or perform if asked) the following:
- Move the content of `## Done` to `.agents/vault-maintenance/archives/lexicon-done-YYYY-MM.md`
- Move the `## Already Linked From` sections to `.agents/vault-maintenance/archives/lexicon-linked-YYYY-MM.md`
- Leave the active `## To Create` and `## To Verify Or Update` sections in place

This keeps the backlog file small so agents do not waste tokens re-reading stale history.

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

## Delivery

**Read-only report (default):** no branch, no commit, no PR. Report findings in chat only.

**If the user requests implementation** (e.g. "apply the fixes", "execute the recommendations"):

1. **Branch** — create `chore/vault-maintenance-<YYYY-MM-DD>`.
2. **Stage** — only the files modified by the implementation (not unrelated files).
3. **Commit** — `chore(maintenance): <short description>`.
4. **Push + PR** — open a PR using the template in `git-workflow.mdc`. Reference the run log path.
5. **Report** — paste the PR URL in chat.

Exception: if the user says "commit to main" or "push directly", skip branch and PR.

