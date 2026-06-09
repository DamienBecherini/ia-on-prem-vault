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
- publish safety for `.agents/**`, `.cursor/**`, `_private/**`
- translation drift: EN mirrors lagging behind FR source (`npm run audit:i18n:strict`)
- link-audit allowlist hygiene: slugs in `.agents/vault-maintenance/link-audit-allowlist.md` whose target pages now exist and can be removed

## Lexicon Backlog Hygiene

The file `.agents/vault-maintenance/lexicon-backlog.md` is a live working document.
Its `## To Create` and `## To Verify Or Update` sections should remain short (under ~30 items).
The `## Done` and `## Already Linked From` sections accumulate over time.

When these history sections exceed ~150 lines total, recommend (or perform if asked) the following:
- Move the content of `## Done` to `.agents/vault-maintenance/archives/lexicon-done-YYYY-MM.md`
- Move the `## Already Linked From` sections to `.agents/vault-maintenance/archives/lexicon-linked-YYYY-MM.md`
- Leave the active `## To Create` and `## To Verify Or Update` sections in place

This keeps the backlog file small so agents do not waste tokens re-reading stale history.

## Plan hygiene

Active implementation plans live in `.cursor/plans/` (Cursor default, excluded from publish). Do not infer active tasks from superseded or archived plans elsewhere in the repo.

## Report Format

```markdown
## Executive Summary

## Highest Priority Findings

## Translation Drift (FR → EN)

## Source Freshness

## Lexicon Maintenance

## Public Content Boundary

## Publish Safety

## Recommended Next Runs
```

Report findings in chat. For read-only maintenance, a PR is usually not required. Invoke `vault-log-run` only if the user asks for a durable log file.

## Delivery

**Read-only report (default):** no branch, no commit, no PR. Report findings in chat only.

**If the user requests implementation** (e.g. "apply the fixes", "execute the recommendations"):

1. **Branch** — create `chore/vault-maintenance-<YYYY-MM-DD>`.
2. **Stage** — only the files modified by the implementation (not unrelated files).
3. **Commit** — `chore(maintenance): <short description>`.
4. **Push + PR** — read `.cursor/rules/git-workflow.mdc` for the PR body template and branch naming rules.
5. **Report** — paste the PR URL in chat.

Exception: if the user says "commit to main" or "push directly", skip branch and PR.

