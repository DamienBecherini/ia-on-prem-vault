---
title: "⚙️ Moteurs d'Inférence : vLLM, Ollama et TensorRT-LLM"
description: Comparatif des moteurs de déploiement locaux en 2026. Quand utiliser GGUF et llama.cpp sur Mac, et quand basculer sur vLLM ou TensorRT-LLM en production.
sidebar:
  order: 1
last_modified: "2026-06-10"
last_verified: "2026-06-09"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] En bref
> Ollama simplifie les tests locaux en quelques minutes. vLLM optimise le débit en production multi-utilisateurs. TensorRT-LLM pousse les GPU NVIDIA au maximum sur datacenter. Le bon moteur dépend de votre usage, pas du modèle.

Avoir les poids d'un grand [[00-lexique/llm|LLM]] et un serveur puissant ne suffit pas. Pour utiliser l'IA, il faut un **moteur d'inférence** capable de charger les poids en [[00-lexique/vram|VRAM]], de gérer le [[00-lexique/kv-cache|KV Cache]] et d'exécuter les calculs matriciels. 

En 2026, l'écosystème s'est fortement spécialisé. Le choix du moteur dicte les performances en [[00-lexique/tokens-per-second|tokens/s]], le temps de réponse initial ([[00-lexique/ttft|TTFT]]) et la capacité à encaisser des requêtes concurrentes.

---

## 1. llama.cpp & Ollama : Les rois du poste de travail

[Ollama](https://ollama.com/) est devenu le standard de fait pour tester des modèles rapidement — un benchmark communautaire du T1 2026 estimait son audience à plus de 50 millions de téléchargements mensuels[^1]. Sous le capot, [[00-lexique/ollama|Ollama]] repose principalement sur le moteur **llama.cpp**, écrit en C/C++ pur.

### 🌟 Les forces
*   **Polyvalence matérielle :** Optimisé pour exploiter la mémoire unifiée des Mac Studio, gérer l'[[00-lexique/offloading|offloading]] entre RAM et GPU sur les postes modestes, et s'exécuter sur presque n'importe quel CPU.
*   **Format [[00-lexique/gguf|GGUF]] :** Utilise des formats de [[00-lexique/quantification|quantification]] agressifs (ex: `Q4_K_M`), permettant de faire tenir des modèles massifs dans une VRAM très limitée sans dépendances complexes[^2].
*   **Simplicité :** Un seul fichier exécutable, une commande `ollama run` et une API compatible OpenAI prête à l'emploi.

### ⚠️ Les limites (Le mur de la production)
L'erreur classique est de déployer Ollama pour servir une application PME avec plusieurs utilisateurs simultanés. Conçu pour le traitement séquentiel, l'architecture sous-jacente s'effondre sous forte concurrence. Au-delà de 5 à 10 utilisateurs simultanés, la latence explose (les requêtes passant souvent de quelques secondes à plus d'une minute)[^1].

---

## 2. vLLM : Le standard de production

