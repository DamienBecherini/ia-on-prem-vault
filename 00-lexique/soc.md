---
title: SoC
description: "System on a Chip : une seule puce qui réunit processeur, puce graphique, accélérateur IA et contrôleur mémoire ; base des Mac Apple Silicon et du DGX Spark."
aliases:
  - System on a Chip
  - Système sur puce
tags:
  - lexique
  - materiel
last_modified: "2026-10-11"
---

## 📝 Définition courte

Une seule puce qui contient presque tout un ordinateur : processeur (CPU), puce graphique (GPU), souvent un accélérateur IA ([[00-lexique/npu|NPU]]) et le contrôleur de la mémoire.

## 📖 Définition détaillée

Dans un PC classique, le processeur et la carte graphique sont deux composants séparés, chacun avec sa propre mémoire, reliés par le bus [[00-lexique/pcie|PCIe]]. Un SoC (*System on a Chip*, « système sur puce ») rassemble ces blocs dans un même boîtier. Apple le décrit ainsi pour sa première puce M1 : « en tant que système sur puce (SoC), M1 combine de nombreuses technologies puissantes dans une seule puce », avec une architecture de [[00-lexique/unified-memory|mémoire unifiée]][^1].

Exemples en IA locale :

- **Apple M5 Max / M5 Ultra** (Mac Studio) : CPU et GPU sur la même puce, qui partagent jusqu'à 128 Go (M5 Max) ou 512 Go (M5 Ultra) de mémoire unifiée[^2].
- **AMD Ryzen AI Max PRO 400** : CPU Zen 5 et GPU Radeon 8065S sur la même puce, avec jusqu'à 192 Go de mémoire partagée ; on parle d'[[00-lexique/apu|APU]][^3].
- **NVIDIA GB10** (DGX Spark), que NVIDIA appelle *Superchip* : CPU ARM 20 cœurs et GPU Blackwell avec 128 Go de mémoire unifiée LPDDR5x[^4].

## 💡 Pourquoi c'est important en IA on-premise

Comme CPU et GPU partagent la même mémoire, un SoC peut donner au GPU 128 Go ou plus, quand une carte graphique grand public reste limitée à sa propre [[00-lexique/vram|VRAM]]. C'est ce qui permet de faire tourner de grands modèles sur une station de bureau.

## ⚠️ Pièges fréquents

- Confondre SoC et APU : l'APU est un SoC (ou un package) qui associe CPU et GPU ; le terme est surtout employé par AMD.
- Croire que la mémoire d'un SoC s'agrandit après achat : elle est en général soudée ([[00-lexique/lpddr5x|LPDDR5X]]).

## 📚 Pour comprendre en profondeur

- [[02-materiel/apu-and-unified-memory|🧠 APU & Mémoire Unifiée]] *(comparatif Apple, AMD, NVIDIA)*
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]

## 🔗 Voir aussi

- [[00-lexique/apu|APU]]
- [[00-lexique/unified-memory|Mémoire unifiée]]
- [[00-lexique/npu|NPU]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: Apple Newsroom, *Apple unleashes M1* (« As a system on a chip (SoC), M1 combines numerous powerful technologies into a single chip », architecture de mémoire unifiée), 10 novembre 2020. [https://www.apple.com/newsroom/2020/11/apple-unleashes-m1/](https://www.apple.com/newsroom/2020/11/apple-unleashes-m1/)
[^2]: Apple Newsroom, *Apple introduces new Mac Studio with M5 Max and M5 Ultra* (CPU jusqu'à 36 cœurs, GPU jusqu'à 80 cœurs, jusqu'à 512 Go de mémoire unifiée), 25 août 2026. [https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/)
[^3]: AMD, *AMD Ryzen AI Max+ PRO 495* — fiche produit (16 cœurs Zen 5, Radeon 8065S, 192 Go LPDDR5X-8533, bus 256-bit), consultée le 2026-10-09. [https://www.amd.com/en/products/processors/laptop/ryzen-pro/ai-max-pro-400-series/amd-ryzen-ai-max-plus-pro-495.html](https://www.amd.com/en/products/processors/laptop/ryzen-pro/ai-max-pro-400-series/amd-ryzen-ai-max-plus-pro-495.html)
[^4]: NVIDIA, *DGX Spark* — page produit officielle (GB10 Grace Blackwell Superchip, CPU ARM 20 cœurs, 128 Go LPDDR5x de mémoire unifiée), consultée le 2026-10-11. [https://www.nvidia.com/en-us/products/workstations/dgx-spark/](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
