# Plan: Gemini Critique Integration

**Date:** 2026-06-05  
**Branch:** main  
**Author:** Damien (HITL)  
**Source:** `_private/critique-gemini.md`

---

## Goal

Address the five improvement axes identified in the Gemini critique of the vault, plus the additional metadata schema proposal (last-modified / last-verified / agent / HITL) raised during review. Tasks are ordered by impact and feasibility.

---

## Scope

| # | Axis | Origin | Type |
|---|------|---------|------|
| 1 | Frontmatter metadata schema (dates + agent + HITL) | User proposal | Infrastructure |
| 2 | TCO prices validity marker | Critique C | Content fix |
| 3 | i18n audit script | Critique E | Tooling |
| 4 | Multimodality section (VLM / hardware impact) | Critique A | New content |
| 5 | DRP/PRA paragraphs per scenario | Critique D | Content addition |
| 6 | Code pointers for agents (no inline code) | Critique B | Content addition |

---

## Priority 1 — Frontmatter Metadata Schema

**Rationale:** Foundational for editorial trust. Enables the verification workflow already supported by `vault-verify-content` and `vault-log-run` skills. Should be defined before new content is added so all future pages are born compliant.

### Schema definition

Every vault note gains three optional frontmatter fields:

```yaml
last_modified: YYYY-MM-DD       # set automatically on file save / agent edit
last_verified: YYYY-MM-DD       # set by vault-verify-content skill after a verification run
verified_by: agent-slug@version  # e.g. vault-verify-content@1.0
verified_hitl: Damien            # human who approved the verification
```

Rules:
- `last_modified` is the git-tracked date of the last substantive content change.
- `last_verified` is the date a human-approved verification run confirmed the content is still accurate relative to current state of the art.
- `verified_by` uses the skill filename slug (without `.md`) plus the skill version if available.
- `verified_hitl` is the name of the human validator.
- Fields are **optional** on legacy pages; required on all new pages created after this plan is executed.

### Files to create / modify

- `docs/frontmatter-schema.md` — canonical schema documentation (English)
- `d:\Webdev\ia-on-prem-vault\.agents\skills\vault-verify-content\SKILL.md` — add instruction to write `last_verified` and `verified_by` fields after a run
- `d:\Webdev\ia-on-prem-vault\.agents\skills\vault-log-run\SKILL.md` — add instruction to record `verified_hitl` after HITL approval
- Starlight engine (separate repo): add a `<VerifiedBadge>` component consuming these fields — **out of scope for this plan, tracked separately**

### Execution tasks

1. Create `docs/frontmatter-schema.md` with full schema, field descriptions, and examples.
2. Update `vault-verify-content` SKILL.md: after verification, instruct agent to update `last_verified` and `verified_by` in the target file's frontmatter.
3. Update `vault-log-run` SKILL.md: after HITL sign-off, instruct agent to write `verified_hitl` in the target file's frontmatter.
4. Backfill `last_modified` on existing pages using git log dates (optional, low priority).

### Validation

- `docs/frontmatter-schema.md` exists and is readable.
- A sample page (e.g. `01-fondations/quantization-4bit-8bit.md`) carries all four fields.
- Both skill files reference the schema document.

---

## Priority 2 — TCO Prices Validity Marker

**Rationale:** Most immediately harmful if ignored. A stale price table is misinformation. Quick win with high trust impact.

### Files to modify

- `04-blueprints/tco-comparison.md` (and `/en/` equivalent if exists)

### Execution tasks

1. Add a frontmatter field `prices_valid_as_of: YYYY-MM` at the top of `tco-comparison.md`.
2. Add a visible callout block just above every pricing table:
   ```
   > **Validity:** Prices captured YYYY-MM. Check official pages before budgeting.
   ```
3. Replace hardcoded prices that have an official source with a link to that source's pricing page instead of (or alongside) the figure.
4. Add `last_verified` and `verified_hitl` fields as defined in Priority 1.

### Validation

- Callout block is visible in rendered Starlight output.
- At least one external link to an official pricing page is present per cloud provider cited.

---

## Priority 3 — i18n Audit Script

**Rationale:** Silent FR/EN divergence accumulates exponentially. Catching it early is cheap; catching it late is a rewrite.

### Files to create / modify

