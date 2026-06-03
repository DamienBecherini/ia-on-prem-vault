# Lexicon Backlog

This file is for agents maintaining the vault. It is not reader-facing content.

Use it to track lexicon side effects produced while generating chapter articles:

- new lexicon entries to create
- existing entries to verify or update
- existing entries already linked from a chapter

When an item is completed, move it to `## Done` with the date and related source article.

---

## To Create

*(empty — all pending entries from the 2026-06-03 Gemini batch have been created)*

---

## To Verify Or Update

*(empty — all pending updates from the 2026-06-03 Gemini batch have been applied)*

---

## Already Linked From `02-materiel/stations-multi-gpu.md`

- `00-lexique/multi-gpu.md`
- `00-lexique/pcie.md`
- `00-lexique/nvlink.md`
- `00-lexique/vram.md`
- `00-lexique/rdma.md`
- `00-lexique/roce.md`
- `00-lexique/offloading.md`

## Already Linked From `02-materiel/reseau-ia-roce-et-thunderbolt.md`

- `00-lexique/vram.md`
- `00-lexique/rdma.md`
- `00-lexique/nvlink.md`
- `00-lexique/bande-passante-memoire.md`
- `00-lexique/roce.md`

## Already Linked From `03-stack-logicielle/moteurs-inference-vllm-ollama.md`

- `00-lexique/llm.md`
- `00-lexique/vram.md`
- `00-lexique/kv-cache.md`
- `00-lexique/tokens-par-seconde.md`
- `00-lexique/ttft.md`
- `00-lexique/offloading.md`
- `00-lexique/quantification.md`
- `00-lexique/quantification-q4.md`
- `00-lexique/multi-gpu.md`
- `00-lexique/nvlink.md`
- `00-lexique/pagedattention.md`
- `00-lexique/gguf.md`
- `00-lexique/tensor-parallelism.md`

## Already Linked From `03-stack-logicielle/clustering-exo-et-ray.md`

- `00-lexique/nvlink.md`
- `00-lexique/roce.md`
- `00-lexique/prefill.md`
- `00-lexique/kv-cache.md`
- `00-lexique/decoding.md`
- `00-lexique/tokens-par-seconde.md`
- `00-lexique/exo.md`
- `00-lexique/ray.md`
- `00-lexique/thunderbolt.md`
- `00-lexique/pipeline-parallelism.md`

## Already Linked From `03-stack-logicielle/rag-et-agents-openhuman.md`

- `00-lexique/llm.md`
- `00-lexique/fenetre-de-contexte.md`
- `00-lexique/inference.md`
- `00-lexique/ttft.md`
- `00-lexique/vectordb.md`
- `00-lexique/smolagents.md`
- `00-lexique/graphrag.md`

## Already Linked From `04-blueprints/scenario-a-labo-dev.md`

- `00-lexique/offloading.md`
- `00-lexique/ram.md`
- `00-lexique/vram.md`
- `00-lexique/quantification-q4.md`
- `00-lexique/tokens-par-seconde.md`
- `00-lexique/decoding.md`
- `00-lexique/gguf.md`

## Already Linked From `04-blueprints/scenario-b-pme-appliance.md`

- `00-lexique/offloading.md`
- `00-lexique/memoire-unifiee.md`
- `00-lexique/vram.md`
- `00-lexique/tokens-par-seconde.md`
- `00-lexique/decoding.md`
- `00-lexique/kv-cache.md`

## Already Linked From `04-blueprints/scenario-c-cluster-bureau.md`

- `00-lexique/moe.md`
- `00-lexique/thunderbolt.md`
- `00-lexique/exo.md`
- `00-lexique/pipeline-parallelism.md`
- `00-lexique/tokens-par-seconde.md`
- `00-lexique/ttft.md`

## Already Linked From `04-blueprints/scenario-d-datacenter.md`

- `00-lexique/nvlink.md`
- `00-lexique/nvswitch.md`
- `00-lexique/rdma.md`
- `00-lexique/roce.md`
- `00-lexique/ray.md`
- `00-lexique/tensor-parallelism.md`
- `00-lexique/pagedattention.md`
- `00-lexique/tensorrt-llm.md`
- `00-lexique/tokens-par-seconde.md`
- `00-lexique/ttft.md`
- `00-lexique/pfc.md`
- `00-lexique/ecn.md`

