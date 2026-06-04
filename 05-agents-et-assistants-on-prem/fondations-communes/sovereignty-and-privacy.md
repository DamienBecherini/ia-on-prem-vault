---
title: "🔒 Souveraineté & Confidentialité"
description: >
  Grille d'évaluation en 6 critères pour auditer tout outil d'IA locale, protocole de vérification
  concrète, contexte réglementaire RGPD/AI Act et checklist pratique.
sidebar:
  order: 2
---

Avant de choisir un assistant personnel ou un agent custodien, une question mérite une réponse honnête :

> **Ce logiciel fait-il vraiment tourner le modèle sur ma machine, ou envoie-t-il mes données quelque part sans que je m'en aperçoive ?**

La réponse n'est pas toujours dans la page marketing. Elle est dans le code, le README et le trafic réseau.

---

## 🧪 La grille d'évaluation : 6 critères

Pour chaque outil présenté dans cette section, le même protocole d'évaluation est appliqué.

### Critère 1 — Localisation des données

> *Où finissent vos fichiers, conversations et documents indexés ?*

| Niveau | Description |
| :-- | :-- |
| ✅ Local strict | Tout reste sur votre machine. Aucun fichier ne quitte le système. |
| ⚠️ Configurable | Local par défaut, mais sync cloud possible si activée explicitement. |
| ❌ Cloud par défaut | Les données sont envoyées sur les serveurs du prestataire, même sans configuration. |

**Comment vérifier :** cherchez dans `.env.example` les variables `SYNC_URL`, `CLOUD_STORAGE`, `UPLOAD_ENDPOINT`. Un `grep -r "fetch\|axios\|upload" src/` révèle les appels réseau sortants.

---

### Critère 2 — Routage du modèle

> *L'inférence se fait-elle sur votre GPU/CPU, ou via une API cloud ?*

| Niveau | Description |
| :-- | :-- |
| ✅ Local strict | Ollama, llama.cpp, vLLM — le LLM tourne sur votre machine. |
| ⚠️ Configurable | Supporte Ollama mais propose aussi OpenAI par défaut à l'installation. |
| ❌ Cloud par défaut | L'application utilise l'API OpenAI, Anthropic ou autre sans alternative locale évidente. |

**Comment vérifier :** regardez le fichier de configuration par défaut. Est-ce que `OPENAI_API_KEY` est dans les variables *recommandées* dès le tutoriel d'installation ? Si oui, le chemin cloud est le chemin de moindre résistance.

---

### Critère 3 — Mémoire persistante

> *L'outil garde-t-il un contexte entre les sessions ? Si oui, où est-il stocké ?*

| Niveau | Description |
| :-- | :-- |
| ✅ Local strict | SQLite local, fichiers Markdown sur disque, base vectorielle locale (Chroma, Qdrant self-hosted). |
| ⚠️ Configurable | Base distante possible mais non obligatoire. |
| ❌ Cloud par défaut | L'historique et les embeddings sont stockés dans un service cloud du prestataire. |

---

### Critère 4 — Télémétrie

> *Le logiciel envoie-t-il des métriques, logs ou traces de prompts à ses développeurs ?*

| Niveau | Description |
| :-- | :-- |
| ✅ Absente | Aucune télémétrie confirmée dans le code source ou explicitement désactivable à `false` par défaut. |
| ⚠️ Opt-out | Télémétrie active par défaut, désactivable en configuration. |
| ❌ Non désactivable | Télémétrie intégrée sans option de désactivation documentée. |

**Comment vérifier :** cherchez `posthog`, `segment`, `mixpanel`, `sentry`, `amplitude` dans `package.json` ou `requirements.txt`. Ces bibliothèques sont les vecteurs classiques de télémétrie dans les projets open-source.

---

### Critère 5 — Mode offline

> *L'outil fonctionne-t-il sans aucune connexion Internet après installation ?*

| Niveau | Description |
| :-- | :-- |
| ✅ Oui | Zéro appel réseau en fonctionnement normal une fois les modèles téléchargés. |
| ⚠️ Partiel | Fonctionne offline pour l'essentiel, mais certaines fonctionnalités (mises à jour, web search) nécessitent Internet. |
| ❌ Non | Une connexion Internet est requise même pour les conversations de base. |

---

### Critère 6 — Verdict souveraineté

Synthèse des 5 critères précédents :

