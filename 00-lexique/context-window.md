---
title: Fenêtre de contexte
description: Quantité maximale de tokens pris en compte par le modèle.
aliases:
  - Context window
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Nombre maximal de tokens qu'un modèle peut considérer sur une requête.

## 📖 Définition détaillée
Plus la fenêtre est grande, plus le modèle peut intégrer d'historique/documentation.
Mais le coût mémoire et le temps de traitement augmentent, notamment via le KV cache.

## 💡 Pourquoi c'est important en IA on-premise
Elle impacte directement la capacité à traiter des documents longs et la stabilité des performances.

## ⚠️ Pièges fréquents
- Croire qu'une très grande fenêtre garantit toujours une meilleure qualité de réponse.
- Sous-estimer le coût mémoire du contexte long sur les machines locales.

## 🔗 Voir aussi
- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/rag|RAG]]
