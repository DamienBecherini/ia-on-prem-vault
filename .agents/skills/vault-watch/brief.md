# Watch brief (one page)

Read this instead of the whole skill when you process a `veille` issue or when you are the verification or apply agent. The full method is in `SKILL.md`; this page is the contract.

## Inputs, and nothing else

| Read | How |
| :-- | :-- |
| The issue | `gh issue view <N>` (kept items only; dropped items are in a folded section) |
| Cached notes | `gh run download <run-id> -n weekly-watch -D <tmp>` → `watch.json`, items with `triage: "keep"` carry `notes` (release notes or advisory text). The run URL is at the bottom of the issue |
| Claims due | `npm run audit:freshness` → section "Claims due for re-check" only |
| Vault pages | `grep` on FR pages for the tool, model or flag named by the item; open only the matching section |

Do **not** read previous watch or refresh reports, the whole watchlist, or `en/` pages. `watch-seen.md` and the version floors are already applied by the script.

## What the script already decided

- Dropped: pre-releases, patch releases (unless a security fix), chatty minor releases, routine builds, low advisories, advisories fixed at or below `version-floors.json`, quant repacks, third-party fine-tunes, URLs in `watch-seen.md`.
- **Core** items need a primary-source check. **Leads** (discovery, tier C signals) are skimmed by title: keep one only if it may cross the addition threshold.
- `urgent` = High / Critical advisory not covered by a vault floor (or on a tool without a floor). Handle it first.

## Per kept item

1. Does it change a sentence of the vault? If not: one line in "Dropped", stop.
2. Primary source (tier A, or two independent tier B): date + exact fact + tier. Use `notes` first; fetch only what `notes` lacks. Tier C is a lead, never a citation.
3. Output: page path, current sentence (verbatim), proposed French sentence (dated wording, "au T4 2026"), source, severity (Critical / Major / Minor).

Addition threshold: tier A or two tier B sources **and** a change to sizing, tool choice or security for an on-prem SME. Paragraph < lexicon entry < new page (opportunity note only, never written without the user's go-ahead).

## Report

`.agents/vault-maintenance/reports/watch-<DATE>.md`: events table, corrections, watchlist rows, additions, "Seen, not proposed", dropped (one line each). Comment on the issue with the link and counts by severity. Stop there until the user says go.

## Apply (one Sonnet agent, only after go-ahead)

Branch `chore/watch-<DATE>` from `main`. Accepted FR edits with `last_modified` = today → EN mirrors hunk by hunk → watchlist rows (Value, Source, Source date, Checked, Status, **Recheck by**) → `version-floors.json` if a floor in the security callout moved → `node scripts/backfill-verified.mjs --write --paths=<fr.md,en/fr.md>` → `npm test` → PR with the repo template, no AI attribution.

## Budget

| Role | Model | Count |
| :-- | :-- | :-- |
| Session (triage on cached notes, report) | the session model | 1 |
| Verification | Opus | 1 if core ≤ 30, else up to 3 split by domain |
| Apply + translate + watchlist | Sonnet | 1 |

Agents never spawn agents. Paste paths and item ids into agent prompts, not page contents.
