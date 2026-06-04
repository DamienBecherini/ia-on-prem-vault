---
title: "⚙️ Workflow : Human-in-the-loop de bout en bout"
description: Cycle d'exécution recommandé pour un agent custodien : déclencheur, branche, diff, rapport, revue humaine, merge et publication.
sidebar:
  order: 3
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

:::caution[Règle de sécurité]
Un agent custodien ne merge jamais sur `main` et ne publie jamais sans validation humaine explicite.
:::

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

- vérifier que le plan actif n'est pas dans `docs/plans/archive/` ;
- ignorer `_private/`, `build/`, `dist/`, `.git/`, logs obsolètes et plans superseded ;
- refuser les commandes destructrices ;
- enregistrer le run sous `.agents/vault-maintenance/runs/` ;
- citer les sources pour tout changement factuel.

## Rapport attendu

Chaque run devrait produire :

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
