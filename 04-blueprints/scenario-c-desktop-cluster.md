---
title: "🖥️ Scénario C : Le Cluster Bureau (Exo & Thunderbolt)"
description: Le blueprint de l'évolutivité. Relier plusieurs Mac Mini ou PC compacts via Thunderbolt pour exécuter des modèles massifs inaccessibles sur une seule machine.
sidebar:
  order: 3
---

Le [[04-blueprints/scenario-b-sme-appliance|Scénario B]] (l'Appliance) a un défaut majeur : sa mémoire est figée. Si le besoin de votre client évolue et qu'il souhaite déployer un modèle [[00-lexique/moe|MoE]] colossal de plus de 400 milliards de paramètres (nécessitant plus de 300 Go de mémoire), aucune machine de bureau unique au monde ne pourra l'accueillir.

Avant 2025, la seule solution était de louer un serveur cloud ou d'acheter une baie Datacenter hors de prix. Aujourd'hui, l'architecture logicielle permet de fusionner plusieurs petites machines abordables : c'est le **Cluster de Bureau**.

---

## 🏗️ L'Architecture Matérielle

L'idée est de créer une "ferme" de calcul posée sur une étagère.
*   **Les Nœuds :** 4 à 8 machines compactes. Le standard absolu en 2026 pour ce scénario est le **Mac Mini M4 Pro** (équipé de 64 Go de RAM unifiée chacun) ou des Mini-PC AMD Ryzen récents.
*   **Le Réseau :** C'est le cœur du système. Pour éviter que le transfert de données ne tue les performances, les machines sont reliées en guirlande (Daisy-Chain) ou via un hub avec des câbles **[[00-lexique/thunderbolt|Thunderbolt 4 ou 5]]**, qui offrent des débits bidirectionnels allant jusqu'à 80 Gb/s.
*   **Capacité Totale :** Avec 6 Mac Mini de 64 Go, vous obtenez un cluster silencieux avec **384 Go de mémoire unifiée agrégée**.

**Budget estimé (2026) :** ~10 000 € à 15 000 € (pour un cluster de 4 à 6 machines). C'est environ 10 fois moins cher qu'un serveur NVIDIA DGX équivalent en VRAM.

---

## ⚙️ La Stack Logicielle et le Mécanisme

Ce miracle matériel est rendu possible par l'orchestrateur local **[[00-lexique/exo|Exo]]** (étudié dans le chapitre sur le [[03-stack-logicielle/clustering-exo-and-ray|Clustering IA]]).

1.  Le moteur Exo s'installe sur tous les Mac Mini.
2.  Ils se découvrent automatiquement via le réseau Thunderbolt (qui simule une connexion réseau locale ultra-rapide IP-over-Thunderbolt).
3.  Le LLM massif (ex: DeepSeek V3 671B) est découpé en tranches selon le principe du **[[00-lexique/pipeline-parallelism|Pipeline Parallelism]]**.
4.  Le Mac n°1 calcule les 10 premières couches du réseau de neurones, envoie son résultat brut via Thunderbolt au Mac n°2, qui calcule les 10 couches suivantes, et ainsi de suite.

### Les Performances Attendues
Le gain est purement capacitaire : **vous ne gagnez pas en vitesse, vous gagnez le droit de faire tourner le modèle**.
La latence du réseau, même en Thunderbolt, est infiniment plus lente que la vitesse interne de la RAM. Sur un cluster de 8 Mac Mini faisant tourner un modèle de 600B+ quantifié, les benchmarks communautaires disponibles indiquent une vitesse de génération de l'ordre de **3 à 5 [[00-lexique/tokens-per-second|tokens/s]]**[^1].

---

## Le Piège de la Latence (TTFT)

> [!warning] Latence avant le premier token
> Le plus gros problème de cette architecture n'est pas le débit de lecture, mais le **[[00-lexique/ttft|TTFT]]** (Time To First Token). 
> Pendant la phase de lecture du prompt (le Prefill), une immense quantité de données doit transiter entre les machines. Si vous envoyez un document de 50 pages à analyser à votre cluster, le ping-pong réseau entre les 6 Mac Mini peut prendre **plusieurs dizaines de secondes** avant que le premier mot de la réponse n'apparaisse à l'écran. 

---

## 📋 Le Verdict de l'Architecte

### ✅ Quand utiliser ce Blueprint ?
*   **Prototypage de modèles frontières :** Pour des équipes de chercheurs ou d'ingénieurs qui doivent absolument tester des LLM monumentaux (Grok, DeepSeek, Llama 400B) sans que la donnée ne sorte de l'entreprise.
*   **Traitement en arrière-plan :** Parfait pour de l'analyse documentaire asynchrone (où la latence n'a aucune importance).
*   **Évolutivité budgétaire :** Vous pouvez commencer avec 2 machines et en ajouter une 3ème l'année suivante pour augmenter votre capacité VRAM.

