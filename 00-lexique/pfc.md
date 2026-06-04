---
title: PFC
description: Priority Flow Control — mécanisme Ethernet de pause par priorité pour garantir un réseau lossless nécessaire à RoCE.
aliases:
  - Priority Flow Control
  - Contrôle de flux par priorité
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Mécanisme Ethernet (802.1Qbb) qui envoie des signaux de pause par classe de priorité pour éviter que les paquets soient perdus sur le réseau — condition nécessaire au [[00-lexique/roce|RoCE]].

## 📖 Définition détaillée
Ethernet classique peut perdre des paquets lors d'une congestion (drop). RDMA/RoCE ne supporte pas les retransmissions sans dégradation catastrophique des performances. PFC résout cela en pausant sélectivement le trafic d'une classe de priorité donnée (ex : priorité 3 pour RoCE) dès qu'un buffer dépasse un seuil, sans bloquer les autres classes.

Un réseau RoCE lossless nécessite PFC activé et correctement configuré sur **tous** les switchs de la chaîne.

## 💡 Pourquoi c'est important en IA on-premise
Sans PFC, les paquets RDMA sont perdus lors de congestion, forçant des retransmissions TCP-like qui dégradent le débit GPU-GPU par un facteur ×10 ou plus. Le Scénario D mentionne qu'une mauvaise configuration réseau peut diviser par dix la vitesse du cluster.

## ⚠️ Pièges fréquents
- Un seul switch non configuré dans la chaîne suffit à casser le lossless et dégrader tout le cluster.
- PFC peut provoquer des "PFC storms" (boucles de pause) si mal dimensionné — surveiller avec les compteurs PFC du switch.
- Doit être couplé avec [[00-lexique/ecn|ECN]] pour une gestion complète de la congestion.

## 🔗 Voir aussi
- [[00-lexique/ecn|ECN]]
- [[00-lexique/roce|RoCE]]
- [[00-lexique/rdma|RDMA]]
- [[02-materiel/network-roce-infiniband-thunderbolt|🌐 Réseau IA : RoCE et Thunderbolt]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
