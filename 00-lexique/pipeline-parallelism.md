---
title: Pipeline Parallelism
description: Stratégie de distribution d'un LLM en tranches de couches entre plusieurs machines.
aliases:
  - Parallélisme de pipeline
  - PP
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Découpage d'un modèle en blocs de couches répartis sur plusieurs nœuds : chaque nœud traite sa tranche et transmet le résultat au suivant.

## 📖 Définition détaillée
La machine A calcule les couches 1 à N, envoie le résultat (les *activations*) par le réseau à la machine B qui calcule les suivantes, et ainsi de suite jusqu'au dernier nœud. C'est la stratégie utilisée par [[00-lexique/exo|Exo]] sur les clusters de bureau.

**Différence clé avec le [[00-lexique/tensor-parallelism|Tensor Parallelism]]** :
- Pipeline Parallelism : découpage *entre* couches (besoin d'un réseau rapide mais pas extrême).
- Tensor Parallelism : découpage *au sein* d'une couche (besoin de NVLink ou équivalent très rapide).

Le Pipeline Parallelism *augmente la capacité mémoire* mais *introduit de la latence* à chaque frontière entre nœuds (les fameux "pipeline bubbles" — temps d'attente entre tranches).

## 💡 Pourquoi c'est important en IA on-premise
Seule option viable pour les clusters bureau où NVLink n'est pas disponible. Clé pour comprendre pourquoi le [[00-lexique/ttft|TTFT]] se dégrade dans le Scénario C.

## ⚠️ Pièges fréquents
- Les pipeline bubbles dégradent la latence, surtout sur les prompts longs (prefill).
- Supporte mal les requêtes concurrentes massives.
- Un réseau lent (Wi-Fi, 1 GbE) peut neutraliser tout le gain de capacité.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/clustering-exo-et-ray|🌐 Clustering IA : Exo et Ray]] *(comment Exo utilise cette stratégie)*
2. [[04-blueprints/scenario-c-cluster-bureau|🖥️ Scénario C : Le Cluster Bureau]] *(impact sur le TTFT en pratique)*
3. [[00-lexique/tensor-parallelism|Tensor Parallelism]] *(la stratégie alternative pour les nœuds NVLink)*

## 🔗 Voir aussi
- [[00-lexique/tensor-parallelism|Tensor Parallelism]]
- [[00-lexique/exo|Exo]]
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/glossaire-ia|📖 Glossaire IA]]
