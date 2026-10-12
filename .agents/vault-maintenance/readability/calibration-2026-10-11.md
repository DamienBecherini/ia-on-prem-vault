# Readability calibration — 2026-10-11

Agent-only file. Six FR pages scored in full (deterministic part with `npm run audit:readability`, judged part with `rubric.md` v1), both profiles, judged by Opus 5.5 for direct arrival. Purpose: compare with the user's own judgement before scoring the whole vault. If a score differs from yours by more than about 10 points, say which criterion is off: the anchors or the weights get adjusted before the full pass.

- **A** = « dirigeant de PME non technique », **B** = « développeur qui découvre l'IA locale ».
- Final = deterministic (/40) + judged (/60, sum of 5 criteria × 2.4), rounded.
- Alert: primary profile below 60 (lexicon: below 50 on A or B). Watch: secondary profile below 45 (none here).

## Summary

| Page | Type | A /100 | B /100 | Primary | Alert |
| :-- | :-- | --: | --: | :-: | :-: |
| `00-index.md` | hub | 75 | 75 | A | no |
| `01-fondations/kv-cache-and-context.md` | article | **58** | 77 | A | **yes** |
| `02-materiel/apu-and-unified-memory.md` | article | **39** | 57 | A | **yes** |
| `04-blueprints/scenario-b-sme-appliance.md` | blueprint | 61 | 58 | A | no (borderline) |
| `06-mise-en-oeuvre/getting-started-with-ollama.md` | guide | 55 | 80 | B | no |
| `00-lexique/kv-cache.md` | lexique | 64 | 75 | A+B (≥ 50) | no |

Reading of the sample:

- The deterministic part and the judgement agree on the order: the APU page is last on both, the hub and the Ollama guide (for B) are the most readable.
- The two alerts are pages written by and for engineers that sit in a reader path meant for decision-makers (Fondations, Matériel). In both, the business stake is there but behind jargon in the first lines, and the useful vocabulary or the principle comes after the technical detail.
- B scores are higher than A everywhere except the hub (tie) and the blueprint: the vault is accurate and deep (B1, B5 often 4–5), its weak point is the first contact for a non-technical reader (A1, A2).
- The short lexicon entry gets a high deterministic part (36/40) but a weak judged part for A (no example, no order of magnitude): the lighter lexicon threshold (50) still passes it.

## Per page

### `00-index.md`

Type `hub`, primary profile **A**. Final **A 75** (31.3 + 43.2) · **B 75** (34 + 40.8).

Deterministic measures: 740 words, 64 sentences (mean 10.3 words, 3 % over 30), 0 paragraph(s) over 120 words, intro 75 words, 1 table/formula/diagram block(s) of which 0 not introduced, 7 lexicon entries linked (9.5 per 1 000 words), 6 unexplained terms (5 for profile B). Sub-scores: U_A 0.45, U_B 0.5, S 1, P 1, I 1, T 1, L 1.

| A | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| A1 | Accroche et enjeu | 4 | « Pourquoi faire tourner l'IA en local ? » donne trois raisons métier claires (données, coût, contrôle) ; l'ouverture « jardin numérique » reste générique. |
| A2 | Jargon maîtrisé | 3 | Les liens couvrent les grands termes, mais « prompt », « 70B », « MoE », « SLA », « tensor parallelism » ou « OWASP » restent bruts dans le tableau et le sommaire. |
| A3 | Progression | 3 | Ordre logique (pourquoi → sommaire → choix → parcours), mais le parcours « Je découvre » arrive après un long sommaire jargonneux. |
| A4 | Exemples et analogies | 4 | Exemples parlants : cabinet médical, service juridique, 50 employés, « un ordinateur à 4000€ peut être trop lent ». |
| A5 | Utilité pour décider | 4 | Le tableau « Quel blueprint choisir ? » (utilisateurs, budget) est une vraie aide à la décision ; l'argument coût n'est ni chiffré ni relié à la comparaison TCO. |
| | **Sum → judged** | **18** | × 2.4 = 43.2/60 |

