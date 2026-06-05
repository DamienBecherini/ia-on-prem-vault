---
title: Benchmark LLM
description: Jeu de tests standardisé pour comparer les capacités, limites et risques de modèles de langage.
aliases:
  - benchmark de modèle
  - leaderboard LLM
tags:
  - lexique
  - evaluation
last_modified: "2026-06-05"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Test standardisé qui mesure une ou plusieurs capacités d'un [[00-lexique/llm|LLM]] : raisonnement, code, factualité, instruction following, robustesse ou performance.

## 📖 Définition détaillée

Un benchmark LLM est utile pour comparer rapidement des modèles, mais il mesure toujours un **protocole précis**. MMLU ne teste pas la même chose que SWE-bench ; TruthfulQA ne teste pas la même chose que les tokens/s.

Les benchmarks publics sont donc un point de départ, pas une décision finale.

## 💡 Pourquoi c'est important en IA on-premise

En local, le meilleur modèle n'est pas forcément le mieux classé. Il doit aussi tenir en [[00-lexique/vram|VRAM]], respecter la confidentialité, répondre assez vite et réussir vos tests métier.

## ⚠️ Pièges fréquents

- Confondre score leaderboard et qualité sur vos documents.
- Comparer deux modèles avec des quantifications, prompts ou moteurs différents.
- Ignorer les mesures locales : [[00-lexique/ttft|TTFT]], [[00-lexique/tokens-per-second|tokens/s]], stabilité, consommation mémoire.

## 🔗 Voir aussi

- [[06-mise-en-oeuvre/evaluate-local-model|Évaluer un modèle local]]
- [[00-lexique/llm-as-a-judge|LLM-as-a-judge]]
- [[00-lexique/ragas|RAGAS]]
