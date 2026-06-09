---
title: "Frontmatter Schema"
description: "Standard frontmatter fields for all vault notes — editorial metadata, pricing validity, and verification chain."
last_modified: "2026-06-05"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

# Frontmatter Schema — IA On-Premise Vault

This document defines the standard frontmatter fields for all vault notes. Fields marked **required** must be present on all new pages. Fields marked **optional** should be added when the information is available, and are mandatory after a verification run.

---

## Standard Fields (Starlight / Obsidian)

These fields are managed by the publishing pipeline and must appear in every note:

```yaml
title: "Short descriptive title"
description: "One-sentence description for SEO and search previews."
sidebar:
  order: N   # integer; controls sidebar position within the section
```

---

## Editorial Metadata Fields

These fields track content freshness and the editorial verification chain.

```yaml
last_modified: YYYY-MM-DD      # optional — date of last substantive content change (git-tracked)
last_verified: YYYY-MM-DD      # optional — date of last human-approved verification run
verified_by: Sonnet 4.6        # optional — from site.config.json → editorial.defaultAgent
verified_hitl: Damien BECHERINI # optional — from site.config.json → editorial.hitl.name
verified_hitl_url: https://damien.becherini.fr  # optional — from site.config.json → editorial.hitl.url
```

### Single source of truth

HITL name, HITL URL, and default agent slug are defined in **`site.config.json`** under `editorial`, not hardcoded in skills or scripts. See `.agents/references/site-config-editorial.md`.

### Field rules

| Field | Who sets it | When |
| :-- | :-- | :-- |
| `last_modified` | Agent or author | On every substantive content edit |
| `last_verified` | `vault-verify-content` skill | After a verification run completes |
| `verified_by` | `vault-verify-content` skill | Same run — format: `skill-name@version` |
| `verified_hitl` | Agent (`vault-log-run`) or PR/plan approval | After explicit human sign-off on the verification result |

### Behaviour

- Fields are **optional on legacy pages**; they are added progressively as pages go through a verification cycle.
- Fields are **required on all new pages** created after 2026-06-05.
- `last_modified` should match the date of the last git commit that changed the file's content meaningfully (not just frontmatter updates).
- `last_verified` is independent from `last_modified`. A page can be verified without being modified (no content changes needed = content is still accurate).
- `verified_hitl` is set only after a human has reviewed and approved the verification findings. It must not be set by an agent autonomously.

---

## Pricing Validity Field (TCO pages only)

Pages containing pricing tables carry an additional field:

```yaml
prices_valid_as_of: "YYYY-MM"  # month when prices were last cross-checked
```

A visible callout must accompany every pricing table in the article body:

```markdown
> [!warning] Prix et tarifs — validité
> Tarifs capturés en **YYYY-MM**. Les prix des API cloud varient fréquemment.
> Vérifiez les pages tarifaires officielles avant de construire un business case.
```

---

## Full Example (new page)

```yaml
---
title: "🧩 Mon Titre de Page"
description: "Courte description de la page pour les previews et le SEO."
sidebar:
  order: 3
last_modified: 2026-06-05
last_verified: 2026-06-05
verified_by: Sonnet 4.6
verified_hitl: Damien BECHERINI
verified_hitl_url: https://damien.becherini.fr
---
```

---

## Starlight Engine Integration

The `starlight-obsidian-engine` repository reads these fields to render a **Verified Badge** component at the bottom of each page. Implementation tracked separately in that repository.

Fields consumed by the engine:

- `last_verified` → displayed as "Last verified: YYYY-MM-DD"
- `verified_hitl` → displayed as "Reviewed by: Name"
- `verified_by` → displayed in the tooltip / expanded view
- `last_modified` → used to detect stale content (> 90 days without verification)