- `scripts/audit-i18n.mjs` — Node.js script (no extra dependencies beyond Node 18+)
- `package.json` (vault root, if it exists) — add `"audit:i18n": "node scripts/audit-i18n.mjs"` script entry

### Script behaviour

1. Walk all `*.md` files under the vault root (excluding `_private/`, `build/`, `docs/`, `node_modules/`).
2. For each FR file at `<folder>/<file>.md`, check whether `en/<folder>/<file>.md` exists.
3. If both exist, compare `last_modified` frontmatter dates. Flag if FR is newer than EN by more than 7 days.
4. Output a Markdown-formatted report to stdout with three sections: ✅ In sync, ⚠️ Possibly stale, ❌ Missing EN counterpart.

### Execution tasks

1. Create `scripts/audit-i18n.mjs`.
2. Add npm script entry if `package.json` exists; otherwise document manual invocation in `docs/frontmatter-schema.md`.
3. Add a note in `vault-verify-content` SKILL.md to run `audit:i18n` as part of a full vault audit.

### Validation

- `node scripts/audit-i18n.mjs` runs without error.
- Output correctly identifies at least one missing or stale EN file.

---

## Priority 4 — Multimodality Section (VLM / Hardware Impact)

**Rationale:** Valid gap for 2026 enterprise use cases. Scoped narrowly to hardware impact, not a general VLM tutorial.

### Files to create

- `01-fondations/multimodality-vram-impact.md` (FR)
- `en/01-fondations/multimodality-vram-impact.md` (EN) — created at the same time to maintain parity

### Content outline

1. **What changes with a visual input** — image tokens vs text tokens, prefill cost of an image patch embedding
2. **Visual encoder VRAM footprint** — LLaVA-style clip encoder, Qwen-VL, Pixtral; approximate VRAM overhead per model family
3. **KV Cache impact** — why a 1024×1024 image can consume as many KV slots as a 2 000-token text prompt
4. **Audio pipeline** — Whisper as a preprocessing step (speech → text), not a LLM concern; VRAM is negligible but latency matters
5. **Scenario mapping** — which scenarios (A/B/C/D) are affected and what to add to the hardware budget

### Execution tasks

1. Draft FR page using `vault-generate-content` skill.
2. Verify factual claims using `vault-verify-content` skill.
3. Update `last_verified` / `verified_by` / `verified_hitl` fields.
4. Create EN counterpart.
5. Add wikilinks from `01-fondations/kv-cache.md` and relevant blueprint pages.

### Validation

- Page renders in Starlight without broken links.
- VRAM figures are sourced (link or footnote).
- `verified_hitl` is populated.

---

## Priority 5 — DRP/PRA Paragraphs per Scenario

**Rationale:** Directly useful for Ops profiles evaluating Scenarios B and D. Contained addition, no new files needed.

### Files to modify

- `06-mise-en-oeuvre/monitoring-inference-stack.md` — add a "State backup" section
- `04-blueprints/scenario-b-appliance.md` (if exists) — add a DRP callout
- `04-blueprints/scenario-d-datacenter.md` (if exists) — add a DRP callout
- EN equivalents of the above

### Content per page

Each addition covers:
1. **What state to back up** — Qdrant snapshots, Milvus backup API, SQLite file for Memory Tree, model weights (usually immutable, but cache any fine-tuned adapters)
2. **Backup frequency recommendations** — daily snapshot for vector DBs, continuous replication for SQLite if used in production
3. **Recovery procedure sketch** — restore snapshot → restart inference container → verify health endpoint
4. **RTO / RPO targets** — indicative values for each scenario class

### Execution tasks

1. Write "State Backup and Recovery" section in `monitoring-inference-stack.md`.
2. Add DRP callout blocks in scenario blueprint pages.
3. Update EN equivalents.

### Validation

- Sections are present and internally consistent with scenario hardware assumptions.
- No broken wikilinks introduced.

---

## Priority 6 — Code Pointers for Agents (no inline code)

**Rationale:** The vault is a reference guide, not a tutorial. Inline code ages badly. The right answer is pointers to maintained external resources.

### Files to modify

- `05-agents/smol-agents.md` (or equivalent agent architecture page)
- `05-agents/langraph.md` (or equivalent)
- EN equivalents

### Execution tasks

1. Add a "Getting started (code)" callout section at the bottom of relevant agent pages pointing to:
   - Official SmolAgents documentation and examples repo
   - LiteLLM quickstart for local Ollama routing
   - LangGraph "local agent" tutorial
