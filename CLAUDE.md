# CLAUDE.md — ia-on-prem-vault

Obsidian vault (content only) of *Zero to Hero : IA on-premise*, published as a static site by [`starlight-obsidian-engine`](../starlight-obsidian-engine). French source pages at the root, English mirrors under `en/`. Repository docs, code, skills and rules are in English.

## Read first

| File | What it governs |
| :-- | :-- |
| `.agents/rules/git-workflow.md` | branches from `main`, one PR at a time (never stacked), squash merge, PR template, no AI attribution |
| `.agents/rules/language-policy.md` | English for tooling, French-first for notes, `en/` only on translation tasks |
| `.agents/rules/editorial-basics.md` | sources, wikilinks, footnotes, lexicon structure |
| `docs/frontmatter-schema.md` | `last_modified`, `last_verified`, `verified_by`, `verified_hitl*`, `prices_valid_as_of`, `freshness`; June 2026 baseline dates |
| `docs/quality-checks.md` | every audit script and CI workflow |

`.cursor/rules/*.mdc` only point to `.agents/rules/`; edit the canonical files.

## Skills

Canonical skills live in `.agents/skills/<name>/SKILL.md`; `.claude/skills/<name>/SKILL.md` are entry points that point to them.

| Skill | Use it for |
| :-- | :-- |
| `vault-watch` | biweekly incremental refresh from the `veille` GitHub issue (one fresh session per issue, `brief.md` first): corrections, due claims, additions |
| `vault-refresh-outdated-content` | full top-down refresh run (quarterly, or when many pages are due) |
| `vault-verify-content` | factual and source audit of a page |
| `vault-generate-content` | new or substantially rewritten FR content |
| `vault-translate-content` | EN mirrors of changed FR pages, hunk by hunk |
| `vault-maintenance-report` | read-only health report |
| `vault-log-run` | durable run log, only when no PR is produced or on request |

## Commands

```bash
npm test                          # CI gate: frontmatter, mermaid, agent-leaks, i18n strict
npm run audit:freshness:due       # pages due for review + watchlist claims past "Recheck by"
npm run audit:sources             # inventory + HTTP probe of every cited URL (network)
GITHUB_TOKEN=$(gh auth token) npm run watch:feeds   # what changed in the last 8 days
node scripts/backfill-verified.mjs --write --paths=<fr.md,en/fr.md>   # stamp audited pages only
```

Run Node one-liners from a `.js` file when they contain regex backslashes; shell quoting eats them.

## Hard rules

- `main` is protected by a GitHub ruleset: PR required, checks `Vault quality checks` and `Internal link audit (engine)` required, no bypass. Never force-push; history rewrites need the user.
- Never invent a source. Numeric claims need a tier A/B source with date (`.agents/vault-maintenance/source-tiers.md`); a video or forum is a lead, never a citation.
- Every substantive FR edit: `last_modified` = today, and the EN mirror synced in the same PR (CI runs `audit:i18n:strict`).
- `last_verified` / `verified_by` only on pages actually audited; `verified_hitl*` only after human sign-off (the PR merge). Never stamp the whole vault.
- Agent-only notes never go into public pages: use `.agents/plans/`, `.agents/vault-maintenance/` (lexicon backlog, watchlist, reports) or the PR body.
- Time-sensitive claims are tracked in `.agents/vault-maintenance/watchlist/` with a **Recheck by** date when they have a known deadline.

## Sub-agents

Pick the model per task: cheap models for mechanical work (translation of hunks, watchlist updates, URL swaps), a strong model for applying audit findings and verifying sources, the strongest only for hard judgement calls. At most three agents in parallel, and agents must not spawn their own sub-agents. Give each agent disjoint files.

## Layout

```
00-lexique/ … 06-mise-en-oeuvre/   FR content (chapters, lexicon)
en/                                 EN mirrors (same paths)
.agents/rules/  .agents/skills/     canonical rules and skills
.agents/vault-maintenance/          watchlist, source tiers, feeds, reports, lexicon backlog
.agents/plans/                      working plans (gitignored except README)
scripts/                            audits, watch, backfill (plain Node, no deps)
docs/                               repo docs (not published)
```
