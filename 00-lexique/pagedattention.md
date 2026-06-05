---
title: PagedAttention
description: Technique de gestion du KV Cache par blocs de mémoire virtuelle, popularisée par vLLM.
aliases:
  - Paged Attention
tags:
  - lexique
  - fondations
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Définition courte
Algorithme qui gère la mémoire du [[00-lexique/kv-cache|KV Cache]] par blocs non contigus (comme la mémoire virtuelle d'un OS), réduisant fortement la fragmentation.

## 📖 Définition détaillée
Dans les moteurs classiques, le KV Cache est pré-alloué en blocs contigus en VRAM : les zones non utilisées restent gaspillées. PagedAttention découpe le cache en pages de taille fixe qui peuvent être allouées, libérées et partagées dynamiquement.

Résultat : la fragmentation mémoire passe de ~60 % à moins de 4 % selon les mesures du papier original (Woosuk Kwon et al., SOSP 2023). Cela permet le **Continuous Batching** : les requêtes sont traitées en continu sans vider le serveur entre chaque, maximisant le débit GPU.

## 💡 Pourquoi c'est important en IA on-premise
C'est l'innovation principale qui explique pourquoi vLLM surpasse Ollama en production multi-utilisateurs. Sans PagedAttention, le serveur gaspille de la VRAM et ne peut pas batche efficacement les requêtes concurrentes.

## ⚠️ Pièges fréquents
- Disponible principalement avec vLLM (et quelques moteurs compatibles). Ollama/llama.cpp n'implémentent pas PagedAttention nativement.
- Ne résout pas les contraintes de capacité totale : si le modèle + les caches dépassent la VRAM totale, l'OOM survient quand même.

## 📚 Pour comprendre en profondeur
1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence]] *(pourquoi vLLM > Ollama en production)*
2. [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]] *(le mécanisme du cache que PagedAttention optimise)*

## 🔗 Voir aussi
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/vram|VRAM]]
- [[00-lexique/tokens-per-second|Tokens par seconde]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
