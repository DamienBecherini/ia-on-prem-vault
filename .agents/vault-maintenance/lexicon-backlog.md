# Lexicon Backlog

This file is for agents maintaining the vault. It is not reader-facing content.

Use it to track lexicon side effects produced while generating chapter articles:

- new lexicon entries to create
- existing entries to verify or update
- existing entries already linked from a chapter

When an item is completed, move it to `## Done` with the date and related source article.

---

## To Create

### Hardware & réseau (from `02-materiel/`)

#### `00-lexique/nvswitch.md`
- **Source article:** `02-materiel/stations-multi-gpu.md`
- **Reason:** NVSwitch is central to the distinction between PCIe multi-GPU workstations and datacenter NVLink fabrics.
- **Expected scope:** concise definition, relation to NVLink, relevance for tensor parallel inference.

#### `00-lexique/tensor-parallelism.md`
- **Source article:** `02-materiel/stations-multi-gpu.md`, `04-blueprints/scenario-d-datacenter.md`
- **Reason:** Key inference sharding strategy used by vLLM and TensorRT-LLM.
- **Expected scope:** model weights sharded across GPUs, communication overhead, best fit for fast interconnects.

#### `00-lexique/pipeline-parallelism.md`
- **Source article:** `02-materiel/stations-multi-gpu.md`, `03-stack-logicielle/clustering-exo-et-ray.md`, `04-blueprints/scenario-c-cluster-bureau.md`
- **Reason:** Complementary strategy for models spanning several GPUs or nodes; also the method used by Exo.
- **Expected scope:** layer-wise split, pipeline bubbles, fit for slower interconnects or multi-node setups.

#### `00-lexique/nccl.md`
- **Source article:** `02-materiel/stations-multi-gpu.md`
- **Reason:** NVIDIA collective communication library often involved in multi-GPU inference/training stacks.
- **Expected scope:** collective communication, GPU-to-GPU transfers, relation to NVLink, InfiniBand and GPUDirect RDMA.

#### `00-lexique/infiniband.md`
- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Reason:** Central network fabric option for serious AI/HPC multi-node systems.
- **Expected scope:** dedicated RDMA fabric, contrast with RoCE over Ethernet, relevance for low-latency GPU clusters.

