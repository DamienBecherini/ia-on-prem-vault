---
name: vault-refresh-outdated-content
description: Periodic refresh of the IA on-premise vault against what changed online. Top-down (ecosystem events → impacted pages → targeted claim checks), driven by the freshness watchlist and the deterministic source audit. Use for scheduled refresh runs, "what changed since last verification" questions, or when a page's time-sensitive claims may be stale.
paths:
  - "**/*.md"
  - "**/*.mdx"
---

# Vault Refresh Outdated Content

## Purpose

Keep the vault accurate over time **without re-reading every page on every run**. The run is organised top-down:

1. deterministic scripts first (sources, i18n, due pages);
2. one ecosystem scan per domain to learn what changed since the last refresh;
3. an impact map from events to pages;
4. targeted claim checks on impacted and overdue pages only;
5. a single report, written to a file, that seeds the next run.

Default to human-in-the-loop: **propose edits, apply only when the user asked for execution**. Read-only until then.

This skill is self-contained. `vault-verify-content` and `vault-generate-content` are not required to run it; their source rules are summarised in [Source rules](#source-rules).

## Inputs and working files

| File | Role |
| :-- | :-- |
| `.agents/vault-maintenance/freshness-watchlist.md` | claim-level registry: volatility classes, claim types, the watchlist table |
| `.agents/vault-maintenance/source-tiers.md` | domain → evidence tier (A/B/C) used by `audit:sources` |
| `.agents/vault-maintenance/reports/` | dated outputs of each run (`sources-*.md/json`, `ecosystem-*.md`, `refresh-*.md`) |
| `.agents/references/refresh-report-format.md` | the single report format used by every phase |
| `site.config.json` → `editorial` | `defaultAgent`, HITL name/url for frontmatter stamps |

Set `RUN_DATE=YYYY-MM-DD` (today) and `SINCE=YYYY-MM-DD` (date of the previous refresh, or the most common `last_verified` in FR pages if there was none) before starting.

---

## Phase 0 — Deterministic baseline (scripts, no LLM judgement)

Run from the vault root:

```bash
npm run audit:sources:report        # probes every cited URL; writes reports/sources-latest.md + .json
npm run audit:i18n:strict           # EN drift count to record in the final report
```

Then build the **due list**: for each FR page, infer its volatility class from `freshness-watchlist.md` → "Volatility classes" and compare `last_verified` + cadence to `RUN_DATE`. Pages with no `last_verified` are due.

Copy `reports/sources-latest.md` to `reports/sources-<RUN_DATE>.md` so the run keeps its snapshot.

Outcome of phase 0: a list of dead/redirected/blocked URLs with their citing pages, the tier C and unclassified hosts, the EN stale count, and the due pages. Nothing has been judged yet.

---

## Phase 1 — Ecosystem scan (what changed since `SINCE`)

Goal: a dated changelog of the on-prem AI ecosystem between `SINCE` and `RUN_DATE`, per domain, **before** opening any page. One agent per domain, in parallel:

| Domain | Watch |
| :-- | :-- |
| Hardware & TCO | APUs and unified-memory machines, workstation/datacenter GPUs, interconnects, new accelerators, list prices, end-of-life |
| Inference engines & clustering | vLLM, llama.cpp/Ollama, SGLang, TensorRT-LLM, Exo, Ray: major releases, dropped/added hardware support, CLI changes, default behaviour changes |
| Open-weight models | new families and sizes, licence changes, benchmark leaderboards with disclosed methodology, quantisation formats |
| Agents & assistants | Open WebUI, AnythingLLM, Khoj, Jan, OpenHands, Aider, Cursor CLI, LiteLLM, SearXNG: releases, pricing/licence changes, discontinuations, security advisories |
| Security & regulation | OWASP GenAI publications, CVEs in inference stacks, EU AI Act milestones and guidance, CNIL/ANSSI publications |

Each scan agent:

1. Loads web tools (`ToolSearch "select:WebSearch,WebFetch"`), searches with the extended mode for recent events, and fetches primary sources.
2. Records every event as a row: **date · event · source URL (tier A/B only) · pages likely impacted** (by slug, best effort).
3. Writes its rows to `reports/ecosystem-<RUN_DATE>.md` under a `## <Domain>` heading, using the format in `refresh-report-format.md` → "Ecosystem events".
4. Does **not** open vault pages beyond the FR index files needed to guess impacted slugs. Page audits are phase 3.

An empty domain section ("no material change found") is a valid result and must be stated explicitly.

---

## Phase 2 — Impact map (which pages to open)

Build the **target list** = union of:

- pages named in any phase 1 event;
- pages citing a dead, redirected (to different content) or tier C URL from phase 0;
- due pages from phase 0, limited to classes `volatile` and `evolving` (stable pages are audited only when an event names them);
- pages with `pending` or `stale` rows in the watchlist.

Record the target list and the reason per page in `reports/refresh-<RUN_DATE>.md` → "Target list". If the list exceeds ~25 pages, rank by (events naming the page) > (dead/tier C sources) > (overdue by most days), and tell the user which pages are deferred.

---

## Phase 3 — Targeted page audits (one agent per page or small batch)

For each target page (FR version only):

1. **Inventory time-sensitive claims.** Read the page; list every price, version, availability, spec, benchmark, market statistic, regulation date and ecosystem-dependent recommendation, with its footnote. Add each as a row in the watchlist table if absent (`Status: pending`).
2. **Check each claim** against the phase 1 events, the phase 0 source status, and a fresh fetch of the cited source when the claim is numeric. Set the row's `Checked`, `Status` (`current` / `drifted` / `stale` / `unverifiable`) and `Note`.
3. **Propose edits** for `drifted`, `stale` and `unverifiable` rows: the exact current sentence, the replacement sentence, the new source (URL, title, date, tier), and a severity (Critical / Major / Minor as defined in the report format). Do not rewrite the page; preserve its teaching flow and voice.
4. **Flag structural gaps**: a major new product, release or rule from phase 1 that the page should mention but does not. Propose a short paragraph, not a section rewrite, unless the page is clearly superseded.
5. Write findings to `reports/refresh-<RUN_DATE>.md` → "Page findings", one block per page, format from `refresh-report-format.md`.

### Source rules

- Replace or qualify any numeric claim whose only support is tier C. Prefer vendor docs, project docs, standards, papers, or benchmarks with disclosed hardware, model, quantisation, runtime and date.
- Never invent a source. Keep a URL only if it was fetched in this run or is listed as `ok` in `sources-<RUN_DATE>.md`.
- If sources disagree, state the range and the disagreement; do not pick the convenient value.
- Prefer dated wording (« au T3 2026 ») over bare « en 2026 », and never put a year in `title` or `description`.
- Agent-only notes never go into the page body. They go to the report, the watchlist, or `lexicon-backlog.md`.

---

## Phase 4 — Report and delivery (HITL)

1. Complete `reports/refresh-<RUN_DATE>.md` with the "Summary", "Translation drift", "Source hygiene", "Lexicon follow-up" and "Residual risk" sections of the report format. The report is the deliverable of a read-only run; paste its summary in chat with the file path.
2. Add newly judged hosts to `source-tiers.md`. Remove slugs from `link-audit-allowlist.md` whose pages now exist.
3. **If and only if the user asks to apply**:
   - branch `chore/vault-refresh-<RUN_DATE>`;
   - apply the proposed edits to FR pages only, in the order of severity;
   - for every edited FR page set `last_modified: <RUN_DATE>`; for every audited page (edited or confirmed current) set `last_verified: <RUN_DATE>` and `verified_by: <editorial.defaultAgent>`; never set `verified_hitl` autonomously;
   - update the watchlist rows to `current` with the new values;
   - run `npm test` and `npm run audit:sources:offline`;
   - commit `chore(refresh): <scope>`, push, open a PR using the template in `.cursor/rules/git-workflow.mdc`, with the report path and the `audit:i18n:strict` stale count in the body. EN sync is deferred to `vault-translate-content` unless the user asked for it.
4. Merging the PR is the HITL sign-off. After merge, the human (or a script run on their request) stamps `verified_hitl` / `verified_hitl_url` from `site.config.json` on the pages the PR audited.

---

## Done criteria

- `reports/sources-<RUN_DATE>.md`, `reports/ecosystem-<RUN_DATE>.md`, `reports/refresh-<RUN_DATE>.md` exist and follow the format.
- Every target page has watchlist rows with `Checked = RUN_DATE`.
- Every proposed edit has a current sentence, a replacement, a tier A/B source with date, and a severity.
- Residual risk names what was not checked (blocked URLs, deferred pages, domains with thin search results).
- No page body was modified unless the user asked for execution.
