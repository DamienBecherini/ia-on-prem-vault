---
title: "🔐 Zero Data Retention (ZDR)"
description: "Clause contractuelle d'API cloud LLM : pour les modèles et endpoints couverts, aucune persistance, réutilisation ni revue humaine des prompts et réponses — une couverture désormais négociée modèle par modèle."
aliases:
  - ZDR
  - Zero Retention Policy
  - Politique zéro rétention
tags:
  - lexique
  - conformité
sidebar:
  order: 71
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
---

## 📝 Définition courte

Clause contractuelle (*Zero Data Retention*, ZDR) dans les accords d'API entreprise avec les fournisseurs cloud LLM (OpenAI, Anthropic, Mistral, etc.) : pour les modèles et endpoints couverts, les prompts et sorties du modèle ne sont ni conservés après la réponse, ni réutilisés pour l'entraînement, ni soumis à une revue humaine de routine. Au T4 2026, la couverture est négociée modèle par modèle : elle n'est plus acquise pour les modèles de frontière[^3].

## 📖 Définition détaillée

Sous une clause ZDR, le fournisseur s'engage à :

- **ne pas conserver** prompts et réponses au-delà du traitement de la requête : pas de stockage durable ni de journalisation du contenu (hors surveillance des abus, voir ci-dessous) ;
- **ne jamais utiliser** ces données pour l'entraînement ou le fine-tuning des modèles ;
- **exclure toute revue humaine** du contenu des requêtes.

C'est le minimum contractuel pour les organisations qui souhaitent utiliser des APIs LLM cloud tout en respectant leurs obligations RGPD de traitement des données[^1][^2].

## ⚠️ Ce que ZDR ne couvre pas (au T4 2026)

- **Modèles de frontière** : Anthropic désigne depuis le 9 juin 2026 des *Covered Models* (Claude Fable 5 et 5.1, Mythos 5 et 5.1) soumis à 30 jours de rétention minimale sur toutes les plateformes (API, Bedrock, Google Cloud, Microsoft Foundry) ; ZDR y est indisponible, et une organisation ZDR doit activer la rétention sur le workspace concerné, sinon l'API répond `400`[^3].
- **Endpoints stateful** : fichiers, batch, agents, conversations et fine-tuning stockent par construction ; OpenAI et Mistral les excluent explicitement de ZDR[^1][^4].
- **Modèles expérimentaux** : chez Mistral, les modèles Labs/Preview sont exclus de ZDR et de l'opt-out d'entraînement (CGV du 25 septembre 2026)[^4].
- **Surveillance des abus** : sans ZDR, OpenAI conserve jusqu'à 30 jours de journaux ; sous ZDR, les entrées image/fichier signalées peuvent encore être retenues pour revue[^1]. Anthropic prépare une variante où ces données restent dans le cloud du client (*Enterprise Frontier Safeguards*, annoncée le 1er septembre 2026)[^3].

## ⚠️ Nuance importante : persistance ≠ transit

ZDR traite la **persistance** des données chez le fournisseur, pas leur **transit**. Les données quittent toujours l'infrastructure de l'organisation et transitent vers les serveurs du prestataire. Pour les organisations qui n'acceptent aucun transit externe — défense, santé avec identifiants patients — ZDR est **insuffisant** : un déploiement entièrement [[00-lexique/on-premise|on-premise]] (Tier 3) est requis.

| Exigence | ZDR cloud | On-premise |
| :-- | :-- | :-- |
| Pas de stockage chez le fournisseur | ✅ pour les modèles/endpoints couverts | ✅ |
| Pas de transit hors périmètre | ❌ | ✅ |
| Contrôle total du traitement | Partiel | ✅ |

## 💡 Pourquoi c'est important

Pour les équipes qui ne peuvent pas encore migrer vers l'[[00-lexique/on-premise|on-premise]] mais doivent traiter des données sensibles via API, la clause ZDR est un prérequis d'audit — pas une garantie de souveraineté complète. Voir [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]] pour la grille d'évaluation complète.

## 🔗 Voir aussi

- [[00-lexique/on-premise|On-Premise (IA)]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: OpenAI, *Your data — data controls in the OpenAI platform* (Zero Data Retention, Modified Abuse Monitoring, Private Safety Processing), lu le 2026-10-09. [https://developers.openai.com/api/docs/guides/your-data](https://developers.openai.com/api/docs/guides/your-data)
[^2]: Microsoft, *Data, privacy, and security for Foundry Models sold by Azure in Microsoft Foundry* (abuse monitoring modifié, pas d'entraînement sur les prompts), mis à jour le 2026-06-05. [https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy)
[^3]: Anthropic, *Covered Models* (Claude Fable 5 / 5.1 et Mythos 5 / 5.1 : rétention d'au moins 30 jours sur toutes les plateformes, ZDR indisponible ; désignations du 2026-06-09 et du 2026-08-31), *API and data retention* et annonce *Enterprise Frontier Safeguards* (2026-09-01), lus le 2026-10-10. [https://support.claude.com/en/articles/15425695-covered-models](https://support.claude.com/en/articles/15425695-covered-models) · [https://platform.claude.com/docs/en/manage-claude/api-and-data-retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) · [https://www.anthropic.com/news/enterprise-frontier-safeguards](https://www.anthropic.com/news/enterprise-frontier-safeguards)
[^4]: Mistral AI, *Commercial Terms of Service* (en vigueur 2026-09-25 : modèles Labs/Preview exclus de ZDR et de l'opt-out d'entraînement) et *Can I activate Zero Data Retention (ZDR)?* (plans payants, sur demande, appels stateless seulement ; agents, conversations, libraries, batch et `/v1/files` exclus), lus le 2026-10-09. [https://legal.mistral.ai/terms/commercial-terms-of-service](https://legal.mistral.ai/terms/commercial-terms-of-service) · [https://help.mistral.ai/en/articles/347612-can-i-activate-zero-data-retention-zdr](https://help.mistral.ai/en/articles/347612-can-i-activate-zero-data-retention-zdr)