| B | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| B1 | Justesse et précision | 3 | « L'IA on-premise est la seule réponse technique » est trop absolu ; budgets du tableau et argument coût sans source ni date. |
| B2 | Étapes reproductibles | 4 | Le sommaire 06 mène vite au guide Ollama et aux protocoles pratiques. |
| B3 | Termes définis ou liés | 4 | Presque tout est lié ; restent bruts MoE, SLA, tensor parallelism, OWASP. |
| B4 | Progression | 3 | Le parcours « Je découvre » n'inclut aucune étape pratique (le guide Ollama n'y figure pas). |
| B5 | Profondeur suffisante | 3 | Rôle de hub tenu, couverture complète des entrées ; pas de repère sur le niveau requis par section. |
| | **Sum → judged** | **17** | × 2.4 = 40.8/60 |

**Top unexplained terms (first occurrence neither linked nor glossed):** API ×5 (dev), KPI, OWASP, tensor parallelism, MoE, SLA.

**Suggestions:**

1. Remonter le parcours « 🚶 Je découvre : par où commencer ? » juste après « Pourquoi faire tourner l'IA en local ? », avant le sommaire.
2. Dans le tableau « Quel blueprint choisir ? », expliquer « 70B » (taille du modèle, en milliards de paramètres) et lier ou gloser « MoE » et « SLA ».
3. Relier l'argument « Coût prévisible à l'échelle » à `[[04-blueprints/tco-comparison]]` avec un ordre de grandeur sourcé, et ajouter « Démarrer avec Ollama » comme étape pratique du parcours débutant.

### `01-fondations/kv-cache-and-context.md`

Type `article`, primary profile **A** — **alert**. Final **A 58** (21.6 + 36) · **B 77** (24.3 + 52.8).

Deterministic measures: 2834 words, 129 sentences (mean 20.3 words, 16 % over 30), 2 paragraph(s) over 120 words, intro 107 words, 6 table/formula/diagram block(s) of which 2 not introduced, 10 lexicon entries linked (3.5 per 1 000 words), 20 unexplained terms (16 for profile B). Sub-scores: U_A 0.2, U_B 0.24, S 0.68, P 0.5, I 1, T 0.67, L 1.

