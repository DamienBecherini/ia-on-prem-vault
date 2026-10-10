---
title: "SearXNG"
description: Métamoteur de recherche auto-hébergé et privacy-first, utile pour donner un accès web contrôlé à un agent custodien.
sidebar:
  order: 5
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
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

Projet mature, actif (AGPL-3.0, environ 38 000 étoiles GitHub au T4 2026) et très utilisé dans l'auto-hébergement. SearXNG est une rolling release sans numéro de version : chaque commit sur `master` est une release, et la doc demande une mise à jour régulière du code[^4]. À protéger par le limiter intégré (qui **requiert une base Valkey**), secret key, reverse proxy et politique d'accès[^5] ; pour le déploiement en conteneur, suivre la doc officielle, l'ancien dépôt `searxng-docker` étant archivé depuis le 2026-03-28[^6].

## 🔗 Voir aussi

- [[00-lexique/rag|RAG]] · [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] — recherche web pour agents
- [[06-mise-en-oeuvre/local-inference-security|🔐 Sécurité inférence]] · [[00-lexique/prompt-injection|Prompt injection]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] · [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté]]

## 📚 Sources

[^1]: SearXNG Documentation — "Search without being tracked". [https://docs.searxng.org/](https://docs.searxng.org/)
[^2]: SearXNG GitHub README. [https://github.com/searxng/searxng](https://github.com/searxng/searxng)
[^3]: SearXNG Docs, *Search API*. [https://docs.searxng.org/dev/search_api](https://docs.searxng.org/dev/search_api)
[^4]: SearXNG Docs, *How to update* (« SearXNG is a rolling release; each commit to the master branch is a release », mise à jour régulière requise), build 2026.10.9. [https://docs.searxng.org/admin/update-searxng.html](https://docs.searxng.org/admin/update-searxng.html)
[^5]: SearXNG Docs, *Limiter* (« The limiter requires a Valkey database »), build 2026.10.9. [https://docs.searxng.org/admin/searx.limiter.html](https://docs.searxng.org/admin/searx.limiter.html)
[^6]: searxng, *searxng-docker* (dépôt archivé le 2026-03-28, « superseded » au profit de la documentation officielle), consulté le 2026-10-10. [https://github.com/searxng/searxng-docker](https://github.com/searxng/searxng-docker)
