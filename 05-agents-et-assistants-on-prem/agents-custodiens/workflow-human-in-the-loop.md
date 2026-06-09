---
title: "⚙️ Workflow : Human-in-the-loop de bout en bout"
description: "Cycle d'exécution recommandé pour un agent custodien : déclencheur, branche, diff, rapport, revue humaine, merge et publication."
sidebar:
  order: 3
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Un agent custodien doit être autonome dans l'analyse, mais conservateur dans l'action. Le workflow ci-dessous garde cette séparation nette.

## Cycle complet

1. **Déclencheur** : manuel, cron, webhook GitHub, nouveau fichier ou audit planifié.
2. **Préflight** : vérifier branche, état Git, règles, plan actif et dossiers à ignorer.
3. **Exécution** : lire, auditer, générer corrections ou rapport.
4. **Isolation** : créer une branche dédiée ou produire un patch non appliqué.
5. **Rapport** : résumer les changements, sources, risques et vérifications.
6. **Validation humaine** : revue du diff, questions, corrections.
7. **Merge** : seulement après accord explicite.
8. **Publication** : build + déploiement, séparés du travail d'édition.

> [!warning] Règle de sécurité
> Un agent custodien ne merge jamais sur `main` et ne publie jamais sans validation humaine explicite.

## Niveaux d'autonomie

| Niveau | Nom | Ce que l'agent peut faire | Risque |
| :-- | :-- | :-- | :-- |
| 0 | Report-only | Lire et produire un rapport | Très faible |
| 1 | Patch proposal | Générer un patch ou plan | Faible |
| 2 | Branch | Modifier une branche dédiée | Moyen |
| 3 | PR | Ouvrir une PR avec description | Moyen |
| 4 | Staging | Déployer en préproduction | Élevé |
| 5 | Publish | Publier en production | À éviter sans humain |

Pour ce vault, le niveau raisonnable est **2 ou 3** : branche/PR, validation humaine, puis merge.

## Préflight minimal

Avant chaque run :

- **Vérifier que le repo est propre (`git status --porcelain`)** : si le repo est *dirty* (modifications non commitées), l'agent doit **avorter** et notifier l'opérateur. Il ne doit jamais embarquer un brouillon humain en cours dans son commit. Exception explicite uniquement : `git stash` avec un nom horodaté si l'opérateur a activé ce mode dans la configuration de l'agent.
- vérifier que le plan actif est bien dans `.cursor/plans/` (pas un plan obsolète) ;
- ignorer `_private/`, `build/`, `dist/`, `.git/` et les logs obsolètes ;
- refuser les commandes destructrices ;
- citer les sources pour tout changement factuel.

> [!warning] Condition de course — repo dirty
> Un agent qui commence son travail sur un repo dirty risque de mélanger ses modifications algorithmiques avec le travail humain en cours. Si une PR est ensuite ouverte, elle peut embarquer des brouillons inachevés ou des fichiers temporaires que l'humain n'avait pas l'intention de partager. **La règle est simple : dirty = abort.**

## Rapport attendu

Pour un run avec livraison git, la **PR** (description + diff) est la trace principale. Sinon, un rapport en chat suffit :

- objectif ;
- fichiers modifiés ;
- sources consultées ;
- changements proposés ;
- tests ou vérifications ;
- risques résiduels ;
- prochaines étapes.

## Voir aussi

- [[05-agents-et-assistants-on-prem/agents-custodiens/github-branches-pr-notifications|Branches, PRs & Notifications]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/recherche-web-et-sources|Recherche Web & Sources]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]]
