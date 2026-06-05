---
title: "SearXNG"
description: Métamoteur de recherche auto-hébergé et privacy-first, utile pour donner un accès web contrôlé à un agent custodien.
sidebar:
  order: 5
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Vue d'ensemble rapide

SearXNG est un métamoteur libre qui agrège les résultats de nombreux moteurs sans profiler l'utilisateur. Il peut être auto-hébergé et expose une API de recherche exploitable par un agent[^1][^2].

## 💡 Pourquoi ce projet nous intéresse

Un agent custodien a besoin de vérifier des sources. SearXNG permet de lui donner un outil de recherche web contrôlé sans dépendre directement de Google/Bing/Tavily.

## ✅ Points forts

- Auto-hébergeable.
- Pas de profilage utilisateur selon la documentation[^1].
- API `/search` avec format JSON si activé dans `settings.yml`[^3].
- Peut être couplé à Tor/proxy selon besoin.
- Aucun token API externe nécessaire pour démarrer.

## ⚠️ Limites et risques

- Les requêtes partent quand même vers les moteurs interrogés depuis l'instance.
- Les instances publiques peuvent désactiver JSON ou imposer des limites.
- Une instance mal configurée peut être abusée par des bots.
- La qualité des résultats dépend des moteurs activés.

## 🔒 Souveraineté et confidentialité

- **Données :** requêtes traitées par votre instance ; moteurs distants voient l'instance.
- **Modèle :** non applicable.
- **Mémoire :** pas de mémoire applicative par défaut.
- **Télémétrie :** pas de profilage utilisateur annoncé.
- **Mode 100% offline :** non, c'est un accès web.
- **Verdict :** ✅ pour recherche web privacy-preserving, pas pour air-gap strict.

## 🔗 Intégration possible dans ce vault

SearXNG peut devenir l'outil `web_search` d'un agent custodien :

```text
GET /search?q=site:docs.vllm.ai+parallelism&format=json
```

L'agent doit ensuite citer les URL sélectionnées dans son rapport.

## 📊 Maturité du projet

Projet mature, actif, très utilisé dans l'auto-hébergement. À protéger par limiter, secret key, reverse proxy et politique d'accès.

## 📚 Sources

[^1]: SearXNG Documentation — "Search without being tracked". [https://docs.searxng.org/](https://docs.searxng.org/)
[^2]: SearXNG GitHub README. [https://github.com/searxng/searxng](https://github.com/searxng/searxng)
[^3]: SearXNG Docs, *Search API*. [https://docs.searxng.org/dev/search_api](https://docs.searxng.org/dev/search_api)
