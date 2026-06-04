---
title: 🚀 Index Zero to Hero
description: Le point d'entrée de votre formation sur l'IA On-Premise
---

Bienvenue dans le "Zero to Hero" de l'IA Locale. Ce Vault est conçu comme un jardin numérique : ne le lisez pas de manière linéaire. Suivez vos besoins, cliquez sur les concepts que vous ne maîtrisez pas encore, et construisez votre expertise pas à pas.

> [!tip] L'objectif
> Vous apprendre à dimensionner, déployer et comprendre les infrastructures matérielles et logicielles nécessaires pour faire tourner des modèles d'IA massifs ([[00-lexique/llm|Large Language Models]]) de manière 100% locale, privée et performante.

---

## 🔒 Pourquoi faire tourner l'IA en local ?

Vous utilisez peut-être déjà ChatGPT ou Claude au quotidien. Pourquoi alors se donner la peine d'héberger un modèle soi-même ?

**1. Souveraineté des données**
Chaque prompt envoyé à un service cloud est traité sur des serveurs tiers, souvent hors de l'Union Européenne. Dans un cabinet médical, un service juridique, une administration ou une entreprise industrielle, certaines données ne peuvent légalement pas sortir de vos locaux — RGPD, secret professionnel, classification. L'[[00-lexique/on-premise|IA on-premise]] est la seule réponse technique à cette contrainte. Pour une grille d'audit en 6 critères et le cadre RGPD/AI Act, voir [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|🔒 Souveraineté & Confidentialité]].

**2. Coût prévisible à l'échelle**
Une API cloud facture à la requête. À faible volume, c'est négligeable. À 50 employés qui interrogent un assistant toute la journée, la facture mensuelle peut dépasser le coût d'amortissement d'une machine dédiée en quelques mois.

**3. Contrôle total : modèle, comportement, disponibilité**
En local, vous choisissez le modèle, vous le personnalisez, il fonctionne sans connexion Internet et sa disponibilité ne dépend pas des politiques tarifaires ou des conditions d'utilisation d'un tiers.

> [!tip] Lecture
> Ce vault vous donne les clés pour comprendre ces arbitrages et choisir l'architecture adaptée à votre situation — de la machine de développeur seul jusqu'au cluster datacenter souverain.

---

## 🗺️ Sommaire du Vault

