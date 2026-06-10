---
title: "Appel d'outils (Tool / Function Calling)"
description: "Capacité d'un LLM à émettre des requêtes structurées vers des fonctions externes (API, SQL, code) plutôt que du texte libre."
aliases:
  - Function Calling
  - Tool Calling
  - Tool Use
tags:
  - lexique
  - stack
sidebar:
  order: 66
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
---

## 📝 Définition courte

Mécanisme où le [[00-lexique/llm|LLM]] choisit et paramètre une **fonction externe** (schéma JSON) au lieu de répondre directement : recherche, calcul, requête BDD, exécution script[^1].

## 📖 Définition détaillée

L'**appel d'outils** (*function calling* / *tool calling*) transforme le LLM en orchestrateur : le modèle reçoit une liste d'outils décrits (nom, paramètres, types), décide lequel invoquer, produit un payload structuré, puis intègre le résultat dans la suite du raisonnement.

En stack on-premise, le moteur ([[00-lexique/vllm|vLLM]], [[00-lexique/ollama|Ollama]], [[00-lexique/sglang|SGLang]]) expose souvent une API compatible OpenAI « tools » ; l'application exécute réellement l'outil **côté serveur** (jamais en confiance aveugle).

Pattern typique : petit modèle rapide pour le routage d'outils, gros modèle pour la synthèse finale — voir [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]].

## 💡 Pourquoi c'est important en IA on-premise

- Base des [[00-lexique/autonomous-agent|agents autonomes]] et du RAG agentique (retrieve, filter, rewrite).
- Permet de connecter le LLM au SI interne **sans** fine-tuning : contrats d'outils = frontière de sécurité.
- Lié à OWASP LLM06 ([[00-lexique/excessive-agency|Excessive Agency]]) : surface d'attaque si trop d'outils ou droits excessifs.

## ⚠️ Pièges fréquents

- Donner à l'agent des outils **destructifs** (shell, DELETE SQL) sans sandbox ni validation HITL.
- Parser du JSON « presque valide » sans validateur aval — préférer [[00-lexique/sglang|SGLang]] ou contraintes strictes pour les sorties structurées.
- Ignorer la latence : chaque tour outil = nouveau préfill ; optimiser le contexte partagé (RadixAttention).

## 📚 Pour comprendre en profondeur

1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]
2. [[06-mise-en-oeuvre/local-inference-security|🔐 Sécurité inférence]] — LLM06 Excessive Agency
3. [[00-lexique/langgraph|LangGraph]] — orchestration multi-étapes

## 🔗 Voir aussi

- [[00-lexique/autonomous-agent|Agent autonome]]
- [[00-lexique/excessive-agency|Excessive Agency]]
- [[00-lexique/sglang|SGLang]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: OpenAI API — Function calling (pattern de facto repris par vLLM/Ollama). [https://platform.openai.com/docs/guides/function-calling](https://platform.openai.com/docs/guides/function-calling)
