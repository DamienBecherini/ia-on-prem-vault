---
title: "OpenHands"
description: Plateforme d'agents de développement logiciel (CLI, SDK, sandbox Docker, Agent Canvas), puissante mais plus lourde à opérer qu'un CLI simple.
sidebar:
  order: 3
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Vue d'ensemble rapide

OpenHands est une plateforme d'agents de développement logiciel (MIT) : CLI, SDK Python, sandbox Docker et, depuis juin 2026, **Agent Canvas**, un centre de contrôle auto-hébergé qui lance des sessions et des automatisations planifiées ou événementielles (Slack, GitHub, Linear) sur des backends locaux, Docker, VM ou Kubernetes. Agent Canvas pilote l'agent OpenHands ou, via l'Agent Client Protocol (ACP), des agents tiers comme Claude Code, Codex ou Gemini CLI[^1][^5][^6]. L'agent explore, modifie, exécute et itère dans un environnement contrôlé[^2].

## 💡 Pourquoi ce projet nous intéresse

OpenHands est pertinent quand l'agent custodien doit dépasser la simple édition de fichiers : exécution de tests, environnement isolé, tâches longues, interface web, sandbox et orchestration plus structurée.

Depuis juin 2026, c'est aussi une couche d'orchestration : via ACP, un même Agent Canvas peut démarrer avec un agent vendeur (Claude Code, Codex) puis basculer vers l'agent OpenHands branché sur un modèle local sans changer d'interface — un chemin MVP → cible souveraine sans réécriture[^6].

## ✅ Points forts

- Sandbox Docker pour isoler l'exécution[^3].
- Support local/self-hosted models via LM Studio (propriétaire, freemium), Ollama, vLLM ou SGLang ; la doc recommande au T2 2026 Qwen3.6-35B-A3B avec au moins 24 Go de VRAM en quantifié et un contexte de 32k tokens[^4][^8].
- Architecture plus complète qu'un CLI.
- Peut servir de base à un agent custodien plus ambitieux.

## ⚠️ Limites et risques

- Mise en place plus lourde : Docker, volumes, images, configuration LLM.
- Les modèles locaux doivent être puissants pour les tâches agentiques[^4].
- Surface d'attaque plus large qu'Aider : avant la v1.25.0 (6 octobre 2026), la pile locale écoutait sur toutes les interfaces et exposait sa clé de session dans la page d'accueil, lisible depuis le réseau local ; depuis, les lanceurs se lient à `127.0.0.1` par défaut et l'image Docker ne fournit plus de clé sans opt-in explicite. Exiger ≥ 1.25.0 (de préférence ≥ 1.26.0, voir la télémétrie) et ne publier l'interface que derrière un proxy authentifié[^10].
- Peut être surdimensionné pour de simples audits de vault.

## 🔒 Souveraineté et confidentialité

- **Données :** locales si l'instance et le modèle sont locaux.
- **Modèle :** local possible via Ollama/vLLM/LM Studio ; cloud possible selon provider.
- **Mémoire :** dépend de la session et du workspace Docker.
- **Télémétrie :** l'interface embarque PostHog ; avant la v1.26.0 (8 octobre 2026), même avec `VITE_DO_NOT_TRACK=1` ou le Do Not Track du navigateur, elle contactait encore `z.openhands.dev` : utiliser ≥ 1.26.0, activer Do Not Track et bloquer ce domaine en sortie ; dans Agent Canvas, ne sélectionner que des backends locaux/Docker/VM internes, jamais « OpenHands Cloud »[^5][^9].
- **Mode 100% offline :** possible mais demande images/modèles préchargés.
- **Verdict :** ⚠️ configurable — souverain si self-host + local LLM, lourd à durcir.

## 🔗 Intégration possible dans ce vault

OpenHands devient intéressant si l'agent doit :

- lancer des builds/tests ;
- travailler dans un sandbox reproductible ;
- exécuter des outils complexes ;
- isoler fortement le workspace.

Depuis juin 2026, Agent Canvas permet de définir une automatisation (planifiée, ou déclenchée par GitHub/Slack/Linear) qui lance l'agent sur un backend Docker ou VM interne, avec un profil LLM dédié pointant vers Ollama ou vLLM : c'est le runner contrôlé de l'étape 2 de la [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|trajectoire]], sans script maison[^5].

