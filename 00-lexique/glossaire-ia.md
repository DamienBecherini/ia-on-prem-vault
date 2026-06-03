---
title: 📖 Glossaire IA
description: Lexique des termes techniques et acronymes utilisés dans le vault.
---

Ce glossaire centralise les notions clés de l'IA on-premise.  
Utilisez-le comme point d'entrée rapide, puis ouvrez les fiches détaillées.

**Index complet** : [[00-lexique/index-lexique|toutes les fiches du lexique]] (liste alphabétique, mise à jour au build).

---

## 🚶 Débutant — je découvre

*Je ne sais pas par où commencer :*

[[00-lexique/llm|LLM]] → [[00-lexique/inference|Inférence (LLM)]] → [[01-fondations/le-voyage-d-un-prompt|🧠 Le Voyage d'un Prompt]] → [[00-lexique/prefill|Prefill]] / [[00-lexique/decoding|Decoding]] → [[00-lexique/memory-wall|Memory Wall]] → [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire]]

---

## Parcours recommandé

- **Performance d'inférence** : [[00-lexique/inference|Inférence (LLM)]], [[00-lexique/memory-wall|Memory Wall]], [[00-lexique/bande-passante-memoire|Bande passante mémoire]], [[00-lexique/prefill|Prefill]], [[00-lexique/decoding|Decoding]], [[00-lexique/tokens-par-seconde|Tokens par seconde]], [[00-lexique/ttft|TTFT]].
- **Mémoire & matériel** : [[00-lexique/vram|VRAM]], [[00-lexique/ram|RAM]], [[00-lexique/memoire-unifiee|Mémoire unifiée]], [[00-lexique/pcie|PCIe]], [[00-lexique/multi-gpu|Multi-GPU]], [[00-lexique/nvlink|NVLink]].
- **Systèmes IA en production** : [[00-lexique/quantification|Quantification]], [[00-lexique/quantification-q4|Quantification Q4]], [[00-lexique/kv-cache|KV Cache]], [[00-lexique/rag|RAG]], [[00-lexique/rdma|RDMA]], [[00-lexique/roce|RoCE]].

---

## Index des acronymes

| Acronyme | Signification |
| :-- | :-- |
| [APU](/00-lexique/apu/) | Accelerated Processing Unit |
| [HBM](/00-lexique/hbm/) | High Bandwidth Memory |
| [KV](/00-lexique/kv-cache/) | Key-Value |
| [LLM](/00-lexique/llm/) | Large Language Model |
| [MoE](/00-lexique/moe/) | Mixture of Experts |
| [NPU](/00-lexique/npu/) | Neural Processing Unit |
| [PCIe](/00-lexique/pcie/) | Peripheral Component Interconnect Express |
| [Q4](/00-lexique/quantification-q4/) | Quantification 4-bit |
| [RAG](/00-lexique/rag/) | Retrieval-Augmented Generation |
| [RAM](/00-lexique/ram/) | Random Access Memory |
| [RDMA](/00-lexique/rdma/) | Remote Direct Memory Access |
| [RoCE](/00-lexique/roce/) | RDMA over Converged Ethernet |
| [TFLOPS](/00-lexique/tflops/) | Tera Floating Point Operations Per Second |
| [TTFT](/00-lexique/ttft/) | Time To First Token |
| [VRAM](/00-lexique/vram/) | Video RAM |

---

## Mémoire & performance

| Terme | Définition rapide |
| :-- | :-- |
| [Memory Wall](/00-lexique/memory-wall/) | Limite de performance due aux transferts mémoire plutôt qu'au calcul. |
| [Bande passante mémoire](/00-lexique/bande-passante-memoire/) | Débit de transfert de données mémoire, souvent exprimé en Go/s. |
| [Prefill](/00-lexique/prefill/) | Phase d'ingestion du prompt, plus parallèle. |
| [Decoding](/00-lexique/decoding/) | Phase auto-régressive token par token, souvent memory-bound. |
| [KV Cache](/00-lexique/kv-cache/) | Cache des clés/valeurs d'attention pour accélérer la génération. |
| [Tokens/s](/00-lexique/tokens-par-seconde/) | Débit de génération mesuré en tokens par seconde. |

---

## Infrastructure & architecture

| Terme | Définition rapide |
| :-- | :-- |
| [Mémoire unifiée](/00-lexique/memoire-unifiee/) | Pool mémoire partagé CPU/GPU/NPU dans un SoC. |
| [Offloading](/00-lexique/offloading/) | Déplacement partiel de poids/activations entre mémoires selon la capacité. |
| [Multi-GPU](/00-lexique/multi-gpu/) | Utilisation de plusieurs GPU pour capacité et/ou débit. |
| [NVLink](/00-lexique/nvlink/) | Interconnexion GPU à haut débit (gammes pro/datacenter). |
| [PCIe](/00-lexique/pcie/) | Bus standard CPU↔GPU ; peut devenir un goulot d'étranglement. |
| [RoCE](/00-lexique/roce/) | Transport RDMA sur Ethernet convergé pour réduire latence CPU. |

---

## IA applicative

| Terme | Définition rapide |
| :-- | :-- |
| [Inférence (LLM)](/00-lexique/inference/) | Utilisation d'un LLM entraîné pour générer du texte à la demande. |
| [RAG](/00-lexique/rag/) | Architecture qui enrichit le contexte d'un LLM avec une base documentaire. |
| [Fenêtre de contexte](/00-lexique/fenetre-de-contexte/) | Nombre maximal de tokens que le modèle peut traiter en entrée active. |
| [Quantification](/00-lexique/quantification/) | Réduction de précision numérique pour diminuer mémoire et coût de calcul. |
| [MoE](/00-lexique/moe/) | Architecture avec experts spécialisés activés partiellement par token. |

---

## Chapitres liés

- [[01-fondations/la-bande-passante-memoire]]
- [[01-fondations/memoire-unifiee-vs-ram-vs-vram]]