## Already Linked From `01-fondations/le-voyage-d-un-prompt.md`

- `00-lexique/tokenisation.md`
- `00-lexique/embedding.md`
- `00-lexique/attention.md`
- `00-lexique/llm.md`
- `00-lexique/inference.md`
- `00-lexique/kv-cache.md`

---

## Done

### `00-lexique/inference.md`

- **Date:** 2026-06-03
- **Source article:** `01-fondations/la-bande-passante-memoire.md`, parcours glossaire
- **Also updated:** `00-lexique/llm.md` (pont léger), liens depuis prefill/decoding/glossaire/chapitre bande passante

### Phase 3 — Hardware & réseau (2026-06-03)

| Fiche créée | Source principale |
| :-- | :-- |
| `00-lexique/nvswitch.md` | `02-materiel/stations-multi-gpu.md` |
| `00-lexique/tensor-parallelism.md` | `02-materiel/stations-multi-gpu.md`, `scenario-d-datacenter.md` |
| `00-lexique/pipeline-parallelism.md` | `clustering-exo-et-ray.md`, `scenario-c-cluster-bureau.md` |
| `00-lexique/nccl.md` | `02-materiel/stations-multi-gpu.md` |
| `00-lexique/infiniband.md` | `02-materiel/reseau-ia-roce-et-thunderbolt.md` |
| `00-lexique/thunderbolt.md` | `02-materiel/reseau-ia-roce-et-thunderbolt.md`, `scenario-c` |
| `00-lexique/gpudirect-rdma.md` | `02-materiel/reseau-ia-roce-et-thunderbolt.md` |
| `00-lexique/pfc.md` | `02-materiel/reseau-ia-roce-et-thunderbolt.md` |
| `00-lexique/ecn.md` | `02-materiel/reseau-ia-roce-et-thunderbolt.md` |

### Phase 4 — Stack logicielle & RAG (2026-06-03)

| Fiche créée | Source principale |
| :-- | :-- |
| `00-lexique/pagedattention.md` | `moteurs-inference-vllm-ollama.md` |
| `00-lexique/gguf.md` | `moteurs-inference-vllm-ollama.md`, `scenario-a-labo-dev.md` |
| `00-lexique/tensorrt-llm.md` | `moteurs-inference-vllm-ollama.md`, `scenario-d-datacenter.md` |
| `00-lexique/exo.md` | `clustering-exo-et-ray.md`, `scenario-c-cluster-bureau.md` |
| `00-lexique/ray.md` | `clustering-exo-et-ray.md`, `scenario-d-datacenter.md` |
| `00-lexique/agent-autonome.md` | `rag-et-agents-openhuman.md` |
| `00-lexique/graphrag.md` | `rag-et-agents-openhuman.md` |
| `00-lexique/smolagents.md` | `rag-et-agents-openhuman.md` |
| `00-lexique/vectordb.md` | `rag-et-agents-openhuman.md` |

### Phase 5 — Fondations pédagogiques (2026-06-03)

| Fiche créée | Source principale |
| :-- | :-- |
| `00-lexique/tokenisation.md` | `01-fondations/le-voyage-d-un-prompt.md` |
| `00-lexique/embedding.md` | `01-fondations/le-voyage-d-un-prompt.md` |
| `00-lexique/attention.md` | `01-fondations/le-voyage-d-un-prompt.md`, `kv-cache-et-contexte.md` |

### Phase 6 — Mises à jour fiches hardware (2026-06-03)

| Fiche mise à jour | Changement |
| :-- | :-- |
| `00-lexique/multi-gpu.md` | Tableau comparatif PCIe/NVLink/HGX, TP vs PP, pitfall pool non-partagée |
| `00-lexique/nvlink.md` | Tableau générations, distinction NVLink vs NVSwitch |
| `00-lexique/pcie.md` | Tableau débits Gen4/5/6, comparaison avec NVLink, pitfall x8 mid-range |
| `00-lexique/vram.md` | Tableau DDR5/GDDR7/HBM3e, lien Memory Wall, pitfall pool multi-GPU |
| `00-lexique/rdma.md` | GPUDirect RDMA, distinction IB vs RoCE, tableaux |
| `00-lexique/roce.md` | PFC/ECN/DCQCN obligatoires, RoCE vs IB, risques misconfiguration |
