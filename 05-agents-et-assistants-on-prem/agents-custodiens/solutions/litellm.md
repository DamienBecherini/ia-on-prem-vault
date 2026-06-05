---
title: "LiteLLM"
description: Gateway OpenAI-compatible pour router agents et applications vers Ollama, vLLM, cloud providers ou modèles internes.
sidebar:
  order: 4
last_modified: "2026-06-04"
---

## 🔍 Vue d'ensemble rapide

LiteLLM est un proxy/gateway open-source qui expose une interface compatible OpenAI vers plus de 100 providers : Ollama, vLLM, OpenAI, Anthropic, Azure, Bedrock, Vertex AI, Hugging Face et d'autres[^1].

## 💡 Pourquoi ce projet nous intéresse

Pour un agent custodien, LiteLLM sert de **couche d'abstraction modèle**. L'agent parle OpenAI-compatible ; l'opérateur décide si la requête part vers Ollama local, vLLM, ou un provider cloud.

Cela évite de réécrire l'agent à chaque changement de modèle.

## ✅ Points forts

- API unifiée pour modèles locaux et cloud[^1].
- Support Ollama/vLLM documenté[^1][^2].
- Proxy central avec clés virtuelles, routage, coûts, logs et guardrails.
- Utile pour migrer progressivement cloud → local.

## ⚠️ Limites et risques

- N'est pas un modèle : il route vers des backends.
- Mauvaise config = fuite vers cloud.
- Logging/observabilité peuvent capturer prompts/réponses si activés sans précaution[^3].
- Ajoute une couche critique à sécuriser.

## 🔒 Souveraineté et confidentialité

- **Données :** transitent par le proxy ; destination selon backend.
- **Modèle :** local si backend Ollama/vLLM local ; cloud si provider cloud.
- **Mémoire :** pas une mémoire applicative, sauf logs/observabilité.
- **Télémétrie/logging :** configurable ; désactiver message logging pour données sensibles[^3].
- **Mode 100% offline :** oui avec backends locaux.
- **Verdict :** ✅ souverain si configuré local-only ; ⚠️ sinon.

## 🔗 Intégration possible dans ce vault

LiteLLM est la couche cible entre :

- Aider/OpenHands ;
- Ollama/vLLM ;
- politiques de routage ;
- logs locaux ;
- éventuelle bascule cloud de secours.

## 📊 Maturité du projet

Très utilisé dans les stacks LLM comme gateway. Sa puissance vient avec une responsabilité : configuration, secrets, logs et règles de routage doivent être versionnés et audités.

## 📚 Sources

[^1]: LiteLLM GitHub README. [https://github.com/BerriAI/litellm](https://github.com/BerriAI/litellm)
[^2]: LiteLLM Proxy docs — local proxy, Ollama, vLLM. [https://docs.litellm.ai/docs/proxy_server](https://docs.litellm.ai/docs/proxy_server)
[^3]: LiteLLM Docs, *Logging* — callbacks, OpenTelemetry, `turn_off_message_logging`. [https://docs.litellm.ai/docs/proxy/logging](https://docs.litellm.ai/docs/proxy/logging)
