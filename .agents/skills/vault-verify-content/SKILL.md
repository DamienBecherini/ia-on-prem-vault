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

## Residual Risk

Short note on anything not verified.
```

