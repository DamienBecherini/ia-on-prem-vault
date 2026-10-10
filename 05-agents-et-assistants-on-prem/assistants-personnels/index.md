---
title: "🧑‍💼 Assistants Personnels On-Premise"
description: >
  Comparatif des assistants IA locaux qui apprennent de vos données — évalués sur la souveraineté réelle,
  le contrôle du modèle et la persistance de la mémoire.
sidebar:
  order: 1
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
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
| Mémoire longue sur documents personnels | Vault Markdown / notes, pas seulement des fichiers | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] (maintenance ralentie depuis mars 2026)[^1] | ⚠️ configurable |
| Interface web multi-modèles | Plusieurs utilisateurs, plusieurs moteurs | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] | ⚠️ configurable |
| Connaissance d'entreprise + agents | RAG structuré + workflows | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] | ⚠️ configurable |
| Agent multi-canaux avec mémoire hébergée et mode local-only | Accepter une mémoire hors machine, ou opérer son propre CortexDB | [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] | ⚠️ configurable |

> [!tip] Lecture rapide
> Si vous voulez démarrer sans risque de cloud involontaire, commencez par Jan.ai. Si vous voulez une interface d'équipe, regardez Open WebUI. Si vous voulez RAG + workflows, comparez AnythingLLM et Khoj. OpenHuman a abandonné son [[00-lexique/memory-tree|Memory Tree]] local au profit d'une mémoire hébergée (CortexDB) ; il reste intéressant pour son mode Privacy local-only appliqué dans le code, mais sa mémoire ne reste sur site que si vous opérez votre propre CortexDB.

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

- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/openhuman|OpenHuman]] — harness d'agent Rust, mémoire hébergée par défaut, mode local-only
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/open-webui|Open WebUI]] — portail web self-hosted pour Ollama/vLLM et équipes
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] — RAG, workspaces et agents dans une application all-in-one
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai|Jan.ai]] — desktop local/offline, serveur API local
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] — second cerveau self-hostable, documents, web et agents

Deux outils apparus en 2026 ne font pas (encore) l'objet d'une fiche : **LM Studio Bionic** (juillet 2026), application d'agent « pour modèles ouverts » du même éditeur que LM Studio — logiciel propriétaire, modèles locaux via le runtime LM Studio, avec un chemin cloud optionnel (compte et facturation requis, zéro rétention de données annoncée) : à traiter comme un produit freemium à chemin cloud[^2] ; et **Pipali** (équipe Khoj, Apache-2.0, 0.10.0 en septembre 2026), un « co-worker » de bureau orienté actions (fichiers, web, Jira/Linear/Slack via MCP) dont la fiche met en avant des modèles cloud via sa plateforme ; le support de modèles locaux n'a pas été vérifié[^3].

---

## 🔗 Voir aussi

- [[05-agents-et-assistants-on-prem/index|🤖 Vue d'ensemble : Agents & Assistants]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 Agents Custodiens — l'IA qui agit pour vous]]
- [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents : L'architecture de la connaissance]]

## 📚 Sources

[^1]: khoj-ai, *khoj* — Releases (dernière version 2.0.0-beta.28 du 2026-03-26) et historique des commits (dernier commit le 2026-08-02), consultés le 2026-10-10. [https://github.com/khoj-ai/khoj/releases](https://github.com/khoj-ai/khoj/releases) · [https://github.com/khoj-ai/khoj/commits/master](https://github.com/khoj-ai/khoj/commits/master)
[^2]: LM Studio, *Introducing LM Studio Bionic* (agent pour modèles ouverts, modèles locaux via le runtime LM Studio, modèles cloud avec compte et facturation, engagement Zero Data Retention), 2026-07-16. [https://lmstudio.ai/blog/introducing-lm-studio-bionic](https://lmstudio.ai/blog/introducing-lm-studio-bionic)
[^3]: khoj-ai, *pipali* (dépôt GitHub : Apache-2.0, release 0.10.0 du 2026-09-14, modèles cloud via la plateforme Pipali, intégrations MCP), consulté le 2026-10-10. [https://github.com/khoj-ai/pipali](https://github.com/khoj-ai/pipali)
