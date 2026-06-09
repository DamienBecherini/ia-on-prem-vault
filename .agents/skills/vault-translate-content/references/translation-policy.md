# Translation Policy — FR to EN mirrors

## Scope

Published vault notes at the repository root (French) mirror to `en/<same-path>.md`.

Excluded from translation scope:

- `README.md` (repository documentation, English only)
- `docs/**`, `.agents/**`, `.cursor/**`, `_private/**`
- Auto-generated `00-lexique/lexicon-index.md` (build-time; EN may fall back until generator supports locale)

## Fidelity over fluency

- Translate meaning faithfully; do not restructure arguments.
- Keep tables, lists, and callout types aligned with the FR source.
- Prefer established EN terms from existing EN chapters in this vault for consistency.

## Frontmatter

| Field | Rule |
| :-- | :-- |
| `title` | Translate to English |
| `description` | Translate to English |
| `sidebar.order` | Copy from FR |
| `last_modified` | Match FR date after translation |
| `last_verified`, `verified_by`, `verified_hitl*` | Copy from FR unless EN was independently verified |

## Wikilinks and code

- Wikilink paths stay identical: `[[00-lexique/kv-cache]]` not `[[00-lexique/kv-cache|KV Cache]]` unless FR used a label pipe.
- Code blocks, CLI commands, env vars: unchanged.
- Footnote references `[^1]` and URL targets: unchanged.

## Callouts

Map common Obsidian callout titles:

| FR | EN |
| :-- | :-- |
| En bref | In brief |
| Pourquoi | Why |
| Attention / Avertissement | Warning |
| Astuce | Tip |
| Note | Note |

## Quality check

After a batch:

```bash
npm run audit:i18n:strict
```

Every translated pair should leave the stale list.
