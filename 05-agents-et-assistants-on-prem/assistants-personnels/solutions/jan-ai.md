---
title: "Jan.ai"
description: Alternative open-source à ChatGPT qui fait tourner des modèles localement via llama.cpp, avec serveur API local OpenAI-compatible.
sidebar:
  order: 4
---

## 🔍 Vue d'ensemble rapide

Jan.ai est une application desktop open-source qui permet de télécharger et exécuter des modèles locaux sur votre machine. Le projet met en avant un fonctionnement **100% offline** et une expérience ChatGPT-like personnelle[^1][^2].

Jan expose aussi un serveur API local OpenAI-compatible sur `localhost:1337`, utile pour brancher d'autres outils sur un modèle local sans passer par une API cloud[^3].

> [!tip] Verdict souveraineté
> **✅ Souverain natif** pour l'usage desktop avec modèles locaux. Les connexions à des providers cloud existent, mais elles sont optionnelles.

## 💡 Pourquoi ce projet nous intéresse

Jan est probablement l'entrée la plus simple pour un utilisateur individuel qui veut tester l'IA locale sans comprendre Docker, vLLM ou la configuration d'une UI web.

Il est moins orienté "RAG entreprise" qu'Open WebUI ou AnythingLLM, mais excellent pour le **poste personnel souverain** : installation desktop, modèles GGUF, accélération Metal/CUDA/Vulkan, API locale.

## ✅ Points forts

- **Desktop simple** : macOS, Windows, Linux.
- **Modèles locaux** : llama.cpp, GGUF, GPU offload selon plateforme[^2].
- **Offline** : fonctionnement sans Internet après téléchargement des modèles[^1][^2].
- **API locale** : endpoint OpenAI-compatible pour intégrations locales[^3].
- **Télémétrie absente dans le mode local annoncé** : docs marketing indiquent pas de collecte ni télémétrie pour les modèles locaux[^1].

## ⚠️ Limites et risques

- **Mémoire documentaire limitée** : ce n'est pas d'abord un système RAG/knowledge base.
- **Fonctions cloud optionnelles** : l'utilisateur peut connecter OpenAI/Anthropic/Mistral/Groq, ce qui change complètement le verdict souveraineté[^4].
- **API locale à sécuriser** : si l'écoute passe de `127.0.0.1` à `0.0.0.0`, il faut gérer réseau, clé et CORS[^3].
- **Pas le meilleur choix multi-utilisateur** : préférer Open WebUI ou AnythingLLM pour une équipe.

## 🔒 Souveraineté et confidentialité

- **Données :** locales en usage desktop local.
- **Modèle :** local via llama.cpp/GGUF ; cloud uniquement si provider externe configuré.
- **Mémoire :** historique local de l'application.
- **Télémétrie :** annoncée absente pour usage local[^1].
- **Mode 100% offline :** oui après téléchargement des modèles.
- **Verdict :** ✅ souverain natif pour usage local ; ⚠️ si providers cloud activés.

Voir la grille complète : [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]].

## 🔗 Intégration possible dans ce vault

Jan est idéal comme :

- premier outil pour découvrir les modèles locaux ;
- runtime local personnel derrière un outil compatible OpenAI API ;
- alternative desktop simple au duo Ollama + terminal.

## 📊 Maturité du projet

Projet actif et populaire côté GitHub, construit sur Tauri et llama.cpp. Il faut distinguer Jan Desktop local de Jan Web / éventuelles offres cloud dans toute recommandation client.

## 📚 Sources

[^1]: Jan introduction — offline, privacy, no telemetry en usage local. [https://janhq-jan-19.mintlify.app/introduction](https://janhq-jan-19.mintlify.app/introduction)
[^2]: Jan local models — llama.cpp, GGUF et fonctionnement offline. [https://janhq-jan-19.mintlify.app/features/local-models](https://janhq-jan-19.mintlify.app/features/local-models)
[^3]: Jan API server — serveur local OpenAI-compatible sur `localhost:1337`. [https://github.com/janhq/jan/blob/dev/docs/src/pages/docs/desktop/api-server.mdx](https://github.com/janhq/jan/blob/dev/docs/src/pages/docs/desktop/api-server.mdx)
[^4]: Jan GitHub README — modèles locaux et intégrations cloud optionnelles. [https://github.com/janhq/jan](https://github.com/janhq/jan)
