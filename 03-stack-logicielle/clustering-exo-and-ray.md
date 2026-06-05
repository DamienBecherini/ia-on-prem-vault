---
title: "🌐 Clustering IA : Relier les GPU avec Exo et Ray"
description: Comment fusionner la mémoire de plusieurs machines pour l'IA locale. Comparatif entre Exo (Apple Silicon / Homelab) et Ray Serve (Datacenter).
sidebar:
  order: 2
last_modified: "2026-06-04"
---

> [!tip] En bref
> Quand aucune machine seule ne peut charger le modèle, le clustering distribue les poids entre plusieurs nœuds. Exo est fait pour relier des Mac ou PC de bureau via Thunderbolt. Ray Serve gère la production en datacenter. L'un sert à agrandir votre homelab, l'autre à scaler en production.

Même avec la meilleure [[01-fondations/quantization-4bit-8bit|quantification]], un modèle massif comme DeepSeek V3 (671 milliards de paramètres) demande plus de 400 Go de mémoire vidéo. Aucune carte graphique grand public ne possède cette capacité seule. 

La solution matérielle est d'utiliser un [[02-materiel/stations-multi-gpu|serveur multi-GPU]]. Mais comment le logiciel gère-t-il cette distribution ? Et comment faire si vous n'avez pas un énorme serveur, mais plutôt plusieurs Mac Studio ou PC branchés en réseau ?

En 2026, deux écoles logicielles s'affrontent pour le clustering IA : **Exo** pour le matériel de bureau, et **Ray** pour les datacenters.

---

## 1. Exo : Le cluster P2P du poste de travail

[Exo](https://github.com/exo-explore/exo) (développé par *Exo Labs*) est la révolution de l'inférence locale "grand public". Son objectif est simple : créer un cluster d'IA unifié à partir des appareils de tous les jours (Mac, PC Linux, cartes NVIDIA, voire smartphones) connectés au même réseau[^1].

### 🌟 Comment ça marche ?
Exo fonctionne en Peer-to-Peer (P2P). Vous lancez la commande `uv run exo` sur chaque machine. Elles se découvrent automatiquement sur le réseau local et fusionnent leur mémoire disponible[^1]. Lorsqu'une requête est envoyée, Exo découpe le modèle (stratégie de *Pipeline Parallelism*) : la machine A calcule les premières couches du réseau de neurones, puis envoie le résultat à la machine B par le réseau, qui calcule la suite.

### 🚀 Cas d'usage : Le Mac Cluster
Exo brille particulièrement sur Apple Silicon. En utilisant des câbles Thunderbolt 4 ou 5 (qui permettent le **RDMA-over-Thunderbolt** entre les puces), on obtient une bande passante réseau suffisante pour compenser la latence inter-machines. 
Des benchmarks communautaires indiquent qu'un cluster de 8 Mac Mini M4 Pro (soit 512 Go de mémoire unifiée agrégée) peut faire tourner le colossal DeepSeek V3 671B avec un débit de l'ordre de **3 à 5 tokens/s** dans cette configuration[^2].

### ⚠️ Les limites
Si la connexion réseau est lente (Wi-Fi ou simple câble Ethernet 1 Gigabit), le transfert des activations entre les machines devient un goulot d'étranglement fatal. La capacité globale augmente, mais les [[00-lexique/tokens-per-second|tokens/s]] s'effondrent.

---

## 2. Ray & vLLM : Le standard Datacenter

Pour la production d'entreprise (comme l'infrastructure d'Apple ou d'OpenAI), le réseau grand public n'a pas sa place. Le standard de l'industrie repose sur l'orchestrateur distribué **Ray** (souvent couplé au moteur **vLLM** étudié précédemment).

### 🌟 Comment ça marche ?
Ray gère des fermes de serveurs entières. Au lieu du P2P, il repose sur une architecture Maître/Travailleur. La commande `ray symmetric-run` permet par exemple de lancer et synchroniser le moteur vLLM à travers plusieurs serveurs physiques de manière unifiée[^3]. 

Ray orchestre la combinaison de plusieurs stratégies mathématiques :
*   **Tensor Parallelism (TP) :** Découpe les matrices mathématiques d'une même couche entre les GPU *à l'intérieur* d'un serveur (nécessite un bus [[00-lexique/nvlink|NVLink]]).
*   **Pipeline Parallelism (PP) :** Découpe les blocs de couches du modèle *entre* les différents serveurs (nécessite un réseau [[00-lexique/roce|RoCE]] ou InfiniBand).

