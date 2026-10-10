---
title: "OpenHuman"
description: Harness d'agent open source (Rust + Tauri) avec mémoire hébergée par défaut, abonnement managé optionnel et mode Privacy local-only ; à configurer volontairement pour une posture on-premise.
sidebar:
  order: 1
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Vue d'ensemble rapide

OpenHuman est un agent open source (GPL-3.0) basé sur **Tauri + Rust**, livré en application de bureau, en terminal ou en serveur headless. Au 2026-10-09, sa mémoire n'est plus le [[00-lexique/memory-tree|Memory Tree]] local des premières versions : les documents, conversations et « learnings » sont stockés dans **CortexDB**, soit hébergé par TinyHumans (connexion requise), soit sur un endpoint CortexDB que vous opérez ; avant chaque tour, un « memory pack » borné en tokens est rappelé avec citations[^1][^2].

Ce n'est cependant pas un outil 100% on-premise par défaut. La documentation est explicite : par défaut, le backend OpenHuman relaie les appels LLM, les jetons OAuth (119 applications via Composio), la recherche web et la mémoire hébergée ; même avec des modèles locaux, la connexion, la facturation et la gestion des intégrations passent par ce backend[^5][^7].

> [!warning] Verdict souveraineté
> **⚠️ Configurable** — intéressant pour son mode Privacy local-only, mais une posture on-premise stricte demande une configuration volontaire : modèle local, CortexDB que vous opérez, recherche auto-hébergée, intégrations directes et désactivation des chemins managés.

## 💡 Pourquoi ce projet nous intéresse

OpenHuman a été, jusqu'à sa version 1, l'exemple le plus lisible d'un assistant "mémoire d'abord" : il structurait les documents en arbres de résumés et gardait un équivalent Markdown lisible par l'humain. Au T4 2026, cette architecture a disparu du produit au profit d'une mémoire hébergée (CortexDB)[^2].

Pour ce vault, il a servi de référence au pattern [[00-lexique/memory-tree|Memory Tree]] jusqu'à sa version 1 ; depuis la mémoire v2 (CortexDB, 2026), il illustre surtout deux autres leçons : la mémoire d'un assistant peut quitter la machine même quand le modèle est local, et un mode « local-only » appliqué dans le code vaut mieux qu'une configuration[^4][^5].

## ✅ Points forts

- **Mémoire pluggable** : moteur CortexDB hébergé ou auto-hébergé, « learnings » et « beliefs » construits en arrière-plan, rappel par memory pack avec citations ; secrets et identifiants purgés avant stockage, effacement complet possible[^2].
- **Mode Privacy local-only** : un interrupteur appliqué dans le cœur Rust refuse tout fournisseur cloud (y compris BYOK et Composio) et ne laisse passer que les runtimes locaux Ollama, LM Studio, MLX ou OpenAI-compatibles[^4].
- **Agent outillé** : recherche, fetch web, fichiers, Git, lint/test/grep, intégrations et voix selon configuration[^3].
- **Local AI possible** : Ollama/LM Studio peuvent prendre certains workloads on-device[^3].

## ⚠️ Limites et risques

- **Cloud par défaut pour plusieurs fonctions critiques** : routage LLM, web search proxy, OAuth/intégrations managées[^3].
- **Souveraineté non triviale** : il faut remplacer les chemins managés un par un.
- **Produit en mutation rapide** : toujours « early beta » selon ses auteurs malgré une forte adoption (GPL-3.0, releases quasi quotidiennes, 674 PRs pour la v0.64.0 de septembre 2026) ; un abonnement managé (Free, Basic 19,99 $/mois, Pro 199,99 $/mois) finance le routage de modèles hébergé[^6].
- **Surface d'intégration large** : Gmail, Slack, GitHub, Notion, etc. impliquent une gouvernance stricte des permissions.

## 🔒 Souveraineté et confidentialité

