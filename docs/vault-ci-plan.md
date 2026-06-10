---
title: "Vault CI Implementation Plan"
description: "Implementation plan for deterministic vault quality checks and GitHub Actions CI."
last_modified: "2026-06-10"
---

# Vault CI — Implementation Plan

**Status:** done (2026-06-10)  
**Branch:** `chore/vault-ci-quality-checks`  
**Living reference:** [quality-checks.md](./quality-checks.md)

---

## Goal

Add automated, agent-free quality checks on `ia-on-prem-vault` so content PRs cannot merge if they break frontmatter, Mermaid syntax, editorial structure, FR/EN parity, or internal links.

---

## Phases

### Phase 1 — Vault scripts (done)

| Deliverable | File |
| :-- | :-- |
| Shared walk/helpers | `scripts/lib/vault-walk.mjs` |
| Frontmatter audit | `scripts/audit-frontmatter.mjs` |
| Mermaid smoke audit | `scripts/audit-mermaid.mjs` |
| Agent leak audit | `scripts/audit-agent-leaks.mjs` |
| ASCII diagram audit | `scripts/audit-ascii-diagrams.mjs` |
| Suite runner | `scripts/run-audits.mjs` |
| i18n exit codes | `scripts/audit-i18n.mjs` |
| Engine delegation | `scripts/delegate.mjs` (`audit-links`) |
| npm scripts | `package.json` (`test`, `audit:*`) |
| ASCII allowlist | `.agents/vault-maintenance/ascii-diagram-allowlist.md` |

### Phase 2 — CI (done)

| Deliverable | File |
| :-- | :-- |
| GitHub Actions workflow | `.github/workflows/ci.yml` |
| Job `vault-audits` | `npm test` |
| Job `link-audit` | engine checkout + `audit:links` |

### Phase 3 — Documentation (done)

| Deliverable | File |
| :-- | :-- |
| Technical reference | `docs/quality-checks.md` |
| README section | `README.md` → Quality checks |
| This plan | `docs/vault-ci-plan.md` |

### Phase 4 — Content fixes (done)

- Added `last_modified` to `00-lexique/lexicon-index.md` and EN mirror.
- Fixed `docs/quality-checks.md` link patterns so `audit:links` stays green.

---

## Deferred (not in scope)

| Item | Reason |
| :-- | :-- |
| Full `astro build` on real vault in vault CI | Heavy (~3–5 min); engine `test:build` already covers pipeline |
| `audit:ascii:strict` in `npm test` | Legacy intentional ASCII on 4 slugs (allowlisted) |
| External URL liveness checks | Flaky; agent/human verification instead |
| Factual verification in CI | Requires `vault-verify-content` skill |

---

## Validation

```bash
npm test              # ✅ 4/4 audits pass
npm run audit:links   # ✅ no unresolved links
npm run audit:ascii   # warn-only on allowlisted legacy ASCII
```

---

## PR checklist

- [ ] Wikilinks resolve in Obsidian
- [ ] No agent-only content left in public articles
- [ ] `last_modified` updated on changed FR pages
- [ ] FR source updated (EN translation deferred unless this PR includes it)
- [ ] If EN sync deferred: `npm run audit:i18n:strict` run and stale files noted in PR body
- [ ] `npm test` passes locally
- [ ] `npm run audit:links` passes (with `ENGINE_PATH` set)
