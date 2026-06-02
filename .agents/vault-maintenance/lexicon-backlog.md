# Lexicon Backlog

This file is for agents maintaining the vault. It is not reader-facing content.

Use it to track lexicon side effects produced while generating chapter articles:

- new lexicon entries to create
- existing entries to verify or update
- existing entries already linked from a chapter

When an item is completed, move it to `## Done` with the date and related source article.

---

## To Create

### `00-lexique/nvswitch.md`

- **Source article:** `02-materiel/stations-multi-gpu.md`
- **Reason:** NVSwitch is central to the distinction between PCIe multi-GPU workstations and datacenter NVLink fabrics.
- **Expected scope:** concise definition, relation to NVLink, relevance for tensor parallel inference.

### `00-lexique/tensor-parallelism.md`

- **Source article:** `02-materiel/stations-multi-gpu.md`
- **Reason:** Key inference sharding strategy used by vLLM and TensorRT-LLM.
- **Expected scope:** model weights sharded across GPUs, communication overhead, best fit for fast interconnects.

### `00-lexique/pipeline-parallelism.md`

- **Source article:** `02-materiel/stations-multi-gpu.md`
- **Reason:** Complementary strategy for models spanning several GPUs or nodes.
- **Expected scope:** layer-wise split, pipeline bubbles, fit for slower interconnects or multi-node setups.

### `00-lexique/nccl.md`

- **Source article:** `02-materiel/stations-multi-gpu.md`
- **Reason:** NVIDIA collective communication library often involved in multi-GPU inference/training stacks.
- **Expected scope:** collective communication, GPU-to-GPU transfers, relation to NVLink, InfiniBand and GPUDirect RDMA.

### `00-lexique/infiniband.md`

- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Reason:** Central network fabric option for serious AI/HPC multi-node systems.
- **Expected scope:** dedicated RDMA fabric, contrast with RoCE over Ethernet, relevance for low-latency GPU clusters.

### `00-lexique/thunderbolt.md`

- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Reason:** Important workstation/homelab interconnect often confused with GPU fabrics.
- **Expected scope:** Thunderbolt 4/5 bandwidth orders of magnitude, useful station use cases, limits for distributed inference.

### `00-lexique/gpudirect-rdma.md`

- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Reason:** Key mechanism for GPU-aware RDMA transfers across compatible NICs and fabrics.
- **Expected scope:** direct GPU memory exchange with third-party devices, relation to PCIe, InfiniBand, RoCE and DMA-BUF.

### `00-lexique/pfc.md`

- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Reason:** Priority Flow Control is central to lossless RoCE designs and a common operational pitfall.
- **Expected scope:** per-priority Ethernet pause, why it helps RoCE, risks when misconfigured.

### `00-lexique/ecn.md`

- **Source article:** `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- **Reason:** Explicit Congestion Notification is used with RoCE congestion management.
- **Expected scope:** congestion marking, CNP feedback in RoCE, why monitoring matters.

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

## Done

