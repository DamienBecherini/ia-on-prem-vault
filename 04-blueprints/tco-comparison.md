---
title: "💰 Comparaison TCO : On-Premise vs Cloud API"
description: Analyse du coût total de possession (TCO) des quatre blueprints on-premise face aux API cloud IA — matériel, énergie, maintenance et point de rentabilité.
sidebar:
  order: 5
prices_valid_as_of: "2026-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
last_modified: "2026-10-10"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] En bref
> Le cloud IA coûte peu au démarrage mais beaucoup à l'échelle. L'on-premise demande un investissement initial élevé mais son coût marginal tend vers zéro. Aux prix d'octobre 2026, le point de rentabilité d'une appliance PME (blueprint B) est d'environ 7 mois face à Claude Fable 5.1, 13 mois face à GPT-5.5, 19 mois face à Claude Opus 5.5, et n'est jamais atteint face aux offres économiques facturées sous 1 $ le million de tokens — y compris les API chinoises comme DeepSeek, dont les données sont traitées hors UE : en 2026, la souveraineté, pas le coût, est l'argument décisif de l'on-premise pour une PME.

---

## Les paramètres du calcul TCO

Avant de comparer, il faut aligner les unités. L'usage d'un LLM se mesure en **millions de tokens traités par mois** — c'est l'unité de facturation du cloud, et c'est aussi le bon dénominateur pour calculer le coût on-premise.

**Côté cloud :** les fournisseurs facturent au token (input + output séparément). Les tarifs de référence relevés en octobre 2026, du modèle économique au modèle frontière :

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
| Anthropic Claude Fable 5.1 / Mythos 5.1 (relevé du 2026-10-10)[^2] | 10,00 $/M tok | 50,00 $/M tok | Propriétaire, frontière + (Mythos 5.1 en disponibilité limitée) |
| Anthropic Claude Opus 5.5[^2] | 4,00 $/M tok | 20,00 $/M tok | Propriétaire, haut de gamme |
| Anthropic Claude Sonnet 5.5[^2] | 2,00 $/M tok | 10,00 $/M tok | Propriétaire, milieu de gamme |
| Anthropic Claude Haiku 5.5 (prompt ≤ 100k)[^2] | 0,10 $/M tok | 0,50 $/M tok | Propriétaire, économique |
| Mistral Large 3[^3] | 0,50 $/M tok | 1,50 $/M tok | Propriétaire (poids ouverts) |
| Mistral Large 4 (preview API du 2026-10-06)[^3] | 1,36 $/M tok | 4,18 $/M tok | Preview ; poids ouverts annoncés fin octobre 2026 |
| Groq (openai/gpt-oss-120b)[^4] | 0,15 $/M tok | 0,60 $/M tok | Open weights, cloud (Llama 3.3 70B : tarif sur devis depuis 2026) |
| Together AI (Llama 3.3 70B)[^5] | 1,04 $/M tok | 1,04 $/M tok | Open weights, cloud |
| DeepSeek V4.1 Flash (API DeepSeek, modèle `deepseek-flash`, heures pleines ; relevé du 2026-10-10)[^11] | 0,30 $/M tok | 1,20 $/M tok | Open weights, cloud chinois — moitié prix en heures creuses ; **données traitées en Chine, hors UE et hors États-Unis** |
| API cloud open-weights (70B–300B MoE)[^4][^5] | ~0,15–1,40 $/M tok | ~0,30–4,40 $/M tok | Fourchette Together AI / Groq, octobre 2026 |

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

## Blueprint A — Labo Dev (GPU 24 Go d'occasion ou mémoire unifiée 64 Go)

**Usage adapté :** développeur solo ou équipe de 2-3 personnes, modèles 8B-14B.

