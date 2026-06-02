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
- Consider whether `00-lexique/glossaire-ia.md` needs a hub update for major terms.

## Language

Vault note content may be in any language defined by `site.config.json` locales and the note's folder (for example French at the root, English under `en/`). Match the target path; do not default to English for fiches unless the note lives in an English locale folder.

Repository tooling, skills, and agent plans remain in English.

## Links And Style

Use Obsidian wikilinks for internal vault references:

- Chapter: `[[01-fondations/kv-cache-et-contexte]]`
- Lexicon: `[[00-lexique/kv-cache]]`
- Labelled link: `[[00-lexique/glossaire-ia|Glossaire IA]]`

Use footnotes for external sources. Place the footnote marker near the claim it supports and keep the source list at the end of the article.

