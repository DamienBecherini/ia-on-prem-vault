---
name: vault-verify-content
description: Verify IA on-premise vault content for factual accuracy, source relevance, link validity, performance-claim nuance, and lexicon consistency. Use when auditing chapter articles, lexicon entries, generated drafts, or sourced technical notes in this vault.
paths:
  - "**/*.md"
  - "**/*.mdx"
---

# Vault Verify Content

## Quick Start

Read `references/source-verification.md`, then inspect the target article, linked lexicon entries, and cited sources when possible.

Use a review stance: findings first, ordered by severity. Prefer concrete fixes over broad comments.

Respect explicit user overrides. If the user asks not to use this skill or the project workflow, do not apply it; keep only factuality, source, and safety constraints.

For significant audits, also use `vault-log-run` before finishing.

## Verification Checklist

Check the content for:

- unsupported factual claims
- invented, dead, irrelevant, or weak sources
- performance numbers without enough context
- claims that overstate what the cited source says
- outdated hardware, software, model, or benchmark information
- internal wikilinks that point to missing or inconsistent pages
- lexicon entries that should be created, linked, or updated
- mismatch between chapter style and lexicon-entry structure
- agent-only sections accidentally left in public content
- audience mismatch for a Zero to Hero IA on-premise reader

## Performance Claims

For any tokens/s, latency, bandwidth, VRAM, RAM, context length, quality delta, or percentage gain:

1. Identify the exact claim.
2. Check whether a nearby citation supports that exact claim.
3. Verify the source context: hardware, model, quantization, runtime, batch size, and date.
4. If support is weak, require cautious wording or removal.

## Lexicon Checks

For chapter articles:

- Important terms should link to existing `00-lexique/` entries when available.
- Missing important terms should be listed as lexicon entries to create.
- Linked lexicon entries should be checked for contradictions or stale definitions.

For lexicon entries:

- The entry must follow `_templates/_Terme Lexique.md`.
- It should define, not duplicate, a full chapter.
- It should include useful `Voir aussi` links.

## Public Content Boundary

For reader-facing pages, flag agent-only maintenance content:

- sections named `Lexique - actions`, `Nouvelles fiches a creer`, or `Fiches a verifier`
- run metadata blocks
- internal TODOs meant for agents
- maintenance reports embedded in article prose

Move those items to `docs/plans/`, `.agents/vault-maintenance/lexicon-backlog.md`, or `.agents/vault-maintenance/runs/`.

## Report Format

Use this format:

```markdown
## Findings

- **Severity:** Critical | Major | Minor
  **Issue:** Short description.
  **Evidence:** File/path and claim/source detail.
  **Fix:** Concrete correction.

## Lexicon Follow-Up

- Create:
- Link:
- Verify/update:

## Source Status

- Valid:
- Weak or mismatched:
- Dead or unfetched:

## Public Content Boundary

- Clean:
- Agent-only content found:

## Residual Risk

Short note on anything not verified.
```

## Frontmatter Update After Verification

After completing a verification run on a page and receiving HITL approval, read `site.config.json` → `editorial` (see `.agents/references/site-config-editorial.md`), then update the page frontmatter:

```yaml
last_verified: YYYY-MM-DD              # today's date
verified_by: <editorial.defaultAgent>    # from site.config.json
```

Do not set `verified_hitl` — that field is set by `vault-log-run` after explicit human sign-off, using `editorial.hitl` from the same config.

If the page does not yet have these fields, add them after the existing frontmatter keys.

See `docs/frontmatter-schema.md` for the full field specification.

## Run Log

For significant verification tasks, invoke `vault-log-run` and record:

- target files
- sources checked
- findings count by severity
- lexicon follow-up
- whether edits were made
- validation performed

