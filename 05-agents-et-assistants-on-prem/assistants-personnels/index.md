---
title: "🧑‍💼 Assistants Personnels On-Premise"
description: >
  Comparatif des assistants IA locaux qui apprennent de vos données — évalués sur la souveraineté réelle,
  le contrôle du modèle et la persistance de la mémoire.
sidebar:
  order: 1
---

Un assistant personnel local vous permet d'interagir avec un LLM **qui connaît votre contexte** — vos notes, vos documents, l'historique de vos échanges — sans envoyer ces données à un service tiers.

Le défi : beaucoup de logiciels présentent une interface locale tout en routant silencieusement les requêtes vers un modèle cloud. Cette page vous aide à faire la différence.

---

## 🧭 Tableau de décision rapide

*Identifiez votre priorité principale, puis suivez la ligne correspondante.*

| Priorité | Contrainte | Outil recommandé |
|----------|-----------|-----------------|
| Souveraineté native, zéro cloud | Tout doit rester sur machine, mode offline requis | [Jan.ai](solutions/jan-ai) |
| Mémoire longue sur documents personnels | Vault Markdown / notes, pas seulement des fichiers | [Khoj](solutions/khoj) |
| Interface web multi-modèles | Plusieurs utilisateurs, plusieurs moteurs | [Open WebUI](solutions/open-webui) |
| Connaissance d'entreprise + agents | RAG structuré + workflows | [AnythingLLM](solutions/anythingllm) |
| Mémoire + Memory Tree hybride | Approche doc-first, acceptable si configuré souverain | [OpenHuman](solutions/openhuman) |

> ⚠️ Ce tableau sera mis à jour au fil de la rédaction des fiches solution. Les recommandations ci-dessus sont provisoires — basées sur la réputation connue des projets, pas encore sur l'audit détaillé de Phase 3.

---

## 📋 Critères d'évaluation communs

Chaque fiche solution de cette section évalue le projet selon les mêmes 6 critères :

1. **Localisation des données** — vos fichiers restent-ils sur votre machine ?
2. **Routage du modèle** — l'inférence se fait-elle localement (Ollama, llama.cpp) ou via une API cloud ?
3. **Mémoire persistante** — l'assistant mémorise-t-il votre contexte entre les sessions ? Où stocke-t-il cela ?
4. **Télémétrie** — le logiciel envoie-t-il des métriques, logs ou prompts à ses serveurs ?
5. **Mode offline** — fonctionne-t-il sans connexion Internet ?
6. **Verdict souveraineté** — ✅ souverain natif / ⚠️ configurable / ❌ incompatible on-prem strict

La grille complète et le protocole d'audit sont détaillés dans [[05-agents-et-assistants-on-prem/fondations-communes/souverainete-et-confidentialite|Souveraineté & Confidentialité]] *(à venir — Phase 2)*.

---

## 📂 Fiches solution

> ⚠️ Les fiches ci-dessous sont en cours de rédaction (Phase 3 du plan). Les liens marqués *(à venir)* seront activés à l'issue de la phase.

- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] *(à venir)*
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai|Jan.ai]] *(à venir)*
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] *(à venir)*
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] *(à venir)*
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] *(à venir)*

---

## 🔗 Voir aussi

- [[05-agents-et-assistants-on-prem/index|🤖 Vue d'ensemble : Agents & Assistants]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 Agents Custodiens — l'IA qui agit pour vous]]
- [[03-stack-logicielle/rag-et-agents-openhuman|🧩 RAG & Agents : L'architecture de la connaissance]]
