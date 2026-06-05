---
title: Quantification Q4
description: Format de quantification 4-bit le plus utilisé en pratique pour l'inférence locale — en particulier Q4_K_M dans l'écosystème GGUF/Ollama.
aliases:
  - Q4
  - Q4_K_M
  - 4-bit quantization
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Quantification où les poids sont compressés sur environ 4 bits par paramètre, divisant l'empreinte mémoire par ~4 par rapport au BF16 natif. Le format `Q4_K_M` est la variante la plus utilisée dans l'écosystème Ollama / llama.cpp.

> [!note] Contexte général
> Cette fiche couvre le format Q4 pratique. Pour les fondements mathématiques et les autres formats (Q8, AWQ, FP8), voir [[00-lexique/quantification|Quantification]].

## 📖 Définition détaillée

`Q4_K_M` signifie :
- **Q4** : 4 bits par paramètre (~0,5 octet effectif avec les métadonnées de blocs)
- **K** : méthode K-means qui regroupe les poids en clusters pour minimiser la perte de précision
- **M** : taille de bloc "medium" — compromis qualité/vitesse recommandé pour la plupart des usages

Empreintes VRAM typiques en Q4_K_M :

| Modèle | Q4_K_M | BF16 (référence) | Gain |
| :-- | :-- | :-- | :-- |
| 7B / 8B | ~5 Go | ~14 Go | ×2,8 |
| 14B | ~9 Go | ~28 Go | ×3,1 |
| 32B | ~20 Go | ~64 Go | ×3,2 |
| 70B | ~40 Go | ~140 Go | ×3,5 |

## 💡 Pourquoi c'est important en IA on-premise

Q4_K_M est le format qui permet à un utilisateur avec une machine à 3 500 € (16–24 Go VRAM) de faire tourner un modèle 70B avec [[00-lexique/offloading|offloading]], ou à un APU 128 Go de charger confortablement un 70B avec de la marge pour le [[00-lexique/kv-cache|KV Cache]].

C'est aussi le format de téléchargement par défaut dans Ollama : `ollama pull llama3.1:70b` télécharge automatiquement un Q4_K_M.

## ⚠️ Pièges fréquents

- Q4 n'est pas adapté à toutes les tâches : sur des usages sensibles (édition de code précise, extraction médicale ou juridique, agents custodiens), une quantification trop agressive peut rater des nuances ou produire des outputs partiellement corrects. Préférer Q6_K ou Q8 si la VRAM le permet.
- Ne pas confondre avec Q4_0 (plus simple, qualité inférieure à Q4_K_M) ou Q4_K_S (plus léger, légèrement moins précis que K_M).
- L'empreinte indiquée est celle des **poids seuls** : le KV Cache s'ajoute en fonction de la longueur du contexte.

## 📚 Pour comprendre en profondeur

- [[01-fondations/quantization-4bit-8bit|🗜️ La Quantification 4-bit & 8-bit]] — mécanisme mathématique complet
- [[04-blueprints/scenario-a-dev-lab|🛠️ Scénario A]] — exemple concret d'usage Q4 avec offloading

## 🔗 Voir aussi

- [[00-lexique/quantification|Quantification]] — vue d'ensemble (Q8, AWQ, FP8)
- [[00-lexique/gguf|GGUF]] — format de fichier qui embarque la quantification
- [[00-lexique/offloading|Offloading]]
