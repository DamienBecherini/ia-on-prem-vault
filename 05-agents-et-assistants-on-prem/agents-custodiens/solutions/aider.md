---
title: "Aider"
description: Agent de code terminal-first, open-source, model-agnostic, capable de travailler directement avec Ollama.
sidebar:
  order: 2
---

## 🔍 Vue d'ensemble rapide

Aider est un agent de programmation en ligne de commande. Il modifie des fichiers locaux, comprend un dépôt via une repo map, utilise Git, et peut se connecter à de nombreux LLMs, y compris des modèles locaux via Ollama[^1][^2].

> [!tip] Verdict souveraineté
> **✅ Très bon candidat souverain** si Aider est configuré avec Ollama/vLLM local, analytics désactivées, et un modèle de code suffisamment fort.

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

Aider est le meilleur candidat pour la première cible souveraine :

- `aider --model ollama_chat/qwen2.5-coder:14b` pour essais contrôlés ;
- `aider --model ollama_chat/qwen2.5-coder:32b` ou équivalent coder fort pour maintenance régulière ;
- branche dédiée ;
- plan/règles du vault en contexte ;
- rapport Markdown final.

> [!warning] Dimensionnement local
> L'agent custodien qui **modifie** un dépôt a besoin d'un modèle plus robuste qu'un assistant RAG qui répond à une question. Le budget matériel doit donc être dimensionné pour un modèle de code spécialisé, pas pour un petit modèle conversationnel.

## 📊 Maturité du projet

Projet mature et très actif, spécialisé dans l'édition de code. Plus étroit qu'OpenHands, mais beaucoup plus simple à opérer.

## 📚 Sources

[^1]: Aider GitHub README. [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)
[^2]: Aider Docs, *Ollama*. [https://aider.chat/docs/llms/ollama.html](https://aider.chat/docs/llms/ollama.html)
[^3]: Aider GitHub issue #3627 — clarifications sur données/code et absence de serveur Aider. [https://github.com/Aider-AI/aider/issues/3627](https://github.com/Aider-AI/aider/issues/3627)
[^4]: Aider Docs, *Analytics*. [https://aider.chat/docs/more/analytics.html](https://aider.chat/docs/more/analytics.html)
