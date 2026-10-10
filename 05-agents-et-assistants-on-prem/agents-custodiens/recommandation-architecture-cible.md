---
title: "🏗️ Recommandation d'architecture cible"
description: Trajectoire réaliste pour passer d'un MVP Cursor CLI à une stack custodienne souveraine basée sur OpenHands ou Aider, Ollama/vLLM, LiteLLM et SearXNG.
sidebar:
  order: 6
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

La bonne architecture n'est pas la plus pure dès le premier jour. C'est celle qui permet de valider le workflow sans mentir sur la souveraineté.

## Étape 1 — MVP pratique

Pour apprendre vite :

- Cursor CLI ou Aider ;
- run manuel ;
- rapport Markdown ;
- branche Git dédiée ;
- validation humaine.

Cursor CLI (propriété de SpaceX depuis août 2026[^7]) est très productif pour tester l'idée. Aider est plus proche de la cible souveraine, car il peut appeler directement Ollama, mais son développement est gelé depuis mai 2026[^1].

## Étape 2 — Runner contrôlé

Pour automatiser :

- tâche planifiée (cron, systemd timer, GitHub Actions self-hosted, ou automatisation Agent Canvas sur backend interne[^2]) ;
- branche datée ;
- run logs via `vault-log-run` sous `.agents/vault-maintenance/runs/` ;
- rapport de sources ;
- notification sans merge automatique.

## Étape 3 — Cible souveraine

Stack recommandée :

| Couche | Choix recommandé | Rôle |
| :-- | :-- | :-- |
| Agent code | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] (CLI/SDK) — ou [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]], gelé depuis mai 2026, pour les essais[^1] | Modifie fichiers et travaille avec Git |
| Modèle local | Ollama ou vLLM + modèle coder spécialisé | Inférence on-prem, avec niveau de raisonnement suffisant |
| Gateway | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]] ([[00-lexique/litellm|lexique]]) — **mise à jour mensuelle obligatoire** (failles exploitées en 2026, support d'un mois par ligne mineure)[^4][^5] | API OpenAI-compatible, routage, logs |
| Recherche | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng|SearXNG]] | Recherche web auto-hébergée |
| Runner et sandbox | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] / Agent Canvas[^2][^3] | Agent Docker, automatisations planifiées, pilotage d'agents tiers via ACP |
| MVP rapide | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]] | Productivité initiale |

> [!warning] Piège fréquent
> "Aider + Ollama" ne suffit pas à faire un bon agent custodien souverain. Aider est exigeant : il fonctionne mieux avec des modèles de code forts, souvent bien plus lourds qu'un modèle RAG conversationnel. Un 7B/8B généraliste peut répondre correctement à une question, mais rester trop faible pour éditer un dépôt sans casser le Markdown, rater un remplacement ou proposer des diffs incohérents.

## Dimensionnement minimal pour Aider local

Pour une cible souveraine réaliste :

| Usage | Modèle local conseillé | Lecture matérielle |
| :-- | :-- | :-- |
| Suggestions simples, petits fichiers | Coder 7B/8B spécialisé | utile pour apprendre, pas assez fiable comme agent autonome |
| Corrections contrôlées sur vault Markdown | Coder 14B | plancher pratique, avec validation humaine stricte |
| Maintenance régulière, audit multi-fichiers | Coder 32B ou supérieur | cible recommandée si l'agent doit produire des diffs exploitables |
| Agentique avec contexte long, VRAM 24 Go | MoE coder type Qwen3.6-35B-A3B (3B actifs) | recommandé par OpenHands au T2 2026 ; contexte ≥ 32k tokens[^6] |
| Gros refactoring ou raisonnement long | 32B+ avec grand contexte, ou modèle frontière non souverain en MVP | arbitrage souveraineté vs qualité |

Le point clé : l'agent qui **agit** sur les fichiers a besoin de plus de raisonnement que l'assistant qui **retrouve** une information. Le budget VRAM doit donc être dimensionné pour le modèle d'édition, pas seulement pour le modèle de chat.

## Recommandation concrète pour ce vault

1. **Court terme** : continuer avec Cursor/Aider en validation humaine.
2. **Moyen terme** : OpenHands (CLI, ou Agent Canvas avec automatisations planifiées et profil LLM local) ou Aider tant qu'il fonctionne, + Ollama + modèle coder récent (dense 14B/32B, ou MoE type Qwen3.6-35B-A3B recommandé par OpenHands au T2 2026) + SearXNG + scripts de maintenance[^2][^6].
3. **Long terme** : [[00-lexique/litellm|LiteLLM]] comme gateway (ligne mineure maintenue, patchée dans le mois)[^5], vLLM si besoin de débit, OpenHands/Agent Canvas pour les automatisations et les tâches complexes sandboxées[^2][^3].

> [!warning] Ne pas confondre
> Un outil qui tourne sur votre machine n'est pas automatiquement souverain. Le critère décisif est : où partent les prompts, les fichiers, les clés et les résultats intermédiaires ?

## Voir aussi

- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Workflow Human-in-the-loop]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]]

## 📚 Sources

[^1]: Aider-AI, *aider* (dépôt GitHub : dernier commit le 2026-05-22, dernière release v0.86.0 du 2025-08-09), consulté le 2026-10-10. [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)
[^2]: OpenHands, *Introducing Agent Canvas* (centre de contrôle auto-hébergé, automatisations planifiées ou événementielles, profils LLM, backends locaux/Docker/VM/Kubernetes, licence MIT), 2026-06-16. [https://www.openhands.dev/blog/introducing-agent-canvas](https://www.openhands.dev/blog/introducing-agent-canvas)
[^3]: OpenHands, *Use any coding agent in OpenHands with ACP* (Agent Client Protocol : Claude Code, Codex, Gemini CLI ; `ACPAgent` dans le SDK), 2026-06-18. [https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp](https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp)
[^4]: BerriAI, *GHSA-7hp6-4w63-5g45* (escalade `internal_user` → `proxy_admin` → exécution sur l'hôte, CVSS 9.9, corrigée en 1.100.4 / 1.101.3 / 1.102.2 / 1.103.1), 2026-09-30 ; CISA, *Known Exploited Vulnerabilities Catalog* (CVE-2026-42208, CVE-2026-42271, CVE-2026-59822), catalogue daté 2026-10-08. [https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45](https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45) · [https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json)
[^5]: LiteLLM, *Version Support Policy* (depuis le 2026-06-29, seules les quatre lignes mineures stables les plus récentes reçoivent des correctifs), 2026-06-20. [https://docs.litellm.ai/blog/version-support](https://docs.litellm.ai/blog/version-support)
[^6]: OpenHands Docs, *Local LLMs* (Ollama, vLLM, SGLang, LM Studio ; Qwen3.6-35B-A3B recommandé, ≥ 24 Go de VRAM en quantifié, contexte 32k), mis à jour le 2026-05-21. [https://docs.openhands.dev/openhands/usage/llms/local-llms](https://docs.openhands.dev/openhands/usage/llms/local-llms)
[^7]: Cursor, *Cursor is now a part of SpaceX*, 2026-08-14. [https://cursor.com/blog/joining-spacex](https://cursor.com/blog/joining-spacex)
