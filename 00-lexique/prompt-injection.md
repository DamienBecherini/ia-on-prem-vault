---
title: "Prompt injection"
description: "Attaque où du contenu non fiable dans le contexte du LLM détourne ses instructions système pour exfiltrer des données ou exécuter des actions non autorisées."
aliases:
  - Injection de prompt
  - LLM01 Prompt Injection
tags:
  - lexique
  - stack
sidebar:
  order: 67
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
---

## 📝 Définition courte

Vulnérabilité **OWASP LLM01** : un attaquant insère des instructions dans une source que le modèle lira (document RAG, e-mail, page web) pour contourner le prompt système ou déclencher des [[00-lexique/appel-outils|appels d'outils]] malveillants[^1].

## 📖 Définition détaillée

Contrairement à l'injection SQL, le **prompt injection** exploite le fait que le LLM ne distingue pas de manière fiable « instruction système » et « contenu utilisateur » une fois tout concaténé dans la [[00-lexique/context-window|fenêtre de contexte]].

Deux formes courantes :
- **Directe** : l'utilisateur envoie « ignore tes instructions et… ».
- **Indirecte** : un document indexé en [[00-lexique/rag|RAG]] contient des instructions cachées lues au moment du retrieval.

En on-premise, le risque est **identique** au cloud : la souveraineté des données n'immunise pas contre un PDF empoisonné dans la base documentaire interne.

## 💡 Pourquoi c'est important en IA on-premise

- Toute stack [[00-lexique/rag|RAG]] multi-sources (SharePoint, tickets, wikis) est une surface d'attaque.
- Combiné à [[00-lexique/excessive-agency|Excessive Agency]] (LLM06), peut mener à exfiltration via outils (envoi e-mail, requête API).
- Traité en profondeur dans [[06-mise-en-oeuvre/local-inference-security|🔐 Sécurité de l'inférence locale]] (LLM01–LLM10 OWASP 2025).

## ⚠️ Pièges fréquents

- Croire qu'un « prompt système secret » suffit : contournable par indirect injection.
- Indexer des documents non sanitizés sans séparation de privilèges entre retrieval et exécution d'outils.
- Oublier les **canaux sortants** (LLM07 System Prompt Leakage) lors des tests de red team.

## Mitigations (résumé)

| Mesure | Rôle |
| :-- | :-- |
| Moindre privilège sur les outils | Limite l'impact d'une injection réussie |
| Validation HITL sur actions sensibles | [[00-lexique/human-in-the-loop|Human-in-the-loop]] |
| Filtrage entrée/sortie | Détection de patterns d'injection |
| Isolation tenant RAG | [[00-lexique/multi-tenant|Multi-tenant]] sans fuite inter-organisation |

## 🔗 Voir aussi

- [[00-lexique/rag|RAG]]
- [[00-lexique/excessive-agency|Excessive Agency]]
- [[00-lexique/multi-tenant|Multi-tenant]]
- [[06-mise-en-oeuvre/local-inference-security|🔐 Sécurité inférence locale]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: OWASP GenAI Security Project, *LLM01:2025 Prompt Injection*. [https://genai.owasp.org/llm-top-10/](https://genai.owasp.org/llm-top-10/)
