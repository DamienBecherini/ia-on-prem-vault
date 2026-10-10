---
title: "Jan.ai"
description: Alternative open-source à ChatGPT qui fait tourner des modèles localement via llama.cpp, avec serveur API local OpenAI-compatible.
sidebar:
  order: 4
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Vue d'ensemble rapide

Jan.ai est une application desktop open-source qui permet de télécharger et exécuter des modèles locaux sur votre machine. Le projet met en avant un fonctionnement **100% offline** et une expérience ChatGPT-like personnelle[^1][^2].

Jan expose aussi un serveur API local OpenAI-compatible sur `localhost:1337`, utile pour brancher d'autres outils sur un modèle local sans passer par une API cloud[^3].

> [!tip] Verdict souveraineté
> **✅ Souverain natif** pour l'usage desktop avec modèles locaux. Les connexions à des providers cloud existent, mais elles sont optionnelles.

## 💡 Pourquoi ce projet nous intéresse

Jan est probablement l'entrée la plus simple pour un utilisateur individuel qui veut tester l'IA locale sans comprendre Docker, vLLM ou la configuration d'une UI web.

Il est moins orienté "RAG entreprise" qu'Open WebUI ou AnythingLLM, mais excellent pour le **poste personnel souverain** : installation desktop, modèles GGUF, moteur llama.cpp embarqué dans l'installateur, accélération Metal (Apple Silicon), CUDA 13 (NVIDIA Turing et plus récents) ou Vulkan (AMD, Intel, et NVIDIA Pascal/GTX 10xx depuis la v0.8.5 du 2026-10-08, les backends CUDA 11/12 téléchargeables ayant disparu), API locale[^5].

## ✅ Points forts

- **Desktop simple** : macOS (Apple Silicon ; sur Mac Intel, les modèles locaux ne sont plus pris en charge depuis la v0.8.5, restez en 0.8.4), Windows, Linux[^5].
- **Modèles locaux** : llama.cpp, GGUF, GPU offload selon plateforme[^2].
- **Offline** : fonctionnement sans Internet après téléchargement des modèles[^1][^2].
- **API locale** : endpoint OpenAI-compatible pour intégrations locales[^3].
- **Télémétrie absente dans le mode local annoncé** : docs marketing indiquent pas de collecte ni télémétrie pour les modèles locaux[^1].

## ⚠️ Limites et risques

- **Mémoire documentaire limitée** : ce n'est pas d'abord un système RAG/knowledge base.
- **Fonctions cloud optionnelles** : l'utilisateur peut connecter OpenAI/Anthropic/Mistral/Groq, ce qui change complètement le verdict souveraineté[^4].
- **API locale à sécuriser** : si l'écoute passe de `127.0.0.1` à `0.0.0.0`, il faut gérer réseau, clé API et CORS ; depuis la v0.8.5, Jan rejette (403) les requêtes dont l'hôte n'est pas localhost, une IP privée ou une entrée de « Trusted Hosts » — déclarez-y votre nom DNS ou reverse proxy[^3][^5].
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

Projet actif et populaire côté GitHub (environ 45 000 étoiles, v0.8.6 au 2026-10-09), construit sur Tauri et llama.cpp, le moteur étant désormais embarqué dans l'installateur. Depuis la v0.8.5, la CLI `jan` (agent en terminal) s'installe séparément et l'exécutable se nomme `Jan-Desktop` : adaptez vos scripts[^5]. Il faut distinguer Jan Desktop local de Jan Web / éventuelles offres cloud dans toute recommandation client.

## 🔗 Voir aussi

- [[00-lexique/ollama|Ollama]] · [[06-mise-en-oeuvre/getting-started-with-ollama|🚀 Démarrer avec Ollama]]
- [[04-blueprints/scenario-a-dev-lab|Scénario A]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]]
- [[02-materiel/apu-and-unified-memory|APU & mémoire unifiée]] — poste desktop
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté]]

## 📚 Sources

[^1]: Jan GitHub README — offline, privacy, no telemetry en usage local. [https://github.com/janhq/jan](https://github.com/janhq/jan)
[^2]: Jan — local models (llama.cpp, GGUF) dans la documentation du dépôt. [https://github.com/janhq/jan/tree/dev/docs](https://github.com/janhq/jan/tree/dev/docs)
[^3]: Jan API server — serveur local OpenAI-compatible sur `localhost:1337`. [https://github.com/janhq/jan/blob/dev/docs/src/pages/docs/desktop/api-server.mdx](https://github.com/janhq/jan/blob/dev/docs/src/pages/docs/desktop/api-server.mdx)
[^4]: Jan GitHub README — modèles locaux et intégrations cloud optionnelles. [https://github.com/janhq/jan](https://github.com/janhq/jan)
[^5]: janhq, *Jan v0.8.5* — notes de release, section Migration (llama.cpp embarqué, CUDA 13 / Vulkan, fin des backends CUDA 11/12, Mac Intel sans modèles locaux, exécutable `Jan-Desktop`, CLI `jan` séparée, Trusted Hosts GHSA-x6p8-7cp8-c3p6), 2026-10-08 ; v0.8.6 publiée le 2026-10-09. [https://github.com/janhq/jan/releases/tag/v0.8.5](https://github.com/janhq/jan/releases/tag/v0.8.5)
