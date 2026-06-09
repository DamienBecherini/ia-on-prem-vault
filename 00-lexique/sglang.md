---
title: "⚡ SGLang"
description: "Framework open-source d'inférence et de serving LLM, alternative à vLLM pour les workloads agentiques et les sorties structurées."
aliases:
  - Structured Generation Language
tags:
  - lexique
  - stack
sidebar:
  order: 62
last_modified: "2026-06-09"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
---

## 📝 Définition courte

Framework open-source d'inférence et de serving LLM, développé à UC Berkeley / LMSys et publié en 2024[^1]. En 2026, il constitue une alternative crédible à vLLM pour les charges agentiques et les applications exigeant des sorties structurées fiables.

## 📖 Définition détaillée

SGLang (*Structured Generation Language*) est un moteur d'inférence conçu pour les workloads où le LLM appelle des outils en boucle, partage un long contexte commun entre requêtes, ou doit produire du JSON valide à pleine vitesse. Deux mécanismes le distinguent des moteurs orientés débit pur.

### RadixAttention

[[00-lexique/radixattention|RadixAttention]] organise le [[00-lexique/kv-cache|KV Cache]] sous forme d'arbre radix (arbre de préfixes). Lorsque plusieurs requêtes partagent un long préfixe commun — prompt système, contexte RAG récupéré, schéma d'outils — SGLang ne recalcule ce préfixe qu'une fois et le réutilise. L'effet est une réduction notable du [[00-lexique/ttft|TTFT]] dans les boucles agentiques où le LLM enchaîne les appels d'outils avec le même cadre contextuel[^2].

### Génération JSON structurée

SGLang peut contraindre le modèle à produire du JSON conforme à un schéma donné, à vitesse de génération pleine, sans la dégradation de qualité ou de débit typique du *constrained decoding* naïf (rejets token par token, backtracking). C'est un atout pour les APIs backend et les intégrations où le parseur aval exige un format strict.

## 💡 Quand préférer SGLang à vLLM

| Contexte | Choix recommandé |
| :-- | :-- |
| Workloads agentiques avec nombreux appels d'outils et préfixes partagés | **SGLang** |
| Applications exigeant des sorties JSON fiables (APIs, intégrations backend) | **SGLang** |
| Benchmarks de débit pur sous forte concurrence | **vLLM** |
| Compatibilité matérielle la plus large (AMD ROCm, écosystème mature) | **vLLM** |

vLLM reste la référence pour le débit maximal et la compatibilité hardware la plus étendue. SGLang excelle là où la latence de première réponse et la fiabilité des sorties structurées priment sur le throughput brut.

## ⚠️ Pièges fréquents

- Comparer SGLang et vLLM uniquement sur des benchmarks de tokens/s ignore l'avantage RadixAttention sur les boucles agentiques.
- Supposer que la génération JSON contrainte dispense de valider le schéma côté application — un validateur aval reste recommandé.
- Déployer SGLang sans mesurer le [[00-lexique/ttft|TTFT]] réel sur vos préfixes métier : le gain dépend fortement du taux de partage de contexte.

## 📚 Pour comprendre en profondeur

1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]] — comparatif vLLM, Ollama et alternatives
2. [[00-lexique/radixattention|RadixAttention]] — mécanisme de cache par préfixe
3. [[00-lexique/pagedattention|PagedAttention]] — optimisation mémoire complémentaire (vLLM)

## 🔗 Voir aussi

- [[00-lexique/radixattention|RadixAttention]]
- [[00-lexique/pagedattention|PagedAttention]]
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: SGLang — dépôt officiel GitHub. [https://github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)
[^2]: LMSys, *Fast and Expressive LLM Inference with RadixAttention*, janvier 2024. [https://lmsys.org/blog/2024-01-17-sglang/](https://lmsys.org/blog/2024-01-17-sglang/)
