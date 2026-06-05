---
title: RoCE
description: Implémentation d'RDMA sur Ethernet convergé.
aliases:
  - RDMA over Converged Ethernet
tags:
  - lexique
  - reseau
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Définition courte
Protocole qui apporte les bénéfices RDMA sur des réseaux Ethernet adaptés.

## 📖 Définition détaillée
RoCE apporte les bénéfices de [[00-lexique/rdma|RDMA]] (faible latence, faible charge CPU) sur des switches Ethernet standard, sans nécessiter un fabric [[00-lexique/infiniband|InfiniBand]] dédié.

**RoCE v2** (la version courante) utilise UDP/IP, ce qui simplifie le routage mais exige un réseau **lossless** pour ne pas dégrader les performances RDMA :
- **[[00-lexique/pfc|PFC]]** (Priority Flow Control) : évite les pertes de paquets en pausant le trafic par priorité.
- **[[00-lexique/ecn|ECN]]** (Explicit Congestion Notification) : gère la congestion avant que les buffers saturent.

Sans cette configuration, une perte de paquet force une retransmission qui peut dégrader le débit par ×10 ou plus.

**RoCE vs InfiniBand :**
- RoCE : réutilise l'infrastructure Ethernet, coût inférieur, configuration réseau exigeante.
- InfiniBand : fabric dédié, lossless natif, latence la plus basse, coût élevé.

## 💡 Pourquoi c'est important en IA on-premise
Alternative crédible à InfiniBand pour les clusters IA on-premise quand le budget ne permet pas un fabric IB dédié. Backbone des clusters GPU à 25/100/400 GbE.

## ⚠️ Pièges fréquents
- RoCE sans PFC/ECN correctement configurés dégénère en performances inférieures à du TCP optimisé.
- Un seul switch non configuré sur le chemin casse le lossless pour tout le flux.

## 🔗 Voir aussi
- [[00-lexique/pfc|PFC]]
- [[00-lexique/ecn|ECN]]
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/infiniband|InfiniBand]]
- [[00-lexique/gpudirect-rdma|GPUDirect RDMA]]
- [[02-materiel/network-roce-infiniband-thunderbolt|🌐 Réseau IA : RoCE et Thunderbolt]]
