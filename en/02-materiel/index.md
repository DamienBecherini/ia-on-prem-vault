---
title: "🖥️ Index — Hardware"
description: Entry point for the hardware chapter — workstations, GPU rack servers, and AI networking fabric for on-premise inference.
sidebar:
  order: 0
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] Chapter goal
> Connect **foundations** (ch. 01) to **blueprints** (ch. 04): which silicon for which scenario — office, SMB appliance, office cluster, or datacenter.

Hardware dictates what you can load in [[00-lexique/vram|VRAM]], what memory throughput you can reach during [[00-lexique/decoding|decoding]], and whether you can run [[00-lexique/tensor-parallelism|tensor parallelism]] or [[00-lexique/offloading|offloading]].

---

## Path by scenario

| Blueprint | Priority hardware pages |
| :-- | :-- |
| [[04-blueprints/scenario-a-dev-lab|A — Dev Lab]] | [[02-materiel/apu-and-unified-memory|APU & unified memory]], [[02-materiel/stations-multi-gpu|Multi-GPU workstations]] (offloading) |
| [[04-blueprints/scenario-b-sme-appliance|B — SMB Appliance]] | [[02-materiel/apu-and-unified-memory|APU & unified memory]], [[02-materiel/gpu-rack-servers|GPU rack servers]] (1–2 GPU) |
| [[04-blueprints/scenario-c-desktop-cluster|C — Office cluster]] | [[02-materiel/stations-multi-gpu|Multi-GPU workstations]], [[02-materiel/network-roce-infiniband-thunderbolt|AI networking]] (Thunderbolt) |
| [[04-blueprints/scenario-d-datacenter|D — Datacenter]] | [[02-materiel/gpu-rack-servers|GPU rack servers]], [[02-materiel/network-roce-infiniband-thunderbolt|RoCE / InfiniBand]] |

---

## Chapter pages

1. [[02-materiel/apu-and-unified-memory|🧠 APU & Unified Memory]] — Apple M-series, AMD Ryzen AI, DGX Spark
2. [[02-materiel/stations-multi-gpu|🧩 Multi-GPU Workstations]] — PCIe workstations, consumer NVLink
3. [[02-materiel/gpu-rack-servers|🏭 GPU rack servers]] — 1U/2U/4U, HGX, RTX vs datacenter choice
4. [[02-materiel/network-roce-infiniband-thunderbolt|🌐 AI networking]] — RoCE, InfiniBand, Thunderbolt

---

## Useful hardware lexicon

[[00-lexique/vram|VRAM]] · [[00-lexique/hbm|HBM]] · [[00-lexique/nvlink|NVLink]] · [[00-lexique/pcie|PCIe]] · [[00-lexique/multi-gpu|Multi-GPU]] · [[00-lexique/unified-memory|Unified memory]]