| A | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| A1 | Accroche et enjeu | 3 | L'encadré « En bref » dit l'enjeu (le cache grossit avec la conversation jusqu'à égaler le modèle), mais dès la première phrase avec « VRAM » et « KV Cache » non expliqués. |
| A2 | Jargon maîtrisé | 2 | Avant la section « nouvelles architectures », GQA, MHA, BF16, FP8, NVFP4, PagedAttention, Flash-Decoding s'enchaînent ; le « Petit vocabulaire » utile arrive trop tard (section 5). |
| A3 | Progression | 3 | Mécanisme → équation → cas pratiques → optimisations → architectures → conseil : logique pour un ingénieur, mais la formule précède le piège OOM qui parle au dirigeant. |
| A4 | Exemples et analogies | 4 | Très bonnes analogies dans la partie récente (transcription intégrale, résumé, carnet de taille fixe, table des matières) et un exemple chiffré concret (Mac Studio 64 Go qui sature). |
| A5 | Utilité pour décider | 3 | « Conseil de l'Architecte » utile mais rédigé pour l'ingénieur (flags vLLM) ; la conséquence budgétaire (« acheter plus de VRAM que nécessaire ») n'est pas chiffrée en €. |
| | **Sum → judged** | **15** | × 2.4 = 36/60 |

| B | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| B1 | Justesse et précision | 5 | Très précis et nuancé : formule sourcée, Go vs GiB, extrapolation 300K signalée, gains « selon la source », dates de support moteur. |
| B2 | Étapes reproductibles | 4 | Formule + paramètres de Llama 3.1 70B + tableau permettent de refaire le calcul ; le calcul détaillé d'une ligne n'est pas posé pas à pas. |
| B3 | Termes définis ou liés | 4 | Prefill, decoding, VRAM, PagedAttention, MLA liés ; BF16 / FP8 / INT8 utilisés dès la formule mais définis seulement dans l'encadré de la section 5. |
| B4 | Progression | 4 | Progression nette ; une référence en avant (architectures hybrides citées dans le focus GQA) et un aparté OpenHuman / Memory Tree dans le conseil. |
| B5 | Profondeur suffisante | 5 | Mécanisme, ordres de grandeur, optimisations moteur et modèle, limites de la formule, conséquences pour le dimensionnement. |
| | **Sum → judged** | **22** | × 2.4 = 52.8/60 |

**Top unexplained terms (first occurrence neither linked nor glossed):** KV Cache ×32, VRAM ×15, BF16 ×9, FP8 ×7, inférence ×6, NVFP4 ×5, INT8 ×4, FP4 ×4, GPU ×4 (dev), GLM ×2.

**Blocks not introduced:** diagramme sous « Le mécanisme physique : Pourquoi le KV Cache existe-t-il ? »; tableau sous « Tableau récapitulatif ».

**Suggestions:**

1. Dans l'encadré « En bref », expliquer en mots simples « VRAM » (la mémoire de la carte graphique) et « KV Cache » (la mémoire de travail de la conversation), avec un lien vers `[[00-lexique/vram]]` et `[[00-lexique/kv-cache]]`.
2. Placer l'encadré « Petit vocabulaire » (token, couche, BF16/FP8/FP4…) avant « L'Équation Mathématique du KV Cache », et y ajouter GQA et MHA.
3. Ajouter, avant la formule, une phrase de conséquence pour le décideur (« à 128K tokens, le cache d'un 70B pèse autant que le modèle : prévoir ~2× la mémoire ») et chiffrer la marge en € dans le « Conseil de l'Architecte ».

### `02-materiel/apu-and-unified-memory.md`

Type `article`, primary profile **A** — **alert**. Final **A 39** (12.6 + 26.4) · **B 57** (13.8 + 43.2).

Deterministic measures: 2166 words, 74 sentences (mean 25.7 words, 30 % over 30), 3 paragraph(s) over 120 words, intro 189 words, 3 table/formula/diagram block(s) of which 1 not introduced, 0 lexicon entries linked (0 per 1 000 words), 33 unexplained terms (27 for profile B). Sub-scores: U_A 0.13, U_B 0.16, S 0.19, P 0.25, I 1, T 0.67, L 0.

| A | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| A1 | Accroche et enjeu | 2 | L'« En bref » aligne Gorgon Halo, FP4 natif, CUDA, ConnectX-7 200 Gbps ; l'enjeu (faire tourner un 70B sur une station silencieuse de bureau) n'arrive qu'au deuxième paragraphe, en jargon. |
| A2 | Jargon maîtrisé | 1 | Aucun lien vers le lexique (APU, mémoire unifiée, VRAM, PCIe ont pourtant une fiche) ; LPDDR5X, SoC, NPU, CU, SKU, TDP, QSFP, UMA, PFLOPS, GDDR7 bruts. |
| A3 | Progression | 2 | Trois fiches techniques produit avant l'explication du principe (« Pourquoi l'unifié supprime le goulot PCIe »), puis un guide BIOS / sysctl au milieu de l'arbitrage. |
| A4 | Exemples et analogies | 2 | Peu d'analogies ; les exemples sont des specs et des prix, l'exemple du page cache de 140 Go est concret mais technique. |
| A5 | Utilité pour décider | 4 | Le « Conseil de l'Architecte » donne une règle de choix par situation (Linux/Docker, vitesse, CUDA, mémoire soudée) et l'encadré prix en hausse aide à décider, malgré le jargon. |
| | **Sum → judged** | **11** | × 2.4 = 26.4/60 |

| B | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| B1 | Justesse et précision | 5 | Précis, daté, sourcé ; bornes théoriques et mesures clairement séparées, limites des chiffres NVIDIA signalées. |
| B2 | Étapes reproductibles | 4 | Procédures BIOS et sysctl avec vérification et retour arrière ; côté AMD, pas de moyen de vérifier l'allocation sous Linux. |
| B3 | Termes définis ou liés | 2 | Aucun lien lexique ; UMA, CU, TDP, QSFP, MLX, GB10 non expliqués, même pour un développeur. |
| B4 | Progression | 3 | Fiches produit avant le mécanisme ; le guide pratique coupe la partie comparaison. |
| B5 | Profondeur suffisante | 4 | Pièges utiles (page cache, mémoire soudée, plafond Metal 75 %) ; le lien bande passante → débit est renvoyé à un autre chapitre. |
| | **Sum → judged** | **18** | × 2.4 = 43.2/60 |

**Top unexplained terms (first occurrence neither linked nor glossed):** CUDA ×11, FP4 ×10, RAM ×9 (dev), mémoire unifiée ×7, VRAM ×7, CPU ×7 (dev), MLX ×7, tok/s ×6, OS ×6 (dev), LPDDR5X ×5.

**Blocks not introduced:** diagramme sous « Pourquoi l'unifié supprime le « goulot PCIe » ? ».

**Suggestions:**

1. Ouvrir la page par 3–4 phrases simples : ce qu'est une puce à mémoire unifiée (CPU et carte graphique partagent la même mémoire), ce que cela permet (un modèle 70B sur une station de bureau silencieuse) et le compromis (moins rapide qu'une carte graphique dédiée), puis déplacer « Pourquoi l'unifié supprime le goulot PCIe » avant le « Paysage matériel ».
2. Ajouter les liens lexique à la première occurrence : `[[00-lexique/apu]]`, `[[00-lexique/unified-memory]]`, `[[00-lexique/vram]]`, `[[00-lexique/pcie]]`, `[[00-lexique/ram]]`, `[[00-lexique/memory-bandwidth]]`, `[[00-lexique/tokens-per-second]]`.
3. Gloser en quelques mots les sigles des fiches produit (LPDDR5X, TDP, QSFP, FP4, CUDA, MLX) ou les regrouper dans un encadré « Vocabulaire » avant la première fiche produit.

