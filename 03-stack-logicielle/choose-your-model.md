---
title: "🗺️ Choisir son modèle local"
description: Guide pratique pour naviguer le paysage des LLM open weights — familles, tailles, spécialisations et correspondance avec les scénarios on-premise.
sidebar:
  order: 4
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
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
| Agent custodien / code editing | Généraliste agentique 27–30B (Qwen3.8-27B, Muse Glimmer 30B, Granite 4.2) — voir « Spécialisations » ci-dessous |
| Résumé, extraction, classification | Modèle compact rapide, 7–8B suffisent souvent |
| Raisonnement / calcul complexe | Modèle de type "thinking" (chain-of-thought intégré) |

**2. Combien de VRAM avez-vous ?**

Voir [[01-fondations/quantization-4bit-8bit|Quantification]] pour calculer l'empreinte exacte. En Q4_K_M, règle approximative[^1] :

| VRAM disponible | Taille de modèle accessible |
| :-- | :-- |
| 8–12 Go | 7–8B |
| 16–24 Go | 14B — 24B avec Q4 |
| 48 Go | 32–34B confortablement |
| 80 Go (H100) | 70B en FP8/Q8 (~70 Go) ou ~120–140B en Q4[^7] |
| 128–160 Go (APU) | 70B Q8 ou 120B Q4 |

**3. Combien d'utilisateurs simultanés ?**

Plus il y a d'utilisateurs, plus le modèle doit être petit pour laisser de la VRAM au [[00-lexique/kv-cache|KV Cache]] concurrent. Un modèle 70B qui répond parfaitement à un seul utilisateur peut s'effondrer à cinq.

