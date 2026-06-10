---
title: "🖥️ Index — Le Matériel"
description: Point d'entrée du chapitre matériel : postes de travail, serveurs rack GPU et fabric réseau pour l'inférence on-premise.
sidebar:
  order: 0
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] Objectif du chapitre
> Relier les **fondations** (ch. 01) aux **blueprints** (ch. 04) : quel silicium pour quel scénario — bureau, appliance PME, cluster bureau ou datacenter.

Le matériel dicte ce que vous pouvez charger en [[00-lexique/vram|VRAM]], quel débit mémoire atteindre en [[00-lexique/decoding|decoding]], et si vous pouvez faire du [[00-lexique/tensor-parallelism|tensor parallelism]] ou du [[00-lexique/offloading|offloading]].

---

## Parcours par scénario

| Blueprint | Fiches matériel prioritaires |
| :-- | :-- |
| [[04-blueprints/scenario-a-dev-lab|A — Labo Dev]] | [[02-materiel/apu-and-unified-memory|APU & mémoire unifiée]], [[02-materiel/stations-multi-gpu|Stations multi-GPU]] (offloading) |
| [[04-blueprints/scenario-b-sme-appliance|B — Appliance PME]] | [[02-materiel/apu-and-unified-memory|APU & mémoire unifiée]], [[02-materiel/gpu-rack-servers|Serveurs rack GPU]] (1–2 GPU) |
| [[04-blueprints/scenario-c-desktop-cluster|C — Cluster bureau]] | [[02-materiel/stations-multi-gpu|Stations multi-GPU]], [[02-materiel/network-roce-infiniband-thunderbolt|Réseau IA]] (Thunderbolt) |
| [[04-blueprints/scenario-d-datacenter|D — Datacenter]] | [[02-materiel/gpu-rack-servers|Serveurs rack GPU]], [[02-materiel/network-roce-infiniband-thunderbolt|RoCE / InfiniBand]] |

---

## Fiches du chapitre

1. [[02-materiel/apu-and-unified-memory|🧠 APU & Mémoire Unifiée]] — Apple M-series, AMD Ryzen AI, DGX Spark
2. [[02-materiel/stations-multi-gpu|🧩 Stations Multi-GPU]] — workstations PCIe, NVLink consumer
3. [[02-materiel/gpu-rack-servers|🏭 Serveurs rack GPU]] — 1U/2U/4U, HGX, choix RTX vs datacenter
4. [[02-materiel/network-roce-infiniband-thunderbolt|🌐 Réseau IA]] — RoCE, InfiniBand, Thunderbolt

---

## Lexique matériel utile

[[00-lexique/vram|VRAM]] · [[00-lexique/hbm|HBM]] · [[00-lexique/nvlink|NVLink]] · [[00-lexique/pcie|PCIe]] · [[00-lexique/multi-gpu|Multi-GPU]] · [[00-lexique/unified-memory|Mémoire unifiée]]
