---
title: "🧩 RAG & Agents : L'architecture de la connaissance"
description: Comment donner une mémoire privée et de l'autonomie à un LLM local. Du RAG standard aux workflows agentiques (SmolAgents, LangGraph) et l'approche Memory Tree pour l'économie de VRAM.
sidebar:
  order: 3
last_modified: "2026-06-10"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] En bref
> Un LLM seul ignore vos documents. Le RAG lui donne accès à votre base documentaire sans réentraînement. Les agents ajoutent la capacité d'agir et de raisonner en boucle. Ensemble, ils forment l'ossature d'un assistant d'entreprise souverain.

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

## 4. Choisir sa base de données vectorielle

Le choix de la base vectorielle dépend du volume de données, du niveau de souveraineté requis et des ressources disponibles.

| Solution | Type | Points forts | Limites | Idéal pour |
| :-- | :-- | :-- | :-- | :-- |
| **Chroma** | In-process (Python) | Zéro configuration, embarqué | Pas adapté à > 1 M chunks | Prototypage, labo dev |
| **Qdrant** | Serveur Docker | Filtrage payload riche, REST/gRPC, scalable | Infra à gérer | PME, production moderée |
| **Milvus** | Serveur distribué | Milliards de vecteurs, haute disponibilité | Complexe à opérer | Datacenter, gros volumes |
| **pgvector** | Extension PostgreSQL | Vecteurs dans la base existante | Performances < bases natives | SI existant sous Postgres |
| **SQLite + vss** | Fichier local | Zéro dépendance, souveraineté max | Pas de scalabilité H | Solo, Memory Tree patterns |

> [!tip] Démarrage rapide avec Qdrant en local
> ```bash
> # Lancer Qdrant en Docker (données persistantes dans ./qdrant_storage)
> docker run -p 6333:6333 -p 6334:6334 \
>   -v ./qdrant_storage:/qdrant/storage \
>   qdrant/qdrant
>
> # Créer une collection via l'API REST
> curl -X PUT http://localhost:6333/collections/ma-base \
>   -H 'Content-Type: application/json' \
>   -d '{"vectors": {"size": 1024, "distance": "Cosine"}}'
> ```

## 5. RAG multi-locataire : cloisonnement des embeddings

Dans les déploiements **[[00-lexique/multi-tenant|multi-tenant]]** — un serveur d'inférence mutualisé pour plusieurs organisations ou équipes — le RAG introduit un risque de sécurité critique : la fuite de documents d'un locataire vers les résultats de recherche d'un autre.

L'OWASP a formellement classifié ce risque dans son Top 10 LLM 2025 sous **LLM08 : Vector and Embedding Weaknesses**[^7]. Une implémentation naïve de base vectorielle sans isolation par tenant peut permettre à une requête du "Client B" de remonter des embeddings appartenant au "Client A".

### Pattern 1 — Row-Level Security avec pgvector

Si votre infrastructure repose déjà sur **PostgreSQL**, l'extension `pgvector` permet de stocker les embeddings dans la même base. Le cloisonnement s'appuie sur le mécanisme natif de **Row-Level Security (RLS)** du moteur[^8] :

```sql
-- Activer RLS sur la table des embeddings
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Politique : chaque tenant ne voit que ses propres lignes
CREATE POLICY tenant_isolation ON documents
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- À l'exécution : positionner le tenant avant chaque recherche
SET app.current_tenant = '{{tenant_uuid}}';
SELECT content, embedding <=> query_embedding AS distance
FROM documents ORDER BY distance LIMIT 5;
```

**Avantage :** le moteur PostgreSQL applique le filtre tenant au plus bas niveau — une requête mal formée au niveau applicatif ne peut pas contourner la politique. Le cloisonnement est **mathématiquement garanti par la base**, pas par la logique applicatif.

**Limite :** les performances de `pgvector` restent inférieures à celles d'une base vectorielle native pour des volumes supérieurs à ~1 M embeddings.

### Pattern 2 — Payload-based partitioning avec Qdrant

Qdrant recommande nativement une architecture de collection unique exploitant le **Payload-based Partitioning**[^9]. Chaque embedding est indexé avec un payload `tenant_id`, et les clés d'accès vectorielles sont scopées à un tenant au moment de la recherche :

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

