# Editorial Policy For Vault Generation

## Content Types

Chapter articles live outside `00-lexique/`. They explain a subject in depth and may use a flexible structure: introduction, mechanism, formulas, diagrams, use cases, trade-offs, architect advice, and sources.

Lexicon entries live in `00-lexique/`. They are concise definition pages and must follow `_templates/_Terme Lexique.md`.

## Source Policy

Prefer sources in this order:

1. Official documentation, vendor specs, standards, accepted papers, or project docs.
2. Reputable engineering blogs with reproducible context.
3. Community posts only when clearly labeled and not used as sole support for strong claims.

Never invent a source. Do not keep a URL unless it was checked or provided by the user. If a source cannot be verified, say so.

## Performance Claims

Performance includes tokens per second, latency, bandwidth, memory footprint, quality deltas, percentage gains, and hardware comparisons.

Use this rule:

- Strong numeric claim: cite a fetched, relevant, contextualized source.
- Weak or indirect source: use cautious wording such as `ordre de grandeur`, `environ`, `selon`, or `dans cette configuration`.
- No solid source: do not state the number as fact.

Avoid absolute language such as `sans perte`, `imbattable`, `elimine`, or `garanti` unless the source directly supports it.

## Lexicon Integration

During chapter generation:

- Link important existing terms with Obsidian wikilinks.
- Create a checklist of new lexicon entries to add.
- List existing linked entries to verify or update when the new article changes definitions, formulas, or recommendations.
- Consider whether `00-lexique/ai-glossary.md` needs a hub update for major terms.

## Language

French-first for generation and substantial rewrites:

- Draft new chapter articles and lexicon entries in **French** at vault root paths (outside `en/`).
- Do **not** create or update `en/` mirrors during generation unless the user explicitly requests translation.
- When editing an existing file, keep its current language (French at root, English under `en/`).

English translation is a separate task: mirror the validated French source under `en/` with faithful translation, not a second editorial pass.

Repository tooling, skills, and agent plans remain in English.

## last_modified (FR/EN drift tracking)

On every substantive edit to a French page (vault root, outside `en/`):

- Set or update `last_modified: YYYY-MM-DD` in frontmatter to **today's date**.
- Do not bump `last_modified` for typo-only fixes unless the meaning changed.

This field powers `npm run audit:i18n:strict`, which lists EN mirrors that lag behind FR.

When the user requests EN translation of a page, update the EN mirror and set its `last_modified` to match or exceed the FR source date.

## Links And Style

Use Obsidian wikilinks for internal vault references:

- Chapter: `[[01-fondations/kv-cache-and-context]]`
- Lexicon: `[[00-lexique/kv-cache]]`
- Labelled link: `[[00-lexique/ai-glossary|Glossaire IA]]`

Use footnotes for external sources. Place the footnote marker near the claim it supports and keep the source list at the end of the article.