### ❌ Quand fuir ce Blueprint ?
*   **Pour un assistant RAG conversationnel en temps réel.** Attendre 45 secondes pour le premier mot après avoir posé une question sur un PDF va frustrer vos utilisateurs.
*   **Pour servir de nombreux collaborateurs simultanément.** Le réseau Thunderbolt et le Pipeline Parallelism gèrent très mal les requêtes concurrentes massives. Si vous devez servir 50 utilisateurs en temps réel sur un modèle géant, il faut basculer sur un véritable réseau Datacenter (RoCE/InfiniBand) et des serveurs multi-GPU — c'est l'objet du **[[04-blueprints/scenario-d-datacenter|🏭 Scénario D : Datacenter]]**.

---

## 📊 Monitoring recommandé

Sur un cluster Exo, le monitoring est plus manuel qu'en production datacenter, mais quelques commandes couvrent l'essentiel.

**Sur chaque nœud Mac :**

```bash
# Charge GPU et mémoire unifiée (macOS)
sudo powermetrics --samplers gpu_power -i 1000 | grep -E "GPU|ANE"

# Activité réseau Thunderbolt
nettop -m tcp -J bytes_in,bytes_out
```

**Via Ollama (si utilisé comme frontend) :**

```bash
# Statut des modèles chargés
curl http://localhost:11434/api/tags

# Métriques de génération dans les logs
ollama logs
```

**Indicateurs clés à surveiller :**

| Métrique | Seuil d'alerte | Outil |
| :-- | :-- | :-- |
| TTFT | > 30 s sur prompt court | logs Exo |
| Tokens/s | < 2 tok/s | logs Exo |
| Mémoire unifiée par nœud | > 90 % | `vm_stat` / Activity Monitor |
| Bande passante Thunderbolt | > 70 Gb/s soutenu | `nettop` |

> [!note] Monitoring avancé
> Pour un monitoring centralisé (Prometheus + Grafana), le projet communautaire [ollama-exporter](https://github.com/marcboeker/go-ollama) expose des métriques compatibles. Non officiel — à valider avant usage en production.

### Storage Wall — temps de rechargement du modèle

> [!warning] SLA et redémarrages
> Un redémarrage du cluster Exo (crash, mise à jour) implique de recharger le modèle depuis le SSD vers la mémoire unifiée de chaque nœud. Pour un modèle 70B Q4 (~40 Go par nœud) sur un SSD PCIe 3.0 (~2,5 Go/s réels) :
>
> **Temps de rechargement estimé :** ~16 secondes par nœud, mais si les nœuds rechargent en séquence, le cluster peut rester indisponible **30 à 60 secondes** avant d'être opérationnel.
>
> **Recommandation :** Privilégier un SSD NVMe PCIe 4.0 ou 5.0 pour réduire ce temps de démarrage à froid. Sur un cluster de 3 Mac Studio, le rechargement parallèle sur Thunderbolt 5 permet de ramener ce délai à < 10 secondes.

---

## 📚 Sources et Références

[^1]: Particula Tech, *Running DeepSeek V3 671B on M4 Mac Mini Cluster* (Performances via Thunderbolt 5 et Exo, Pipeline Parallelism constraints), Mars 2026.