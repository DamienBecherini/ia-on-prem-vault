---
title: 📖 Glossaire IA
description: Lexique des termes techniques et acronymes utilisés dans le vault.
last_modified: "2026-06-04"
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
- **Évaluation des modèles** : [[00-lexique/benchmark-llm|Benchmark LLM]], [[00-lexique/llm-as-a-judge|LLM-as-a-judge]], [[00-lexique/ragas|RAGAS]].

---

## Index des acronymes

| Acronyme | Signification |
| :-- | :-- |
| [[00-lexique/apu\|APU]] | Accelerated Processing Unit |
| [[00-lexique/ecn\|ECN]] | Explicit Congestion Notification |
| [[00-lexique/hbm\|HBM]] | High Bandwidth Memory |
| [[00-lexique/infiniband\|IB]] | InfiniBand |
| [[00-lexique/kv-cache\|KV]] | Key-Value |
| [[00-lexique/llm\|LLM]] | Large Language Model |
| [[00-lexique/moe\|MoE]] | Mixture of Experts |
| [[00-lexique/nccl\|NCCL]] | NVIDIA Collective Communications Library |
| [[00-lexique/npu\|NPU]] | Neural Processing Unit |
| [[00-lexique/pcie\|PCIe]] | Peripheral Component Interconnect Express |
| [[00-lexique/pfc\|PFC]] | Priority Flow Control |
| [[00-lexique/quantification-q4\|Q4]] | Quantification 4-bit |
| [[00-lexique/rag\|RAG]] | Retrieval-Augmented Generation |
| [[00-lexique/ram\|RAM]] | Random Access Memory |
| [[00-lexique/rdma\|RDMA]] | Remote Direct Memory Access |
| [[00-lexique/roce\|RoCE]] | RDMA over Converged Ethernet |
| [[00-lexique/tflops\|TFLOPS]] | Tera Floating Point Operations Per Second |
| [[00-lexique/ttft\|TTFT]] | Time To First Token |
| [[00-lexique/vram\|VRAM]] | Video RAM |

---

## Fondations LLM

| Terme | Définition rapide |
| :-- | :-- |
| [[00-lexique/tokenisation\|Tokenisation]] | Découpage du texte en unités numériques traitées par le modèle. |
| [[00-lexique/embedding\|Embedding]] | Vecteur de coordonnées qui encode le sens d'un token. |
| [[00-lexique/attention\|Attention]] | Mécanisme qui pondère l'importance de chaque token dans le contexte. |

---

## Mémoire & performance

| Terme | Définition rapide |
| :-- | :-- |
| [[00-lexique/memory-wall\|Memory Wall]] | Limite de performance due aux transferts mémoire plutôt qu'au calcul. |
| [[00-lexique/memory-bandwidth\|Bande passante mémoire]] | Débit de transfert de données mémoire, souvent exprimé en Go/s. |
| [[00-lexique/prefill\|Prefill]] | Phase d'ingestion du prompt, plus parallèle. |
| [[00-lexique/decoding\|Decoding]] | Phase auto-régressive token par token, souvent memory-bound. |
| [[00-lexique/kv-cache\|KV Cache]] | Cache des clés/valeurs d'attention pour accélérer la génération. |
| [[00-lexique/tokens-per-second\|Tokens/s]] | Débit de génération mesuré en tokens par seconde. |

---

## Stack logicielle

| Terme | Définition rapide |
| :-- | :-- |
| [[00-lexique/pagedattention\|PagedAttention]] | Gestion du KV Cache par blocs virtuels ; clé de la production vLLM. |
| [[00-lexique/gguf\|GGUF]] | Format portable pour l'inférence locale avec llama.cpp/Ollama. |
| [[00-lexique/tensorrt-llm\|TensorRT-LLM]] | SDK NVIDIA de compilation ultra-optimisée pour GPU datacenter. |
| [[00-lexique/exo\|Exo]] | Orchestrateur P2P pour cluster IA de bureau (Mac Mini + Thunderbolt). |
| [[00-lexique/ray\|Ray]] | Framework distribué pour déploiement multi-nœuds en production. |
| [[00-lexique/pipeline-parallelism\|Pipeline Parallelism]] | Découpage d'un modèle en tranches de couches entre nœuds. |
| [[00-lexique/tensor-parallelism\|Tensor Parallelism]] | Découpage des matrices au sein d'un nœud multi-GPU NVLink. |
| [[00-lexique/thunderbolt\|Thunderbolt]] | Interconnexion bureau jusqu'à 80 Gb/s pour les clusters Exo. |

---

## Infrastructure & architecture

