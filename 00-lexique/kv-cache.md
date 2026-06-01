---
title: KV Cache
description: Cache des clés/valeurs d'attention utilisé pendant la génération.
aliases:
  - Key-Value Cache
  - Cache KV
tags:
  - lexique
  - fondations
---

# KV Cache

## Définition courte
Mémoire qui conserve les états d'attention déjà calculés pour éviter des recomputations coûteuses.

## Définition détaillée
Dans un Transformer, chaque nouveau token réutilise les clés/valeurs des tokens précédents.
Le KV cache accélère cette réutilisation, mais augmente la consommation mémoire avec la longueur de contexte.

## Pourquoi c'est important en IA on-premise
Il influence fortement la capacité de contexte pratique et la stabilité des performances sur longues conversations.

## Voir aussi
- [[00-lexique/fenetre-de-contexte]]
- [[00-lexique/decoding]]
- [[00-lexique/glossaire-ia|Glossaire IA]]
