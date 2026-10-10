---
title: "💰 Comparaison TCO : On-Premise vs Cloud API"
description: Analyse du coût total de possession (TCO) des quatre blueprints on-premise face aux API cloud IA — matériel, énergie, maintenance et point de rentabilité.
sidebar:
  order: 5
prices_valid_as_of: "2026-10"
last_verified: "2026-10-09"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
last_modified: "2026-10-09"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] En bref
> Le cloud IA coûte peu au démarrage mais beaucoup à l'échelle. L'on-premise demande un investissement initial élevé mais son coût marginal tend vers zéro. Aux prix d'octobre 2026, le point de rentabilité d'une appliance PME (blueprint B) est d'environ 13 mois face à GPT-5.5, 19 mois face à Claude Opus 5.5, et n'est jamais atteint face aux offres économiques facturées sous 1 $ le million de tokens : en 2026, la souveraineté, pas le coût, est l'argument décisif de l'on-premise pour une PME.

---

## Les paramètres du calcul TCO

Avant de comparer, il faut aligner les unités. L'usage d'un LLM se mesure en **millions de tokens traités par mois** — c'est l'unité de facturation du cloud, et c'est aussi le bon dénominateur pour calculer le coût on-premise.

**Côté cloud :** les fournisseurs facturent au token (input + output séparément). En 2026, les tarifs de référence pour les modèles de classe 70B-class :

