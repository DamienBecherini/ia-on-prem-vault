---
title: On-Premise (IA)
description: Infrastructure IA hébergée et opérée sur les équipements propres de l'organisation, sans délégation à un fournisseur cloud.
aliases:
  - On-Prem
  - IA locale
  - Local AI
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Déploiement d'un modèle d'IA directement sur les machines de l'organisation — pas sur les serveurs d'un prestataire cloud comme AWS, Azure ou Google.

## 📖 Définition détaillée
"On-premise" (littéralement "sur site") désigne toute infrastructure informatique physiquement présente dans les locaux de l'organisation ou dans un datacenter qu'elle contrôle, par opposition au *cloud* où les ressources sont louées à un tiers.

Appliqué à l'IA, cela signifie que le modèle [[00-lexique/llm|LLM]] tourne sur du matériel appartenant à l'organisation : un PC de bureau, un serveur rack, un cluster de GPU. Les données ne quittent jamais ce périmètre maîtrisé.

L'[[00-lexique/inference|inférence]] on-premise peut être réalisée avec des outils open-source (Ollama, vLLM, llama.cpp) sans abonnement ni facturation à la requête.

## 💡 Pourquoi c'est important

Trois motivations principales orientent ce choix :

**Conformité réglementaire** — RGPD (données personnelles de résidents UE), secret médical, secret professionnel, normes sectorielles (HDS, ISO 27001, ANSSI) peuvent interdire l'envoi de certaines données vers des serveurs tiers. L'IA on-premise est la seule réponse technique à ces contraintes.

**Économie à l'échelle** — Les API cloud facturent au token. Au-delà d'un seuil d'utilisation intensive (typiquement une équipe de 20–50 personnes en usage quotidien), le coût d'amortissement d'une machine dédiée devient inférieur à la facture mensuelle cloud.

**Autonomie et personnalisation** — Choix libre du modèle, fonctionnement hors ligne, pas de dépendance aux conditions d'utilisation ou aux hausses tarifaires d'un fournisseur.

## ⚠️ Pièges fréquents
- Sous-estimer la complexité opérationnelle : mettre en production un LLM on-premise nécessite des compétences en administration système, réseau et MLOps.
- Penser que "on-premise" = gratuit : le matériel, l'électricité, la maintenance et les compétences humaines ont un coût réel.
- Comparer la performance d'un modèle 7B local à GPT-4 — le choix du modèle est aussi important que l'architecture d'hébergement.

## 📚 Pour aller plus loin
1. [[00-lexique/llm|LLM]] *(qu'est-ce qu'un modèle de langage ?)*
2. [[00-lexique/inference|Inférence (LLM)]] *(comment un LLM génère une réponse)*
3. [[04-blueprints/scenario-a-labo-dev|🛠️ Scénario A]] *(premier déploiement on-premise concret)*

## 🔗 Voir aussi
- [[00-lexique/llm|LLM]]
- [[00-lexique/inference|Inférence (LLM)]]
- [[00-lexique/rag|RAG]]
- [[00-lexique/glossaire-ia|📖 Glossaire IA]]
