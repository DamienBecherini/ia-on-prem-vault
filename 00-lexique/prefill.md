---
title: Prefill
description: Phase d'inférence qui traite le prompt initial.
aliases:
  - Prompt ingestion
tags:
  - lexique
  - fondations
---

# Prefill

## Définition courte
Phase où le modèle encode le prompt utilisateur avant la génération mot à mot.

## Définition détaillée
Le prefill exécute surtout des opérations parallélisables sur l'entrée complète.
Cette phase bénéficie souvent davantage de la puissance de calcul que le decoding.

## Pourquoi c'est important en IA on-premise
Le prefill impacte la sensation de réactivité initiale (TTFT), surtout sur prompts longs.

## Voir aussi
- [[00-lexique/decoding]]
- [[00-lexique/ttft]]
- [[01-fondations/la-bande-passante-memoire]]
