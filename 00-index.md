---
title: 🚀 Index Zero to Hero
description: Le point d'entrée de votre formation sur l'IA On-Premise
---

Bienvenue dans le "Zero to Hero" de l'IA Locale. Ce Vault est conçu comme un jardin numérique : ne le lisez pas de manière linéaire. Suivez vos besoins, cliquez sur les concepts que vous ne maîtrisez pas encore, et construisez votre expertise pas à pas.

> **L'objectif :** Vous apprendre à dimensionner, déployer et comprendre les infrastructures matérielles et logicielles nécessaires pour faire tourner des modèles d'IA massifs ([[00-lexique/llm|Large Language Models]]) de manière 100% locale, privée et performante.

---

## 🔒 Pourquoi faire tourner l'IA en local ?

Vous utilisez peut-être déjà ChatGPT ou Claude au quotidien. Pourquoi alors se donner la peine d'héberger un modèle soi-même ?

**1. Souveraineté des données**
Chaque prompt envoyé à un service cloud est traité sur des serveurs tiers, souvent hors de l'Union Européenne. Dans un cabinet médical, un service juridique, une administration ou une entreprise industrielle, certaines données ne peuvent légalement pas sortir de vos locaux — RGPD, secret professionnel, classification. L'[[00-lexique/on-premise|IA on-premise]] est la seule réponse technique à cette contrainte.

**2. Coût prévisible à l'échelle**
Une API cloud facture à la requête. À faible volume, c'est négligeable. À 50 employés qui interrogent un assistant toute la journée, la facture mensuelle peut dépasser le coût d'amortissement d'une machine dédiée en quelques mois.

**3. Contrôle total : modèle, comportement, disponibilité**
En local, vous choisissez le modèle, vous le personnalisez, il fonctionne sans connexion Internet et sa disponibilité ne dépend pas des politiques tarifaires ou des conditions d'utilisation d'un tiers.

> 🧭 Ce vault vous donne les clés pour comprendre ces arbitrages et choisir l'architecture adaptée à votre situation — de la machine de développeur seul jusqu'au cluster datacenter souverain.

---

## 🗺️ Sommaire du Vault

### 📁 01 - Les Fondations (La Physique de l'IA)
*Pour comprendre pourquoi un ordinateur à 4000€ peut être trop lent pour l'IA.*
- [[01-fondations/le-voyage-d-un-prompt|🧠 Le Voyage d'un Prompt (Fonctionnement)]]
- [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire]] (Memory Bandwidth)
- [[01-fondations/memoire-unifiee-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]
- [[01-fondations/kv-cache-et-contexte|💾 KV Cache et Contexte]]
- [[01-fondations/quantification-4-bit-8-bit|🗜️ Quantification 4-bit & 8-bit]]

### 📁 02 - Le Matériel (Le Fer)
*Le catalogue des architectures.*
- [[02-materiel/apu-et-memoire-unifiee|🧠 APU & Mémoire Unifiée]] (AMD Strix Halo & Mac)
- [[02-materiel/stations-multi-gpu|🧩 Stations Multi-GPU]] (Nvidia, PCIe)
- [[02-materiel/reseau-ia-roce-et-thunderbolt|🌐 Réseau IA : RoCE, InfiniBand et Thunderbolt]]

### 📁 03 - La Stack Logicielle (Les Moteurs)
*Comment donner vie aux puces.*
- [[03-stack-logicielle/moteurs-inference-vllm-ollama|⚙️ Moteurs d'Inférence : vLLM, Ollama et TensorRT-LLM]]
- [[03-stack-logicielle/clustering-exo-et-ray|🌐 Clustering IA : Relier les GPU avec Exo et Ray]]
- [[03-stack-logicielle/rag-et-agents-openhuman|🧩 RAG & Agents : L'architecture de la connaissance]]

### 📁 04 - Les Blueprints d'Architecture (Scénarios)
*Des configurations prêtes à être proposées à vos clients.*
- [[04-blueprints/scenario-a-labo-dev|🛠️ Scénario A : Le Labo Dev (CPU Offloading)]]
- [[04-blueprints/scenario-b-pme-appliance|🏢 Scénario B : L'Appliance PME (Mémoire Unifiée)]]
- [[04-blueprints/scenario-c-cluster-bureau|🖥️ Scénario C : Le Cluster Bureau (Exo & Thunderbolt)]]
- [[04-blueprints/scenario-d-datacenter|🏭 Scénario D : Datacenter (RoCE & Multi-GPU)]]

### 📁 05 - Agents & Assistants On-Premise *(en construction)*
*La couche applicative : l'IA qui vous connaît et l'IA qui agit pour vous.*
- [[05-agents-et-assistants-on-prem/index|🤖 Vue d'ensemble : deux pistes, une question de souveraineté]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 Assistants Personnels (l'IA qui apprend de vos données)]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 Agents Custodiens (l'IA qui maintient votre vault)]]

---

## 🧭 Quel blueprint choisir ?

*Vous avez un besoin concret ? Ce tableau vous oriente en 30 secondes.*

| Utilisateurs simultanés | Taille de modèle | Budget matériel | → Blueprint |
| :--: | :--: | :--: | :-- |
| 1 (dev / test) | 8–14B | < 3 500 € | [[04-blueprints/scenario-a-labo-dev|🛠️ A — Labo Dev]] |
| 1 (dev / test) | 70B avec offloading | < 3 500 € | [[04-blueprints/scenario-a-labo-dev|🛠️ A — Labo Dev]] *(performances limitées)* |
| 2–20 (PME, équipe) | 70B | 4 000–8 000 € | [[04-blueprints/scenario-b-pme-appliance|🏢 B — Appliance PME]] |
| 2–20 (PME, équipe) | 200B+ / MoE | 10 000–15 000 € | [[04-blueprints/scenario-c-cluster-bureau|🖥️ C — Cluster Bureau]] |
| 50+ (production) | 70B–400B | > 300 000 € | [[04-blueprints/scenario-d-datacenter|🏭 D — Datacenter]] |
| Contrainte SLA < 500 ms | Tout | — | [[04-blueprints/scenario-d-datacenter|🏭 D — Datacenter]] |

> 💡 **Lecture :** Commencez par la ligne qui correspond à votre nombre d'utilisateurs, puis vérifiez que le budget correspond. En cas de doute, lisez d'abord le [[04-blueprints/scenario-a-labo-dev|Scénario A]] pour comprendre les mécanismes, puis remontez vers le scénario cible.

---

## 🚶 Je découvre : par où commencer ?

*Première visite ? Suivez ce chemin avant d'explorer librement :*

1. [[00-lexique/llm|LLM]] *(c'est quoi un grand modèle de langage ?)*
2. [[00-lexique/inference|Inférence (LLM)]] *(comment on l'utilise au quotidien)*
3. [[01-fondations/le-voyage-d-un-prompt|🧠 Le Voyage d'un Prompt]] *(ce qui se passe vraiment quand vous lui parlez)*
4. [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire]] *(pourquoi votre machine peut ramer)*
5. [[04-blueprints/scenario-a-labo-dev|🛠️ Scénario A : Le Labo Dev]] *(votre premier blueprint concret)*

---

## 📖 Dictionnaire & Concepts
*Retrouvez ici la définition rapide de tous les termes techniques.*
👉 [[00-lexique/glossaire-ia|Glossaire IA]]