# Editorial Improvements Plan

**Date:** 2026-06-04  
**Branch:** main  
**Origin:** Multi-persona editorial audit conducted 2026-06-03  
**Scope:** `D:\Webdev\ia-on-prem-vault` — all content sections

---

## Goal

Address 18 editorial critiques identified during a full vault audit from 5 reader personas:
beginner, intermediate learner, expert/practitioner, solutions architect/consultant, journalist.

Two trivial fixes were already applied before this plan was written:
- `#13` — Fixed duplicate 🏢 emoji (scenario-d is now 🏭)
- `#17` — Fixed wikilink label casing in `rag.md`

---

## Critique inventory and phasing

Critiques are grouped into phases by effort/impact ratio.

### Phase A — Quick wins (low effort, high impact) ✦ *Recommended first*

| # | Critique | Target file(s) | Type |
|---|----------|---------------|------|
| 1 | Missing "why on-premise?" motivation text | `00-index.md` | New section (200 words) |
| 3 | "On-premise" term never defined | `00-lexique/on-premise.md` | New lexique entry |
| 11 | No decision tree for blueprint selection | `04-blueprints/` intro or `00-index.md` | New table/callout |
| 13 | ✅ Done — emoji duplicate scenario B/D | — | — |
| 17 | ✅ Done — `rag.md` wikilink casing | — | — |

### Phase B — Content enrichment (medium effort, medium-high impact)

| # | Critique | Target file(s) | Type |
|---|----------|---------------|------|
| 2 | Abrupt transition to "Bande Passante" in beginner path | `01-fondations/memory-bandwidth.md` | Add intro callout |
| 4 | Shallow stack chapters vs deep fondations | `03-stack-logicielle/*.md` | Enrich 3 chapters |
| 5 | Quantification entries redundancy/clarity | `00-lexique/quantification.md`, `quantification-q4.md` | Clarify scope |
| 6 | "OpenHuman" branding opaque for external readers | `02-materiel/*.md`, `03-stack-logicielle/*.md` | ~~Rephrase or add lexique~~ **→ Delegated to new plan** `2026_06_04_08-14_main_agents-et-assistants-on-prem` Phase 0 |
| 14 | No "En bref" executive callout in chapters | All chapter files | Add callout to 11 files |
| 15 | Sovereignty/RGPD angle underdeveloped | `00-index.md` or new chapter | ~~New section or file~~ **→ Superseded** — partially covered by A1 (done); full chapter delegated to new plan `souverainete-et-confidentialite.md` |
| 16 | Old lexique entries still minimal | 6–8 specific files (see below) | Enrich existing entries |

**Files targeted by critique #16 (old minimal entries):**
- `00-lexique/ram.md` — DDR5 bandwidth, offloading link, Scénario A
- `00-lexique/apu.md` — SoC IA distinction, Strix Halo, link to chapter
- `00-lexique/hbm.md` — bandwidth figures, link to memory wall formula
- `00-lexique/npu.md` — LLM inference limits, SoC context
- `00-lexique/moe.md` — VRAM and t/s impact vs dense model
- `00-lexique/offloading.md` — DDR5 formula, Scénario A link, concurrency pitfall
- `00-lexique/context-window.md` — KV Cache link, OOM risk

### Phase C — New content (higher effort, targeted impact)

| # | Critique | Target file(s) | Type |
|---|----------|---------------|------|
| 7 | No operational/how-to content | `06-mise-en-oeuvre/` (new section — renumbered, `05-` reserved for agents section) | New section, 2–4 files |
| 8 | No monitoring/observability content | New chapter or section in blueprints | New content |
| 9 | No security content | New chapter | New content |
| 12 | No TCO comparison between scenarios | New table or `04-blueprints/comparaison.md` | New file |
| 18 | No model selection guide | `03-stack-logicielle/choisir-son-modele.md` | New chapter |

---

## Execution tasks

### Phase A tasks

**A1 — Add "why on-premise?" section to `00-index.md`**
- Insert a new section before the Sommaire titled "🔒 Pourquoi faire tourner l'IA en local ?"
- 3 bullet points: data sovereignty / GDPR compliance, cost vs cloud API at scale, customization and latency
- ~200 words, no technical jargon, accessible to a journalist

**A2 — Create `00-lexique/on-premise.md`**
- Standard lexique template
- Definition: infrastructure hosted on the organization's own hardware, not delegated to a cloud provider
- On-prem importance: sovereignty, compliance, predictable cost
- Pitfalls: operational complexity, upfront investment
- See also: llm, inference, scénarios A–D

**A3 — Add blueprint decision table to `00-index.md` or a new `04-blueprints/README.md`**
- Decision matrix: users × model size × budget → recommended scenario
- Link each cell to the corresponding blueprint
- Keep it scannable (max 10 rows)

### Phase B tasks

**B1 — "En bref" callout in each chapter**
- Add a `> 💡 **En bref :**` callout after the H1/frontmatter of each of the 11 chapter files
- 1–2 non-technical sentences summarizing the chapter's key takeaway

