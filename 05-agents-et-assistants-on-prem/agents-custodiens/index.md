---
title: "🤖 Agents Custodiens On-Premise"
description: >
  Agents autonomes qui maintiennent votre vault, auditent du code, proposent des corrections en branches/PRs
  et attendent la validation humaine avant d'agir.
sidebar:
  order: 1
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Un [[00-lexique/agent-custodian|agent custodien]] n'est pas un assistant : on ne lui parle pas pour lui poser des questions. On lui confie des **tâches récurrentes ou événementielles** — maintenir un vault à jour, détecter du code obsolète, proposer des corrections sourcées — et il travaille de manière autonome, en laissant la décision finale à un humain.

> [!tip] Exemple vivant (meta-pédagogique)
> **Dans ce vault de démonstration**, une partie de la maintenance est orchestrée par un agent custodien : le dossier `.agents/` (hors publication site) contient skills, prompts et journaux d'exécution. Le pattern reste reproductible avec OpenHands (dont Agent Canvas), Aider — gelé depuis mai 2026[^4] — ou tout runner CI — voir les [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|fiches solutions]].

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

La validation humaine protège la sortie (merge, publication), pas l'entrée : ce que l'agent lit et exécute avant la revue reste le maillon faible. L'OWASP place désormais l'« Excessive Agency » au 3e rang de son Top 10 pour les applications LLM (édition 2026, selon son annonce du 2026-09-01), la CNIL et le Conseil de l'IA et du Numérique ont publié en juillet 2026 une note exploratoire sur l'IA agentique et les données personnelles, et une faille Ollama (CVE-2026-102697, corrigée en 0.31.2) a montré qu'une commande shell approuvée par l'humain pouvait être prolongée par le modèle. Voir [[05-agents-et-assistants-on-prem/agents-custodiens/vision-agent-custodian|Vision]] et [[00-lexique/excessive-agency|Excessive agency]][^1][^2][^3].

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
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] | Agent code, terminal-first, supporte Ollama — développement gelé depuis mai 2026[^4] | ✅ si local, ⚠️ non maintenu |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] | Agent Docker/sandbox, Agent Canvas (automatisations planifiées, agents tiers via ACP), modèles locaux supportés[^6] | ⚠️ configurable |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]] / [[00-lexique/litellm|lexique]] | Proxy unificateur (Ollama, vLLM, cloud) ; failles exploitées en 2026, à patcher chaque mois[^5] | ✅ si local-only et à jour |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng|SearXNG]] | Méta-search auto-hébergé, sans API key | ✅ web privacy |
| [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]] | MVP puissant, mais routage cloud Cursor (SpaceX depuis août 2026)[^7] | ❌ strict |

---

## 🔗 Voir aussi

- [[05-agents-et-assistants-on-prem/index|🤖 Vue d'ensemble : Agents & Assistants]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 Assistants Personnels — l'IA qui vous connaît]]
- [[00-lexique/autonomous-agent|Agent autonome]] · [[00-lexique/smolagents|SmolAgents]]

## 📚 Sources

[^1]: OWASP GenAI Security Project, *OWASP GenAI LLM Top 10 — 2026 Edition* (publiée le 2026-08-03) et annonce du 2026-09-01 (« Excessive Agency, now number three »). [https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) · [https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members/](https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members/)
[^2]: CNIL et Conseil de l'IA et du Numérique, *IA agentique et données personnelles : note exploratoire* (autonomie décisionnelle accrue, responsabilités diluées, risques cyber étendus à tous les services connectés), 2026-07-20. [https://www.cnil.fr/fr/ia-agentique-cnil-cianum-note](https://www.cnil.fr/fr/ia-agentique-cnil-cianum-note)
[^3]: MITRE, *CVE-2026-102697* (Ollama 0.14.0 → < 0.31.2 : opérateurs de contrôle shell ajoutés à une commande approuvée en mode agent, CVSS 3.1 7.8 / 4.0 8.5), publiée le 2026-09-29. [https://cveawg.mitre.org/api/cve/CVE-2026-102697](https://cveawg.mitre.org/api/cve/CVE-2026-102697)
[^4]: Aider-AI, *aider* (dépôt GitHub : dernier commit le 2026-05-22, dernière release v0.86.0 du 2025-08-09), consulté le 2026-10-10. [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)
[^5]: CISA, *Known Exploited Vulnerabilities Catalog* (CVE-2026-42208, CVE-2026-42271, CVE-2026-59822 LiteLLM), catalogue daté 2026-10-08 ; LiteLLM, *Version Support Policy* (quatre lignes mineures maintenues depuis le 2026-06-29), 2026-06-20. [https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json) · [https://docs.litellm.ai/blog/version-support](https://docs.litellm.ai/blog/version-support)
[^6]: OpenHands GitHub README (dépôt présenté comme « Agent Canvas (beta) », MIT), consulté le 2026-10-10 ; OpenHands, *Introducing Agent Canvas* (2026-06-16) et *Use any coding agent in OpenHands with ACP* (2026-06-18). [https://github.com/OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) · [https://www.openhands.dev/blog/introducing-agent-canvas](https://www.openhands.dev/blog/introducing-agent-canvas) · [https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp](https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp)
[^7]: Cursor, *Cursor is now a part of SpaceX*, 2026-08-14. [https://cursor.com/blog/joining-spacex](https://cursor.com/blog/joining-spacex)
