---
title: "⚙️ Moteurs d'Inférence : vLLM, Ollama et TensorRT-LLM"
description: Comparatif des moteurs de déploiement locaux en 2026. Quand utiliser GGUF et llama.cpp sur Mac, et quand basculer sur vLLM ou TensorRT-LLM en production.
sidebar:
  order: 1
last_modified: "2026-06-04"
---

> [!tip] En bref
> Ollama simplifie les tests locaux en quelques minutes. vLLM optimise le débit en production multi-utilisateurs. TensorRT-LLM pousse les GPU NVIDIA au maximum sur datacenter. Le bon moteur dépend de votre usage, pas du modèle.

Avoir les poids d'un grand [[00-lexique/llm|LLM]] et un serveur puissant ne suffit pas. Pour utiliser l'IA, il faut un **moteur d'inférence** capable de charger les poids en [[00-lexique/vram|VRAM]], de gérer le [[00-lexique/kv-cache|KV Cache]] et d'exécuter les calculs matriciels. 

En 2026, l'écosystème s'est fortement spécialisé. Le choix du moteur dicte les performances en [[00-lexique/tokens-per-second|tokens/s]], le temps de réponse initial ([[00-lexique/ttft|TTFT]]) et la capacité à encaisser des requêtes concurrentes.

---

## 1. llama.cpp & Ollama : Les rois du poste de travail

[Ollama](https://ollama.com/) est devenu le standard de fait pour tester des modèles rapidement — un benchmark communautaire du T1 2026 estimait son audience à plus de 50 millions de téléchargements mensuels[^1]. Sous le capot, Ollama repose principalement sur le moteur **llama.cpp**, écrit en C/C++ pur.

### 🌟 Les forces
*   **Polyvalence matérielle :** Optimisé pour exploiter la mémoire unifiée des Mac Studio, gérer l'[[00-lexique/offloading|offloading]] entre RAM et GPU sur les postes modestes, et s'exécuter sur presque n'importe quel CPU.
*   **Format [[00-lexique/gguf|GGUF]] :** Utilise des formats de [[00-lexique/quantification|quantification]] agressifs (ex: `Q4_K_M`), permettant de faire tenir des modèles massifs dans une VRAM très limitée sans dépendances complexes[^2].
*   **Simplicité :** Un seul fichier exécutable, une commande `ollama run` et une API compatible OpenAI prête à l'emploi.

### ⚠️ Les limites (Le mur de la production)
L'erreur classique est de déployer Ollama pour servir une application PME avec plusieurs utilisateurs simultanés. Conçu pour le traitement séquentiel, l'architecture sous-jacente s'effondre sous forte concurrence. Au-delà de 5 à 10 utilisateurs simultanés, la latence explose (les requêtes passant souvent de quelques secondes à plus d'une minute)[^1].

---

## 2. vLLM : Le standard de production

