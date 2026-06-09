# Lexicon Done Archive — 2026-06

Archived from `lexicon-backlog.md` on 2026-06-09. Read-only after creation.

---

## `00-lexique/inference.md`

- **Date:** 2026-06-03
- **Source article:** `01-fondations/memory-bandwidth.md`, parcours glossaire
- **Also updated:** `00-lexique/llm.md` (pont léger), liens depuis prefill/decoding/glossaire/chapitre bande passante

## Phase 3 — Hardware & réseau (2026-06-03)

| Fiche créée | Source principale |
| :-- | :-- |
| `00-lexique/nvswitch.md` | `02-materiel/stations-multi-gpu.md` |
| `00-lexique/tensor-parallelism.md` | `02-materiel/stations-multi-gpu.md`, `scenario-d-datacenter.md` |
| `00-lexique/pipeline-parallelism.md` | `clustering-exo-and-ray.md`, `scenario-c-desktop-cluster.md` |
| `00-lexique/nccl.md` | `02-materiel/stations-multi-gpu.md` |
| `00-lexique/infiniband.md` | `02-materiel/network-roce-infiniband-thunderbolt.md` |
| `00-lexique/thunderbolt.md` | `02-materiel/network-roce-infiniband-thunderbolt.md`, `scenario-c` |
| `00-lexique/gpudirect-rdma.md` | `02-materiel/network-roce-infiniband-thunderbolt.md` |
| `00-lexique/pfc.md` | `02-materiel/network-roce-infiniband-thunderbolt.md` |
| `00-lexique/ecn.md` | `02-materiel/network-roce-infiniband-thunderbolt.md` |

## Phase 4 — Stack logicielle & RAG (2026-06-03)

| Fiche créée | Source principale |
| :-- | :-- |
| `00-lexique/pagedattention.md` | `inference-engines-vllm-ollama.md` |
| `00-lexique/gguf.md` | `inference-engines-vllm-ollama.md`, `scenario-a-dev-lab.md` |
| `00-lexique/tensorrt-llm.md` | `inference-engines-vllm-ollama.md`, `scenario-d-datacenter.md` |
| `00-lexique/exo.md` | `clustering-exo-and-ray.md`, `scenario-c-desktop-cluster.md` |
| `00-lexique/ray.md` | `clustering-exo-and-ray.md`, `scenario-d-datacenter.md` |
| `00-lexique/autonomous-agent.md` | `rag-and-agents.md` |
| `00-lexique/graphrag.md` | `rag-and-agents.md` |
| `00-lexique/smolagents.md` | `rag-and-agents.md` |
| `00-lexique/vectordb.md` | `rag-and-agents.md` |

## Phase 5 — Fondations pédagogiques (2026-06-03)

| Fiche créée | Source principale |
| :-- | :-- |
| `00-lexique/tokenisation.md` | `01-fondations/journey-of-a-prompt.md` |
| `00-lexique/embedding.md` | `01-fondations/journey-of-a-prompt.md` |
| `00-lexique/attention.md` | `01-fondations/journey-of-a-prompt.md`, `kv-cache-and-context.md` |

## Phase 6 — Mises à jour fiches hardware (2026-06-03)

| Fiche mise à jour | Changement |
| :-- | :-- |
| `00-lexique/multi-gpu.md` | Tableau comparatif PCIe/NVLink/HGX, TP vs PP, pitfall pool non-partagée |
| `00-lexique/nvlink.md` | Tableau générations, distinction NVLink vs NVSwitch |
| `00-lexique/pcie.md` | Tableau débits Gen4/5/6, comparaison avec NVLink, pitfall x8 mid-range |
| `00-lexique/vram.md` | Tableau DDR5/GDDR7/HBM3e, lien Memory Wall, pitfall pool multi-GPU |
| `00-lexique/rdma.md` | GPUDirect RDMA, distinction IB vs RoCE, tableaux |
| `00-lexique/roce.md` | PFC/ECN/DCQCN obligatoires, RoCE vs IB, risques misconfiguration |
