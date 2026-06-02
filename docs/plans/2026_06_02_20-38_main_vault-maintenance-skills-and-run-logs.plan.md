---
name: vault-maintenance-skills-and-run-logs
overview: Create vault maintenance skills and strengthen existing skills to trace runs, separate public content from agent notes, and prepare reliable retention.
todos:
  - id: run-log-skill
    content: Create the vault-log-run skill to log agent executions
    status: completed
  - id: maintenance-report-skill
    content: Create the vault-maintenance-report skill for recurring read-only audits
    status: completed
  - id: refresh-skill
    content: Create the vault-refresh-outdated-content skill for sourced updates of existing articles
    status: completed
  - id: references
    content: Create shared references run-log-policy and maintenance-policy
    status: completed
  - id: improve-existing
    content: Improve vault-generate-content and vault-verify-content to use run logs, backlog, and public content boundary
    status: completed
  - id: verify
    content: Verify skills, run diagnostics/build, and append the report
    status: completed
isProject: false
---

# Vault maintenance skills and run logs

## Why this workstream

Recent work revealed three structural problems:

1. **Reader content / agent notes mixed.** The first version of `02-materiel/stations-multi-gpu.md` contained a `Lexique - actions` section useful for the agent but visible to readers.
2. **Insufficient traceability outside Git.** Git keeps the diff, but not always the intent, sources consulted, skills used, validations, lexicon follow-ups, or decisions not to create a commit.
3. **Accumulation risk.** If every recurring agent writes detailed run logs, `.agents/vault-maintenance/` can become heavy and noisy without a retention policy.

The vault therefore needs an explicit agentic maintenance layer:

- published articles stay clean
- plans keep workstream intent and reports
- run logs keep operational history
- agent backlogs keep unpublished maintenance tasks
- retention combines AI summaries and future deterministic validation

## Proposed solution

Create three new project skills under `.agents/skills/`:

1. `vault-log-run`: create timestamped agent execution logs, with Git metadata, touched files, sources, validations, follow-ups, and retention policy.
2. `vault-maintenance-report`: produce recurring read-only vault audits: freshness, sources, lexicon, pages to review, publication risks.
3. `vault-refresh-outdated-content`: update an existing page with source-first research, in draft/branch/PR mode, with separate verification.

Improve the two existing skills:

- `vault-generate-content`: end every significant generation with a run log, keep lexicon follow-up out of public articles, use the backlog.
- `vault-verify-content`: also verify the public content / agent notes boundary, and produce a run log for significant audits.

Create shared references:

- `references/run-log-policy.md`
- `references/maintenance-policy.md`

## Files

- Create: `.agents/skills/vault-log-run/SKILL.md`
- Create: `.agents/skills/vault-log-run/references/run-log-policy.md`
- Create: `.agents/skills/vault-maintenance-report/SKILL.md`
- Create: `.agents/skills/vault-maintenance-report/references/maintenance-policy.md`
- Create: `.agents/skills/vault-refresh-outdated-content/SKILL.md`
- Modify: `.agents/skills/vault-generate-content/SKILL.md`
- Modify: `.agents/skills/vault-verify-content/SKILL.md`
- Modify: this plan, append implementation/build report

## Design decisions

### Public content boundary

Reader-facing pages must not contain agent maintenance notes:

- no `Lexique - actions`
- no `Nouvelles fiches à créer`
- no `Fiches à vérifier`
- no run metadata blocks

Agent-only material goes to:

- `docs/plans/*.plan.md` for workstream intent and reports
- `.agents/vault-maintenance/lexicon-backlog.md` for lexicon follow-up
- `.agents/vault-maintenance/runs/` for operational timeline

### Run logs

Run logs are append-only operational traces. They complement Git, they do not replace Git.

Target path:

```text
.agents/vault-maintenance/runs/YYYY/MM/YYYY_MM_DD_HH-MM_<branch-slug>_<task-slug>.md
```

Required content:

- timestamp
- repository
- branch
- base HEAD
- final HEAD if committed
- commit/PR status
- skills used
- files created/modified/deleted
- sources consulted
- validation evidence
- lexicon follow-up
- residual risk

### Retention

An LLM must summarize; a deterministic script must validate/prune later.

Policy:

- keep detailed logs for the latest 50 runs or latest 2 months
- older logs are candidates for monthly summaries
- yearly summaries can consolidate previous years
- never delete a detailed run unless its run ID is represented in a monthly/yearly summary
- until a validation script exists, agents may create summaries but must not prune detailed logs

## Tasks

- [x] Create `vault-log-run`.
- [x] Create `vault-maintenance-report`.
- [x] Create `vault-refresh-outdated-content`.
- [x] Create shared references.
- [x] Update `vault-generate-content`.
- [x] Update `vault-verify-content`.
- [x] Verify frontmatter and skill discoverability.
- [x] Run lints on edited files.
- [x] Run Starlight build from the engine repo.
- [x] Append implementation/build report to this plan.

## Success criteria

- Future generation/verification tasks have a clear run-log convention.
- Future recurring audits have a read-only maintenance skill.
- Future refresh work has a source-first, human-in-the-loop workflow.
- The existing generation/verification skills no longer rely only on chat final summaries.
- Public article content is explicitly separated from maintenance notes.
- Build passes after adding skills and references.

---

## Implementation report

### Changes

Created three new project skills:

- `.agents/skills/vault-log-run/SKILL.md`
- `.agents/skills/vault-maintenance-report/SKILL.md`
- `.agents/skills/vault-refresh-outdated-content/SKILL.md`

Created two reference files:

- `.agents/skills/vault-log-run/references/run-log-policy.md`
- `.agents/skills/vault-maintenance-report/references/maintenance-policy.md`

Improved existing skills:

- `.agents/skills/vault-generate-content/SKILL.md`
  - now asks for `vault-log-run` on significant generation or rewrite tasks
  - reinforces lexicon follow-up outside public articles
  - requires backlog items or minimal entries for important missing terms
- `.agents/skills/vault-verify-content/SKILL.md`
  - now checks for accidental agent-only sections in public content
  - adds public content boundary reporting
  - asks for run logs on significant audits

Created the first structured run log:

- `.agents/vault-maintenance/runs/2026/06/2026_06_02_23-11_main_vault-maintenance-skills-and-run-logs.md`

### Validation

IDE diagnostics:

- Result: no linter errors found on edited skill and plan files.

Build:

- Command: `npm run build`
- Working directory: `D:\Webdev\starlight-obsidian-engine`
- Result: success
- Evidence:
  - Lexicon index regenerated: 26 entries
  - Link graph regenerated: 34 targets, 154 backlinks
  - Vault loader excluded 8 unpublished vault files
  - Astro/Starlight generated 74 pages

### Git state

- Vault branch: `main`
- Base HEAD during implementation: `e0e7fa6`
- Commit created: no

### Limitations and follow-up

- The retention policy is documented, but the deterministic validation/prune script does not exist yet.
- Until that script exists, agents may create monthly/yearly summaries but must not delete detailed run logs.
- A future skill or script can implement `prune-run-logs` once enough real run logs exist to validate the format.

