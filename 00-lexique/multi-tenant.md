---
title: "🏢 Multi-tenant"
description: "Architecture SaaS IA où une même infrastructure sert plusieurs organisations isolées, avec risque de fuite inter-tenant en RAG."
aliases:
  - Multi-locataire
  - Multitenancy
tags:
  - lexique
  - architecture
  - sécurité
sidebar:
  order: 39
last_modified: "2026-06-09"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
---

## 📝 Définition courte

En architecture SaaS IA, le **multi-tenant** (*multi-locataire*) désigne le déploiement d'une infrastructure unique — serveur d'inférence, base vectorielle, pipeline d'[[00-lexique/embedding|embedding]] — qui sert simultanément plusieurs organisations (*tenants*) indépendantes, avec isolation stricte des données entre elles.

## 📖 Définition détaillée

Le risque central d'un système [[00-lexique/rag|RAG]] multi-tenant : des embeddings ou documents du Tenant A sont accidentellement retournés en réponse à une requête du Tenant B. OWASP classe ce type de faille sous **LLM08: Vector and Embedding Weaknesses** dans le LLM Top 10 (édition 2025)[^1].

L'isolation ne peut pas reposer uniquement sur la couche applicative — un filtre `tenant_id` oublié dans une requête suffit à provoquer une fuite.

## 💡 Patterns de mitigation

### Row-Level Security (RLS) avec pgvector

PostgreSQL RLS applique un filtre `tenant_id` **au niveau moteur** lors de chaque recherche de similarité vectorielle. Même si l'application omet le filtre, la politique RLS bloque l'accès aux lignes d'un autre tenant[^2].

### Partitionnement par payload avec Qdrant

Qdrant permet de scoper les recherches vectorielles via des filtres sur le *payload* (clés d'accès spécifiques au tenant), sans multiplier les collections — une collection partagée, des partitions logiques par tenant[^3].

| Pattern | Moteur | Avantage |
| :-- | :-- | :-- |
| RLS + pgvector | PostgreSQL | Isolation au niveau SQL, auditabilité native |
| Payload partitioning | Qdrant | Scalabilité vectorielle, filtrage natif par tenant |

## ⚠️ Pièges fréquents

- Croire qu'une collection vectorielle par tenant suffit sans contrôler les clés d'API partagées.
- Oublier d'isoler aussi les pipelines d'indexation : un worker qui indexe le mauvais corpus contamine toute la base.
- Négliger les tests de non-régression sur l'isolation à chaque changement de schéma ou de requête.

## 📚 Pour comprendre en profondeur

1. [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] — section multi-locataire
2. [[06-mise-en-oeuvre/local-inference-security|🔒 Sécurité de l'inférence locale]] — LLM08 OWASP

## 🔗 Voir aussi

- [[00-lexique/rag|RAG]]
- [[00-lexique/vectordb|Base de données vectorielle]]
- [[00-lexique/embedding|Embedding]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: OWASP, *Top 10 for Large Language Model Applications*. [https://owasp.org/www-project-top-10-for-large-language-model-applications/](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
[^2]: Crunchy Data, *Row Level Security for Tenants in Postgres*. [https://www.crunchydata.com/blog/row-level-security-for-tenants-in-postgres](https://www.crunchydata.com/blog/row-level-security-for-tenants-in-postgres)
[^3]: Qdrant, *Multitenancy — multiple partitions guide*. [https://qdrant.tech/documentation/guides/multiple-partitions/](https://qdrant.tech/documentation/guides/multiple-partitions/)
