# vault-maintenance — Agent Maintenance Files

This folder contains working files for agents maintaining the vault. None of these files are reader-facing content. They are excluded from the Starlight build.

---

## Active files

### `lexicon-backlog.md`

Tracks lexicon side effects produced during chapter article generation.

| Section | Purpose | Who writes |
| :-- | :-- | :-- |
| `## To Create` | New lexicon entries needed | `vault-generate-content` |
| `## To Verify Or Update` | Existing entries needing a check | `vault-generate-content`, `vault-verify-content` |
| `## Already Linked From` | Entries already cross-linked from a chapter | `vault-generate-content` |
| `## Done` | Completed items with date and source | Any skill after completion |

**Archiving rule:** when `## Done` + `## Already Linked From` sections together exceed ~150 lines, move them to `archives/lexicon-done-YYYY-MM.md` and `archives/lexicon-linked-YYYY-MM.md`. Leave the active `## To Create` and `## To Verify Or Update` sections in place. See `vault-maintenance-report` skill for the full archiving workflow.

---

### `link-audit-allowlist.md`

Lists wikilink slugs that intentionally point to pages not yet published. Used by `npm run audit:links` (in the engine repo) to suppress false errors on planned forward links.

| Section | Purpose | Who writes | Who cleans |
| :-- | :-- | :-- | :-- |
| `## Slugs` | One slug per line, no leading slash | `vault-generate-content` (on forward link) | `vault-verify-content` (once page is live) |

**Lifecycle of an entry:**
1. `vault-generate-content` adds a slug when an article links to a planned-but-unpublished page.
2. `vault-verify-content` removes the slug once that page is published and verified.
3. `vault-maintenance-report` flags stale entries during periodic audits.

---

### `freshness-watchlist.md`

Claim-level registry of time-sensitive statements (prices, versions, availability, specs, benchmarks, market stats, regulation dates). Defines the volatility classes (`volatile` 90 d · `evolving` 180 d · `stable` 365 d) that decide when a page is due for review.

| Section | Purpose | Who writes |
| :-- | :-- | :-- |
| `## Volatility classes` | folder → class → cadence mapping | humans, `vault-refresh-outdated-content` |
| `## Watchlist` | one row per claim: page, quote, type, value, source, dates, status | `vault-refresh-outdated-content`, `vault-generate-content`, `vault-verify-content` |

A refresh run diffs this table against the web instead of re-reading every page. The **Recheck by** column gives a claim-level deadline for facts that move faster than their page (promos, launches, release candidates, quotes); `npm run audit:freshness` lists the claims that are due.

---

### `feeds.json`

Sources of the weekly watch (`npm run watch:feeds`, `.github/workflows/watch.yml`): GitHub releases, tags and advisories, Hugging Face publishers, vendor and regulator RSS, and the Vision IA YouTube channel (tier C, leads only). Add a source when a tool or vendor enters the vault, remove it when it leaves. The `vault-watch` skill consumes the weekly `veille` issue.

---

### `source-tiers.md`

Domain → evidence tier (A/B/C) used by `npm run audit:sources` to classify every cited URL. Unclassified hosts are reported by the script; agents add them here after judging them.

---

### `reports/` folder

Dated outputs of maintenance and refresh runs:

- `sources-<date>.md` / `.json` — inventory and HTTP status of every cited URL (`npm run audit:sources:report`, then copied to a dated file)
- `ecosystem-<date>.md` — what changed online since the previous refresh, per domain
- `refresh-<date>.md` — target list, page findings, proposed edits, residual risk

Format: `.agents/references/refresh-report-format.md`. `*-latest.*` files are gitignored working copies; dated snapshots are committed.

---

## `archives/` folder

Created on first archiving run. Contains:

- `lexicon-done-YYYY-MM.md` — completed lexicon tasks moved from `lexicon-backlog.md`
- `lexicon-linked-YYYY-MM.md` — "Already Linked From" history moved from `lexicon-backlog.md`

Archives are read-only after creation. Do not edit them; create a new monthly file instead.

---

## `runs/` folder (non-interactive runners only)

Created by `vault-log-run`. Used when an agent runs without a human watching the chat (scheduled automation, CI, Aider on-prem). Each run produces a dated Markdown log. See `vault-log-run` skill for format and retention rules.

For interactive Cursor sessions, the PR body and git diff are the primary audit trail — `vault-log-run` is opt-in only.
