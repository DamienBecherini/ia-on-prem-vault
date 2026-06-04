---
title: "Khoj"
description: Assistant personnel self-hostable orienté second cerveau, documents, web, agents et automatisations, avec support de modèles locaux via Ollama.
sidebar:
  order: 5
---

## 🔍 Vue d'ensemble rapide

Khoj se présente comme un **second cerveau IA** : réponses à partir du web ou de vos documents, agents personnalisés, automatisations planifiées, recherche profonde, et accès depuis navigateur, Obsidian, Emacs, desktop, mobile ou WhatsApp[^1].

Le projet est open-source et self-hostable, mais il existe aussi une application cloud officielle. Le verdict souveraineté dépend donc fortement du mode de déploiement.

## 💡 Pourquoi ce projet nous intéresse

Khoj est probablement le plus proche de l'idée "assistant personnel augmenté" : il connecte documents, web, agents et automatisations, avec une intégration Obsidian intéressante pour les utilisateurs de vaults.

Dans ce vault, il sert de pont entre la Piste A (assistant qui vous connaît) et la Piste B (agent qui agit) : il peut mémoriser, chercher, répondre et déclencher des actions.

## ✅ Points forts

- **Self-hostable** : installation locale ou serveur privé possible[^1].
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

Projet open-source ancien pour ce secteur (créé en 2021) et activement maintenu. Sa richesse fonctionnelle impose cependant de tester précisément le mode self-host avant recommandation dans un contexte réglementé.

## 📚 Sources

[^1]: Khoj GitHub — second brain, self-hostable, documents, agents et automatisations. [https://github.com/khoj-ai/khoj](https://github.com/khoj-ai/khoj)
[^2]: Khoj docs — intégration Ollama et `OPENAI_BASE_URL`. [https://docs.khoj.dev/advanced/ollama](https://docs.khoj.dev/advanced/ollama)
[^3]: Khoj Docker Compose — `KHOJ_TELEMETRY_DISABLE=True` et config Ollama. [https://github.com/khoj-ai/khoj/blob/master/docker-compose.yml](https://github.com/khoj-ai/khoj/blob/master/docker-compose.yml)
