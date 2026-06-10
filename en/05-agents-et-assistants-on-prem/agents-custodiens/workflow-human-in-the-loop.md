---
title: "⚙️ Workflow: End-to-end Human-in-the-loop"
description: "Recommended execution cycle for a custodian agent: trigger, branch, diff, report, human review, merge, and publication."
sidebar:
  order: 3
last_modified: "2026-06-10"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

A custodian agent must be autonomous in analysis but conservative in action. The workflow below keeps that separation clear.

## Full cycle

1. **Trigger**: manual, cron, GitHub webhook, new file, or scheduled audit.
2. **Preflight**: verify branch, Git state, rules, active plan, and folders to ignore.
3. **Execution**: read, audit, generate fixes or report.
4. **Isolation**: create a dedicated branch or produce an unapplied patch.
5. **Report**: summarize changes, sources, risks, and verifications.
6. **Human validation**: review diff, questions, corrections.
7. **Merge**: only after explicit agreement.
8. **Publication**: build + deployment, separate from editing work.

> [!warning] Security rule
> A custodian agent never merges to `main` and never publishes without explicit human validation.

## Autonomy levels

| Level | Name | What the agent can do | Risk |
| :-- | :-- | :-- | :-- |
| 0 | Report-only | Read and produce a report | Very low |
| 1 | Patch proposal | Generate a patch or plan | Low |
| 2 | Branch | Modify a dedicated branch | Medium |
| 3 | PR | Open a PR with description | Medium |
| 4 | Staging | Deploy to preproduction | High |
| 5 | Publish | Publish to production | Avoid without human |

For this vault, the reasonable level is **2 or 3**: branch/PR, human validation, then merge.

## Minimal preflight

Before each run:

- **Verify the repo is clean (`git status --porcelain`)**: if the repo is *dirty* (uncommitted changes), the agent must **abort** and notify the operator. It must never bundle a human draft in progress into its commit. Explicit exception only: `git stash` with a timestamped name if the operator enabled this mode in the agent configuration.
- verify that the **active maintenance plan** is up to date (in this vault: `.cursor/plans/` directory in the repository);
- ignore `_private/`, `build/`, `dist/`, `.git/`, and obsolete logs;
- refuse destructive commands;
- cite sources for any factual change.

> [!warning] Race condition — dirty repo
> An agent that starts work on a dirty repo risks mixing its algorithmic changes with human work in progress. If a PR is then opened, it may include unfinished drafts or temporary files the human did not intend to share. **The rule is simple: dirty = abort.**

## Expected report

For a run with Git delivery, the **PR** (description + diff) is the primary trace. Otherwise, a chat report is enough:

- objective;
- modified files;
- sources consulted;
- proposed changes;
- tests or verifications;
- residual risks;
- next steps.

## See also

- [[05-agents-et-assistants-on-prem/agents-custodiens/github-branches-pr-notifications|Branches, PRs & Notifications]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/recherche-web-et-sources|Web Search & Sources]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]]