| Terme | Définition rapide |
| :-- | :-- |
| [[00-lexique/unified-memory\|Mémoire unifiée]] | Pool mémoire partagé CPU/GPU/NPU dans un SoC. |
| [[00-lexique/offloading\|Offloading]] | Déplacement partiel de poids/activations entre mémoires selon la capacité. |
| [[00-lexique/multi-gpu\|Multi-GPU]] | Plusieurs GPU pour plus de capacité et/ou de débit. |
| [[00-lexique/nvlink\|NVLink]] | Interconnexion GPU à haut débit (gammes pro/datacenter). |
| [[00-lexique/nvswitch\|NVSwitch]] | Fabric NVLink non bloquant entre tous les GPU d'un nœud HGX. |
| [[00-lexique/pcie\|PCIe]] | Bus standard CPU↔GPU ; goulot inter-GPU sans NVLink. |

---

## Réseau & Clustering

| Terme | Définition rapide |
| :-- | :-- |
| [[00-lexique/rdma\|RDMA]] | Transfert mémoire-à-mémoire sans copie CPU pour clusters multi-nœuds. |
| [[00-lexique/roce\|RoCE]] | RDMA sur Ethernet ; nécessite PFC + ECN pour être lossless. |
| [[00-lexique/infiniband\|InfiniBand]] | Fabric réseau dédié HPC/IA, lossless natif, ~400–800 Gb/s. |
| [[00-lexique/gpudirect-rdma\|GPUDirect RDMA]] | Transfert direct VRAM↔carte réseau sans copie CPU. |
| [[00-lexique/nccl\|NCCL]] | Bibliothèque NVIDIA de communication collective GPU-à-GPU. |
| [[00-lexique/pfc\|PFC]] | Priority Flow Control — pause par priorité pour réseau lossless RoCE. |
| [[00-lexique/ecn\|ECN]] | Explicit Congestion Notification — gestion proactive de la congestion. |

---

## Concepts fondateurs

| Terme | Définition rapide |
| :-- | :-- |
| [[00-lexique/on-premise\|On-Premise]] | Infrastructure IA hébergée sur les équipements propres de l'organisation. |
| [[00-lexique/llm\|LLM]] | Grand modèle de langage entraîné sur de vastes corpus textuels. |
| [[00-lexique/inference\|Inférence (LLM)]] | Utilisation d'un LLM entraîné pour générer du texte à la demande. |

---

## IA applicative

| Terme | Définition rapide |
| :-- | :-- |
| [[00-lexique/inference\|Inférence (LLM)]] | Utilisation d'un LLM entraîné pour générer du texte à la demande. |
| [[00-lexique/rag\|RAG]] | Architecture qui enrichit le contexte d'un LLM avec une base documentaire. |
| [[00-lexique/vectordb\|Base de données vectorielle]] | Stockage et recherche de documents par similarité d'embeddings. |
| [[00-lexique/graphrag\|GraphRAG]] | RAG basé sur un graphe de connaissances pour les requêtes globales. |
| [[00-lexique/memory-tree\|Memory Tree]] | Mémoire hiérarchique qui charge seulement les résumés et nœuds utiles. |
| [[00-lexique/autonomous-agent\|Agent autonome]] | LLM équipé d'outils qui raisonne en boucle pour accomplir des tâches. |
| [[00-lexique/agent-custodian\|Agent custodien]] | Agent de maintenance qui propose des corrections et attend validation humaine. |
| [[00-lexique/human-in-the-loop\|Human-in-the-loop]] | Gouvernance où l'humain valide les actions critiques avant application. |
| [[00-lexique/litellm\|LiteLLM]] | Gateway OpenAI-compatible pour router vers modèles locaux ou cloud. |
| [[00-lexique/smolagents\|SmolAgents]] | Framework léger Hugging Face pour agents souverains sans télémétrie cloud. |
| [[00-lexique/context-window\|Fenêtre de contexte]] | Nombre maximal de tokens que le modèle peut traiter en entrée active. |
| [[00-lexique/quantification\|Quantification]] | Réduction de précision numérique pour diminuer mémoire et coût de calcul. |
| [[00-lexique/moe\|MoE]] | Architecture avec experts spécialisés activés partiellement par token. |

---

## Évaluation des modèles

| Terme | Définition rapide |
| :-- | :-- |
| [[00-lexique/benchmark-llm\|Benchmark LLM]] | Jeu de tests standardisé pour comparer des modèles de langage. |
| [[00-lexique/llm-as-a-judge\|LLM-as-a-judge]] | Usage d'un LLM comme juge pour noter ou comparer des réponses. |
| [[00-lexique/ragas\|RAGAS]] | Framework d'évaluation des pipelines RAG : retrieval, fidélité et pertinence. |

---

## Chapitres liés

- [[01-fondations/memory-bandwidth]]
- [[01-fondations/unified-memory-vs-ram-vs-vram]]
