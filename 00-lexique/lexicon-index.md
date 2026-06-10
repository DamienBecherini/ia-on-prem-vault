---
title: Index du lexique
description: Liste alphabétique de toutes les fiches du lexique IA on-premise.
---

Liste générée automatiquement au build. Pour une lecture guidée, voir [[00-lexique/ai-glossary|Glossaire IA]].

| Terme | Définition |
| :-- | :-- |
| [⚡ SGLang](/00-lexique/sglang/) | Framework open-source d'inférence et de serving LLM, alternative à vLLM pour les workloads agentiques et les sorties structurées. |
| [🌳 RadixAttention](/00-lexique/radixattention/) | Technique de gestion du KV Cache par arbre de préfixes, introduite par SGLang pour réutiliser les contextes communs entre requêtes. |
| [🏢 Multi-tenant](/00-lexique/multi-tenant/) | Architecture SaaS IA où une même infrastructure sert plusieurs organisations isolées, avec risque de fuite inter-tenant en RAG. |
| [🔐 Zero Data Retention (ZDR)](/00-lexique/zero-data-retention/) | Clause contractuelle d'API cloud LLM garantissant l'absence de persistance, de réutilisation et de revue humaine des prompts et réponses. |
| [Agent autonome (LLM)](/00-lexique/autonomous-agent/) | Système où un LLM pilote lui-même des outils et des décisions pour accomplir une tâche multi-étapes. |
| [Agent custodien](/00-lexique/agent-custodian/) | Agent autonome chargé de maintenir un vault, dépôt ou corpus documentaire en proposant des corrections validées par l'humain. |
| [Appel d'outils (Tool / Function Calling)](/00-lexique/appel-outils/) | Capacité d'un LLM à émettre des requêtes structurées vers des fonctions externes (API, SQL, code) plutôt que du texte libre. |
| [APU](/00-lexique/apu/) | Puce combinant CPU, GPU et NPU sur un même SoC, avec mémoire unifiée partagée. |
| [Attention (mécanisme)](/00-lexique/attention/) | Mécanisme central du Transformer qui permet à chaque token de pondérer l'importance des autres tokens du contexte. |
| [Bande passante mémoire](/00-lexique/memory-bandwidth/) | Débit auquel la mémoire alimente les unités de calcul. |
| [Base de données vectorielle](/00-lexique/vectordb/) | Base de données spécialisée dans le stockage et la recherche de vecteurs d'embeddings pour le RAG. |
| [Benchmark LLM](/00-lexique/benchmark-llm/) | Jeu de tests standardisé pour comparer les capacités, limites et risques de modèles de langage. |
| [Decoding](/00-lexique/decoding/) | Phase de génération auto-régressive token par token. |
| [ECN](/00-lexique/ecn/) | Explicit Congestion Notification — mécanisme de signalement de congestion réseau utilisé avec RoCE pour éviter les pertes de paquets. |
| [Embedding](/00-lexique/embedding/) | Représentation numérique dense d'un token ou d'un document dans un espace vectoriel. |
| [Excessive Agency](/00-lexique/excessive-agency/) | Vulnérabilité OWASP LLM06 (2025) — un agent IA dispose de trop de fonctionnalités, permissions ou autonomie, permettant des actions réelles non souhaitées. |
| [Exo](/00-lexique/exo/) | Orchestrateur P2P open-source pour fusionner la mémoire de plusieurs machines en un cluster IA local. |
| [Fenêtre de contexte](/00-lexique/context-window/) | Nombre maximal de tokens qu'un LLM peut traiter en entrée active — détermine le coût mémoire dynamique de l'inférence. |
| [GGUF](/00-lexique/gguf/) | Format de fichier portable pour l'inférence locale avec llama.cpp, optimisé pour les quantifications K-quant. |
| [GPUDirect RDMA](/00-lexique/gpudirect-rdma/) | Mécanisme permettant aux GPU d'échanger des données directement avec des périphériques réseau sans copie CPU. |
| [GraphRAG](/00-lexique/graphrag/) | Évolution du RAG basée sur un graphe de connaissances plutôt qu'une base vectorielle. |
| [HBM](/00-lexique/hbm/) | Mémoire empilée à très haute bande passante, utilisée sur les accélérateurs IA professionnels. |
| [Human-in-the-loop](/00-lexique/human-in-the-loop/) | Mode de gouvernance où une action automatisée importante attend une validation humaine avant d'être appliquée. |
| [Inférence (LLM)](/00-lexique/inference/) | Utilisation d'un modèle entraîné pour générer du texte à la demande. |
| [InfiniBand](/00-lexique/infiniband/) | Fabric réseau dédié hautes performances pour les clusters GPU, standard HPC et datacenter IA. |
| [KV Cache](/00-lexique/kv-cache/) | Cache des clés/valeurs d'attention utilisé pendant la génération. |
| [LangGraph](/00-lexique/langgraph/) | Framework de graphe d'états pour orchestrer des agents LLM multi-étapes avec boucles, mémoire et contrôle de flux. |
| [LiteLLM](/00-lexique/litellm/) | Gateway OpenAI-compatible qui route les appels LLM vers des modèles locaux ou cloud depuis une interface unique. |
| [LLM](/00-lexique/llm/) | Large Language Model. |
| [LLM-as-a-judge](/00-lexique/llm-as-a-judge/) | Technique d'évaluation où un modèle de langage sert de juge pour noter ou comparer des réponses. |
| [Mémoire unifiée](/00-lexique/unified-memory/) | Architecture mémoire partagée entre CPU/GPU/NPU. |
| [Memory Tree](/00-lexique/memory-tree/) | Architecture mémoire qui organise documents et résumés en arbre hiérarchique pour limiter le contexte injecté au LLM. |
| [Memory Wall](/00-lexique/memory-wall/) | Limite de performance causée par la mémoire plus que par le calcul. |
| [MoE](/00-lexique/moe/) | Mixture of Experts — architecture où seuls certains sous-réseaux sont activés par token, permettant des modèles énormes avec un coût d'inférence maîtrisé. |
| [Multi-GPU](/00-lexique/multi-gpu/) | Utilisation conjointe de plusieurs GPU. |
| [NCCL](/00-lexique/nccl/) | Bibliothèque NVIDIA de communication collective optimisée pour les transferts GPU-à-GPU à grande échelle. |
| [NPU](/00-lexique/npu/) | Neural Processing Unit — accélérateur spécialisé IA intégré aux SoC modernes, utile pour certaines tâches mais limité pour les grands LLM. |
| [NVLink](/00-lexique/nvlink/) | Interconnexion haut débit entre GPU NVIDIA. |
| [NVSwitch](/00-lexique/nvswitch/) | Commutateur NVIDIA qui connecte plusieurs GPU en un fabric NVLink totalement non bloquant à l'intérieur d'un nœud. |
| [Offloading](/00-lexique/offloading/) | Technique qui place une partie du modèle en RAM ou sur SSD quand la VRAM est insuffisante, au prix d'un débit réduit. |
| [Ollama](/00-lexique/ollama/) | Runtime local simplifié pour télécharger et exécuter des LLM via llama.cpp, avec API OpenAI-compatible. |
| [On-Premise (IA)](/00-lexique/on-premise/) | Infrastructure IA hébergée et opérée sur les équipements propres de l'organisation, sans délégation à un fournisseur cloud. |
| [PagedAttention](/00-lexique/pagedattention/) | Technique de gestion du KV Cache par blocs de mémoire virtuelle, popularisée par vLLM. |
| [PCIe](/00-lexique/pcie/) | Bus d'interconnexion haut débit entre composants. |
| [PFC](/00-lexique/pfc/) | Priority Flow Control — mécanisme Ethernet de pause par priorité pour garantir un réseau lossless nécessaire à RoCE. |
| [Pipeline Parallelism](/00-lexique/pipeline-parallelism/) | Stratégie de distribution d'un LLM en tranches de couches entre plusieurs machines. |
| [Prefill](/00-lexique/prefill/) | Phase d'inférence qui traite le prompt initial en parallèle avant la génération mot à mot. |
| [Prompt injection](/00-lexique/prompt-injection/) | Attaque où du contenu non fiable dans le contexte du LLM détourne ses instructions système pour exfiltrer des données ou exécuter des actions non autorisées. |
| [Quantification](/00-lexique/quantification/) | Réduction de précision numérique des poids d'un LLM pour diminuer l'empreinte mémoire et accélérer l'inférence. |
| [Quantification Q4](/00-lexique/quantification-q4/) | Format de quantification 4-bit le plus utilisé en pratique pour l'inférence locale — en particulier Q4_K_M dans l'écosystème GGUF/Ollama. |
| [RAG](/00-lexique/rag/) | Architecture qui combine recherche documentaire et génération LLM pour ancrer les réponses dans des sources internes. |
| [RAGAS](/00-lexique/ragas/) | Framework d'évaluation automatique pour pipelines RAG. |
| [RAM](/00-lexique/ram/) | Mémoire vive système, second choix pour l'inférence LLM quand la VRAM est insuffisante. |
| [Ray](/00-lexique/ray/) | Framework de calcul distribué pour l'orchestration multi-nœuds de LLM en production. |
| [RDMA](/00-lexique/rdma/) | Accès mémoire distant direct sans copie CPU classique. |
| [RoCE](/00-lexique/roce/) | Implémentation d'RDMA sur Ethernet convergé. |
| [SmolAgents](/00-lexique/smolagents/) | Framework léger de Hugging Face pour l'orchestration agentique locale, alternative souveraine à LangChain. |
| [Speculative Decoding](/00-lexique/speculative-decoding/) | Technique d'accélération d'inférence où un petit modèle rapide génère des tokens candidats que le grand modèle vérifie en un seul passage. Nécessite deux modèles chargés simultanément. |
| [Tensor Parallelism](/00-lexique/tensor-parallelism/) | Stratégie de distribution d'un LLM par découpage des matrices mathématiques entre plusieurs GPU d'un même nœud. |
| [TensorRT-LLM](/00-lexique/tensorrt-llm/) | SDK NVIDIA de compilation et d'inférence ultra-optimisée pour GPU datacenter. |
| [TFLOPS](/00-lexique/tflops/) | Mesure de débit de calcul en opérations flottantes. |
| [Thunderbolt](/00-lexique/thunderbolt/) | Interface câblée haut débit pour postes de travail et clusters de bureau IA. |
| [Tokenisation](/00-lexique/tokenisation/) | Découpage d'un texte en unités numériques (tokens) avant traitement par un LLM. |
| [Tokens par seconde](/00-lexique/tokens-per-second/) | Mesure du débit de génération d'un modèle. |
| [TTFT](/00-lexique/ttft/) | Time To First Token. |
| [vLLM](/00-lexique/vllm/) | Moteur open-source d'inférence LLM haut débit pour GPU NVIDIA/AMD, standard de production multi-utilisateurs. |
| [VRAM](/00-lexique/vram/) | Mémoire vidéo dédiée au GPU. |
