---
title: "🔐 Zero Data Retention (ZDR)"
description: "Clause contractuelle d'API cloud LLM garantissant l'absence de persistance, de réutilisation et de revue humaine des prompts et réponses."
aliases:
  - ZDR
  - Zero Retention Policy
  - Politique zéro rétention
tags:
  - lexique
  - conformité
sidebar:
  order: 71
last_modified: "2026-06-09"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
---

## 📝 Définition courte

Clause contractuelle (*Zero Data Retention*, ZDR) dans les accords d'API entreprise avec les fournisseurs cloud LLM (OpenAI, Anthropic, Mistral, etc.) : les prompts et sorties du modèle ne sont ni persistés, ni réutilisés pour l'entraînement, ni soumis à une revue humaine.

## 📖 Définition détaillée

Sous une clause ZDR, le fournisseur s'engage à :

- traiter prompts et réponses **en mémoire uniquement**, sans écriture sur disque ni dans les logs applicatifs ;
- **ne jamais utiliser** ces données pour l'entraînement ou le fine-tuning des modèles ;
- **exclure toute revue humaine** du contenu des requêtes.

C'est le minimum contractuel pour les organisations qui souhaitent utiliser des APIs LLM cloud tout en respectant leurs obligations RGPD de traitement des données[^1][^2].

## ⚠️ Nuance importante : persistance ≠ transit

ZDR traite la **persistance** des données chez le fournisseur, pas leur **transit**. Les données quittent toujours l'infrastructure de l'organisation et transitent vers les serveurs du prestataire. Pour les organisations qui n'acceptent aucun transit externe — défense, santé avec identifiants patients — ZDR est **insuffisant** : un déploiement entièrement [[00-lexique/on-premise|on-premise]] (Tier 3) est requis.

| Exigence | ZDR cloud | On-premise |
| :-- | :-- | :-- |
| Pas de stockage chez le fournisseur | ✅ | ✅ |
| Pas de transit hors périmètre | ❌ | ✅ |
| Contrôle total du traitement | Partiel | ✅ |

## 💡 Pourquoi c'est important

Pour les équipes qui ne peuvent pas encore migrer vers l'[[00-lexique/on-premise|on-premise]] mais doivent traiter des données sensibles via API, la clause ZDR est un prérequis d'audit — pas une garantie de souveraineté complète. Voir [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]] pour la grille d'évaluation complète.

## 🔗 Voir aussi

- [[00-lexique/on-premise|On-Premise (IA)]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: OpenAI, *Enterprise Privacy — Zero Data Retention*. [https://platform.openai.com/docs/guides/your-data](https://platform.openai.com/docs/guides/your-data)
[^2]: Microsoft, *Azure OpenAI Service — Data privacy*. [https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/data-privacy](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/data-privacy)
