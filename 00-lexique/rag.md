---
title: RAG
description: Architecture qui combine recherche documentaire et génération LLM pour ancrer les réponses dans des sources internes.
aliases:
  - Retrieval-Augmented Generation
tags:
  - lexique
  - stack
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Méthode qui **récupère** des passages pertinents dans une base documentaire, puis **génère** une réponse avec un [[00-lexique/llm|LLM]] enrichi de ce contexte[^1].

## 📖 Définition détaillée

Le RAG (*Retrieval-Augmented Generation*) sépare deux phases :

1. **Retrieval** — requête → [[00-lexique/embedding|embeddings]] → recherche de similarité dans une [[00-lexique/vectordb|base vectorielle]] (ou hybride BM25 + vecteurs).
2. **Generation** — concaténation prompt système + chunks récupérés + question utilisateur → réponse du modèle.

Variantes couvertes dans le vault : **Agentic RAG** (boucles retrieve/grade/rewrite), [[00-lexique/graphrag|GraphRAG]], [[00-lexique/memory-tree|Memory Tree]] pour contextes longs.

## 💡 Pourquoi c'est important en IA on-premise

- Exploite la connaissance **interne** sans réentraîner le modèle — adapté aux contraintes RGPD et souveraineté.
- Réduit les hallucinations **si** le retrieval est bon ; ne les élimine pas (voir pièges).
- Couplé au [[00-lexique/multi-tenant|multi-tenant]], exige une isolation stricte des index (OWASP LLM08).

## ⚠️ Pièges fréquents

- **Chunking naïf** : morceaux trop grands ou coupés au milieu d'une phrase → retrieval inutile.
- **Confondre RAG et sécurité** : un document empoisonné peut provoquer une [[00-lexique/prompt-injection|prompt injection]] indirecte.
- **Ignorer l'évaluation** : mesurer retrieval + fidélité ([[00-lexique/ragas|RAGAS]], golden dataset) — voir [[06-mise-en-oeuvre/evaluate-local-model|évaluer un modèle local]].
- **Surdimensionner le modèle** pour compenser un mauvais index : optimiser d'abord embeddings et re-ranking.

## 📚 Pour comprendre en profondeur

1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] — architecture complète 2026
2. [[06-mise-en-oeuvre/evaluate-local-model|🧪 Évaluer un modèle local]]
3. [[00-lexique/langgraph|LangGraph]] — orchestration agentique

## 🔗 Voir aussi

- [[00-lexique/vectordb|Base de données vectorielle]]
- [[00-lexique/graphrag|GraphRAG]]
- [[00-lexique/prompt-injection|Prompt injection]]
- [[00-lexique/appel-outils|Appel d'outils]]
- [[00-lexique/context-window|Fenêtre de contexte]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: Lewis et al., *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks* (NeurIPS 2020). [https://arxiv.org/abs/2005.11401](https://arxiv.org/abs/2005.11401)
