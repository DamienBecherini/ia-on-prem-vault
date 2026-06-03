---
title: Inférence (LLM)
description: Utilisation d'un modèle entraîné pour générer du texte à la demande.
aliases:
  - Inférence LLM
  - Inference
tags:
  - lexique
  - fondations
---


## 📝 Définition courte
Phase où un [[00-lexique/llm|LLM]] déjà entraîné produit une réponse à partir d'un prompt, token par token.

## 📖 Définition détaillée
On distingue l'**entraînement** (apprentissage des poids sur de vastes corpus) et l'**inférence** (exécution du modèle pour répondre). En IA on-premise, l'inférence locale est le cas dominant : Ollama, llama.cpp, vLLM, etc.

Une requête se décompose en deux phases : le [[00-lexique/prefill|Prefill]] (traitement du prompt) puis le [[00-lexique/decoding|Decoding]] (génération auto-régressive).

## 💡 Pourquoi c'est important en IA on-premise
Tout le dimensionnement matériel (RAM, VRAM, bande passante, [[00-lexique/tokens-par-seconde|tokens/s]], [[00-lexique/ttft|TTFT]]) vise l'inférence, pas l'entraînement. C'est aussi le goulet que décrit le [[00-lexique/memory-wall|Memory Wall]] en decoding.

## ⚠️ Pièges fréquents
- Confondre les TFLOPS annoncés et le débit réel en génération.
- Oublier que l'inférence et l'entraînement n'ont pas les mêmes contraintes matérielles.

## 📚 Pour comprendre en profondeur
*Vous voulez voir l'inférence en action, pas à pas ?*
1. [[01-fondations/le-voyage-d-un-prompt|🧠 Le Voyage d'un Prompt]] *(le cycle complet : tokenisation → prefill → decoding)*
2. [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire]] *(pourquoi la mémoire plafonne la vitesse de génération)*
3. [[03-stack-logicielle/moteurs-inference-vllm-ollama|⚙️ Moteurs d'Inférence]] *(les logiciels qui font tourner l'inférence : Ollama, vLLM, TensorRT-LLM)*

## 🔗 Voir aussi
- [[00-lexique/llm|LLM]]
- [[00-lexique/prefill|Prefill]]
- [[00-lexique/decoding|Decoding]]
- [[00-lexique/memory-wall|Memory Wall]]
- [[01-fondations/la-bande-passante-memoire|🏎️ La Bande Passante Mémoire & Le "Memory Wall"]]
- [[00-lexique/glossaire-ia|📖 Glossaire IA]]