client = QdrantClient(url="http://localhost:6333")

# Recherche scopée : seuls les vecteurs du tenant courant sont comparés
results = client.search(
    collection_name="documents",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[FieldCondition(
            key="tenant_id",
            match=MatchValue(value=current_tenant_id)
        )]
    ),
    limit=5
)
```

**Avantage :** une seule collection, pas de multiplications de collections par tenant (ce qui ferait s'effondrer le cluster à grande échelle). Le filtre payload est appliqué avant le calcul de similarité vectorielle.

> [!warning] Isolation applicative ≠ isolation mathématique
> Ne jamais se reposer uniquement sur un filtre applicatif Python/Node pour le cloisonnement multi-tenant. Si le filtre est omis par erreur (bug, refactoring), les données d'un tenant fuient. Le RLS PostgreSQL et le payload Qdrant garantissent l'isolation au niveau moteur, indépendamment du code applicatif.

---

## 6. FinOps : routage CPU/GPU et pré-filtrage RAG

L'inférence GPU coûte cher. Une architecture bien conçue réserve le GPU à la seule tâche où il est irremplaçable — la **génération de texte** — et délègue les tâches auxiliaires au CPU.

### Routage CPU/GPU

| Tâche | Moteur recommandé | Matériel |
| :-- | :-- | :-- |
| Génération de texte (LLM) | vLLM, SGLang | GPU (VRAM exclusive) |
| Génération d'embeddings | `nomic-embed-text`, `mxbai-embed` via Ollama | **CPU** |
| Transcription vocale (STT) | `faster-whisper` (CTranslate2)[^10] | **CPU** |
| Re-ranking, scoring | CrossEncoder léger | **CPU** |

`faster-whisper` (implémentation Whisper de SYSTRAN sur le moteur CTranslate2) peut transcrire en temps réel des audio courts directement sur CPU, sans utiliser un seul octet de VRAM[^10]. Les modèles d'embedding comme `nomic-embed-text` sont suffisamment petits pour s'exécuter efficacement en batch asynchrone sur CPU.

**Bénéfice :** 100 % de la VRAM du GPU reste disponible pour la génération. Sur un serveur 2× L40S (96 Go), ce routage peut doubler ou tripler le nombre d'utilisateurs simultanés servis par rapport à une configuration où les embeddings et Whisper partagent la VRAM.

### Pré-filtrage RAG : le levier FinOps le plus puissant

L'erreur classique est d'envoyer au LLM l'intégralité des documents récupérés par la base vectorielle. Les API cloud facturent au token ; les modèles locaux saturent leur fenêtre de contexte.

Le principe : **c'est le microservice Python qui exécute la recherche sémantique, pas le LLM.** Le LLM ne reçoit que les K meilleurs résultats, tronqués à quelques centaines de tokens chacun :

```python
# Le Python sélectionne le Top-K avant d'appeler le LLM
top_chunks = vector_db.search(query_embedding, limit=3)

# Le LLM ne reçoit que le contexte pertinent — jamais la base entière
context = "\n\n".join([chunk.text for chunk in top_chunks])
response = llm.generate(prompt=f"Contexte :\n{context}\n\nQuestion : {user_query}")
```

Sur un cas d'usage de type "copilot documentaire", passer de 20 résultats (pratique courante) à 3 résultats filtrés réduit les tokens envoyés au LLM d'un facteur 5 à 10, sans dégradation perceptible de la qualité si la recherche sémantique est bien calibrée.

> [!tip] Voir aussi
> Pour la stratégie FinOps côté matériel (L40S vs A100, TCO par token), voir [[04-blueprints/tco-comparison|💰 Comparaison TCO]] et [[02-materiel/stations-multi-gpu|🧩 Stations Multi-GPU]].

---

## 7. Architecture de référence — Stack RAG souveraine

```mermaid
flowchart TD
    A["Documents\n(PDF, MD, DOCX)"] --> B["Chunking + Embedding\n(nomic-embed-text, mxbai-embed via Ollama)"]
    B --> C["Base vectorielle locale\n(Qdrant)"]
    C --> D["Agent de routage\n(modèle 7–8B rapide)"]
    D --> E["Base vec."]
    D --> F["Outil web / FS"]
    E --> G["Contexte assemblé"]
    F --> G
    G --> H["LLM principal (70B)\n— génération de la réponse"]
