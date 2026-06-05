---
title: "🤖 Agents Custodiens On-Premise"
description: >
  Agents autonomes qui maintiennent votre vault, auditent du code, proposent des corrections en branches/PRs
  et attendent la validation humaine avant d'agir.
sidebar:
  order: 1
last_modified: "2026-06-04"
---

Un [[00-lexique/agent-custodian|agent custodien]] n'est pas un assistant : on ne lui parle pas pour lui poser des questions. On lui confie des **tâches récurrentes ou événementielles** — maintenir un vault à jour, détecter du code obsolète, proposer des corrections sourcées — et il travaille de manière autonome, en laissant la décision finale à un humain.

> [!tip] Exemple vivant
> Ce vault lui-même est maintenu en partie par un agent custodien. Le dossier `.agents/` contient les scripts, prompts et journaux d'exécution qui orchestrent cette maintenance.

---

## 🧭 Concept clé : [[00-lexique/human-in-the-loop|Human-in-the-loop]]

Un agent custodien souverain ne "commit" pas, ne "merge" pas, ne "publie" pas sans validation humaine.

Le cycle type est :
1. **Déclencheur** — planifié (cron) ou événementiel (nouveau fichier, PR ouverte)
2. **Exécution** — l'agent lit, analyse, génère des propositions
3. **Branche + diff** — les changements sont isolés dans une branche Git dédiée
4. **Rapport** — l'agent produit un résumé lisible (PR description, email, message)
5. **Validation humaine** — you merge, or you don't
6. **Publication** — uniquement si approuvé

Les niveaux d'autonomie varient : de "rapport seulement" jusqu'à "commit automatique en branche feature" — mais jamais de merge ou de publication automatique sur `main` sans accord explicite.

---

## 📋 Pages de référence

### Comprendre

- [[05-agents-et-assistants-on-prem/agents-custodiens/vision-agent-custodian|🔭 Vision : Qu'est-ce qu'un agent custodien ?]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|⚙️ Workflow : Human-in-the-loop de bout en bout]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|🏗️ Stack recommandée : MVP → cible souveraine]]

### Aller plus loin

- [[05-agents-et-assistants-on-prem/agents-custodiens/github-branches-pr-notifications|🌿 Branches, PRs & Notifications]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/recherche-web-et-sources|🔍 Recherche Web & Sources]]

---

## 🛠️ Fiches solution

| Outil | Rôle dans la stack | Souveraineté |
|-------|-------------------|-------------|
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] | Agent code, terminal-first, supporte Ollama | ✅ si local |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] | Agent Docker/sandbox, modèles locaux supportés | ⚠️ configurable |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]] / [[00-lexique/litellm|lexique]] | Proxy unificateur (Ollama, vLLM, cloud) | ✅ si local-only |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng|SearXNG]] | Méta-search auto-hébergé, sans API key | ✅ web privacy |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]] | MVP puissant, mais routage cloud Cursor | ❌ strict |

---

## 🔗 Voir aussi

- [[05-agents-et-assistants-on-prem/index|🤖 Vue d'ensemble : Agents & Assistants]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 Assistants Personnels — l'IA qui vous connaît]]
- [[00-lexique/autonomous-agent|Agent autonome]] · [[00-lexique/smolagents|SmolAgents]]
