---
title: Thunderbolt
description: High-throughput wired interface for workstations and desktop AI clusters.
aliases:
  - Thunderbolt 4
  - Thunderbolt 5
  - TB5
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
Wired interface providing up to 80 Gb/s bidirectional between machines—used to link nodes in a desktop AI cluster ([[00-lexique/exo|Exo]]).

## 📖 Detailed definition
- **Thunderbolt 4**: up to 40 Gb/s bidirectional.
- **Thunderbolt 5**: up to 80 Gb/s bidirectional.

Between Macs, Thunderbolt emulates a very low-latency local IP network (IP-over-Thunderbolt). That bandwidth is enough for Exo [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] on models up to 600B+.

**In perspective:** a Thunderbolt 5 link at 80 Gb/s ≈ 10 GB/s—about a hundred times less than an [[00-lexique/nvlink|NVLink]] bus (1,800 GB/s). That is its fundamental limit.

## 💡 Why it matters for on-prem AI
Desktop solution to link several Mac minis into a quiet, economical cluster without investing in datacenter RoCE/InfiniBand networking.

## ⚠️ Common pitfalls
- No native RDMA: latency remains far higher than NVLink or InfiniBand.
- TTFT degrades sharply on long prompts (prefill moves a lot of data).
- Not a substitute for datacenter networking at high concurrency.

## 📚 Go deeper
1. [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scenario C: Desktop Cluster]] *(Exo + Thunderbolt in practice)*
2. [[02-materiel/network-roce-infiniband-thunderbolt|🌐 AI Networking: RoCE, InfiniBand, and Thunderbolt]] *(full interconnect comparison)*

## 🔗 See also
- [[00-lexique/exo|Exo]]
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/memory-bandwidth|Memory bandwidth]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
