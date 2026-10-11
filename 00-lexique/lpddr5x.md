---
title: LPDDR5X
description: "Mémoire vive basse consommation, normalisée par le JEDEC, soudée près de la puce ; elle équipe les machines à mémoire unifiée (Mac, Ryzen AI Max, DGX Spark)."
aliases:
  - LPDDR5x
  - Low Power DDR5X
tags:
  - lexique
  - materiel
last_modified: "2026-10-11"
---

## 📝 Définition courte

Type de mémoire vive (« Low Power DDR ») conçu pour consommer peu, d'abord pour les smartphones, aujourd'hui utilisé comme mémoire partagée des machines à [[00-lexique/unified-memory|mémoire unifiée]].

## 📖 Définition détaillée

Le JEDEC, l'organisme qui normalise les mémoires, a publié en juillet 2021 la norme JESD209-5B : elle porte le débit de la LPDDR5 jusqu'à 8 533 Mbit/s et ajoute LPDDR5X, extension optionnelle visant les mobiles, l'automobile et l'IA embarquée[^1]. Contrairement aux barrettes DDR5 d'un PC, la LPDDR5X est en général soudée sur la carte, au plus près de la puce, et ne se remplace pas.

La [[00-lexique/memory-bandwidth|bande passante]] dépend de la vitesse et de la largeur du bus. Exemple avec l'AMD Ryzen AI Max+ PRO 495 (LPDDR5X-8533, bus 256 bits)[^2] :

> 8 533 millions de transferts/s × 256 bits ÷ 8 = ~273 Go/s

C'est nettement moins que la [[00-lexique/vram|VRAM]] GDDR7 d'une carte graphique haut de gamme, mais avec une capacité bien plus grande (jusqu'à 192 Go sur cette puce)[^2].

## 💡 Pourquoi c'est important en IA on-premise

Sur un [[00-lexique/soc|SoC]] à mémoire unifiée, la LPDDR5X fixe à la fois la taille des modèles chargeables (capacité) et leur vitesse de génération (bande passante). Comme elle est soudée, la capacité choisie à l'achat est définitive.

## ⚠️ Pièges fréquents

- Comparer seulement la capacité : à capacité égale, une machine LPDDR5X génère plus lentement qu'un GPU à GDDR7 ou [[00-lexique/hbm|HBM]] sur un modèle qui tient dans sa VRAM.
- Oublier la largeur du bus : la même LPDDR5X-8533 donne ~273 Go/s sur 256 bits, le double sur 512 bits.
- Prévoir un « upgrade mémoire » plus tard : impossible, la mémoire est soudée.

## 📚 Pour comprendre en profondeur

- [[02-materiel/apu-and-unified-memory|🧠 APU & Mémoire Unifiée]] *(capacités et bandes passantes par machine)*
- [[01-fondations/memory-bandwidth|🏎️ La Bande Passante Mémoire]] *(pourquoi le débit fixe la vitesse de génération)*

## 🔗 Voir aussi

- [[00-lexique/unified-memory|Mémoire unifiée]]
- [[00-lexique/memory-bandwidth|Bande passante mémoire]]
- [[00-lexique/soc|SoC]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: JEDEC, *JEDEC Publishes New and Updated Standards for Low Power Memory Devices Used in 5G and AI Applications* (JESD209-5B : LPDDR5 jusqu'à 8 533 Mbit/s, LPDDR5X extension optionnelle pour mobiles, automobile, AR/VR et IA en périphérie), 28 juillet 2021. [https://www.jedec.org/news/pressreleases/jedec-publishes-new-and-updated-standards-low-power-memory-devices-used-5g-and-ai](https://www.jedec.org/news/pressreleases/jedec-publishes-new-and-updated-standards-low-power-memory-devices-used-5g-and-ai)
[^2]: AMD, *AMD Ryzen AI Max+ PRO 495* — fiche produit (192 Go LPDDR5X-8533, bus 256-bit), consultée le 2026-10-09. [https://www.amd.com/en/products/processors/laptop/ryzen-pro/ai-max-pro-400-series/amd-ryzen-ai-max-plus-pro-495.html](https://www.amd.com/en/products/processors/laptop/ryzen-pro/ai-max-pro-400-series/amd-ryzen-ai-max-plus-pro-495.html)