### 📁 01 - Les Fondations (La Physique de l'IA)
*Pour comprendre pourquoi un ordinateur à 4000€ peut être trop lent pour l'IA.*
- [[01-fondations/journey-of-a-prompt|🧠 Le Voyage d'un Prompt (Fonctionnement)]]
- [[01-fondations/memory-bandwidth|🏎️ La Bande Passante Mémoire]] (Memory Bandwidth)
- [[01-fondations/unified-memory-vs-ram-vs-vram|⚔️ Mémoire Unifiée vs RAM vs VRAM]]
- [[01-fondations/kv-cache-and-context|💾 KV Cache et Contexte]]
- [[01-fondations/quantization-4bit-8bit|🗜️ Quantification 4-bit & 8-bit]]

### 📁 02 - Le Matériel (Le Fer)
*Le catalogue des architectures.*
- [[02-materiel/apu-and-unified-memory|🧠 APU & Mémoire Unifiée]] (AMD Strix Halo & Mac)
- [[02-materiel/stations-multi-gpu|🧩 Stations Multi-GPU]] (Nvidia, PCIe)
- [[02-materiel/network-roce-infiniband-thunderbolt|🌐 Réseau IA : RoCE, InfiniBand et Thunderbolt]]

### 📁 03 - La Stack Logicielle (Les Moteurs)
*Comment donner vie aux puces.*
- [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence : vLLM, Ollama et TensorRT-LLM]]
- [[03-stack-logicielle/clustering-exo-and-ray|🌐 Clustering IA : Relier les GPU avec Exo et Ray]]
- [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents : L'architecture de la connaissance]]
- [[03-stack-logicielle/choisir-son-modele|🗺️ Choisir son modèle local]] — familles 2026, tailles, spécialisations, correspondance blueprints

### 📁 04 - Les Blueprints d'Architecture (Scénarios)
*Des configurations prêtes à être proposées à vos clients.*
- [[04-blueprints/scenario-a-dev-lab|🛠️ Scénario A : Le Labo Dev (CPU Offloading)]]
- [[04-blueprints/scenario-b-sme-appliance|🏢 Scénario B : L'Appliance PME (Mémoire Unifiée)]]
- [[04-blueprints/scenario-c-desktop-cluster|🖥️ Scénario C : Le Cluster Bureau (Exo & Thunderbolt)]]
- [[04-blueprints/scenario-d-datacenter|🏭 Scénario D : Datacenter (RoCE & Multi-GPU)]]
- [[04-blueprints/comparaison-scenarios|💰 Comparaison TCO : On-Premise vs Cloud API]] — point de rentabilité par scénario

### 📁 05 - Agents & Assistants On-Premise
*La couche applicative : l'IA qui vous connaît et l'IA qui agit pour vous.*
- [[05-agents-et-assistants-on-prem/index|🤖 Vue d'ensemble : deux pistes, une question de souveraineté]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|🔒 Souveraineté & Confidentialité]] — grille d'audit en 6 critères, RGPD/AI Act
- [[05-agents-et-assistants-on-prem/fondations-communes/possible-architectures|🏗️ Architectures Possibles]] — assistant, custodien, hybride
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 Assistants Personnels (l'IA qui apprend de vos données)]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 Agents Custodiens (l'IA qui maintient votre vault)]]
- [[00-lexique/agent-custodian|Agent custodien]] · [[00-lexique/human-in-the-loop|Human-in-the-loop]] · [[00-lexique/memory-tree|Memory Tree]]

### 📁 06 - Mise en œuvre pratique
*Comment tester et décider avant de déployer.*
- [[06-mise-en-oeuvre/index|🧪 Vue d'ensemble : protocoles pratiques]]
- [[06-mise-en-oeuvre/demarrer-avec-ollama|🚀 Démarrer avec Ollama]] — installation, premier modèle, API, réglages de base
- [[06-mise-en-oeuvre/evaluer-un-modele-local|🧪 Évaluer un modèle local]] — qualité, hallucinations, RAG, agents, KPI et performances
- [[06-mise-en-oeuvre/securite-inference-locale|🔒 Sécurité de l'inférence locale]] — auth API, isolation réseau, OWASP LLM Top 10, agents

---

## 🧭 Quel blueprint choisir ?

*Vous avez un besoin concret ? Ce tableau vous oriente en 30 secondes.*

| Utilisateurs simultanés | Taille de modèle | Budget matériel | → Blueprint |
| :--: | :--: | :--: | :-- |
| 1 (dev / test) | 8–14B | < 3 500 € | [[04-blueprints/scenario-a-dev-lab|🛠️ A — Labo Dev]] |
| 1 (dev / test) | 70B avec offloading | < 3 500 € | [[04-blueprints/scenario-a-dev-lab|🛠️ A — Labo Dev]] *(performances limitées)* |
| 2–20 (PME, équipe) | 70B | 4 000–8 000 € | [[04-blueprints/scenario-b-sme-appliance|🏢 B — Appliance PME]] |
| 2–20 (PME, équipe) | 200B+ / MoE | 10 000–15 000 € | [[04-blueprints/scenario-c-desktop-cluster|🖥️ C — Cluster Bureau]] |
| 50+ (production) | 70B–400B | > 300 000 € | [[04-blueprints/scenario-d-datacenter|🏭 D — Datacenter]] |
| Contrainte SLA < 500 ms | Tout | — | [[04-blueprints/scenario-d-datacenter|🏭 D — Datacenter]] |

> [!tip] Lecture
> Commencez par la ligne qui correspond à votre nombre d'utilisateurs, puis vérifiez que le budget correspond. En cas de doute, lisez d'abord le [[04-blueprints/scenario-a-dev-lab|Scénario A]] pour comprendre les mécanismes, puis remontez vers le scénario cible.

---

## 🚶 Je découvre : par où commencer ?

*Première visite ? Suivez ce chemin avant d'explorer librement :*

1. [[00-lexique/llm|LLM]] *(c'est quoi un grand modèle de langage ?)*
2. [[00-lexique/inference|Inférence (LLM)]] *(comment on l'utilise au quotidien)*
3. [[01-fondations/journey-of-a-prompt|🧠 Le Voyage d'un Prompt]] *(ce qui se passe vraiment quand vous lui parlez)*
4. [[01-fondations/memory-bandwidth|🏎️ La Bande Passante Mémoire]] *(pourquoi votre machine peut ramer)*
5. [[04-blueprints/scenario-a-dev-lab|🛠️ Scénario A : Le Labo Dev]] *(votre premier blueprint concret)*

---

## 📖 Dictionnaire & Concepts
*Retrouvez ici la définition rapide de tous les termes techniques.*
👉 [[00-lexique/ai-glossary|Glossaire IA]]