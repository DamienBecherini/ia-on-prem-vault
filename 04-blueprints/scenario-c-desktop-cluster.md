---
title: "🖥️ Scénario C : Le Cluster Bureau (Exo & Thunderbolt)"
description: Le blueprint de l'évolutivité. Relier plusieurs Mac Mini ou PC compacts via Thunderbolt pour exécuter des modèles massifs inaccessibles sur une seule machine.
sidebar:
  order: 3
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Le [[04-blueprints/scenario-b-sme-appliance|Scénario B]] (l'Appliance) a un défaut majeur : sa mémoire est figée. Si le besoin de votre client évolue et qu'il souhaite déployer un modèle [[00-lexique/moe|MoE]] colossal de plus de 400 milliards de paramètres (nécessitant plus de 300 Go de mémoire), seule une station à mémoire unifiée haut de gamme peut l'accueillir — le Mac Studio M5 Ultra, configurable jusqu'à 512 Go (1,2 To/s), à partir de 6 599 € TTC en 96 Go, configuration 512 Go livrée fin octobre 2026 — et aucune ne dépasse 512 Go[^2].

Avant 2025, la seule solution était de louer un serveur cloud ou d'acheter une baie Datacenter hors de prix. Aujourd'hui, l'architecture logicielle permet de fusionner plusieurs petites machines abordables : c'est le **Cluster de Bureau**.

---

## 🏗️ L'Architecture Matérielle

L'idée est de créer une "ferme" de calcul posée sur une étagère.
*   **Les Nœuds :** 4 à 8 machines compactes. Le standard en 2026 pour ce scénario est le **Mac mini M5 Pro** (64 Go de mémoire unifiée, 307 Go/s, Thunderbolt 5, à partir de 1 999 € TTC en 24 Go ; il remplace le Mac mini M4 Pro depuis le 2026-08-25) — ou, plus cher mais plus rapide, le Mac Studio M5 Max 64 Go (3 659 € TTC) — et des mini-PC AMD Ryzen AI Max récents[^3].
*   **Le Réseau :** C'est le cœur du système. Pour éviter que le transfert de données ne tue les performances, les machines sont reliées en guirlande (Daisy-Chain) ou via un hub avec des câbles **[[00-lexique/thunderbolt|Thunderbolt 4 ou 5]]**, qui offrent des débits bidirectionnels allant jusqu'à 80 Gb/s.
*   **Capacité Totale :** Avec 6 Mac Mini de 64 Go, vous obtenez un cluster silencieux avec **384 Go de mémoire unifiée agrégée**.

> [!note] L'alternative « une seule grosse machine »
> Depuis août 2026, un Mac Studio M5 Ultra se configure jusqu'à 512 Go (1,2 To/s, configuration 512 Go livrée fin octobre) : un 671B en 4 bits tient sur une seule machine, sans Thunderbolt ni pipeline parallelism. Au-delà, Apple documente le clustering RDMA sur Thunderbolt 5 directement dans MLX (quatre Mac Studio « jusqu'à 3× » plus rapides qu'un seul, mesure Apple)[^2][^5]. Côté CUDA, NVIDIA documente le couplage de deux DGX Spark (64 ou 128 Go) via leur port ConnectX-7 200 Gbps, à 4 999 $ (64 Go, OEM dès le 2026-10-23) ou ≈ 6 950 $ (128 Go) l'unité[^6]. Le cluster de Mac mini reste l'option la moins chère par Go, mais plus la seule.

**Budget estimé (2026) :** ~10 000 € à 15 000 € (pour un cluster de 4 à 6 machines). C'est environ 10 fois moins cher qu'un serveur NVIDIA DGX équivalent en VRAM. Les machines à 64 Go suivent la hausse de la DRAM (TrendForce : +10 à 15 % par trimestre au T4 2026) : les prix relevés en octobre 2026 sont à revérifier à l'achat[^7].

---

## ⚙️ La Stack Logicielle et le Mécanisme

Ce miracle matériel est rendu possible par l'inférence distribuée de **MLX** (`mlx.launch` avec un fichier d'hôtes, pipeline parallelism, RDMA sur Thunderbolt 5 depuis macOS 26.2) — l'orchestrateur **[[00-lexique/exo|Exo]]**, qui a popularisé l'approche (étudié dans le chapitre sur le [[03-stack-logicielle/clustering-exo-and-ray|Clustering IA]]), n'a plus de release depuis la v1.0.71 d'avril 2026, ne supporte que le backend MLX (Linux en CPU seulement) et doit être considéré comme non maintenu au T4 2026[^4][^5].

