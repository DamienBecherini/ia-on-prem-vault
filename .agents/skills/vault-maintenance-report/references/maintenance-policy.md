# Maintenance Policy

Maintenance reports are designed to keep the vault accurate without silently rewriting public content.

## Default Safety

- Read-only unless explicitly asked to implement.
- Prefer issues, `.cursor/plans/`, branches or PRs for follow-up.
- Never publish directly.
- Never commit unless explicitly asked.
- Never mix agent notes into public pages.

## Priority Order

1. Security, privacy, unpublished content leakage.
2. Fabricated, dead or mismatched sources.
3. Strong performance claims without support.
4. Stale hardware/software claims.
5. Lexicon contradictions or missing central terms.
6. Navigation and link hygiene.
7. Style and readability.

## Freshness Checks

Treat these as high-risk:

- hardware availability and pricing
- model benchmark numbers
- runtime support matrices
- version-specific CLI commands
- vendor product claims
- legal/privacy/provider behavior

If freshness cannot be verified, mark the claim as `needs review` rather than rewriting it.

## Public Content Boundary

Flag any reader-facing page that contains:

- `Lexique - actions`
- `Nouvelles fiches à créer`
- `Fiches à vérifier`
- run log metadata
- TODOs intended for agents

Move those items to the active plan (`.cursor/plans/`), `.agents/vault-maintenance/lexicon-backlog.md`, or (only if requested) a run log under `.agents/vault-maintenance/runs/`.

## Output Policy

Every recommendation should include:

- affected file
- reason
- suggested next action
- confidence level: high, medium or low

