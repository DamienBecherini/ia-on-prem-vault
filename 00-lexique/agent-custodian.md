---
title: Agent custodien
description: Agent autonome chargé de maintenir un vault, dépôt ou corpus documentaire en proposant des corrections validées par l'humain.
aliases:
  - Custodian Agent
  - Agent de maintenance
  - Agent mainteneur
tags:
  - lexique
  - agents
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Sous-type d'[[00-lexique/autonomous-agent|agent autonome]] qui surveille un corpus, détecte les problèmes, propose des corrections en branche ou rapport, et attend une validation humaine avant publication.

## 📖 Définition détaillée

Un agent custodien agit comme un mainteneur junior : il audite les liens, repère les sources obsolètes, propose des ajouts de lexique, vérifie les claims et prépare des diffs. Son périmètre est borné par des règles éditoriales, des plans actifs et un workflow [[00-lexique/human-in-the-loop|human-in-the-loop]].

Il est particulièrement adapté aux vaults Markdown, documentations techniques et bases de connaissances vivantes.

## 💡 Pourquoi c'est important en IA on-premise

Un vault on-premise devient vite trop gros pour être maintenu manuellement. L'agent custodien automatise la veille et la préparation des corrections sans confier le merge ou la publication à un système opaque.

## ⚠️ Pièges fréquents

- Donner un accès écriture direct à `main`.
- Mélanger plans actifs et plans archivés.
- Laisser l'agent inventer une source pour satisfaire une consigne.
- Oublier de journaliser les décisions éditoriales.

## 📚 Pour comprendre en profondeur

1. [[05-agents-et-assistants-on-prem/agents-custodiens/index|Agents Custodiens On-Premise]]
2. [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Workflow Human-in-the-loop]]
3. [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Architecture cible]]

## 🔗 Voir aussi

- [[00-lexique/human-in-the-loop|Human-in-the-loop]]
- [[00-lexique/autonomous-agent|Agent autonome]]
- [[00-lexique/litellm|LiteLLM]]
