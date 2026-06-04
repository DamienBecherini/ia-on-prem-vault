---
title: RAM
description: Mémoire vive système, second choix pour l'inférence LLM quand la VRAM est insuffisante.
aliases:
  - Random Access Memory
  - Mémoire vive
tags:
  - lexique
  - materiel
---

## 📝 Définition courte

Mémoire principale de la machine, utilisée par le CPU pour l'OS et les applications. En IA locale, elle sert de débordement quand la VRAM est insuffisante pour charger l'intégralité d'un modèle.

## 📖 Définition détaillée

Une barrette DDR5-5600 en dual-channel offre une bande passante d'environ **85–90 Go/s** en conditions idéales. C'est environ 15× moins qu'une VRAM GDDR6X (1 000+ Go/s) et 30× moins qu'une HBM3 de puce datacenter.

En inférence LLM, cette différence se traduit directement en débit de génération : un modèle 7B entièrement en VRAM génère 40–60 tokens/s ; le même modèle partiellement en RAM tombe souvent à 5–15 tokens/s, car chaque couche doit transiter via PCIe (~30–60 Go/s effectifs).

La RAM reste utile dans trois cas :

| Cas | Usage |
| :-- | :-- |
| **CPU offloading** (llama.cpp) | Partie du modèle en RAM, partie en VRAM — compromis capacité/débit |
| **Mémoire unifiée** (APU Apple/AMD) | La RAM *est* la VRAM — pas de copie PCIe |
| **Préchargement** | Le fichier GGUF est lu depuis le SSD et mis en page cache RAM avant d'être transféré au GPU |

## 💡 Pourquoi c'est important en IA on-premise

Le Scénario A (Labo Dev) repose explicitement sur l'offloading RAM pour faire tourner un modèle 70B sur une machine à 3 500 € sans GPU dédié puissant. C'est le point d'entrée accessible pour un développeur solo.

## ⚠️ Pièges fréquents

- Croire que 128 Go de RAM remplace 128 Go de VRAM : le débit est 10–30× inférieur.
- Ignorer le **page cache** : lire un GGUF de 140 Go depuis un SSD remplit la RAM disponible avant même le début de l'inférence, risquant d'OOM sur les machines serrées.
- Oublier que l'offloading est catastrophique en **concurrence** : chaque utilisateur supplémentaire multiplie les transferts RAM↔GPU.

## 📚 Pour comprendre en profondeur

- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]
- [[04-blueprints/scenario-a-dev-lab|🛠️ Scénario A : Le Labo Dev (CPU Offloading)]]

## 🔗 Voir aussi

- [[00-lexique/vram|VRAM]]
- [[00-lexique/offloading|Offloading]]
- [[00-lexique/pcie|PCIe]]
