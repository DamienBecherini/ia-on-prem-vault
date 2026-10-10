---
title: "Aider"
description: Agent de code terminal-first, open-source, model-agnostic, capable de travailler directement avec Ollama.
sidebar:
  order: 2
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Vue d'ensemble rapide

Aider est un agent de programmation en ligne de commande. Il modifie des fichiers locaux, comprend un dépôt via une repo map, utilise Git, et peut se connecter à de nombreux LLMs, y compris des modèles locaux via Ollama[^1][^2].

> [!tip] Verdict souveraineté
> **✅ Souverain, mais gelé** : très bon candidat si Aider est configuré avec Ollama/vLLM local, analytics désactivées, et un modèle de code suffisamment fort — en sachant que le projet n'a plus de commit depuis mai 2026 (voir Maturité).

## 💡 Pourquoi ce projet nous intéresse

Aider correspond bien à l'agent custodien minimal : terminal, Git, fichiers locaux, modèle configurable, pas d'interface lourde.

Pour un vault Markdown, il peut relire des pages, appliquer des corrections, créer des commits en branche et laisser l'humain valider.

## ✅ Points forts

- Open-source, CLI simple.
- Fonctionne avec modèles cloud ou locaux.
- Support Ollama documenté[^2].
- Pas de serveur Aider intermédiaire : les requêtes vont au provider configuré[^3].
- Analytics opt-in / désactivables, sans code ni prompts selon docs[^4].

## ⚠️ Limites et risques

- La qualité dépend fortement du modèle local : souverain ne veut pas dire compétent.
- Les modèles locaux faibles peuvent casser le format d'édition, rater les remplacements précis ou boucler sur une correction.
- Un modèle 7B/8B généraliste est acceptable pour des suggestions simples, mais trop fragile pour un agent custodien qui modifie réellement des fichiers.
- Pour travailler sérieusement en local, viser au minimum un modèle **coder** de classe 14B pour petites corrections contrôlées, et plutôt 32B ou plus pour audits multi-fichiers, refactoring ou édition fiable de Markdown complexe.
- Ollama doit être configuré avec une fenêtre de contexte suffisante : son contexte par défaut peut être trop petit pour Aider et provoquer des réponses fondées sur un contexte tronqué[^2].
- Si un provider cloud est utilisé, le code part chez ce provider.
- Nécessite de bien contrôler les commandes et les fichiers autorisés.

## 🔒 Souveraineté et confidentialité

- **Données :** restent locales sauf envoi au LLM configuré.
- **Modèle :** local possible via Ollama.
- **Mémoire :** contexte de session + Git local.
- **Télémétrie :** analytics désactivables ; ne doivent pas inclure code/prompts selon docs.
- **Mode 100% offline :** oui avec modèle local déjà téléchargé.
- **Verdict :** ✅ souverain natif si configuré localement.

## 🔗 Intégration possible dans ce vault

Aider reste le candidat le plus simple pour un premier essai souverain, à condition d'accepter un outil gelé depuis mai 2026 ; pour une cible durable, préférer un agent maintenu et model-agnostic comme [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] (CLI ou Agent Canvas, MIT) branché sur Ollama/vLLM[^6] :

- `aider --model ollama_chat/<modèle coder récent>` : par exemple un Qwen3.6-35B-A3B (MoE, ~24 Go de VRAM quantifié, recommandé par OpenHands pour l'usage agentique au T2 2026) ou un dense 14B pour les essais contrôlés, 32B+ pour la maintenance régulière ; Aider ne connaissant plus les modèles sortis après mai 2026, ignorer ses « model warnings » après vérification manuelle du contexte[^2][^6] ;
- branche dédiée ;
- plan/règles du vault en contexte ;
- rapport Markdown final.

> [!warning] Dimensionnement local
> L'agent custodien qui **modifie** un dépôt a besoin d'un modèle plus robuste qu'un assistant RAG qui répond à une question. Le budget matériel doit donc être dimensionné pour un modèle de code spécialisé, pas pour un petit modèle conversationnel.

## 📊 Maturité du projet

Projet mature (Apache-2.0, environ 49 000 étoiles GitHub) spécialisé dans l'édition de code, mais **gelé de fait au T4 2026** : aucun commit depuis le 2026-05-22, dernière release v0.86.0 (2025-08-09) et dernière publication PyPI 0.86.2 (2026-02-12), sans annonce des mainteneurs[^1][^5]. Il reste plus étroit qu'OpenHands et beaucoup plus simple à opérer, mais les nouveaux modèles ne sont plus référencés et aucun correctif de sécurité n'est à attendre : à utiliser en connaissance de cause, avec un plan de remplacement.

Pour une cible durable, préférer un agent maintenu et model-agnostic comme [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] (CLI, SDK ou Agent Canvas, licence MIT), dont la documentation couvre les modèles locaux via Ollama, vLLM ou SGLang[^6]. Si Aider ne reprend pas, les autres candidats model-agnostic maintenus au T4 2026 sont, à évaluer, Goose (Block, Apache-2.0) et Cline (Apache-2.0, CLI 3.x), tous deux en release hebdomadaire ; leur support des modèles locaux n'a pas été vérifié dans ce vault[^7].

## 🔗 Voir aussi

- [[00-lexique/autonomous-agent|Agent autonome]] · [[00-lexique/appel-outils|Appel d'outils]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] · [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Workflow HITL]] · [[05-agents-et-assistants-on-prem/agents-custodiens/github-branches-pr-notifications|Branches & PR]]
- [[04-blueprints/scenario-a-dev-lab|Scénario A]]

## 📚 Sources

[^1]: Aider GitHub README. [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)
[^2]: Aider Docs, *Ollama*. [https://aider.chat/docs/llms/ollama.html](https://aider.chat/docs/llms/ollama.html)
[^3]: Aider GitHub issue #3627 — clarifications sur données/code et absence de serveur Aider. [https://github.com/Aider-AI/aider/issues/3627](https://github.com/Aider-AI/aider/issues/3627)
[^4]: Aider Docs, *Analytics*. [https://aider.chat/docs/more/analytics.html](https://aider.chat/docs/more/analytics.html)
[^5]: PyPI, *aider-chat* (dernière publication 0.86.2 du 2026-02-12), consulté le 2026-10-09. [https://pypi.org/project/aider-chat/](https://pypi.org/project/aider-chat/)
[^6]: OpenHands Docs, *Local LLMs* (LM Studio, Ollama, vLLM, SGLang), mis à jour le 2026-05-21. [https://docs.openhands.dev/openhands/usage/llms/local-llms](https://docs.openhands.dev/openhands/usage/llms/local-llms)
[^7]: Block, *Goose Releases* (v1.54.0 du 2026-10-08, Apache-2.0) et Cline, *Cline Releases* (releases du 2026-10-08, Apache-2.0), consultés le 2026-10-09. [https://github.com/block/goose/releases](https://github.com/block/goose/releases) · [https://github.com/cline/cline/releases](https://github.com/cline/cline/releases)
