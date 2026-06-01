---
title: 📖 Glossaire IA
description: Lexique des termes techniques et acronymes utilisés dans le vault.
---

Ce glossaire centralise les notions clés de l'IA on-premise.  
Utilisez-le comme point d'entrée rapide, puis ouvrez les fiches détaillées.

---

## Parcours recommandé

- **Performance d'inférence** : [[00-lexique/memory-wall]], [[00-lexique/bande-passante-memoire]], [[00-lexique/prefill]], [[00-lexique/decoding]], [[00-lexique/tokens-par-seconde]], [[00-lexique/ttft]].
- **Mémoire & matériel** : [[00-lexique/vram]], [[00-lexique/ram]], [[00-lexique/memoire-unifiee]], [[00-lexique/pcie]], [[00-lexique/multi-gpu]], [[00-lexique/nvlink]].
- **Systèmes IA en production** : [[00-lexique/quantification]], [[00-lexique/quantification-q4]], [[00-lexique/kv-cache]], [[00-lexique/rag]], [[00-lexique/rdma]], [[00-lexique/roce]].

---

## Index des acronymes

| Acronyme | Signification | Fiche |
| :-- | :-- | :-- |
| APU | Accelerated Processing Unit | [[00-lexique/apu]] |
| HBM | High Bandwidth Memory | [[00-lexique/hbm]] |
| KV | Key-Value | [[00-lexique/kv-cache]] |
| LLM | Large Language Model | [[00-lexique/llm]] |
| MoE | Mixture of Experts | [[00-lexique/moe]] |
| NPU | Neural Processing Unit | [[00-lexique/npu]] |
| PCIe | Peripheral Component Interconnect Express | [[00-lexique/pcie]] |
| Q4 | Quantification 4-bit | [[00-lexique/quantification-q4]] |
| RAG | Retrieval-Augmented Generation | [[00-lexique/rag]] |
| RAM | Random Access Memory | [[00-lexique/ram]] |
| RDMA | Remote Direct Memory Access | [[00-lexique/rdma]] |
| RoCE | RDMA over Converged Ethernet | [[00-lexique/roce]] |
| TFLOPS | Tera Floating Point Operations Per Second | [[00-lexique/tflops]] |
| TTFT | Time To First Token | [[00-lexique/ttft]] |
| VRAM | Video RAM | [[00-lexique/vram]] |

---

## Mémoire & performance

| Terme | Définition rapide | Fiche |
| :-- | :-- | :-- |
| Memory Wall | Limite de performance due aux transferts mémoire plutôt qu'au calcul. | [[00-lexique/memory-wall]] |
| Bande passante mémoire | Débit de transfert de données mémoire, souvent exprimé en Go/s. | [[00-lexique/bande-passante-memoire]] |
| Prefill | Phase d'ingestion du prompt, plus parallèle. | [[00-lexique/prefill]] |
| Decoding | Phase auto-régressive token par token, souvent memory-bound. | [[00-lexique/decoding]] |
| KV Cache | Cache des clés/valeurs d'attention pour accélérer la génération. | [[00-lexique/kv-cache]] |
| Tokens/s | Débit de génération mesuré en tokens par seconde. | [[00-lexique/tokens-par-seconde]] |

---

## Infrastructure & architecture

| Terme | Définition rapide | Fiche |
| :-- | :-- | :-- |
| Mémoire unifiée | Pool mémoire partagé CPU/GPU/NPU dans un SoC. | [[00-lexique/memoire-unifiee]] |
| Offloading | Déplacement partiel de poids/activations entre mémoires selon la capacité. | [[00-lexique/offloading]] |
| Multi-GPU | Utilisation de plusieurs GPU pour capacité et/ou débit. | [[00-lexique/multi-gpu]] |
| NVLink | Interconnexion GPU à haut débit (gammes pro/datacenter). | [[00-lexique/nvlink]] |
| PCIe | Bus standard CPU↔GPU ; peut devenir un goulot d'étranglement. | [[00-lexique/pcie]] |
| RoCE | Transport RDMA sur Ethernet convergé pour réduire latence CPU. | [[00-lexique/roce]] |

---

## IA applicative

| Terme | Définition rapide | Fiche |
| :-- | :-- | :-- |
| RAG | Architecture qui enrichit le contexte d'un LLM avec une base documentaire. | [[00-lexique/rag]] |
| Fenêtre de contexte | Nombre maximal de tokens que le modèle peut traiter en entrée active. | [[00-lexique/fenetre-de-contexte]] |
| Quantification | Réduction de précision numérique pour diminuer mémoire et coût de calcul. | [[00-lexique/quantification]] |
| MoE | Architecture avec experts spécialisés activés partiellement par token. | [[00-lexique/moe]] |

---

## Chapitres liés

- [[01-fondations/la-bande-passante-memoire]]
- [[01-fondations/memoire-unifiee-vs-ram-vs-vram]]