[vLLM](https://github.com/vllm-project/vllm) est le moteur Python/C++ open-source de référence pour l'inférence haut débit. Pensé pour les serveurs équipés de puces NVIDIA (et AMD ROCm), il est conçu pour maximiser l'utilisation du GPU sous forte charge.

### 🌟 Les forces
*   **[[00-lexique/pagedattention|PagedAttention]] :** vLLM a popularisé cette technique qui gère la mémoire du KV Cache par blocs (comme la mémoire virtuelle d'un OS). Cela réduit la fragmentation mémoire de ~60% à moins de 4% et permet de grouper massivement les requêtes (*Continuous Batching*)[^3].
*   **Haut débit concurrent :** Sur des architectures multi-utilisateurs, vLLM peut délivrer un débit global nettement supérieur à Ollama en charge concurrente — les comparatifs communautaires citent des facteurs de ×5 à ×16 selon la configuration et le modèle[^1][^4].
*   **Support des formats de pointe :** Il gère la quantification de production (FP8, AWQ) via des kernels nativement optimisés pour les architectures NVIDIA Hopper et Blackwell, et gère nativement le [[00-lexique/tensor-parallelism|Tensor Parallelism]] en [[00-lexique/multi-gpu|multi-GPU]][^5].

### ⚠️ Les limites
vLLM n'est pas conçu pour faire de l'offloading sur RAM CPU classique, ni pour le silicium Apple. Il requiert un environnement matériel robuste (GPU dédiés) et une configuration plus fine des paramètres serveurs. 

---

## 3. TensorRT-LLM : L'accélération extrême NVIDIA

[TensorRT-LLM](https://nvidia.github.io/TensorRT-LLM/) est le SDK officiel de NVIDIA pour tirer le maximum physique de ses propres GPU. Il compile le modèle dans un format propriétaire ultra-optimisé (un "engine").

### 🌟 Les forces
*   **Plafond de performance :** Il bat souvent tous les autres moteurs sur les GPU Datacenter (H100, B200) grâce à des techniques comme le *Flash-Decoding*.
*   **FP4 Natif :** Sur les nouvelles puces Blackwell (B200, RTX 5090), TensorRT-LLM supporte nativement le format FP4 pour diviser par deux l'empreinte VRAM par rapport au FP8, tout en conservant une précision de classe Datacenter[^6].
*   **Parallélisme massif :** Il orchestre parfaitement les graphes d'exécution sur des nœuds multi-GPU connectés par [[00-lexique/nvlink|NVLink]].

### ⚠️ Les limites
La compilation d'un moteur TensorRT est lourde (*Ahead-of-Time*), très stricte sur la génération physique du GPU cible, et la courbe d'apprentissage est beaucoup plus ardue que celle de vLLM.

---

## 📋 Le Conseil de l'Architecte

Pour un projet d'agent on-premise déployé chez des clients, le choix du moteur dépend purement du scénario d'architecture :

1.  **Cas d'usage "Copilote Local" (Un utilisateur, poste de bureau) :** 
    Choisissez **Ollama / llama.cpp**. Le support natif des modèles `GGUF` en [[00-lexique/quantification-q4|Q4]] sur Mac ou petit PC Windows permet une excellente réactivité sans infrastructure serveur.
2.  **Cas d'usage "Appliance PME" (10-50 utilisateurs, serveur GPU) :** 
    Basculez **impérativement sur vLLM**. PagedAttention et le continuous batching garantissent que l'IA ne s'effondrera pas lorsque cinq collaborateurs lanceront des requêtes RAG en même temps. Utilisez des poids en précision **AWQ ou FP8**.
3.  **Cas d'usage "Datacenter Souverain" (Gros volume, multi-nœuds) :**
    Utilisez **TensorRT-LLM** derrière le serveur Triton de NVIDIA. C'est le moyen le plus efficace d'amortir le coût des accélérateurs professionnels.

---

## 📚 Sources et Références

[^1]: Particula Tech, *Ollama vs vLLM: Which LLM Server Actually Fits in 2026* (benchmark communautaire, estimation d'audience et limites de concurrence), Mars 2026.
[^2]: J. Wang et al., *Which Quantization Should I Use? A Unified Evaluation of llama.cpp Quantization* (arXiv:2601.14277, GGUF formats), Janvier 2026.
[^3]: Woosuk Kwon et al., *Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP 2023).
[^4]: Ayi NEDJIMI Consultants, *LLM Local 2026 : Ollama vs LM Studio vs vLLM* (article de blog, comparaison d'architectures, Continuous Batching), Février 2026.
[^5]: vLLM Project Documentation & Spheron Blog, *vLLM Production Deployment 2026: Multi-GPU Tensor Parallel + FP8* (Model Runner V2, Hopper/Blackwell support), Mai 2026.
[^6]: NVIDIA, *TensorRT-LLM Documentation* (FP4 Support, Blackwell optimization, DeepSeek-R1 performance records), Mai 2026.