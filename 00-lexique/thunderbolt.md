---
title: Thunderbolt
description: Interface câblée haut débit pour postes de travail et clusters de bureau IA.
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


## 📝 Définition courte
Interface câblée qui permet jusqu'à 80 Gb/s bidirectionnel entre machines — utilisée pour relier les nœuds d'un cluster de bureau IA ([[00-lexique/exo|Exo]]).

## 📖 Définition détaillée
- **Thunderbolt 4** : jusqu'à 40 Gb/s bidirectionnel.
- **Thunderbolt 5** : jusqu'à 80 Gb/s bidirectionnel.

Entre Mac, Thunderbolt simule une connexion réseau IP locale (IP-over-Thunderbolt) à très faible latence. Cette bande passante est suffisante pour le [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] d'Exo sur des modèles jusqu'à 600B+.

**En perspective :** un lien Thunderbolt 5 à 80 Gb/s ≈ 10 Go/s, soit cent fois moins qu'un bus [[00-lexique/nvlink|NVLink]] (1 800 Go/s). C'est sa limite fondamentale.

## 💡 Pourquoi c'est important en IA on-premise
Solution bureau pour relier plusieurs Mac Mini en cluster silencieux et économique, sans investir dans un réseau datacenter RoCE/InfiniBand.

## ⚠️ Pièges fréquents
- Pas de RDMA natif : la latence reste bien supérieure à NVLink ou InfiniBand.
- Le TTFT se dégrade fortement sur les prompts longs (le prefill fait transiter beaucoup de données).
- Pas un substitut au réseau datacenter pour la production à haute concurrence.

## 📚 Pour comprendre en profondeur
1. [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scénario C : Le Cluster Bureau]] *(Exo + Thunderbolt en pratique)*
2. [[02-materiel/network-roce-infiniband-thunderbolt|🌐 Réseau IA : RoCE, InfiniBand et Thunderbolt]] *(comparaison complète des interconnexions)*

## 🔗 Voir aussi
- [[00-lexique/exo|Exo]]
- [[00-lexique/nvlink|NVLink]]
- [[00-lexique/rdma|RDMA]]
- [[00-lexique/memory-bandwidth|Bande passante mémoire]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
