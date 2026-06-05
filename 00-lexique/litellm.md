---
title: LiteLLM
description: Gateway OpenAI-compatible qui route les appels LLM vers des modèles locaux ou cloud depuis une interface unique.
aliases:
  - Lite LLM
  - LiteLLM Proxy
  - LLM Gateway
tags:
  - lexique
  - stack-logicielle
  - agents
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Proxy/gateway qui expose une API compatible OpenAI et redirige les requêtes vers Ollama, vLLM, OpenAI, Anthropic, Azure, Bedrock ou d'autres providers.

## 📖 Définition détaillée

LiteLLM sert de couche d'abstraction entre une application agentique et les moteurs de modèle. Au lieu de coder un connecteur par provider, l'agent parle une interface commune ; l'opérateur décide ensuite si les requêtes partent vers un modèle local, un cluster vLLM ou un fournisseur cloud.

Il peut aussi centraliser les clés, le routage, les quotas, les logs et l'observabilité.

## 💡 Pourquoi c'est important en IA on-premise

Dans une cible souveraine, LiteLLM peut forcer un routage **local-only** vers Ollama ou vLLM. Dans une architecture hybride, il permet de garder une API stable tout en migrant progressivement du cloud vers le local.

## ⚠️ Pièges fréquents

- Croire que LiteLLM rend automatiquement une stack souveraine : tout dépend du backend configuré.
- Activer des logs de prompts/réponses sans politique de rétention.
- Laisser un fallback cloud silencieux dans une configuration supposée on-premise.

## 📚 Pour comprendre en profondeur

1. [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|Fiche solution LiteLLM]]
2. [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Architecture cible des agents custodiens]]

## 🔗 Voir aussi

- [[00-lexique/on-premise|On-Premise]]
- [[00-lexique/agent-custodian|Agent custodien]]
- [[03-stack-logicielle/inference-engines-vllm-ollama|Moteurs d'inférence]]
