---
title: "🧪 Mise en œuvre pratique"
description: Protocoles concrets pour choisir, tester, sécuriser et opérer une IA locale au-delà du dimensionnement matériel.
sidebar:
  order: 1
last_modified: "2026-06-05"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

La section 06 transforme les concepts des fondations, du matériel, de la stack logicielle et des blueprints en **méthodes de décision**.

> [!tip] Objectif
> Ne pas choisir un modèle, une machine ou un outil parce qu'il est populaire, mais parce qu'il réussit vos tests, sur vos données, avec vos contraintes de souveraineté.

---

## Par où commencer ?

1. [[06-mise-en-oeuvre/getting-started-with-ollama|Démarrer avec Ollama]] — installation, premier modèle, API, réglages de base.
2. [[06-mise-en-oeuvre/evaluate-local-model|Évaluer un modèle local]] — comparer qualité, hallucinations, cohérence, RAG, agents et performances.
3. [[06-mise-en-oeuvre/local-inference-security|Sécurité de l'inférence locale]] — authentification API, isolation réseau, OWASP LLM Top 10, agents sécurisés.
4. [[06-mise-en-oeuvre/configure-vllm-multi-gpu|Configurer vLLM multi-GPU]] — tensor parallelism, Ray multi-nœuds, production hardening.
5. [[06-mise-en-oeuvre/monitoring-inference-stack|Monitoring Prometheus + Grafana]] — métriques vLLM, GPU DCGM, dashboards et alertes.
6. [[06-mise-en-oeuvre/migrate-ollama-to-vllm|Migrer d'Ollama vers vLLM]] — compatibilité API, conversion modèles, stratégie de bascule sans coupure.

---

## Voir aussi

- [[03-stack-logicielle/inference-engines-vllm-ollama|Moteurs d'inférence]]
- [[01-fondations/quantization-4bit-8bit|Quantification]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]]
