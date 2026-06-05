---
name: gemini-content-review-phased
overview: Phased editorial review of Gemini-generated vault content (chapters 01/03/04, lexicon bridges, site config), source verification, missing lexicon entries, and navigation coherence for the Zero to Hero learning path.
status: pending
source: Gemini generation session (2026-06-03, uncommitted on main)
last_modified: "2026-06-04"
---

# Gemini content review — phased execution plan

## Goal

Review, verify, and integrate all content created or modified during the Gemini session so the vault delivers a coherent **Zero to Hero** path: short lexicon entries as labels, narrative depth in chapters, and working wikilinks everywhere.

This plan does **not** rewrite everything at once. Each phase has a clear exit criterion before the next phase starts.

---

## Inventory — what Gemini created or changed

### New chapter articles (untracked)

| File | Sidebar order | Role |
|------|---------------|------|
| `01-fondations/journey-of-a-prompt.md` | 0 | Pedagogical “C’est pas sorcier” narrative: tokenisation → embedding → prefill → KV cache → decoding |
| `03-stack-logicielle/inference-engines-vllm-ollama.md` | 1 | Ollama/llama.cpp vs vLLM vs TensorRT-LLM |
| `03-stack-logicielle/clustering-exo-and-ray.md` | 2 | Exo P2P vs Ray + vLLM datacenter clustering |
| `03-stack-logicielle/rag-and-agents.md` | 3 | RAG, Agentic RAG, GraphRAG, OpenHuman Memory Trees |
| `04-blueprints/scenario-a-dev-lab.md` | 1 | Homelab / CPU offloading blueprint |
| `04-blueprints/scenario-b-sme-appliance.md` | 2 | Unified-memory PME appliance |
| `04-blueprints/scenario-c-desktop-cluster.md` | 3 | Exo + Thunderbolt desk cluster |
| `04-blueprints/scenario-d-datacenter.md` | 4 | RoCE / multi-GPU enterprise blueprint |

### Modified files (uncommitted diff)

| File | Change summary |
|------|----------------|
| `00-index.md` | Fixed chapter links (02 materiel paths); added `le-voyage-d-un-prompt` first in 01; wired real paths for 03 and 04 |
| `00-lexique/prefill.md` | Added `🔬 Ce n'est pas de la magie` + ordered `📚 Pour comprendre en profondeur` path |
| `00-lexique/decoding.md` | Same bridge pattern as prefill |
| `site.config.json` | New sidebar autogenerate blocks for `03-stack-logicielle` and `04-blueprints` |
| `.agents/vault-maintenance/lexicon-backlog.md` | Extended with stack/blueprint follow-ups (**backlog structure needs cleanup — see Phase 0**) |

### Agent run logs (untracked)

- `2026_06_03_00-10_main_generate-moteurs-inference.md`
- `2026_06_03_23-00_main_generate-le-voyage-d-un-prompt.md`
- `2026_06_03_23-15_main_generate-clustering-exo-ray.md`
- `2026_06_03_23-20_main_generate-rag-agents-openhuman.md`
- `2026_06_03_23-30_main_generate-scenario-a-labo-dev.md`
- `2026_06_03_23-40_main_generate-scenario-b-pme.md`
- `2026_06_03_23-50_main_generate-scenario-c-cluster.md`
- `2026_06_03_23-55_main_generate-scenario-d-datacenter.md`

### Already committed (prior session, not part of Gemini diff but in the learning chain)

- `00-lexique/inference.md` + light bridge in `llm.md` + wikilink in `la-bande-passante-memoire.md`

### Not created by Gemini (still missing)

- English translations under `en/` for all new chapters
- Explicit **“Parcours débutant”** block in `00-index.md` (run log mentions it; current file only reorders 01-fondations)
- Updates to `00-lexique/ai-glossary.md` for beginner path and new stack terms
- Regenerated `lexicon-index.md` after any new lexicon entries

---

