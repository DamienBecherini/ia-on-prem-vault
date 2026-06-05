---
title: ECN
description: Explicit Congestion Notification — mécanisme de signalement de congestion réseau utilisé avec RoCE pour éviter les pertes de paquets.
aliases:
  - Explicit Congestion Notification
  - DCQCN
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
---


## 📝 Définition courte
Mécanisme réseau (RFC 3168) qui marque les paquets en cas de congestion imminente, permettant à l'émetteur de ralentir *avant* que des paquets soient perdus.

## 📖 Définition détaillée
Quand un switch détecte une congestion (buffer qui se remplit), il marque les paquets avec un bit ECN-CE. Le destinataire renvoie un **CNP** (Congestion Notification Packet) à l'émetteur, qui réduit son débit d'injection. Cela évite la perte de paquets sans recourir à [[00-lexique/pfc|PFC]] seul.

Dans les réseaux RoCE, ECN est utilisé en combinaison avec PFC via le protocole **DCQCN** (Data Center Quantized Congestion Notification, développé par Microsoft et NVIDIA) pour une gestion fine de la congestion.

## 💡 Pourquoi c'est important en IA on-premise
Complète PFC en gérant la congestion de manière proactive plutôt que réactive. Un réseau RoCE production-ready doit activer PFC + ECN/DCQCN sur tous les équipements.

## ⚠️ Pièges fréquents
- ECN seul ne suffit pas : sans PFC pour absorber les rafales, des paquets peuvent encore être perdus.
- Les paramètres DCQCN (seuils Kmin, Kmax, timer) doivent être ajustés selon le débit et la taille du cluster — les valeurs par défaut ne sont pas adaptées aux workloads IA.

## 🔗 Voir aussi
- [[00-lexique/pfc|PFC]]
- [[00-lexique/roce|RoCE]]
- [[00-lexique/rdma|RDMA]]
- [[02-materiel/network-roce-infiniband-thunderbolt|🌐 Réseau IA : RoCE et Thunderbolt]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
