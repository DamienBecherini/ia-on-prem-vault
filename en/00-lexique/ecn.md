---
title: ECN
description: Explicit Congestion Notification — network congestion signaling used with RoCE to avoid packet loss.
aliases:
  - Explicit Congestion Notification
  - DCQCN
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---

## 📝 Short definition

Network mechanism (RFC 3168) that marks packets when congestion is imminent, letting the sender slow down *before* packets are dropped.

## 📖 Detailed definition

When a switch detects congestion (filling buffers), it marks packets with an ECN-CE bit. The receiver sends a **CNP** (Congestion Notification Packet) to the sender, which reduces injection rate. That avoids packet loss without relying on [[00-lexique/pfc|PFC]] alone.

On RoCE networks, ECN is combined with PFC via **DCQCN** (Data Center Quantized Congestion Notification, from Microsoft and NVIDIA) for finer congestion control.

## 💡 Why it matters for on-prem AI

Complements PFC by managing congestion proactively rather than reactively. A production-ready RoCE network should enable PFC + ECN/DCQCN on all gear.

## ⚠️ Common pitfalls

- ECN alone is not enough: without PFC to absorb bursts, packets can still be lost.
- DCQCN parameters (Kmin, Kmax, timer thresholds) must be tuned for link speed and cluster size — defaults are not tuned for AI workloads.

## 🔗 See also

- [[00-lexique/pfc|PFC]]
- [[00-lexique/roce|RoCE]]
- [[00-lexique/rdma|RDMA]]
- [[02-materiel/network-roce-infiniband-thunderbolt|🌐 AI networking: RoCE and Thunderbolt]]
- [[00-lexique/ai-glossary|📖 AI Glossary]]