> [!note] Lien direct
> Pour le bon moteur d'inférence selon le nombre d'utilisateurs, voir [[03-stack-logicielle/inference-engines-vllm-ollama|Moteurs d'inférence]]. Pour le bon matériel, voir les [[04-blueprints/scenario-a-dev-lab|Blueprints A–D]].

---

## Le paysage open weights (T4 2026)

Le marché s'est stabilisé autour de quelques familles dominantes. Voici comment les lire.

### Llama 3.x (Meta)

La référence généraliste des versions précédentes. Les modèles Llama 3.1/3.3 sont disponibles en 8B, 70B et 405B. Bien documentés, supportés par tous les moteurs (Ollama, vLLM, TensorRT-LLM), avec une licence commerciale permissive.

- **Llama 3.3 70B** : longtemps le meilleur rapport qualité/taille pour les usages PME ; au T4 2026, il reste un choix sûr et très bien supporté, mais il est dépassé à taille égale par les généralistes 27–30B (Qwen3.8-27B, Muse Glimmer 30B). Fort en instruction following, raisonnement et multilingual (dont le français).
- **Llama 3.1 8B** : bon pour les postes contraints ou les tâches simples. Limite visible sur des tâches de raisonnement complexes.
- **Llama 3.1 405B** : nécessite un cluster multi-GPU (scénario D). Performances proches des modèles frontière sur les tâches générales.

> [!note] Llama 4 : architecture MoE, non adapté aux GPU consumer
> Llama 4 Scout (109B total, 17B actifs, 16 experts) et Llama 4 Maverick (400B total, 17B actifs, 128 experts) sont sortis en avril 2025[^2]. **Ces modèles nécessitent des serveurs de datacenter** (H100 minimum avec quantification int4 pour Scout). Ils ne rentrent pas dans les scénarios A, B ou C de ce vault. Voir [[04-blueprints/scenario-d-datacenter|Scénario D]].

### Llama 4 (Meta) — scénario D uniquement

Nativement multimodaux (texte + image), architecture MoE.

- **Llama 4 Scout (109B total / 17B actifs, 16 experts)** : contexte 10M tokens. Tient sur un seul H100 avec quantification int4. Pertinent uniquement pour le scénario D (datacenter).
- **Llama 4 Maverick (400B total / 17B actifs, 128 experts)** : contexte 1M tokens. Requiert un host DGX complet en FP8 ou BF16. Performances comparables aux modèles frontière sur les benchmarks STEM.

> [!warning] Llama 4 ≠ remplacement de Llama 3.x pour les PME
> Il n'existe toujours pas de Llama 4 utilisable sur une machine de bureau, et Meta n'a publié aucun Llama depuis avril 2025 : sa ligne ouverte s'appelle désormais **Muse Glimmer 30B** (Apache 2.0, texte + image, ~24 Go en 4-bit)[^8]. Pour les scénarios A, B et C, les références au T4 2026 sont **Qwen3.8-27B**[^7] et **Muse Glimmer 30B**[^8] ; Llama 3.3 70B reste un choix sûr mais dépassé à taille égale.

### Qwen3.8 / Qwen3 (Alibaba)

La famille la plus polyvalente du paysage open weights, avec une excellente couverture multilingue (dont le français). Au T4 2026 :

- **Qwen3.8-27B** (dense, Apache 2.0, vision + vidéo, 262k tokens) : ~18 Go en Q4 via Ollama, le choix par défaut pour un GPU 24 Go et pour les agents de code (SWE-bench Pro 61,7)[^7].
- **Qwen3-30B-A3B** (MoE, Apache 2.0) : 3B actifs, ~18 Go en Q4, excellent débit sur APU ; même classe que **Nemotron 3.5 Lightning 30B-A3B** (NVIDIA, NVFP4 officiel ≈ 22 Go, licence OpenMDW 1.1 commerciale)[^13].
- **Qwen3.8-Flash-Next** et **Qwen3.8-2.4T-A95B** (« Qwen3.8-Max ») : flagships sous licences **custom** (qwen-community-1.0, qwen3.8-max), à lire avant tout usage commercial ; taille datacenter.

### DeepSeek (DeepSeek AI)

- **DeepSeek V4 / V4.1 (MIT)** : la génération courante. **V4-Flash** (~300B, 1M tokens) et **V4.1-Flash** (552B + 196B de mémoire conditionnelle, 8 à 16B actifs, KV cache FP4) remplacent V3 et R1 ; le raisonnement est intégré (effort réglable), plus de modèle « R » séparé. Taille datacenter (nœud 8 GPU 80 Go minimum)[^10].
- **DeepSeek-R1 / V3 (2025)** : encore disponibles et bien supportés, mais dépassés à coût égal.

> [!warning] MoE : ne pas confondre total et actif
> Un modèle MoE 671B nécessite de **charger tous les experts en VRAM** même si seuls 8 experts sur 256 sont actifs par token. DeepSeek V3 en Q4_K_M pèse ~404 Go de poids[^3]. Voir [[00-lexique/moe|MoE]] pour le détail.

### Mistral / Mixtral (Mistral AI)

- **Mistral Small 4 (119B)** et **Mistral Medium 3.5 (128B)** : la ligne ouverte actuelle, avec des checkpoints NVFP4 officiels pour Small 4[^11]. Mistral 7B et Mixtral 8x7B restent utilisables mais datent de 2023-2024.
- **Mistral Large 4** (~1T MoE, 52B actifs) : annoncé le 6 octobre 2026 en API preview ; poids ouverts promis pour fin octobre, licence non publiée au moment de la rédaction — à vérifier avant de planifier un déploiement[^12].

### Phi-4 / Phi-3 (Microsoft)

Modèles compacts (3.8B–14B) avec une qualité de raisonnement élevée pour leur taille. Intéressants pour les usages sur machine de bureau avec peu de VRAM.

- **Phi-4 14B** : performances proches de certains 70B sur les tâches de raisonnement et de code, pour 8 Go de VRAM en Q4.

---

## Correspondance modèle → scénario on-premise

| Scénario | Matériel type | Modèle recommandé | Cas d'usage |
| :-- | :-- | :-- | :-- |
| [[04-blueprints/scenario-a-dev-lab|A — Labo Dev]] | PC 16 Go VRAM + offloading | Qwen3.8-27B Q4 (~18 Go)[^7], Granite 4.2 8B[^9] ou Gemma 4 E4B[^16] | Dev solo, tests, prototypage |
| [[04-blueprints/scenario-b-sme-appliance\|B — Appliance PME]] | APU 128 Go mémoire unifiée | Qwen3.8-27B[^7] ou Muse Glimmer 30B[^8] (Q8 possible) ; Nemotron 3.5 Lightning 30B-A3B NVFP4 (~22 Go, 256k) pour le débit[^13] | Assistant équipe, RAG documentaire |
| [[04-blueprints/scenario-c-desktop-cluster\|C — Cluster Bureau]] | 2–4 machines Thunderbolt | GLM-5.3-Flash (320B / 18B actifs, MIT)[^14] ou DeepSeek V4-Flash (MIT)[^10] | PME avancée, modèle très capable |
| [[04-blueprints/scenario-d-datacenter\|D — Datacenter]] | Multi-H100 / MI300X | DeepSeek V4.1-Flash / V4-Pro (MIT)[^10], GLM-5.3 (licence custom)[^14], Kimi K3 (MXFP4 natif, licence custom)[^15], Qwen3.8-2.4T-A95B (licence custom) ; Llama 4 Scout / Maverick restent valables[^2] | Production 50+ utilisateurs, SLA, multimodal |

---

## Spécialisations : quand choisir un modèle coder ?

Les modèles généralistes (Llama, Qwen généraliste) peuvent écrire du code, mais ils ne sont pas faits pour **modifier un dépôt existant** de façon fiable. Un agent custodien qui doit faire des search-and-replace précis dans du Markdown ou du code a besoin d'un modèle entraîné pour l'édition de code agentique.

Depuis 2026, les modèles généralistes de 27–30B entraînés pour l'agentique (Qwen3.8-27B, Muse Glimmer 30B, Granite 4.2) remplacent les variantes « Coder » dédiées : ils dépassent les Coder de 2024 sur SWE-bench, et la distinction coder / généraliste s'est estompée.

Règle pratique (T4 2026) :

| Usage | Modèle minimal | Modèle recommandé |
| :-- | :-- | :-- |
| Complétion de code dans un IDE | Granite 4.2 8B[^9] | Qwen3.8-27B[^7] |
| Agent custodien (corrections contrôlées) | Qwen3.8-27B[^7] | Muse Glimmer 30B[^8] |
| Agent autonome (maintenance régulière) | Qwen3.8-27B (Apache 2.0, 262k)[^7] | Muse Glimmer 30B (Apache 2.0, SWE-bench Verified 76,0)[^8] ou Granite 4.2 30B (Apache 2.0)[^9] |

> [!warning] Le piège du 7B généraliste pour les agents
> Un modèle 7B/8B généraliste peut répondre à une question de code, mais il rate souvent les search-and-replace, corrompt des frontmatter YAML, ou boucle sur des corrections partielles. La souveraineté de l'infrastructure ne compense pas un modèle trop faible pour la tâche. Voir [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] et [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Architecture cible]].

---

## Modèles de raisonnement : quand en avez-vous besoin ?

Les modèles "thinking" (Qwen3.8[^7], Granite 4.2[^9], DeepSeek V4.1[^10] — tous avec un mode raisonnement activable ou un niveau d'effort réglable) génèrent un raisonnement interne avant la réponse. Ils sont utiles pour :

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

Les classements publics (Arena, Artificial Analysis, SWE-bench Pro, HELM) sont utiles pour **une première orientation**, mais ne remplacent pas vos tests.

> [!warning] Contamination des benchmarks
> Les grands benchmarks statiques (MMLU, HumanEval, MATH) et, depuis l'été 2026, SWE-bench Verified[^6] sont saturés — leurs données de test ont partiellement fuité dans les corpus d'entraînement. Un score MMLU élevé ne prédit pas les performances sur vos documents internes. Voir [[06-mise-en-oeuvre/evaluate-local-model|Évaluer un modèle local]] pour le protocole complet.

Ce que les leaderboards disent quand même d'utile :

- **Arena (ex-LMSYS Chatbot Arena)**[^4] : comparaison par préférence humaine, multi-tour. Utile pour la qualité conversationnelle, mais au T4 2026 aucun modèle open weights ne figure dans le top 15 : lisez-le pour situer les familles ouvertes entre elles, pas contre les API.
- **Hugging Face** : l'Open LLM Leaderboard est archivé depuis 2025 ; servez-vous du Hub pour vérifier licence, taille des fichiers et quantifications disponibles, et d'Artificial Analysis (en vérifiant la version de l'indice) pour une vue composite[^5].
- **SWE-bench Pro V2 (Scale)**[^6] : le plus représentatif pour les agents de code (vraies issues GitHub, protocole verrouillé depuis septembre 2026). SWE-bench Verified est saturé depuis l'été 2026 (scores > 96 %) et ne discrimine plus.

**Où en sont les poids ouverts face aux modèles fermés (octobre 2026) ?** Sur l'Intelligence Index v4.3 d'Artificial Analysis, Claude Opus 5.5 obtient 58, Claude Fable 5.1 et GPT-6 Astra 53 ; les meilleurs modèles à poids ouverts suivent à 46 (MiMo-V2.6-Pro, MIT), 45 (GLM-5.3) et 44 (Kimi K3)[^17]. Sur arena.ai, aucun modèle ouvert ne figure dans le top 15 au 2026-10-08 ; le premier, kimi-k3-max, est 16e[^4]. L'écart est réel, mais il se comble en quelques trimestres à chaque nouvelle génération ouverte. Pour un lecteur on-premise, la question n'est donc pas le podium mais le **niveau suffisant pour la tâche**, mesuré sur vos propres données : un Qwen3.8-27B qui réussit votre golden dataset vaut mieux qu'un modèle frontière que vous ne pouvez ni héberger ni auditer.

---

## Checklist de sélection

Avant de télécharger un modèle :

- [ ] La licence autorise-t-elle votre usage ? Apache 2.0 / MIT / OpenMDW 1.1 : oui. Llama Community, Kimi K3 License, glm-5.3, qwen3.8-max, qwen-community-1.0 : lisez les seuils (MAU, revenus MaaS) avant de déployer[^14][^15].
- [ ] Les poids sont-ils réellement téléchargeables ? Un tag Ollama `:cloud` (Kimi K3, GLM-5.3) signifie inférence hébergée, pas on-premise[^18].
- [ ] Le modèle tient-il dans votre VRAM avec la quantification visée + marge KV Cache ?
- [ ] Le moteur d'inférence cible le supporte-t-il ? (GGUF pour Ollama, safetensors pour vLLM)
- [ ] Des évaluations communautaires existent-elles sur votre langue ? (le français est moins couvert que l'anglais)
- [ ] Avez-vous un golden dataset pour le tester sur vos données réelles ?
- [ ] Pour un agent : avez-vous un modèle agentique de 27–30B (Qwen3.8-27B, Muse Glimmer 30B, Granite 4.2 30B), pas un généraliste 7B ?

---

## Voir aussi

- [[06-mise-en-oeuvre/evaluate-local-model|🧪 Évaluer un modèle local]] — protocole de test, KPI, golden dataset
- [[01-fondations/quantization-4bit-8bit|🗜️ La Quantification]] — calculer l'empreinte VRAM
- [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]] — choisir le bon moteur selon l'usage
- [[00-lexique/moe|MoE]] — comprendre les architectures Mixture of Experts
- [[00-lexique/benchmark-llm|Benchmark LLM]]

---

## 📚 Sources et Références

[^1]: J. Wang et al., *Which Quantization Should I Use? A Unified Evaluation of llama.cpp Quantization on Llama-3.1-8B-Instruct* (réduction de taille Q4_K_M ≈ 69 %, soit ≈ 0,5 octet/paramètre + marge KV Cache), arXiv:2601.14277, janvier 2026. [https://arxiv.org/abs/2601.14277](https://arxiv.org/abs/2601.14277)
[^2]: Meta AI, *The Llama 4 herd: natively multimodal AI innovation* (Scout 109B/17B actifs, Maverick 400B/17B actifs, architecture MoE), Avril 2025. [https://ai.meta.com/blog/llama-4-multimodal-intelligence/](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
[^3]: DeepSeek AI, *DeepSeek-V3* (671B, 37B actifs, poids FP8 natifs). [https://huggingface.co/deepseek-ai/DeepSeek-V3](https://huggingface.co/deepseek-ai/DeepSeek-V3) ; unsloth, *DeepSeek-V3-GGUF* (Q4_K_M : 9 fichiers, ≈ 404 Go — tous les experts résidents en VRAM), janvier 2025. [https://huggingface.co/unsloth/DeepSeek-V3-GGUF](https://huggingface.co/unsloth/DeepSeek-V3-GGUF)
[^4]: Arena, *Text Leaderboard* (classement par préférence humaine multi-tour ; snapshot du 2026-10-08 : aucun modèle open weights dans le top 15, kimi-k3-max au rang 16). [https://arena.ai/leaderboard/text](https://arena.ai/leaderboard/text)
[^5]: Hugging Face, *Open LLM Leaderboard — archive*. [https://huggingface.co/docs/leaderboards/en/open_llm_leaderboard/archive](https://huggingface.co/docs/leaderboards/en/open_llm_leaderboard/archive) ; Artificial Analysis, *Intelligence Index v4.3* (2026-09-07). [https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3](https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3)
[^6]: Scale AI, *SWE-Bench Pro V2* (642 tâches, 11 dépôts, 2026-09-22). [https://labs.scale.com/leaderboard/swe_bench_pro_public_v2](https://labs.scale.com/leaderboard/swe_bench_pro_public_v2) ; Vals AI, *SWE-bench Verified* (arrêt des runs le 2026-09-01, top > 96 %). [https://www.vals.ai/benchmarks/swebench](https://www.vals.ai/benchmarks/swebench)
[^7]: Qwen, *Qwen3.8-27B* (dense, Apache 2.0, contexte 262k ; BF16 ≈ 56 Go, Q4 via Ollama ≈ 18 Go — soit ~2 octets/paramètre en BF16 et ~0,6 en Q4), août 2026. [https://huggingface.co/Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)
[^8]: Meta, *Muse Glimmer 30B* (Apache 2.0, texte + image, SWE-bench Verified 76,0), août 2026. [https://huggingface.co/meta-models/Muse-Glimmer-30B](https://huggingface.co/meta-models/Muse-Glimmer-30B)
[^9]: IBM, *Granite 4.2 30B* (Apache 2.0, tool calling au format OpenAI), 2026-08-25. [https://huggingface.co/ibm-granite/granite-4.2-30b](https://huggingface.co/ibm-granite/granite-4.2-30b)
[^10]: DeepSeek AI, *DeepSeek-V4.1-Flash* (MIT, 552B + 196B de mémoire conditionnelle Engram, 8–16B actifs, KV cache FP4 890 octets/token), septembre 2026. [https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) ; DeepSeek AI, *DeepSeek-V4-Flash-0731* (MIT, ~304B, 1M tokens), 2026-07-31. [https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731)
[^11]: Mistral AI, dépôts Hugging Face (Mistral-Small-4-119B-2603 et sa variante NVFP4, Mistral-Medium-3.5-128B), relevé le 2026-10-09. [https://huggingface.co/mistralai](https://huggingface.co/mistralai)
[^12]: Mistral AI, *Mistral Large 4* (API preview, poids ouverts annoncés pour fin octobre 2026, licence non publiée), 2026-10-06. [https://mistral.ai/news/mistral-large-4](https://mistral.ai/news/mistral-large-4)
[^13]: NVIDIA, *Nemotron-3.5-Lightning-30B-A3B* (BF16 / NVFP4 ≈ 22 Go / GGUF, licence OpenMDW 1.1, 256k de contexte sur un GPU 80 Go), août 2026. [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16)
[^14]: Z.ai, *GLM-5.3-Flash* (320B MoE, 18B actifs, MIT), 2026-08-26. [https://huggingface.co/zai-org/GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash) ; Z.ai, *GLM-5.3* (licence `glm-5.3`). [https://huggingface.co/zai-org/GLM-5.3](https://huggingface.co/zai-org/GLM-5.3)
[^15]: Moonshot AI, *Kimi K3* (MXFP4 natif ; Kimi K3 License : accord séparé au-delà de 20 M$ de revenus MaaS sur 12 mois). [https://huggingface.co/moonshotai/Kimi-K3](https://huggingface.co/moonshotai/Kimi-K3)
[^16]: Google, *Gemma 4 31B IT* (Apache 2.0 ; famille E2B / E4B / 26B-A4B / 31B), avril 2026. [https://huggingface.co/google/gemma-4-31b-it](https://huggingface.co/google/gemma-4-31b-it)
[^17]: Artificial Analysis, *Intelligence Index — classement des modèles* (Claude Opus 5.5 58, Claude Fable 5.1 53, GPT-6 Astra 53, MiMo-V2.6-Pro 46, GLM-5.3 45, Kimi K3 44 ; indice v4.3 ou révision 4.3.x), relevé le 2026-10-10. [https://artificialanalysis.ai/leaderboards/models](https://artificialanalysis.ai/leaderboards/models) ; Artificial Analysis, *Claude Opus 5.5* (58, « the highest score we have measured by several points »), 2026-09-22. [https://artificialanalysis.ai/articles/claude-opus-5-5](https://artificialanalysis.ai/articles/claude-opus-5-5)
[^18]: Ollama, *Library — kimi-k3* (seul tag `kimi-k3:cloud`, 2,81T paramètres : inférence hébergée) et *glm-5.3* (tag `:cloud`), consultés le 2026-10-10. [https://ollama.com/library/kimi-k3](https://ollama.com/library/kimi-k3) · [https://ollama.com/library/glm-5.3](https://ollama.com/library/glm-5.3)
