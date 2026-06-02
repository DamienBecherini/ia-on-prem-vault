---
title: RDMA
description: Accès mémoire distant direct sans copie CPU classique.
aliases:
  - Remote Direct Memory Access
tags:
  - lexique
  - reseau
---


## Définition courte
Technique réseau permettant d'écrire/lire en mémoire distante avec faible surcharge CPU.

## Définition détaillée
RDMA réduit les copies et le traitement protocolaire côté CPU pour les échanges inter-nœuds.
Il est utilisé dans les clusters IA pour améliorer latence et débit effectif des communications.

## Pourquoi c'est important en IA on-premise
Dès qu'on distribue des charges IA sur plusieurs machines, RDMA devient un levier critique de performance.

## Pièges fréquents
- Comparer RDMA et TCP/IP sans considérer la charge CPU et la latence.
- Surévaluer l'impact d'RDMA sur de petits workloads qui sont surtout compute-bound.

## Voir aussi
- [[00-lexique/roce|RoCE]]
- [[00-lexique/multi-gpu|Multi-GPU]]
- [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire & Le "Memory Wall"]]
