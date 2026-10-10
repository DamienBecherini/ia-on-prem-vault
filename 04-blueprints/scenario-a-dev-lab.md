---
title: "🛠️ Scénario A : Le Labo Dev (PC GPU ou mémoire unifiée)"
description: Le blueprint pour s'initier à l'IA locale à moindre coût. PC RTX avec CPU offloading, ou laptop/station à mémoire unifiée pour un meilleur confort solo.
sidebar:
  order: 1
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
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
*   **Mémoire Système ([[00-lexique/ram|RAM]]) :** 64 Go de RAM DDR5 (indispensable pour l'offloading, la DDR4 étoufferait totalement les performances ; à acheter tôt : les prix DRAM augmentent chaque trimestre depuis début 2026 et une pénurie est anticipée pour 2027)[^4].
*   **Carte Graphique (GPU) :** Une seule carte NVIDIA grand public avec 24 Go de [[00-lexique/vram|VRAM]] ou plus (ex : une RTX 3090 ou 4090 d'occasion ; la RTX 5090 32 Go, introuvable au prix public et vendue 5 000 $ et plus depuis septembre 2026, sort de l'enveloppe d'un labo — l'offre GeForce 24 Go+ neuve est rare au T4 2026)[^3].

**Budget estimé (T4 2026) :** entre 1 500 € et 2 500 € avec une RTX 3090/4090 d'occasion ; au-delà de 6 000 € avec une RTX 5090 neuve au prix constaté — et des barrettes DDR5 dont le prix monte chaque trimestre (TrendForce : +10 à 15 % par trimestre sur la DRAM au T4 2026)[^3][^4]. Les 64 Go de DDR5 et le GPU 24 Go d'occasion sont les deux postes qui bougent : achetez-les tôt.

### Option A2 — Laptop / station à mémoire unifiée 64-128 Go

*   **Machine :** MacBook Pro Max, Mac Studio d'entrée de gamme, ou mini-station APU à grande mémoire unifiée. Options nommées au T4 2026 : Mac mini M5 Pro 64 Go (307 Go/s, Thunderbolt 5) en entrée de gamme, Mac Studio M5 Max 64 Go (460 à 614 Go/s selon le GPU, 3 659 € TTC), Framework Desktop 64 Go (2 209 € TTC, souvent en rupture) ou DGX Spark 64 Go (4 999 $ chez les OEM à partir du 2026-10-23, CUDA natif)[^8][^9][^10].
*   **Mémoire :** 64 à 128 Go de [[00-lexique/unified-memory|mémoire unifiée]].
*   **Moteur :** MLX (moteur par défaut d'Ollama ≥ 0.40 sur Apple Silicon ; alternative expérimentale Splash pour Qwen3.8) / llama.cpp (port par défaut 9931 depuis octobre 2026) / Ollama selon la plateforme[^11].
*   **Cas idéal :** développeur solo qui veut tester des modèles 30B-70B quantifiés avec un confort interactif supérieur au CPU offloading DDR5.

**Budget estimé (T4 2026) :** entre 2 200 € (Framework Desktop 64 Go, souvent en rupture) et 3 700 € (Mac Studio M5 Max 64 Go, 3 659 € TTC) pour 64 Go ; de 3 900 € à 7 000 € pour 128 Go (Framework 128 Go, Mac Studio M5 Max 128 Go, DGX Spark 128 Go)[^8][^9][^10]. Plus cher qu'un PC gamer d'occasion, mais beaucoup plus cohérent si votre objectif est de manipuler régulièrement de gros modèles en local. La mémoire soudée suit la hausse de la DRAM : les prix relevés en octobre 2026 sont à revérifier à l'achat[^4].

---

## ⚙️ La Stack Logicielle

*   **Moteur d'inférence :** **Ollama** ou **llama.cpp** compilé avec le support CUDA.
*   **Format du modèle :** [[00-lexique/gguf|GGUF]] en [[00-lexique/quantification-q4|Quantification Q4_K_M]].

Sur cette machine, un modèle de la classe **8B à 30B** (ex : *Qwen3.8-27B* ≈ 18 Go en Q4, *Granite 4.2 8B*, ou un MoE léger comme *Nemotron 3.5 Lightning 30B-A3B* ≈ 22 Go en NVFP4) tiendra entièrement dans les 24 Go de VRAM de la carte graphique[^5][^6]. Qwen3.8-27B (Apache 2.0, 262k de contexte, vision et outils) est le modèle de référence 24 Go depuis août 2026 ; Meta publie *Muse Glimmer 30B* (Apache 2.0) avec des paliers VRAM explicites — 64 Go en pleine précision, 32 Go et 24 Go en K-Quant[^7]. Vous obtiendrez des performances élevées — typiquement **50 à 100 [[00-lexique/tokens-per-second|tokens/s]]** pour un 8B–14B, 30 à 60 t/s pour un 27B Q4 — davantage avec le décodage spéculatif (Meta annonce ≈ 230 t/s sur RTX 5090 pour Muse Glimmer 30B avec DFlash, chiffre constructeur)[^7].

Mais que se passe-t-il si vous voulez tester un modèle lourd de 70B dense (**Llama 3.3 70B**, encore très répandu) ou un MoE de 120B comme **gpt-oss-120b**[^12] ? 

---

## 🧠 Le Mécanisme : Le CPU Offloading

Un modèle 70B quantifié en Q4 pèse environ **40 Go**. Il est physiquement impossible de le faire rentrer dans une carte de 24 Go. C'est ici qu'intervient le **CPU Offloading** (déchargement vers le processeur).

Plutôt que d'abandonner en affichant une erreur *Out Of Memory (OOM)*, le moteur `llama.cpp` va découper le modèle :
1.  Il charge autant de couches du réseau de neurones que possible dans la **VRAM** ultra-rapide du GPU (environ 20 à 22 Go pour garder de la marge pour le contexte).
2.  Il place les couches restantes (environ 18 à 20 Go) dans la **RAM système** de votre carte mère.

### ⚠️ Le Mur de la Performance
Lors de la génération de la réponse ([[00-lexique/decoding|Decoding]]), les données doivent faire des allers-retours constants entre la RAM, le processeur et la carte graphique via le bus PCIe. 

Comme expliqué dans le chapitre sur [[01-fondations/unified-memory-vs-ram-vs-vram|la VRAM vs RAM]], la RAM classique est physiquement bridée à environ 80-100 Go/s. Le résultat est immédiat : la vitesse de génération s'effondre.
Sur une RTX 4090 couplée à 64 Go de DDR5, un modèle 70B Q4 en CPU Offloading génèrera **entre 4 et 12 tokens par seconde** selon la part de couches déchargées et la RAM : borne théorique de ~4–5 t/s si la moitié des poids transite par la DDR5 (~100 Go/s, voir [[01-fondations/memory-bandwidth|la bande passante mémoire]] — la borne de ~2,5 t/s suppose que tout le modèle passe par la RAM), 8–12 t/s rapportés par des retours communautaires non vérifiés ; le mécanisme (option `-ngl`, couches GPU vs CPU) est documenté par llama.cpp et Ollama[^1][^2]. C'est lisible (légèrement inférieur à la vitesse de lecture humaine), mais inadapté pour servir une application réactive ou plusieurs utilisateurs simultanés.

### Pourquoi l'option mémoire unifiée change l'expérience

Sur une machine à [[00-lexique/unified-memory|mémoire unifiée]], les poids du modèle ne sont pas coupés entre une VRAM rapide et une RAM lente reliées par PCIe. CPU, GPU et accélérateurs partagent le même pool mémoire. La bande passante reste inférieure à celle d'une grosse carte NVIDIA haut de gamme (RTX 5090 : 1,8 To/s ; Mac Studio M5 Max : 614 Go/s, M5 Ultra : 1,2 To/s)[^13], mais elle évite le pire piège du PC classique : les allers-retours constants entre RAM DDR5 et VRAM.

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

[^1]: ggml-org, *llama.cpp — llama-server README* (option `-ngl` / `--n-gpu-layers` : nombre de couches placées en VRAM, le reste calculé sur CPU), relu le 2026-10-10. [https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
[^2]: Ollama Documentation, *FAQ — GPU layer offloading and partial CPU inference* (Pénalité de performance lors de l'offloading RAM), 2026. [https://docs.ollama.com/faq](https://docs.ollama.com/faq)
[^3]: Tom's Hardware, *Nvidia's RTX 5090 vanishes from online retail in the US — third-party sellers now demand as much as $9,500* (MSRP 1 999 $), 14 septembre 2026. [https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu](https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu)
[^4]: TrendForce, communiqué du 30 septembre 2026 (prix contractuels DRAM en hausse de 10–15 % au T4 2026). [https://www.trendforce.com/presscenter/news/20260930-13258.html](https://www.trendforce.com/presscenter/news/20260930-13258.html)
[^5]: Qwen, *Qwen3.8-27B* (dense, Apache 2.0, contexte 262k, vision et outils ; BF16 ≈ 56 Go, Q4 via Ollama ≈ 18 Go), août 2026. [https://huggingface.co/Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) · Ollama, *qwen3.8*. [https://ollama.com/library/qwen3.8](https://ollama.com/library/qwen3.8)
[^6]: NVIDIA, *Nemotron-3.5-Lightning-30B-A3B* (BF16 / NVFP4 ≈ 22 Go / GGUF, licence OpenMDW 1.1), août 2026. [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16)
[^7]: Meta, *Muse Glimmer 30B* (Apache 2.0, 29,6B dont encodeur vision ; paliers 64 Go pleine précision, 32 Go K-Quant-Dynamic, 24 Go K-Quant-17GB ; 74,9 tok/s sans spéculation et 233,4 tok/s avec DFlash sur RTX 5090, chiffres constructeur), août 2026, relu le 2026-10-10. [https://huggingface.co/meta-models/Muse-Glimmer-30B](https://huggingface.co/meta-models/Muse-Glimmer-30B)
[^8]: Apple, *Mac Studio* — Apple Store France (Mac Studio M5 Max 64 Go 3 659 € TTC), relevé le 2026-10-09. [https://www.apple.com/fr/shop/buy-mac/mac-studio](https://www.apple.com/fr/shop/buy-mac/mac-studio) · Apple Newsroom, *Apple unveils a more powerful Mac mini featuring the all-new M6 and M5 Pro* (Mac mini M5 Pro : jusqu'à 64 Go, 307 Go/s, Thunderbolt 5), août 2026. [https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/](https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/)
[^9]: Framework, *Framework Desktop — AMD Ryzen AI Max+ 395* (64 Go 2 209 € TTC, 128 Go 3 889 € TTC, en rupture), relevé le 2026-10-09. [https://frame.work/fr/fr/products/desktop-diy-amd-aimax300](https://frame.work/fr/fr/products/desktop-diy-amd-aimax300)
[^10]: ServeTheHome, *NVIDIA DGX Spark 64GB Launched and Big 128GB GB10 Price Increases* (DGX Spark 128 Go ≈ 6 950 $, lancé à 3 999 $ ; version 64 Go à 4 999 $ via OEM dès le 2026-10-23), 2026-10-03. [https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/](https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/) · NVIDIA, *DGX Spark* — page produit, relue le 2026-10-09. [https://www.nvidia.com/en-us/products/workstations/dgx-spark/](https://www.nvidia.com/en-us/products/workstations/dgx-spark/) · NVIDIA Blog, *NVIDIA DGX Spark 64GB Gives Developers More Ways to Build and Scale Local AI* (même GB10, à partir de 4 999 $, modèles jusqu'à 100 B paramètres, OEM Acer, ASUS, Dell, Gigabyte, HP, MSI à partir du vendredi 23 octobre ; deux unités reliées en QSFP = 128 Go, modèles jusqu'à 200 B), 2 octobre 2026. [https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/](https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/)
[^11]: Ollama, *Release v0.40.0* (MLX utilisé par défaut sur Apple Silicon), octobre 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0) · ggml-org, *llama.cpp — Release b11521* (port par défaut de `llama-server` passé de 8080 à 9931), 9 octobre 2026. [https://github.com/ggml-org/llama.cpp/releases/tag/b11521](https://github.com/ggml-org/llama.cpp/releases/tag/b11521) · incoai, *Splash* (moteur Metal expérimental, M3+ et ≥ 36 Go, Qwen3.8 ; débits annoncés par l'éditeur, non vérifiés indépendamment), 18 septembre 2026. [https://github.com/incoai/splash](https://github.com/incoai/splash)
[^12]: OpenAI, *gpt-oss-120b* (MoE 117B, 5,1B actifs, MXFP4, Apache 2.0 ; ≈ 60–70 Go), août 2025, relu le 2026-10-09. [https://huggingface.co/openai/gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b)
[^13]: Apple Newsroom, *Apple introduces new Mac Studio with M5 Max and M5 Ultra* (M5 Max 614 Go/s, M5 Ultra 1,2 To/s), 25 août 2026. [https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/) · NVIDIA, *GeForce RTX 5090* (32 Go GDDR7, bus 512-bit). [https://www.nvidia.com/fr-fr/geforce/graphics-cards/50-series/rtx-5090/](https://www.nvidia.com/fr-fr/geforce/graphics-cards/50-series/rtx-5090/)