### `04-blueprints/scenario-b-sme-appliance.md`

Type `blueprint`, primary profile **A**. Final **A 61** (17.3 + 43.2) · **B 58** (19.3 + 38.4).

Deterministic measures: 1127 words, 42 sentences (mean 25.5 words, 26 % over 30), 2 paragraph(s) over 120 words, intro 124 words, 1 table/formula/diagram block(s) of which 1 not introduced, 6 lexicon entries linked (5.3 per 1 000 words), 14 unexplained terms (11 for profile B). Sub-scores: U_A 0.26, U_B 0.31, S 0.26, P 0.5, I 1, T 0, L 1.

| A | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| A1 | Accroche et enjeu | 4 | Ouverture parlante (cabinet d'avocats, cabinet médical, documents confidentiels) ; la deuxième phrase bascule aussitôt dans « 70B dense quantifié », « MoE léger », « t/s ». |
| A2 | Jargon maîtrisé | 2 | Offloading, mémoire unifiée, VRAM, KV Cache liés ; mais MoE, MLX, llama.cpp, Vulkan, ROCm, SGLang, Continuous Batching, RDMA, DRP, RTO, CVE / KEV restent bruts. |
| A3 | Progression | 4 | Structure de blueprint claire : besoin → matériel → logiciel → performances → piège → verdict → sauvegarde. |
| A4 | Exemples et analogies | 4 | Images concrètes : « le bruit d'un avion au décollage », 5 employés qui envoient des PDF de 100 pages, « jeter la machine et en racheter une ». |
| A5 | Utilité pour décider | 4 | Verdict « quand utiliser / quand fuir », fourchette de budget, RTO : très utile ; pas de lien vers la comparaison TCO, et la description (10 à 50 personnes) ne colle pas au verdict (une dizaine de requêtes). |
| | **Sum → judged** | **18** | × 2.4 = 43.2/60 |

| B | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| B1 | Justesse et précision | 3 | Prix datés et sourcés, mais « moins de 150W », « 30 à 50 Go pour 5 requêtes longues » sans calcul ni source ; capacité incohérente entre description et verdict. |
| B2 | Étapes reproductibles | 3 | Stack nommée sans commande de lancement ni configuration ; la procédure de reprise et le tableau de sauvegarde sont actionnables. |
| B3 | Termes définis ou liés | 3 | MLX, SGLang, ROCm, Continuous Batching, MoE non liés alors que plusieurs ont une fiche. |
| B4 | Progression | 4 | Ordre logique sans dépendance en avant. |
| B5 | Profondeur suffisante | 3 | Le piège KV cache est là, mais le calcul de capacité (combien d'utilisateurs simultanés pour 128 Go) n'est pas fait. |
| | **Sum → judged** | **16** | × 2.4 = 38.4/60 |

**Top unexplained terms (first occurrence neither linked nor glossed):** Mémoire Unifiée ×6, RAM ×3 (dev), Ollama ×3, KV Cache ×3, vLLM ×2, MoE, GPU (dev), OEM, FP4, RDMA.

**Blocks not introduced:** tableau sous « Ce qu'il faut sauvegarder sur le Blueprint B ».

**Suggestions:**

1. Remplacer la deuxième phrase par une version simple (« un modèle de grande taille, environ 40 Go ») et déplacer les variantes MoE / 27B dans une note, avec un lien `[[00-lexique/moe]]`.
2. Ajouter un calcul de capacité dans « Le Piège du KV Cache Concurrent » : combien d'utilisateurs simultanés tiennent dans 64, 128 et 192 Go avec un contexte de 32K, en citant la formule du chapitre KV Cache, et aligner la description (« 10 à 50 personnes ») sur le verdict.
3. Dans « Le Verdict de l'Architecte », ajouter un lien vers `[[04-blueprints/tco-comparison]]` et une ligne « coût total sur 3 ans vs API cloud » ; gloser DRP et RTO (plan de reprise, délai de remise en service).

### `06-mise-en-oeuvre/getting-started-with-ollama.md`

Type `guide`, primary profile **B**. Final **A 55** (25.7 + 28.8) · **B 80** (29.6 + 50.4).

Deterministic measures: 733 words, 39 sentences (mean 16.9 words, 13 % over 30), 0 paragraph(s) over 120 words, intro 45 words, 1 table/formula/diagram block(s) of which 0 not introduced, 2 lexicon entries linked (2.7 per 1 000 words), 20 unexplained terms (15 for profile B). Sub-scores: U_A 0.2, U_B 0.25, S 0.84, P 1, I 1, T 1, L 0.91.

| A | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| A1 | Accroche et enjeu | 3 | « En bref » clair (le moyen le plus rapide de faire tourner un modèle en local, 15 minutes) mais avec « LLM » et « API compatible OpenAI » non expliqués. |
| A2 | Jargon maîtrisé | 2 | tok/s, Q4, VRAM, WSL2, CUDA, ROCm, MLX, Modelfile non expliqués ; normal pour un guide, mais bloquant pour A. |
| A3 | Progression | 3 | Progression linéaire et claire, mais entièrement en ligne de commande. |
| A4 | Exemples et analogies | 2 | Pas d'analogie ; les exemples sont des commandes. |
| A5 | Utilité pour décider | 2 | Peu d'aide à la décision : le tableau de débits et l'encadré « Sécurité réseau » sont les seuls éléments exploitables par un décideur. |
| | **Sum → judged** | **12** | × 2.4 = 28.8/60 |

| B | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| B1 | Justesse et précision | 4 | Versions et dates précises, pièges réels (pas de `ollama logs`, retour arrière < 0.40) ; mais l'exemple « Température » met des commentaires `#` dans le JSON envoyé par curl, ce qui le rend invalide, et les débits sont non sourcés (signalé). |
| B2 | Étapes reproductibles | 4 | Installation, vérification, premier modèle, API, Python : reproductible ; seul l'exemple de température échoue tel quel. |
| B3 | Termes définis ou liés | 4 | KV Cache et LiteLLM liés ; Modelfile, MLX, WSL2 non expliqués mais devinables pour un développeur. |
| B4 | Progression | 5 | Prérequis → installation → modèle → commandes → API → réglages → performances → étapes suivantes. |
| B5 | Profondeur suffisante | 4 | Couvre contexte, concurrence, exposition réseau et mises à jour de sécurité ; suffisant pour démarrer, avec renvois vers la suite. |
| | **Sum → judged** | **21** | × 2.4 = 50.4/60 |

**Top unexplained terms (first occurrence neither linked nor glossed):** tok/s ×9, VRAM ×5, API ×4 (dev), GPU ×4 (dev), MLX ×2, inférence ×2, Q4 ×2, RAG ×2, LLM (dev), WSL2.

**Suggestions:**

1. Corriger l'exemple « Température et paramètres de génération » : retirer les commentaires `#` du JSON (les mettre en texte sous le bloc), sinon la requête curl échoue.
2. Dans « Prérequis », expliquer en une phrase ce que sont CUDA / ROCm (pilotes de calcul NVIDIA / AMD) et WSL2, et lier `[[00-lexique/vram]]` et `[[00-lexique/quantification-q4]]` au tableau des débits.
3. Ajouter sous « En bref » une phrase pour le décideur : ce qu'on obtient au bout de 15 minutes, et le lien vers `[[04-blueprints/scenario-a-dev-lab]]` pour le matériel.

### `00-lexique/kv-cache.md`

Type `lexique`, primary profile **A+B**. Final **A 64** (35.4 + 28.8) · **B 75** (36.6 + 38.4).

Deterministic measures: 162 words, 12 sentences (mean 13 words, 0 % over 30), 0 paragraph(s) over 120 words, intro 13 words, 0 table/formula/diagram block(s) of which 0 not introduced, 3 lexicon entries linked (18.5 per 1 000 words), 2 unexplained terms (2 for profile B). Sub-scores: U_A 0.71, U_B 0.71, S 1, P 1, I 1, T 1, L 1.

| A | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| A1 | Accroche et enjeu | 3 | La définition courte se comprend (« éviter de recalculer »), mais « états d'attention » et « recomputations » la rendent abstraite. |
| A2 | Jargon maîtrisé | 2 | Transformer, clés/valeurs, token, prefill, VRAM, coût quadratique, calcul matriciel : rien n'est expliqué ni lié dans le corps. |
| A3 | Progression | 4 | Court → détaillé → pourquoi → mécanisme → pour aller plus loin : le format lexique joue son rôle. |
| A4 | Exemples et analogies | 1 | Aucun exemple ni ordre de grandeur (par exemple la taille du cache à 128K tokens). |
| A5 | Utilité pour décider | 2 | « Pourquoi c'est important » reste vague (« influence fortement la capacité de contexte ») ; la conséquence concrète (saturer la mémoire) n'apparaît que dans le teaser des liens. |
| | **Sum → judged** | **12** | × 2.4 = 28.8/60 |

| B | Criterion | Score | Why |
| :-- | :-- | :-: | :-- |
| B1 | Justesse et précision | 4 | Correct ; « en VRAM » ignore le cas mémoire unifiée / CPU. |
| B2 | Étapes reproductibles | 2 | Ni formule, ni ordre de grandeur, ni réglage (type de cache FP8) pour reconnaître ou mesurer le concept. |
| B3 | Termes définis ou liés | 3 | Prefill et Transformer non liés alors que la fiche prefill existe ; decoding et fenêtre de contexte liés en « Voir aussi ». |
| B4 | Progression | 4 | Structure lexique claire. |
| B5 | Profondeur suffisante | 3 | Mécanisme en quelques lignes, mais les renvois annotés vers le chapitre complet compensent. |
| | **Sum → judged** | **16** | × 2.4 = 38.4/60 |

**Top unexplained terms (first occurrence neither linked nor glossed):** prefill ×2, VRAM.

**Suggestions:**

1. Ajouter un ordre de grandeur dans « Pourquoi c'est important » : à 128K tokens, le cache de Llama 3.1 70B pèse ~42 Go en BF16, autant que le modèle quantifié, avec renvoi au chapitre.
2. Lier `[[00-lexique/prefill]]`, `[[00-lexique/vram]]` et `[[00-lexique/attention]]` à leur première occurrence, et remplacer « états d'attention » par « résultats intermédiaires déjà calculés pour chaque mot ».
3. Ajouter une analogie d'une phrase (les notes de réunion qu'on garde au lieu de tout réécouter) et un réglage concret (cache en FP8 dans vLLM / llama.cpp) pour le développeur.
