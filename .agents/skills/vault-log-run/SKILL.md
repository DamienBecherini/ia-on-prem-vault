---
name: vault-log-run
description: Optional durable run logs for IA on-premise vault agent tasks without a PR, or when the user explicitly requests a run log. Default audit trail is the PR description and git diff — do not invoke for routine content generation.
paths:
  - "**/*.md"
  - "**/*.mdx"
---

# Vault Log Run

## When to use (and when to skip)

**Skip by default** for content generation, verification, or refresh work that ends with a branch + PR. The PR body and `git diff` are enough.

**Use only when:**

- the user explicitly asks for a run log;
- the task is read-only (maintenance report) with no PR;
- a run failed and diagnostics should be kept outside chat;
- no git commit will be created;
- **the runner is non-interactive** (scheduled automation, CI job, Aider on-prem): always invoke, even when a PR is also created — the run log is the primary audit trail when no human is watching the chat.

## Quick Start

Read `references/run-log-policy.md` before writing or updating a run log.

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

## Run Index (scalability)

After writing a run log, append a single-line entry to the monthly index:

```
.agents/vault-maintenance/runs/YYYY/MM/index.jsonl
```

Each line is a JSON object:

```json
{"runId":"2026_06_04_21-00_main_security-guide","timestamp":"2026-06-04T21:00:00+02:00","status":"completed","mode":"generation","files_changed":3,"plan":"editorial-improvements"}
```

This allows a maintenance agent to orient itself by reading the compact index (a few KB) rather than loading all detailed logs (potentially hundreds of KB) to understand recent history.
Only open the full detailed log when investigating a specific run.

## HITL Sign-Off and Frontmatter

When a human (HITL) approves the results of a verification run:

1. Read `site.config.json` → `editorial.hitl` (see `.agents/references/site-config-editorial.md`).
2. Set `verified_hitl` and `verified_hitl_url` from that config in each verified page frontmatter.
3. Record the approval in the run log under `## Validation`, or in the PR/plan if no run log was created.
4. Do not set HITL fields autonomously without explicit human confirmation.

```yaml
verified_hitl: <editorial.hitl.name>
verified_hitl_url: <editorial.hitl.url>
```

See `docs/frontmatter-schema.md` for the full field specification.

## Retention

After writing a run log:

1. Append a line to the monthly `index.jsonl` (see above).
2. Check whether older detailed logs appear ready for consolidation.
3. If consolidation is needed, create or update the monthly summary with the LLM.
4. Do not delete detailed logs unless a deterministic validation/prune script exists and confirms every run ID is summarized.
5. Until that script exists, record `Retention Check: summary recommended` or `Retention Check: no action`.
