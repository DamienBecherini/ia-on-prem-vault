---
title: "LiteLLM"
description: Gateway OpenAI-compatible pour router agents et applications vers Ollama, vLLM, cloud providers ou modèles internes.
sidebar:
  order: 4
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Vue d'ensemble rapide

LiteLLM est un proxy/gateway open-source qui expose une interface compatible OpenAI vers plus de 100 providers : Ollama, vLLM, OpenAI, Anthropic, Azure, Bedrock, Vertex AI, Hugging Face et d'autres[^1].

## 💡 Pourquoi ce projet nous intéresse

Pour un agent custodien, LiteLLM sert de **couche d'abstraction modèle**. L'agent parle OpenAI-compatible ; l'opérateur décide si la requête part vers Ollama local, vLLM, ou un provider cloud.

Cela évite de réécrire l'agent à chaque changement de modèle.

## ✅ Points forts

- API unifiée pour modèles locaux et cloud[^1].
- Support Ollama/vLLM documenté[^1][^2].
- Proxy central avec clés virtuelles, routage, coûts, logs et guardrails.
- Utile pour migrer progressivement cloud → local.

## ⚠️ Limites et risques

- N'est pas un modèle : il route vers des backends.
- Mauvaise config = fuite vers cloud.
- Logging/observabilité peuvent capturer prompts/réponses si activés sans précaution[^3].
- Ajoute une couche critique à sécuriser : LiteLLM a connu en 2026 une série de failles exploitées, dont trois inscrites au catalogue KEV de la CISA (CVE-2026-42208, CVE-2026-42271, CVE-2026-59822, toutes corrigées à partir de la 1.84.0) et une escalade de privilèges critique (GHSA-7hp6-4w63-5g45, CVSS 9.9, un `internal_user` devient `proxy_admin` puis exécute des commandes sur l'hôte ; corrigée en 1.100.4 / 1.101.3 / 1.102.2 / 1.103.1). Au T4 2026, ne jamais déployer une version antérieure à 1.84.0, et viser 1.100.4 ou le dernier correctif de sa ligne[^4][^5].
- Discipline de version : depuis le 2026-06-29, seules les quatre lignes mineures stables les plus récentes reçoivent des correctifs (une mineure par semaine, soit environ un mois de couverture par ligne) — prévoir une mise à jour mensuelle au minimum, une version figée est une version vulnérable[^6].
- Chaîne d'approvisionnement : en mars 2026, deux versions PyPI (1.82.7 et 1.82.8) publiées par un attaquant volaient les secrets de la machine hôte ; l'image Docker officielle n'était pas concernée[^7]. Installer depuis l'image officielle épinglée ou avec des dépendances épinglées par hash, et faire tourner tous les secrets détenus par le proxy si une version compromise a été installée.
- Surface MCP : le proxy embarque aussi une passerelle MCP ; deux de ses failles ont été exploitées en 2026 (CVE-2026-42271, CVE-2026-59822). Si l'agent custodien n'utilise pas MCP via LiteLLM, ne pas exposer ces endpoints[^4].

## 🔒 Souveraineté et confidentialité

- **Données :** transitent par le proxy ; destination selon backend.
- **Modèle :** local si backend Ollama/vLLM local ; cloud si provider cloud.
- **Mémoire :** pas une mémoire applicative, sauf logs/observabilité.
- **Télémétrie/logging :** configurable ; désactiver message logging pour données sensibles[^3].
- **Mode 100% offline :** oui avec backends locaux.
- **Verdict :** ✅ souverain si configuré local-only ; ⚠️ sinon.

## 🔗 Intégration possible dans ce vault

LiteLLM est la couche cible entre :

- OpenHands / Agent Canvas (ou Aider, dont le développement est gelé depuis mai 2026, voir sa fiche) ;
- Ollama/vLLM ;
- politiques de routage ;
- logs locaux ;
- éventuelle bascule cloud de secours.

## 📊 Maturité du projet

Très utilisé comme gateway (plus de 60 000 étoiles GitHub au T4 2026[^1]), LiteLLM publie une ligne mineure par semaine (1.104.2 le 2026-10-08[^8]) et, depuis le 2026-06-29, ne corrige que les quatre lignes mineures stables les plus récentes : chaque ligne reçoit environ un mois de correctifs[^6]. Figer une version n'est donc pas une stratégie viable : prévoir une mise à jour mensuelle au minimum, suivre le flux des advisories GitHub, et versionner/auditer configuration, secrets, logs et règles de routage.

## 🔗 Voir aussi

- [[00-lexique/litellm|LiteLLM]] · [[00-lexique/vllm|vLLM]] · [[00-lexique/ollama|Ollama]]
- [[06-mise-en-oeuvre/local-inference-security|🔐 Sécurité inférence]] · [[06-mise-en-oeuvre/monitoring-inference-stack|📊 Monitoring]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] — orchestration agent complète
- [[04-blueprints/scenario-d-datacenter|Scénario D]]

## 📚 Sources

[^1]: LiteLLM GitHub README. [https://github.com/BerriAI/litellm](https://github.com/BerriAI/litellm)
[^2]: LiteLLM Proxy docs — local proxy, Ollama, vLLM. [https://docs.litellm.ai/docs/proxy_server](https://docs.litellm.ai/docs/proxy_server)
[^3]: LiteLLM Docs, *Logging* — callbacks, OpenTelemetry, `turn_off_message_logging`. [https://docs.litellm.ai/docs/proxy/logging](https://docs.litellm.ai/docs/proxy/logging)
[^4]: CISA, *Known Exploited Vulnerabilities Catalog* (flux JSON ; entrées LiteLLM CVE-2026-42208 ajoutée le 2026-05-08, CVE-2026-42271 le 2026-06-08, CVE-2026-59822 le 2026-09-02), catalogue daté 2026-10-08. [https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json)
[^5]: BerriAI, *GHSA-7hp6-4w63-5g45* (advisory LiteLLM, escalade `internal_user` → `proxy_admin` → exécution de commandes sur l'hôte, CVSS 9.9, versions 1.91.0 → < 1.100.4, corrigé 1.100.4 / 1.101.3 / 1.102.2 / 1.103.1), 2026-09-30. [https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45](https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45)
[^6]: LiteLLM, *Version Support Policy* (blog : à partir du 2026-06-29, seules les quatre lignes mineures stables les plus récentes reçoivent des correctifs), 2026-06-20. [https://docs.litellm.ai/blog/version-support](https://docs.litellm.ai/blog/version-support)
[^7]: BerriAI, *Issue #24518* (versions PyPI 1.82.7 et 1.82.8 publiées hors CI par un attaquant, vol de secrets de l'hôte ; image Docker du proxy non concernée), 2026-03-24. [https://github.com/BerriAI/litellm/issues/24518](https://github.com/BerriAI/litellm/issues/24518)
[^8]: BerriAI, *LiteLLM Releases* (v1.104.2 publiée le 2026-10-08, cadence d'une ligne mineure par semaine), consulté le 2026-10-09. [https://github.com/BerriAI/litellm/releases](https://github.com/BerriAI/litellm/releases)
