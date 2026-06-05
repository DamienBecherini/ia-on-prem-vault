---
title: "🛠️ Scénario A : Le Labo Dev (PC GPU ou mémoire unifiée)"
description: Le blueprint pour s'initier à l'IA locale à moindre coût. PC RTX avec CPU offloading, ou laptop/station à mémoire unifiée pour un meilleur confort solo.
sidebar:
  order: 1
last_modified: "2026-06-04"
---

Vous êtes un développeur seul, un passionné (*homelab*) ou une TPE qui souhaite tester des agents autonomes sans investir immédiatement 5 000 à 10 000 € dans une machine IA dédiée.

Ce premier blueprint couvre deux réalités du labo IA solo :

1. **Option A1 — PC classique avec GPU 24 Go :** excellent pour les modèles 8B-14B, mais pénalisé par le **[[00-lexique/offloading|CPU Offloading]]** dès qu'un modèle dépasse la VRAM.
2. **Option A2 — Laptop ou station à mémoire unifiée 64-128 Go :** souvent le meilleur confort pour un développeur IA solo en 2026, car les gros modèles quantifiés peuvent tenir dans une mémoire unique sans aller-retour PCIe permanent.

---

## 🏗️ L'Architecture Matérielle

### Option A1 — PC classique avec GPU 24 Go

