---
title: "OpenHands"
description: Plateforme agentique Docker-based pour développement logiciel, puissante mais plus lourde à opérer qu'un CLI simple.
sidebar:
  order: 3
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Vue d'ensemble rapide

OpenHands est une plateforme d'agents de développement logiciel avec CLI, interface locale, SDK et sandbox Docker. Elle vise des workflows proches de Devin/Jules : l'agent explore, modifie, exécute et itère dans un environnement contrôlé[^1][^2].

## 💡 Pourquoi ce projet nous intéresse

OpenHands est pertinent quand l'agent custodien doit dépasser la simple édition de fichiers : exécution de tests, environnement isolé, tâches longues, interface web, sandbox et orchestration plus structurée.

## ✅ Points forts

- Sandbox Docker pour isoler l'exécution[^3].
- Support local/self-hosted models via LM Studio, Ollama, vLLM ou SGLang[^4].
- Architecture plus complète qu'un CLI.
- Peut servir de base à un agent custodien plus ambitieux.

## ⚠️ Limites et risques

- Mise en place plus lourde : Docker, volumes, images, configuration LLM.
- Les modèles locaux doivent être puissants pour les tâches agentiques[^4].
- Surface d'attaque plus large qu'Aider.
- Peut être surdimensionné pour de simples audits de vault.

## 🔒 Souveraineté et confidentialité

- **Données :** locales si l'instance et le modèle sont locaux.
- **Modèle :** local possible via Ollama/vLLM/LM Studio ; cloud possible selon provider.
- **Mémoire :** dépend de la session et du workspace Docker.
- **Télémétrie :** à auditer selon déploiement.
- **Mode 100% offline :** possible mais demande images/modèles préchargés.
- **Verdict :** ⚠️ configurable — souverain si self-host + local LLM, lourd à durcir.

## 🔗 Intégration possible dans ce vault

OpenHands devient intéressant si l'agent doit :

- lancer des builds/tests ;
- travailler dans un sandbox reproductible ;
- exécuter des outils complexes ;
- isoler fortement le workspace.

Pour la maintenance Markdown simple, Aider reste plus léger.

## 📊 Maturité du projet

Projet très actif, large communauté, nombreux composants. Maturité élevée, mais complexité opérationnelle élevée aussi.

## 📚 Sources

[^1]: OpenHands GitHub README. [https://github.com/OpenHands/OpenHands](https://github.com/OpenHands/OpenHands)
[^2]: OpenHands Docs, *Local setup*. [https://docs.openhands.dev/openhands/usage/run-openhands/local-setup](https://docs.openhands.dev/openhands/usage/run-openhands/local-setup)
[^3]: OpenHands Docs, *Docker Sandbox*. [https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox](https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox)
[^4]: OpenHands Docs, *Local LLMs*. [https://docs.openhands.dev/openhands/usage/llms/local-llms](https://docs.openhands.dev/openhands/usage/llms/local-llms)
