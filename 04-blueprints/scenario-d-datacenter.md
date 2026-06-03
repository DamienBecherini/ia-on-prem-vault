---
title: 🏢 Scénario D : Datacenter (RoCE & Multi-GPU)
description: Le blueprint de l'Enterprise IA. Nœuds HGX 8-GPU, réseau RoCE/InfiniBand et Tensor Parallelism pour une production à très haute concurrence.
sidebar:
  order: 4
---

Votre client est un grand compte, un hébergeur cloud souverain ou une institution publique. Le cahier des charges est implacable : il faut héberger un modèle de la classe 70B ou un géant de 400B+, et surtout, pouvoir **servir des dizaines, voire des centaines d'utilisateurs en même temps** avec un temps de réponse instantané.

Le [[04-blueprints/scenario-b-pme-appliance|Scénario B]] (l'Appliance) s'étoufferait sous la charge concurrente, et le [[04-blueprints/scenario-c-cluster-bureau|Scénario C]] (Cluster Exo) a un TTFT beaucoup trop lent. Pour la production massive, il n'y a pas de secret : il faut basculer sur l'architecture standard des Datacenters IA.

---

## 🏗️ L'Architecture Matérielle

Ici, l'unité de base n'est plus la carte graphique, mais le **Nœud Serveur** (Node) et le **Réseau Fabric**.

*   **Le Nœud (Scale-Up) :** Un serveur format rack (ex: architecture NVIDIA HGX) contenant **8 GPU** de classe Datacenter (NVIDIA H200 ou B200). Contrairement à un PC classique, ces 8 puces ne communiquent pas via PCIe, mais via un **[[00-lexique/nvlink|NVLink]]** et un NVSwitch. Ce bus permet aux puces de s'échanger des données à **1 800 Go/s** (sur Blackwell)[^1].
*   **Le Réseau (Scale-Out) :** Pour relier plusieurs nœuds entre eux, on utilise des cartes réseau à très haut débit (400 Gbps ou 800 Gbps) compatibles **[[00-lexique/rdma|RDMA]]**. Le standard est **InfiniBand** ou **[[00-lexique/roce|RoCEv2]]** (RDMA over Converged Ethernet)[^2].
*   **Le Stockage :** Un stockage flash NVMe distribué accessible en *GPUDirect Storage*, pour charger les To de poids du modèle en quelques secondes au démarrage.

**Budget estimé (2026) :** De 300 000 € à plus d'1 million d'euros par nœud, hors coûts d'infrastructure réseau, d'énergie et de refroidissement.

---

## ⚙️ La Stack Logicielle et le Mécanisme

Cette débauche de matériel exige des moteurs d'inférence capables de l'exploiter à la milliseconde près : **vLLM** ou le SDK officiel **TensorRT-LLM** derrière un serveur Triton. L'orchestration multi-nœuds est gérée par **[[00-lexique/ray|Ray]]**.

### La Magie du Tensor Parallelism
Sur le Cluster Mac (Scénario C), nous avions vu le *Pipeline Parallelism* (découpage couche par couche), qui augmente la latence. 
Dans un nœud HGX, l'incroyable vitesse du NVLink permet d'utiliser le **[[00-lexique/tensor-parallelism|Tensor Parallelism]]** (TP). Une seule et même opération mathématique (une matrice) est découpée et calculée *en même temps* par les 8 GPU.
*   **Résultat :** Les 8 cartes agissent comme un seul GPU géant. La latence de génération s'effondre, et les [[00-lexique/tokens-par-seconde|tokens/s]] explosent, même sur un modèle massif.

### Formats Extrêmes (FP4)
Si vous déployez des puces NVIDIA Blackwell (B200), le logiciel utilisera nativement la quantification **FP4** ou **FP8**. Cela permet de faire tenir des modèles gigantesques dans un seul nœud de 8 GPU, évitant ainsi de devoir traverser le réseau RoCE pour chaque calcul[^3].

---

## ⚠️ Le Piège de l'Ingénierie Réseau (Le drame RoCE)

Beaucoup d'entreprises achètent les serveurs GPU, puis branchent le tout sur leur réseau Ethernet classique en espérant que le RDMA fonctionne tout seul.
C'est le plus grand piège de ce blueprint : **RoCE n'est pas plug-and-play**. Il nécessite un réseau dit "Lossless" (sans perte). Si vos switchs réseau ne sont pas rigoureusement configurés avec des protocoles stricts de contrôle de congestion (PFC, ECN), les paquets de données liés à l'IA vont saturer les câbles, provoquant des retransmissions. 
**Une latence réseau qui passe de 2 microsecondes à 5 millisecondes suffit à diviser par dix la vitesse de votre cluster IA**[^2].

---

## 📋 Le Verdict de l'Architecte

### ✅ Quand utiliser ce Blueprint ?
*   **La production à l'échelle :** C'est la seule architecture viable pour servir de véritables applications SaaS souveraines (comme un ChatGPT d'entreprise interne pour 1 000 salariés).
*   **Le besoin de garanties (SLA) :** Quand le [[00-lexique/ttft|TTFT]] doit toujours rester inférieur à 500 ms, quel que soit le nombre d'utilisateurs connectés.

### ❌ Quand fuir ce Blueprint ?
*   **Si vous n'avez pas d'ingénieur réseau dédié.** L'exploitation d'un fabric RoCE/InfiniBand et d'un cluster Ray demande des compétences d'administration très pointues, souvent issues du monde du Calcul Haute Performance (HPC).
*   **Contraintes de datacenter :** Ces machines sont des radiateurs géants. Une baie classique ne peut souvent pas refroidir un tel nœud sans un aménagement lourd (Direct Liquid Cooling).

---

## 📚 Sources et Références

[^1]: NVIDIA Technical Blog, *NVIDIA NVLink and NVIDIA NVSwitch Supercharge Large Language Model Inference* (Architecture HGX, Blackwell NVLink 1.8 TB/s), 2024-2026.
[^2]: NVIDIA, *RDMA over Converged Ethernet - RoCE | Cumulus Linux* (Importance critique du PFC/ECN pour éviter l'effondrement des performances LLM), 2026.
[^3]: NVIDIA, *Optimizing Inference for Long Context and Large Batch Sizes with NVFP4 KV Cache* (Blackwell, TensorRT-LLM natif), Décembre 2025.