---
title: Quantification
description: Réduction de précision numérique pour optimiser le déploiement.
aliases:
  - Quantization
tags:
  - lexique
  - fondations
---

# Quantification

## Définition courte
Technique qui réduit la précision des poids/activations (ex: FP16, INT8, Q4) pour diminuer mémoire et coût.

## Définition détaillée
La quantification compresse le modèle et accélère potentiellement l'inférence, avec un compromis précision/performance.
Le bon niveau dépend du modèle, du cas d'usage et du moteur d'inférence.

## Pourquoi c'est important en IA on-premise
C'est un levier majeur pour exécuter localement des modèles plus gros sur du matériel limité.

## Voir aussi
- [[00-lexique/quantification-q4]]
- [[00-lexique/vram]]
- [[00-lexique/glossaire-ia|Glossaire IA]]
