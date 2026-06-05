---
title: "🏢 Scénario B : L'Appliance PME (Mémoire Unifiée)"
description: Le blueprint idéal pour les PME. Comment servir une équipe de 10 à 50 personnes avec un modèle 70B en utilisant un Mac Studio ou un APU AMD.
sidebar:
  order: 2
last_modified: "2026-06-05"
---

Votre client (une agence d'avocats, un cabinet médical, une PME) a besoin d'un assistant local capable de traiter des documents confidentiels. Le modèle retenu est un LLM lourd (classe 70B quantifié, soit ~40 Go de poids). 

Comme vu dans le [[04-blueprints/scenario-a-dev-lab|Scénario A]], un PC classique s'effondre à cause du [[00-lexique/offloading|CPU Offloading]]. Acheter un serveur multi-GPU coûte très cher, fait le bruit d'un avion au décollage et consomme énormément d'électricité. La solution la plus élégante en 2026 est l'**Appliance à Mémoire Unifiée**.

---

## 🏗️ L'Architecture Matérielle

L'objectif est d'avoir une seule puce (SoC) où le CPU et le GPU piochent dans la même énorme réserve de mémoire.
Deux choix s'offrent à vous :

*   **Option Apple (Le standard du silence) :** Un Mac Studio M4 Max (128 Go) ou M3 Ultra (192 Go). 
*   **Option PC x86 (La souveraineté Docker) :** Une station de travail basée sur l'APU AMD Ryzen AI Max PRO 400 ("Gorgon Halo") avec 192 Go de RAM.

**Budget estimé (2026) :** Entre 3 700 € et 7 500 € (selon la puce et la quantité de mémoire soudée).
**Avantages physiques :** Consommation électrique très faible (souvent moins de 150W en pleine charge), format compact, aucun bruit de ventilation excessif.

---

## ⚙️ La Stack Logicielle

Ici, la stack logicielle diffère selon le matériel choisi :

*   **Sur Mac Studio :** Le moteur de référence est **llama.cpp** (ou son dérivé serveur natif **MLX Server** optimisé par Apple). Il permet d'exploiter la bande passante maximale via l'API graphique Metal.
*   **Sur AMD Gorgon Halo (Linux) :** Vous pouvez utiliser **vLLM** via la surcouche logicielle ROCm d'AMD, ce qui permet d'activer des optimisations serveurs comme le *Continuous Batching*.

### Les Performances Attendues
Puisque le modèle de 40 Go rentre intégralement dans la [[00-lexique/unified-memory|Mémoire unifiée]] (qui agit ici comme une immense [[00-lexique/vram|VRAM]]), les vitesses de génération sont excellentes et stables :
*   **Mac Studio (M4 Max, ~546 Go/s) :** Entre 10 et 15 [[00-lexique/tokens-per-second|tokens/s]] en phase de [[00-lexique/decoding|Decoding]][^1] — cohérent avec la borne théorique de ~13,6 t/s calculée dans [[01-fondations/memory-bandwidth|le chapitre bande passante]].
*   **AMD Ryzen AI Max PRO 400 (~273 Go/s) :** De l'ordre de 5 à 7 tokens/s selon les benchmarks disponibles[^2] — également cohérent avec la formule (borne théorique ~6,8 t/s).

---

## Le Piège du KV Cache Concurrent

> [!warning] KV Cache concurrent
> Si 40 Go de modèle tiennent largement dans 128 Go de mémoire, pourquoi ne pas se contenter d'une machine à 64 Go ? 
>
> La réponse est le **[[01-fondations/kv-cache-and-context|KV Cache]]**. Dans ce scénario, vous servez une **PME entière**.
> Si 5 employés envoient simultanément des documents PDF de 100 pages à l'assistant (RAG), le moteur d'inférence va devoir stocker le contexte de chaque utilisateur *en même temps*. 
> Sur un modèle 70B, le KV Cache pour 5 requêtes longues peut facilement engloutir **30 à 50 Go de mémoire dynamique supplémentaire** en un instant. Si vous dépassez la RAM physique totale (modèle + OS + requêtes), la machine plantera instantanément (Erreur OOM - *Out Of Memory*).

---

## 📋 Le Verdict de l'Architecte

### ✅ Quand utiliser ce Blueprint ?
*   C'est le **cœur de cible** de l'IA on-premise pour les PME.
*   Parfait pour un déploiement "sous le bureau" ou dans une petite baie de brassage non climatisée.
*   Excellent pour exécuter un assistant ou agent souverain local servant une dizaine de requêtes concurrentes modérées.

### ❌ Quand fuir ce Blueprint ?
*   **Si votre client a un besoin de croissance non prévisible.** La mémoire unifiée est **soudée** à la carte mère. Il est impossible de rajouter de la RAM dans un Mac Studio ou un APU Gorgon Halo après l'achat. Si le modèle métier de l'entreprise passe de 70B à 200B l'année suivante, il faudra jeter la machine et en racheter une.

Pour dépasser cette contrainte de capacité fixe et rester sur du matériel de bureau abordable, le prochain blueprint propose une approche évolutive : **[[04-blueprints/scenario-c-desktop-cluster|Le Cluster Bureau]]** — relier plusieurs machines via Thunderbolt.

---

## 🛡️ Sauvegarde et Reprise (DRP)

> [!warning] La mémoire unifiée est soudée — la donnée, elle, ne l'est pas
> En cas de panne matérielle d'un Mac Studio ou d'un APU Gorgon Halo, le remplacement prend plusieurs jours. Sauvegarder les données applicatives permet de reprendre le service sur une machine de prêt ou un cloud temporaire en moins d'une heure.

### Ce qu'il faut sauvegarder sur le Blueprint B

| Données | Emplacement typique | Fréquence |
| :-- | :-- | :-- |
| Base vectorielle (Qdrant / Chroma) | `/qdrant/storage/` ou volume Docker | Quotidien — snapshot API |
| Historiques de conversations (SQLite) | `~/.open-webui/data/` ou volume Docker | Quotidien ou horaire |
| Configuration Ollama / vLLM | `~/.ollama/` ou `config.yaml` | À chaque modification (Git) |
| Adaptateurs LoRA fine-tunés | Répertoire dédié | Après chaque session d'entraînement |
| Modèles de base (GGUF) | `~/.ollama/models/` | Non prioritaire — re-téléchargeable |

### Procédure de reprise minimale

1. Démarrer une instance temporaire (autre Mac, VM cloud souverain) avec Ollama
2. Restaurer la base vectorielle depuis le dernier snapshot
3. Restaurer l'historique SQLite
4. Pointer les clients (Open WebUI, LiteLLM) vers la nouvelle IP

**RTO indicatif Blueprint B : < 45 minutes** avec une sauvegarde quotidienne à jour.

---

## 📚 Sources et Références

[^1]: llmhardware.io, *Mac Studio M4 Max / M3 Ultra for LLMs* (Performances Llama 3 70B Q4_K_M avec MLX et allocation de mémoire Metal maximale), 2025-2026.
[^2]: ServeTheHome & ignasivt (GitHub), *Strix Halo / Gorgon Halo 192GB Unified Memory Benchmarks* (Débit decoding attendu sur modèle dense 70B), Mai 2026.