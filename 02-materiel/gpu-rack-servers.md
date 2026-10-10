---
title: "🏭 Serveurs rack GPU"
description: Guide de choix des serveurs 1U/2U/4U et nœuds HGX pour l'inférence LLM on-premise — entre workstation et datacenter.
sidebar:
  order: 3
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] En bref
> Les serveurs rack comblent le fossé entre **station multi-GPU** (bureau) et **nœud HGX** (datacenter). Ils hébergent 1 à 8 GPU avec alimentation, refroidissement et [[00-lexique/pcie|PCIe]]/[[00-lexique/nvlink|NVLink]] adaptés à une charge [[00-lexique/vllm|vLLM]] 24/7.

Après les [[02-materiel/apu-and-unified-memory|APU mémoire unifiée]] (PME légère) et les [[02-materiel/stations-multi-gpu|stations bureau]], les **serveurs rack GPU** sont la brique standard des scénarios **B** (appliance rackable) et **D** (datacenter) — voir [[04-blueprints/scenario-b-sme-appliance|Scénario B]] et [[04-blueprints/scenario-d-datacenter|Scénario D]].

---

## 1. Formats et capacité GPU

| Format | GPU typiques | Usage inférence |
| :-- | :-- | :-- |
| **1U** | 1–2 GPU (souvent RTX/L40S) | PME, edge, modèles ≤ 30B quantifiés |
| **2U** | 2–4 GPU PCIe | Sweet spot PME / ETI — [[00-lexique/vllm|vLLM]] multi-utilisateurs |
| **4U** | 4–8 GPU, parfois NVLink intra-nœud | Modèles 70B+, tensor parallelism |
| **HGX / OAM / NVL72** | 8× H100/H200/B200/**B300**, [[00-lexique/nvswitch|NVSwitch]] ; Vera Rubin (NVL72) en pleine production depuis août 2026, d'abord pour les grands clouds[^5] | Datacenter, modèles 405B+, [[00-lexique/tensor-parallelism|TP]] massif |

La contrainte n°1 reste la **[[00-lexique/vram|VRAM]] totale adressable** : un Llama 3 70B en FP16 demande ~140 Go de poids seuls, sans compter le [[00-lexique/kv-cache|KV Cache]] concurrent.

Hors NVIDIA, trois annonces de 2026 complètent le paysage rack sans le changer pour une PME. Côté AMD, le rack **Helios** (72 Instinct MI455X HBM4, 18 EPYC « Venice », réseau Pensando) est déclaré « en production » depuis le 2026-07-23, avec Bull, HPE, Lenovo et Supermicro comme intégrateurs, et AMD maintient la cible du second semestre 2026 malgré les rumeurs de retard : pour un datacenter souverain, c'est une alternative à qualifier en 2027, pas un achat 2026[^3][^10]. Le **Cerebras CS-4** (2026-08-18, trois Wafer Scale Engine 3 Turbo, SRAM on-chip, « jusqu'à 30× » le débit d'inférence d'un système GPU selon Cerebras) vise les neoclouds et hyperscalers, en vente directe sans prix public[^7]. Enfin Intel prépare **Crescent Island**, un GPU d'inférence PCIe de 350 W avec 160 Go de LPDDR5X (jusqu'à 480 Go chez les partenaires), sans bande passante ni date publiées[^8].

---

## 2. RTX consumer vs GPU datacenter

| Critère | RTX 5090 / RTX PRO 6000 (workstation/rack 2U) | H100 / H200 / B200 / B300 (HGX) |
| :-- | :-- | :-- |
| **VRAM** | 32–96 Go GDDR7 | 80–288 Go [[00-lexique/hbm|HBM]] |
| **Bande passante mémoire** | ~1,8 To/s[^6] | ~3–8 To/s |
| **NVLink multi-GPU** | Aucun (pas de NVLink depuis Ada ; PCIe seulement)[^6] | [[00-lexique/nvswitch|NVSwitch]] full mesh |
| **Coût d'acquisition** | Nettement inférieur au HGX, mais l'écart se réduit avec la hausse 2026 des GPU GDDR7 (RTX PRO 6000 ~16 000 $, RTX 5090 ≥ 5 000 $) ; un serveur 8× RTX PRO 6000 est listé ~266 k$ par un OEM en juillet 2026[^3][^4] | TCO datacenter, support enterprise ; pas de prix catalogue public pour HGX B300 / GB300 |
| **Meilleur pour** | Scénario B, labo charge modérée | Scénario D, SLA strict, gros modèles |

> [!warning] Ne pas extrapoler les benchmarks bureau
> Une RTX 5090 excellente en bench solo ne remplace pas un nœud HGX pour 50 requêtes concurrentes sur un 70B — le goulot devient KV Cache + [[00-lexique/memory-bandwidth|bande passante mémoire]], pas le pic TFLOPS.

Les générations précédentes restent des achats sûrs : NVIDIA AI Enterprise Infra 8.x (mai 2026) conserve A100, H100/H200, L40/L40S et RTX 6000 Ada parmi les GPU supportés ; seuls les V100, RTX 4000 SFF Ada, RTX A4000 et Quadro RTX ont été retirés (encore supportés sur la ligne 7.x LTSB)[^9].

---

## 3. Dimensionnement rapide

**Étape 1 — Poids du modèle cible**  
Utilisez [[01-fondations/quantization-4bit-8bit|quantification 4/8-bit]] et [[03-stack-logicielle/choose-your-model|Choisir son modèle]] pour estimer la VRAM poids.

**Étape 2 — KV Cache concurrent**  
Référez-vous à [[01-fondations/kv-cache-and-context|KV Cache et contexte]] : chaque session active consomme de la VRAM proportionnelle à la longueur de contexte.

**Étape 3 — Moteur**  
[[00-lexique/ollama|Ollama]] sur 1 GPU RTX convient au test ; la production multi-user bascule vers [[00-lexique/vllm|vLLM]][^2] ou TensorRT-LLM[^1] — [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]].

**Étape 4 — Réseau multi-nœuds**  
Au-delà d'un nœud, le fabric [[02-materiel/network-roce-infiniband-thunderbolt|RoCE ou InfiniBand]] devient obligatoire pour le [[00-lexique/tensor-parallelism|tensor parallelism]] inter-serveurs.

---

## 4. Pièges d'achat

- **Sous-estimer le refroidissement et l'alimentation** : GPU datacenter en 1U = bruit et thermique extrêmes ; prévoir salle ou baie adaptée.
- **PCIe x16 partagé** : vérifier le découpage des lanes quand 4 GPU partagent le même CPU — voir [[02-materiel/stations-multi-gpu|Stations multi-GPU]] (mêmes principes).
- **Licences et support** : certains constructeurs restreignent l'usage « datacenter » des cartes gaming — lire les EULA avant déploiement prod.
- **Oublier le front applicatif** : le rack GPU sert [[00-lexique/vllm|vLLM]] ; l'UI utilisateur reste [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] ou équivalent.
- **Sous-estimer la RAM système** : la DRAM contractuelle augmente encore de 10–15 % par trimestre au T4 2026 (TrendForce) ; les nœuds qui déchargent du KV cache ou des poids en RAM se chiffrent désormais aussi en euros par Go[^11].

---

## 📋 Le conseil de l'architecte

Pour une **PME** qui veut un rack 2U × 2× L40S (48 Go, 350 W) ou RTX PRO 6000 (96 Go, ~16 000 $ au T3 2026) : dimensionnez pour un modèle 32B–70B quantifié + 10–20 utilisateurs concurrents, front Open WebUI, [[00-lexique/vllm|vLLM]] derrière reverse proxy — blueprint [[04-blueprints/scenario-b-sme-appliance|B]].

Pour un **datacenter** : commencez par le modèle cible (405B ? 70B dense ? MoE ?) et descendez vers le nombre de GPU HGX — blueprint [[04-blueprints/scenario-d-datacenter|D]].

---

## 📚 Sources

[^1]: NVIDIA, *TensorRT-LLM* et documentation GPU datacenter. [https://nvidia.github.io/TensorRT-LLM/](https://nvidia.github.io/TensorRT-LLM/)
[^2]: vLLM, *Parallelism and Scaling* (tensor parallel, pipeline parallel, exigences multi-GPU). [https://docs.vllm.ai/en/stable/serving/parallelism_scaling/](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/)
[^3]: AMD, *AAI 2026: AMD Delivers Full-Stack Compute for the Agentic AI Era* (Helios « now in production », 72 MI455X + 18 EPYC Venice, OEM Bull / HPE / Lenovo / Supermicro ; note 8 : serveur à base de RTX PRO 6000 au prix public OEM de 265 928,24 $ au 2026-07-16), 23 juillet 2026. [https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era](https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era)
[^4]: Tom's Hardware, *Nvidia doubles RTX PRO 6000 Blackwell's MSRP to a staggering $16,000* (96 Go, précommandes sous 8 000 $ en 2025), août 2026. [https://www.tomshardware.com/pc-components/gpus/nvidia-doubles-rtx-pro-6000-blackwells-msrp-to-a-staggering-usd16-000-96gb-card-started-pre-orders-below-usd8-000-last-year](https://www.tomshardware.com/pc-components/gpus/nvidia-doubles-rtx-pro-6000-blackwells-msrp-to-a-staggering-usd16-000-96gb-card-started-pre-orders-below-usd8-000-last-year) · Tom's Hardware, *Nvidia's RTX 5090 vanishes from online retail in the US* (≥ 5 000 $ chez les tiers, MSRP 1 999 $), 14 septembre 2026. [https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu](https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu)
[^5]: NVIDIA Newsroom, *NVIDIA Announces Financial Results for Second Quarter Fiscal 2027* (« Vera Rubin, now in full production », racks chez CoreWeave, Google Cloud, Microsoft Azure, OCI, Nebius), 26 août 2026. [https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)
[^6]: NVIDIA, *RTX PRO 6000 Blackwell Workstation Edition* (96 Go GDDR7 ECC, 1 792 Go/s, PCIe Gen 5, 600 W, pas de connecteur NVLink). [https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/) · NVIDIA, *GeForce RTX 5090* (32 Go GDDR7, bus 512-bit, 575 W). [https://www.nvidia.com/fr-fr/geforce/graphics-cards/50-series/rtx-5090/](https://www.nvidia.com/fr-fr/geforce/graphics-cards/50-series/rtx-5090/)
[^7]: Cerebras, *Introducing Cerebras CS-4* (trois WSE-3 Turbo, « up to 30 times faster inference than GPU systems », cible neoclouds et hyperscalers, pas de prix public), 18 août 2026. [https://www.cerebras.ai/blog/introducing-cerebras-cs-4](https://www.cerebras.ai/blog/introducing-cerebras-cs-4)
[^8]: ServeTheHome, *Intel Crescent Island 160GB to 480GB LPDDR5X AI GPU at Hot Chips 2026* (PCIe 350 W refroidi par air, vLLM / SGLang, bande passante non communiquée), 24 août 2026. [https://www.servethehome.com/intel-crescent-island-160gb-to-480gb-lpddr5x-ai-gpu-at-hot-chips-2026/](https://www.servethehome.com/intel-crescent-island-160gb-to-480gb-lpddr5x-ai-gpu-at-hot-chips-2026/)
[^9]: NVIDIA, *NVIDIA AI Enterprise — End-of-Life Notices* (GPU retirés à partir d'Infra 8.0 : Tesla V100, RTX 4000 SFF Ada, RTX A4000, Quadro RTX ; A100, H100/H200, L40/L40S et RTX 6000 Ada toujours supportés), relu le 2026-10-10. [https://docs.nvidia.com/ai-enterprise/lifecycle/latest/eol-notices.html](https://docs.nvidia.com/ai-enterprise/lifecycle/latest/eol-notices.html)
[^10]: Tom's Hardware, *AMD denies report of MI455X delays as Nvidia VR200 systems are rumored to arrive early — company says Helios systems on target for 2H 2026*, septembre 2026. [https://www.tomshardware.com/tech-industry/artificial-intelligence/amd-denies-report-of-mi455x-delays-as-nvidia-vr200-systems-are-rumored-to-arrive-early-company-says-helios-systems-on-target-for-2h-2026](https://www.tomshardware.com/tech-industry/artificial-intelligence/amd-denies-report-of-mi455x-delays-as-nvidia-vr200-systems-are-rumored-to-arrive-early-company-says-helios-systems-on-target-for-2h-2026)
[^11]: TrendForce, communiqué du 30 septembre 2026 (prix contractuels DRAM en hausse de 10–15 % au T4 2026). [https://www.trendforce.com/presscenter/news/20260930-13258.html](https://www.trendforce.com/presscenter/news/20260930-13258.html)
