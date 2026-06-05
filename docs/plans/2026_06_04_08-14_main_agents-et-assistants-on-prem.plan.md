---
name: agents-et-assistants-on-prem
overview: >
  Create the 05-agents-et-assistants-on-prem/ section of the vault, covering two complementary
  tracks: (A) personal AI assistants that learn from your data, and (B) autonomous custodian agents
  that maintain the vault. Shared sovereignty foundations serve both tracks. Includes pre-migration
  cleanup of contextless OpenHuman references across existing chapters.
supersedes: docs/plans/archive/2026_06_02_20-11_main_agents-autonomes-on-prem-mini-livre.plan.md
related: docs/plans/2026_06_04_00-00_main_editorial-improvements.plan.md (B4 delegated here, B5 superseded here)
todos:
  - id: phase-0-openhuman-cleanup
    content: "Phase 0 — Strip OpenHuman branding from existing chapters"
    status: done
  - id: phase-1-structure
    content: "Phase 1 — Create section skeleton and entry pages"
    status: done
  - id: phase-2-foundations
    content: "Phase 2 — Write shared sovereignty and architecture foundations"
    status: done
  - id: gemini-fixes-non-blocking
    content: "Gemini fixes (NVLink, Blueprint A Mac option, plans archive, delegate.mjs) — parallel to main phases"
    status: done
  - id: slug-rename
    content: "PRIORITAIRE — Renommer tous les slugs FR → anglais neutres + réparer wikilinks"
    status: done
  - id: phase-3-track-a
    content: "Phase 3 — Track A: personal assistants index + 5 solution sheets"
    status: done
  - id: phase-4-track-b
    content: "Phase 4 — Track B: custodian agents index + workflow + 6 solution sheets"
    status: done
  - id: phase-5-crosslinks
    content: "Phase 5 — Cross-link new section into vault navigation and lexicon + Obsidian callouts with build-time Starlight rendering"
    status: done
  - id: phase-6-validation
    content: "Phase 6 — Build, link audit, backlog update, report"
    status: done
isProject: true
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

# Agents & Assistants On-Prem — Combined Plan

## Objective

Extend the vault with a new `05-agents-et-assistants-on-prem/` section that answers the question
most readers ask after reading the blueprints:

> *"I have the hardware, I have the engine — now what do I put on top?"*

The section covers two distinct but complementary use cases, unified by shared sovereignty
foundations:

**Track A — Personal Assistants ("the AI that knows you")**
Software that learns from your documents, remembers your context, and acts as a day-to-day
AI companion — evaluated through a strict on-prem sovereignty lens.

**Track B — Custodian Agents ("the AI that acts on your behalf")**
Autonomous agents that run scheduled tasks, maintain a Markdown vault, write code, open PRs,
and wait for human validation — the infrastructure automation layer.

Both tracks share the same prerequisite question: *"Does this tool truly keep my data on my
machine, or does it phone home by default?"*

---

## Context and prior work

- `01-fondations/` through `04-blueprints/` established the hardware and engine foundations.
- `03-stack-logicielle/rag-and-agents.md` introduced RAG and agentic patterns; Phase 0 removed
  contextless OpenHuman branding while keeping the Memory Tree concept.
- The old plan `docs/plans/archive/2026_06_02_20-11_main_agents-autonomes-on-prem-mini-livre.plan.md` planned Track B
  only; it is superseded by this document.
- The editorial improvements plan `2026_06_04_00-00_main_editorial-improvements.plan.md`
  delegated B4 (OpenHuman cleanup) and B5 (sovereignty) to this plan.

---

## Section numbering

```
05-agents-et-assistants-on-prem/    ← this plan
06-mise-en-oeuvre/                  ← editorial improvements plan C1/C5 (practical how-to guides)
```

`05-` is reserved for this section. The `mise-en-oeuvre` practical guides live in `06-`.

---

## Target file tree

