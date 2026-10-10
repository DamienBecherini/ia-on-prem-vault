# Refresh report format

Single format for every output of `vault-refresh-outdated-content`. Also usable by `vault-verify-content` and `vault-maintenance-report` so that findings from different runs can be compared and merged.

Reports live in `.agents/vault-maintenance/reports/` and are named `<kind>-<YYYY-MM-DD>.md` (`sources-`, `ecosystem-`, `refresh-`). They are agent files, never published.

---

## Severity scale

| Severity | Meaning | Example |
| :-- | :-- | :-- |
| **Critical** | The sentence is false today, or the cited source is dead with no replacement, or a security/legal statement is wrong | a product listed as "available" that was cancelled; a CVE-fixed version presented as vulnerable; a wrong AI Act date |
| **Major** | The sentence is incomplete or misleading: a major product, release or rule is missing, or a number moved enough to change a reader's decision | a price table off by > 20 %; a comparison that ignores a new engine the page's own criteria would recommend |
| **Minor** | Still correct in substance; version, wording or URL drift | a redirected docs URL; "v0.9" where "v0.11" is current with no behaviour change |

## Confidence

`high` (primary source fetched and read) · `medium` (secondary source, or primary source summarised by search) · `low` (inferred, not fetched). Any `low` finding must say so in its Note and cannot drive an edit.

---

## 1. Ecosystem events (`ecosystem-<date>.md`)

```markdown
# Ecosystem scan — <SINCE> → <RUN_DATE>

## <Domain>

| Date | Event | Source (tier) | Impacted pages (slugs) | Confidence |
| :-- | :-- | :-- | :-- | :-- |
| 2026-07-15 | vLLM 0.12 drops CUDA 11 support | https://… (A) | 06-mise-en-oeuvre/configure-vllm-multi-gpu, 03-stack-logicielle/inference-engines-vllm-ollama | high |

_No material change found_ ← write this line when a domain is quiet.
```

Rules: one row per event; date of the event, not of the article; tier A/B sources only; slugs without `.md`; a page may appear in several rows.

---

## 2. Refresh report (`refresh-<date>.md`)

```markdown
# Refresh report — <RUN_DATE> (since <SINCE>)

## Summary
- Pages targeted / audited / deferred: N / N / N
- Findings: Critical N · Major N · Minor N
- Watchlist rows added / updated: N / N
- Sources: dead N · redirected N · blocked N · tier C N (from `sources-<RUN_DATE>.md`)
- EN drift (`audit:i18n:strict`): N stale
- Recommended action: <one sentence>

## Target list

| Page | Reason(s) | Class | Overdue (days) |
| :-- | :-- | :-- | --: |

Deferred: <pages and why>

## Page findings

### `<path/to/page.md>`

Verdict: **Nothing to change** | **Minor touch-ups** | **Partial rework recommended**

| # | Severity | Claim (as written) | Problem | Proposed replacement | New source (tier, date) | Confidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | Major | « … » | … | « … » | https://… (A, 2026-09) | high |

Structural gaps: <missing product / release / rule the page should mention, with a proposed paragraph, or "none">

Sources: dead → replacement · redirected → new URL · tier C → replacement or qualification

Watchlist: rows added N · updated N

(repeat per page)

## Translation drift (FR → EN)
- `audit:i18n:strict` stale count before the run: N
- EN sync: deferred to `vault-translate-content` | included

## Source hygiene
- Hosts added to `source-tiers.md`: …
- Slugs removed from `link-audit-allowlist.md`: …

## Lexicon follow-up
- Create: …
- Link: …
- Verify/update: …

## Residual risk
- Blocked URLs not verified: …
- Deferred pages: …
- Domains with thin evidence: …
```

Rules:

- Quote the claim exactly as written so it can be found with `grep`.
- The replacement is a ready-to-paste sentence in the page's language (French), with its footnote marker.
- A finding without a tier A/B source is reported with `Confidence: low` and no replacement.
- Keep page blocks independent: a reader should be able to act on one page without reading the others.

---

## 2 bis. Additions (weekly watch report `watch-<date>.md`)

```markdown
## Additions

### Paragraphs in existing pages
| # | Page | Where (section) | Proposed paragraph (FR, with footnote markers) | Sources (tier, date) | Why it matters on-prem |
| :-- | :-- | :-- | :-- | :-- | :-- |

### Lexicon entries to create
- `00-lexique/<slug>.md` — short definition (1–2 sentences, sourced) · pages that would link to it

### New pages (opportunity notes — need the user's go-ahead)
#### <Subject>
- What it is: …
- Why it matters for an on-prem SME (sizing, tool choice, security): …
- Where it fits: chapter / sidebar position, pages that would link to it
- Primary sources: …
- Effort: paragraph-sized / page-sized

### Seen, not proposed
- <item> — reason (below threshold, cloud-only, fine-tune, already covered by …)
```

Threshold: confirmed by a tier A source or two independent tier B sources, **and** changes a sizing, tool-choice or security decision for an on-prem SME.

---

## 3. Chat summary

When reporting in chat, paste only the **Summary** block and the report path, then the Critical findings as a short list. Everything else stays in the file.
