---
title: "🧑‍💼 Assistants Personnels On-Premise"
description: >
  Comparatif des assistants IA locaux qui apprennent de vos données — évalués sur la souveraineté réelle,
  le contrôle du modèle et la persistance de la mémoire.
sidebar:
  order: 1
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

Un assistant personnel local vous permet d'interagir avec un LLM **qui connaît votre contexte** — vos notes, vos documents, l'historique de vos échanges — sans envoyer ces données à un service tiers.

Le défi : beaucoup de logiciels présentent une interface locale tout en routant silencieusement les requêtes vers un modèle cloud. Cette page vous aide à faire la différence.

---

## 🧭 Tableau de décision rapide

*Identifiez votre priorité principale, puis suivez la ligne correspondante.*

| Priorité | Contrainte | Outil recommandé | Verdict |
|----------|-----------|-----------------|---------|
| Souveraineté native, zéro cloud | Tout doit rester sur machine, mode offline requis | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai|Jan.ai]] | ✅ natif |
| Mémoire longue sur documents personnels | Vault Markdown / notes, pas seulement des fichiers | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] | ⚠️ configurable |
| Interface web multi-modèles | Plusieurs utilisateurs, plusieurs moteurs | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] | ⚠️ configurable |
| Connaissance d'entreprise + agents | RAG structuré + workflows | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] | ⚠️ configurable |
| Mémoire + [[00-lexique/memory-tree|Memory Tree]] hybride | Approche doc-first, acceptable si configuré souverain | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] | ⚠️ configurable |

> [!tip] Lecture rapide
> Si vous voulez démarrer sans risque de cloud involontaire, commencez par Jan.ai. Si vous voulez une interface d'équipe, regardez Open WebUI. Si vous voulez RAG + workflows, comparez AnythingLLM et Khoj. OpenHuman est surtout intéressant pour son architecture [[00-lexique/memory-tree|Memory Tree]], mais doit être configuré explicitement pour une posture souveraine.

---

## 📋 Critères d'évaluation communs

Chaque fiche solution de cette section évalue le projet selon les mêmes 6 critères :

1. **Localisation des données** — vos fichiers restent-ils sur votre machine ?
2. **Routage du modèle** — l'inférence se fait-elle localement (Ollama, llama.cpp) ou via une API cloud ?
3. **Mémoire persistante** — l'assistant mémorise-t-il votre contexte entre les sessions ? Où stocke-t-il cela ?
4. **Télémétrie** — le logiciel envoie-t-il des métriques, logs ou prompts à ses serveurs ?
5. **Mode offline** — fonctionne-t-il sans connexion Internet ?
6. **Verdict souveraineté** — ✅ souverain natif / ⚠️ configurable / ❌ incompatible on-prem strict

La grille complète et le protocole d'audit sont détaillés dans [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]].

---

## 📂 Fiches solution

- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] — Memory Tree local-first, backend managé par défaut
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] — portail web self-hosted pour Ollama/vLLM et équipes
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] — RAG, workspaces et agents dans une application all-in-one
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai|Jan.ai]] — desktop local/offline, serveur API local
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] — second cerveau self-hostable, documents, web et agents

---

## 🔗 Voir aussi

- [[05-agents-et-assistants-on-prem/index|🤖 Vue d'ensemble : Agents & Assistants]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 Agents Custodiens — l'IA qui agit pour vous]]
- [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents : L'architecture de la connaissance]]