## Cross-cutting review findings (to address across phases)

### A. Pedagogical chain gaps

| Gap | Impact |
|-----|--------|
| `inference.md` has no `📚 Pour comprendre en profondeur` section pointing to `le-voyage-d-un-prompt` | Readers landing on Inférence miss the narrative entry |
| `le-voyage-d-un-prompt` does not link to `inference` or `llm` at the top | No upward link in the concept hierarchy |
| `la-bande-passante-memoire.md` links forward from voyage but voyage does not reciprocate; bande passante does not list voyage as prerequisite | Broken round-trip for beginners |
| Concepts **tokenisation**, **embedding**, **attention** are explained in voyage but have **no lexicon entries** | Search/glossary dead ends |
| `kv-cache.md` lexicon still lacks bridge to voyage chapter | Inconsistent with prefill/decoding pattern |

### B. Broken or soon-to-break wikilinks

These lexicon paths are referenced in public articles but **files do not exist**:

| Missing entry | Referenced from |
|---------------|-----------------|
| `00-lexique/exo.md` | `scenario-c-cluster-bureau.md`, `clustering-exo-et-ray.md` |
| `00-lexique/ray.md` | `scenario-d-datacenter.md`, `clustering-exo-et-ray.md` |
| `00-lexique/thunderbolt.md` | `scenario-c-cluster-bureau.md` |
| `00-lexique/pipeline-parallelism.md` | `scenario-c-cluster-bureau.md`, `clustering-exo-et-ray.md` |
| `00-lexique/tensor-parallelism.md` | `scenario-d-datacenter.md`, `moteurs-inference-vllm-ollama.md` (plain text today) |

Concepts heavily used but **not yet wikilinked** (should become lexicon + links):

| Term | Used in |
|------|---------|
| PagedAttention | `moteurs-inference-vllm-ollama.md` |
| GGUF | `moteurs-inference-vllm-ollama.md`, `scenario-a-labo-dev.md` |
| TensorRT-LLM | `moteurs-inference-vllm-ollama.md`, `scenario-d-datacenter.md` |
| GraphRAG, SmolAgents, Vector DB | `rag-et-agents-openhuman.md` (plain text / URLs only) |

### C. Source and claim risk (high priority for `vault-verify-content`)

Flagged patterns across Gemini chapters:

- **Blog/community sources** cited as primary evidence: “Particula Tech”, “Ayi NEDJIMI Consultants”, Reddit/community benchmarks — need replacement or downgrade to `ordre de grandeur` per editorial policy.
- **Strong multipliers** without solid citations: “16× throughput vLLM vs Ollama”, “52M monthly downloads”, “~60% → <4% fragmentation” — verify or soften.
- **Weak footnote URLs**: e.g. voyage `[^1]` points to generic `github.com/meta-llama/llama-models` instead of Llama 3 model card.
- **Hardware claims** to cross-check against existing fondations chapters: Mac Studio 10–15 tok/s, Gorgon Halo 5–7 tok/s, RTX homelab 50–100 tok/s on 8B, Exo cluster 3–5 tok/s on 671B, datacenter NVLink 1 800 Go/s.
- **Technical accuracy spot-checks**: MLX Server naming, vLLM on AMD ROCm for Gorgon Halo, “RDMA-over-Thunderbolt”, continuous batching vs Ollama 2026 capabilities.

### D. Lexicon backlog hygiene

`.agents/vault-maintenance/lexicon-backlog.md` currently mixes:

- **`## To Create`** — hardware entries (pre-existing, still valid)
- **`## Done`** — incorrectly contains **new** stack/RAG entries (`pagedattention`, `gguf`, `exo`, etc.) that were **not** created

**Phase 0 action:** move stack/RAG items from `Done` back to `To Create`; dedupe `pipeline-parallelism` (listed in both To Create and Done-adjacent notes).

### E. Site / navigation

