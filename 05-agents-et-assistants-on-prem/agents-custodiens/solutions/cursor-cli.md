---
title: "Cursor CLI"
description: Interface terminal de l'agent Cursor, très efficace pour prototyper un agent custodien, mais non souveraine au sens on-prem strict.
sidebar:
  order: 1
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Vue d'ensemble rapide

Cursor CLI (commande `agent`) permet d'utiliser l'agent Cursor depuis le terminal, en interactif ou en mode headless (`agent -p` / `--print`) pour scripts et CI[^1][^2]. Il peut lire un dépôt, modifier des fichiers, utiliser des règles, reprendre des sessions et produire des sorties texte/JSON.

## 💡 Pourquoi ce projet nous intéresse

Pour ce vault, Cursor CLI est un **excellent MVP** : il permet de valider rapidement le workflow "audit → modification → rapport → validation humaine" sans construire immédiatement toute l'infrastructure.

## ✅ Points forts

- Très productif pour travailler sur un repo existant.
- Mode headless adapté aux scripts.
- Compatible règles, `AGENTS.md`, MCP, recherche et shell selon configuration.
- Bon outil pour générer une branche ou un rapport de maintenance.

## ⚠️ Limites et risques

- Nécessite l'accès aux services Cursor[^3].
- Les prompts/code peuvent transiter vers les LLMs configurés.
- BYOK ne signifie pas exécution locale : le prompt final passe encore par les serveurs Cursor, et la politique Zero Data Retention de Cursor ne s'applique plus en BYOK (c'est celle du fournisseur choisi qui compte)[^4].
- Pas de support documenté pour inférence 100% locale on-prem. Les « self-hosted machines » introduites le 2026-09-02 gardent l'**exécution des outils** (shell, navigateur) dans votre réseau, mais les prompts et le modèle restent côté Cursor[^6].

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

Produit intégré à Cursor — société acquise par SpaceX le 2026-08-14, qui propose depuis les modèles Grok de xAI en première partie (Grok 4.6 en août 2026) — très pratique pour prototypage et usage personnel. Pour une organisation soumise à souveraineté stricte, il doit rester un outil de développement, pas la cible finale ; le changement d'actionnaire est un rappel que la politique de données d'un outil cloud peut évoluer sans préavis[^5].

## 🔗 Voir aussi

- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] · [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté]] — cloud IDE vs custodian on-prem
- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Workflow HITL]]
- [[04-blueprints/scenario-a-dev-lab|Scénario A]]

## 📚 Sources

[^1]: Cursor Docs, *CLI Overview*. [https://cursor.com/docs/cli/overview.md](https://cursor.com/docs/cli/overview.md)
[^2]: Cursor Docs, *Headless mode*. [https://cursor.com/docs/cli/headless.md](https://cursor.com/docs/cli/headless.md)
[^3]: Cursor Docs, *Enterprise deployment patterns*. [https://cursor.com/docs/enterprise/deployment-patterns.md](https://cursor.com/docs/enterprise/deployment-patterns.md)
[^4]: Cursor Help, *API keys / BYOK* (« all requests are routed through Cursor's servers for final prompt building » ; Zero Data Retention non applicable en BYOK), lu le 2026-10-09. [https://cursor.com/help/models-and-usage/api-keys.md](https://cursor.com/help/models-and-usage/api-keys.md)
[^5]: Cursor, *Cursor is now a part of SpaceX* (acquisition « officiellement » clôturée, processus engagé en avril ; Grok 4.6 cité comme premier modèle commun), 2026-08-14. [https://cursor.com/blog/joining-spacex](https://cursor.com/blog/joining-spacex)
[^6]: Cursor, *Changelog* — entrée du 2026-09-02 « self-hosted machines » (exécution des outils des cloud agents dans votre réseau, pools d'équipe, hibernation), consulté le 2026-10-10. [https://cursor.com/changelog](https://cursor.com/changelog)
