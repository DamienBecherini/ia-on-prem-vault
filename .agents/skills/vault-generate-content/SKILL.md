---
name: vault-generate-content
description: Generate or rewrite IA on-premise vault content with source-first drafting, Obsidian wikilinks, lexicon integration, and nuanced performance claims. Use when creating or substantially editing chapter articles, lexicon entries, or sourced technical notes in this vault.
paths:
  - "**/*.md"
  - "**/*.mdx"
---

# Vault Generate Content

## Quick Start

Before drafting, read `references/editorial-policy.md` and inspect nearby content in the target directory.

For significant generation or rewrite tasks, open a PR when delivery is requested. Do not invoke `vault-log-run` unless the user asks for a durable run log or no PR will be created.

Ask a focused clarification if the user has not specified:
- target content type: chapter article or lexicon entry
- target path or section
- desired depth and audience
- whether new sources may be fetched

Respect explicit user overrides. If the user asks not to use this skill or the project workflow, do not apply it; keep only factuality, source, and safety constraints.

## Decide Content Type

**Chapter article**: Files under directories such as `01-fondations/`, `02-materiel/`, or future numbered chapters.
- Use a flexible structure suited to the topic.
- Do not force the lexicon template.
- Include practical explanations, trade-offs, diagrams, formulas, and architect advice only when useful.
- End with sources when factual claims require citations.

**Lexicon entry**: Files under `00-lexique/`.
- Follow `_templates/_Terme Lexique.md`.
- Keep the entry concise and definitional.
- Link back to `[[00-lexique/ai-glossary|Glossaire IA]]`.
- Put deep explanations in chapter articles, not in the lexicon entry.

## Chapter Workflow

1. Read nearby chapter files and existing linked lexicon entries.
2. Search `00-lexique/` for important terms before creating new ones.
3. Draft with Obsidian wikilinks for important existing concepts.
4. For performance, benchmark, memory, throughput, quality, or percentage claims:
   - cite a fetched, relevant source, or
   - state the claim as an uncertain order of magnitude, or
   - omit the number.
5. Add footnotes inline near the claims they support.
6. Track lexicon side effects outside the public article:

```markdown
## Lexicon follow-up

### Existing entries linked
- [[00-lexique/example]] - pourquoi le lien est utile

### New entries to create
- `00-lexique/new-term.md` - definition attendue

### Existing entries to verify/update
- [[00-lexique/existing-term]] - point de coherence a verifier
```

Do not leave this working section in a published chapter article. Put it in the active plan (`.cursor/plans/`) and, for durable follow-up, update `.agents/vault-maintenance/lexicon-backlog.md`.

If any wikilink targets a page that does not yet exist (planned but not yet published), add its slug to `.agents/vault-maintenance/link-audit-allowlist.md` → section `## Slugs`. This prevents `npm run audit:links` from raising a false error on an intentional forward link.

When the article introduces an important missing term, either create a minimal lexicon entry if the user asked for lexicon execution, or add a precise backlog item. Do not silently drop the lexicon follow-up.

## Lexicon Entry Workflow

1. Start from `_templates/_Terme Lexique.md`.
2. Fill frontmatter: `title`, `description`, `aliases`, `tags`, and `niveau`.
3. Use these sections exactly:
   - `## Definition courte`
   - `## Definition detaillee`
   - `## Pourquoi c'est important en IA on-premise`
   - `## Pieges frequents (optionnel)`
   - `## Voir aussi`
4. Add chapter links in `Voir aussi` when relevant.
5. Avoid unsourced performance numbers. If a numeric claim is necessary, cite it.

## Frontmatter on save

For French pages (outside `en/`), after any substantive content change:

- Set `last_modified: YYYY-MM-DD` to today's date.
- Add the field if missing (see `docs/frontmatter-schema.md`).

Do not update `en/` mirrors or their `last_modified` unless the user explicitly requested translation.

## Output Requirements

When finishing generation, report:
- changed or proposed files
- source status: fetched sources, reused sources, or missing sources
- lexicon checklist: create, link, verify/update
- remaining verification needed
- PR URL when a PR was opened

## Public Content Boundary

Never mix agent maintenance notes with reader-facing content. In chapter articles:

- Do not publish sections named `Lexique - actions`, `Nouvelles fiches a creer`, or `Fiches a verifier`.
- Link existing lexicon entries directly in the prose where useful for readers.
- Move agent-only follow-up to the active plan (`.cursor/plans/`) and `.agents/vault-maintenance/lexicon-backlog.md`.
- If the backlog does not exist, create it before finishing the task.

## Delivery

After content is written, validated, and (when requested) pushed:

1. **Branch** — create `feat/vault-<kebab-title>` before any file change (or reuse the active plan branch if one exists).
2. **Stage** — only the files created or modified by this task.
3. **Commit** — `feat(content): <short imperative description>`.
4. **Push + PR** — read `.cursor/rules/git-workflow.mdc` for the PR body template and branch naming rules. The PR description is the default audit trail (files changed, sources, lexicon follow-up, validation).
5. **Report** — paste the PR URL in chat.

Exception: if the user says "commit to main" or "push directly", skip branch and PR.

