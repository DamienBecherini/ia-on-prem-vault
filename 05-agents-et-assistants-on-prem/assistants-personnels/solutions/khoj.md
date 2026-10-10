---
title: "Khoj"
description: Assistant personnel self-hostable orienté second cerveau, documents, web, agents et automatisations, avec support de modèles locaux via Ollama.
sidebar:
  order: 5
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Vue d'ensemble rapide

Khoj se présente comme un **second cerveau IA** : réponses à partir du web ou de vos documents, agents personnalisés, automatisations planifiées, recherche profonde, et accès depuis navigateur, Obsidian, Emacs, desktop, mobile ou WhatsApp[^1].

Le projet est open-source et self-hostable, mais il existe aussi une application cloud officielle. Le verdict souveraineté dépend donc fortement du mode de déploiement.

## 💡 Pourquoi ce projet nous intéresse

Khoj est probablement le plus proche de l'idée "assistant personnel augmenté" : il connecte documents, web, agents et automatisations, avec une intégration Obsidian intéressante pour les utilisateurs de vaults.

Dans ce vault, il sert de pont entre la Piste A (assistant qui vous connaît) et la Piste B (agent qui agit) : il peut mémoriser, chercher, répondre et déclencher des actions.

## ✅ Points forts

- **Self-hostable** : installation locale ou serveur privé possible[^1] — mais ne l'exposez pas au-delà d'un réseau de confiance : un avis de juin 2026 (traversée de chemin non authentifiée sur `/home/`) n'indique aucune version corrigée au 2026-10-10[^5].
- **Documents variés** : PDF, Markdown, org-mode, Word, Notion, images selon configuration[^1].
- **Local LLM possible** : intégration Ollama via serveur OpenAI-compatible local[^2].
- **Agents et automatisations** : custom agents, schedules, deep research[^1].
- **Écosystème personnel** : navigateur, Obsidian, Emacs, desktop, téléphone.

## ⚠️ Limites et risques

- **Cloud officiel disponible** : simple à utiliser, mais hors on-prem strict.
- **Télémétrie à désactiver** : `KHOJ_TELEMETRY_DISABLE=True` dans Docker/env pour contexte sensible[^3].
- **Fonctions web/recherche** : peuvent impliquer des appels réseau selon outils activés.
- **Configuration Ollama à tester** : URL Docker, `/v1/`, modèle exact et réseau local peuvent être source de friction[^2].

## 🔒 Souveraineté et confidentialité

- **Données :** locales si self-host ; cloud si `app.khoj.dev`.
- **Modèle :** local via Ollama/OpenAI-compatible base URL ; cloud si provider externe choisi[^2].
- **Mémoire :** index documentaire dans l'instance.
- **Télémétrie :** désactivable via `KHOJ_TELEMETRY_DISABLE=True`[^3].
- **Mode 100% offline :** partiel ; possible pour documents + modèle local, limité pour web/deep research.
- **Verdict :** ⚠️ configurable — bon candidat self-host, mais pas souverain par défaut si on utilise l'app cloud.

Voir la grille complète : [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]].

## 🔗 Intégration possible dans ce vault

Khoj est intéressant si le vault doit devenir une vraie mémoire personnelle :

- indexation Markdown/Obsidian ;
- chat avec citations ;
- agent personnel pour recherche et synthèse ;
- automatisations simples autour de notes et documents.

## 📊 Maturité du projet

Projet open-source ancien pour ce secteur (créé en 2021, AGPL-3.0), mais en **stagnation depuis le printemps 2026** : dernière version 2.0.0-beta.28 en mars 2026, une douzaine de commits sur l'été (dernier le 2026-08-02), et l'équipe concentre son effort sur Pipali, son nouveau « co-worker IA » local[^4]. Rien n'indique un abandon, mais une recommandation en contexte réglementé suppose de vérifier qu'un correctif de sécurité serait publié ; testez précisément le mode self-host avant de l'engager.

L'équipe Khoj publie depuis 2026 **Pipali** (Apache-2.0, 0.10.0 le 2026-09-14), un agent de bureau « co-worker » qui lit et écrit des fichiers, navigue sur le web et s'intègre à Jira, Linear ou Slack via MCP. Sa fiche GitHub met en avant des modèles cloud (Claude, GPT, Kimi, DeepSeek, Gemini…) servis par la plateforme Pipali ; le support de modèles locaux n'a pas été vérifié dans ce vault. C'est un candidat Piste B plus que Piste A, et il explique la baisse d'activité de Khoj[^4].

## 🔗 Voir aussi

- [[00-lexique/memory-tree|Memory Tree]] · [[00-lexique/rag|RAG]] · [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]
- [[00-lexique/ollama|Ollama]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai|Jan.ai]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] — comparaison mémoire hiérarchique
- [[04-blueprints/scenario-a-dev-lab|Scénario A]] · [[06-mise-en-oeuvre/evaluate-local-model|🧪 Évaluer un modèle]]

## 📚 Sources

[^1]: Khoj GitHub — second brain, self-hostable, documents, agents et automatisations. [https://github.com/khoj-ai/khoj](https://github.com/khoj-ai/khoj)
[^2]: Khoj docs — intégration Ollama et `OPENAI_BASE_URL`. [https://docs.khoj.dev/advanced/ollama](https://docs.khoj.dev/advanced/ollama)
[^3]: Khoj Docker Compose — `KHOJ_TELEMETRY_DISABLE=True` et config Ollama. [https://github.com/khoj-ai/khoj/blob/master/docker-compose.yml](https://github.com/khoj-ai/khoj/blob/master/docker-compose.yml)
[^4]: khoj-ai — *khoj* Releases (2.0.0-beta.28 du 2026-03-26), commits (dernier le 2026-08-02) et README (mention de Pipali) ; *pipali* (Apache-2.0, release 0.10.0 du 2026-09-14), consultés le 2026-10-10. [https://github.com/khoj-ai/khoj/releases](https://github.com/khoj-ai/khoj/releases) · [https://github.com/khoj-ai/khoj/commits/master](https://github.com/khoj-ai/khoj/commits/master) · [https://github.com/khoj-ai/pipali](https://github.com/khoj-ai/pipali)
[^5]: khoj-ai, *GHSA-62mm-xwmv-crhg* — « Unauthenticated path traversal in /home/ endpoint allows file read from server filesystem » (versions affectées « <= latest », aucune version corrigée indiquée), 2026-06-24. [https://github.com/khoj-ai/khoj/security/advisories/GHSA-62mm-xwmv-crhg](https://github.com/khoj-ai/khoj/security/advisories/GHSA-62mm-xwmv-crhg)
