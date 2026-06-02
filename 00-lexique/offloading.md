---
title: Offloading
description: Déplacement de données/modèle entre différents espaces mémoire.
aliases:
  - CPU offloading
tags:
  - lexique
  - stack
---


## 📝 Définition courte
Technique qui place une partie du modèle hors de la VRAM principale (souvent en RAM).

## 📖 Définition détaillée
L'offloading augmente la capacité exécutable, mais introduit des transferts supplémentaires (souvent via PCIe).
Le gain de capacité se paie généralement en latence et en débit.

## 💡 Pourquoi c'est important en IA on-premise
Permet de faire tourner des modèles trop grands pour la VRAM disponible, en acceptant un compromis performance.

## 🔗 Voir aussi
- [[00-lexique/pcie|PCIe]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/vram|VRAM]]
