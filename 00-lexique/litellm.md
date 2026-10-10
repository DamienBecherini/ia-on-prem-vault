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
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Proxy/gateway qui expose une API compatible OpenAI et redirige les requêtes vers Ollama, vLLM, OpenAI, Anthropic, Azure, Bedrock ou d'autres providers.

## 📖 Définition détaillée

LiteLLM sert de couche d'abstraction entre une application agentique et les moteurs de modèle. Au lieu de coder un connecteur par provider, l'agent parle une interface commune ; l'opérateur décide ensuite si les requêtes partent vers un modèle local, un cluster vLLM ou un fournisseur cloud.

Il peut aussi centraliser les clés, le routage, les quotas, les logs, l'observabilité et, depuis 2026, une passerelle MCP vers les outils des agents[^2].

## 💡 Pourquoi c'est important en IA on-premise

Dans une cible souveraine, LiteLLM peut forcer un routage **local-only** vers Ollama ou vLLM. Dans une architecture hybride, il permet de garder une API stable tout en migrant progressivement du cloud vers le local.

## ⚠️ Pièges fréquents

- Croire que LiteLLM rend automatiquement une stack souveraine : tout dépend du backend configuré.
- Activer des logs de prompts/réponses sans politique de rétention.
- Laisser un fallback cloud silencieux dans une configuration supposée on-premise.
- Déployer le proxy puis l'oublier : depuis juin 2026, LiteLLM ne maintient que ses quatre dernières lignes mineures (environ un mois de correctifs chacune)[^1], et plusieurs de ses failles 2026 sont exploitées activement (catalogue KEV de la CISA). Une gateway exposée aux utilisateurs doit suivre les releases — voir la [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|fiche solution]].

## 📚 Pour comprendre en profondeur

1. [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|Fiche solution LiteLLM]]
2. [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|Architecture cible des agents custodiens]]

## 🔗 Voir aussi

- [[00-lexique/on-premise|On-Premise]]
- [[00-lexique/agent-custodian|Agent custodien]]
- [[03-stack-logicielle/inference-engines-vllm-ollama|Moteurs d'inférence]]

[^1]: LiteLLM, *Version Support Policy* (quatre lignes mineures stables maintenues, fenêtre glissante d'environ un mois par ligne, en vigueur le 2026-06-29), 2026-06-20. [https://docs.litellm.ai/blog/version-support](https://docs.litellm.ai/blog/version-support)
[^2]: LiteLLM Docs, *MCP Overview* (MCP Gateway : point d'entrée unique vers les serveurs MCP, contrôle d'accès par clé et par équipe ; « Agent Gateway » A2A au menu), consulté le 2026-10-10. [https://docs.litellm.ai/docs/mcp](https://docs.litellm.ai/docs/mcp)
