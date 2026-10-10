---
title: Index du lexique
description: Index alphabétique de toutes les fiches du lexique de l'IA on-premise : LLM, VRAM, KV Cache, quantification, interconnexions et autres notions du vault.
---

Liste générée automatiquement au build. Pour une lecture guidée, voir [[00-lexique/ai-glossary|Glossaire IA]].

| Terme | Définition |
| :-- | :-- |
| [⚡ SGLang](/00-lexique/sglang/) | Framework open-source d'inférence et de serving LLM, alternative à vLLM pour les workloads agentiques et les sorties structurées. |
| [🌳 RadixAttention](/00-lexique/radixattention/) | Technique de gestion du KV Cache par arbre de préfixes, introduite par SGLang pour réutiliser les contextes communs entre requêtes. |
| [🏢 Multi-tenant](/00-lexique/multi-tenant/) | Architecture SaaS IA où une même infrastructure sert plusieurs organisations isolées, avec risque de fuite inter-tenant en RAG. |
| [🔐 Zero Data Retention (ZDR)](/00-lexique/zero-data-retention/) | Clause contractuelle d'API cloud LLM : ni persistance, ni réutilisation, ni revue humaine des prompts et réponses pour les modèles et endpoints couverts. |
| [Agent autonome (LLM)](/00-lexique/autonomous-agent/) | Système où un LLM pilote lui-même des outils et des décisions pour accomplir une tâche multi-étapes. |
| [Agent custodien](/00-lexique/agent-custodian/) | Agent autonome chargé de maintenir un vault, dépôt ou corpus documentaire en proposant des corrections validées par l'humain. |
| [Appel d'outils (Tool / Function Calling)](/00-lexique/appel-outils/) | Capacité d'un LLM à émettre des requêtes structurées vers des fonctions externes (API, SQL, code) plutôt que du texte libre. |
| [APU](/00-lexique/apu/) | Puce combinant CPU, GPU et NPU sur un même SoC, avec mémoire unifiée partagée. |
| [Attention (mécanisme)](/00-lexique/attention/) | Mécanisme central du Transformer qui permet à chaque token de pondérer l'importance des autres tokens du contexte. |
| [Bande passante mémoire](/00-lexique/memory-bandwidth/) | Quantité de données transférées par seconde entre la mémoire et le processeur ou le GPU, en Go/s ; indicateur clé pour estimer la fluidité de la génération. |
| [Base de données vectorielle](/00-lexique/vectordb/) | Base de données spécialisée dans le stockage et la recherche de vecteurs d'embeddings pour le RAG. |
| [Benchmark LLM](/00-lexique/benchmark-llm/) | Jeu de tests standardisé pour comparer les capacités, limites et risques de modèles de langage. |
| [Decoding](/00-lexique/decoding/) | Phase de génération où le modèle prédit un token à la fois en relisant le KV Cache ; elle gouverne les tokens par seconde et se heurte au Memory Wall. |
| [ECN](/00-lexique/ecn/) | Explicit Congestion Notification — mécanisme de signalement de congestion réseau utilisé avec RoCE pour éviter les pertes de paquets. |
| [Embedding](/00-lexique/embedding/) | Représentation numérique dense d'un token ou d'un document dans un espace vectoriel. |
| [Excessive Agency](/00-lexique/excessive-agency/) | Vulnérabilité du Top 10 OWASP pour LLM : un agent IA dispose de trop de fonctionnalités, de permissions ou d'autonomie, d'où des actions réelles non voulues. |
| [Exo](/00-lexique/exo/) | Orchestrateur P2P open-source pour fusionner la mémoire de plusieurs machines en un cluster IA local. |
| [Fenêtre de contexte](/00-lexique/context-window/) | Nombre maximal de tokens qu'un LLM peut traiter en entrée active — détermine le coût mémoire dynamique de l'inférence. |
| [GGUF](/00-lexique/gguf/) | Format de fichier portable pour l'inférence locale avec llama.cpp, optimisé pour les quantifications K-quant. |
| [GPUDirect RDMA](/00-lexique/gpudirect-rdma/) | Mécanisme permettant aux GPU d'échanger des données directement avec des périphériques réseau sans copie CPU. |
| [GraphRAG](/00-lexique/graphrag/) | Évolution du RAG basée sur un graphe de connaissances plutôt qu'une base vectorielle. |
| [HBM](/00-lexique/hbm/) | Mémoire empilée à très haute bande passante, utilisée sur les accélérateurs IA professionnels. |
| [Human-in-the-loop](/00-lexique/human-in-the-loop/) | Mode de gouvernance où une action automatisée importante attend une validation humaine avant d'être appliquée. |
| [Inférence (LLM)](/00-lexique/inference/) | Phase où un LLM déjà entraîné produit une réponse token par token, en deux temps (prefill puis decoding) ; c'est elle qui dimensionne le matériel on-premise. |
| [InfiniBand](/00-lexique/infiniband/) | Fabric réseau dédié hautes performances pour les clusters GPU, standard HPC et datacenter IA. |
| [KV Cache](/00-lexique/kv-cache/) | Mémoire qui conserve les clés et valeurs d'attention déjà calculées pour éviter de les recalculer, mais dont la taille croît avec le contexte. |
| [LangGraph](/00-lexique/langgraph/) | Framework de graphe d'états pour orchestrer des agents LLM multi-étapes avec boucles, mémoire et contrôle de flux. |
| [LiteLLM](/00-lexique/litellm/) | Gateway OpenAI-compatible qui route les appels LLM vers des modèles locaux ou cloud depuis une interface unique. |
| [LLM](/00-lexique/llm/) | Modèle IA entraîné sur de très grands corpus de texte, souvent de type Transformer ; en local, ses performances dépendent autant de la mémoire que du modèle. |
| [LLM-as-a-judge](/00-lexique/llm-as-a-judge/) | Technique d'évaluation où un modèle de langage sert de juge pour noter ou comparer des réponses. |
| [Mémoire unifiée](/00-lexique/unified-memory/) | Architecture où CPU, GPU et parfois NPU partagent un même pool mémoire, évitant certaines copies via PCIe ; présente sur Apple Silicon et des APU AMD récents. |
| [Memory Tree](/00-lexique/memory-tree/) | Architecture mémoire qui organise documents et résumés en arbre hiérarchique pour limiter le contexte injecté au LLM. |
| [Memory Wall](/00-lexique/memory-wall/) | Situation où le débit mémoire limite la performance plus que la puissance de calcul, surtout en génération auto-régressive ; à ne pas juger sur les TFLOPS. |
| [MoE](/00-lexique/moe/) | Mixture of Experts — architecture où seuls certains sous-réseaux sont activés par token, permettant des modèles énormes avec un coût d'inférence maîtrisé. |
| [Multi-GPU](/00-lexique/multi-gpu/) | Architecture à plusieurs GPU dans une machine ou un cluster pour augmenter la mémoire et le débit ; les gains dépendent de l'interconnexion (PCIe, NVLink). |
| [NCCL](/00-lexique/nccl/) | Bibliothèque NVIDIA de communication collective optimisée pour les transferts GPU-à-GPU à grande échelle. |
| [NPU](/00-lexique/npu/) | Neural Processing Unit — accélérateur spécialisé IA intégré aux SoC modernes, utile pour certaines tâches mais limité pour les grands LLM. |
| [NVLink](/00-lexique/nvlink/) | Lien matériel dédié qui relie les GPU NVIDIA à très haute vitesse en contournant le bus PCIe ; il a disparu des cartes workstation et grand public récentes. |
| [NVSwitch](/00-lexique/nvswitch/) | Commutateur NVIDIA qui connecte plusieurs GPU en un fabric NVLink totalement non bloquant à l'intérieur d'un nœud. |
| [Offloading](/00-lexique/offloading/) | Technique qui place une partie du modèle en RAM ou sur SSD quand la VRAM est insuffisante, au prix d'un débit réduit. |
| [Ollama](/00-lexique/ollama/) | Runtime local simplifié pour télécharger et exécuter des LLM via llama.cpp ou MLX, avec API OpenAI-compatible. |
| [On-Premise (IA)](/00-lexique/on-premise/) | Infrastructure IA hébergée et opérée sur les équipements propres de l'organisation, sans délégation à un fournisseur cloud. |
| [PagedAttention](/00-lexique/pagedattention/) | Technique de gestion du KV Cache par blocs de mémoire virtuelle, popularisée par vLLM. |
| [PCIe](/00-lexique/pcie/) | Bus standard reliant CPU, GPU, SSD et autres périphériques ; il limite l'offloading CPU vers GPU et le Tensor Parallelism sur les setups multi-GPU sans NVLink. |
| [PFC](/00-lexique/pfc/) | Priority Flow Control — mécanisme Ethernet de pause par priorité pour garantir un réseau lossless nécessaire à RoCE. |
| [Pipeline Parallelism](/00-lexique/pipeline-parallelism/) | Stratégie de distribution d'un LLM en tranches de couches entre plusieurs machines. |
| [Prefill](/00-lexique/prefill/) | Phase d'inférence qui traite le prompt initial en parallèle avant la génération mot à mot. |
| [Prompt injection](/00-lexique/prompt-injection/) | Attaque où du contenu non fiable dans le contexte du LLM détourne ses instructions système pour exfiltrer des données ou exécuter des actions non autorisées. |
| [Quantification](/00-lexique/quantification/) | Réduction de précision numérique des poids d'un LLM pour diminuer l'empreinte mémoire et accélérer l'inférence. |
| [Quantification Q4](/00-lexique/quantification-q4/) | Format de quantification 4-bit le plus utilisé en pratique pour l'inférence locale — en particulier Q4_K_M dans l'écosystème GGUF/Ollama. |
| [RAG](/00-lexique/rag/) | Architecture qui combine recherche documentaire et génération LLM pour ancrer les réponses dans des sources internes. |
| [RAGAS](/00-lexique/ragas/) | Framework qui évalue un système RAG en séparant la qualité du retrieval et la fidélité de la réponse, pour diagnostiquer où le pipeline échoue. |
| [RAM](/00-lexique/ram/) | Mémoire vive système, second choix pour l'inférence LLM quand la VRAM est insuffisante. |
| [Ray](/00-lexique/ray/) | Framework de calcul distribué pour l'orchestration multi-nœuds de LLM en production. |
| [RDMA](/00-lexique/rdma/) | Technique réseau qui lit et écrit en mémoire distante sans passer par le CPU, avec faible latence ; elle se décline en InfiniBand et en RoCE. |
| [RoCE](/00-lexique/roce/) | Protocole qui apporte les bénéfices du RDMA sur Ethernet standard, sans fabric InfiniBand dédié, au prix d'un réseau lossless à configurer (PFC, ECN). |
| [SmolAgents](/00-lexique/smolagents/) | Framework léger de Hugging Face pour l'orchestration agentique locale, alternative souveraine à LangChain. |
| [Speculative Decoding](/00-lexique/speculative-decoding/) | Technique d'accélération de l'inférence où un petit modèle rapide propose des tokens que le grand modèle vérifie en un passage ; deux modèles sont à charger. |
| [Tensor Parallelism](/00-lexique/tensor-parallelism/) | Stratégie de distribution d'un LLM par découpage des matrices mathématiques entre plusieurs GPU d'un même nœud. |
| [TensorRT-LLM](/00-lexique/tensorrt-llm/) | SDK NVIDIA d'inférence LLM optimisée (PyTorch natif, FP8/NVFP4) pour GPU datacenter. |
| [TFLOPS](/00-lexique/tflops/) | Unité qui mesure la capacité de calcul flottant par seconde ; utile pour comparer le calcul brut, mais insuffisante pour prédire les performances d'un LLM. |
| [Thunderbolt](/00-lexique/thunderbolt/) | Interface câblée haut débit pour postes de travail et clusters de bureau IA. |
| [Tokenisation](/00-lexique/tokenisation/) | Découpage d'un texte en unités numériques (tokens) avant traitement par un LLM. |
| [Tokens par seconde](/00-lexique/tokens-per-second/) | Nombre de tokens générés par seconde en phase de génération ; indicateur de fluidité, à interpréter avec le TTFT selon le modèle, le moteur et le matériel. |
| [TTFT](/00-lexique/ttft/) | Time To First Token : délai entre l'envoi d'une requête et le premier token de réponse, qui reflète surtout le prefill et complète la métrique tokens/s. |
| [vLLM](/00-lexique/vllm/) | Moteur open-source d'inférence LLM haut débit pour GPU NVIDIA/AMD, standard de production multi-utilisateurs. |
| [VRAM](/00-lexique/vram/) | Mémoire à haut débit attachée au GPU, qui stocke poids, KV Cache et buffers ; capacité et bande passante déterminent quels modèles tournent sans offloading. |