```
05-agents-et-assistants-on-prem/
│
├── index.md                              Entry point — two tracks, how to navigate
│
├── /fondations-communes/                 Shared foundations (both tracks)
│   ├── souverainete-et-confidentialite.md  The sovereignty evaluation grid
│   └── architectures-possibles.md          Taxonomy: assistant / custodian / hybrid
│
├── /assistants-personnels/               Track A
│   ├── index.md                          Comparatif, decision table, when to use which
│   └── solutions/
│       ├── openhuman.md                  ← replaces scattered vault refs; full context + caveat
│       ├── jan-ai.md
│       ├── open-webui.md
│       ├── anythingllm.md
│       └── khoj.md
│
└── /agents-custodiens/                   Track B (from old plan)
    ├── index.md
    ├── vision-agent-custodian.md
    ├── workflow-human-in-the-loop.md
    ├── github-branches-pr-notifications.md
    ├── recherche-web-et-sources.md
    ├── recommandation-architecture-cible.md
    └── solutions/
        ├── cursor-cli.md
        ├── aider.md
        ├── openhands.md
        ├── litellm.md
        └── searxng.md
```

---

## Solution sheet template

Both tracks use the same comparable structure per project:

```markdown
## 🔍 Vue d'ensemble rapide
## 💡 Pourquoi ce projet nous intéresse
## ✅ Points forts
## ⚠️ Limites et risques
## 🔒 Souveraineté et confidentialité
   - Données : local / cloud par défaut / configurable
   - Modèle : cloud API / Ollama / configurable
   - Télémétrie : présente / absente / configurable
   - Mode 100% offline : oui / non / partiel
   - Verdict : ✅ souverain natif / ⚠️ configurable / ❌ incompatible on-prem strict
## 🔗 Intégration possible dans ce vault
## 📊 Maturité du projet
## 📚 Sources
```

All feature claims, star counts, and dates must be sourced or flagged as "à vérifier".

---

## Phases

### Phase 0 — OpenHuman pre-migration cleanup

**Goal:** Remove contextless OpenHuman branding from existing chapters before the new section
creates the proper canonical reference. Replace with generic "Conseil de l'Architecte" framing.

**Files to modify:**

| File | Current issue | Fix |
|------|--------------|-----|
| `01-fondations/memory-bandwidth.md` | Inline "projet OpenHuman" | Generic phrasing |
| `01-fondations/kv-cache-and-context.md` | Section header + inline mentions | Strip brand, keep advice |
| `01-fondations/unified-memory-vs-ram-vs-vram.md` | "votre projet d'agent OpenHuman" | Generic phrasing |
| `01-fondations/quantization-4bit-8bit.md` | Section header | Rename to "Conseil de l'Architecte" |
| `02-materiel/apu-and-unified-memory.md` | Section header + inline | Rename + strip brand |
| `02-materiel/stations-multi-gpu.md` | Section header + inline | Rename + strip brand |
| `02-materiel/network-roce-infiniband-thunderbolt.md` | Section header + inline | Rename + strip brand |
| `03-stack-logicielle/inference-engines-vllm-ollama.md` | Section header + inline | Rename + strip brand |
| `03-stack-logicielle/clustering-exo-and-ray.md` | Section header + inline | Rename + strip brand |
| `03-stack-logicielle/rag-and-agents.md` | Section 3 title + full section | Keep Memory Trees concept, reattribute generically; add forward-link note |
| `00-lexique/autonomous-agent.md` | "Clé du projet OpenHuman" | Remove brand, keep meaning |
| `00-lexique/smolagents.md` | "pour les déploiements OpenHuman" | Remove brand, keep meaning |
| `04-blueprints/scenario-b-sme-appliance.md` | "type OpenHuman" | Replace with "agent souverain local" |

**Footnote audit:**
- `kv-cache-et-contexte.md` [^14] points to OpenHuman GitBook for Memory Trees — keep the link
  but label the source as "OpenHuman (GitBook)" and note hybrid architecture in the footnote.

