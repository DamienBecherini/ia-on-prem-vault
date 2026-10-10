---
title: "Open WebUI"
description: Interface web self-hosted pour Ollama et backends OpenAI-compatibles, adaptée aux déploiements locaux multi-utilisateurs.
sidebar:
  order: 2
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Vue d'ensemble rapide

Open WebUI est une plateforme web self-hosted pour exposer des modèles locaux via Ollama, vLLM ou toute API OpenAI-compatible. Le projet se présente comme extensible, riche en fonctionnalités, et capable de fonctionner entièrement offline[^1][^2].

> [!tip] Le bon cas d'usage
> Open WebUI est souvent le meilleur premier choix pour une PME ou un lab qui veut transformer un serveur Ollama en interface partagée : comptes utilisateurs, historique, fichiers, RAG, modèles multiples et administration centralisée. Attention au cadre juridique : depuis la v0.6.6 (avril 2025), la licence « Open WebUI License » (BSD-3 avec clause de marque, non reconnue par l'OSI) interdit de retirer ou masquer la marque Open WebUI au-delà de 50 utilisateurs sur 30 jours, sauf licence entreprise[^5].

## 💡 Pourquoi ce projet nous intéresse

Open WebUI occupe la place de "portail ChatGPT interne" dans une stack on-premise. Il ne remplace pas le moteur d'inférence : il orchestre l'accès aux modèles, l'interface, les utilisateurs, les fichiers et les plugins.

Dans ce vault, c'est la solution de référence pour le scénario **multi-utilisateur simple** : un backend local, une interface web, des droits, une adoption facile.

## ✅ Points forts

- **Self-hosted** : Docker, Kubernetes, Python, images avec Ollama ou CUDA selon besoin[^1].
- **Provider-agnostic** : Ollama, OpenAI-compatible APIs, vLLM et autres backends[^2].
- **Expérience utilisateur mature** : historique, fichiers, RAG, plugins, modèles multiples.
- **Déploiement local crédible** : peut être lié à Ollama via `OLLAMA_BASE_URL`[^3].
- **Observabilité maîtrisable** : OpenTelemetry disponible pour vos propres traces/logs en production[^3].
- **Fonctions d'équipe récentes** : les versions 0.10 (juin 2026) et 0.11 (juillet 2026) ajoutent les dossiers partagés avec permissions par groupe, les bases de connaissances externes, la compaction automatique du contexte, les **sous-agents** et la synchronisation des groupes LDAP : autant de fonctions qui rapprochent Open WebUI d'un portail d'entreprise, et autant de surfaces à administrer[^6].

## ⚠️ Limites et risques

- **Pas un moteur d'inférence** : il faut dimensionner Ollama/vLLM séparément.
- **Surface d'administration** : comptes, plugins, CORS, secrets et exposition réseau doivent être durcis.
- **Provider cloud possible** : s'il est connecté à OpenAI/Anthropic, les données suivent le provider choisi.
- **Télémétrie/analytics à vérifier** : les variables `SCARF_NO_ANALYTICS`, `DO_NOT_TRACK`, `ANONYMIZED_TELEMETRY` doivent être fixées dans un contexte strict[^3].

## 🔒 Souveraineté et confidentialité

- **Données :** stockées dans l'instance self-hosted.
- **Modèle :** local si `OLLAMA_BASE_URL` / vLLM local ; cloud si provider externe configuré.
- **Mémoire :** historique et RAG dans l'instance.
- **Télémétrie :** désactivation recommandée via variables d'environnement[^3].
- **Mode 100% offline :** oui si images, modèles et dépendances sont préchargés.
- **Verdict :** ⚠️ configurable — excellent on-prem si durci, mais multi-provider par nature.

Voir la grille complète : [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Souveraineté & Confidentialité]].

## 🔗 Intégration possible dans ce vault

Open WebUI est un bon compagnon des blueprints :

