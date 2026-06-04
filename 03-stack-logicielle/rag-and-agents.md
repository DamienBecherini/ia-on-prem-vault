---
title: "🧩 RAG & Agents : L'architecture de la connaissance"
description: Comment donner une mémoire privée et de l'autonomie à un LLM local. Du RAG standard aux workflows agentiques (SmolAgents, LangGraph) et l'approche Memory Tree pour l'économie de VRAM.
sidebar:
  order: 3
---

Un [[00-lexique/llm|LLM]] "nu" qui sort d'usine est figé dans le temps. Ses poids internes contiennent une vaste culture générale, mais il ignore tout de vos documents d'entreprise, de vos réunions de la veille ou de l'état de votre base de données. Pire : si vous tentez de lui apprendre ces informations via un réentraînement (Fine-Tuning), cela vous coûtera très cher pour un résultat souvent décevant sur la restitution de faits précis.

Pour transformer ce moteur statistique aveugle en un assistant d'entreprise souverain, la solution logicielle standard est le **RAG** (Retrieval-Augmented Generation)[^1]. Et depuis 2025, ce concept a évolué vers des **Workflows Agentiques** autonomes.

---

## 1. Le RAG Standard : La recherche vectorielle

L'approche RAG classique (très populaire entre 2023 et 2024) est une chaîne linéaire :
1.  **Ingestion :** Vos documents (PDF, Word, Code) sont découpés en petits blocs (les *chunks*). Un modèle spécialisé convertit ces blocs en listes de nombres (Embeddings) et les stocke dans une **[[00-lexique/vectordb|Base de Données Vectorielle]]** (comme Qdrant, Milvus ou Chroma).
2.  **Recherche :** Quand l'utilisateur pose une question, le système cherche les blocs les plus mathématiquement proches de la question.
3.  **Génération :** Le système colle ces blocs dans le prompt de l'utilisateur de manière invisible, puis envoie le tout au LLM pour générer la réponse.

### ⚠️ La limite physique (Le mur du KV Cache)
Le RAG standard a un défaut d'architecture en local : il est aveugle. Pour être sûr de ne rien rater, le développeur configure souvent la base pour renvoyer les 20 meilleurs résultats. Le prompt final gonfle démesurément, saturant la [[00-lexique/context-window|Fenêtre de contexte]] du modèle.
Comme nous l'avons vu au chapitre matériel, un contexte géant fait exploser la taille du **[[01-fondations/kv-cache-and-context|KV Cache]]**, détruisant la VRAM de votre serveur et effondrant vos performances en [[00-lexique/inference|inférence]][^2].

---

## 2. L'Évolution 2026 : Agentic RAG et GraphRAG

Pour éviter de saturer la mémoire avec des informations inutiles, le marché a basculé vers le **RAG Agentique** (*Agentic RAG*)[^1][^3]. Au lieu d'être un tuyau passif, le LLM devient le pilote.

### Le framework de l'Agent
Grâce à des bibliothèques comme [[00-lexique/smolagents|SmolAgents]] (Hugging Face) ou LangGraph, le développeur donne au LLM des **Outils** (*Tool Calling* / *Function Calling*).
Le déroulé devient dynamique :
1. L'utilisateur pose une question complexe.
2. L'Agent réfléchit : *"Ai-je besoin de chercher dans la base RH ou dans le code source ?"*
3. L'Agent appelle l'outil de recherche, lit un résumé, et décide **lui-même** si l'information est suffisante ou s'il doit faire une nouvelle recherche affine, avant de rédiger sa réponse finale[^4].

### Le GraphRAG
Popularisé par les recherches de Microsoft, le **[[00-lexique/graphrag|GraphRAG]]** remplace la base vectorielle "bête" par un **Knowledge Graph** (Graphe de connaissances)[^5]. Le système extrait les entités (Personnes, Lieux, Concepts) et leurs relations. Cela permet au LLM de répondre à des questions globales (ex: *"Quels sont les thèmes principaux abordés par l'équipe produit ce mois-ci ?"*) qui faisaient systématiquement échouer le RAG vectoriel classique.

