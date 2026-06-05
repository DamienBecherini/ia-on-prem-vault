---
title: TTFT
description: Time To First Token.
aliases:
  - Time To First Token
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
Temps entre l'envoi d'une requête et l'arrivée du premier token de réponse.

## 📖 Définition détaillée
Le TTFT reflète principalement la latence du prefill, l'initialisation du contexte et les surcoûts runtime.
Il complète la métrique tokens/s : on peut avoir un bon débit mais un mauvais démarrage.

## 💡 Pourquoi c'est important en IA on-premise
Pour les usages interactifs, le ressenti dépend fortement du TTFT.

## ⚠️ Pièges fréquents
- Mesurer uniquement les tokens/s et oublier le temps avant le premier mot.
- Comparer des TTFT sans préciser la longueur du prompt d'entrée.

## 🔗 Voir aussi
- [[00-lexique/prefill|Prefill]]
- [[00-lexique/tokens-per-second|Tokens par seconde]]
- [[00-lexique/context-window|Fenêtre de contexte]]
