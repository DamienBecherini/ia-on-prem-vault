---
title: Offloading
description: Technique qui place une partie du modèle en RAM ou sur SSD quand la VRAM est insuffisante, au prix d'un débit réduit.
aliases:
  - CPU offloading
tags:
  - lexique
  - stack
last_modified: "2026-11-22"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Technique qui déplace une partie des poids d'un modèle hors de la VRAM (en RAM système ou sur SSD) pour permettre de faire tourner un modèle trop grand pour tenir en VRAM, en acceptant un débit de génération réduit.

## 📖 Définition détaillée

Quand un modèle de 40 Go ne tient pas dans une VRAM de 24 Go, llama.cpp peut en charger une vingtaine de Go en VRAM et garder le reste en RAM. Lors de l'inférence, les couches "hors VRAM" sont calculées par le CPU directement en RAM (option `-ngl`) : seules les activations traversent le PCIe.

Le goulot d'étranglement est la **bande passante de la RAM système** (~80–100 Go/s en DDR5 dual-channel) ; le PCIe ne devient limitant que si des poids sont recopiés vers le GPU à chaque passe :

| Connexion | Bande passante réelle | Impact token/s |
| :-- | :-- | :-- |
| PCIe 5.0 x16 | ~64 Go/s par direction (~128 Go/s bidirectionnel) | Limitant si les poids sont recopiés à chaque passe |
| PCIe 4.0 x16 | ~32 Go/s par direction (~64 Go/s bidirectionnel) | Idem, deux fois plus lent |
| Thunderbolt 4 (GPU externe) | ~4 Go/s (tunnel PCIe 32 Gb/s) | Rédhibitoire si les poids sont recopiés à chaque passe ; sinon, ne ralentit que le chargement initial |

Formule approchée du débit en offloading partiel (P_VRAM et P_RAM : Go de poids placés en VRAM et en RAM ; D : bande passante en Go/s) :

$$\text{tokens/s} \approx \frac{1}{\frac{P_{VRAM}}{D_{VRAM}} + \frac{P_{RAM}}{D_{RAM}}}$$

## 💡 Pourquoi c'est important en IA on-premise

L'offloading est le cœur du **Scénario A (Labo Dev)** : une machine à moins de 3 500 € avec 16–24 Go de VRAM peut faire tourner un modèle 70B en Q4 (~40 Go) en offloadant les couches excédentaires en DDR5. Le débit plafonnera à environ 4–5 tokens/s (borne théorique ; le débit mesuré est inférieur, voir [[04-blueprints/scenario-a-dev-lab|Scénario A]]) plutôt que 15–40 tokens/s, mais c'est suffisant pour développer et tester.

## ⚠️ Pièges fréquents

- L'offloading et la **concurrence ne font pas bon ménage** : à 5 utilisateurs simultanés, chaque requête relit les couches restées en RAM, déjà bornées par la bande passante DDR5, ce qui effondre le débit global.
- Offloader sur SSD (au lieu de RAM) est possible mais 10× plus lent : pour un modèle dense, à réserver au chargement initial, pas à l'inférence en temps réel. Depuis le T4 2026, les MoE font exception : des moteurs dédiés comme InferSSD (Apache-2.0, première version le 30 octobre 2026) ne lisent sur le NVMe que les experts routés absents du cache VRAM/RAM, par blocs alignés de 4 Kio. Ils font ainsi tourner sur un poste unique un MoE plus gros que RAM + VRAM : selon le dépôt de l'éditeur, DeepSeek-V4.1-Flash génère ~7 tokens/s sur une RTX 5090 avec 32 Go de RAM[^1]. Le débit reste à un chiffre et les publications mesurent une requête à la fois. Le cache KV occupe la mémoire rapide au détriment du cache d'experts, et l'énergie par token peut être multipliée jusqu'à ~12×[^2]. C'est donc un banc d'essai, pas un serveur d'équipe ; si le modèle tient en RAM, restez sur llama.cpp.
- Croire que plus de RAM compense toujours : la capacité permet de charger le modèle, mais le débit reste borné par la bande passante de la RAM (~80–100 Go/s en DDR5 dual-channel), pas par sa taille.

## 📚 Pour comprendre en profondeur

- [[04-blueprints/scenario-a-dev-lab|🛠️ Scénario A : Le Labo Dev (CPU Offloading)]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]

## 🔗 Voir aussi

- [[00-lexique/pcie|PCIe]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/vram|VRAM]]
- [[00-lexique/memory-bandwidth|Bande passante mémoire]]

[^1]: WiCi, *InferSSD* (Apache-2.0 ; tranches d'experts alignées sur 4 Kio, cache d'experts RAM et VRAM ; DeepSeek-V4.1-Flash-1017 Q8_0 sur RTX 5090 + 32 Go de RAM : 7,27 tokens/s en génération contre 0,87 pour llama.cpp, mesures de l'éditeur ; première version v0.1.0 du 2026-10-30), consulté le 2026-11-22. <https://github.com/wici-ai/inferssd> ; F. Liang et al., *SSD-LLaMA: SSD-Native Inference for Trillion-Parameter MoE at 1+ Token/s on a Consumer PC* (RTX 5090, 16–32 Go de RAM, NVMe 4 To ; Kimi-K2.7-Code à 1,03 token/s ; batch 1 uniquement), arXiv:2609.18110, 16 septembre 2026. <https://arxiv.org/abs/2609.18110> ; sybil-solutions, *dsv41-flash-offload* (« Every extra GiB of KV is a GiB less for the expert cache, which lowers decode speed »), consulté le 2026-11-22. <https://github.com/sybil-solutions/dsv41-flash-offload>
[^2]: K. Kyung, S. Yun, J. H. Ahn, *SSD Offloading for LLM Mixture-of-Experts Weights Considered Harmful in Energy Efficiency* (énergie par token jusqu'à ~12× la référence HBM), IEEE CAL, 2025. <https://arxiv.org/abs/2508.06978>