**Steps:**
- [ ] For each file: replace section headers "Le Conseil de l'Architecte pour OpenHuman"
      → "Le Conseil de l'Architecte"
- [ ] Remove or rephrase inline "votre projet OpenHuman", "comme chez OpenHuman",
      "agent OpenHuman", etc.
- [ ] In `rag-et-agents-openhuman.md` Section 3: rename to "L'approche Memory Tree"
      and add a callout: "OpenHuman implémente cette approche mais utilise un backend cloud par
      défaut. Pour une implémentation 100% on-premise de ce pattern, voir
      [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman]]."
      (use a `pending` link note if the chapter doesn't exist yet — add it once Phase 3 is done)
- [ ] Verify no other occurrences via grep before closing.

---

### Phase 1 — Section skeleton and entry pages

**Files to create:**
- `05-agents-et-assistants-on-prem/index.md`
- `05-agents-et-assistants-on-prem/assistants-personnels/index.md`
- `05-agents-et-assistants-on-prem/agents-custodiens/index.md`
- `05-agents-et-assistants-on-prem/fondations-communes/` (empty, placeholder)

**Steps:**
- [ ] Create the folder structure.
- [ ] Write `index.md`: purpose of the section, two-track navigation, link to sovereignty
      foundations, link back to blueprints A–D.
- [ ] Write `assistants-personnels/index.md`: what a personal AI assistant is, decision table
      (data sovereignty × model control × memory persistence → recommended tool), link to solutions.
- [ ] Write `agents-custodiens/index.md`: what a custodian agent is, link to vision and workflow
      pages (created in Phase 4).
- [ ] Update `site.config.json` sidebar if needed to surface the new section.
- [ ] Update `00-index.md` to add `05-agents-et-assistants-on-prem/index.md` to the Sommaire.

---

### Phase 2 — Shared sovereignty foundations

**Files to create:**
- `05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy.md`
- `05-agents-et-assistants-on-prem/fondations-communes/possible-architectures.md`

**`souverainete-et-confidentialite.md` content outline:**
1. The 6-criteria evaluation grid (data location, model routing, memory backend,
   telemetry, offline mode, sovereignty verdict)
2. "Local UI, cloud brain" — the false local pattern to watch for
3. How to verify concretely: inspect network traffic, read the README carefully, check `.env.example`
4. Regulatory context: RGPD, AI Act, sectoral (HDS, secret professionnel)
5. Practical checklist for auditing a new tool

**`architectures-possibles.md` content outline:**
1. Taxonomy: pure assistant / custodian agent / hybrid (knows you + acts for you)
2. Comparison table: use case × architecture × sovereignty × hardware requirement
3. How Track A and Track B relate (assistants can feed agents; agents can update assistants' memory)
4. Link to blueprints A–D for hardware sizing

**Steps:**
- [ ] Write `souverainete-et-confidentialite.md` with sourced claims on RGPD/AI Act.
- [ ] Write `architectures-possibles.md` with comparison table.
- [ ] Add links from both tracks' index pages to these foundations.
- [ ] Once done, add a link from `00-index.md` to `souverainete-et-confidentialite.md`
      (fulfills B5 from editorial improvements plan).

---

### Phase 3 — Track A: Personal AI assistants

**Files to create (5 solution sheets + 1 already planned in Phase 0):**
- `05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman.md`
- `05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai.md`
- `05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui.md`
- `05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm.md`
- `05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj.md`

**Priority order:** openhuman first (resolves vault debt) → open-webui (most deployed) →
anythingllm → jan-ai → khoj.

**`openhuman.md` specifics:**
- Architecture: local memory (SQLite + Markdown vault) + cloud backend by default for model
  routing, OAuth, web search proxying
- What is local: Memory Tree, vault storage, runtime state
- What is cloud by default: account sign-in, model routing, Composio OAuth flows, web search proxy
- How to go sovereign: bring-your-own-model via Ollama; self-host search; use direct Composio key
- Verdict: ⚠️ configurable — sovereign mode requires manual setup, not the default experience
- Source: README.md, `.env.example`, GitBook Memory Trees page

**Steps:**
- [ ] For each project: verify primary sources (README, docs, last release date, star count).
- [ ] Apply the solution sheet template consistently.
- [ ] Flag any unverified claim with "⚠️ à vérifier".
- [ ] Cross-link each sheet to `souverainete-et-confidentialite.md` and to relevant lexicon entries.
- [ ] Update `assistants-personnels/index.md` comparison table with each completed project.
- [ ] Update `rag-et-agents-openhuman.md` forward-link note (from Phase 0 placeholder) with real link.

---

### Phase 4 — Track B: Custodian agents

*Inherited and adapted from `docs/plans/archive/2026_06_02_20-11_main_agents-autonomes-on-prem-mini-livre.plan.md`.*

**Files to create:**
- `05-agents-et-assistants-on-prem/agents-custodiens/vision-agent-custodian.md`
- `05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop.md`
- `05-agents-et-assistants-on-prem/agents-custodiens/github-branches-pr-notifications.md`
- `05-agents-et-assistants-on-prem/agents-custodiens/recherche-web-et-sources.md`
- `05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible.md`
- `05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli.md`
- `05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider.md`
- `05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands.md`
- `05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm.md`
- `05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng.md`

**`vision-agent-custodian.md` content:**
- Definition: an agent that monitors the vault, detects outdated content, proposes sourced
  corrections, works in branches/PRs, leaves validation to humans
- Human-in-the-loop vs human-on-the-loop distinction
- Why Cursor CLI is a good MVP but not the sovereign target (model choice locked, cloud dependency)
- The target architecture trajectory: simple MVP → model-agnostic runner → home-grown custodian

**`workflow-human-in-the-loop.md` content:**
- Full cycle: scheduled trigger → agent run → branch creation → diff/report generation →
  PR or email → human review → merge → publication
- Autonomy levels: report-only / branch / PR / human-review-required / staging / publish

**Solution sheet specifics for Track B:**
- `cursor-cli.md`: honest assessment — powerful MVP, but model routing via Cursor Cloud,
  confidentiality questions when data transits Cursor services
- `aider.md`: model-agnostic, works with Ollama, terminal-first, no telemetry by default
- `openhands.md`: Docker-based, supports local models, heavier setup
- `litellm.md`: model routing proxy — connects any engine (Ollama, vLLM, cloud) behind a
  unified OpenAI-compatible API
- `searxng.md`: self-hosted meta-search, no API key needed, privacy-preserving

**Steps:**
- [ ] Write vision and workflow pages first (they frame the solution evaluation).
- [ ] Write solution sheets using the standard template.
- [ ] Write `recommandation-architecture-cible.md`: MVP path vs sovereign target,
      concrete stack recommendation (Aider + Ollama + SearXNG + systemd timer + GitHub App).
- [ ] Link Cursor CLI sheet to this vault's own `.agents/` folder as a live example.

---

### Phase 5 — Cross-linking

**Files to modify:**

- `00-index.md` — add `05-` section to Sommaire + link to sovereignty chapter (B5 closure)
- `00-lexique/ai-glossary.md` — add new section or entries for: human-in-the-loop, agent custodien
- `03-stack-logicielle/rag-and-agents.md` — finalize Phase 0 forward-link with real URL
- `00-lexique/autonomous-agent.md` — add `📚` link to new custodian agents section
- `00-lexique/smolagents.md` — add link to Track A/B context
- Blueprints A–D — no changes required (they link to stack, not to applications layer)

**Lexicon entries to create or update:**

| Term | Action | Notes |
|------|--------|-------|
| `human-in-the-loop` | Create | Key concept for Track B |
| `litellm` | Create | Model routing proxy, referenced in Track B |
| `memory-tree` | Create (or section in `kv-cache`) | Architectural pattern from rag chapter |
| `agent-custodian` | Create or extend `agent-autonome` | Specific sub-type |

---

### Phase 6 — Validation and report

**Callout convention update before validation:**
- Source Markdown keeps Obsidian-native callouts (`> [!tip] Title`) so the vault remains pleasant
  to edit in Obsidian.
- The Starlight engine converts those callouts during build to Starlight-styled asides.
- Do not reintroduce raw `:::tip[...]` / `:::caution[...]` directives in vault source files unless a
  page explicitly needs Starlight-only syntax.

**Steps:**
- [ ] Run `node scripts/generate-lexicon-index.mjs` after Phase 5 lexicon work.
- [ ] Verify all wikilinks in new files resolve (no `[[broken-link]]`).
- [ ] Run Starlight build via engine; confirm no broken routes.
- [ ] Grep for any remaining raw "OpenHuman" mentions in `0[0-4]-**/*.md` (should return zero
      after Phase 0).
- [ ] Update `lexicon-backlog.md` with any new entries created or deferred.
- [ ] Mark old plan as superseded (already done).
- [ ] Append implementation report to this file.

---

## Success criteria

- `05-agents-et-assistants-on-prem/` section exists with navigable entry pages for both tracks.
- All "Conseil de l'Architecte pour OpenHuman" headers are gone from existing chapters.
- `rag-et-agents-openhuman.md` Section 3 is renamed "L'approche Memory Tree" with a proper link
  to the new openhuman.md solution sheet.
- `openhuman.md` solution sheet honestly documents the hybrid local/cloud architecture.
- Each solution sheet clearly states the sovereignty verdict with evidence.
- The sovereignty chapter (`souverainete-et-confidentialite.md`) is linked from `00-index.md`.
- Starlight build passes.
- No maturity or feature claims are made without a source or explicit "à vérifier" flag.

---

## Deferred (out of scope for this plan)

- LM Studio, Perplexica, Continue.dev solution sheets — lower priority, can be added later.
- `obsidian-vault-intelligence.md`, `llm-wiki.md`, `ai-assisted-docs.md` from old plan —
  deferred pending research.
- `tavily.md` from old plan — deferred; SearXNG covers the sovereign search use case.
- English translations (`en/` locale) — deferred globally.
- Model evaluation protocol chapter — tracked as C3b in
  `docs/plans/2026_06_04_00-00_main_editorial-improvements.plan.md`.

---

## Implementation report

### Changes

- Created and validated the `05-agents-et-assistants-on-prem/` section with two tracks:
  personal assistants and custodian agents.
- Added shared sovereignty foundations, solution sheets, cross-links, and lexicon entries.
- Renamed legacy French slugs to neutral English slugs and repaired wikilinks.
- Replaced Starlight-only source callouts with Obsidian-native callouts, while the engine
  converts them to Starlight asides at build time.
- Added a technical warning on Aider + Ollama: a sovereign local agent needs a strong coder
  model, not just any local 7B/8B model.
- Logged the future model-evaluation chapter in the editorial plan as C3b.

### Validation

- `npm run lexicon:index` from `starlight-obsidian-engine`: 53 lexicon entries generated.
- `npm run audit:links` from `starlight-obsidian-engine`: no unresolved internal links.
- OpenHuman cleanup check: no legacy branding phrases remain in sections 00-04; remaining
  mentions are contextual references to Memory Tree or the canonical OpenHuman solution sheet.
- Callout check: no raw `:::tip` / `:::caution` directives remain in vault Markdown sources.
- `npm run build` from `starlight-obsidian-engine`: build passed, 187 pages generated.

### Notes

- The command `node scripts/generate-lexicon-index.mjs` in the vault plan is obsolete; the
  generator is owned by the engine and should be run through `npm run lexicon:index`.
- English locale pages are still mostly stubs and remain deferred globally.
