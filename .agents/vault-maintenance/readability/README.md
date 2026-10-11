# Readability scoring

Agent-only folder. Readability scores of the FR pages, for two reader profiles, so the editorial work can target the pages that lose their readers. **Scores never go into public pages** (agent-only notes rule); they live here and in PR bodies.

## How it works

Each FR page gets a score **/100 for each profile**, in one pass:

| Profile | Who |
| :-- | :-- |
| **A** | « dirigeant de PME non technique » — decides on budget and risk, no technical background |
| **B** | « développeur qui découvre l'IA locale » — knows code, Linux, APIs; new to local models |

Pages are judged for **direct arrival**: the reader comes from a search engine, so the page must stand alone with its own text and its own links.

| Part | Points | Tool | Output |
| :-- | --: | :-- | :-- |
| Deterministic | 40 | `npm run audit:readability` (`scripts/audit-readability.mjs`) | `deterministic.json` |
| Judged | 60 | an agent following `rubric.md` (5 criteria × 1–5 per profile, × 2.4) | `judged.json` |

`final = deterministic + judged`. **Alert threshold: 60/100** on the page's primary profile (lexicon entries: 50 on both profiles). Page types and primary profiles are in `rubric.md`.

### Deterministic part (/40)

Same measurements for both profiles, different weights. The formula is documented in the header of `scripts/audit-readability.mjs` and in `docs/quality-checks.md`.

| Sub-score | Measures | A | B |
| :-- | :-- | --: | --: |
| U | technical terms (lexicon titles and aliases, acronyms) not explained or linked at first use — the main malus | 16 | 12 |
| S | mean sentence length, share of sentences over 30 words | 8 | 6 |
| P | paragraphs over 120 words | 4 | 6 |
| I | introduction before the first H2 (lexicon: the short definition) | 6 | 6 |
| T | tables, formulas and diagrams introduced by a sentence | 3 | 5 |
| L | distinct lexicon entries linked per 1 000 words | 3 | 5 |

For profile B, common developer terms (API, GPU, JSON, Docker…) do not count as unexplained. With the script alone, **< 24/40** is an early warning.

## Files

| File | Written by | Content |
| :-- | :-- | :-- |
| `README.md` | humans | this page |
| `rubric.md` | humans | criteria and anchors, page types, thresholds, scoring prompt, `judged.json` schema |
| `deterministic.json` | `npm run audit:readability` | per page: metrics, unexplained terms with context, sub-scores, deterministic score A / B |
| `judged.json` | scoring agent | per page: criterion scores with justifications, final scores, alert, 3 suggestions in French |
| `calibration-YYYY-MM-DD.md` | scoring agent | full scoring of a sample, to compare with the user's judgement before scaling up |
| `report-YYYY-MM-DD.md` | scoring agent | (to come) vault-wide ranking: alerts first, then watch, with the main suggestion per page |
| `backlog.md` | scoring agent, editors | (to come) improvement backlog: one line per page in alert, the fix to apply, status |

## Workflow

1. **Script.** `npm run audit:readability` — whole vault, no network, a few seconds. Restrict with `--paths=a.md,b.md`. Writes `deterministic.json` and prints the worst pages per profile.
2. **Judged pass.** An agent scores, with `rubric.md`, only the pages whose `last_modified` changed since their last scoring (or that were never scored). One read per page, both profiles. Cheap model acceptable once calibration holds; use a strong model for the first full pass. At most three agents in parallel, disjoint pages.
3. **Report.** Rank pages by final score on their primary profile; list alerts (< 60, lexicon < 50) and watches (secondary profile < 45) with the top suggestion.
4. **Improvement backlog.** Pages in alert go to `backlog.md`. Fixes go through the normal content workflow (`vault-generate-content` for rewrites, a focused PR for links and glosses), with `last_modified` updated and the EN mirror synced. The next run re-scores them automatically because their `last_modified` changed.

EN mirrors are not scored: they follow their FR page.

## Status

- 2026-10-11: phase 1–2 — script, rubric, calibration on 6 pages (`calibration-2026-10-11.md`). Waiting for the user's comparison before scoring the whole vault.
