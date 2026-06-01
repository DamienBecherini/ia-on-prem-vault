---
title: RoCE
description: Implémentation d'RDMA sur Ethernet convergé.
aliases:
  - RDMA over Converged Ethernet
tags:
  - lexique
  - reseau
---

# RoCE

## Définition courte
Protocole qui apporte les bénéfices RDMA sur des réseaux Ethernet adaptés.

## Définition détaillée
RoCE permet des transferts mémoire-à-mémoire à faible latence sur infrastructure Ethernet.
Il est souvent utilisé pour l'IA distribuée quand InfiniBand n'est pas retenu.

## Pourquoi c'est important en IA on-premise
Il améliore la viabilité des architectures multi-nœuds en limitant la pénalité réseau.

## Pièges fréquents
- Penser que RoCE fonctionne optimalement sans configuration réseau adaptée.
- Confondre débit théorique Ethernet et performance réelle applicative.

## Voir aussi
- [[00-lexique/rdma]]
- [[00-lexique/multi-gpu]]
- [[01-fondations/la-bande-passante-memoire]]
