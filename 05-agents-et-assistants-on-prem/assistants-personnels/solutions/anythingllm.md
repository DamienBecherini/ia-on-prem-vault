---
title: "AnythingLLM"
description: Application local-first pour RAG, agents, documents et workflows, avec support Ollama et télémétrie désactivable.
sidebar:
  order: 3
---

## 🔍 Vue d'ensemble rapide

AnythingLLM est une application "all-in-one" pour construire un ChatGPT privé autour de vos documents : ingestion, workspaces, agents, vector database, utilisateurs et providers locaux ou cloud[^1].

La version self-hosted est conçue comme **local-first** : Mintplex Labs n'héberge pas vos documents, historiques, embeddings ou paramètres si vous opérez votre propre instance[^2].

## 💡 Pourquoi ce projet nous intéresse

AnythingLLM est intéressant quand le besoin dépasse le simple chat local : RAG documentaire, workspaces séparés, équipe, agents et pipelines intégrés. C'est un candidat naturel pour une PME qui veut une application prête à l'emploi, sans assembler manuellement UI + vector DB + ingestion + auth.

## ✅ Points forts

- **All-in-one** : documents, workspaces, agents, multi-utilisateur, vector DB et pipelines[^1].
- **Support Ollama** : LLM et embeddings peuvent passer par Ollama en Docker[^3].
- **Stockage on-prem** : en self-host, les données résident sur l'infrastructure opérée par l'utilisateur[^2].
- **Air-gap possible** : si LLM, embeddings et vector database sont locaux[^2].
- **Télémétrie documentée** : PostHog optionnel, désactivable via `DISABLE_TELEMETRY=true`[^1].

## ⚠️ Limites et risques

- **Télémétrie opt-out** : elle existe ; il faut la désactiver explicitement dans un contexte strict[^1].
- **Providers externes possibles** : OpenAI, Anthropic, Pinecone ou autres peuvent casser la souveraineté si configurés[^2].
- **Outbound connections utiles** : modèles, CDN, GitHub ou services externes selon configuration[^1].
- **Complexité applicative** : plus simple qu'un assemblage maison, mais plus large qu'une UI Ollama minimaliste.

## 🔒 Souveraineté et confidentialité

- **Données :** locales en self-host ; pas d'accès Mintplex aux documents et historiques de l'instance[^2].
- **Modèle :** local avec Ollama/LocalAI ; cloud si provider externe configuré[^3].
- **Mémoire :** workspaces, documents et embeddings dans le stockage de l'instance.
- **Télémétrie :** optionnelle, anonyme, désactivable par UI ou `DISABLE_TELEMETRY=true`[^1].
- **Mode 100% offline :** oui si providers locaux et dépendances préchargées[^2].
- **Verdict :** ⚠️ configurable — très solide en self-host durci, pas souverain si branché à des providers cloud.

Voir la grille complète : [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]].

## 🔗 Intégration possible dans ce vault

AnythingLLM est pertinent pour :

- un portail documentaire PME ;
- des espaces séparés par équipe ou client ;
- des workflows RAG où l'administrateur veut éviter de composer lui-même Open WebUI + vector DB + ingestion.

## 📊 Maturité du projet

Projet mature et très suivi côté GitHub. Le modèle de licence/édition doit être vérifié avant usage commercial, mais la version self-hosted est suffisamment documentée pour un pilote on-prem.

## 📚 Sources

[^1]: AnythingLLM README — fonctionnalités, providers, télémétrie et `DISABLE_TELEMETRY`. [https://github.com/Mintplex-Labs/anything-llm/blob/master/README.md](https://github.com/Mintplex-Labs/anything-llm/blob/master/README.md)
[^2]: AnythingLLM Self-Hosted Terms — local-first, air-gap, stockage on-prem. [https://github.com/Mintplex-Labs/anything-llm/blob/master/TERMS_SELF_HOSTED.md](https://github.com/Mintplex-Labs/anything-llm/blob/master/TERMS_SELF_HOSTED.md)
[^3]: AnythingLLM Docker guide — Ollama comme LLM et embedding provider. [https://github.com/Mintplex-Labs/anything-llm/blob/master/docker/HOW_TO_USE_DOCKER.md](https://github.com/Mintplex-Labs/anything-llm/blob/master/docker/HOW_TO_USE_DOCKER.md)
