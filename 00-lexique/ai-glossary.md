---
title: 📖 Glossaire IA
description: Lexique des termes techniques et acronymes utilisés dans le vault.
---

Ce glossaire centralise les notions clés de l'IA on-premise.  
Utilisez-le comme point d'entrée rapide, puis ouvrez les fiches détaillées.

**Index complet** : [[00-lexique/lexicon-index|toutes les fiches du lexique]] (liste alphabétique, mise à jour au build).

---

## 🚶 Débutant — je découvre

*Je ne sais pas par où commencer :*

[[00-lexique/llm|LLM]] → [[00-lexique/inference|Inférence (LLM)]] → [[01-fondations/journey-of-a-prompt|🧠 Le Voyage d'un Prompt]] → [[00-lexique/prefill|Prefill]] / [[00-lexique/decoding|Decoding]] → [[00-lexique/memory-wall|Memory Wall]] → [[01-fondations/memory-bandwidth|🏎️ La Bande Passante Mémoire]]

---

## Parcours recommandé

- **Performance d'inférence** : [[00-lexique/inference|Inférence (LLM)]], [[00-lexique/memory-wall|Memory Wall]], [[00-lexique/memory-bandwidth|Bande passante mémoire]], [[00-lexique/prefill|Prefill]], [[00-lexique/decoding|Decoding]], [[00-lexique/tokens-per-second|Tokens par seconde]], [[00-lexique/ttft|TTFT]].
- **Mémoire & matériel** : [[00-lexique/vram|VRAM]], [[00-lexique/ram|RAM]], [[00-lexique/unified-memory|Mémoire unifiée]], [[00-lexique/pcie|PCIe]], [[00-lexique/multi-gpu|Multi-GPU]], [[00-lexique/nvlink|NVLink]], [[00-lexique/nvswitch|NVSwitch]].
- **Systèmes IA en production** : [[00-lexique/quantification|Quantification]], [[00-lexique/quantification-q4|Quantification Q4]], [[00-lexique/kv-cache|KV Cache]], [[00-lexique/rag|RAG]], [[00-lexique/rdma|RDMA]], [[00-lexique/roce|RoCE]], [[00-lexique/infiniband|InfiniBand]].
- **Réseau datacenter** : [[00-lexique/pfc|PFC]], [[00-lexique/ecn|ECN]], [[00-lexique/nccl|NCCL]], [[00-lexique/gpudirect-rdma|GPUDirect RDMA]].

---

## Index des acronymes

| Acronyme | Signification |
| :-- | :-- |
| [APU](/00-lexique/apu/) | Accelerated Processing Unit |
| [ECN](/00-lexique/ecn/) | Explicit Congestion Notification |
| [HBM](/00-lexique/hbm/) | High Bandwidth Memory |
| [IB](/00-lexique/infiniband/) | InfiniBand |
| [KV](/00-lexique/kv-cache/) | Key-Value |
| [LLM](/00-lexique/llm/) | Large Language Model |
| [MoE](/00-lexique/moe/) | Mixture of Experts |
| [NCCL](/00-lexique/nccl/) | NVIDIA Collective Communications Library |
| [NPU](/00-lexique/npu/) | Neural Processing Unit |
| [PCIe](/00-lexique/pcie/) | Peripheral Component Interconnect Express |
| [PFC](/00-lexique/pfc/) | Priority Flow Control |
| [Q4](/00-lexique/quantification-q4/) | Quantification 4-bit |
| [RAG](/00-lexique/rag/) | Retrieval-Augmented Generation |
| [RAM](/00-lexique/ram/) | Random Access Memory |
| [RDMA](/00-lexique/rdma/) | Remote Direct Memory Access |
| [RoCE](/00-lexique/roce/) | RDMA over Converged Ethernet |
| [TFLOPS](/00-lexique/tflops/) | Tera Floating Point Operations Per Second |
| [TTFT](/00-lexique/ttft/) | Time To First Token |
| [VRAM](/00-lexique/vram/) | Video RAM |

---

## Fondations LLM

| Terme | Définition rapide |
| :-- | :-- |
| [Tokenisation](/00-lexique/tokenisation/) | Découpage du texte en unités numériques traitées par le modèle. |
| [Embedding](/00-lexique/embedding/) | Vecteur de coordonnées qui encode le sens d'un token. |
| [Attention](/00-lexique/attention/) | Mécanisme qui pondère l'importance de chaque token dans le contexte. |

---

## Mémoire & performance

| Terme | Définition rapide |
| :-- | :-- |
| [Memory Wall](/00-lexique/memory-wall/) | Limite de performance due aux transferts mémoire plutôt qu'au calcul. |
| [Bande passante mémoire](/00-lexique/memory-bandwidth/) | Débit de transfert de données mémoire, souvent exprimé en Go/s. |
| [Prefill](/00-lexique/prefill/) | Phase d'ingestion du prompt, plus parallèle. |
| [Decoding](/00-lexique/decoding/) | Phase auto-régressive token par token, souvent memory-bound. |
| [KV Cache](/00-lexique/kv-cache/) | Cache des clés/valeurs d'attention pour accélérer la génération. |
| [Tokens/s](/00-lexique/tokens-per-second/) | Débit de génération mesuré en tokens par seconde. |

---

## Stack logicielle

| Terme | Définition rapide |
| :-- | :-- |
| [PagedAttention](/00-lexique/pagedattention/) | Gestion du KV Cache par blocs virtuels ; clé de la production vLLM. |
| [GGUF](/00-lexique/gguf/) | Format portable pour l'inférence locale avec llama.cpp/Ollama. |
| [TensorRT-LLM](/00-lexique/tensorrt-llm/) | SDK NVIDIA de compilation ultra-optimisée pour GPU datacenter. |
| [Exo](/00-lexique/exo/) | Orchestrateur P2P pour cluster IA de bureau (Mac Mini + Thunderbolt). |
| [Ray](/00-lexique/ray/) | Framework distribué pour déploiement multi-nœuds en production. |
| [Pipeline Parallelism](/00-lexique/pipeline-parallelism/) | Découpage d'un modèle en tranches de couches entre nœuds. |
| [Tensor Parallelism](/00-lexique/tensor-parallelism/) | Découpage des matrices au sein d'un nœud multi-GPU NVLink. |
| [Thunderbolt](/00-lexique/thunderbolt/) | Interconnexion bureau jusqu'à 80 Gb/s pour les clusters Exo. |

---

## Infrastructure & architecture

| Terme | Définition rapide |
| :-- | :-- |
| [Mémoire unifiée](/00-lexique/unified-memory/) | Pool mémoire partagé CPU/GPU/NPU dans un SoC. |
| [Offloading](/00-lexique/offloading/) | Déplacement partiel de poids/activations entre mémoires selon la capacité. |
| [Multi-GPU](/00-lexique/multi-gpu/) | Plusieurs GPU pour plus de capacité et/ou de débit. |
| [NVLink](/00-lexique/nvlink/) | Interconnexion GPU à haut débit (gammes pro/datacenter). |
| [NVSwitch](/00-lexique/nvswitch/) | Fabric NVLink non bloquant entre tous les GPU d'un nœud HGX. |
| [PCIe](/00-lexique/pcie/) | Bus standard CPU↔GPU ; goulot inter-GPU sans NVLink. |

---

## Réseau & Clustering

| Terme | Définition rapide |
| :-- | :-- |
| [RDMA](/00-lexique/rdma/) | Transfert mémoire-à-mémoire sans copie CPU pour clusters multi-nœuds. |
| [RoCE](/00-lexique/roce/) | RDMA sur Ethernet ; nécessite PFC + ECN pour être lossless. |
| [InfiniBand](/00-lexique/infiniband/) | Fabric réseau dédié HPC/IA, lossless natif, ~400–800 Gb/s. |
| [GPUDirect RDMA](/00-lexique/gpudirect-rdma/) | Transfert direct VRAM↔carte réseau sans copie CPU. |
| [NCCL](/00-lexique/nccl/) | Bibliothèque NVIDIA de communication collective GPU-à-GPU. |
| [PFC](/00-lexique/pfc/) | Priority Flow Control — pause par priorité pour réseau lossless RoCE. |
| [ECN](/00-lexique/ecn/) | Explicit Congestion Notification — gestion proactive de la congestion. |

---

## Concepts fondateurs

| Terme | Définition rapide |
| :-- | :-- |
| [On-Premise](/00-lexique/on-premise/) | Infrastructure IA hébergée sur les équipements propres de l'organisation. |
| [LLM](/00-lexique/llm/) | Grand modèle de langage entraîné sur de vastes corpus textuels. |
| [Inférence (LLM)](/00-lexique/inference/) | Utilisation d'un LLM entraîné pour générer du texte à la demande. |

---

## IA applicative

| Terme | Définition rapide |
| :-- | :-- |
| [Inférence (LLM)](/00-lexique/inference/) | Utilisation d'un LLM entraîné pour générer du texte à la demande. |
| [RAG](/00-lexique/rag/) | Architecture qui enrichit le contexte d'un LLM avec une base documentaire. |
| [Base de données vectorielle](/00-lexique/vectordb/) | Stockage et recherche de documents par similarité d'embeddings. |
| [GraphRAG](/00-lexique/graphrag/) | RAG basé sur un graphe de connaissances pour les requêtes globales. |
| [Memory Tree](/00-lexique/memory-tree/) | Mémoire hiérarchique qui charge seulement les résumés et nœuds utiles. |
| [Agent autonome](/00-lexique/autonomous-agent/) | LLM équipé d'outils qui raisonne en boucle pour accomplir des tâches. |
| [Agent custodien](/00-lexique/agent-custodian/) | Agent de maintenance qui propose des corrections et attend validation humaine. |
| [Human-in-the-loop](/00-lexique/human-in-the-loop/) | Gouvernance où l'humain valide les actions critiques avant application. |
| [LiteLLM](/00-lexique/litellm/) | Gateway OpenAI-compatible pour router vers modèles locaux ou cloud. |
| [SmolAgents](/00-lexique/smolagents/) | Framework léger Hugging Face pour agents souverains sans télémétrie cloud. |
| [Fenêtre de contexte](/00-lexique/context-window/) | Nombre maximal de tokens que le modèle peut traiter en entrée active. |
| [Quantification](/00-lexique/quantification/) | Réduction de précision numérique pour diminuer mémoire et coût de calcul. |
| [MoE](/00-lexique/moe/) | Architecture avec experts spécialisés activés partiellement par token. |

---

## Chapitres liés

- [[01-fondations/memory-bandwidth]]
- [[01-fondations/unified-memory-vs-ram-vs-vram]]