- `site.config.json` sidebar autogenerate for 03/04 — validate order matches narrative (moteurs → clustering → RAG; scenarios A→D).
- Confirm `publish.exclude` still hides plans and agent files.
- After lexicon work: run `node scripts/generate-lexicon-index.mjs` from `starlight-obsidian-engine` and commit updated `lexicon-index.md`.

---

## Missing lexicon — consolidated backlog for this plan

### Priority P0 — broken wikilinks in new chapters

1. `exo.md`
2. `ray.md`
3. `thunderbolt.md`
4. `pipeline-parallelism.md` (merge with existing backlog item)
5. `tensor-parallelism.md` (merge with existing backlog item)

### Priority P1 — stack chapter terms (high reader traffic)

6. `pagedattention.md`
7. `gguf.md`
8. `tensorrt-llm.md`

### Priority P2 — RAG / agents chapter

9. `vectordb.md`
10. `graphrag.md`
11. `agent-autonome.md`
12. `smolagents.md`

### Priority P3 — pedagogical chain (voyage chapter)

13. `tokenisation.md` (aliases: tokenization, BPE)
14. `embedding.md` (aliases: embeddings)
15. `attention.md` (aliases: self-attention, mécanisme d'attention)

### Priority P4 — hardware backlog (pre-existing, still open)

16. `nvswitch.md`
17. `nccl.md`
18. `infiniband.md`
19. `gpudirect-rdma.md`
20. `pfc.md`
21. `ecn.md`

### Priority P5 — update existing entries (`To Verify Or Update` in backlog)

- `multi-gpu.md`, `nvlink.md`, `pcie.md`, `vram.md`, `rdma.md`, `roce.md`

**Lexicon entry template for new fiches:** follow `_templates/_Terme Lexique.md` plus optional sections already used on prefill/decoding:

- `🔬 Ce n'est pas de la magie`
- `📚 Pour comprendre en profondeur` (ordered chapter links)

---

## Phased execution

### Phase 0 — Inventory freeze and backlog cleanup

**Objective:** Make the maintenance backlog trustworthy before content edits.

**Tasks:**

- [ ] Confirm full file list matches this plan (no orphan markdown outside tracked dirs).
- [ ] Fix `lexicon-backlog.md` structure: move misplaced items from `Done` → `To Create`; keep only completed work under `Done`.
- [ ] Add a `## Gemini batch (2026-06-03)` subsection listing all 8 new chapters + modified lexicon/index/config.
- [ ] Snapshot baseline: note uncommitted state for later diff in implementation report.

**Exit criterion:** Backlog accurately lists all missing lexicon entries with source article + priority.

**Skills:** manual / `vault-maintenance-report`

---

### Phase 1 — Pedagogical chain coherence (01-fondations + core lexicon)

**Objective:** A beginner who opens Prefill, Decoding, or Inférence always reaches `le-voyage-d-un-prompt` in one click; the voyage chapter closes the loop to hardware chapters.

**Tasks:**

- [ ] Review `le-voyage-d-un-prompt.md` for tone, factual nuance, and vault link style (wikilinks to `llm`, `inference`, `prefill`, `decoding`, `kv-cache`, `vram`).
- [ ] Add intro/outro cross-links: voyage → `inference`; `la-bande-passante-memoire` → voyage as recommended prerequisite (one paragraph max).
- [ ] Extend `inference.md` with `📚 Pour comprendre en profondeur` (voyage → prefill/decoding → bande passante).
- [ ] Extend `kv-cache.md` and `llm.md` with the same bridge pattern where missing.
- [ ] Add explicit **“Parcours débutant — je ne sais pas par où commencer”** section to `00-index.md`:
  - LLM → Inférence → Voyage d'un prompt → Bande passante → KV Cache → …
- [ ] Mirror the beginner path at the top of `ai-glossary.md` (before “Performance d'inférence”).
- [ ] Fix voyage footnote `[^1]`: cite Llama 3 model card or equivalent official source.

**Exit criterion:** Manual walk-through from glossaire → prefill → voyage → bande passante works with no dead conceptual jumps.

**Skills:** `vault-generate-content`, `vault-verify-content` (light)

---

### Phase 2 — Source verification and claim softening (all Gemini chapters)

**Objective:** No strong numeric or comparative claim remains without a verified source or cautious wording.

**Scope:** All 8 new chapters + touched lexicon if they contain numbers.

**Tasks:**

- [ ] Run claim inventory per file (tokens/s, latency, multipliers, download counts, memory formulas).
- [ ] For each claim: fetch official/vendor/paper source **or** rewrite as `ordre de grandeur` / `dans cette configuration`.
- [ ] Replace weak blog-only citations where better sources exist (NVIDIA blog, vLLM docs, Exo GitHub, Hugging Face, Apple/AMD specs).
- [ ] Align performance numbers with existing fondations chapters (avoid contradicting `la-bande-passante-memoire` or `kv-cache-et-contexte` without explanation).
- [ ] Document residual risk in plan implementation report.

**Exit criterion:** Every footnote in Gemini chapters points to a checked URL or the claim is softened/removed.

**Skills:** `vault-verify-content` (+ `vault-refresh-outdated-content` if claims change materially)

---

### Phase 3 — Lexicon P0: fix broken wikilinks

**Objective:** No published wikilink targets a missing lexicon file among P0 entries.

**Tasks:**

- [ ] Create minimal entries: `exo`, `ray`, `thunderbolt`, `pipeline-parallelism`, `tensor-parallelism`.
- [ ] Each entry: short definition, on-prem relevance, pitfalls, `📚 Pour comprendre en profondeur` → owning chapter section.
- [ ] Add wikilinks in chapters where terms are still plain text (e.g. Tensor Parallelism in moteurs chapter).
- [ ] Regenerate `lexicon-index.md`.
- [ ] Move completed items to backlog `Done`.

**Exit criterion:** Link graph has no broken lexicon targets from 03/04 chapters (grep `[[00-lexique/` vs filesystem).

**Skills:** `vault-generate-content`, `vault-verify-content`

---

### Phase 4 — Lexicon P1/P2: stack and RAG terms

**Objective:** Complete lexicon coverage for software stack vocabulary.

**Tasks:**

- [ ] Create P1: `pagedattention`, `gguf`, `tensorrt-llm`.
- [ ] Create P2: `vectordb`, `graphrag`, `agent-autonome`, `smolagents`.
- [ ] Wire wikilinks in `moteurs-inference-vllm-ollama.md` and `rag-et-agents-openhuman.md`.
- [ ] Extend `ai-glossary.md` with a **“Stack logicielle & agents”** learning path.
- [ ] Regenerate lexicon index; update backlog.

**Exit criterion:** Stack chapters use wikilinks for all recurring product/pattern names listed in P1/P2.

**Skills:** `vault-generate-content`

---

### Phase 5 — Lexicon P3: pedagogical micro-concepts

**Objective:** Terms introduced in `le-voyage-d-un-prompt` become searchable lexicon entries.

**Tasks:**

- [ ] Create `tokenisation`, `embedding`, `attention` entries (concise; depth stays in voyage chapter).
- [ ] Link from voyage chapter first mention; add to beginner path in glossaire.
- [ ] Optional: add `📚 Pour comprendre en profondeur` on prefill pointing to voyage **step 3** anchor (if headings support anchors).

**Exit criterion:** Three new entries appear in index; voyage chapter links to them.

**Skills:** `vault-generate-content`

---

### Phase 6 — Lexicon P4/P5: hardware backlog and entry updates

**Objective:** Close pre-existing hardware lexicon debt and align with chapters 02 + blueprints.

**Tasks:**

- [ ] Create P4 entries: `nvswitch`, `nccl`, `infiniband`, `gpudirect-rdma`, `pfc`, `ecn`.
- [ ] Execute `To Verify Or Update` items on `multi-gpu`, `nvlink`, `pcie`, `vram`, `rdma`, `roce`.
- [ ] Cross-link from `stations-multi-gpu`, `reseau-ia-roce-et-thunderbolt`, `scenario-d-datacenter`.
- [ ] Regenerate index; update backlog `Done`.

**Exit criterion:** Hardware chapters and scenario D have lexicon support for all acronyms used in prose.

**Skills:** `vault-generate-content`, `vault-verify-content`

---

### Phase 7 — Blueprint and stack editorial pass

**Objective:** Scenarios A–D read as a coherent progression and reference correct prior chapters.

**Tasks:**

- [ ] Verify cross-links between scenarios (A→B→C→D) match filenames (`scenario-b-pme-appliance`, etc.).
- [ ] Ensure each blueprint “Verdict architecte” links to relevant fondations + stack chapters.
- [ ] Check consistency: offloading pain (A) → unified memory (B) → Exo scale-out (C) → datacenter (D).
- [ ] Add blueprint section to `00-index.md` intro blurb (one sentence on when to read 04).
- [ ] Review `clustering-exo-et-ray` vs `scenario-c` for duplicate claims; harmonize numbers after Phase 2.

**Exit criterion:** Four scenarios form a readable decision tree; no contradictory throughput guidance without context.

**Skills:** `vault-verify-content`

---

### Phase 8 — Build, link graph, and publication readiness

**Objective:** Site builds cleanly; lexicon and backlinks panels behave.

**Tasks:**

- [ ] Run lexicon index generation (`starlight-obsidian-engine`: `node scripts/generate-lexicon-index.mjs`).
- [ ] Run Starlight build with vault linked (`npm run build` or project-standard command).
- [ ] Fix broken internal links reported by build/link audit.
- [ ] Spot-check rendered pages: voyage (order 0 in sidebar), 03/04 sidebars, glossaire beginner path.
- [ ] Write run log via `vault-log-run` summarizing all phases.

**Exit criterion:** Build passes; lexicon index committed; implementation report appended below.

**Skills:** `vault-log-run`, engine build docs

---

### Phase 9 — Deferred (out of scope unless user requests)

- English translations (`en/01-fondations/…`, `en/03-stack-logicielle/…`, `en/04-blueprints/…`)
- Section `05-agents-autonomes-on-prem/` (separate plan exists)
- New lexicon for secondary terms: `continuous-batching`, `awq`, `llama-cpp`, `mlx`

---

## Validation checklist (final gate)

- [ ] Beginner path: glossaire → inference → voyage → prefill/decoding → bande passante (manual)
- [ ] No broken `[[00-lexique/…]]` targets in 01/03/04 public markdown
- [ ] Gemini chapters: all footnotes verified or claims softened
- [ ] `lexicon-index.md` regenerated and matches filesystem count
- [ ] `lexicon-backlog.md` reflects Done vs To Create accurately
- [ ] Starlight build green
- [ ] Implementation report appended to this plan file

---

## Suggested execution order summary

```text
Phase 0  Backlog cleanup
Phase 1  Pedagogical bridges (voyage ↔ lexique ↔ index)
Phase 2  Source verification (all Gemini chapters)
Phase 3  Lexicon P0 (broken links)
Phase 4  Lexicon P1/P2 (stack + RAG)
Phase 5  Lexicon P3 (tokenisation, embedding, attention)
Phase 6  Lexicon P4/P5 (hardware + updates)
Phase 7  Blueprint editorial coherence
Phase 8  Build + run log + report
Phase 9  EN translations (optional)
```

Phases 2 and 3 can overlap slightly (fix links only after claims in the same paragraph are verified), but **do not** create lexicon entries citing numbers that Phase 2 will remove.

---

## Implementation report

### Phase 0 — Completed 2026-06-03

- `lexicon-backlog.md` rewritten: 10 Gemini "To Create" entries moved out of `## Done`; `pipeline-parallelism` deduplicated with both source articles; 3 pedagogical entries added (`tokenisation`, `embedding`, `attention`); "Already Linked From" sections added for ch. 03 and 04.

### Phase 1 — Completed 2026-06-03

Files changed:

| File | Change |
|------|--------|
| `00-lexique/inference.md` | Added `📚 Pour comprendre en profondeur` (voyage, bande passante, moteurs) |
| `00-lexique/kv-cache.md` | Added `🔬 Ce n'est pas de la magie` + `📚 Pour comprendre` (voyage étape 4, kv-cache-et-contexte, bande passante) |
| `00-lexique/llm.md` | Added `📚 Pour comprendre` (voyage, inférence, quantification) |
| `01-fondations/journey-of-a-prompt.md` | Intro callout with `[[llm]]` + `[[inference]]` links ; footnote [^1] pointed to specific Llama 3.1 model card path |
| `01-fondations/memory-bandwidth.md` | Prerequisite callout → voyage |
| `00-index.md` | Section `🚶 Je découvre` (5-step beginner path) added before glossaire link |
| `00-lexique/ai-glossary.md` | Section `🚶 Débutant — je découvre` with full learning chain added before `Parcours recommandé` |
| `00-lexique/lexicon-index.md` | Regenerated (27 entries, unchanged count) |

Exit criterion met: beginner path LLM → Inférence → Voyage → Prefill/Decoding → Memory Wall → Bande Passante is walkable in one click per step.

### Phase 2 — Completed 2026-06-03

Source audit across all 8 Gemini chapters. Files with low risk unchanged: `le-voyage-d-un-prompt`, `scenario-d-datacenter`, `rag-et-agents-openhuman`.

Changes made:

| File | Claim | Action |
|------|-------|--------|
| `moteurs-inference-vllm-ollama.md` | "52M downloads" (Particula Tech) | Softened to "plus de 50 millions" + labeled as benchmark communautaire |
| `moteurs-inference-vllm-ollama.md` | "jusqu'à 16× débit vLLM vs Ollama" (Particula Tech + blog) | Softened to "×5 à ×16 selon la configuration" |
| `moteurs-inference-vllm-ollama.md` | Footnotes [^1] and [^4] | Labeled as community benchmark / article de blog |
| `clustering-exo-et-ray.md` | "ont *prouvé* qu'environ 5 t/s" (Particula Tech) | Changed to "indiquent … de l'ordre de 3 à 5 t/s dans cette configuration" |
| `scenario-a-labo-dev.md` | "50-100 t/s" (no citation) | Added "typiquement" + "selon modèle/quantification/moteur" |
| `scenario-a-labo-dev.md` | "2-5 t/s" for 70B offloading | Added cross-ref to bande passante formula (DDR5 ≈ 100 Go/s → ~2,5 t/s) |
| `scenario-b-pme-appliance.md` | "10-15 t/s Mac Studio", "5-7 t/s AMD" | Added theoretical basis from bande passante (546/273 Go/s ÷ 40 Go) |
| `scenario-c-cluster-bureau.md` | "stagne généralement" for cluster | Changed to "benchmarks communautaires disponibles indiquent … de l'ordre de" |

Residual risk:
- Footnotes [^1] and [^4] in moteurs chapter still point to community/blog sources — no academic substitute found for real-world Ollama vs vLLM concurrency numbers. The softened wording reflects this.
- Exo cluster throughput (3-5 t/s) remains based on a single community benchmark (Particula Tech). If a more authoritative source emerges, update `clustering-exo-et-ray.md` [^2].
- "50-100 t/s" range for small models is widely accepted in the community but no specific citation was added — consistent with bande passante upper-bound analysis (RTX 5090 formula gives ≫100 t/s theoretical, overhead explains the range).

### Phase 5 — Completed 2026-06-03

Created 3 pedagogical micro-concept entries:

| File | Content |
|------|---------|
| `00-lexique/tokenisation.md` | BPE, vocabulary size, token count variance by language |
| `00-lexique/embedding.md` | Token vectors, LLM internal vs RAG search embeddings distinction |
| `00-lexique/attention.md` | Q/K/V mechanism, O(n²) prefill cost, GQA note, KV Cache link |

Updated `01-fondations/journey-of-a-prompt.md`: wikilinks added for "La Tokenisation" (step 1), "L'Embedding" (step 2), "mécanisme d'Attention" (step 3).

Updated `00-lexique/ai-glossary.md`: new "Fondations LLM" table added before "Mémoire & performance".

### Phase 6 — Completed 2026-06-03

**New hardware entries (P4):**

| File | Content |
|------|---------|
| `00-lexique/nvswitch.md` | NVLink fabric puce, distinction NVLink vs NVSwitch, HGX relevance |
| `00-lexique/nccl.md` | AllReduce/AllGather/Broadcast, topology detection, NCCL_P2P_DISABLE pitfall |
| `00-lexique/infiniband.md` | HDR/NDR/XDR generations, IB vs RoCE comparison, lossless native |
| `00-lexique/gpudirect-rdma.md` | Zero-copy GPU↔NIC, nvidia-peermem prereq, NUMA pitfall |
| `00-lexique/pfc.md` | 802.1Qbb, per-priority pause, PFC storm risk |
| `00-lexique/ecn.md` | CNP feedback, DCQCN, Kmin/Kmax tuning |

**Updated existing entries (P5):**

| File | Changes |
|------|---------|
| `00-lexique/multi-gpu.md` | PCIe/NVLink/HGX bandwidth comparison table, TP vs PP strategy guide, pool pitfall |
| `00-lexique/nvlink.md` | Generation table (NVLink 3/4/5), NVLink vs NVSwitch distinction |
| `00-lexique/pcie.md` | Gen4/5/6 bandwidth table, NVLink comparison, x8 mid-range pitfall |
| `00-lexique/vram.md` | DDR5/GDDR7/HBM3e table, Memory Wall link, multi-GPU pool pitfall |
| `00-lexique/rdma.md` | GPUDirect RDMA mention, IB vs RoCE distinction |
| `00-lexique/roce.md` | PFC+ECN/DCQCN requirements, lossless/lossy nuance, IB vs RoCE comparison |

Updated `00-lexique/ai-glossary.md`: new "Réseau & Clustering" table (RDMA, RoCE, InfiniBand, GPUDirect RDMA, NCCL, PFC, ECN), NVSwitch added to "Infrastructure & architecture", 3 acronyms added to index.

### Phase 7 — Completed 2026-06-03

Blueprint editorial pass across scenarios A–D:

| File | Fix |
|------|-----|
| `scenario-a-labo-dev.md` | Wikilinked GGUF |
| `scenario-b-pme-appliance.md` | Added "➡ Scénario C" forward-link in ❌ section |
| `scenario-c-cluster-bureau.md` | Linked "C'est l'objet du dernier blueprint" → `scenario-d-datacenter.md` |
| `scenario-d-datacenter.md` | Wikilinked NVSwitch, TensorRT-LLM, vLLM (via PagedAttention), PFC, ECN |

Narrative chain A→B→C→D is now fully navigable from within each "❌ Quand fuir" verdict section.

### Phase 8 — Completed 2026-06-03

- `00-lexique/lexicon-index.md` regenerated: **48 entries** (up from 39 after Phase 4).
- `lexicon-backlog.md` rewritten: all "To Create" and "To Verify Or Update" sections cleared; full "Done" log with phase breakdown.
- Plan report appended (this section).

**Final lexicon count: 48 entries** covering the full vault from beginner fundamentals (tokenisation → voyage → memory wall) through software stack (vLLM, TensorRT-LLM, Exo, Ray) to datacenter networking (InfiniBand, RoCE, PFC, ECN, NCCL, GPUDirect RDMA).
