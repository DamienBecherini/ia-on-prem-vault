---
title: MoE
description: Mixture of Experts.
aliases:
  - Mixture of Experts
tags:
  - lexique
  - fondations
---

# MoE

## Définition courte
Architecture où seuls certains "experts" du modèle sont activés pour chaque token.

## Définition détaillée
Un modèle MoE a souvent beaucoup de paramètres totaux, mais moins de paramètres actifs par token.
Cela peut améliorer le rapport qualité/coût d'inférence selon l'implémentation.

## Pourquoi c'est important en IA on-premise
Évite les comparaisons naïves "B paramètres = coût fixe" : actif par token et total doivent être distingués.

## Voir aussi
- [[00-lexique/llm]]
- [[00-lexique/quantification]]
- [[00-lexique/tokens-par-seconde]]
