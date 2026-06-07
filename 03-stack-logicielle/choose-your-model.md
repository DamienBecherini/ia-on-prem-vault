---
title: "🗺️ Choisir son modèle local"
description: Guide pratique pour naviguer le paysage des LLM open weights en 2026 — familles, tailles, spécialisations et correspondance avec les scénarios on-premise.
sidebar:
  order: 4
last_modified: "2026-06-07"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] En bref
> Il n'existe pas de "meilleur modèle". Il existe le modèle qui tient dans votre VRAM, répond assez vite pour vos utilisateurs, et réussit vos tests sur vos données. Ce chapitre vous donne les clés pour réduire la liste à trois candidats — et [[06-mise-en-oeuvre/evaluate-local-model|le chapitre d'évaluation]] vous dit comment choisir parmi eux.

---

## Trois questions avant de choisir

Avant de regarder un leaderboard, répondez à ces trois questions dans l'ordre :

**1. Quelle est votre tâche principale ?**

| Tâche | Profil modèle recommandé |
| :-- | :-- |
| Chat / assistant général | Modèle instruction-tuned généraliste |
| RAG documentaire (en français) | Modèle fort en instruction following, bon contexte long |
| Agent custodien / code editing | Modèle coder spécialisé, 14B minimum |
| Résumé, extraction, classification | Modèle compact rapide, 7–8B suffisent souvent |
| Raisonnement / calcul complexe | Modèle de type "thinking" (chain-of-thought intégré) |

**2. Combien de VRAM avez-vous ?**

Voir [[01-fondations/quantization-4bit-8bit|Quantification]] pour calculer l'empreinte exacte. En Q4_K_M, règle approximative :

| VRAM disponible | Taille de modèle accessible |
| :-- | :-- |
| 8–12 Go | 7–8B |
| 16–24 Go | 14B — 24B avec Q4 |
| 48 Go | 32–34B confortablement |
| 80 Go (H100) | 70B en BF16 ou 140B en Q4 |
| 128–160 Go (APU) | 70B Q8 ou 120B Q4 |

**3. Combien d'utilisateurs simultanés ?**

Plus il y a d'utilisateurs, plus le modèle doit être petit pour laisser de la VRAM au [[00-lexique/kv-cache|KV Cache]] concurrent. Un modèle 70B qui répond parfaitement à un seul utilisateur peut s'effondrer à cinq.

