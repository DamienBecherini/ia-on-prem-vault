# English Translations (en/ locale) — Implementation Plan

**Date:** 2026-06-04 22:00  
**Branch:** main  
**Origin:** Deferred Phase 9 from `gemini-content-review-phased` and `editorial-improvements` plans  
**Scope:** `ia-on-prem-vault/en/**` mirroring published French content at vault root

---

## Goal

Provide full English content under `en/` so the Starlight `en` locale serves translated pages instead of relying on French fallback. Slugs stay identical to the French tree (English-slug convention already enforced).

**Rule:** Never create empty `en/` stubs — they block Starlight fallback. Only add `en/<path>.md` when the English body is complete.

---

## Inventory

| Section | FR files | Priority |
|---------|----------|----------|
| `00-index.md` | 1 | P0 |
| `01-fondations/` | 5 | P0 (beginner path) |
| `02-materiel/` | 3 | P1 |
| `03-stack-logicielle/` | 4 | P1 |
| `04-blueprints/` | 5 | P1 |
| `05-agents-et-assistants-on-prem/` | 22 | P2 |
| `06-mise-en-oeuvre/` | 7 | P2 |
| `00-lexique/` | 53 | P3 (batch; keep wikilinks to same slugs) |

**Total:** ~105 files

---

## Translation conventions

- Frontmatter `title` and `description` in English.
- Body in English; keep technical terms (vLLM, KV Cache, RoCE) where standard.
- Wikilinks unchanged: `[[01-fondations/memory-bandwidth]]` (same slug, locale routing handled by Starlight).
- Footnotes and external URLs unchanged.
- Callouts: keep Obsidian syntax (`> [!tip]`, etc.).
- `lexicon-index.md`: regenerate from FR only; optional `en/00-lexique/lexicon-index.md` in P3 if needed.

---

## Phased execution

### Phase 1 — P0: Entry + Foundations ✅

- [x] `en/00-index.md`
- [x] `en/01-fondations/*` (5)

### Phase 2 — P1: Hardware, stack, blueprints ✅

- [x] `en/02-materiel/*` (3)
- [x] `en/03-stack-logicielle/*` (4)
- [x] `en/04-blueprints/*` (5)

### Phase 3 — P2: Agents + implementation ✅

- [x] `en/05-agents-et-assistants-on-prem/**` (21)
- [x] `en/06-mise-en-oeuvre/**` (7)

### Phase 4 — P3: Lexicon ✅

- [x] `en/00-lexique/*` (57 entries incl. `ai-glossary.md`)
- [ ] Optional: dedicated `en/00-lexique/lexicon-index.md` (still FR fallback via build generator)

---

## Validation (after each phase)

1. `npm run audit:links` — no broken wikilinks
2. `npm run build` — page count increases for `en/` routes
3. Spot-check `/en/00-index/`, `/en/01-fondations/journey-of-a-prompt/`

---

## Implementation report

**Date:** 2026-06-04

### Summary

Full English locale coverage for all published vault content except auto-generated `lexicon-index.md` (still generated in French at build; EN locale falls back or uses FR index until a separate generator pass is added).

### Files created

| Section | Count |
|---------|------:|
| `en/00-index.md` | 1 |
| `en/01-fondations/` | 5 |
| `en/02-materiel/` | 3 |
| `en/03-stack-logicielle/` | 4 |
| `en/04-blueprints/` | 5 |
| `en/05-agents-et-assistants-on-prem/` | 21 |
| `en/06-mise-en-oeuvre/` | 7 |
| `en/00-lexique/` | 57 |
| **Total** | **103** |

### Validation

- `npm run audit:links` — ✅ no unresolved internal links
- `npm run build` — ✅ 211 pages, ~105 under `dist/en/`
- No empty `en/` stubs created

### Optional follow-up

- English `lexicon-index.md` generation (extend `generate-lexicon-index.mjs` for `en/` locale)
- Spot-review long chapters for terminology consistency (vLLM, MoE, Strix Halo)
