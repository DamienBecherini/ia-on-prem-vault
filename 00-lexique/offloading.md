---
title: Offloading
description: Technique qui place une partie du modèle en RAM ou sur SSD quand la VRAM est insuffisante, au prix d'un débit réduit.
aliases:
  - CPU offloading
tags:
  - lexique
  - stack
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Technique qui déplace une partie des poids d'un modèle hors de la VRAM (en RAM système ou sur SSD) pour permettre de faire tourner un modèle trop grand pour tenir en VRAM, en acceptant un débit de génération réduit.

## 📖 Définition détaillée

Quand un modèle de 40 Go ne tient pas dans une VRAM de 24 Go, llama.cpp peut en charger 24 Go en VRAM et garder le reste en RAM. Lors de l'inférence, chaque couche "hors VRAM" doit être transférée via PCIe avant le calcul.

Le goulot d'étranglement est le **débit PCIe** :

| Connexion | Bande passante réelle | Impact token/s |
| :-- | :-- | :-- |
| PCIe 5.0 x16 | ~60 Go/s (bi-directionnel) | Fort si beaucoup de couches offloa |
| PCIe 4.0 x16 | ~30 Go/s | Significatif sur modèles 70B |
| Thunderbolt 4 | ~5 Go/s | Rédhibitoire pour LLM |

La formule rough de débit en offloading partiel (k couches en VRAM sur N totales) :

$$\text{tokens/s} \approx \frac{1}{\frac{k}{D_{VRAM}} + \frac{N-k}{D_{PCIe}}}$$

## 💡 Pourquoi c'est important en IA on-premise

L'offloading est le cœur du **Scénario A (Labo Dev)** : une machine à moins de 3 500 € avec 16–24 Go de VRAM peut faire tourner un modèle 70B en Q4 (~40 Go) en offloadant les couches excédentaires en DDR5. Le débit sera de 3–8 tokens/s plutôt que 15–40 tokens/s, mais c'est suffisant pour développer et tester.

## ⚠️ Pièges fréquents

- L'offloading et la **concurrence ne font pas bon ménage** : à 5 utilisateurs simultanés, chacun déclenche des transferts PCIe en parallèle, ce qui effondre le débit global.
- Offloader sur SSD (au lieu de RAM) est possible mais 10× plus lent — à réserver au chargement initial, pas à l'inférence en temps réel.
- Croire que plus de RAM compense toujours : passé 64–128 Go, la RAM n'est plus le goulot — c'est le PCIe.

## 📚 Pour comprendre en profondeur

- [[04-blueprints/scenario-a-dev-lab|🛠️ Scénario A : Le Labo Dev (CPU Offloading)]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]

## 🔗 Voir aussi

- [[00-lexique/pcie|PCIe]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/vram|VRAM]]
- [[00-lexique/memory-bandwidth|Bande passante mémoire]]