Pour la maintenance Markdown simple, Aider reste plus léger, mais son développement est gelé depuis mai 2026 ; la CLI OpenHands (sans Agent Canvas) est l'option maintenue la plus proche[^7].

## 📊 Maturité du projet

Projet très actif (MIT, environ 90 000 étoiles et plusieurs releases par semaine au T4 2026), large communauté, nombreux composants ; Agent Canvas est encore étiqueté « beta ». Maturité élevée, mais complexité opérationnelle élevée aussi[^1].

## 🔗 Voir aussi

- [[00-lexique/agent-custodian|Agent custodien]] · [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Workflow HITL]]
- [[00-lexique/appel-outils|Appel d'outils]] · [[00-lexique/vllm|vLLM]] · [[00-lexique/litellm|LiteLLM]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] · [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]]
- [[06-mise-en-oeuvre/local-inference-security|🔐 Sécurité inférence]] · [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]

## 📚 Sources

[^1]: OpenHands GitHub README (dépôt présenté comme « Agent Canvas (beta) », MIT, v1.26.0 du 2026-10-08), consulté le 2026-10-10. [https://github.com/OpenHands/OpenHands](https://github.com/OpenHands/OpenHands)
[^2]: OpenHands Docs, *Local setup*. [https://docs.openhands.dev/openhands/usage/run-openhands/local-setup](https://docs.openhands.dev/openhands/usage/run-openhands/local-setup)
[^3]: OpenHands Docs, *Docker Sandbox*. [https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox](https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox)
[^4]: OpenHands Docs, *Local LLMs* (LM Studio, Ollama, vLLM, SGLang ; Qwen3.6-35B-A3B recommandé, ≥ 24 Go de VRAM en quantifié, contexte 32k), mis à jour le 2026-05-21. [https://docs.openhands.dev/openhands/usage/llms/local-llms](https://docs.openhands.dev/openhands/usage/llms/local-llms)
[^5]: OpenHands, *Introducing Agent Canvas* (workflows planifiés et événementiels Slack/GitHub/Linear, profils LLM, backends local/Docker/VM/Kubernetes/OpenHands Cloud, licence MIT), 2026-06-16. [https://www.openhands.dev/blog/introducing-agent-canvas](https://www.openhands.dev/blog/introducing-agent-canvas)
[^6]: OpenHands, *Use any coding agent in OpenHands with ACP* (Agent Client Protocol : Claude Code, Codex, Gemini CLI ou tout agent compatible ; `ACPAgent` dans le SDK), 2026-06-18. [https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp](https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp)
[^7]: Aider-AI, *aider* (dépôt GitHub : dernier commit le 2026-05-22, dernière release v0.86.0 du 2025-08-09), consulté le 2026-10-10. [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)
[^8]: LM Studio, *Introducing LM Studio Bionic* (application propriétaire, modèles locaux via le runtime LM Studio, offre « Secure Cloud » payante), 2026-07-16. [https://lmstudio.ai/blog/introducing-lm-studio-bionic](https://lmstudio.ai/blog/introducing-lm-studio-bionic)
[^9]: OpenHands, *Release v1.26.0* (PR #18086 : PostHog n'est plus initialisé sous Do Not Track ; avant, `VITE_DO_NOT_TRACK=1` ou le DNT du navigateur n'empêchaient pas les appels vers `z.openhands.dev`), 2026-10-08. [https://github.com/OpenHands/OpenHands/releases/tag/v1.26.0](https://github.com/OpenHands/OpenHands/releases/tag/v1.26.0) · [https://github.com/OpenHands/OpenHands/pull/18086](https://github.com/OpenHands/OpenHands/pull/18086)
[^10]: OpenHands, *Release v1.25.0* (PR #17007 « keep local session keys off externally reachable listeners » ; issue #16879 : écoute sur toutes les interfaces, clé de session dans un `index.html` non authentifié), 2026-10-06. [https://github.com/OpenHands/OpenHands/releases/tag/v1.25.0](https://github.com/OpenHands/OpenHands/releases/tag/v1.25.0) · [https://github.com/OpenHands/OpenHands/pull/17007](https://github.com/OpenHands/OpenHands/pull/17007)
