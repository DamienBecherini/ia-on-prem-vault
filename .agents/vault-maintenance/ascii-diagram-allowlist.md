# ASCII diagram allowlist

Agent maintenance file — not reader-facing content.

Lists vault slugs where ASCII box-drawing or tree characters are intentional (log excerpts, trace samples, legacy mini-diagrams). `npm run audit:ascii` suppresses findings for these paths. `npm run audit:ascii:strict` still reports them but does not fail unless the slug is removed from this list.

**Lifecycle:** add a slug when ASCII is intentionally kept → remove the slug after converting the block to Mermaid.

---

## Slugs

06-mise-en-oeuvre/local-inference-security.md
06-mise-en-oeuvre/monitoring-inference-stack.md
en/06-mise-en-oeuvre/local-inference-security.md
en/06-mise-en-oeuvre/monitoring-inference-stack.md