| Poste | Montant |
| :-- | :-- |
| Matériel (PC RTX 3090/4090 d'occasion, ou Mac Studio M5 Max 64 Go à 3 659 € TTC, ou Framework Desktop 64 Go à 2 209 € TTC — prix France relevés le 2026-10-09)[^7][^8] | 2 200 – 3 700 € (amorti 4 ans) |
| Amortissement mensuel | ~45 – 75 €/mois |
| Électricité (150 W × 8 h/j × 30 j × 0,20 €/kWh, tarif réglementé août 2026)[^12] | ~7 €/mois |
| **Coût mensuel total** | **~55 – 85 €/mois** |

**Équivalent cloud (5 M tokens d'entrée + 2,5 M de sortie par mois, tarifs d'octobre 2026) :**
- Haiku 5.5 ou GPT-6 Luna (0,10 / 0,50 $) : 0,5 + 1,25 = **~1,75 $/mois (~2 €)**
- Sonnet 5.5 ou GPT-6 Sol (2 / 10 $) : 10 + 25 = **35 $/mois (~32 €)**
- GPT-5.5 (5 / 30 $) : 25 + 75 = **100 $/mois (~92 €)**
- Claude Fable 5.1 (10 / 50 $) : 50 + 125 = **175 $/mois (~161 €)**

> [!note] Point de rentabilité A
> À faible volume (< 5 M tokens/mois), le cloud est souvent moins cher qu'un poste de travail dédié — sauf face aux modèles frontière les plus chers (Fable 5.1 : ~161 €/mois contre 55 à 85 € on-premise) ou si la **souveraineté des données** est non négociable. L'on-premise se justifie dès le premier token si vos données ne peuvent pas sortir de vos locaux.

---

## Blueprint B — Appliance PME (Mac Studio / APU 128 Go)

**Usage adapté :** 10 à 50 utilisateurs, modèle 70B, confidentialité maximale.

| Poste | Montant |
| :-- | :-- |
| Appliance 128 Go (Framework Desktop 128 Go à 3 889 € TTC, en rupture · Mac Studio M5 Max 128 Go, prix sur configurateur Apple · DGX Spark 128 Go ≈ 6 950 $ ≈ 6 400 € — relevés le 2026-10-09)[^7][^8][^9] | 3 900 – 6 400 €, 4 500 € retenu (amorti 4 ans) |
| Amortissement mensuel | ~95 €/mois |
| Électricité (100 W × 12 h/j × 30 j × 0,20 €/kWh, tarif réglementé août 2026)[^12] | ~7 €/mois |
| Maintenance, sauvegarde, support | ~50 €/mois |
| **Coût mensuel total** | **~155 €/mois** |

**Équivalent cloud (22,5 M tokens d'entrée + 11,25 M de sortie par mois, tarifs du 2026-10-09 ; Fable 5.1 et DeepSeek relevés le 2026-10-10) :**
- Haiku 5.5 ou GPT-6 Luna (0,10 / 0,50 $) : 2,25 + 5,6 = **~8 $/mois** (~7 €, offre économique)
- DeepSeek V4.1 Flash, API DeepSeek en heures pleines (0,30 / 1,20 $) : 6,75 + 13,5 = **~20 $/mois** (~19 €, ~9 € en heures creuses — données traitées en Chine)
- Sonnet 5.5 ou GPT-6 Sol (2 / 10 $) : 45 + 112,5 = **~158 $/mois** (~145 €, milieu de gamme)
- GPT-5.5 (5 / 30 $) : 112,5 + 337,5 = **~450 $/mois** (~414 €, modèle frontière)
- Claude Fable 5.1 (10 / 50 $) : 225 + 562,5 = **~787 $/mois** (~724 €, frontière +)

| API choisie (tarifs du 2026-10-09, 1 $ ≈ 0,92 €) | Coût cloud/mois | Point de rentabilité |
| :-- | :-- | :-- |
| Économique : Haiku 5.5, GPT-6 Luna, Mistral Large 3 (0,10–0,50 $ / 0,50–1,50 $)[^1][^2][^3] | ~7 – 26 €/mois | ❌ Jamais amorti uniquement sur le coût |
| Économique chinois : DeepSeek V4.1 Flash, API DeepSeek (0,30 / 1,20 $ en heures pleines, moitié en heures creuses)[^11] | ~9 – 19 €/mois | ❌ Jamais amorti uniquement sur le coût — et données traitées en Chine, hors UE |
| Cloud open-weights (Together AI Llama 3.3 70B, 1,04 $/M)[^5] | ~32 €/mois | ❌ Jamais amorti uniquement sur le coût |
| Milieu de gamme : Sonnet 5.5, GPT-6 Sol (2 / 10 $)[^1][^2] | ~145 €/mois | ~51 mois (au-delà de l'amortissement) |
| Haut de gamme : Opus 5.5, GPT-5.6 Sol (4 / 20 $)[^1][^2] | ~290 €/mois | ~19 mois |
| Frontière : GPT-5.5 (5 / 30 $)[^1] | ~414 €/mois | **~13 mois** |
| Frontière + : Claude Fable 5.1 (10 / 50 $)[^2] | ~724 €/mois | **~7 mois** |

*Point de rentabilité = 4 500 € de capital / (coût cloud mensuel − 57 €/mois de fonctionnement on-premise hors amortissement), formule de la section « Calculer votre propre TCO » : 4 500 / (724 − 57) ≈ 6,7 mois face à Fable 5.1 ; 4 500 / (414 − 57) ≈ 12,6 mois face à GPT-5.5.*

> [!tip] La souveraineté change le calcul
> Pour une PME soumise au RGPD traitant des données clients, "le cloud open-weights est moins cher" ne suffit pas — un hébergeur tiers reste un destinataire au sens RGPD, et une API opérée depuis la Chine (DeepSeek) ajoute un transfert hors UE. Face aux API économiques (Haiku 5.5, Mistral Large 3, DeepSeek, cloud open-weights), le surcoût on-premise est de l'ordre de 120 à 150 €/mois ; face aux modèles frontière (GPT-5.5, Opus 5.5, Fable 5.1), l'on-premise est déjà moins cher. Dans le premier cas, ce surcoût peut éviter des honoraires d'avocat bien plus élevés.

---

## Blueprint C — Cluster Bureau (Exo / Thunderbolt)

**Usage adapté :** prototypage de modèles > 100B, traitement batch asynchrone.

| Poste | Montant |
| :-- | :-- |
| 4× Mac mini M5 Pro 64 Go (base 24 Go à 1 999 € TTC, option 64 Go sur configurateur Apple) ou 4× Mac Studio M5 Max 64 Go à 3 659 € TTC — prix France relevés le 2026-10-09[^7] | ~9 000 – 14 600 € (amorti 4 ans) |
| Hub Thunderbolt + câbles | ~300 € |
| Amortissement mensuel | ~195 – 310 €/mois |
| Électricité (4 × 30 W × 16 h/j × 30 j × 0,20 €/kWh, tarif réglementé août 2026)[^12] | ~12 €/mois |
| Maintenance et administration | ~80 €/mois |
| **Coût mensuel total** | **~285 – 400 €/mois** |

**Équivalent cloud pour modèles > 100B :**

Les modèles open-weights de cette classe (DeepSeek V4, GLM-5.3, Kimi K3) sont disponibles via des API OpenAI-compatibles chez des hébergeurs spécialisés (Together AI, Groq) à des tarifs souvent inférieurs aux modèles propriétaires — mais hébergés hors de vos locaux[^5] :

| Service (tarifs du 2026-10-09, USD hors taxes) | Tarif 100B+ | Coût pour 33,75 M tok/mois (2/3 en entrée) |
| :-- | :-- | :-- |
| Together AI (DeepSeek V4 Pro)[^5] | 1,32 / 3,96 $/M tok | ~74 $ ≈ 68 €/mois |
| Together AI (DeepSeek V4.1 Flash)[^5] | 0,30 / 1,20 $/M tok | ~20 $ ≈ 18 €/mois |
| GPU cloud on-demand (4× A100 80 Go à 2,79 $/h, ou 4× H100 à 3,99 $/h, 24 h/24)[^6] | ~8 150 – 11 650 $/mois | ~7 500 – 10 700 €/mois (≈ 2 500 – 3 500 € à 8 h/jour) |

> [!note] Point de rentabilité C
> Face à la location de GPU cloud 24 h/24 (7 500 à 10 700 €/mois), le cluster bureau est amorti en un à deux mois. Face aux API serverless qui servent les mêmes modèles open-weights (DeepSeek V4 chez Together AI : 18 à 68 €/mois pour 33,75 M tokens), il n'est jamais amorti sur le seul coût : son avantage est la confidentialité, l'accès permanent et l'absence de quota.

*Calcul : 9 300 à 14 900 € de capital / (7 500 €/mois de GPU cloud − 92 €/mois de fonctionnement du cluster hors amortissement) ≈ 1,3 à 2 mois.*

---

## Blueprint D — Datacenter (HGX 8-GPU)

**Usage adapté :** production haute concurrence, 50+ utilisateurs simultanés, SLA strict.

| Poste | Montant |
| :-- | :-- |
| Nœud 8 GPU (HGX H200 ; serveur 8× RTX PRO 6000 : 266 k$ prix public OEM ; nœud B300 : sur devis, ≈ 400 k$)[^13] | ~300 000 – 450 000 €, 400 000 € retenu (amorti 5 ans) |
| Infrastructure (réseau, refroidissement) + électricité (~10 kW × 8 760 h × 0,15–0,20 €/kWh ≈ 13 000 – 17 500 €/an)[^12] | ~30 000 – 40 000 €/an, 35 000 € retenu |
| Amortissement mensuel matériel | ~6 700 €/mois |
| Infrastructure + ops | ~2 900 €/mois |
| Ingénieur infrastructure dédié (0,5 ETP) | ~4 000 €/mois |
| **Coût mensuel total** | **~13 600 €/mois** |

**Équivalent cloud pour production SaaS 50+ utilisateurs :**

| Service | Coût estimé | Commentaire |
| :-- | :-- | :-- |
| API cloud (500 M tok/mois, 2/3 en entrée, tarifs du 2026-10-09)[^1][^2] | ~120 $ (Haiku 5.5) à ~6 700 $/mois (GPT-5.5) ; ~11 700 $ (Fable 5.1) | Pas de garantie SLA custom ; le nœud HGX ne devient moins cher qu'au-delà de ~1 G tokens/mois face à GPT-5.5 (~0,6 G face à Fable 5.1) |
| GPU dédié cloud (8× A100 80 Go on-demand, 2,79 $/GPU-h)[^6] | ~16 000 $/mois (8× H100 : ~23 000 $) | SLA fort, mais coût élevé |
| GPU réservé cloud (1 an, H100 × 8)[^6] | ~11 000 $/mois (1,9 $/GPU-h) à ~32 000 $/mois selon l'hébergeur | Engagement 1 an ; demander un devis |

> [!note] Point de rentabilité D
> Le nœud HGX devient compétitif au bout de 28 à 49 mois face au GPU dédié cloud on-demand (tarifs Lambda du 2026-10-09)[^6], et seulement au-delà d'environ 1 milliard de tokens par mois face à une API frontière. Sa vraie valeur n'est pas uniquement économique : c'est la **maîtrise totale** (données, modèles, SLA, évolution du modèle), le **contrôle des coûts sur 5 ans**, et la conformité réglementaire maximale.

*Calcul : 400 000 € / (15 000 €/mois de 8× A100 on-demand − 6 900 €/mois d'ops et d'infrastructure) ≈ 49 mois ; 400 000 € / (21 400 €/mois de 8× H100 on-demand − 6 900 €) ≈ 28 mois. Seuil API : 13 600 € ≈ 14 800 $/mois ÷ 13,3 $/M pondéré (GPT-5.5) ≈ 1,1 G tokens/mois.*

---

## Synthèse — Quand choisir quoi ?

```
Volume mensuel tokens          Contrainte souveraineté   → Blueprint recommandé
─────────────────────────────────────────────────────────────────────────────
< 5 M tokens/mois              Faible                    → API cloud (coût < on-prem)
< 5 M tokens/mois              Forte (RGPD, secret pro)  → Blueprint A ou B
5–50 M tokens/mois             Modérée                   → Blueprint B si le comparateur est un modèle frontière (GPT-5.5, Opus 5.5, Fable 5.1) ; sinon API
5–50 M tokens/mois             Forte                     → Blueprint B impératif
> 50 M tokens/mois             Quelconque                → Blueprint B ou D
Modèles 100B+                  Quelconque                → Blueprint C (prototypage) ou D (prod)
50+ utilisateurs simultanés    Forte                     → Blueprint D
```

### TCO à 3 ans — récapitulatif visuel

| Blueprint | Coût/mois | Total 3 ans | Équivalent API cloud 3 ans (tarifs d'octobre 2026, 1 $ ≈ 0,92 €) |
| :-- | :-- | :-- | :-- |
| A (labo dev, 5 M in + 2,5 M out/mois) | ~55 – 85 € | ~2 000 – 3 100 € | ~60 € (Haiku 5.5) / ~1 160 € (Sonnet 5.5, GPT-6 Sol) / ~3 300 € (GPT-5.5) / ~5 800 € (Fable 5.1) |
| B (PME, 34 M tok/mois) | ~155 € | ~5 580 € | ~260 € (Haiku 5.5) / ~670 € (DeepSeek V4.1 Flash) / ~1 160 € (Together AI Llama 3.3 70B) / ~5 200 € (Sonnet 5.5) / ~10 400 € (Opus 5.5) / ~14 900 € (GPT-5.5) / ~26 100 € (Fable 5.1) |
| C (cluster, 34 M tok/mois, modèles 100B+) | ~285 – 400 € | ~10 300 – 14 400 € | ~670 € (DeepSeek V4.1 Flash) / ~2 460 € (DeepSeek V4 Pro, Together AI) / ~270 000 € (4× A100 on-demand 24 h/24) |
| D (datacenter, 500 M tok/mois) | ~13 600 € | ~489 600 € | ~77 000 € (Sonnet 5.5) / ~221 000 € (GPT-5.5) / ~386 000 € (Fable 5.1) / ~365 000 – 540 000 € (8 GPU, de H100 réservés 1 an à 1,9 $/GPU-h à A100 on-demand) |

*Calcul : coût cloud mensuel des sections A à D × 36 mois (Fable 5.1 et DeepSeek relevés le 2026-10-10) ; GPU cloud : ~11 000 $/mois réservés 1 an à 1,9 $/GPU-h (tableau D) et 8× A100 on-demand ≈ 16 300 $/mois (Lambda, 2026-10-09)[^6].*

> [!warning] Coûts cachés à ne pas oublier
> - **Formation et onboarding** de l'équipe sur la stack on-premise
> - **Temps d'administration** (mises à jour, monitoring, backups) — souvent sous-estimé
> - **Obsolescence matérielle** : les GPU de 2024-2025 peuvent ne pas supporter les modèles de 2027 optimalement
> - **Prix de la mémoire** : DRAM contractuelle +10–15 % par trimestre au T4 2026 et hausses attendues chaque trimestre jusqu'en 2027 (TrendForce) ; DGX Spark 128 Go passé de 3 999 $ à ≈ 6 950 $, RTX PRO 6000 de moins de 8 000 $ à 16 000 $ en un an. Un devis matériel ne vaut que quelques semaines[^9][^14][^15].
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
| **Inférence** (modèle gelé, génération) | Poids + KV cache | GPU rapide avec VRAM suffisante | RTX 5090 (32 Go), L40S (48 Go), APU 128 Go |
| **Fine-tuning LoRA** (adaptateurs seulement) | Poids + gradients + optimizer states (~2–3× l'inférence) | Mémoire unifiée haute capacité ou multi-GPU | Mac Studio M5 Ultra 256–512 Go, AMD Gorgon Halo 192 Go, DGX Spark 128 Go |
| **Fine-tuning full (SFT complet)** | Très élevé — souvent 2–4× les poids bruts en FP16 | Serveur multi-GPU ou datacenter | 2–4× A100 80 Go, ou DGX Station |
| **Entraînement complet (pre-training)** | Plusieurs centaines de Go à plusieurs To | Clusters datacenter — hors portée on-prem PME | H100, systèmes HGX/DGX |

> [!warning] Ne pas confondre les profils
> Un GPU rapide en inférence (RTX 5090, 32 Go VRAM) peut crasher immédiatement sur du fine-tuning LoRA d'un modèle 70B en FP16 — les optimizer states alourdissent la mémoire requise à ~60–70 Go, bien au-delà de la VRAM disponible. À l'inverse, un système haute capacité mais lente bande passante (ex. AMD Gorgon Halo à ~273 Go/s) est sous-optimal pour servir 50 utilisateurs simultanés sur un modèle 7B.

### Le KPI « tokens/s par k€ » pour comparer les options d'inférence

Pour arbitrer entre deux options matérielles d'inférence, le ratio **tokens par seconde par millier d'euros investi** (tokens/s/k€) est plus parlant que la vitesse brute seule.

Exemple de lecture :
- RTX 5090 (32 Go, MSRP 1 999 $, mais ≥ 5 000 $ ≈ 4 600 € en magasin en septembre 2026)[^10] : à ~60 tok/s sur un modèle 8B → **~13 tok/s/k€** au prix constaté, ~30 au MSRP — le ratio dépend désormais autant de la pénurie que du silicium
- Mac Studio M5 Max 128 Go (~5 000 €, 614 Go/s) : si elle délivre ~12–15 tok/s sur un 70B Q4 → **~2,5–3 tok/s/k€**[^7]

Ces deux chiffres sont cohérents : le Mac Studio sert des modèles beaucoup plus gros que la RTX 5090 (32 Go), donc la comparaison directe n'a de sens que pour le **même modèle et la même quantification**.

> [!warning] Limites du ratio tokens/s/k€
> Ce ratio dépend fortement du **modèle**, de la **quantification**, et du **batch size** :
> - **Batch size = 1 (un seul utilisateur)** : favorise les GPU à haute bande passante GDDR (RTX 5090, L40S) — le décodage autorégressif est memory-bound, et la GDDR est plus rapide que la LPDDR5x.
> - **Batch size élevé (10–50 requêtes simultanées)** : favorise les systèmes haute capacité mémoire et les moteurs optimisant le batching (vLLM avec PagedAttention) — la bande passante est moins limitante, la capacité prime.
> - **Modèles > 70B** : seuls les systèmes avec 128 Go+ de mémoire peuvent s'exprimer — la comparaison RTX 5090 vs DGX Spark sur un 70B n'est pas possible sur la RTX 5090 (32 Go) ; le DGX Spark 64 Go annoncé à 4 999 $ pour le 23 octobre 2026 ne change pas cette règle : 64 Go restent justes pour un 70B Q4 avec contexte[^9].

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
[^2]: Anthropic, *Pricing* (Claude Opus 5.5 4 / 20 $, Sonnet 5.5 2 / 10 $, Haiku 5.5 0,10 / 0,50 $ par million de tokens, relevé le 2026-10-09 ; Claude Fable 5.1 et Claude Mythos 5.1 10 / 50 $, relevé le 2026-10-10, Mythos 5.1 en disponibilité limitée ; Claude 3.5 Sonnet retiré de la page). [https://platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing)
[^3]: Mistral AI, *Pricing* (Mistral Large 3 : 0,50 / 1,50 $ par million de tokens), relevé le 2026-10-09. [https://mistral.ai/pricing](https://mistral.ai/pricing) · Mistral AI, *Mistral Large 4* (preview API 1,36 / 4,18 $, poids ouverts annoncés fin octobre 2026), 2026-10-06. [https://mistral.ai/news/mistral-large-4](https://mistral.ai/news/mistral-large-4)
[^4]: Groq, *GroqCloud — Models* (openai/gpt-oss-120b 0,15 / 0,60 $ par million de tokens ; Llama 3.3 70B et Llama 3.1 8B passés « Enterprise / Contact sales », sans prix public), relevé le 2026-10-09. [https://console.groq.com/docs/models](https://console.groq.com/docs/models)
[^5]: Together AI, *Pricing* (Llama 3.3 70B 1,04 / 1,04 $ ; DeepSeek V4 Pro 1,32 / 3,96 $, DeepSeek V4.1 Flash 0,30 / 1,20 $, GLM-5.3 1,40 / 4,40 $ et Kimi K3 3 / 15 $ en API OpenAI-compatible), relevé le 2026-10-09. [https://www.together.ai/pricing](https://www.together.ai/pricing)
[^6]: Lambda, *GPU Cloud Pricing* (on-demand : H100 SXM 3,99 $, A100 80 Go 2,79 $ par GPU-heure ; H100 réservé 2 semaines à 1 an : 5,54 – 6,16 $), relevé le 2026-10-09. [https://lambda.ai/pricing](https://lambda.ai/pricing)
[^7]: Apple, *Mac Studio* et *Mac mini* — Apple Store France (Mac Studio M5 Max 64 Go 3 659 € TTC ; Mac mini M5 Pro 24 Go 1 999 € TTC ; options 128 Go et 64 Go sur configurateur uniquement), relevé le 2026-10-09. [https://www.apple.com/fr/shop/buy-mac/mac-studio](https://www.apple.com/fr/shop/buy-mac/mac-studio) · [https://www.apple.com/fr/shop/buy-mac/mac-mini](https://www.apple.com/fr/shop/buy-mac/mac-mini)
[^8]: Framework, *Framework Desktop — AMD Ryzen AI Max+ 395* (64 Go 2 209 € TTC, 128 Go 3 889 € TTC, en rupture), relevé le 2026-10-09. [https://frame.work/fr/fr/products/desktop-diy-amd-aimax300](https://frame.work/fr/fr/products/desktop-diy-amd-aimax300)
[^9]: ServeTheHome, *NVIDIA DGX Spark 64GB Launched and Big 128GB GB10 Price Increases* (DGX Spark 128 Go ≈ 6 950 $, lancé à 3 999 $ ; version 64 Go à 4 999 $ via OEM), 2026-10-03. [https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/](https://www.servethehome.com/nvidia-dgx-spark-64gb-launched-and-big-128gb-gb10-price-increases/) · NVIDIA Blog, *NVIDIA DGX Spark 64GB Gives Developers More Ways to Build and Scale Local AI* (même GB10, à partir de 4 999 $, modèles jusqu'à 100 B paramètres, OEM Acer, ASUS, Dell, Gigabyte, HP, MSI à partir du vendredi 23 octobre ; deux unités reliées en QSFP = 128 Go, modèles jusqu'à 200 B), 2 octobre 2026. [https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/](https://blogs.nvidia.com/blog/local-ai-dgx-spark-64gb-sync/)
[^10]: Tom's Hardware, *Nvidia's RTX 5090 vanishes from online retail in the US* (jusqu'à 9 500 $ chez les revendeurs tiers pour un MSRP de 1 999 $), 2026-09-14. [https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu](https://www.tomshardware.com/pc-components/gpus/nvidias-rtx-5090-vanishes-from-online-retail-in-the-us-third-party-sellers-now-demand-as-much-as-usd9-500-for-nvidias-fastest-gpu)
[^11]: DeepSeek, *Models & Pricing* (`deepseek-flash`, servi par DeepSeek-V4.1-Flash : 0,30 / 1,20 $ par million de tokens en heures pleines — 01h–04h et 06h–10h UTC du lundi au vendredi hors jours fériés chinois — et moitié prix le reste du temps ; `deepseek-v4-pro` 1,32 / 3,96 $), relevé le 2026-10-10. [https://api-docs.deepseek.com/quick_start/pricing](https://api-docs.deepseek.com/quick_start/pricing) · DeepSeek, *Privacy Policy* (« we directly collect, process and store your Personal Data in People's Republic of China »), 2026-02-10. [https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html)
[^12]: EDF, *Tarif Bleu — offre d'électricité au tarif réglementé* (option Base : 0,2001 € TTC/kWh depuis le 2026-08-01), relevé le 2026-10-09. [https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html](https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html)
[^13]: AMD, *AAI 2026: AMD Delivers Full-Stack Compute for the Agentic AI Era* (note 8 : serveur 8× RTX PRO 6000 au prix public OEM de 265 928 $ au 2026-07-16 ; serveur MI350P estimé 327 238 $), 23 juillet 2026. [https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era](https://ir.amd.com/news-events/press-releases/detail/1294/aai-2026-amd-delivers-full-stack-compute-for-the-agentic-ai-era)
[^14]: TrendForce, communiqué du 30 septembre 2026 (prix contractuels DRAM en hausse de 10–15 % au T4 2026, hausses attendues sur les trimestres suivants). [https://www.trendforce.com/presscenter/news/20260930-13258.html](https://www.trendforce.com/presscenter/news/20260930-13258.html)
[^15]: Tom's Hardware, *Nvidia doubles RTX PRO 6000 Blackwell's MSRP to a staggering $16,000* (96 Go, précommandes sous 8 000 $ en 2025), août 2026. [https://www.tomshardware.com/pc-components/gpus/nvidia-doubles-rtx-pro-6000-blackwells-msrp-to-a-staggering-usd16-000-96gb-card-started-pre-orders-below-usd8-000-last-year](https://www.tomshardware.com/pc-components/gpus/nvidia-doubles-rtx-pro-6000-blackwells-msrp-to-a-staggering-usd16-000-96gb-card-started-pre-orders-below-usd8-000-last-year)