1.  Le runtime distribué (MLX, ou Exo) s'installe sur tous les Mac Mini.
2.  Ils se découvrent via le réseau Thunderbolt (IP-over-Thunderbolt en Thunderbolt 4 ; RDMA en Thunderbolt 5 sous macOS 26.2).
3.  Le LLM massif (ex: DeepSeek V3 671B) est découpé en tranches selon le principe du **[[00-lexique/pipeline-parallelism|Pipeline Parallelism]]**.
4.  Le Mac n°1 calcule les 10 premières couches du réseau de neurones, envoie son résultat brut via Thunderbolt au Mac n°2, qui calcule les 10 couches suivantes, et ainsi de suite.

### Les Performances Attendues
Le gain est purement capacitaire : **vous ne gagnez pas en vitesse, vous gagnez le droit de faire tourner le modèle**.
La latence du réseau, même en Thunderbolt, est infiniment plus lente que la vitesse interne de la RAM. Sur un cluster de 8 Mac Mini faisant tourner un modèle de 600B+ quantifié, les benchmarks communautaires disponibles indiquent une vitesse de génération de l'ordre de **3 à 5 [[00-lexique/tokens-per-second|tokens/s]]**[^1]. Côté modèles, DeepSeek V4.1 Flash (septembre 2026) introduit un KV cache FP4 d'environ 890 octets par token, ce qui soulage précisément la contrainte mémoire et TTFT de ce scénario[^8].

---

## Le Piège de la Latence (TTFT)

> [!warning] Latence avant le premier token
> Le plus gros problème de cette architecture n'est pas le débit de lecture, mais le **[[00-lexique/ttft|TTFT]]** (Time To First Token). 
> Pendant la phase de lecture du prompt (le Prefill), une immense quantité de données doit transiter entre les machines. Si vous envoyez un document de 50 pages à analyser à votre cluster, le ping-pong réseau entre les 6 Mac Mini peut prendre **plusieurs dizaines de secondes** avant que le premier mot de la réponse n'apparaisse à l'écran. 

---

## 📋 Le Verdict de l'Architecte

### ✅ Quand utiliser ce Blueprint ?
*   **Prototypage de modèles frontières :** Pour des équipes de chercheurs ou d'ingénieurs qui doivent absolument tester des LLM monumentaux (Grok, DeepSeek, Llama 400B) sans que la donnée ne sorte de l'entreprise.
*   **Traitement en arrière-plan :** Parfait pour de l'analyse documentaire asynchrone (où la latence n'a aucune importance).
*   **Évolutivité budgétaire :** Vous pouvez commencer avec 2 machines et en ajouter une 3ème l'année suivante pour augmenter votre capacité VRAM.

### ❌ Quand fuir ce Blueprint ?
*   **Pour un assistant RAG conversationnel en temps réel.** Attendre 45 secondes pour le premier mot après avoir posé une question sur un PDF va frustrer vos utilisateurs.
*   **Pour servir de nombreux collaborateurs simultanément.** Le réseau Thunderbolt et le Pipeline Parallelism gèrent très mal les requêtes concurrentes massives. Si vous devez servir 50 utilisateurs en temps réel sur un modèle géant, il faut basculer sur un véritable réseau Datacenter (RoCE/InfiniBand) et des serveurs multi-GPU — c'est l'objet du **[[04-blueprints/scenario-d-datacenter|🏭 Scénario D : Datacenter]]**.

---

## 📊 Monitoring recommandé

Sur un cluster Exo, le monitoring est plus manuel qu'en production datacenter, mais quelques commandes couvrent l'essentiel.

**Sur chaque nœud Mac :**

```bash
# Charge GPU et mémoire unifiée (macOS)
sudo powermetrics --samplers gpu_power -i 1000 | grep -E "GPU|ANE"

# Activité réseau Thunderbolt
nettop -m tcp -J bytes_in,bytes_out
```

**Via Ollama (si utilisé comme frontend) :**

```bash
# Statut des modèles chargés
curl http://localhost:11434/api/tags

# Métriques de génération dans les logs
ollama logs
```

**Indicateurs clés à surveiller :**

| Métrique | Seuil d'alerte | Outil |
| :-- | :-- | :-- |
| TTFT | > 30 s sur prompt court | logs Exo |
| Tokens/s | < 2 tok/s | logs Exo |
| Mémoire unifiée par nœud | > 90 % | `vm_stat` / Activity Monitor |
| Bande passante Thunderbolt | > 70 Gb/s soutenu | `nettop` |

> [!note] Monitoring avancé
> Pour un monitoring centralisé (Prometheus + Grafana), il n'existe pas d'exporter Ollama officiel en octobre 2026 ; passer par les métriques de la passerelle (LiteLLM) ou de vLLM, ou par node-exporter pour la mémoire et le réseau. Voir [[06-mise-en-oeuvre/monitoring-inference-stack|Monitoring]].

