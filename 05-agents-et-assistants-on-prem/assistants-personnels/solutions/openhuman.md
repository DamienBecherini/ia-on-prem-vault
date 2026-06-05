---
title: "OpenHuman"
description: Assistant personnel local-first avec Memory Tree, mais expérience managée cloud par défaut pour le routage modèle, OAuth et certaines intégrations.
sidebar:
  order: 1
last_modified: "2026-06-04"
---

## 🔍 Vue d'ensemble rapide

OpenHuman est un assistant personnel open-source basé sur **Tauri + Rust**. Son idée forte est le **[[00-lexique/memory-tree|Memory Tree]]** : vos sources sont transformées en chunks Markdown, résumées hiérarchiquement, stockées en SQLite et exposées sous forme de vault Obsidian-compatible[^1][^2].

Ce n'est cependant pas un outil 100% on-premise par défaut. Le README est explicite : l'expérience managée utilise encore des services OpenHuman pour la connexion au compte, le routage des modèles, la recherche web proxyfiée et certains flux OAuth via Composio[^3].

> [!warning] Verdict souveraineté
> **⚠️ Configurable** — très intéressant pour l'architecture mémoire, mais une posture on-premise stricte demande une configuration volontaire : modèle local, recherche auto-hébergée, intégrations directes et désactivation des chemins managés.

## 💡 Pourquoi ce projet nous intéresse

OpenHuman est le meilleur exemple actuel d'un assistant "mémoire d'abord" : il ne se contente pas de coller une base vectorielle sous un chat. Il structure les documents en arbres de résumés et garde un équivalent Markdown lisible par l'humain.

Pour ce vault, il sert surtout de **référence architecturale** pour le pattern [[00-lexique/memory-tree|Memory Tree]] : comment donner une mémoire longue à un assistant sans injecter tout l'historique dans le prompt.

## ✅ Points forts

- **Mémoire locale lisible** : SQLite + Markdown dans un vault compatible Obsidian[^1][^2].
- **Approche Memory Tree** : hiérarchie de résumés plutôt qu'un simple "vector soup"[^2].
- **Agent outillé** : recherche, fetch web, fichiers, Git, lint/test/grep, intégrations et voix selon configuration[^3].
- **Local AI possible** : Ollama/LM Studio peuvent prendre certains workloads on-device[^3].

## ⚠️ Limites et risques

- **Cloud par défaut pour plusieurs fonctions critiques** : routage LLM, web search proxy, OAuth/intégrations managées[^3].
- **Souveraineté non triviale** : il faut remplacer les chemins managés un par un.
- **Projet jeune** : intéressant mais à auditer avant usage entreprise sensible.
- **Surface d'intégration large** : Gmail, Slack, GitHub, Notion, etc. impliquent une gouvernance stricte des permissions.

## 🔒 Souveraineté et confidentialité

- **Données :** mémoire, vault Markdown, configuration workspace et runtime local stockés sur la machine[^3].
- **Modèle :** routage managé par défaut ; Ollama/LM Studio possibles pour workloads locaux[^3].
- **Mémoire :** SQLite local + Markdown local ; backend `agentmemory` possible pour store partagé[^3].
- **Télémétrie :** à vérifier dans l'instance déployée.
- **Mode 100% offline :** partiel ; les fonctionnalités managées et intégrations temps réel peuvent nécessiter le backend.
- **Verdict :** ⚠️ configurable.

Voir la grille complète : [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]].

## 🔗 Intégration possible dans ce vault

OpenHuman est pertinent comme :

- source d'inspiration pour une mémoire Markdown/SQLite ;
- fiche de comparaison pour expliquer le piège "local-first ≠ souverain par défaut" ;
- exemple de solution hybride à ne pas présenter comme on-premise stricte sans caveat.

## 📊 Maturité du projet

Projet open-source en évolution rapide. À auditer avant déploiement client : fréquence des releases, dépendances réseau, modèle d'authentification, politique de conservation des tokens OAuth et options réelles de self-host.

## 📚 Sources

[^1]: OpenHuman, *Architecture* — React + Tauri v2, Rust core, Memory Tree, SQLite et vault Markdown. [https://github.com/tinyhumansai/openhuman/blob/main/gitbooks/developing/architecture/README.md](https://github.com/tinyhumansai/openhuman/blob/main/gitbooks/developing/architecture/README.md)
[^2]: OpenHuman, *Memory Trees* — pipeline Memory Tree et stockage local. [https://tinyhumans.gitbook.io/openhuman/features/memory-tree](https://tinyhumans.gitbook.io/openhuman/features/memory-tree)
[^3]: OpenHuman README — "Local + managed services, upfront", Ollama/LM Studio, Composio et backend managé. [https://github.com/tinyhumansai/openhuman/blob/main/README.md](https://github.com/tinyhumansai/openhuman/blob/main/README.md)