```

**Modèles d'embedding locaux recommandés :**

```bash
# Via Ollama
ollama pull nomic-embed-text   # 137M paramètres, 768 dim, très rapide
ollama pull mxbai-embed-large  # 335M paramètres, 1024 dim, meilleure qualité

# Test rapide
curl http://localhost:11434/api/embeddings \
  -d '{"model": "nomic-embed-text", "prompt": "La bande passante mémoire limite l'\''inférence."}'
```

---

## 📋 Le Conseil de l'Architecte

Pour construire une stack logicielle d'entreprise souveraine en 2026 :

1.  **Dédiez un petit modèle au routage :** N'utilisez pas votre gros modèle 70B pour choisir quel outil appeler. Utilisez un modèle ultra-rapide (ex: Qwen 2.5 7B ou Llama 3 8B) configuré spécifiquement pour le *Function Calling*. Il appellera la base de données.
2.  **Gardez les gros modèles pour la synthèse :** Une fois les bons blocs de texte récupérés par le petit agent, envoyez le tout au modèle lourd (le "cerveau") pour rédiger la réponse finale.
3.  **Évitez les dépendances Cloud :** Si vous utilisez LangChain ou LlamaIndex, auditez la télémétrie. En on-premise pur, des frameworks minimalistes comme [[00-lexique/smolagents|SmolAgents]] garantissent que vos prompts ne fuiteront pas vers une API externe pendant l'orchestration[^4].
4.  **Isolez les embeddings par tenant dès le premier jour.** Un RAG multi-locataire sans isolation (RLS pgvector ou payload Qdrant) est une faille de sécurité garantie. Ajouter ce cloisonnement après coup sur une base de production est coûteux.
5.  **Routez les tâches auxiliaires sur CPU.** Embeddings et transcription Whisper ne consomment pas de VRAM si on utilise `faster-whisper` et `nomic-embed-text` sur CPU. La VRAM libérée multiplie la capacité d'accueil en inférence concurrente.

---

## 📚 Sources et Références

[^1]: Lyzr Blog, *What is Agentic RAG? Everything You Need to Know in 2026* (Évolution des pipelines statiques vers l'adaptation intelligente), Janvier 2026.
[^2]: NVIDIA Technical Blog, *Mastering LLM Techniques: Inference Optimization* (Impact du contexte long sur le KV Cache), Novembre 2023.
[^3]: Vinod Rane (Medium), *Next-Generation Agentic RAG with LangGraph (2026 Edition)* (Graph orchestration, self-correcting RAG), Mars 2026.
[^4]: Hugging Face, *Agentic RAG with SmolAgents* (RAG orchestration via Hugging Face light framework), 2025.
[^5]: Neo4j Developer Blog, *What is agentic RAG? A developer's guide* (GraphRAG, ReAct, multi-agent RAG patterns), Mai 2026.
[^6]: OpenHuman, *Memory Trees* (GitBook — pipeline local SQLite + Markdown, injection sélective pour économie VRAM), 2025. Note : OpenHuman utilise par défaut un backend cloud pour le routage des modèles. Le *pattern* Memory Tree reste applicable dans une implémentation 100% on-premise indépendante du projet.
[^7]: OWASP, *Top 10 for Large Language Model Applications 2025 — LLM08: Vector and Embedding Weaknesses*. https://owasp.org/www-project-top-10-for-large-language-model-applications/
[^8]: Crunchy Data, *Row-Level Security for tenants in Postgres / pgvector*. https://www.crunchydata.com/blog/row-level-security-for-tenants-in-postgres
[^9]: Qdrant, *Multitenancy — Payload-based Partitioning*. https://qdrant.tech/documentation/guides/multiple-partitions/
[^10]: SYSTRAN, *faster-whisper — High-throughput Whisper inference on CPU and GPU (CTranslate2)*. https://github.com/SYSTRAN/faster-whisper