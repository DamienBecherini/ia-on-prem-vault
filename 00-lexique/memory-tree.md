---
title: Memory Tree
description: Architecture mémoire qui organise documents et résumés en arbre hiérarchique pour limiter le contexte injecté au LLM.
aliases:
  - Memory Trees
  - Arbre de mémoire
tags:
  - lexique
  - rag
  - agents
---

## 📝 Définition courte

Pattern de mémoire longue où les documents sont découpés, résumés et organisés en arbre hiérarchique afin que l'agent ne charge que les nœuds utiles dans le contexte.

## 📖 Définition détaillée

Un Memory Tree remplace ou complète une base vectorielle classique. Au lieu de chercher seulement des chunks proches d'une question, l'agent parcourt une hiérarchie : titres, résumés courts, sous-résumés, puis contenu exact si nécessaire.

L'intérêt est de réduire la quantité de tokens injectés et donc la pression sur la [[00-lexique/context-window|fenêtre de contexte]] et le [[00-lexique/kv-cache|KV Cache]].

## 💡 Pourquoi c'est important en IA on-premise

Sur une machine locale, la VRAM et la bande passante mémoire sont limitées. Un Memory Tree aide à garder un contexte court, ce qui réduit le [[00-lexique/ttft|TTFT]] et évite de saturer le serveur avec des documents entiers.

## ⚠️ Pièges fréquents

- Croire qu'un Memory Tree remplace tous les usages d'une base vectorielle.
- Faire confiance à des résumés obsolètes si l'arbre n'est pas régénéré.
- Oublier de citer le document source exact après navigation dans l'arbre.

## 📚 Pour comprendre en profondeur

1. [[03-stack-logicielle/rag-and-agents|RAG & Agents : l'approche Memory Tree]]
2. [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] *(exemple de Memory Tree local-first mais hybride cloud par défaut)*

## 🔗 Voir aussi

- [[00-lexique/rag|RAG]]
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/context-window|Fenêtre de contexte]]