> [!note] Lien direct
> Pour le bon moteur d'inférence selon le nombre d'utilisateurs, voir [[03-stack-logicielle/inference-engines-vllm-ollama|Moteurs d'inférence]]. Pour le bon matériel, voir les [[04-blueprints/scenario-a-dev-lab|Blueprints A–D]].

---

## Le paysage open weights en 2026

Le marché s'est stabilisé autour de quelques familles dominantes. Voici comment les lire.

### Llama 3.x (Meta)

La référence généraliste des versions précédentes. Les modèles Llama 3.1/3.3 sont disponibles en 8B, 70B et 405B. Bien documentés, supportés par tous les moteurs (Ollama, vLLM, TensorRT-LLM), avec une licence commerciale permissive.

- **Llama 3.3 70B** : le meilleur rapport qualité/taille pour la plupart des usages PME. Fort en instruction following, raisonnement et multilingual (dont le français).
- **Llama 3.1 8B** : bon pour les postes contraints ou les tâches simples. Limite visible sur des tâches de raisonnement complexes.
- **Llama 3.1 405B** : nécessite un cluster multi-GPU (scénario D). Performances proches des modèles frontière sur les tâches générales.

> [!note] Llama 4 : architecture MoE, non adapté aux GPU consumer
> Llama 4 Scout (109B total, 17B actifs, 16 experts) et Llama 4 Maverick (400B total, 17B actifs, 128 experts) sont sortis en avril 2025. **Ces modèles nécessitent des serveurs de datacenter** (H100 minimum avec quantification int4 pour Scout). Ils ne rentrent pas dans les scénarios A, B ou C de ce vault. Voir [[04-blueprints/scenario-d-datacenter|Scénario D]].

### Llama 4 (Meta) — scénario D uniquement

Nativement multimodaux (texte + image), architecture MoE.

- **Llama 4 Scout (109B total / 17B actifs, 16 experts)** : contexte 10M tokens. Tient sur un seul H100 avec quantification int4. Pertinent uniquement pour le scénario D (datacenter).
- **Llama 4 Maverick (400B total / 17B actifs, 128 experts)** : contexte 1M tokens. Requiert un host DGX complet en FP8 ou BF16. Performances comparables aux modèles frontière sur les benchmarks STEM.

> [!warning] Llama 4 ≠ remplacement de Llama 3.x pour les PME
> Contrairement à Llama 3.1 8B ou 3.3 70B, il n'existe pas de variant Llama 4 utilisable sur une machine de bureau ou un APU. Pour les scénarios A, B et C, **Llama 3.3 70B ou Qwen 2.5 72B restent les références**.

### Qwen 2.5 / Qwen3 (Alibaba)

La famille la plus polyvalente du paysage open weights en 2026, avec une excellente couverture multilingue (y compris le français) et des variantes spécialisées.

- **Qwen 2.5 72B** : concurrent direct de Llama 3.3 70B, souvent légèrement supérieur sur les tâches de code et de raisonnement.
- **Qwen 2.5 Coder 32B** : le meilleur candidat pour les agents custodiens — spécialisé code editing, search-and-replace, génération de patches. 32B tient sur une station 48 Go VRAM.
- **Qwen3-A3B (MoE)** : 3B paramètres actifs, ~18 Go en Q4. Excellent débit, qualité surprenante pour sa taille active, idéal sur les APU contraints.

### DeepSeek (DeepSeek AI)

- **DeepSeek-R1** : modèle de raisonnement avec chain-of-thought intégré. Excellentes performances sur les tâches mathématiques et logiques. Disponible en distillations 7B à 70B et en version complète 671B (MoE).
- **DeepSeek V3 (MoE, 671B)** : paramètres totaux très élevés mais ~37B actifs par token. Qualité proche de GPT-4o sur de nombreux benchmarks. Nécessite un cluster (scénario C ou D).

> [!warning] MoE : ne pas confondre total et actif
> Un modèle MoE 671B nécessite de **charger tous les experts en VRAM** même si seuls 2/64 sont actifs par token. DeepSeek V3 requiert ~390 Go de VRAM totale. Voir [[00-lexique/moe|MoE]] pour le détail.

### Mistral / Mixtral (Mistral AI)

- **Mistral 7B** : modèle compact, performant, licence Apache 2.0. Bon point de départ pour les tests.
- **Mixtral 8x7B (MoE)** : 47B paramètres totaux, ~13B actifs. 26 Go en Q4 — tient sur une station 32 Go. Bon débit sur les tâches de synthèse et de RAG.
- **Mistral Large 2 (123B)** : performances comparables à Llama 3.1 405B sur certains benchmarks, mais moins utilisé en on-premise en raison de la taille.

### Phi-4 / Phi-3 (Microsoft)

Modèles compacts (3.8B–14B) avec une qualité de raisonnement élevée pour leur taille. Intéressants pour les usages sur machine de bureau avec peu de VRAM.

- **Phi-4 14B** : performances proches de certains 70B sur les tâches de raisonnement et de code, pour 8 Go de VRAM en Q4.

---

## Correspondance modèle → scénario on-premise

| Scénario | Matériel type | Modèle recommandé | Cas d'usage |
| :-- | :-- | :-- | :-- |
| [[04-blueprints/scenario-a-dev-lab\|A — Labo Dev]] | PC 16 Go VRAM + offloading | Llama 3.1 8B / Phi-4 14B | Dev solo, tests, prototypage |
| [[04-blueprints/scenario-b-sme-appliance\|B — Appliance PME]] | APU 128 Go mémoire unifiée | Qwen 2.5 72B Q4 ou Llama 3.3 70B Q4 | Assistant équipe, RAG documentaire |
| [[04-blueprints/scenario-c-desktop-cluster\|C — Cluster Bureau]] | 2–4 machines Thunderbolt | DeepSeek V3 (MoE) ou Llama 405B | PME avancée, modèle très capable |
| [[04-blueprints/scenario-d-datacenter\|D — Datacenter]] | Multi-H100 / MI300X | Llama 3.1 405B BF16, DeepSeek V3, Llama 4 Scout/Maverick | Production 50+ utilisateurs, SLA, multimodal |

---

## Spécialisations : quand choisir un modèle coder ?

Les modèles généralistes (Llama, Qwen généraliste) peuvent écrire du code, mais ils ne sont pas faits pour **modifier un dépôt existant** de façon fiable. Un agent custodien qui doit faire des search-and-replace précis dans du Markdown ou du code a besoin d'un modèle coder.

Règle pratique :

| Usage | Modèle minimal | Modèle recommandé |
| :-- | :-- | :-- |
| Complétion de code dans un IDE | Qwen 2.5 Coder 7B | Qwen 2.5 Coder 14B |
| Agent custodien (corrections contrôlées) | Qwen 2.5 Coder 14B | Qwen 2.5 Coder 32B |
| Agent autonome (maintenance régulière) | Qwen 2.5 Coder 32B | DeepSeek Coder V2 (16B actifs) |

> [!warning] Le piège du 7B généraliste pour les agents
> Un modèle 7B/8B généraliste peut répondre à une question de code, mais il rate souvent les search-and-replace, corrompt des frontmatter YAML, ou boucle sur des corrections partielles. La souveraineté de l'infrastructure ne compense pas un modèle trop faible pour la tâche. Voir [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] et [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Architecture cible]].

---

## Modèles de raisonnement : quand en avez-vous besoin ?

Les modèles "thinking" (DeepSeek-R1, Qwen3 en mode thinking, Llama avec chain-of-thought prompting) génèrent un raisonnement interne avant la réponse. Ils sont utiles pour :

- les problèmes mathématiques ou logiques ;
- les analyses multi-étapes (due diligence, audit) ;
- les tâches où une erreur de raisonnement est coûteuse.

En contrepartie :
- le TTFT est plus long (le modèle "réfléchit" avant de répondre) ;
- les tokens de raisonnement consomment du contexte et de la VRAM ;
- ils sont surdimensionnés pour les tâches simples (extraction, classification, chat).

> [!note] Conseil
> Utilisez un modèle de raisonnement uniquement si votre tâche l'exige. Pour un assistant RAG conversationnel, un bon 70B généraliste est plus rapide et tout aussi précis.

---

## Comment lire un leaderboard sans se tromper

Les classements publics (Chatbot Arena, Open LLM Leaderboard, HELM) sont utiles pour **une première orientation**, mais ne remplacent pas vos tests.

> [!warning] Contamination des benchmarks
> Les grands benchmarks statiques (MMLU, HumanEval, MATH) sont saturés en 2026 — leurs données de test ont partiellement fuité dans les corpus d'entraînement. Un score MMLU élevé ne prédit pas les performances sur vos documents internes. Voir [[06-mise-en-oeuvre/evaluate-local-model|Évaluer un modèle local]] pour le protocole complet.

Ce que les leaderboards disent quand même d'utile :

- **Chatbot Arena (LMSYS)** : comparaison par préférence humaine, multi-tour — bon indicateur de la qualité conversationnelle générale.
- **Open LLM Leaderboard (HuggingFace)** : suivi des modèles open weights, versions et quantifications disponibles.
- **SWE-bench** : le seul leaderboard vraiment représentatif pour les agents de code — mesure sur de vraies issues GitHub.

---

## Checklist de sélection

Avant de télécharger un modèle :

- [ ] La licence autorise-t-elle l'usage commercial ? (Apache 2.0, MIT, Llama Community License)
- [ ] Le modèle tient-il dans votre VRAM avec la quantification visée + marge KV Cache ?
- [ ] Le moteur d'inférence cible le supporte-t-il ? (GGUF pour Ollama, safetensors pour vLLM)
- [ ] Des évaluations communautaires existent-elles sur votre langue ? (le français est moins couvert que l'anglais)
- [ ] Avez-vous un golden dataset pour le tester sur vos données réelles ?
- [ ] Pour un agent : avez-vous un 14B+ coder, pas un généraliste 7B ?

---

## Voir aussi

- [[06-mise-en-oeuvre/evaluate-local-model|🧪 Évaluer un modèle local]] — protocole de test, KPI, golden dataset
- [[01-fondations/quantization-4bit-8bit|🗜️ La Quantification]] — calculer l'empreinte VRAM
- [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]] — choisir le bon moteur selon l'usage
- [[00-lexique/moe|MoE]] — comprendre les architectures Mixture of Experts
- [[00-lexique/benchmark-llm|Benchmark LLM]]
