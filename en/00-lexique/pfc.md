---
title: PFC
description: Priority Flow Control — Ethernet per-priority pause mechanism for a lossless network required by RoCE.
aliases:
  - Priority Flow Control
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Short definition
Ethernet mechanism (802.1Qbb) that sends pause signals per priority class to prevent packets from being dropped on the network — a requirement for [[00-lexique/roce|RoCE]].

## 📖 Detailed definition
Classic Ethernet may drop packets under congestion. RDMA/RoCE does not tolerate retransmissions without catastrophic performance degradation. PFC solves this by selectively pausing traffic for a given priority class (e.g. priority 3 for RoCE) once a buffer exceeds a threshold, without blocking other classes.

A lossless RoCE network requires PFC enabled and correctly configured on **every** switch in the path.

## 💡 Why it matters for on-prem AI
Without PFC, RDMA packets are lost under congestion, forcing TCP-like retransmissions that degrade GPU–GPU throughput by a factor of 10× or more. Scenario D notes that poor network configuration can divide cluster speed by ten.

## ⚠️ Common pitfalls
- A single misconfigured switch in the path is enough to break lossless behavior and degrade the whole cluster.
- PFC can cause "PFC storms" (pause loops) if poorly dimensioned — monitor with switch PFC counters.
- Must be paired with [[00-lexique/ecn|ECN]] for complete congestion management.

## 🔗 See also
- [[00-lexique/ecn|ECN]]
- [[00-lexique/roce|RoCE]]
- [[00-lexique/rdma|RDMA]]
- [[02-materiel/network-roce-infiniband-thunderbolt|🌐 AI Networking: RoCE and Thunderbolt]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
