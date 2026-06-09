---
title: "🌿 Branches, PRs & Notifications"
description: Comment isoler les travaux d'un agent custodien dans Git et notifier un humain sans automatiser le merge.
sidebar:
  order: 4
last_modified: "2026-06-09"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Git est le garde-fou naturel d'un agent custodien. Il transforme une action risquée ("l'agent modifie le vault") en proposition réversible ("l'agent ouvre une branche avec un diff").

## Convention de branche

Format recommandé — conforme à `.cursor/rules/git-workflow.mdc` :

```text
<type>/<objectif-court>
```

| Type | Quand l'utiliser |
|------|------------------|
| `feat` | Nouveau contenu (chapitre, entrée lexique, nouvelle section) |
| `fix` | Corrections (liens cassés, faits erronés, typos) |
| `chore` | Maintenance, refresh, backlog, fichiers agent |
| `docs` | Méta uniquement (rules, skills, plans) |

Exemples :

- `feat/owasp-2025-alignment`
- `chore/vault-refresh-2026-06`
- `fix/broken-links-audit`
- `chore/lexique-backlog-cleanup`

## Contenu minimal d'une PR agent

Une PR générée par agent doit contenir :

- résumé lisible ;
- fichiers modifiés ;
- sources externes consultées ;
- commandes exécutées ;
- limites et hypothèses ;
- checklist de revue humaine.

> [!tip] Bon signal
> Une bonne PR d'agent doit permettre de rejeter la proposition sans perdre l'information : même si le diff n'est pas mergé, le rapport doit rester utile.

## Notifications

Canaux possibles :

- GitHub PR ;
- email ;
- webhook Slack/Matrix/Discord ;
- fichier de log via `vault-log-run` sous `.agents/vault-maintenance/runs/` (trace principale pour les runners non-interactifs ou les tâches sans PR).

Le canal importe moins que la règle : **la notification ne vaut pas validation**.

## Anti-patterns

- branche unique `agent-work` réutilisée indéfiniment ;
- commit direct sur `main` ;
- PR sans sources ;
- notification qui déclenche automatiquement le merge ;
- agent qui relance une tâche superseded parce qu'un vieux plan contient encore des TODOs.

## Voir aussi

- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Workflow Human-in-the-loop]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Recommandation d'architecture cible]]
