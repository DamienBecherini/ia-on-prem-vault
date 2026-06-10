---
title: Speculative Decoding
description: Technique d'accélération d'inférence où un petit modèle rapide génère des tokens candidats que le grand modèle vérifie en un seul passage. Nécessite deux modèles chargés simultanément.
aliases:
  - Décodage Spéculatif
  - speculative sampling
tags:
  - lexique
  - fondations
  - inférence
last_modified: "2026-06-10"
last_verified: "2026-06-10"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---


## 📝 Définition courte

Technique d'accélération d'inférence où un **petit modèle rapide** (« draft model ») génère des tokens candidats en avance, puis un **grand modèle** (« target model ») vérifie et corrige l'ensemble en un seul passage parallèle.

## 📖 Définition détaillée

Le goulot d'étranglement de la génération LLM est sa nature **autoregressive** : chaque token doit attendre le précédent avant d'être calculé. Le speculative decoding contourne cette contrainte en deux phases :

1. **Phase de draft :** un modèle léger (ex. un 1B ou 7B) génère γ tokens candidats en γ passes rapides.
2. **Phase de vérification :** le grand modèle cible évalue les γ candidats **en un seul forward pass** parallèle — aussi rapide que de générer 1 token. Il accepte les tokens valides et rejette les incorrects dès le premier écart.

Si le draft model prédit correctement k tokens sur γ, on obtient k+1 tokens au prix d'un seul appel du grand modèle.

```
Draft model (7B)  →  [tok1, tok2, tok3, tok4]  (4 tokens candidats)
                              ↓
Target model (70B) →  ✅ tok1  ✅ tok2  ❌ tok3  [arrêt, correction]
                     →  Résultat : tok1, tok2, tok3-corrigé  (3 tokens en 1 pass)
```

### Condition d'efficacité

Le gain réel dépend du **taux d'acceptation** des tokens candidats. Quand le draft model prédit correctement 70 à 90 % des tokens (forte corrélation de distribution avec le modèle cible), l'accélération est significative. Si le taux d'acceptation est bas (< 50 %), les vérifications fréquentes annulent le bénéfice.

> [!warning] Prérequis mémoire — point critique en on-premise
> Le speculative decoding nécessite de charger **deux modèles simultanément** en mémoire : le draft model et le target model. Sur une machine avec 24 Go de VRAM (ex. RTX 4090), cela est souvent impraticable pour les modèles 70B. La technique devient pertinente sur des systèmes disposant de **128 Go+ de mémoire unifiée** (ex. [[02-materiel/apu-and-unified-memory|Mac Studio M3 Ultra, AMD Gorgon Halo, NVIDIA DGX Spark]]) ou sur des **serveurs multi-GPU** avec suffisamment de VRAM cumulée.

## ⚙️ Support dans vLLM

[[03-stack-logicielle/inference-engines-vllm-ollama|vLLM]] supporte le speculative decoding via le paramètre `--speculative-model` au démarrage du serveur [^1] :

```bash
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --speculative-model meta-llama/Llama-3.2-1B-Instruct \
  --num-speculative-tokens 5
```

Le paramètre `--num-speculative-tokens` (γ) contrôle le nombre de tokens générés par le draft model à chaque étape. Une valeur entre 3 et 8 est généralement recommandée selon les docs vLLM.

> [!note] Variante Eagle / Eagle-2
> vLLM supporte aussi des variantes avancées comme **Eagle** (draft model entraîné spécifiquement pour s'aligner sur le target), qui peuvent atteindre un taux d'acceptation plus élevé qu'un draft model générique. Consulter la documentation vLLM pour les modèles Eagle disponibles.

## 💡 Pourquoi c'est important en IA on-premise

Pour une stack souveraine avec un seul modèle 70B en service, le speculative decoding peut réduire la latence perçue par utilisateur (TTFT et temps de génération) sans changer le matériel — à condition de disposer de la capacité mémoire pour le second modèle.

Il est particulièrement attractif sur les blueprints haute capacité ([[02-materiel/apu-and-unified-memory|mémoire unifiée 128 Go+]]) où charger un draft model 1B–7B ne représente que quelques gigaoctets supplémentaires.

## ⚠️ Pièges fréquents

- **Ne charge pas deux fois le même modèle.** Le draft model doit être un modèle *différent*, plus petit et aligné avec le target.
- **N'améliore pas le débit total (throughput) en multi-utilisateurs.** Le gain est sur la **latence par requête** individuelle. Sous forte charge concurrente, le [[00-lexique/pagedattention|PagedAttention]] et le continuous batching restent prioritaires.
- **Incompatible avec certains modes de quantification.** Les quantifications très agressives (Q2) peuvent dégrader le taux d'acceptation et annuler le bénéfice.
- **Chiffres de gain : très variables.** Ne pas citer de multiplicateur de vitesse sans préciser le modèle, le draft model, le taux d'acceptation mesuré et le batch size.

## 📚 Pour comprendre en profondeur

1. [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'Inférence — vLLM]] *(paramètre `--speculative-model`, configuration)*
2. [[02-materiel/apu-and-unified-memory|🧠 APU & Mémoire Unifiée]] *(prérequis matériel : 128 Go+)*
3. [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]] *(comprendre pourquoi l'autorégressivité est le goulot)*

## 🔗 Voir aussi

- [[00-lexique/inference|Inférence]]
- [[00-lexique/tokens-per-second|Tokens par seconde]]
- [[00-lexique/ttft|TTFT]]
- [[00-lexique/pagedattention|PagedAttention]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

## 📚 Sources

[^1]: vLLM Project, *Speculative Decoding* — documentation officielle (`--speculative-model`, `--num-speculative-tokens`, variantes Eagle). [https://docs.vllm.ai/en/stable/features/spec_decode.html](https://docs.vllm.ai/en/stable/features/spec_decode.html)
