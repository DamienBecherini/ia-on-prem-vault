---
title: Offloading
description: Technique qui place une partie du modèle en RAM ou sur SSD quand la VRAM est insuffisante, au prix d'un débit réduit.
aliases:
  - CPU offloading
tags:
  - lexique
  - stack
last_modified: "2026-11-08"
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
| Thunderbolt 4 | ~5 Go/s | Rédhibitoire pour LLM |

Formule approchée du débit en offloading partiel (P_VRAM et P_RAM : Go de poids placés en VRAM et en RAM ; D : bande passante en Go/s) :

$$\text{tokens/s} \approx \frac{1}{\frac{P_{VRAM}}{D_{VRAM}} + \frac{P_{RAM}}{D_{RAM}}}$$

## 💡 Pourquoi c'est important en IA on-premise

L'offloading est le cœur du **Scénario A (Labo Dev)** : une machine à moins de 3 500 € avec 16–24 Go de VRAM peut faire tourner un modèle 70B en Q4 (~40 Go) en offloadant les couches excédentaires en DDR5. Le débit sera d'environ 4–5 tokens/s en borne théorique (8–12 rapportés par la communauté, voir [[04-blueprints/scenario-a-dev-lab|Scénario A]]) plutôt que 15–40 tokens/s, mais c'est suffisant pour développer et tester.

## ⚠️ Pièges fréquents

- L'offloading et la **concurrence ne font pas bon ménage** : à 5 utilisateurs simultanés, chaque requête relit les couches restées en RAM, déjà bornées par la bande passante DDR5, ce qui effondre le débit global.
- Offloader sur SSD (au lieu de RAM) est possible mais 10× plus lent — à réserver au chargement initial, pas à l'inférence en temps réel.
- Croire que plus de RAM compense toujours : la capacité permet de charger le modèle, mais le débit reste borné par la bande passante de la RAM (~80–100 Go/s en DDR5 dual-channel), pas par sa taille.

## 📚 Pour comprendre en profondeur

- [[04-blueprints/scenario-a-dev-lab|🛠️ Scénario A : Le Labo Dev (CPU Offloading)]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]

## 🔗 Voir aussi

- [[00-lexique/pcie|PCIe]]
- [[00-lexique/ram|RAM]]
- [[00-lexique/vram|VRAM]]
- [[00-lexique/memory-bandwidth|Bande passante mémoire]]