| Verdict | Signification |
| :-- | :-- |
| ✅ Souverain natif | Les 5 critères sont au niveau ✅ sans configuration particulière. |
| ⚠️ Configurable | Peut être rendu souverain en modifiant la configuration, mais ce n'est pas le comportement par défaut. Un utilisateur non technique utilisera l'outil en mode cloud sans le savoir. |
| ❌ Incompatible on-prem strict | Ne peut pas être rendu souverain. Incompatible avec les contraintes RGPD, HDS ou secret professionnel. |

---

## 🪤 Le piège "UI locale, cerveau cloud"

C'est le pattern le plus dangereux — et le plus fréquent.

L'interface est installée sur votre machine. Le README dit "privacy-first". Et pourtant, chaque conversation est envoyée à `api.openai.com` (ou `api.anthropic.com`, ou les serveurs du prestataire) car le modèle qui répond n'est pas local.

**Exemples typiques :**
- Une application Electron qui "supporte" Ollama, mais dont le fichier de configuration par défaut pointe vers `gpt-4o`.
- Un assistant qui stocke vos fichiers localement mais envoie vos prompts à un modèle distant pour les encoder en embeddings.
- Un agent qui s'exécute sur votre machine mais qui utilise le service de web search du prestataire pour chaque requête.

**Le test en 60 secondes :** lancez l'application normalement et surveillez le trafic réseau avec un proxy (Proxyman, Charles, ou simplement `sudo tcpdump -i any host api.openai.com`). Si vous voyez des requêtes vers des services cloud pendant une conversation "locale", vous avez votre réponse.

---

## ⚖️ Contexte réglementaire

### RGPD (Règlement Général sur la Protection des Données)

Le RGPD impose que les données personnelles des résidents européens soient traitées avec leur consentement explicite et protégées. Envoyer des conversations contenant des données personnelles vers un service cloud hors UE (article 46) sans garanties appropriées constitue une violation potentielle — même si le prestataire est "de bonne foi".

L'IA on-premise est l'une des rares architectures qui permet de traiter des données personnelles dans un LLM **sans les exporter hors du périmètre de contrôle de l'organisation**.

### AI Act (Règlement européen sur l'IA, applicable depuis 2025–2026)

L'AI Act distingue les systèmes à risque limité (assistants généraux) des systèmes à haut risque (employés dans la santé, la justice, l'éducation, les RH...). Pour les usages à haut risque, la traçabilité, l'auditabilité et le contrôle humain sont obligatoires — des exigences difficiles à satisfaire avec un modèle cloud "boîte noire".

### Secteurs spécifiques

| Secteur | Contrainte | Implication |
| :-- | :-- | :-- |
| Santé | HDS (Hébergement Données de Santé) | L'hébergeur doit être certifié HDS. Les clouds non certifiés sont exclus. |
| Juridique | Secret professionnel | Les échanges avocat-client ne peuvent transiter par des tiers. |
| Défense / Admin | Secret défense, IGI 1300 | Réseaux isolés obligatoires pour certains niveaux. |
| Finance | DSP2, NIS2 | Exigences de localisation et d'auditabilité des systèmes critiques. |

---

## ✅ Checklist pratique : auditer un nouvel outil en 15 minutes

Avant d'intégrer un outil dans votre stack on-premise :

- [ ] **README :** le mot "local" est-il accompagné d'un modèle local (Ollama, llama.cpp) ou d'une clé API ?
- [ ] **`.env.example` :** quelles variables sont pré-remplies ? `OPENAI_API_KEY=""` présent = chemin cloud facilité.
- [ ] **`package.json` / `requirements.txt` :** présence de `posthog`, `segment`, `sentry`, `openai`, `anthropic` ?
- [ ] **Trafic réseau (5 min) :** tcpdump ou proxy pendant une conversation normale — des appels sortants ?
- [ ] **Dernière release :** le projet est-il maintenu ? Une version vieille de 18+ mois est un risque de sécurité.
- [ ] **Issues GitHub :** chercher "privacy", "telemetry", "cloud" dans les issues fermées — les problèmes déjà signalés et résolus (ou ignorés) sont révélateurs.
- [ ] **Mode offline :** coupez Internet et testez. Tout s'arrête = dépendance cloud non documentée.

---

## 🔗 Voir aussi

- [[05-agents-et-assistants-on-prem/fondations-communes/possible-architectures|🏗️ Architectures Possibles]] — taxonomie et comparatif des patterns
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 Assistants Personnels]] — fiches solution avec verdict souveraineté
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 Agents Custodiens]] — fiches solution avec verdict souveraineté
- [[00-lexique/on-premise|On-Premise (IA)]] — définition et motivations
- [[00-lexique/rag|RAG]] — architecture mémoire courante dans les assistants locaux
