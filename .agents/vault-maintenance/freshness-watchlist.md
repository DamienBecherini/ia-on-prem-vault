# Freshness watchlist (time-sensitive claims)

Agent maintenance file — not reader-facing content.

This file is the **claim-level registry** behind `vault-refresh-outdated-content`. Each row is one statement in a published FR page that can become false with time: a price, a version, a product's availability, a benchmark figure, a spec, a market statistic, or a legal/regulatory date.

A refresh run **diffs this table against the web** instead of re-reading every page. New time-sensitive claims found while generating or verifying content are added here. A claim is removed only when the sentence is deleted from the page.

---

## Volatility classes

Until pages carry a `freshness` frontmatter field, the class is inferred from the folder. The class sets the review cadence; a page is **due** when `last_verified` + cadence < today.

| Class | Cadence | Default folders / pages | Typical claims |
| :-- | :-- | :-- | :-- |
| `volatile` | 90 days | `04-blueprints/tco-comparison.md`, `03-stack-logicielle/choose-your-model.md`, `03-stack-logicielle/inference-engines-vllm-ollama.md`, `02-materiel/*`, `04-blueprints/scenario-*.md`, `05-*/solutions/*.md` | prices, product availability, latest model names, version numbers, benchmark tables |
| `evolving` | 180 days | `03-stack-logicielle/*` (others), `06-mise-en-oeuvre/*`, `05-*` (others), `00-lexique/*` tool entries (vllm, ollama, sglang, exo, ray, litellm…) | CLI flags, feature support matrices, framework recommendations, security guidance, regulation milestones |
| `stable` | 365 days | `01-fondations/*`, `00-lexique/*` concept entries | physics, formulas, definitions, algorithm papers |

---

## Claim types

| Type | Meaning | What to re-check |
| :-- | :-- | :-- |
| `price` | a currency amount or a TCO figure | vendor price page, date, currency, region |
| `version` | a software version or "latest" feature claim | release notes / changelog |
| `availability` | a product is announced / shipping / discontinued | vendor page, press release |
| `spec` | a hardware or protocol figure (GB, GB/s, TFLOPS, lanes, W) | datasheet |
| `benchmark` | a measured performance number (tok/s, TTFT, %) | the cited report; hardware, model, quant, runtime, date |
| `market-stat` | adoption / downloads / market share | primary source only; else qualify or remove |
| `regulation` | a legal date or obligation (AI Act, RGPD, NIS2…) | official text / regulator page |
| `recommendation` | "use X rather than Y" that depends on the ecosystem state | current docs of X and Y |

---

## Status values

- `current` — re-checked, still accurate.
- `drifted` — still true in substance but numbers/versions moved; minor edit needed.
- `stale` — no longer accurate; correction required.
- `unverifiable` — source gone and no replacement found; qualify or remove the claim.
- `pending` — never checked since it was added.

---

## Watchlist

Columns: **Page** (FR path) · **Claim** (short quote, ≤ 120 chars) · **Type** · **Value in page** (the number/version/name as written) · **Source** (footnote id or URL) · **Source date** · **Checked** (last check date) · **Status** · **Note** (what changed, proposed value, new source).

The table is split per chapter under `watchlist/` because the 2026-10-09 run seeded 585 rows (598 after the Critical PR of the same day, 641 after the first Major PR, 708 after the second Major PR, 739 after the Minor PR of 2026-10-10):

| File | Rows (2026-10-10) |
| :-- | --: |
| `watchlist/00-lexique.md` | 78 |
| `watchlist/01-fondations.md` | 37 |
| `watchlist/02-materiel.md` | 96 |
| `watchlist/03-stack-logicielle.md` | 106 |
| `watchlist/04-blueprints.md` | 117 |
| `watchlist/05-agents-et-assistants-on-prem.md` | 174 |
| `watchlist/06-mise-en-oeuvre.md` | 131 |

Rows normalised on 2026-10-09 (PR `fix/refresh-2026-10-critical`): every row has exactly 9 cells, a backticked **Page**, and a valid **Status**; the claims corrected by that PR are marked `current` with a `corrigé PR critical 2026-10-09 : ancien → nouveau` note (598 rows after 13 additions). Rule: a literal `|` inside a cell is always escaped as `\|`; when checking with `node -e "…"`, write the protecting regex as `/\\\\\|/g` under bash (double-quote processing) but `/\\\|/g` under PowerShell, otherwise every `\|` is counted as a separator and the escaped rows are reported as malformed.

---

## Maintenance rules

- One row per claim, not per page. A page with a pricing table gets one row per price that matters to the reader's decision, not per cell.
- Quote the claim as written in the page so `grep` finds it. If the wording changes, update the row.
- `Checked` and `Status` are set only after an actual web check (fetch or search), never by inference.
- When a claim is corrected in the page, set `Status: current`, update **Value in page**, **Source** and **Source date**, and bump the page's `last_modified`.
- Rows for deleted sentences are removed, not kept as history. The git log is the history.
- Keep this table under ~300 rows. If it grows past that, split per chapter under `watchlist/`.
