---
title: "Open WebUI"
description: Interface web self-hosted pour Ollama et backends OpenAI-compatibles, adaptée aux déploiements locaux multi-utilisateurs.
sidebar:
  order: 2
---

## 🔍 Vue d'ensemble rapide

Open WebUI est une plateforme web self-hosted pour exposer des modèles locaux via Ollama, vLLM ou toute API OpenAI-compatible. Le projet se présente comme extensible, riche en fonctionnalités, et capable de fonctionner entièrement offline[^1][^2].

> [!tip] Le bon cas d'usage
> Open WebUI est souvent le meilleur premier choix pour une PME ou un lab qui veut transformer un serveur Ollama en interface partagée : comptes utilisateurs, historique, fichiers, RAG, modèles multiples et administration centralisée.

## 💡 Pourquoi ce projet nous intéresse

Open WebUI occupe la place de "portail ChatGPT interne" dans une stack on-premise. Il ne remplace pas le moteur d'inférence : il orchestre l'accès aux modèles, l'interface, les utilisateurs, les fichiers et les plugins.

Dans ce vault, c'est la solution de référence pour le scénario **multi-utilisateur simple** : un backend local, une interface web, des droits, une adoption facile.

## ✅ Points forts

- **Self-hosted** : Docker, Kubernetes, Python, images avec Ollama ou CUDA selon besoin[^1].
- **Provider-agnostic** : Ollama, OpenAI-compatible APIs, vLLM et autres backends[^2].
- **Expérience utilisateur mature** : historique, fichiers, RAG, plugins, modèles multiples.
- **Déploiement local crédible** : peut être lié à Ollama via `OLLAMA_BASE_URL`[^3].
- **Observabilité maîtrisable** : OpenTelemetry disponible pour vos propres traces/logs en production[^3].

## ⚠️ Limites et risques

- **Pas un moteur d'inférence** : il faut dimensionner Ollama/vLLM séparément.
- **Surface d'administration** : comptes, plugins, CORS, secrets et exposition réseau doivent être durcis.
- **Provider cloud possible** : s'il est connecté à OpenAI/Anthropic, les données suivent le provider choisi.
- **Télémétrie/analytics à vérifier** : les variables `SCARF_NO_ANALYTICS`, `DO_NOT_TRACK`, `ANONYMIZED_TELEMETRY` doivent être fixées dans un contexte strict[^3].

## 🔒 Souveraineté et confidentialité

- **Données :** stockées dans l'instance self-hosted.
- **Modèle :** local si `OLLAMA_BASE_URL` / vLLM local ; cloud si provider externe configuré.
- **Mémoire :** historique et RAG dans l'instance.
- **Télémétrie :** désactivation recommandée via variables d'environnement[^3].
- **Mode 100% offline :** oui si images, modèles et dépendances sont préchargés.
- **Verdict :** ⚠️ configurable — excellent on-prem si durci, mais multi-provider par nature.

Voir la grille complète : [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]].

## 🔗 Intégration possible dans ce vault

Open WebUI est un bon compagnon des blueprints :

- [[04-blueprints/scenario-a-dev-lab|Scénario A]] : UI locale personnelle devant Ollama.
- [[04-blueprints/scenario-b-sme-appliance|Scénario B]] : portail PME pour quelques utilisateurs.
- [[04-blueprints/scenario-d-datacenter|Scénario D]] : front d'accès sur vLLM/TensorRT-LLM derrière proxy.

## 📊 Maturité du projet

Projet très utilisé et activement maintenu, avec une large communauté GitHub et un écosystème de plugins. La maturité produit est bonne, mais le durcissement sécurité reste une responsabilité de l'opérateur.

## 📚 Sources

[^1]: Open WebUI GitHub — plateforme self-hosted offline, support Ollama et images Docker/Kubernetes. [https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)
[^2]: Open WebUI Docs — home, providers et fonctionnalités. [https://docs.openwebui.com/](https://docs.openwebui.com/)
[^3]: Open WebUI Configuration — `OLLAMA_BASE_URL`, télémétrie, secrets, OpenTelemetry. [https://www.mintlify.com/open-webui/open-webui/configuration](https://www.mintlify.com/open-webui/open-webui/configuration)
