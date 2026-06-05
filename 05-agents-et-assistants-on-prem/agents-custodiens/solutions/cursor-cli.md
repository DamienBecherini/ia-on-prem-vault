---
title: "Cursor CLI"
description: Interface terminal de l'agent Cursor, très efficace pour prototyper un agent custodien, mais non souveraine au sens on-prem strict.
sidebar:
  order: 1
last_modified: "2026-06-04"
---

## 🔍 Vue d'ensemble rapide

Cursor CLI permet d'utiliser l'agent Cursor depuis le terminal, en interactif ou en mode headless (`--print`) pour scripts et CI. Il peut lire un dépôt, modifier des fichiers, utiliser des règles, reprendre des sessions et produire des sorties texte/JSON.

## 💡 Pourquoi ce projet nous intéresse

Pour ce vault, Cursor CLI est un **excellent MVP** : il permet de valider rapidement le workflow "audit → modification → rapport → validation humaine" sans construire immédiatement toute l'infrastructure.

## ✅ Points forts

- Très productif pour travailler sur un repo existant.
- Mode headless adapté aux scripts.
- Compatible règles, `AGENTS.md`, MCP, recherche et shell selon configuration.
- Bon outil pour générer une branche ou un rapport de maintenance.

## ⚠️ Limites et risques

- Nécessite l'accès aux services Cursor.
- Les prompts/code peuvent transiter vers les LLMs configurés.
- BYOK ne signifie pas exécution locale : le prompt final passe encore par Cursor selon la documentation.
- Pas de support documenté pour inférence 100% locale on-prem.

## 🔒 Souveraineté et confidentialité

- **Données :** contexte/code envoyé selon modèle et paramètres Cursor.
- **Modèle :** routage via Cursor/provideurs ; local strict non supporté dans les docs consultées.
- **Mémoire :** dépend de Cursor et de la session.
- **Télémétrie :** dépend du mode Cursor/Privacy Mode.
- **Mode 100% offline :** non.
- **Verdict :** ❌ incompatible on-prem strict, mais utile comme MVP.

Voir la grille : [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]].

## 🔗 Intégration possible dans ce vault

Cursor CLI peut déclencher :

- un audit de liens ;
- une mise à jour de lexique ;
- un rapport de sources ;
- une PR manuelle ou semi-automatisée.

Le dossier `.agents/` de ce vault est un exemple de structuration compatible avec cette approche.

## 📊 Maturité du projet

Produit intégré à Cursor, très pratique pour prototypage et usage personnel. Pour une organisation soumise à souveraineté stricte, il doit rester un outil de développement, pas la cible finale.

## 📚 Sources

- Cursor Docs, *CLI Overview*. [https://cursor.com/docs/cli/overview.md](https://cursor.com/docs/cli/overview.md)
- Cursor Docs, *Headless mode*. [https://cursor.com/docs/cli/headless.md](https://cursor.com/docs/cli/headless.md)
- Cursor Docs, *Enterprise deployment patterns*. [https://cursor.com/docs/enterprise/deployment-patterns.md](https://cursor.com/docs/enterprise/deployment-patterns.md)
- Cursor Help, *API keys / BYOK*. [https://cursor.com/help/models-and-usage/api-keys.md](https://cursor.com/help/models-and-usage/api-keys.md)
