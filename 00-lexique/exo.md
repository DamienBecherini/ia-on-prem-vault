---
title: Exo
description: Orchestrateur P2P open-source pour fusionner la mémoire de plusieurs machines en un cluster IA local.
aliases:
  - Exo Labs
  - Exo cluster
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
Logiciel open-source qui transforme plusieurs machines ordinaires (Mac, PC, smartphones) en un cluster IA P2P capable de faire tourner des modèles massifs.

## 📖 Définition détaillée
Exo (développé par *Exo Labs*) utilise la découverte automatique sur le réseau local : chaque machine lance `uv run exo`, elles se détectent et fusionnent leur mémoire disponible. Le modèle est découpé en tranches de couches selon la stratégie [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] : la machine A calcule les premières couches, transmet le résultat à la machine B, etc.

Particulièrement efficace sur Apple Silicon via des câbles [[00-lexique/thunderbolt|Thunderbolt]] (bande passante suffisante pour compenser la latence inter-machines).

## 💡 Pourquoi c'est important en IA on-premise
Permet de dépasser la limite d'une seule machine sans investissement datacenter. Un cluster de 4 à 8 Mac Mini peut accueillir des modèles de 200 à 600B+ inaccessibles sur une machine unique.

## ⚠️ Pièges fréquents
- Un réseau Wi-Fi ou Ethernet 1 Gbps détruit les performances : le réseau devient le goulot.
- Le TTFT explose sur les prompts longs (le prefill fait transiter beaucoup de données entre nœuds).
- Mauvais support de la concurrence élevée : pas adapté à 50 utilisateurs simultanés.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/clustering-exo-and-ray|🌐 Clustering IA : Exo et Ray]] *(le chapitre complet avec benchmarks et cas d'usage)*
2. [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scénario C : Le Cluster Bureau]] *(blueprint Exo + Thunderbolt)*
3. [[00-lexique/pipeline-parallelism|Pipeline Parallelism]] *(la stratégie de découpage utilisée)*

## 🔗 Voir aussi
- [[00-lexique/ray|Ray]]
- [[00-lexique/thunderbolt|Thunderbolt]]
- [[00-lexique/pipeline-parallelism|Pipeline Parallelism]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