### 🚀 Cas d'usage : Désagrégation et MoE
En 2026, l'architecture Ray + vLLM permet des optimisations extrêmes, comme la **désagrégation Prefill/Decode** : un serveur spécifique (optimisé pour le calcul pur) s'occupe de lire le prompt initial ([[00-lexique/prefill|Prefill]]), puis transfère le [[00-lexique/kv-cache|KV Cache]] sur le réseau vers un autre serveur (optimisé pour la capacité mémoire) qui va s'occuper de générer la réponse ([[00-lexique/decoding|Decoding]])[^4]. C'est indispensable pour servir efficacement et à grande échelle les modèles Mixture-of-Experts (MoE).

### ⚠️ Les limites
Ray est très complexe à administrer. Il exige une infrastructure de classe entreprise, un stockage partagé, et un réseau IA extrêmement performant configuré spécifiquement pour réduire la latence.

---

## 3. Comparatif opérationnel Exo vs Ray

| Critère | Exo | Ray + vLLM |
| :-- | :-- | :-- |
| **Installation** | `pip install exo` puis `uv run exo` | Ray cluster + vLLM, configuration YAML |
| **Découverte des nœuds** | Automatique (mDNS / Thunderbolt) | Manuelle (IP/DNS ou config explicite) |
| **Réseau recommandé** | Thunderbolt 4/5, Wi-Fi 6E possible | RoCE v2 ou InfiniBand (100/200 Gb) |
| **Matériel cible** | Mac Mini, Mac Studio, PC Linux, AMD GPU | Serveurs rack, NVIDIA H100/H200, A100 |
| **Parallelisme** | Pipeline Parallelism uniquement | TP + PP + désagrégation Prefill/Decode |
| **Monitoring** | Logs texte, pas d'observabilité native | Prometheus, Grafana, traces Ray |
| **Tolérance aux pannes** | Faible (perte d'un nœud = crash) | Forte (Ray redémarre les workers) |
| **Seuil de budget** | < 15 000 € (cluster de bureau) | > 100 000 € (serveur GPU + réseau) |
| **Complexité opérationnelle** | ⭐ (très simple) | ⭐⭐⭐⭐⭐ (expertise HPC requise) |

## 4. Démarrage rapide — Exo sur deux Mac

```bash
# Sur chaque machine du cluster
pip install exo

# Machine 1 (démarrage du cluster P2P)
uv run exo

# Machine 2 (join automatique via mDNS)
uv run exo

# Vérifier que les nœuds se voient
# Exo affiche dans les logs : "Discovered peer: <hostname>"

# Envoyer une requête au cluster (API compatible OpenAI)
curl http://localhost:52415/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b",
    "messages": [{"role": "user", "content": "Combien de nœuds dans ce cluster ?"}]
  }'
```

> [!note] Thunderbolt vs Ethernet pour Exo
> En Wi-Fi ou Ethernet 1 Gb, Exo fonctionne mais les performances chutent drastiquement. Pour des modèles 70B+, privilégiez Thunderbolt 4 (40 Gb/s) ou Thunderbolt 5 (80 Gb/s). Les câbles Thunderbolt créent une interface réseau IP-over-Thunderbolt automatiquement sur macOS.

---

## 📋 Le Conseil de l'Architecte

Pour déployer des agents autonomes on-premise chez des clients :

1.  **En phase de test ou pour un Labo PME :** Si vous devez faire tourner un modèle 70B et que vous possédez deux Mac Studio ou deux PC gamer de 32 Go, **installez Exo**. En 5 minutes, votre cluster est prêt et le modèle tourne sans investissement cloud supplémentaire.
2.  **En production critique multi-utilisateurs :** Oubliez le P2P. Utilisez **Ray Serve avec vLLM** sur des serveurs Linux équipés de GPU dédiés. C'est la seule architecture logicielle qui vous garantira un monitoring précis, un routage intelligent des requêtes concurrentes et une vraie tolérance aux pannes au niveau du datacenter local.

---

## 📚 Sources et Références
[^1]: Exo Labs, *GitHub - exo-explore/exo: Run frontier AI locally* (2026).
[^2]: Particula Tech, *Running DeepSeek V3 671B on M4 Mac Mini Cluster* (Performances via Thunderbolt 5 et Exo), Mars 2026.
[^3]: Anyscale & vLLM Blog, *Streamlined multi-node serving with Ray symmetric-run* (Lancement vLLM multi-nœuds), Novembre 2025.
[^4]: Ray Summit 2025, *Ray + vLLM Efficient Multi Node Orchestration for Sparse MoE Model Serving* (Désagrégation Prefill/Decode, MoE), Novembre 2025.