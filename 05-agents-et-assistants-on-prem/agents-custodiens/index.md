---
title: "🤖 Agents Custodiens On-Premise"
description: >
  Agents autonomes qui maintiennent votre vault, auditent du code, proposent des corrections en branches/PRs
  et attendent la validation humaine avant d'agir.
sidebar:
  order: 1
---

Un agent custodien n'est pas un assistant : on ne lui parle pas pour lui poser des questions. On lui confie des **tâches récurrentes ou événementielles** — maintenir un vault à jour, détecter du code obsolète, proposer des corrections sourcées — et il travaille de manière autonome, en laissant la décision finale à un humain.

> Ce vault lui-même est maintenu en partie par un agent custodien. Le dossier [`.agents/`](/.agents/) contient les scripts, prompts et journaux d'exécution qui orchestrent cette maintenance.

---

## 🧭 Concept clé : Human-in-the-loop

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

> ⚠️ Les pages ci-dessous sont en cours de rédaction (Phase 4 du plan). Les liens marqués *(à venir)* seront activés à l'issue de la phase.

### Comprendre

- [[05-agents-et-assistants-on-prem/agents-custodiens/vision-agent-custodian|🔭 Vision : Qu'est-ce qu'un agent custodien ?]] *(à venir)*
- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|⚙️ Workflow : Human-in-the-loop de bout en bout]] *(à venir)*
- [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|🏗️ Stack recommandée : MVP → cible souveraine]] *(à venir)*

### Aller plus loin

- [[05-agents-et-assistants-on-prem/agents-custodiens/github-branches-pr-notifications|🌿 Branches, PRs & Notifications]] *(à venir)*
- [[05-agents-et-assistants-on-prem/agents-custodiens/recherche-web-et-sources|🔍 Recherche Web & Sources]] *(à venir)*

---

## 🛠️ Fiches solution

| Outil | Rôle dans la stack | Souveraineté |
|-------|-------------------|-------------|
| [Aider](solutions/aider) *(à venir)* | Agent code, terminal-first, supporte Ollama | ✅ |
| [OpenHands](solutions/openhands) *(à venir)* | Agent Docker, modèles locaux supportés | ⚠️ |
| [LiteLLM](solutions/litellm) *(à venir)* | Proxy unificateur (Ollama, vLLM, cloud) | ✅ |
| [SearXNG](solutions/searxng) *(à venir)* | Méta-search auto-hébergé, sans API key | ✅ |
| [Cursor CLI](solutions/cursor-cli) *(à venir)* | MVP puissant, mais routage cloud Cursor | ❌ strict |

---

## 🔗 Voir aussi

- [[05-agents-et-assistants-on-prem/index|🤖 Vue d'ensemble : Agents & Assistants]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 Assistants Personnels — l'IA qui vous connaît]]
- [[00-lexique/autonomous-agent|Agent autonome]] · [[00-lexique/smolagents|SmolAgents]]