#### `00-lexique/thunderbolt.md`
- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`, `04-blueprints/scenario-c-cluster-bureau.md`
- **Reason:** Important workstation/homelab interconnect often confused with GPU fabrics.
- **Expected scope:** Thunderbolt 4/5 bandwidth orders of magnitude, useful station use cases, limits for distributed inference.

#### `00-lexique/gpudirect-rdma.md`
- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Reason:** Key mechanism for GPU-aware RDMA transfers across compatible NICs and fabrics.
- **Expected scope:** direct GPU memory exchange with third-party devices, relation to PCIe, InfiniBand, RoCE and DMA-BUF.

#### `00-lexique/pfc.md`
- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Reason:** Priority Flow Control is central to lossless RoCE designs and a common operational pitfall.
- **Expected scope:** per-priority Ethernet pause, why it helps RoCE, risks when misconfigured.

#### `00-lexique/ecn.md`
- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Reason:** Explicit Congestion Notification is used with RoCE congestion management.
- **Expected scope:** congestion marking, CNP feedback in RoCE, why monitoring matters.

### Stack logicielle (from `03-stack-logicielle/`) — Gemini batch 2026-06-03

#### `00-lexique/pagedattention.md`
- **Source article:** `03-stack-logicielle/moteurs-inference-vllm-ollama.md`
- **Reason:** Concept critique pour comprendre la supériorité de vLLM en production concurrente.
- **Expected scope:** mémoire virtuelle appliquée au KV Cache, Continuous Batching, réduction de la fragmentation.

#### `00-lexique/gguf.md`
- **Source article:** `03-stack-logicielle/moteurs-inference-vllm-ollama.md`, `04-blueprints/scenario-a-labo-dev.md`
- **Reason:** Format de fichier omniprésent pour l'inférence locale CPU/Mac avec llama.cpp.
- **Expected scope:** GPT-Generated Unified Format, K-quants, portabilité, chargement immédiat.

#### `00-lexique/tensorrt-llm.md`
- **Source article:** `03-stack-logicielle/moteurs-inference-vllm-ollama.md`, `04-blueprints/scenario-d-datacenter.md`
- **Reason:** Moteur de référence pour l'écosystème datacenter NVIDIA, format propriétaire.
- **Expected scope:** compilation Ahead-of-Time, support natif FP4/FP8, Flash-Decoding.

#### `00-lexique/exo.md`
- **Source article:** `03-stack-logicielle/clustering-exo-et-ray.md`, `04-blueprints/scenario-c-cluster-bureau.md`
- **Reason:** Outil de clustering P2P populaire pour contourner les limites matérielles locales.
- **Expected scope:** orchestration P2P, découverte automatique, lien avec Pipeline Parallelism.

#### `00-lexique/ray.md`
- **Source article:** `03-stack-logicielle/clustering-exo-et-ray.md`, `04-blueprints/scenario-d-datacenter.md`
- **Reason:** Framework de référence pour le déploiement multi-nœuds en production.
- **Expected scope:** orchestration, distribution vLLM, désagrégation prefill/decode.

#### `00-lexique/agent-autonome.md`
- **Source article:** `03-stack-logicielle/rag-et-agents-openhuman.md`
- **Reason:** Concept central de l'évolution du RAG et de l'orchestration LLM.
- **Expected scope:** différence entre LLM simple et agent (Tool calling, réflexion, boucle ReAct).

#### `00-lexique/graphrag.md`
- **Source article:** `03-stack-logicielle/rag-et-agents-openhuman.md`
- **Reason:** Évolution majeure de la récupération documentaire.
- **Expected scope:** graphe de connaissances vs vecteurs, extraction d'entités, requêtes globales.

#### `00-lexique/smolagents.md`
- **Source article:** `03-stack-logicielle/rag-et-agents-openhuman.md`
- **Reason:** Framework de référence pour l'orchestration agentique locale citée dans le chapitre.
- **Expected scope:** bibliothèque Hugging Face, sécurité on-premise, alternative légère à LangChain.

#### `00-lexique/vectordb.md`
- **Source article:** `03-stack-logicielle/rag-et-agents-openhuman.md`
- **Reason:** Brique de base du RAG standard.
- **Expected scope:** base de données vectorielle, embeddings, similarité cosinus (Milvus, Qdrant, Chroma).

### Fondations pédagogiques (from `01-fondations/le-voyage-d-un-prompt.md`)

#### `00-lexique/tokenisation.md`
- **Source article:** `01-fondations/le-voyage-d-un-prompt.md`
- **Reason:** Premier concept pédagogique du voyage ; introduit sans fiche lexique.
- **Expected scope:** découpage texte → tokens, BPE, taille vocabulaire (ex : 128 256 pour Llama 3).

#### `00-lexique/embedding.md`
- **Source article:** `01-fondations/le-voyage-d-un-prompt.md`
- **Reason:** Étape 2 du voyage ; pas de fiche existante.
- **Expected scope:** vecteur de coordonnées, espace sémantique, dimension typique (4096D).

#### `00-lexique/attention.md`
- **Source article:** `01-fondations/le-voyage-d-un-prompt.md`, `01-fondations/kv-cache-et-contexte.md`
- **Reason:** Mécanisme clé mentionné dans le voyage et le chapitre KV cache ; pas de fiche dédiée.
- **Expected scope:** auto-attention, croisement des tokens entre eux, lien avec KV cache.

---

## To Verify Or Update

### `00-lexique/multi-gpu.md`
- **Source article:** `02-materiel/stations-multi-gpu.md`
- **Update:** mention data parallelism, tensor parallelism and pipeline parallelism.
- **Reason:** Current entry is accurate but too generic for the new chapter.

### `00-lexique/nvlink.md`
- **Source article:** `02-materiel/stations-multi-gpu.md`
- **Update:** distinguish NVLink links from NVSwitch fabrics.
- **Reason:** The chapter uses NVSwitch as the architectural boundary between workstation and datacenter systems.

### `00-lexique/pcie.md`
- **Source article:** `02-materiel/stations-multi-gpu.md`
- **Update:** add a cautious PCIe 5.0 x16 order of magnitude and explain why it remains much lower than local VRAM bandwidth.
- **Reason:** The new chapter relies on PCIe as the main workstation interconnect bottleneck.

### `00-lexique/vram.md`
- **Source article:** `02-materiel/stations-multi-gpu.md`
- **Update:** reinforce the pitfall that total VRAM across several GPUs is not automatically equivalent to a single shared VRAM pool.
- **Reason:** This is one of the main reader-facing traps in multi-GPU sizing.

### `00-lexique/rdma.md`
- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Update:** mention GPUDirect RDMA and distinguish generic RDMA from specific fabrics such as InfiniBand and RoCE.
- **Reason:** The new article depends on RDMA as a networking primitive, not just a generic performance label.

### `00-lexique/roce.md`
- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Update:** add PFC/ECN, lossy/lossless nuance and the operational risk of misconfiguration.
- **Reason:** The article explicitly warns that RoCE is not plug-and-play Ethernet.

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

## Already Linked From `03-stack-logicielle/clustering-exo-et-ray.md`

- `00-lexique/nvlink.md`
- `00-lexique/roce.md`
- `00-lexique/prefill.md`
- `00-lexique/kv-cache.md`
- `00-lexique/decoding.md`
- `00-lexique/tokens-par-seconde.md`

## Already Linked From `03-stack-logicielle/rag-et-agents-openhuman.md`

- `00-lexique/llm.md`
- `00-lexique/fenetre-de-contexte.md`
- `00-lexique/inference.md`
- `00-lexique/ttft.md`

## Already Linked From `04-blueprints/scenario-a-labo-dev.md`

- `00-lexique/offloading.md`
- `00-lexique/ram.md`
- `00-lexique/vram.md`
- `00-lexique/quantification-q4.md`
- `00-lexique/tokens-par-seconde.md`
- `00-lexique/decoding.md`

## Already Linked From `04-blueprints/scenario-b-pme-appliance.md`

- `00-lexique/offloading.md`
- `00-lexique/memoire-unifiee.md`
- `00-lexique/vram.md`
- `00-lexique/tokens-par-seconde.md`
- `00-lexique/decoding.md`
- `00-lexique/kv-cache.md`

## Already Linked From `04-blueprints/scenario-c-cluster-bureau.md`

- `00-lexique/moe.md`
- `00-lexique/thunderbolt.md` (To Create)
- `00-lexique/exo.md` (To Create)
- `00-lexique/pipeline-parallelism.md` (To Create)
- `00-lexique/tokens-par-seconde.md`
- `00-lexique/ttft.md`

## Already Linked From `04-blueprints/scenario-d-datacenter.md`

- `00-lexique/nvlink.md`
- `00-lexique/rdma.md`
- `00-lexique/roce.md`
- `00-lexique/ray.md` (To Create)
- `00-lexique/tensor-parallelism.md` (To Create)
- `00-lexique/tokens-par-seconde.md`
- `00-lexique/ttft.md`

---

## Done

### `00-lexique/inference.md`

- **Date:** 2026-06-03
- **Source article:** `01-fondations/la-bande-passante-memoire.md`, parcours glossaire
- **Also updated:** `00-lexique/llm.md` (pont léger), liens depuis prefill/decoding/glossaire/chapitre bande passante