- **Données :** fichiers du workspace, réglages et tampons audio sur la machine ; **la mémoire, non** : elle est dans CortexDB (hébergé TinyHumans ou endpoint que vous opérez)[^5].
- **Modèle :** routage managé par défaut ; Ollama/LM Studio possibles pour workloads locaux[^3].
- **Mémoire :** CortexDB, hébergé ou auto-hébergé ; sans connexion ni clé CortexDB, la mémoire est désactivée[^2][^5].
- **Télémétrie :** à vérifier dans l'instance déployée.
- **Mode 100% offline :** partiel ; les fonctionnalités managées et intégrations temps réel peuvent nécessiter le backend.
- **Verdict :** ⚠️ configurable.

Voir la grille complète : [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]].

## 🔗 Intégration possible dans ce vault

OpenHuman est pertinent comme :

- rappel qu'une mémoire d'assistant peut quitter la machine même avec un modèle local (Memory Tree local abandonné au profit de CortexDB) ;
- fiche de comparaison pour expliquer le piège "local-first ≠ souverain par défaut" ;
- exemple de solution hybride à ne pas présenter comme on-premise stricte sans caveat.

## 📊 Maturité du projet

Projet open-source (GPL-3.0) en évolution très rapide (v0.57.5 en juin 2026, v0.64.15 au 2026-10-09), repositionné en harness d'agents (desktop, terminal, serveur headless, bibliothèque Rust). À auditer avant déploiement client : conservation des tokens OAuth côté backend, dépendance au backend pour la connexion, la facturation et les intégrations même en mode local-only, et options de self-host (CortexDB propre, cœur headless en Docker)[^5][^6].

## 🔗 Voir aussi

- [[00-lexique/memory-tree|Memory Tree]] · [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté]] — piège « local-first ≠ souverain »
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]]
- [[04-blueprints/scenario-a-dev-lab|Scénario A]]

## 📚 Sources

[^1]: OpenHuman, *Architecture* — React + Tauri v2, cœur Rust, modes desktop / terminal / headless (lu le 2026-10-09). [https://github.com/tinyhumansai/openhuman/blob/main/gitbooks/developing/architecture/README.md](https://github.com/tinyhumansai/openhuman/blob/main/gitbooks/developing/architecture/README.md)
[^2]: OpenHuman, *How memory works* — « The current memory has no memory tree … or Obsidian vault » ; moteurs TinyHumans Hosted / CortexDB, memory pack, purge des secrets (docs lues le 2026-10-09). [https://tinyhumans.gitbook.io/openhuman/features/memory](https://tinyhumans.gitbook.io/openhuman/features/memory)
[^3]: OpenHuman README — "Local + managed services, upfront", Ollama/LM Studio, Composio et backend managé. [https://github.com/tinyhumansai/openhuman/blob/main/README.md](https://github.com/tinyhumansai/openhuman/blob/main/README.md)
[^4]: OpenHuman, *Privacy mode* (`local_only`, appliqué dans le cœur Rust ; runtimes locaux autorisés), docs lues le 2026-10-09. [https://tinyhumans.gitbook.io/openhuman/features/privacy-mode](https://tinyhumans.gitbook.io/openhuman/features/privacy-mode)
[^5]: OpenHuman, *Privacy and security* (où vit la mémoire, ce que le backend relaie), docs lues le 2026-10-09. [https://tinyhumans.gitbook.io/openhuman/features/privacy-and-security](https://tinyhumans.gitbook.io/openhuman/features/privacy-and-security)
[^6]: OpenHuman, *Releases* (v0.64.15 au 2026-10-09, 674 PRs pour la v0.64.0 « Intelligence Upgrade » du 2026-09-25) et *Billing and usage* (plans Free, Basic 19,99 $/mois, Pro 199,99 $/mois), lus le 2026-10-09. [https://github.com/tinyhumansai/openhuman/releases](https://github.com/tinyhumansai/openhuman/releases) · [https://tinyhumans.gitbook.io/openhuman/features/billing-and-usage](https://tinyhumans.gitbook.io/openhuman/features/billing-and-usage)
[^7]: OpenHuman, *Local and BYOK models* (routage des modèles : connexion, facturation et intégrations via le backend même avec des modèles locaux), docs lues le 2026-10-09. [https://tinyhumans.gitbook.io/openhuman/features/model-routing/local-and-byok-models](https://tinyhumans.gitbook.io/openhuman/features/model-routing/local-and-byok-models)
