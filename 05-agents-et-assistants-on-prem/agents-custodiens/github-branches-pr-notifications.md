---
title: "🌿 Branches, PRs & Notifications"
description: Comment isoler les travaux d'un agent custodien dans Git et notifier un humain sans automatiser le merge.
sidebar:
  order: 4
---

Git est le garde-fou naturel d'un agent custodien. Il transforme une action risquée ("l'agent modifie le vault") en proposition réversible ("l'agent ouvre une branche avec un diff").

## Convention de branche

Format recommandé :

```text
agent/YYYY-MM-DD/<objectif-court>
```

Exemples :

- `agent/2026-06-04/link-audit`
- `agent/2026-06-04/refresh-nvlink`
- `agent/2026-06-04/lexicon-backlog-cleanup`

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
- fichier Markdown dans `.agents/vault-maintenance/runs/`.

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
