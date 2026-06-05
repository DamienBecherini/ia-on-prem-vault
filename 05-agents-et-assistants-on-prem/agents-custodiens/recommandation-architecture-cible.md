---
title: "🏗️ Recommandation d'architecture cible"
description: Trajectoire réaliste pour passer d'un MVP Cursor CLI à une stack custodienne souveraine basée sur Aider, Ollama/vLLM, LiteLLM et SearXNG.
sidebar:
  order: 6
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
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
| Modèle local | Ollama ou vLLM + modèle coder spécialisé | Inférence on-prem, avec niveau de raisonnement suffisant |
| Gateway | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]] ([[00-lexique/litellm|lexique]]) | API OpenAI-compatible, routage, logs |
| Recherche | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng|SearXNG]] | Recherche web auto-hébergée |
| Sandbox avancée | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] | Agent Docker plus lourd |
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
| Gros refactoring ou raisonnement long | 32B+ avec grand contexte, ou modèle frontière non souverain en MVP | arbitrage souveraineté vs qualité |

Le point clé : l'agent qui **agit** sur les fichiers a besoin de plus de raisonnement que l'assistant qui **retrouve** une information. Le budget VRAM doit donc être dimensionné pour le modèle d'édition, pas seulement pour le modèle de chat.

## Recommandation concrète pour ce vault

1. **Court terme** : continuer avec Cursor/Aider en validation humaine.
2. **Moyen terme** : Aider + Ollama + modèle coder 14B/32B + SearXNG + scripts de maintenance.
3. **Long terme** : [[00-lexique/litellm|LiteLLM]] comme gateway, vLLM si besoin de débit, OpenHands pour tâches complexes sandboxées.

> [!warning] Ne pas confondre
> Un outil qui tourne sur votre machine n'est pas automatiquement souverain. Le critère décisif est : où partent les prompts, les fichiers, les clés et les résultats intermédiaires ?

## Voir aussi

- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Workflow Human-in-the-loop]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]]