2. Add a note that a companion starter-kit repository is planned (`ia-on-prem-starter-kit`) — placeholder link, not a live URL.
3. Update EN equivalents.

### Validation

- External links are reachable at time of writing.
- No Python code blocks are embedded in vault pages.

---

## Execution Order Summary

| Step | Task | Effort |
|------|------|--------|
| 1 | Create `docs/frontmatter-schema.md` | Small |
| 2 | Update `vault-verify-content` and `vault-log-run` skills | Small |
| 3 | Apply schema to `tco-comparison.md` + add validity callout | Small |
| 4 | Create `scripts/audit-i18n.mjs` | Medium |
| 5 | Draft `multimodality-vram-impact.md` (FR + EN) | Large |
| 6 | Add DRP sections to `monitoring-inference-stack.md` and blueprints | Medium |
| 7 | Add code pointers to agent pages | Small |
| 8 | Backfill `last_modified` on high-traffic pages (optional) | Variable |

---

## Out of Scope (at plan creation)

- `ia-on-prem-starter-kit` companion repository (separate initiative)
- Full translation of existing pages to EN (ongoing background task)

## Post-plan follow-up (2026-06-05)

- Starlight `<VerifiedBadge>` UI component — **delivered** in `starlight-obsidian-engine`
- `site.config.json` → `editorial` block for HITL/agent defaults — **delivered**
- EN DRP parity, VerifiedBadge i18n, multimodality sources, promql build warning — **delivered** in follow-up session

---

## Implementation Report

**Date:** 2026-06-05  
**Executed by:** Cursor agent  
**HITL:** Damien  
**Status:** Completed — all 8 execution steps done

### Files Created (4)

| File | Description |
| :-- | :-- |
| `docs/frontmatter-schema.md` | Canonical frontmatter schema — fields, rules, full example |
| `01-fondations/multimodality-vram-impact.md` | New FR chapter — visual encoders, KV Cache, Whisper, blueprint map |
| `en/01-fondations/multimodality-vram-impact.md` | EN counterpart — parity maintained at creation |
| `scripts/audit-i18n.mjs` | Node.js i18n audit script — tested successfully (104 files scanned) |

### Files Modified (10)

| File | Change |
| :-- | :-- |
| `.agents/skills/vault-verify-content/SKILL.md` | Added: frontmatter update step (`last_verified`, `verified_by`) after verification run |
| `.agents/skills/vault-log-run/SKILL.md` | Added: `verified_hitl` write step after HITL approval |
| `04-blueprints/tco-comparison.md` | Added: `prices_valid_as_of` + verification metadata + validity callout before pricing table |
| `en/04-blueprints/tco-comparison.md` | Same — EN parity |
| `package.json` | Added: `"audit:i18n": "node scripts/audit-i18n.mjs"` |
| `06-mise-en-oeuvre/monitoring-inference-stack.md` | Added: full DRP section (Qdrant, Milvus, SQLite backup, RTO/RPO table by blueprint) |
| `04-blueprints/scenario-b-sme-appliance.md` | Added: DRP section for Blueprint B (backup table, recovery procedure, RTO < 45 min) |
| `04-blueprints/scenario-d-datacenter.md` | Added: HA/DRP section for Blueprint D (rolling restart, RTO/RPO table, daily backup script) |
| `05-agents-et-assistants-on-prem/fondations-communes/possible-architectures.md` | Added: code pointers section (Track A + B tools, starter-kit placeholder note) |
| `en/05-agents-et-assistants-on-prem/fondations-communes/possible-architectures.md` | Same — EN parity |

### Validation

- `node scripts/audit-i18n.mjs` runs without error — 104 FR files scanned, output well-formed
- All modified files have correct Markdown syntax (no broken wikilinks introduced)
- Frontmatter schema applied to: `tco-comparison.md` (FR + EN), both multimodality pages
- EN counterparts updated in parity with every FR change

### Limitations / Residual Risk

- Multimodality VRAM figures remain order-of-magnitude — footnotes added (LLaVA, Qwen2-VL, Whisper, vLLM) but not benchmark-validated per hardware.
- DRP RTO/RPO values are indicative — validate against actual model reload benchmarks per blueprint.
- The `ia-on-prem-starter-kit` companion repo is referenced as a placeholder — it does not exist yet.
