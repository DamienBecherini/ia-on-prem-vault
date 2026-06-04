---
title: "🤖 Agents & Assistants On-Premise"
description: >
  Vue d'ensemble de la couche applicative de l'IA locale : assistants personnels qui apprennent de vos données,
  et agents custodiens qui agissent pour vous — évalués sous le prisme de la souveraineté.
sidebar:
  order: 1
---

Vous avez le matériel. Vous avez le moteur d'inférence. La question suivante est inévitable :

> *"Qu'est-ce que je mets par-dessus ?"*

Cette section répond à cette question en distinguant deux types d'outils complémentaires, que la plupart des architectures on-premise finissent par combiner.

---

## 🗺️ Les deux pistes

### 🧑‍💼 Piste A — Assistants Personnels
*L'IA qui vous connaît.*

Un assistant personnel local est un logiciel qui :
- mémorise vos documents, vos notes, votre contexte de travail ;
- permet de lui poser des questions sur **vos propres données** ;
- fonctionne — idéalement — sans jamais envoyer vos informations à l'extérieur.

👉 [[05-agents-et-assistants-on-prem/assistants-personnels/index|Comparer les assistants personnels →]]

---

### 🤖 Piste B — Agents Custodiens
*L'IA qui agit pour vous.*

Un agent custodien est un agent autonome qui :
- s'exécute sur déclencheur (planifié ou événementiel) ;
- maintient un vault, audite du code, propose des corrections sourcées en branches/PRs ;
- **attend la validation humaine** avant tout changement irréversible.

👉 [[05-agents-et-assistants-on-prem/agents-custodiens/index|Découvrir les agents custodiens →]]

---

## ❓ La question qui précède tout

Avant d'évaluer n'importe quel outil de cette section, une question s'impose :

> **Ce logiciel fait-il vraiment tourner le modèle en local, ou délègue-t-il discrètement à un backend cloud ?**

L'interface peut être locale, la page marketing peut dire "privacy-first", et pourtant le modèle peut tourner sur les serveurs du prestataire. Ce piège est fréquent — et souvent non documenté en première page.

La [[05-agents-et-assistants-on-prem/fondations-communes/souverainete-et-confidentialite|grille d'évaluation souveraineté]] *(à venir — Phase 2)* donne un protocole en 6 critères pour auditer n'importe quel outil en moins de 15 minutes.

---

## 🔗 Prérequis recommandés

Avant d'explorer cette section, les chapitres suivants vous donnent le contexte matériel et logiciel :

- [[03-stack-logicielle/rag-et-agents-openhuman|🧩 RAG & Agents : L'architecture de la connaissance]] — les patterns Memory Tree, Agentic RAG et GraphRAG
- [[04-blueprints/scenario-a-labo-dev|🛠️ Blueprint A]] · [[04-blueprints/scenario-b-pme-appliance|🏢 B]] · [[04-blueprints/scenario-c-cluster-bureau|🖥️ C]] · [[04-blueprints/scenario-d-datacenter|🏭 D]] — dimensionner le matériel en fonction de l'usage
- [[00-lexique/agent-autonome|Agent autonome]] · [[00-lexique/rag|RAG]] · [[00-lexique/smolagents|SmolAgents]] — les concepts du lexique
