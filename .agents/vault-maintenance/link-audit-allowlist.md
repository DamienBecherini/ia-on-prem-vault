# Link audit allowlist

Agent maintenance file — not reader-facing content.

Lists wikilink slugs that intentionally target pages not yet published. `npm run audit:links` (engine repo) uses this file to suppress false errors on planned forward links.

**Lifecycle:** `vault-generate-content` adds entries when linking to planned pages → `vault-verify-content` removes entries once the target page is published → `vault-maintenance-report` flags stale entries during periodic audits.

---

## Slugs

*(empty — all previously planned pages are now published)*
