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
- Link back to `[[00-lexique/glossaire-ia|Glossaire IA]]`.
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
6. Add a final working section while drafting:

```markdown
## Lexique - actions

### Termes existants a lier
- [[00-lexique/example]] - pourquoi le lien est utile

### Nouvelles fiches a creer
- `00-lexique/new-term.md` - definition attendue

### Fiches a verifier ou mettre a jour
- [[00-lexique/existing-term]] - point de coherence a verifier
```

Remove or keep this section according to the user's publishing preference. If removed from the article, report the checklist in chat.

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

## Output Requirements

When finishing generation, report:
- changed or proposed files
- source status: fetched sources, reused sources, or missing sources
- lexicon checklist: create, link, verify/update
- remaining verification needed

