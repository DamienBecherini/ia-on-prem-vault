---
name: vault-translate-content
description: Translate validated French vault pages into English mirrors under en/. Use for dedicated EN translation passes after FR content is merged, or when npm run audit:i18n:strict lists stale EN files. Faithful translation only — not a rewrite.
paths:
  - "**/*.md"
  - "**/*.mdx"
---

# Vault Translate Content

## When to use

- After FR content PRs are merged and `npm run audit:i18n:strict` lists stale EN mirrors.
- When the user explicitly requests English translation of specific paths.
- Use a **cheaper model** when possible — this task is translation, not editorial generation.

Do **not** use for new FR content creation (see `vault-generate-content`).

## Quick Start

1. Run `npm run audit:i18n:strict` or use the user-provided file list.
2. Read each FR source and its existing EN mirror (if any).
3. Translate faithfully into English under `en/<same-relative-path>.md`.
4. Set EN `last_modified` to match or exceed the FR source date.
5. Open a dedicated PR (`feat/i18n-<slug>` or `feat/i18n-sync-YYYY-MM-DD`).

Skip `README.md` — it is repo documentation, not a published note.

## Translation rules

Read `references/translation-policy.md` before editing.

Summary:

- Translate `title` and `description` frontmatter to English.
- Keep body in English; preserve technical terms where standard (vLLM, KV Cache, RoCE, etc.).
- **Do not change wikilink targets** — same slugs as FR (`[[01-fondations/memory-bandwidth]]`).
- Keep footnote URLs and external links unchanged.
- Do not rewrite, shorten, or "improve" the FR editorial voice.
- Do not add or remove sections unless the FR source changed structure.
- Never create empty EN stubs.

## Workflow

For each file in the backlog:

1. Read FR at vault root path.
2. Read existing EN at `en/<path>` if present (update in place).
3. Mirror frontmatter keys from FR except localized `title` / `description`.
4. Copy `sidebar.order` and verification fields from FR unless EN-specific.
5. Set `last_modified` on EN to the FR `last_modified` value (or today if FR lacks it).
6. Preserve Obsidian callouts (`> [!tip]`, etc.) with English labels.

## Delivery

1. **Branch** — `feat/i18n-sync-<YYYY-MM-DD>` or `feat/i18n-<kebab-topic>`.
2. **Stage** — only `en/**` files changed by this task (and the skill if new).
3. **Commit** — `feat(i18n): sync EN mirrors for <short scope>`.
4. **Push + PR** — read `.cursor/rules/git-workflow.mdc`. List translated paths in PR body.
5. **Validate** — `npm run audit:i18n:strict` should show fewer (or zero) stale entries for translated paths.

## Output report

When finishing, report:

- files translated
- FR `last_modified` → EN `last_modified` pairs
- `audit:i18n:strict` before/after stale count
- PR URL
