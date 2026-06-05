---
title: NVSwitch
description: NVIDIA switch that connects multiple GPUs into a fully non-blocking NVLink fabric inside a node.
aliases:
  - NV Switch
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Short definition
NVIDIA chip that links all GPUs in an HGX node via [[00-lexique/nvlink|NVLink]], providing uniform total bandwidth between every GPU pair.

## 📖 Detailed definition
In a typical multi-GPU workstation on PCIe, GPUs communicate through the CPU bus — slow and asymmetric. NVSwitch replaces that topology with a non-blocking fabric: each GPU can send and receive data at full NVLink speed simultaneously to all others.

An HGX B200 node (8 GPUs) embeds several NVSwitch chips that enable **1,800 GB/s** aggregate bidirectional bandwidth across the 8 chips — a prerequisite for efficient [[00-lexique/tensor-parallelism|Tensor Parallelism]].

**NVLink vs NVSwitch:** NVLink is the protocol/cable; NVSwitch is the routing chip that forms the complete fabric.

## 💡 Why it matters for on-prem AI
NVSwitch is the architectural boundary between a desktop multi-GPU workstation (PCIe, slow communication) and a true datacenter node (HGX, uniform NVLink fabric). It is what makes Scenario D possible.

## ⚠️ Common pitfalls
- Two GPUs linked by NVLink without NVSwitch (point-to-point topology) do not have the same bandwidth as in a full NVSwitch fabric.
- Absent from all consumer cards — reserved for professional HGX/DGX lines.

## 🔗 See also
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[04-blueprints/scenario-d-datacenter|🏢 Scenario D: Datacenter]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