- [[04-blueprints/scenario-a-dev-lab|Scénario A]] : UI locale personnelle devant Ollama.
- [[04-blueprints/scenario-b-sme-appliance|Scénario B]] : portail PME pour quelques utilisateurs.
- [[04-blueprints/scenario-d-datacenter|Scénario D]] : front d'accès sur vLLM/TensorRT-LLM derrière proxy.

## 📊 Maturité du projet

Projet très utilisé et activement maintenu (environ 154 000 étoiles GitHub, v0.11.4 au 2026-09-21), avec une large communauté GitHub et un écosystème de plugins. La maturité produit est bonne, mais la surface d'attaque suit : 88 avis de sécurité publiés entre juin et septembre 2026, dont une trentaine de sévérité haute (prise de contrôle de compte via OAuth, SSRF vers les services internes, exécution d'outils entre utilisateurs) et trois exploitables sans compte. Les correctifs ne sont livrés que dans les versions courantes : une PME doit suivre le train de releases sans jamais rester sous la 0.11.1 (SSRF CVE-2026-87996), ne pas figer une version, et appliquer le guide de durcissement officiel[^4].

## 🔗 Voir aussi

- [[00-lexique/ollama|Ollama]] · [[00-lexique/vllm|vLLM]] — backends inférence
- [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] · [[03-stack-logicielle/inference-engines-vllm-ollama|⚙️ Moteurs d'inférence]]
- [[04-blueprints/scenario-b-sme-appliance|Scénario B]] · [[04-blueprints/scenario-d-datacenter|Scénario D]]
- [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/anythingllm|AnythingLLM]] · [[05-agents-et-assistants-on-prem/assistants-personnels/solutions/khoj|Khoj]] — alternatives RAG/UI
- [[06-mise-en-oeuvre/local-inference-security|🔐 Sécurité inférence]] · [[06-mise-en-oeuvre/evaluate-local-model|🧪 Évaluer un modèle]]

## 📚 Sources

[^1]: Open WebUI GitHub — plateforme self-hosted offline, support Ollama et images Docker/Kubernetes. [https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)
[^2]: Open WebUI Docs — home, providers et fonctionnalités. [https://docs.openwebui.com/](https://docs.openwebui.com/)
[^3]: Open WebUI Configuration — `OLLAMA_BASE_URL`, télémétrie, secrets, OpenTelemetry. [https://docs.openwebui.com/getting-started/advanced-topics/](https://docs.openwebui.com/getting-started/advanced-topics/)
[^4]: Open WebUI — *Security advisories* (88 avis publiés entre le 2026-06-11 et le 2026-09-28 : 30 high, 53 medium, 5 low ; décompte API GitHub du 2026-10-10) et guide *Hardening*. [https://github.com/open-webui/open-webui/security/advisories](https://github.com/open-webui/open-webui/security/advisories) · [https://docs.openwebui.com/getting-started/advanced-topics/hardening](https://docs.openwebui.com/getting-started/advanced-topics/hardening)
[^5]: Open WebUI — *License* (BSD-3 jusqu'à la v0.6.5 ; clause de marque depuis la v0.6.6 du 2025-04-19, exemption « 50 utilisateurs ou moins sur 30 jours », non approuvée OSI), consultée le 2026-10-10. [https://docs.openwebui.com/license/](https://docs.openwebui.com/license/)
[^6]: Open WebUI — *Releases* v0.10.0 (2026-06-29 : dossiers partagés, bases de connaissances externes, compaction du contexte) et v0.11.0 (2026-07-27 : sous-agents, synchronisation des groupes LDAP). [https://github.com/open-webui/open-webui/releases/tag/v0.10.0](https://github.com/open-webui/open-webui/releases/tag/v0.10.0) · [https://github.com/open-webui/open-webui/releases/tag/v0.11.0](https://github.com/open-webui/open-webui/releases/tag/v0.11.0)
