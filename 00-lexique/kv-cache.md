---
title: KV Cache
description: Cache des clés/valeurs d'attention utilisé pendant la génération.
aliases:
  - Key-Value Cache
  - Cache KV
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
Mémoire qui conserve les états d'attention déjà calculés pour éviter des recomputations coûteuses.

## 📖 Définition détaillée
Dans un Transformer, chaque nouveau token réutilise les clés/valeurs des tokens précédents.
Le KV cache accélère cette réutilisation, mais augmente la consommation mémoire avec la longueur de contexte.

## 💡 Pourquoi c'est important en IA on-premise
Il influence fortement la capacité de contexte pratique et la stabilité des performances sur longues conversations.

## 🔬 Ce n'est pas de la magie (Le mécanisme)
À chaque token généré, le modèle a besoin de consulter tout le contexte passé. Plutôt que de recalculer l'historique depuis le début (coût quadratique), il sauvegarde les états intermédiaires (clés et valeurs des couches d'attention) calculés pendant le prefill. C'est du stockage de résultats de calcul matriciel — en VRAM.

## 📚 Pour comprendre en profondeur
*Vous voulez comprendre pourquoi ce cache peut saturer votre machine ?*
1. [[01-fondations/journey-of-a-prompt|🧠 Le Voyage d'un Prompt]] *(Étape 4 : comment le KV cache est rempli pendant le prefill)*
2. [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]] *(le chapitre complet : formule, GQA, PagedAttention)*
3. [[01-fondations/memory-bandwidth|🏎️ La Bande Passante Mémoire]] *(pourquoi la taille du cache ralentit la génération)*

## 🔗 Voir aussi
- [[00-lexique/context-window|Fenêtre de contexte]]
- [[00-lexique/decoding|Decoding]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]