[vLLM](https://github.com/vllm-project/vllm) est le moteur Python/C++ open-source de référence pour l'inférence haut débit. Pensé pour les serveurs équipés de puces NVIDIA (et AMD ROCm), [[00-lexique/vllm|vLLM]] est conçu pour maximiser l'utilisation du GPU sous forte charge.

### 🌟 Les forces
*   **[[00-lexique/pagedattention|PagedAttention]] :** vLLM a popularisé cette technique qui gère la mémoire du KV Cache par blocs (comme la mémoire virtuelle d'un OS). Cela réduit la fragmentation mémoire de ~60% à moins de 4% et permet de grouper massivement les requêtes (*Continuous Batching*)[^3].
*   **Haut débit concurrent :** Sur des architectures multi-utilisateurs, vLLM peut délivrer un débit global nettement supérieur à Ollama en charge concurrente — les comparatifs communautaires citent des facteurs de ×5 à ×16 selon la configuration et le modèle[^1][^4].
*   **Support des formats de pointe :** Il gère la quantification de production (FP8, AWQ) via des kernels nativement optimisés pour les architectures NVIDIA Hopper et Blackwell, et gère nativement le [[00-lexique/tensor-parallelism|Tensor Parallelism]] en [[00-lexique/multi-gpu|multi-GPU]][^5].

### ⚠️ Les limites
vLLM n'est pas conçu pour faire de l'offloading sur RAM CPU classique, ni pour le silicium Apple. Il requiert un environnement matériel robuste (GPU dédiés) et une configuration plus fine des paramètres serveurs. 

---

## 3. TensorRT-LLM : L'accélération extrême NVIDIA

[TensorRT-LLM](https://nvidia.github.io/TensorRT-LLM/) est le SDK officiel de NVIDIA pour tirer le maximum physique de ses propres GPU. Il compile le modèle dans un format propriétaire ultra-optimisé (un "engine").

### 🌟 Les forces
*   **Plafond de performance :** Il bat souvent tous les autres moteurs sur les GPU Datacenter (H100, B200) grâce à des techniques comme le *Flash-Decoding*.
*   **FP4 Natif :** Sur les nouvelles puces Blackwell (B200, RTX 5090), TensorRT-LLM supporte nativement le format FP4 pour diviser par deux l'empreinte VRAM par rapport au FP8, tout en conservant une précision de classe Datacenter[^6].
*   **Parallélisme massif :** Il orchestre parfaitement les graphes d'exécution sur des nœuds multi-GPU connectés par [[00-lexique/nvlink|NVLink]].

### ⚠️ Les limites
La compilation d'un moteur TensorRT est lourde (*Ahead-of-Time*), très stricte sur la génération physique du GPU cible, et la courbe d'apprentissage est beaucoup plus ardue que celle de vLLM.

---

## 4. SGLang : Orchestration agentique et génération structurée

[SGLang](https://github.com/sgl-project/sglang) (Structured Generation Language) est un moteur d'inférence open-source développé par LMSys (Berkeley). Apparu comme concurrent direct de vLLM fin 2023, il a pris l'ascendant en 2026 sur deux domaines précis où vLLM reste moins optimisé : les **boucles agentiques** et la **génération JSON contrainte**[^7].

### 🌟 Les forces

*   **[[00-lexique/radixattention|RadixAttention]] — Le cache de préfixe partagé :** SGLang organise le [[00-lexique/kv-cache|KV Cache]] sous forme d'arbre radix (*radix tree*). Lorsque plusieurs requêtes partagent un long préfixe commun — un prompt système, un contexte RAG récupéré, ou un schéma d'outils — ce préfixe n'est calculé qu'une seule fois et réutilisé par toutes les requêtes qui le partagent. Dans une boucle agentique où l'agent appelle un outil, lit le résultat, puis rappelle l'outil plusieurs tours de suite, la majorité du contexte reste identique. SGLang évite de recalculer le KV Cache à chaque tour, ce qui réduit significativement le [[00-lexique/ttft|TTFT]] sur ces charges répétitives[^8].
*   **Génération JSON structurée sans pénalité :** SGLang contraint le LLM à produire une sortie strictement conforme à un schéma JSON défini, sans dégrader la vitesse de génération. C'est une propriété critique pour les architectures où le moteur d'inférence doit communiquer avec un backend applicatif via des appels d'outils typés (*function calling* / *tool calling*)[^7].

### ⚠️ Les limites

*   SGLang est optimisé pour Linux + GPU NVIDIA. Le support AMD ROCm et macOS reste plus limité que celui de vLLM.
*   Sur les benchmarks de **débit brut** (requêtes indépendantes sans préfixe partagé), vLLM reste la référence ou l'équivalent[^9].

### Quand choisir SGLang plutôt que vLLM ?

| Critère | vLLM | SGLang |
| :-- | :-- | :-- |
| Débit brut, requêtes indépendantes | ✅ Référence | Comparable |
| Boucles agentiques, préfixes partagés | ⚠️ Pas de prefix cache natif | ✅ RadixAttention |
| Génération JSON contrainte | ⚠️ Possible, plus lent | ✅ Natif, sans pénalité |
| Compatibilité matérielle (AMD, Mac) | ✅ Large | ⚠️ NVIDIA principalement |
| Maturité écosystème | ✅ Très large | ✅ Mature depuis 2025 |

> [!tip] Règle pratique
> **Déployez vLLM** pour du RAG simple ou de la génération textuelle concurrente. **Basculez sur SGLang** si votre application utilise du *tool calling* intensif, des boucles agentiques avec contexte partagé, ou si vous avez besoin de garanties strictes sur le format JSON des sorties du modèle.

---

## 🔧 Dépannage courant au démarrage de vLLM

Les problèmes suivants sont fréquents lors de la première installation de vLLM. Ils surviennent avant même que le serveur ne réponde à une requête.

| Symptôme | Cause probable | Solution |
| :-- | :-- | :-- |
| `torch.cuda.is_available()` retourne `False` | Mismatch entre la version PyTorch installée et le driver CUDA du système | Réinstaller PyTorch avec la variante CUDA correspondante : `pip install torch --index-url https://download.pytorch.org/whl/cu124` (adapter `cu124` à la version CUDA installée) |
| OOM au chargement — KV Cache trop grand | La longueur de contexte maximale demandée dépasse la VRAM disponible après chargement des poids | Ajouter `--max-model-len 4096` (ou une valeur inférieure) au démarrage de `vllm serve` pour réduire le KV Cache pré-alloué |
| Deux serveurs vLLM en conflit | Le port 8000 est déjà occupé par une instance précédente | Ajouter `--port 8001` pour la deuxième instance ; `lsof -i :8000` / `netstat -tulpn` pour identifier le processus occupant le port |
| Tester rapidement l'API locale | — | Utiliser le client Python OpenAI avec `base_url="http://localhost:8000/v1/"` et `api_key="any"` (vLLM accepte n'importe quelle valeur de clé en mode non sécurisé) |

**Exemple de test rapide depuis Python :**

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1/", api_key="any")
response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Bonjour, tu fonctionnes ?"}],
    max_tokens=64,
)
print(response.choices[0].message.content)
```

> [!warning] vLLM et accélérateurs Tenstorrent
> vLLM standard **n'est pas compatible** avec les accélérateurs Tenstorrent (Wormhole N150/N300, Blackhole). Pour utiliser ces puces, il faut le fork `tenstorrent/vllm`, compilé avec l'environnement `tt-metal` (TT-Forge) assemblé manuellement — procédure non triviale. Ce fork n'est pas maintenu par l'équipe vLLM principale. Source communautaire [^10] — à considérer avant tout achat de matériel Tenstorrent si vLLM est un prérequis de votre stack.

---

## 📋 Le Conseil de l'Architecte

Pour un projet d'agent on-premise déployé chez des clients, le choix du moteur dépend purement du scénario d'architecture :

1.  **Cas d'usage "Copilote Local" (Un utilisateur, poste de bureau) :** 
    Choisissez **Ollama / llama.cpp**. Le support natif des modèles `GGUF` en [[00-lexique/quantification-q4|Q4]] sur Mac ou petit PC Windows permet une excellente réactivité sans infrastructure serveur.
2.  **Cas d'usage "Appliance PME" (10-50 utilisateurs, serveur GPU) :** 
    Basculez **impérativement sur vLLM**. PagedAttention et le continuous batching garantissent que l'IA ne s'effondrera pas lorsque cinq collaborateurs lanceront des requêtes RAG en même temps. Utilisez des poids en précision **AWQ ou FP8**.
3.  **Cas d'usage "Datacenter Souverain" (Gros volume, multi-nœuds) :**
    Utilisez **TensorRT-LLM** derrière le serveur Triton de NVIDIA. C'est le moyen le plus efficace d'amortir le coût des accélérateurs professionnels.
4.  **Cas d'usage "Agents et intégration backend" (tool calling, JSON structuré) :**
    Préférez **[[00-lexique/sglang|SGLang]]**. Sa gestion native du cache de préfixe ([[00-lexique/radixattention|RadixAttention]]) réduit la latence dans les boucles agentiques, et sa génération JSON contrainte garantit la fiabilité des interfaces avec tout backend applicatif.

---

## 📚 Sources et Références

[^1]: Particula Tech, *Ollama vs vLLM: Which LLM Server Actually Fits in 2026* (benchmark communautaire, estimation d'audience et limites de concurrence), Mars 2026. [https://particula.tech/blog/ollama-vs-vllm-comparison](https://particula.tech/blog/ollama-vs-vllm-comparison)
[^2]: J. Wang et al., *Which Quantization Should I Use? A Unified Evaluation of llama.cpp Quantization* (arXiv:2601.14277, GGUF formats), Janvier 2026. [https://arxiv.org/abs/2601.14277](https://arxiv.org/abs/2601.14277)
[^3]: Woosuk Kwon et al., *Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP 2023). [https://arxiv.org/abs/2309.06180](https://arxiv.org/abs/2309.06180)
[^4]: Ayi NEDJIMI Consultants, *LLM Local 2026 : Ollama vs LM Studio vs vLLM* (article de blog, comparaison d'architectures, Continuous Batching), Février 2026. [https://www.ayinedjimi-consultants.fr/ia-llm-local-ollama-lmstudio-vllm.html](https://www.ayinedjimi-consultants.fr/ia-llm-local-ollama-lmstudio-vllm.html)
[^5]: vLLM Project Documentation & Spheron Blog, *vLLM Production Deployment 2026: Multi-GPU Tensor Parallel + FP8* (Model Runner V2, Hopper/Blackwell support), Mai 2026. [https://docs.vllm.ai/en/stable/serving/parallelism_scaling/](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/) · [https://www.spheron.network/blog/vllm-production-deployment-2026/](https://www.spheron.network/blog/vllm-production-deployment-2026/)
[^6]: NVIDIA, *TensorRT-LLM Documentation* (FP4 Support, Blackwell optimization, DeepSeek-R1 performance records), Mai 2026. [https://nvidia.github.io/TensorRT-LLM/](https://nvidia.github.io/TensorRT-LLM/)
[^7]: SGLang Project, *SGLang — Fast Serving Framework for LLMs and VLMs* (RadixAttention, structured output). [https://github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)
[^8]: Lianmin Zheng et al., *Efficiently Programming Large Language Models using SGLang* (RadixAttention, prefix cache, TTFT reduction). [https://lmsys.org/blog/2024-01-17-sglang/](https://lmsys.org/blog/2024-01-17-sglang/)
[^9]: SGLang Contributors, *SGLang vs vLLM — scaling benchmark under high concurrency* (throughput comparison). [https://github.com/sgl-project/sglang/issues/21061](https://github.com/sgl-project/sglang/issues/21061)
[^10]: Tenstorrent, *vLLM integration with TT-Metal* (fork tenstorrent/vllm, tt-metal, incompatibilité vLLM standard), 2025. [https://github.com/tenstorrent/tt-metal/blob/main/tech_reports/LLMs/vLLM_integration.md](https://github.com/tenstorrent/tt-metal/blob/main/tech_reports/LLMs/vLLM_integration.md)