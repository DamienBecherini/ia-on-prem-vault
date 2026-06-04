---
title: RoCE
description: RDMA implementation on converged Ethernet.
aliases:
  - RDMA over Converged Ethernet
tags:
  - lexique
  - reseau
---


## 📝 Short definition
Protocol that brings RDMA benefits on suitable Ethernet networks.

## 📖 Detailed definition
RoCE brings [[00-lexique/rdma|RDMA]] benefits (low latency, low CPU load) on standard Ethernet switches, without requiring a dedicated [[00-lexique/infiniband|InfiniBand]] fabric.

**RoCE v2** (the current version) uses UDP/IP, which simplifies routing but requires a **lossless** network so RDMA performance does not degrade:
- **[[00-lexique/pfc|PFC]]** (Priority Flow Control): avoids packet loss by pausing traffic per priority.
- **[[00-lexique/ecn|ECN]]** (Explicit Congestion Notification): manages congestion before buffers saturate.

Without this configuration, a lost packet forces retransmission that can degrade throughput by 10× or more.

**RoCE vs InfiniBand:**
- RoCE: reuses Ethernet infrastructure, lower cost, demanding network configuration.
- InfiniBand: dedicated fabric, natively lossless, lowest latency, high cost.

## 💡 Why it matters for on-prem AI
Credible alternative to InfiniBand for on-prem AI clusters when budget does not allow a dedicated IB fabric. Backbone of GPU clusters at 25/100/400 GbE.

## ⚠️ Common pitfalls
- RoCE without correctly configured PFC/ECN performs worse than optimized TCP.
- A single misconfigured switch on the path breaks lossless behavior for the whole flow.

## 🔗 See also
- [[00-lexique/pfc|PFC]]
- [[00-lexique/ecn|ECN]]
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/infiniband|InfiniBand]]
- [[00-lexique/gpudirect-rdma|GPUDirect RDMA]]
- [[02-materiel/network-roce-infiniband-thunderbolt|🌐 AI Networking: RoCE and Thunderbolt]]