Affected files:
```
01-fondations/journey-of-a-prompt.md
01-fondations/memory-bandwidth.md
01-fondations/unified-memory-vs-ram-vs-vram.md
01-fondations/kv-cache-and-context.md
01-fondations/quantization-4bit-8bit.md
02-materiel/apu-and-unified-memory.md
02-materiel/stations-multi-gpu.md
02-materiel/network-roce-infiniband-thunderbolt.md
03-stack-logicielle/inference-engines-vllm-ollama.md
03-stack-logicielle/clustering-exo-and-ray.md
03-stack-logicielle/rag-and-agents.md
```

**B2 — Harmonize 7 old minimal lexique entries**
- Bring `ram.md`, `apu.md`, `hbm.md`, `npu.md`, `moe.md`, `offloading.md`, `fenetre-de-contexte.md` up to current template depth
- Add bandwidth figures, concrete on-prem relevance, pitfalls where missing
- Add `📚 Pour comprendre en profondeur` section with links to chapters

**B3 — Clarify quantification entry scopes**
- `quantification.md`: keep as the general entry (affine quantization, GGUF/AWQ/GPTQ overview)
- `quantification-q4.md`: clearly scope to Q4_K_M practical detail (usage, pitfalls, Ollama)
- Add a cross-reference note at the top of each: "Pour le détail pratique Q4_K_M → [[quantification-q4]]" and vice versa

**B4 — Clarify "OpenHuman" references** → **DELEGATED**
- Moved to Phase 0 of `2026_06_04_08-14_main_agents-et-assistants-on-prem.plan.md`
- That plan will clean up all "Conseil de l'Architecte pour OpenHuman" headers and inline mentions,
  then create the full `05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman.md`
  fiche that gives proper context. Do not execute B4 here.

**B5 — Add sovereignty/RGPD angle** → **SUPERSEDED**
- Partially done via A1 (three-argument "why on-premise?" block in `00-index.md`).
- Full sovereignty chapter (`souverainete-et-confidentialite.md`) delegated to new plan above.
- Remaining action once new plan is executed: add a link from `00-index.md` to that chapter.

### Phase C tasks

**C1 — Create `06-mise-en-oeuvre/` section** *(renumbered — `05-` reserved for agents section)*
- At minimum: `06-mise-en-oeuvre/demarrer-avec-ollama.md` (install, first model, API test)
- Optionally: `06-mise-en-oeuvre/configurer-vllm-multi-gpu.md`
- Keep procedural, with code blocks for terminal commands

**C2 — Add monitoring section to blueprints C and D**
- Short "📊 Monitoring recommandé" block: nvidia-smi, vLLM /metrics endpoint, Grafana stack pointer
- Links to official documentation rather than duplicating content

**C3 — Add model selection chapter**
- `03-stack-logicielle/choisir-son-modele.md`
- How to read a leaderboard (MMLU, HumanEval, MATH)
- Size vs quality tradeoff for on-prem constraints
- 2026 landscape: Llama 3.x, Qwen 2.5, DeepSeek-R1, Mistral

**C3b — Add model evaluation protocol chapter**
- Recommended path: `06-mise-en-oeuvre/evaluer-un-modele-local.md`
- Explain how to compare local models beyond speed: factuality, hallucinations, coherence,
  instruction following, code-editing reliability, RAG faithfulness, regressions.
- Cover standard benchmarks and their limits: MMLU/MMLU-Pro, GPQA, GSM8K/MATH, HumanEval,
  MBPP, SWE-bench, IFEval, TruthfulQA, HaluEval, HELM, Chatbot Arena/MT-Bench.
- Explain practical evaluation protocol: golden dataset, task-specific KPIs, human blind review,
  LLM-as-a-judge as a helper only, repeated runs with fixed temperature, confidence intervals,
  failure taxonomy, and domain-specific acceptance thresholds.
- Add lexicon entries if needed: `benchmark-llm`, `llm-as-a-judge`, `ragas`, `perplexite`,
  `truthfulqa`.

**C4 — Add TCO comparison**
- `04-blueprints/comparaison-scenarios.md` or a table in `00-index.md`
- Hardware cost, 3-year electricity estimate, required skills per scenario
- Break-even vs cloud API (OpenAI / Azure pricing reference)

**C5 — Create security chapter** *(renumbered — `05-` reserved for agents section)*
- `06-mise-en-oeuvre/securite-inference-locale.md`
- API authentication, network isolation, data encryption at rest
- OWASP LLM Top 10 pointer

---

## Validation steps

After each phase:
1. Run `node scripts/generate-lexicon-index.mjs` to update `lexicon-index.md`
2. Verify all new wikilinks resolve to existing files
3. Check that the beginner path (A1→Inférence→Voyage→Bande passante→Scénario A) is still navigable
4. Confirm no broken internal links in modified files

---

## Deferred (out of scope for this plan)

- **Phase 9** from previous plan: English translations (`en/` locale)
- Full security audit of cluster configurations (requires external expertise)
- Automated link-checking CI (infrastructure work outside vault content)