---

## 3. L'approche [[00-lexique/memory-tree|Memory Tree]]

Plutôt que d'utiliser une lourde base vectorielle, une architecture alternative s'appuie sur des **dossiers Markdown hiérarchiques** et une base de métadonnées SQLite locale[^6]. L'idée est de donner à l'agent une vue *résumée* de la connaissance disponible, et de ne charger le détail que si nécessaire. Ce pattern est détaillé dans la fiche [[00-lexique/memory-tree|Memory Tree]].

*   **Hiérarchie :** L'agent ne charge jamais un document entier en mémoire. Il utilise le LLM pour lire le "titre" et un "résumé d'une ligne" de l'arbre des fichiers.
*   **Injection sélective :** S'il juge un fichier pertinent, l'agent appelle une fonction pour "déplier" ce nœud spécifique de l'arbre et lire son contenu exact.
*   **Avantage architectural :** Le contexte reste minuscule (quelques centaines de tokens pour les résumés), ce qui maintient le [[00-lexique/ttft|TTFT]] (Temps avant le premier mot) sous la seconde et préserve les ressources matérielles, même avec un modèle dense lourd.

> [!tip] Pour aller plus loin
> Cette approche est implémentée par plusieurs assistants personnels locaux — avec des degrés de souveraineté variables selon les projets. Voir le comparatif [[05-agents-et-assistants-on-prem/assistants-personnels/index|Assistants Personnels On-Premise]] et la fiche [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] pour un exemple Memory Tree documenté.

---

## 📋 Le Conseil de l'Architecte

Pour construire une stack logicielle d'entreprise souveraine en 2026 :

1.  **Dédiez un petit modèle au routage :** N'utilisez pas votre gros modèle 70B pour choisir quel outil appeler. Utilisez un modèle ultra-rapide (ex: Qwen 2.5 7B ou Llama 3 8B) configuré spécifiquement pour le *Function Calling*. Il appellera la base de données.
2.  **Gardez les gros modèles pour la synthèse :** Une fois les bons blocs de texte récupérés par le petit agent, envoyez le tout au modèle lourd (le "cerveau") pour rédiger la réponse finale.
3.  **Évitez les dépendances Cloud :** Si vous utilisez LangChain ou LlamaIndex, auditez la télémétrie. En on-premise pur, des frameworks minimalistes comme [[00-lexique/smolagents|SmolAgents]] garantissent que vos prompts ne fuiteront pas vers une API externe pendant l'orchestration[^4].

---

## 📚 Sources et Références

[^1]: Lyzr Blog, *What is Agentic RAG? Everything You Need to Know in 2026* (Évolution des pipelines statiques vers l'adaptation intelligente), Janvier 2026.
[^2]: NVIDIA Technical Blog, *Mastering LLM Techniques: Inference Optimization* (Impact du contexte long sur le KV Cache), Novembre 2023.
[^3]: Vinod Rane (Medium), *Next-Generation Agentic RAG with LangGraph (2026 Edition)* (Graph orchestration, self-correcting RAG), Mars 2026.
[^4]: Hugging Face, *Agentic RAG with SmolAgents* (RAG orchestration via Hugging Face light framework), 2025.
[^5]: Neo4j Developer Blog, *What is agentic RAG? A developer's guide* (GraphRAG, ReAct, multi-agent RAG patterns), Mai 2026.
[^6]: OpenHuman, *Memory Trees* (GitBook — pipeline local SQLite + Markdown, injection sélective pour économie VRAM), 2025. Note : OpenHuman utilise par défaut un backend cloud pour le routage des modèles. Le *pattern* Memory Tree reste applicable dans une implémentation 100% on-premise indépendante du projet.