*   **Machine :** Une tour PC standard.
*   **Processeur (CPU) :** Un processeur moderne (AMD Ryzen 9 ou Intel Core i9).
*   **Mémoire Système ([[00-lexique/ram|RAM]]) :** 64 Go de RAM DDR5 (très important, la DDR4 étoufferait totalement les performances).
*   **Carte Graphique (GPU) :** Une seule carte NVIDIA grand public avec 24 Go de [[00-lexique/vram|VRAM]] (ex: une RTX 3090 d'occasion, une RTX 4090 ou la RTX 5090).

**Budget estimé (2026) :** Entre 1 500 € et 3 500 € (selon le choix du GPU).

### Option A2 — Laptop / station à mémoire unifiée 64-128 Go

*   **Machine :** MacBook Pro Max, Mac Studio d'entrée de gamme, ou mini-station APU à grande mémoire unifiée.
*   **Mémoire :** 64 à 128 Go de [[00-lexique/unified-memory|mémoire unifiée]].
*   **Moteur :** MLX / llama.cpp / Ollama selon la plateforme.
*   **Cas idéal :** développeur solo qui veut tester des modèles 30B-70B quantifiés avec un confort interactif supérieur au CPU offloading DDR5.

**Budget estimé (2026) :** souvent entre 3 000 € et 6 000 € selon la configuration. Plus cher qu'un PC gamer d'occasion, mais beaucoup plus cohérent si votre objectif est de manipuler régulièrement de gros modèles en local.

---

## ⚙️ La Stack Logicielle

*   **Moteur d'inférence :** **Ollama** ou **llama.cpp** compilé avec le support CUDA.
*   **Format du modèle :** [[00-lexique/gguf|GGUF]] en [[00-lexique/quantification-q4|Quantification Q4_K_M]].

Sur cette machine, un modèle de la classe **8B à 14B** (ex: *Llama 3.1 8B* ou *Qwen 2.5 14B*) tiendra entièrement dans les 24 Go de VRAM de la carte graphique. Vous obtiendrez des performances élevées — typiquement **50 à 100 [[00-lexique/tokens-per-second|tokens/s]]** selon le modèle, la quantification et le moteur utilisé.

Mais que se passe-t-il si vous voulez tester un modèle intelligent lourd, classe GPT-4, comme **Llama 3.1 70B** ? 

---

## 🧠 Le Mécanisme : Le CPU Offloading

Un modèle 70B quantifié en Q4 pèse environ **40 Go**. Il est physiquement impossible de le faire rentrer dans une carte de 24 Go. C'est ici qu'intervient le **CPU Offloading** (déchargement vers le processeur).

Plutôt que d'abandonner en affichant une erreur *Out Of Memory (OOM)*, le moteur `llama.cpp` va découper le modèle :
1.  Il charge autant de couches du réseau de neurones que possible dans la **VRAM** ultra-rapide du GPU (environ 20 à 22 Go pour garder de la marge pour le contexte).
2.  Il place les couches restantes (environ 18 à 20 Go) dans la **RAM système** de votre carte mère.

### ⚠️ Le Mur de la Performance
Lors de la génération de la réponse ([[00-lexique/decoding|Decoding]]), les données doivent faire des allers-retours constants entre la RAM, le processeur et la carte graphique via le bus PCIe. 

Comme expliqué dans le chapitre sur [[01-fondations/unified-memory-vs-ram-vs-vram|la VRAM vs RAM]], la RAM classique est physiquement bridée à environ 80-100 Go/s. Le résultat est immédiat : la vitesse de génération s'effondre.
Sur une RTX 4090 couplée à 64 Go de DDR5, un modèle 70B en CPU Offloading génèrera généralement **entre 2 et 5 tokens par seconde**[^1][^2] — ordre de grandeur cohérent avec l'analyse de [[01-fondations/memory-bandwidth|la bande passante mémoire]] : DDR5 ≈ 100 Go/s pour un modèle de ~40 Go donne une borne théorique de ~2,5 t/s. C'est lisible (légèrement inférieur à la vitesse de lecture humaine), mais inadapté pour servir une application réactive ou plusieurs utilisateurs simultanés.

### Pourquoi l'option mémoire unifiée change l'expérience

Sur une machine à [[00-lexique/unified-memory|mémoire unifiée]], les poids du modèle ne sont pas coupés entre une VRAM rapide et une RAM lente reliées par PCIe. CPU, GPU et accélérateurs partagent le même pool mémoire. La bande passante reste inférieure à celle d'une grosse carte NVIDIA haut de gamme, mais elle évite le pire piège du PC classique : les allers-retours constants entre RAM DDR5 et VRAM.

Pour un développeur seul, cela fait souvent la différence entre *"je peux tester un 70B quantifié pour raisonner tranquillement"* et *"je regarde les tokens arriver un par un"*.

---

## 📋 Le Verdict de l'Architecte

### ✅ Quand utiliser ce Blueprint ?
*   Pour **apprendre** et prototyper des applications (RAG, Agents) sur de petits modèles (8B/14B) qui tiennent en VRAM à 100%.
*   Pour exécuter des **tâches de fond** (batch processing, résumé nocturne de longs documents) avec un modèle 70B, où l'utilisateur n'attend pas la réponse en direct devant son écran.
*   Pour un développeur solo équipé d'une machine à mémoire unifiée 64-128 Go qui veut tester des modèles plus gros sans construire une appliance serveur.

### ❌ Quand fuir ce Blueprint ?
*   Si vous avez besoin de déployer une API interne pour **plus de 2 collaborateurs simultanés**. Le CPU Offloading supporte très mal la concurrence : au-delà d'une requête à la fois, le temps de réponse s'écroule.
*   Si le confort d'utilisation de vos employés est une priorité absolue.

Pour un usage PME quotidien avec des modèles 70B sans subir cette lourde pénalité de transfert, il faut changer de paradigme matériel et passer d'un poste solo à une machine de service. C'est l'objet du prochain blueprint : **L'Appliance Unifiée** (Mémoire Unifiée APU/Mac).

---

## 📚 Sources et Références

[^1]: Particula Tech & Reddit Community Benchmarks (r/LocalLLaMA), *Hybrid Inference Llama 3 70B on RTX 4090 24GB + 64GB RAM* (Vitesse de décodage estimée à ~2-5 tokens/s selon configuration DDR5), 2024-2026.
[^2]: Documentation locale Ollama, *Ollama System Requirements 2026: CPU-only and Partial GPU Offloading penalties* (Baisse de performance de 5x à 10x lors de l'offloading RAM), 2026.