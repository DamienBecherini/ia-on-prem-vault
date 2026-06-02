---
title: Mémoire unifiée
description: Architecture mémoire partagée entre CPU/GPU/NPU.
aliases:
  - Unified memory
tags:
  - lexique
  - materiel
---


## 📝 Définition courte
Architecture où CPU, GPU et parfois NPU partagent un même pool mémoire.

## 📖 Définition détaillée
Contrairement au schéma RAM+VRAM séparées, la mémoire unifiée évite certaines copies via PCIe.
On la retrouve notamment sur Apple Silicon et certaines plateformes AMD APU récentes.

## 💡 Pourquoi c'est important en IA on-premise
Elle peut offrir un excellent compromis entre capacité exploitable par le GPU et simplicité d'architecture.

## 🔗 Voir aussi
- [[00-lexique/vram|VRAM]]
- [[00-lexique/pcie|PCIe]]
- [[01-fondations/memoire-unifiee-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]
