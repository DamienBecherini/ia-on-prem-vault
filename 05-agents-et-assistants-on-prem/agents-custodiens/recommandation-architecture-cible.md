---
title: "🏗️ Recommandation d'architecture cible"
description: Trajectoire réaliste pour passer d'un MVP Cursor CLI à une stack custodienne souveraine basée sur Aider, Ollama/vLLM, LiteLLM et SearXNG.
sidebar:
  order: 6
---

La bonne architecture n'est pas la plus pure dès le premier jour. C'est celle qui permet de valider le workflow sans mentir sur la souveraineté.

## Étape 1 — MVP pratique

Pour apprendre vite :

- Cursor CLI ou Aider ;
- run manuel ;
- rapport Markdown ;
- branche Git dédiée ;
- validation humaine.

Cursor CLI est très productif pour tester l'idée. Aider est plus proche de la cible souveraine, car il peut appeler directement Ollama.

## Étape 2 — Runner contrôlé

Pour automatiser :

- tâche planifiée (cron, systemd timer, GitHub Actions self-hosted) ;
- branche datée ;
- logs sous `.agents/vault-maintenance/runs/` ;
- rapport de sources ;
- notification sans merge automatique.

## Étape 3 — Cible souveraine

Stack recommandée :

| Couche | Choix recommandé | Rôle |
| :-- | :-- | :-- |
| Agent code | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] | Modifie fichiers et travaille avec Git |
| Modèle local | Ollama ou vLLM | Inférence on-prem |
| Gateway | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]] ([[00-lexique/litellm|lexique]]) | API OpenAI-compatible, routage, logs |
| Recherche | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng|SearXNG]] | Recherche web auto-hébergée |
| Sandbox avancée | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] | Agent Docker plus lourd |
| MVP rapide | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]] | Productivité initiale |

## Recommandation concrète pour ce vault

1. **Court terme** : continuer avec Cursor/Aider en validation humaine.
2. **Moyen terme** : Aider + Ollama + SearXNG + scripts de maintenance.
3. **Long terme** : [[00-lexique/litellm|LiteLLM]] comme gateway, vLLM si besoin de débit, OpenHands pour tâches complexes sandboxées.

:::caution[Ne pas confondre]
Un outil qui tourne sur votre machine n'est pas automatiquement souverain. Le critère décisif est : où partent les prompts, les fichiers, les clés et les résultats intermédiaires ?
:::

## Voir aussi

- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Workflow Human-in-the-loop]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]]
