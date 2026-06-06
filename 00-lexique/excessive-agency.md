---
title: Excessive Agency
description: Vulnérabilité OWASP LLM06 (2025) — un agent IA dispose de trop de fonctionnalités, permissions ou autonomie, permettant des actions réelles non souhaitées.
aliases:
  - Agence excessive
  - LLM06
tags:
  - lexique
  - sécurité
niveau: intermédiaire
last_modified: "2026-06-06"
last_verified: "2026-06-06"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## Définition courte

Vulnérabilité **LLM06 (OWASP 2025)** : un agent reçoit plus de fonctionnalités, de permissions ou d'autonomie qu'il n'en a besoin, rendant possible des actions dommageables même en l'absence d'attaque délibérée.

## Définition détaillée

OWASP identifie trois axes d'exposition :

- **Fonctionnalité excessive** — l'agent a accès à plus d'outils que nécessaire (ex. plugin mail avec `read` *et* `send` alors qu'on ne demande que la lecture).
- **Permissions excessives** — l'agent opère avec des droits élevés (root, admin DB, accès filesystem complet) non justifiés par sa tâche.
- **Autonomie excessive** — l'agent prend des décisions à fort impact sans [[00-lexique/human-in-the-loop|validation humaine (HITL)]].

L'Excessive Agency est dangereuse même sans attaquant : une hallucination ou un prompt injection indirecte suffit à déclencher une action réelle. Par exemple, un agent custodien vulnérable peut exécuter une commande destructrice lue dans une issue GitHub malveillante.

## Pourquoi c'est important en IA on-premise

Les agents on-premise ont souvent un accès direct à des ressources critiques : filesystem, base de données, API internes, dépôts Git. Une mauvaise configuration des droits peut transformer un agent d'assistance en vecteur d'attaque interne, sans passage par le réseau externe.

## Pièges fréquents

- Donner à un agent un accès shell général (`subprocess`, `bash`) alors qu'une seule commande suffit.
- Ne pas appliquer le principe du moindre privilège sur les volumes Docker montés.
- Permettre à l'agent de pousser sur `main` directement, sans validation humaine.
- Oublier que les outils `fetch` d'un agent héritent des permissions réseau de la machine hôte.

## Voir aussi

- [[06-mise-en-oeuvre/local-inference-security|🔒 Sécurité de l'inférence locale]] — §5.4 (Excessive Agency) et §6 (isolation des agents)
- [[00-lexique/human-in-the-loop|Human-in-the-loop]] — validation humaine des actions critiques
- [[00-lexique/autonomous-agent|Agent autonome]] — architecture et risques
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