### Storage Wall — temps de rechargement du modèle

> [!warning] SLA et redémarrages
> Un redémarrage du cluster Exo (crash, mise à jour) implique de recharger le modèle depuis le SSD vers la mémoire unifiée de chaque nœud. Pour un modèle 70B Q4 (~40 Go par nœud) sur un SSD PCIe 3.0 (~2,5 Go/s réels) :
>
> **Temps de rechargement estimé :** ~16 secondes par nœud, mais si les nœuds rechargent en séquence, le cluster peut rester indisponible **30 à 60 secondes** avant d'être opérationnel.
>
> **Recommandation :** Privilégier un SSD NVMe PCIe 4.0 ou 5.0 pour réduire ce temps de démarrage à froid. Sur un cluster de 3 Mac Studio, le rechargement parallèle sur Thunderbolt 5 permet de ramener ce délai à < 10 secondes.

---

## 📚 Sources et Références

[^1]: Exo Labs, *Running DeepSeek V3 671B on M4 Mac Mini Cluster — 12 days of EXO, day 2* (8× Mac mini M4 Pro 64 Go, DeepSeek V3 4 bits, TTFT et tokens/s ; page non datée, série de décembre 2024), relu le 2026-10-09. [https://blog.exolabs.net/day-2](https://blog.exolabs.net/day-2)
[^2]: Apple Newsroom, *Apple introduces new Mac Studio with M5 Max and M5 Ultra* (M5 Ultra jusqu'à 512 Go de mémoire unifiée, 1,2 To/s, configuration 512 Go disponible fin octobre 2026), 2026-08-25. [https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/) · Apple Store France, *Mac Studio* (M5 Ultra 96 Go à partir de 6 599 € TTC), relevé le 2026-10-09. [https://www.apple.com/fr/shop/buy-mac/mac-studio](https://www.apple.com/fr/shop/buy-mac/mac-studio)
[^3]: Apple Newsroom, *Apple unveils a more powerful Mac mini featuring the all-new M6 and M5 Pro* (Mac mini M5 Pro : jusqu'à 64 Go, 307 Go/s, Thunderbolt 5), août 2026. [https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/](https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/) · Apple Store France, *Mac mini* (M5 Pro 24 Go 1 999 € TTC) et *Mac Studio* (M5 Max 64 Go 3 659 € TTC), relevé le 2026-10-09. [https://www.apple.com/fr/shop/buy-mac/mac-mini](https://www.apple.com/fr/shop/buy-mac/mac-mini)
[^4]: Exo Labs, *exo — Releases* (dernière version v1.0.71 du 2026-04-23), consulté le 2026-10-09. [https://github.com/exo-explore/exo/releases](https://github.com/exo-explore/exo/releases) · Exo Labs, *GitHub - exo-explore/exo* (README : backend MLX uniquement, Linux CPU-only, RDMA Thunderbolt 5 + macOS 26.2), relu le 2026-10-09. [https://github.com/exo-explore/exo](https://github.com/exo-explore/exo)
[^5]: Apple MLX, *Distributed Communication* (`mlx.launch` et hostfile, backends JACCL — RDMA over Thunderbolt depuis macOS 26.2, Thunderbolt 5 — et ring), consulté le 2026-10-10. [https://ml-explore.github.io/mlx/build/html/usage/distributed.html](https://ml-explore.github.io/mlx/build/html/usage/distributed.html)
[^6]: NVIDIA, *DGX Spark* — page produit (GB10, ConnectX-7 200 Gbps, cluster de plusieurs systèmes, déclinaison 64 Go chez les OEM), relue le 2026-10-09. [https://www.nvidia.com/en-us/products/workstations/dgx-spark/](https://www.nvidia.com/en-us/products/workstations/dgx-spark/) · ServeTheHome, *NVIDIA DGX Spark 64GB Launched and Big 128GB GB10 Price Increases* (128 Go ≈ 6 950 $, 64 Go 4 999 $ OEM dès le 2026-10-23), 2026-10-03. [https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/](https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/)
[^7]: TrendForce, communiqué du 30 septembre 2026 (prix contractuels DRAM en hausse de 10–15 % au T4 2026). [https://www.trendforce.com/presscenter/news/20260930-13258.html](https://www.trendforce.com/presscenter/news/20260930-13258.html)
[^8]: DeepSeek AI, *DeepSeek-V4.1-Flash* (MIT, 8–16B actifs, KV cache FP4 890 octets/token), septembre 2026. [https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
