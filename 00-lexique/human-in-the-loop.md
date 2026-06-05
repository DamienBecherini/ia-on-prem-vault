---
title: Human-in-the-loop
description: Mode de gouvernance où une action automatisée importante attend une validation humaine avant d'être appliquée.
aliases:
  - HITL
  - Humain dans la boucle
  - Validation humaine
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

Principe selon lequel un agent ou système automatisé peut analyser et proposer, mais doit attendre une validation humaine avant une action critique : merge, publication, suppression, accès à une donnée sensible.

## 📖 Définition détaillée

Dans un workflow [[00-lexique/autonomous-agent|agentique]], le LLM peut lire des fichiers, appeler des outils, produire un patch ou ouvrir une PR. Le **human-in-the-loop** place l'humain comme point de contrôle avant l'étape irréversible.

Ce principe se distingue du *human-on-the-loop*, où l'humain supervise après coup. Pour un vault documentaire ou un dépôt Git, le modèle recommandé est hybride : l'agent peut travailler en branche, mais le merge reste humain.

## 💡 Pourquoi c'est important en IA on-premise

Le on-premise ne suffit pas à garantir la sécurité : un agent local peut quand même supprimer, publier ou modifier trop largement. Le human-in-the-loop limite le risque opérationnel tout en gardant les gains d'automatisation.

## ⚠️ Pièges fréquents

- Confondre notification et validation : recevoir un rapport ne veut pas dire approuver l'action.
- Autoriser le merge automatique sur `main` pour des tâches éditoriales.
- Laisser un agent lire des plans archivés et exécuter des TODOs obsolètes.

## 📚 Pour comprendre en profondeur

1. [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Workflow Human-in-the-loop]]
2. [[05-agents-et-assistants-on-prem/agents-custodiens/vision-agent-custodian|Vision : agent custodien]]

## 🔗 Voir aussi

- [[00-lexique/agent-custodian|Agent custodien]]
- [[00-lexique/autonomous-agent|Agent autonome]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|Agents Custodiens]]
