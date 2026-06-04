---
title: "🔭 Vision : Qu'est-ce qu'un agent custodien ?"
description: Définition, périmètre et trajectoire d'architecture d'un agent autonome chargé de maintenir un vault ou un dépôt.
sidebar:
  order: 2
---

Un **[[00-lexique/agent-custodian|agent custodien]]** est un [[00-lexique/autonomous-agent|agent autonome]] chargé de maintenir un actif numérique : vault Markdown, documentation technique, dépôt Git, backlog de sources, index de liens, ou base de connaissances.

Son rôle n'est pas de "remplacer l'auteur". Il lit, vérifie, propose, documente ses choix, puis laisse l'humain décider.

> [!tip] Définition courte
> Un agent custodien surveille un corpus, détecte ce qui mérite une mise à jour, produit une branche ou un rapport, et attend une validation humaine avant toute publication.

## Ce qu'il fait

Un agent custodien peut :

- repérer des liens cassés, sources obsolètes ou claims non sourcés ;
- proposer des corrections dans une branche Git dédiée ;
- créer un rapport de diff lisible ;
- ouvrir une PR ou envoyer une notification ;
- maintenir des index, lexiques et plans d'action.

Dans ce vault, le dossier `.agents/` joue déjà ce rôle : prompts, skills, logs d'exécution et règles de maintenance.

## Ce qu'il ne doit pas faire

Un agent custodien souverain ne doit pas :

- publier directement sur `main` ;
- supprimer du contenu sans justification ;
- exécuter des commandes destructrices sans validation ;
- ignorer les plans superseded ou archivés ;
- inventer des sources pour "finir" une tâche.

## [[00-lexique/human-in-the-loop|Human-in-the-loop]] vs human-on-the-loop

| Modèle | Description | Adapté au vault ? |
| :-- | :-- | :-- |
| **Human-in-the-loop** | L'humain valide avant l'action importante. | Oui, pour merge/publish. |
| **Human-on-the-loop** | L'agent agit, l'humain supervise après coup. | Possible pour rapports non destructifs. |

La règle simple : **tout changement irréversible reste human-in-the-loop**.

## Cursor CLI : excellent MVP, pas cible souveraine

Cursor CLI est très utile pour prototyper ce workflow : il sait lire un repo, modifier des fichiers, travailler en mode headless et produire des sorties JSON/texte. Mais ce n'est pas une cible on-premise stricte : les docs Cursor indiquent que la CLI nécessite l'accès aux services Cursor et que le contexte/code est envoyé aux LLMs selon le modèle configuré.

Il faut donc distinguer :

- **MVP pratique** : Cursor CLI pour valider le workflow.
- **Cible souveraine** : agent model-agnostic branché sur Ollama/vLLM via un proxy local.

## Trajectoire recommandée

1. **MVP simple** : Cursor CLI ou Aider, run manuel, rapport Markdown.
2. **Automatisation contrôlée** : scheduled task, branche Git, diff, notification.
3. **Runner model-agnostic** : [[00-lexique/litellm|LiteLLM]] + Ollama/vLLM, SearXNG local, logs structurés.
4. **Custodien maison** : règles métier du vault, niveaux d'autonomie, policy de sources.

## Voir aussi

- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Workflow Human-in-the-loop]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Recommandation d'architecture cible]]
- [[00-lexique/autonomous-agent|Agent autonome]]
