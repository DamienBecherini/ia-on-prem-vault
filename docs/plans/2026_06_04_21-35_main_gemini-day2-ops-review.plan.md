# Gemini Day-2 Ops Review — Implementation Plan

**Date:** 2026-06-04 21:35  
**Branch:** main  
**Origin:** Two rounds of Gemini critique focused on Day-2 Ops, SRE, and MLOps gaps  
**Scope:** `ia-on-prem-vault` (7 items) + `starlight-obsidian-engine` (1 item)

---

## Goal

Address 8 critique points that push the vault from "architecture reference" to "production-grade SRE/MLOps playbook":

- Close operational gaps in vLLM configuration (APC, max-model-len error handling)
- Harden security documentation (error leakage, model supply chain)
- Add agent-grade observability (OpenTelemetry traces)
- Cover the Storage Wall SLA risk in multi-GPU blueprints
- Fix a DevEx bug in the lexicon-index generation script (Obsidian navigation broken)
- Add a git dirty-tree preflight guard to the agent workflow

---

## Critique Inventory

| ID | Source | Point | Target |
|----|--------|-------|--------|
| R1-1 | Round 1 | `lexicon-index.md` emits absolute URLs → breaks Obsidian | `starlight-obsidian-engine/scripts/generate-lexicon-index.mjs` |
| R1-2 | Round 1 | vLLM `max-model-len` HTTP 400 crash + no frontend guidance | `06-mise-en-oeuvre/configure-vllm-multi-gpu.md` |
| R1-3 | Round 1 | System Prompt leak via LiteLLM error propagation | `06-mise-en-oeuvre/local-inference-security.md` |
| R1-4 | Round 1 | Agent starts on dirty git repo → mixes human drafts into commit | `05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop.md` |
| R2-1 | Round 2 | Missing `--enable-prefix-caching` (APC) flag — critical for RAG concurrency | `06-mise-en-oeuvre/configure-vllm-multi-gpu.md` |
| R2-2 | Round 2 | Storage Wall (SSD→VRAM boot time) not quantified in blueprints | `04-blueprints/scenario-c-desktop-cluster.md`, `scenario-d-datacenter.md` |
| R2-3 | Round 2 | Model supply chain: no SHA256 verification guidance | `06-mise-en-oeuvre/local-inference-security.md` |
| R2-4 | Round 2 | Prometheus metrics ≠ traces; OpenTelemetry absent from monitoring chapter | `06-mise-en-oeuvre/monitoring-inference-stack.md` |

---

## Execution Tasks

### Task 1 — R1-1: Fix lexicon-index generator (engine)

**File:** `starlight-obsidian-engine/scripts/generate-lexicon-index.mjs`

Replace absolute URL links `[TERM](/00-lexique/slug/)` with Obsidian wikilinks `[[00-lexique/slug|TERM]]` in the generated `lexicon-index.md`. The engine's remark-wikilinks plugin already converts these to valid HTML at build time.

### Task 2 — R1-2 + R2-1: vLLM operational hardening

**File:** `06-mise-en-oeuvre/configure-vllm-multi-gpu.md`

Two additions:

**R2-1 — Automatic Prefix Caching (APC):**
Add `--enable-prefix-caching` to the production command examples. Explain how vLLM hashes prompt prefix blocks so that shared system prompts or RAG context shared across concurrent users hits the KV Cache once instead of N times → TTFT drops from seconds to milliseconds on RAG workloads.

**R1-2 — max-model-len graceful error handling:**
Add a warning block explaining that vLLM rejects overlong prompts with HTTP 400 (no silent truncation). Recommend configuring LiteLLM's `trim_messages` or `drop_params` options, or implementing client-side token counting before dispatch.

### Task 3 — R1-3 + R2-3: Security additions

**File:** `06-mise-en-oeuvre/local-inference-security.md`

**R1-3 — Error leakage / System Prompt exfiltration:**
Add a subsection under the OWASP section: when vLLM throws a 500 (OOM, timeout), LiteLLM may propagate the raw payload (including system prompt) to the caller. Recommend intercepting errors at the gateway layer and returning a generic `503 Service Unavailable` without the backend traceback.

**R2-3 — Model supply chain (SHA256):**
Add a subsection on model provenance: `ollama pull` and `huggingface-cli download` are opaque operations. In a sovereign or air-gapped infrastructure, mandate SHA256 hash verification against the official model card before promoting to production. Provide example commands for both GGUF and safetensors.

### Task 4 — R2-4: OpenTelemetry traces in monitoring chapter

**File:** `06-mise-en-oeuvre/monitoring-inference-stack.md`

Add a new section "Traces vs. Métriques (OpenTelemetry)" that:
- Explains the difference between Prometheus metrics (health aggregates) and OTEL traces (per-request span breakdowns)
- Notes that LiteLLM and vLLM expose OTEL endpoints natively
- Recommends Langfuse (self-hosted) or Arize Phoenix for LLM-specific trace visualization
- Gives a concrete agentic debugging example: 30s request = 4s VectorDB + 20s SearXNG + 4s LLM generation + 2s routing

### Task 5 — R2-2: Storage Wall in blueprints

**Files:** `04-blueprints/scenario-c-desktop-cluster.md`, `04-blueprints/scenario-d-datacenter.md`

Add a callout in each blueprint's "Monitoring recommandé" or infra section:
- Quantify model load time: 70B BF16 (~140 Go) on PCIe 3.0 SSD (3 Go/s real) ≈ 47s; 400B ≈ 4.5 min of downtime per restart
- Recommend NVMe PCIe 4.0/5.0 RAID or GPUDirect Storage for production SLA (MTTR target)
- Note that model sharding across nodes in multi-GPU adds network transfer to cold-start time

### Task 6 — R1-4: Dirty tree preflight in agent workflow

**File:** `05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop.md`

Add a "Preflight Checks" section or extend the existing one with:
- Rule: agent must run `git status --porcelain` before any write operation
- If output is non-empty (dirty tree): abort run and notify operator via configured channel
- Alternative: `git stash` with a timestamped stash name, run, then `git stash pop` after merge — but only if operator explicitly enables this mode

---

## Validation Steps

1. `npm run lexicon:index` — regenerated `lexicon-index.md` must use wikilinks
2. `npm run audit:links` — no broken internal links
3. `npm run build` — clean build, no errors
4. Manual Obsidian check: open `lexicon-index.md`, verify links navigate to entries
