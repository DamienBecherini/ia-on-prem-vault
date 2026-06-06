---
name: vault-refresh-outdated-content
description: Refresh existing IA on-premise vault pages when content may be stale. Use for outdated hardware/software claims, changed benchmarks, new source evidence, or scheduled content update runs.
paths:
  - "**/*.md"
  - "**/*.mdx"
---

# Vault Refresh Outdated Content

## Quick Start

Use this with:

- `vault-generate-content` for drafting changes
- `vault-verify-content` for adversarial verification
- `vault-log-run` for the final operational trace

Default to human-in-the-loop:

1. Identify stale claims.
2. Fetch or inspect current sources.
3. Propose focused edits.
4. Apply edits only when the user requested execution.
5. Verify sources and build.
6. Write a run log.

## Refresh Rules

- Do not rewrite a whole article just because one claim is stale.
- Preserve the article's teaching flow and voice.
- Replace obsolete numbers with sourced current numbers or cautious ranges.
- If sources disagree, explain the uncertainty instead of picking the most convenient value.
- Keep agent-only follow-up out of public articles.

## Source Requirements

Prefer:

- vendor documentation for product capabilities
- project documentation for runtime behavior
- benchmark reports with disclosed hardware, model, quantization and runtime
- primary papers for algorithms

Avoid:

- unsourced blog benchmark tables
- marketing claims without test context
- copied claims from generated summaries

## Output

When finishing, report:

- stale claims reviewed
- claims changed
- sources added or removed
- lexicon follow-up
- validation run
- residual risk

Then invoke `vault-log-run`.

## Delivery

After the run log is written:

1. **Branch** — create `chore/vault-refresh-<YYYY-MM-DD>` (or reuse the active plan branch).
2. **Stage** — only the refreshed files and the run log.
3. **Commit** — `chore(refresh): <short description of what was refreshed>`.
4. **Push + PR** — open a PR using the template in `git-workflow.mdc`.
5. **Report** — paste the PR URL in chat.

Exception: if the user says "commit to main" or "push directly", skip branch and PR.

