---
title: Benchmark LLM
description: Jeu de tests standardisé pour comparer les capacités, limites et risques de modèles de langage.
aliases:
  - benchmark de modèle
  - leaderboard LLM
tags:
  - lexique
  - evaluation
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Test standardisé qui mesure une ou plusieurs capacités d'un [[00-lexique/llm|LLM]] : raisonnement, code, factualité, instruction following, robustesse ou performance.

## 📖 Définition détaillée

Un benchmark LLM est utile pour comparer rapidement des modèles, mais il mesure toujours un **protocole précis**. MMLU ne teste pas la même chose que SWE-bench Pro ; TruthfulQA ne teste pas la même chose que les tokens/s.

Les benchmarks publics sont donc un point de départ, pas une décision finale.

## 💡 Pourquoi c'est important en IA on-premise

En local, le meilleur modèle n'est pas forcément le mieux classé. Il doit aussi tenir en [[00-lexique/vram|VRAM]], respecter la confidentialité, répondre assez vite et réussir vos tests métier.

## ⚠️ Pièges fréquents

- Confondre score leaderboard et qualité sur vos documents.
- Comparer deux modèles avec des quantifications, prompts ou moteurs différents.
- Lire un benchmark saturé : quand les meilleurs modèles dépassent 95 % (SWE-bench Verified en 2026, 97 % au sommet), l'écart entre deux candidats est du bruit ; passez à la variante plus dure (SWE-bench Pro, Terminal-Bench)[^1].
- Comparer deux scores d'un indice composite sans vérifier la version de l'indice (Artificial Analysis v4.3 a remplacé des sous-benchmarks le 7 septembre 2026)[^2].
- Confondre classement général et classement open weights : sur Arena, aucun modèle à poids ouverts ne figure dans le top 15 au T4 2026 — comparez les ouverts entre eux[^3].
- Ignorer les mesures locales : [[00-lexique/ttft|TTFT]], [[00-lexique/tokens-per-second|tokens/s]], stabilité, consommation mémoire.

## 🔗 Voir aussi

- [[06-mise-en-oeuvre/evaluate-local-model|Évaluer un modèle local]]
- [[00-lexique/llm-as-a-judge|LLM-as-a-judge]]
- [[00-lexique/ragas|RAGAS]]
- [[03-stack-logicielle/choose-your-model|Choisir son modèle local]] — lire un leaderboard sans se tromper

[^1]: Vals AI, *SWE-bench Verified* (« performance on this benchmark has saturated, we no longer run this benchmark on new model releases », top 97,0 %), mis à jour le 2026-09-01. [https://www.vals.ai/benchmarks/swebench](https://www.vals.ai/benchmarks/swebench)
[^2]: Artificial Analysis, *Intelligence Index v4.3* (Terminal-Bench 2.1 → 4.0, AutomationBench-AA, 45 % de tâches privées), 2026-09-07. [https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3](https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3)
[^3]: Arena, *Text Leaderboard* (snapshot du 2026-10-08 : aucun modèle open weights dans le top 15, kimi-k3-max au rang 16). [https://arena.ai/leaderboard/text](https://arena.ai/leaderboard/text)
