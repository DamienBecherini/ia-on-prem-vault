---
title: "🏢 Scénario B : L'Appliance PME (Mémoire Unifiée)"
description: Le blueprint idéal pour les PME. Comment servir une équipe de 10 à 50 personnes avec un modèle 70B en utilisant un Mac Studio ou un APU AMD.
sidebar:
  order: 2
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Votre client (une agence d'avocats, un cabinet médical, une PME) a besoin d'un assistant local capable de traiter des documents confidentiels. Le modèle retenu est un LLM lourd : soit un 70B dense quantifié (~40 Go de poids, l'étalon de capacité de ce blueprint), soit — plus rapide sur ce matériel — un MoE léger comme gpt-oss-120b (~70 Go, 34–38 t/s mesurés sur un APU 128 Go) ou un dense de 27–30B comme Qwen3.8-27B (~18 Go en Q4)[^6]. 

Comme vu dans le [[04-blueprints/scenario-a-dev-lab|Scénario A]], un PC classique s'effondre à cause du [[00-lexique/offloading|CPU Offloading]]. Acheter un serveur multi-GPU coûte très cher, fait le bruit d'un avion au décollage et consomme énormément d'électricité. La solution la plus élégante en 2026 est l'**Appliance à Mémoire Unifiée**.

---

## 🏗️ L'Architecture Matérielle

L'objectif est d'avoir une seule puce (SoC) où le CPU et le GPU piochent dans la même énorme réserve de mémoire.
Trois choix s'offrent à vous :

*   **Option Apple (Le standard du silence) :** Un Mac Studio M5 Max (jusqu'à 128 Go, 614 Go/s, à partir de 2 999 € TTC) ou M5 Ultra (jusqu'à 512 Go, 1,2 To/s, à partir de 6 599 € TTC) — la génération M4 Max / M3 Ultra n'est plus vendue depuis le 2026-08-25[^1][^3].
*   **Option PC x86 (La souveraineté Docker) :** Une station de travail basée sur l'APU AMD Ryzen AI Max PRO 400 ("Gorgon Halo") avec 192 Go de RAM — en précommande chez Framework à 6 799 $ pour une livraison en novembre 2026 ; la génération précédente à 128 Go (Ryzen AI Max+ 395) est affichée 3 889 € TTC mais en rupture au 2026-10-09[^4].
*   **Option NVIDIA (CUDA sans friction) :** Un DGX Spark 128 Go (≈ 6 950 $ au 2026-10-02, lancé à 3 999 $) ou sa déclinaison 64 Go à 4 999 $ chez les OEM à partir du 2026-10-23 — même bus 273 Go/s que Gorgon Halo, CUDA et FP4 natifs[^8].

> [!note] Au-delà de 128 Go
> Le Mac Studio M5 Ultra se configure jusqu'à 512 Go de mémoire unifiée (1,2 To/s, à partir de 6 599 € TTC en 96 Go, configuration 512 Go livrée fin octobre 2026) et se chaîne en cluster RDMA sur Thunderbolt 5 (jusqu'à quatre machines). Pour une PME, c'est l'option qui repousse le plus loin la limite « mémoire soudée » du verdict ci-dessous[^1][^3].

**Budget estimé (T4 2026) :** entre 3 900 € et plus de 8 000 € TTC selon la puce et la mémoire soudée — et en hausse : TrendForce relève encore +10 à 15 % par trimestre sur la DRAM contractuelle au T4 2026 et Framework annonce des hausses de prix mémoire sur toutes les capacités pendant six mois[^4][^5]. Les prix cités ici sont ceux d'octobre 2026 : à revérifier à l'achat.
**Avantages physiques :** Consommation électrique très faible (souvent moins de 150W en pleine charge), format compact, aucun bruit de ventilation excessif.

---

## ⚙️ La Stack Logicielle

Ici, la stack logicielle diffère selon le matériel choisi :

*   **Sur Mac Studio :** **MLX** (serveur `mlx_lm.server`, ou Ollama ≥ 0.40 qui l'utilise par défaut sur Apple Silicon) ou **llama.cpp** via Metal (port par défaut de `llama-server` passé à 9931 en octobre 2026)[^9]. Les deux exploitent la bande passante maximale de la mémoire unifiée.
*   **Sur AMD Gorgon Halo (Linux) :** llama.cpp (Vulkan ou ROCm) ou SGLang (image ROCm pour `gfx1151` depuis la 0.5.20), qui apporte les optimisations serveur comme le *Continuous Batching* ; vLLM sur ROCm reste à valider sur cette puce[^10].

### Les Performances Attendues
Puisque le modèle de 40 Go rentre intégralement dans la [[00-lexique/unified-memory|Mémoire unifiée]] (qui agit ici comme une immense [[00-lexique/vram|VRAM]]), les vitesses de génération sont excellentes et stables :
*   **Mac Studio (M5 Max, ~614 Go/s) :** borne théorique d'environ 15 [[00-lexique/tokens-per-second|tokens/s]] en phase de [[00-lexique/decoding|Decoding]] sur un 70B Q4 (~40 Go), calculée avec la formule du [[01-fondations/memory-bandwidth|chapitre bande passante]] à partir de la bande passante annoncée par Apple en août 2026[^1] — soit 10 à 15 t/s attendus en pratique, à confirmer par un benchmark publié.
*   **AMD Ryzen AI Max PRO 400 (~273 Go/s) :** de l'ordre de 5 tokens/s mesurés (4,7–4,9 t/s sur Llama 3.1 70B Q4_K_M, Strix Halo 128 Go, même bus)[^2][^6] — cohérent avec la borne théorique de ~6,8 t/s donnée par la formule.

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
4. Pointer les clients (Open WebUI, LiteLLM) vers la nouvelle IP — en versions à jour : LiteLLM ≥ 1.100.4 ou le dernier correctif de sa ligne (deux CVE LiteLLM sont au catalogue KEV de la CISA), et Open WebUI suivi au fil des releases, le projet ayant publié une série d'avis de sécurité de niveau High en septembre 2026 ; ne jamais figer une version[^7]

**RTO indicatif Blueprint B : < 45 minutes** avec une sauvegarde quotidienne à jour.

---

## 📚 Sources et Références

[^1]: Apple Newsroom, *Apple introduces new Mac Studio with M5 Max and M5 Ultra* (bande passante mémoire M5 Max 614 Go/s et M5 Ultra 1,2 To/s, capacités jusqu'à 128 Go et 512 Go, clustering Thunderbolt 5), 2026-08-25. [https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/)
[^2]: ServeTheHome & ignasivt (GitHub), *Strix Halo / Gorgon Halo 192GB Unified Memory Benchmarks* (Débit decoding attendu sur modèle dense 70B), Mai 2026. [https://www.servethehome.com/amd-reveals-ryzen-ai-max-pro-400-series-192gb-ram-for-ai-systems/](https://www.servethehome.com/amd-reveals-ryzen-ai-max-pro-400-series-192gb-ram-for-ai-systems/) · [https://github.com/ignasivt/strix-halo-guide](https://github.com/ignasivt/strix-halo-guide)
[^3]: Apple, *Mac Studio* — Apple Store France (M5 Max 36 Go à partir de 2 999 € TTC, M5 Max 64 Go 3 659 € TTC, M5 Ultra 96 Go à partir de 6 599 € TTC, option 512 Go « fin octobre »), relevé le 2026-10-09. [https://www.apple.com/fr/shop/buy-mac/mac-studio](https://www.apple.com/fr/shop/buy-mac/mac-studio)
[^4]: Framework, *The 192GB Framework Desktop is open for pre-order* (Ryzen AI Max+ PRO 495, 192 Go à 6 799 $, précommandes du 2026-09-30, livraisons novembre 2026, avertissement sur la hausse des prix mémoire), 30 septembre 2026. [https://frame.work/blog/192gb-framework-desktop-open-for-pre-order](https://frame.work/blog/192gb-framework-desktop-open-for-pre-order) · Framework, *Framework Desktop — AMD Ryzen AI Max+ 395* (128 Go 3 889 € TTC, en rupture), relevé le 2026-10-09. [https://frame.work/fr/fr/products/desktop-diy-amd-aimax300](https://frame.work/fr/fr/products/desktop-diy-amd-aimax300)
[^5]: TrendForce, communiqué du 30 septembre 2026 (prix contractuels DRAM en hausse de 10–15 % au T4 2026). [https://www.trendforce.com/presscenter/news/20260930-13258.html](https://www.trendforce.com/presscenter/news/20260930-13258.html)
[^6]: Qwen, *Qwen3.8-27B* (dense, Apache 2.0, contexte 262k ; Q4 via Ollama ≈ 18 Go), août 2026. [https://huggingface.co/Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) · Ollama, *qwen3.8*. [https://ollama.com/library/qwen3.8](https://ollama.com/library/qwen3.8) · ignasivt, *Strix Halo Guide* (gpt-oss-120b ≈ 70 Go, 34–38 tok/s ; Llama 3.1 70B Q4_K_M 4,7–4,9 tok/s sur Ryzen AI Max+ 395 128 Go), relu le 2026-10-10. [https://github.com/ignasivt/strix-halo-guide](https://github.com/ignasivt/strix-halo-guide)
[^7]: BerriAI, *GHSA-7hp6-4w63-5g45* (escalade `internal_user` → `proxy_admin` → exécution sur l'hôte, CVSS 9.9, corrigé 1.100.4 / 1.101.3 / 1.102.2 / 1.103.1), 2026-09-30. [https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45](https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45) · LiteLLM, *Version Support Policy*. [https://docs.litellm.ai/blog/version-support](https://docs.litellm.ai/blog/version-support) · Open WebUI, *Security Advisories* (série d'avis High publiés les 27–28 septembre 2026), consulté le 2026-10-10. [https://github.com/open-webui/open-webui/security/advisories](https://github.com/open-webui/open-webui/security/advisories)
[^8]: ServeTheHome, *NVIDIA DGX Spark 64GB Launched and Big 128GB GB10 Price Increases* (DGX Spark 128 Go ≈ 6 950 $, lancé à 3 999 $ ; version 64 Go à 4 999 $ via OEM dès le 2026-10-23), 2026-10-03. [https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/](https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/) · NVIDIA, *DGX Spark* — page produit (GB10, 128 Go LPDDR5x, ~273 Go/s), relue le 2026-10-09. [https://www.nvidia.com/en-us/products/workstations/dgx-spark/](https://www.nvidia.com/en-us/products/workstations/dgx-spark/) · NVIDIA Blog, *NVIDIA DGX Spark 64GB Gives Developers More Ways to Build and Scale Local AI* (même GB10, à partir de 4 999 $, modèles jusqu'à 100 B paramètres, OEM Acer, ASUS, Dell, Gigabyte, HP, MSI à partir du vendredi 23 octobre ; deux unités reliées en QSFP = 128 Go, modèles jusqu'à 200 B), 2 octobre 2026. [https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/](https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/)
[^9]: Ollama, *Release v0.40.0* (MLX utilisé par défaut sur Apple Silicon), 25 septembre 2026. [https://github.com/ollama/ollama/releases/tag/v0.40.0](https://github.com/ollama/ollama/releases/tag/v0.40.0) · ggml-org, *llama.cpp — Release b11521* (port par défaut de `llama-server` passé de 8080 à 9931), 9 octobre 2026. [https://github.com/ggml-org/llama.cpp/releases/tag/b11521](https://github.com/ggml-org/llama.cpp/releases/tag/b11521)
[^10]: SGLang Project, *Release v0.5.20* (image ROCm pour `gfx1151` Strix / Gorgon Halo), 18 septembre 2026. [https://github.com/sgl-project/sglang/releases/tag/v0.5.20](https://github.com/sgl-project/sglang/releases/tag/v0.5.20) · ignasivt, *Strix Halo Guide* (chemins llama.cpp Vulkan / ROCm vérifiés sur gfx1151), relu le 2026-10-09. [https://github.com/ignasivt/strix-halo-guide](https://github.com/ignasivt/strix-halo-guide)
