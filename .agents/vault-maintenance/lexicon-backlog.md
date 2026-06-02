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

## Already Linked From `02-materiel/stations-multi-gpu.md`

- `00-lexique/multi-gpu.md`
- `00-lexique/pcie.md`
- `00-lexique/nvlink.md`
- `00-lexique/vram.md`
- `00-lexique/rdma.md`
- `00-lexique/roce.md`
- `00-lexique/offloading.md`

## Done