> [!warning] Prix et tarifs — validité
> Tarifs capturés en **octobre 2026** (relevé du 2026-10-09, USD hors taxes ; conversion indicative 1 $ ≈ 0,92 €). Les prix des API cloud varient fréquemment : OpenAI a doublé GPT-5.5 en avril 2026, Google a programmé un doublement des Gemini Flash au 1er janvier 2027, Groq a retiré le prix public de Llama 3.3 70B.
> Vérifiez les pages tarifaires officielles avant de construire un business case :
> [OpenAI](https://developers.openai.com/api/docs/pricing) · [Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) · [Mistral](https://mistral.ai/pricing) · [Google Gemini](https://ai.google.dev/gemini-api/docs/pricing) · [Groq](https://console.groq.com/docs/models) · [Together AI](https://www.together.ai/pricing)

| API (tarifs relevés le 2026-10-09, USD hors taxes) | Tarif input | Tarif output | Modèle |
| :-- | :-- | :-- | :-- |
| OpenAI GPT-5.5[^1] | 5,00 $/M tok | 30,00 $/M tok | Propriétaire, frontière |
| OpenAI GPT-5.6 Sol (promo au moins jusqu'au 2026-11-21)[^1] | 4,00 $/M tok | 20,00 $/M tok | Propriétaire, haut de gamme |
| OpenAI GPT-6 Sol[^1] | 2,00 $/M tok | 10,00 $/M tok | Propriétaire, milieu de gamme |
| OpenAI GPT-6 Luna[^1] | 0,10 $/M tok | 0,50 $/M tok | Propriétaire, économique |
| OpenAI GPT-4o (legacy)[^1] | 2,50 $/M tok | 10,00 $/M tok | Propriétaire, ancienne génération |
| Anthropic Claude Opus 5.5[^2] | 4,00 $/M tok | 20,00 $/M tok | Propriétaire, haut de gamme |
| Anthropic Claude Sonnet 5.5[^2] | 2,00 $/M tok | 10,00 $/M tok | Propriétaire, milieu de gamme |
| Anthropic Claude Haiku 5.5 (prompt ≤ 100k)[^2] | 0,10 $/M tok | 0,50 $/M tok | Propriétaire, économique |
| Mistral Large 3[^3] | 0,50 $/M tok | 1,50 $/M tok | Propriétaire (poids ouverts) |
| Mistral Large 4 (preview API du 2026-10-06)[^3] | 1,36 $/M tok | 4,18 $/M tok | Preview ; poids ouverts annoncés fin octobre 2026 |
| Groq (openai/gpt-oss-120b)[^4] | 0,15 $/M tok | 0,60 $/M tok | Open weights, cloud (Llama 3.3 70B : tarif sur devis depuis 2026) |
| Together AI (Llama 3.3 70B)[^5] | 1,04 $/M tok | 1,04 $/M tok | Open weights, cloud |
| API cloud générique 70B | ~1,00–3,00 $/M tok | ~1,00–4,00 $/M tok | Fourchette |

*Note : les prix varient fréquemment. Vérifiez les tarifs actuels avant de construire un business case.*

**Côté on-premise :** le coût est fixe (amortissement matériel) + variable (électricité, maintenance). Pas de facturation au token.

---

## Scénario de référence pour la comparaison

Pour rendre la comparaison concrète, utilisons un cas typique de PME :

- **Usage :** 10 utilisateurs actifs, ~50 requêtes/jour/utilisateur
- **Taille moyenne des échanges :** ~1 000 tokens input + ~500 tokens output
- **Volume mensuel :** ~22 500 échanges × 1 500 tokens = **~33,75 M tokens/mois**
- **Modèle cible :** 70B quantifié (Q4_K_M) — qualité suffisante pour la majorité des cas métier

---

## Blueprint A — Labo Dev (RTX 4090 ou mémoire unifiée 64 Go)

**Usage adapté :** développeur solo ou équipe de 2-3 personnes, modèles 8B-14B.

| Poste | Montant |
| :-- | :-- |
| Matériel (PC RTX 4090 ou Mac Pro 64 Go) | 2 500 – 3 500 € (amorti 4 ans) |
| Amortissement mensuel | ~55 – 75 €/mois |
| Électricité (150W × 8h/j × 30j × 0,20 €/kWh) | ~7 €/mois |
| **Coût mensuel total** | **~65 – 85 €/mois** |

**Équivalent cloud (API GPT-4o classe, ~5 M tokens/mois) :**
- Input : 5 M × 2,50 $ = 12,50 $/mois
- Output : 2,5 M × 10,00 $ = 25,00 $/mois
- **Total cloud ≈ 37 $/mois (~35 €)**

> [!note] Point de rentabilité A
> À faible volume (< 5 M tokens/mois), le cloud est souvent moins cher qu'un poste de travail dédié — sauf si la **souveraineté des données** est non négociable. L'on-premise se justifie dès le premier token si vos données ne peuvent pas sortir de vos locaux.

---

## Blueprint B — Appliance PME (Mac Studio / APU 128 Go)

**Usage adapté :** 10 à 50 utilisateurs, modèle 70B, confidentialité maximale.

| Poste | Montant |
| :-- | :-- |
| Mac Studio M4 Max 128 Go | 4 500 € (amorti 4 ans) |
| Amortissement mensuel | ~95 €/mois |
| Électricité (100W × 12h/j × 30j × 0,20 €/kWh) | ~7 €/mois |
| Maintenance, sauvegarde, support | ~50 €/mois |
| **Coût mensuel total** | **~155 €/mois** |

**Équivalent cloud (22,5 M tokens d'entrée + 11,25 M de sortie par mois, tarifs du 2026-10-09) :**
- Haiku 5.5 ou GPT-6 Luna (0,10 / 0,50 $) : 2,25 + 5,6 = **~8 $/mois** (~7 €, offre économique)
- Sonnet 5.5 ou GPT-6 Sol (2 / 10 $) : 45 + 112,5 = **~158 $/mois** (~145 €, milieu de gamme)
- GPT-5.5 (5 / 30 $) : 112,5 + 337,5 = **~450 $/mois** (~414 €, modèle frontière)

| API choisie (tarifs du 2026-10-09, 1 $ ≈ 0,92 €) | Coût cloud/mois | Point de rentabilité |
| :-- | :-- | :-- |
| Économique : Haiku 5.5, GPT-6 Luna, Mistral Large 3 (0,10–0,50 $ / 0,50–1,50 $)[^1][^2][^3] | ~7 – 26 €/mois | ❌ Jamais amorti uniquement sur le coût |
| Cloud open-weights (Together AI Llama 3.3 70B, 1,04 $/M)[^5] | ~32 €/mois | ❌ Jamais amorti uniquement sur le coût |
| Milieu de gamme : Sonnet 5.5, GPT-6 Sol (2 / 10 $)[^1][^2] | ~145 €/mois | ~51 mois (au-delà de l'amortissement) |
| Haut de gamme : Opus 5.5, GPT-5.6 Sol (4 / 20 $)[^1][^2] | ~290 €/mois | ~19 mois |
| Frontière : GPT-5.5 (5 / 30 $)[^1] | ~414 €/mois | **~13 mois** |

*Point de rentabilité = 4 500 € de capital / (coût cloud mensuel − 57 €/mois de fonctionnement on-premise hors amortissement), formule de la section « Calculer votre propre TCO ».*

> [!tip] La souveraineté change le calcul
> Pour une PME soumise au RGPD traitant des données clients, "le cloud open-weights est moins cher" ne suffit pas — un hébergeur tiers reste un destinataire au sens RGPD. Face aux API économiques (Haiku 5.5, Mistral Large 3, cloud open-weights), le surcoût on-premise est de l'ordre de 120 à 150 €/mois ; face aux modèles frontière (GPT-5.5, Opus 5.5), l'on-premise est déjà moins cher. Dans le premier cas, ce surcoût peut éviter des honoraires d'avocat bien plus élevés.

---

## Blueprint C — Cluster Bureau (Exo / Thunderbolt)

**Usage adapté :** prototypage de modèles > 100B, traitement batch asynchrone.

| Poste | Montant |
| :-- | :-- |
| 4× Mac Mini M4 Pro 64 Go | 4 × 1 800 € = 7 200 € (amorti 4 ans) |
| Hub Thunderbolt + câbles | ~300 € |
| Amortissement mensuel | ~190 €/mois |
| Électricité (4 × 30W × 16h/j × 30j × 0,20 €) | ~12 €/mois |
| Maintenance et administration | ~80 €/mois |
| **Coût mensuel total** | **~280 €/mois** |

**Équivalent cloud pour modèles > 100B :**

Les modèles open-weights de cette classe (DeepSeek V4, GLM-5.3, Kimi K3) sont disponibles via des API OpenAI-compatibles chez des hébergeurs spécialisés (Together AI, Groq) à des tarifs souvent inférieurs aux modèles propriétaires — mais hébergés hors de vos locaux[^5] :

| Service | Tarif estimé 100B+ | Coût pour 33 M tok/mois |
| :-- | :-- | :-- |
| Together AI (DeepSeek V3) | ~2,7 $/M tok | ~90 €/mois |
| Auto-hébergé GPU cloud (A100 × 4, spot) | ~3–6 $/GPU-heure | ~500–1 500 €/mois |

> [!note] Point de rentabilité C
> Pour les modèles frontières (100B+), le cluster bureau est compétitif dès 3-6 mois face à du GPU cloud on-demand. Son avantage principal reste l'accès permanent et prévisible, sans risque de quota ou de dépréciation de l'API.

---

## Blueprint D — Datacenter (HGX 8-GPU)

**Usage adapté :** production haute concurrence, 50+ utilisateurs simultanés, SLA strict.

| Poste | Montant |
| :-- | :-- |
| Nœud HGX H200 (8× GPU) | ~400 000 € (amorti 5 ans) |
| Infrastructure (réseau, refroidissement, électricité) | ~20 000 €/an |
| Amortissement mensuel matériel | ~6 700 €/mois |
| Infrastructure + ops | ~1 700 €/mois |
| Ingénieur infrastructure dédié (0,5 ETP) | ~4 000 €/mois |
| **Coût mensuel total** | **~12 400 €/mois** |

**Équivalent cloud pour production SaaS 50+ utilisateurs :**

| Service | Coût estimé | Commentaire |
| :-- | :-- | :-- |
| API GPT-4o (500 M tok/mois) | ~3 000–5 000 $/mois | Pas de garantie SLA custom |
| GPU dédié cloud (A100 × 8, on-demand) | ~15 000–20 000 $/mois | SLA fort, mais coût élevé |
| GPU réservé cloud (1 an, H100 × 8) | ~8 000–12 000 $/mois | Engagement 1 an |

> [!note] Point de rentabilité D
> Le nœud HGX devient compétitif au bout de 24-36 mois face au GPU dédié cloud. Sa vraie valeur n'est pas uniquement économique : c'est la **maîtrise totale** (données, modèles, SLA, évolution du modèle), le **contrôle des coûts sur 5 ans**, et la conformité réglementaire maximale.

---

## Synthèse — Quand choisir quoi ?

```
Volume mensuel tokens          Contrainte souveraineté   → Blueprint recommandé
─────────────────────────────────────────────────────────────────────────────
< 5 M tokens/mois              Faible                    → API cloud (coût < on-prem)
< 5 M tokens/mois              Forte (RGPD, secret pro)  → Blueprint A ou B
5–50 M tokens/mois             Modérée                   → Blueprint B (TCO < cloud GPT-4o)
5–50 M tokens/mois             Forte                     → Blueprint B impératif
> 50 M tokens/mois             Quelconque                → Blueprint B ou D
Modèles 100B+                  Quelconque                → Blueprint C (prototypage) ou D (prod)
50+ utilisateurs simultanés    Forte                     → Blueprint D
```

### TCO à 3 ans — récapitulatif visuel

| Blueprint | Coût/mois | Total 3 ans | Équivalent API cloud 3 ans |
| :-- | :-- | :-- | :-- |
| A (labo dev, 5 M tok/mois) | ~75 € | ~2 700 € | ~1 260 € (Groq) / ~7 400 € (GPT-4o) |
| B (PME, 34 M tok/mois) | ~155 € | ~5 580 € | ~1 200 € (Groq) / ~7 400 € (GPT-4o) |
| C (cluster, 34 M tok/mois) | ~280 € | ~10 080 € | ~3 200 € (Together AI) |
| D (datacenter, 500 M tok/mois) | ~12 400 € | ~446 400 € | ~108 000–720 000 € (GPU cloud) |

> [!warning] Coûts cachés à ne pas oublier
> - **Formation et onboarding** de l'équipe sur la stack on-premise
> - **Temps d'administration** (mises à jour, monitoring, backups) — souvent sous-estimé
> - **Obsolescence matérielle** : les GPU de 2024-2025 peuvent ne pas supporter les modèles de 2027 optimalement
> - **Coûts de refroidissement et d'espace** pour les blueprints C et D

---

## FinOps logicielle : réduire le coût par requête avant le matériel

Avant d'investir dans plus de GPU, deux optimisations logicielles peuvent diviser le coût réel par token d'un facteur important :

**1. Pré-filtrage RAG :** en limitant le contexte envoyé au LLM aux K meilleurs résultats (Top-3 au lieu de Top-20), on réduit les tokens d'entrée d'un facteur 5 à 10 sans dégradation de qualité perceptible. Sur un API cloud facturant à l'input token, l'économie est directe. Sur un modèle local, c'est autant de VRAM et de temps de calcul libérés. Voir [[03-stack-logicielle/rag-and-agents|RAG & Agents — section FinOps]].

**2. Routage CPU/GPU :** décharger les embeddings et la transcription vocale (Whisper) sur CPU libère la totalité de la VRAM GPU pour la génération. Sur un serveur 2× L40S, ce routage peut multiplier par 2 à 3 le nombre d'utilisateurs simultanés servis sans changer la moindre ligne matérielle.

Ces deux leviers s'appliquent à tous les blueprints, mais leur impact est le plus fort sur les Blueprints B et D où la concurrence multi-utilisateurs est dimensionnante.

---

## Calculer votre propre TCO

Pour construire votre business case, collectez ces données :

1. **Volume de tokens/mois :** estimer à partir du nombre d'utilisateurs × requêtes/jour × tokens par échange
2. **Tarif cloud de référence :** identifier l'API correspondante à votre niveau de qualité requis
3. **Amortissement matériel :** prix du matériel / durée d'amortissement (36-60 mois)
4. **Coût électricité :** puissance en kW × heures/jour × 30 × tarif kWh local
5. **Coût ops :** temps administrateur × taux journalier
6. **Point de rentabilité :** `(Coût matériel) / (Coût cloud mensuel - Coût on-prem mensuel)`

---

## Choisir le matériel selon la phase

La comparaison TCO ci-dessus raisonne principalement sur l'**inférence** (modèle gelé, génération de texte). Le profil matériel requis change significativement selon la phase du cycle de vie du modèle.

| Phase | Besoin mémoire | Profil matériel adapté | Exemple |
| :-- | :-- | :-- | :-- |
| **Inférence** (modèle gelé, génération) | Poids + KV cache | GPU rapide avec VRAM suffisante | RTX 4090 (24 Go), L40S (48 Go), APU 128 Go |
| **Fine-tuning LoRA** (adaptateurs seulement) | Poids + gradients + optimizer states (~2–3× l'inférence) | Mémoire unifiée haute capacité ou multi-GPU | Mac Studio 192 Go, AMD Gorgon Halo, DGX Spark 128 Go |
| **Fine-tuning full (SFT complet)** | Très élevé — souvent 2–4× les poids bruts en FP16 | Serveur multi-GPU ou datacenter | 2–4× A100 80 Go, ou DGX Station |
| **Entraînement complet (pre-training)** | Plusieurs centaines de Go à plusieurs To | Clusters datacenter — hors portée on-prem PME | H100, systèmes HGX/DGX |

> [!warning] Ne pas confondre les profils
> Un GPU rapide en inférence (RTX 4090, 24 Go VRAM) peut crasher immédiatement sur du fine-tuning LoRA d'un modèle 70B en FP16 — les optimizer states alourdissent la mémoire requise à ~60–70 Go, bien au-delà de la VRAM disponible. À l'inverse, un système haute capacité mais lente bande passante (ex. AMD Gorgon Halo à ~273 Go/s) est sous-optimal pour servir 50 utilisateurs simultanés sur un modèle 7B.

### Le KPI « tokens/s par k€ » pour comparer les options d'inférence

Pour arbitrer entre deux options matérielles d'inférence, le ratio **tokens par seconde par millier d'euros investi** (tokens/s/k€) est plus parlant que la vitesse brute seule.

Exemple de lecture :
- RTX 4090 (24 Go, ~2 000 €) : si elle délivre ~60 tok/s sur un modèle 8B → **~30 tok/s/k€**
- Mac Studio M4 Max 128 Go (~5 000 €) : si elle délivre ~10 tok/s sur un 70B Q4 → **~2 tok/s/k€**

Ces deux chiffres sont cohérents : le Mac Studio sert des modèles beaucoup plus gros que la RTX 4090, donc la comparaison directe n'a de sens que pour le **même modèle et la même quantification**.

> [!warning] Limites du ratio tokens/s/k€
> Ce ratio dépend fortement du **modèle**, de la **quantification**, et du **batch size** :
> - **Batch size = 1 (un seul utilisateur)** : favorise les GPU à haute bande passante GDDR (RTX 4090, L40S) — le décodage autorégressif est memory-bound, et la GDDR est plus rapide que la LPDDR5x.
> - **Batch size élevé (10–50 requêtes simultanées)** : favorise les systèmes haute capacité mémoire et les moteurs optimisant le batching (vLLM avec PagedAttention) — la bande passante est moins limitante, la capacité prime.
> - **Modèles > 70B** : seuls les systèmes avec 128 Go+ de mémoire peuvent s'exprimer — la comparaison RTX 4090 vs DGX Spark sur un 70B n'est pas possible sur la RTX 4090.

---

## Voir aussi

- [[04-blueprints/scenario-a-dev-lab|🛠️ Scénario A — Labo Dev]]
- [[04-blueprints/scenario-b-sme-appliance|🏢 Scénario B — Appliance PME]]
- [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scénario C — Cluster Bureau]]
- [[04-blueprints/scenario-d-datacenter|🏭 Scénario D — Datacenter]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|🔒 Souveraineté & Confidentialité]]
- [[06-mise-en-oeuvre/evaluate-local-model|🧪 Évaluer un modèle local]]

---

## 📚 Sources et Références

[^1]: OpenAI, *API pricing* (GPT-5.5 5 / 30 $, GPT-5.6 Sol 4 / 20 $ en promotion au moins jusqu'au 2026-11-21, GPT-6 Sol 2 / 10 $, GPT-6 Luna 0,10 / 0,50 $, GPT-4o legacy 2,50 / 10 $ par million de tokens), relevé le 2026-10-09. [https://developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing)
[^2]: Anthropic, *Pricing* (Claude Opus 5.5 4 / 20 $, Sonnet 5.5 2 / 10 $, Haiku 5.5 0,10 / 0,50 $ par million de tokens ; Claude 3.5 Sonnet retiré de la page), relevé le 2026-10-09. [https://platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing)
[^3]: Mistral AI, *Pricing* (Mistral Large 3 : 0,50 / 1,50 $ par million de tokens), relevé le 2026-10-09. [https://mistral.ai/pricing](https://mistral.ai/pricing) · Mistral AI, *Mistral Large 4* (preview API 1,36 / 4,18 $, poids ouverts annoncés fin octobre 2026), 2026-10-06. [https://mistral.ai/news/mistral-large-4](https://mistral.ai/news/mistral-large-4)
[^4]: Groq, *GroqCloud — Models* (openai/gpt-oss-120b 0,15 / 0,60 $ par million de tokens ; Llama 3.3 70B et Llama 3.1 8B passés « Enterprise / Contact sales », sans prix public), relevé le 2026-10-09. [https://console.groq.com/docs/models](https://console.groq.com/docs/models)
[^5]: Together AI, *Pricing* (Llama 3.3 70B 1,04 / 1,04 $ ; DeepSeek V4 Pro 1,32 / 3,96 $, DeepSeek V4.1 Flash 0,30 / 1,20 $, GLM-5.3 et Kimi K3 en API OpenAI-compatible), relevé le 2026-10-09. [https://www.together.ai/pricing](https://www.together.ai/pricing)
