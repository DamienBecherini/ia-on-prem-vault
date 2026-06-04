---
title: "🔍 Recherche Web & Sources"
description: Comment donner un accès web contrôlé à un agent custodien sans dépendre d'un service de recherche cloud.
sidebar:
  order: 5
---

Un agent custodien qui maintient un vault technique doit vérifier l'actualité des sources. Mais lui donner un accès web brut peut exposer les requêtes, les documents et les intentions de l'organisation.

## Principe

L'agent ne doit pas "surfer librement". Il doit utiliser un outil de recherche explicite, journalisé et contrôlé.

Pour une stack souveraine, le couple recommandé est :

- **SearXNG** pour la recherche web métamoteur auto-hébergée ;
- **fetch HTTP contrôlé** pour lire les pages retenues ;
- **rapport de sources** obligatoire dans chaque run.

## Ce qu'il faut journaliser

- requête envoyée ;
- moteur ou instance utilisée ;
- URL sélectionnées ;
- date de consultation ;
- extrait utilisé ;
- décision éditoriale prise.

## Requêtes sûres

Préférer des requêtes ciblées :

```text
site:developer.nvidia.com NVLink NVSwitch H100 H200 inference
site:docs.vllm.ai tensor parallelism multi node serving
site:github.com openhands local LLM Ollama
```

Éviter d'envoyer des contenus internes entiers dans une recherche web. Résumer localement, puis chercher les concepts publics.

## Pourquoi SearXNG

SearXNG est un métamoteur libre qui agrège les résultats de nombreux services sans profiler les utilisateurs. Une instance privée évite de dépendre directement d'un SaaS de recherche et expose une API JSON exploitable par un agent.

## Voir aussi

- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng|SearXNG]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]]
