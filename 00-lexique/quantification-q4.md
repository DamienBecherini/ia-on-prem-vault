---
title: Quantification Q4
description: Quantification 4-bit pour réduire fortement l'empreinte mémoire.
aliases:
  - Q4
  - 4-bit quantization
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Quantification où les poids sont représentés sur 4 bits (au lieu de 16 ou 32).

## 📖 Définition détaillée
Q4 réduit fortement la taille mémoire d'un modèle, ce qui facilite le déploiement local.
La qualité dépend du schéma exact de quantification (grouping, scales, format) et du moteur d'inférence.

## 💡 Pourquoi c'est important en IA on-premise
Permet de rendre exploitables localement des tailles de modèles autrement inaccessibles en VRAM/RAM.

## 🔗 Voir aussi
- [[00-lexique/quantification|Quantification]]
- [[00-lexique/tokens-per-second|Tokens par seconde]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
