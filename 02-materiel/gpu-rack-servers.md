---
title: "🏭 Serveurs rack GPU"
description: Guide de choix des serveurs 1U/2U/4U et nœuds HGX pour l'inférence LLM on-premise — entre workstation et datacenter.
sidebar:
  order: 3
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
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
| **HGX / OAM** | 8× H100/H200/B200, [[00-lexique/nvswitch|NVSwitch]] | Datacenter, modèles 405B+, [[00-lexique/tensor-parallelism|TP]] massif |

La contrainte n°1 reste la **[[00-lexique/vram|VRAM]] totale adressable** : un Llama 3 70B en FP16 demande ~140 Go de poids seuls, sans compter le [[00-lexique/kv-cache|KV Cache]] concurrent.

---

## 2. RTX consumer vs GPU datacenter

| Critère | RTX 4090 / 5090 (workstation/rack 2U) | H100 / H200 / B200 (HGX) |
| :-- | :-- | :-- |
| **VRAM** | 24–32 Go | 80–192 Go [[00-lexique/hbm|HBM]] |
| **Bande passante mémoire** | ~1–1,5 To/s | ~3–8 To/s |
| **NVLink multi-GPU** | Limité (2 GPU bridge) | [[00-lexique/nvswitch|NVSwitch]] full mesh |
| **Coût d'acquisition** | Ordre de grandeur ×5–×10 inférieur au HGX | TCO datacenter, support enterprise |
| **Meilleur pour** | Scénario B, labo charge modérée | Scénario D, SLA strict, gros modèles |

> [!warning] Ne pas extrapoler les benchmarks bureau
> Une RTX 5090 excellente en bench solo ne remplace pas un nœud HGX pour 50 requêtes concurrentes sur un 70B — le goulot devient KV Cache + [[00-lexique/memory-bandwidth|bande passante mémoire]], pas le pic TFLOPS.

---

## 3. Dimensionnement rapide

**Étape 1 — Poids du modèle cible**  
Utilisez [[01-fondations/quantization-4bit-8bit|quantification 4/8-bit]] et [[03-stack-logicielle/choose-your-model|Choisir son modèle]] pour estimer la VRAM poids.

**Étape 2 — KV Cache concurrent**  
Référez-vous à [[01-fondations/kv-cache-and-context|KV Cache et contexte]] : chaque session active consomme de la VRAM proportionnelle à la longueur de contexte.

**Étape 3 — Moteur**  
[[00-lexique/ollama|Ollama]] sur 1 GPU RTX convient au test ; la production multi-user bascule vers [[00-lexique/vllm|vLLM]] ou TensorRT-LLM — [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]].

**Étape 4 — Réseau multi-nœuds**  
Au-delà d'un nœud, le fabric [[02-materiel/network-roce-infiniband-thunderbolt|RoCE ou InfiniBand]] devient obligatoire pour le [[00-lexique/tensor-parallelism|tensor parallelism]] inter-serveurs.

---

## 4. Pièges d'achat

- **Sous-estimer le refroidissement et l'alimentation** : GPU datacenter en 1U = bruit et thermique extrêmes ; prévoir salle ou baie adaptée.
- **PCIe x16 partagé** : vérifier le découpage des lanes quand 4 GPU partagent le même CPU — voir [[02-materiel/stations-multi-gpu|Stations multi-GPU]] (mêmes principes).
- **Licences et support** : certains constructeurs restreignent l'usage « datacenter » des cartes gaming — lire les EULA avant déploiement prod.
- **Oublier le front applicatif** : le rack GPU sert [[00-lexique/vllm|vLLM]] ; l'UI utilisateur reste [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] ou équivalent.

---

## 📋 Le conseil de l'architecte

Pour une **PME** qui veut un rack 2U × 2× L40S ou RTX pro : dimensionnez pour un modèle 32B–70B quantifié + 10–20 utilisateurs concurrents, front Open WebUI, [[00-lexique/vllm|vLLM]] derrière reverse proxy — blueprint [[04-blueprints/scenario-b-sme-appliance|B]].

Pour un **datacenter** : commencez par le modèle cible (405B ? 70B dense ? MoE ?) et descendez vers le nombre de GPU HGX — blueprint [[04-blueprints/scenario-d-datacenter|D]].

---

## 📚 Sources

[^1]: NVIDIA, *TensorRT-LLM* et documentation GPU datacenter. [https://nvidia.github.io/TensorRT-LLM/](https://nvidia.github.io/TensorRT-LLM/)
[^2]: vLLM Project — exigences hardware et tensor parallelism. [https://docs.vllm.ai/](https://docs.vllm.ai/)
