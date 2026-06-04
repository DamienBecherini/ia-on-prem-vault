---
title: "🧩 Stations Multi-GPU : NVIDIA, PCIe et VRAM"
description: "Comprendre quand plusieurs GPU discrets aident vraiment l'inférence IA on-premise, et pourquoi l'interconnexion décide souvent plus que le nombre de cartes."
sidebar:
  order: 2
---

Après la [[02-materiel/apu-and-unified-memory|mémoire unifiée]], l'autre grande famille de machines IA on-premise est la **station multi-GPU** : plusieurs cartes NVIDIA dans une même tour, ou plusieurs accélérateurs dans un serveur.

L'idée paraît simple : additionner la [[00-lexique/vram|VRAM]] de plusieurs cartes pour charger des modèles plus gros. En pratique, le **multi-GPU** n'est pas un simple “pool de mémoire”. Il faut choisir un mode de parallélisme, accepter des échanges entre cartes, et comprendre si ces échanges passent par [[00-lexique/pcie|PCIe]], [[00-lexique/nvlink|NVLink]] ou un fabric [[00-lexique/rdma|RDMA]] / [[00-lexique/roce|RoCE]].

> 🔗 **Lien connexe :** pour le dimensionnement modèle + cache, voir [[01-fondations/quantization-4bit-8bit|Quantification]] et [[01-fondations/kv-cache-and-context|KV Cache]].

---

## 🎯 Pourquoi du multi-GPU ?

Une station multi-GPU répond à trois besoins différents :

1. **Capacité mémoire :** charger un modèle qui ne tient pas sur une seule carte.
2. **Débit :** servir plus de requêtes en parallèle, souvent en répliquant le modèle.
3. **Latence :** accélérer un gros modèle en répartissant ses calculs sur plusieurs GPU.

Ces trois objectifs ne demandent pas la même architecture. Une machine à deux cartes peut être excellente pour servir deux utilisateurs indépendants, mais décevante pour accélérer un seul modèle si les cartes ne communiquent que par PCIe.

---

## 🧱 Le paysage matériel : workstation vs serveur

### 1. GPU workstation PCIe

Les cartes professionnelles de workstation maximisent la flexibilité : elles entrent dans des stations x86 classiques, utilisent CUDA, et restent compatibles avec les moteurs d'inférence courants.

| Carte | Mémoire | Bande passante mémoire | Interface | Puissance |
| :--- | :--- | :--- | :--- | :--- |
| NVIDIA RTX 6000 Ada | 48 Go GDDR6 ECC | 960 Go/s (datasheet) | PCIe 4.0 x16 | 300 W |
| NVIDIA RTX PRO 6000 Blackwell Workstation | 96 Go GDDR7 ECC | 1 792 Go/s | PCIe 5.0 | 600 W |

La RTX 6000 Ada reste une base workstation solide avec 48 Go de GDDR6 ECC et PCIe Gen 4 x16 [^1]. La RTX PRO 6000 Blackwell double la capacité à 96 Go, passe à la GDDR7 ECC, annonce 1 792 Go/s de bande passante mémoire et le support PCIe Gen 5 [^2].

Ce sont des cartes très intéressantes pour l'on-premise car elles offrent de la **VRAM locale rapide** et un écosystème logiciel mature. Mais dans une station multi-GPU standard, les échanges entre cartes dépendent exclusivement du bus PCIe.

> ⚠️ **Piège fréquent — NVLink sur workstation : c'est physiquement impossible**
> Les cartes RTX workstation (RTX 6000 Ada, RTX PRO 6000 Blackwell) et grand public (RTX 40xx, RTX 50xx) **ne disposent plus de connecteur NVLink physique** depuis la génération Ada Lovelace. NVIDIA a supprimé les ponts NVLink externes de toutes ses gammes desktop et workstation.
> Il est donc **impossible d'acheter deux RTX PRO 6000 et de les relier via NVLink** : le connecteur n'existe tout simplement pas sur ces cartes [^1][^2].
> NVLink est aujourd'hui **exclusivement réservé aux GPU serveur** en format SXM (A100, H100, H200, B200) et aux systèmes HGX/DGX — une catégorie de machines entièrement différente, qui commence à plus de 100 000 €.

### 2. Serveurs NVLink / NVSwitch

Les serveurs datacenter NVIDIA changent de catégorie : dans un système HGX/DGX, les GPU peuvent communiquer via **NVLink** et **NVSwitch** plutôt que seulement via PCIe.

NVIDIA décrit les systèmes HGX H100/H200 à huit GPU comme des machines où chaque GPU Hopper peut communiquer à **900 Go/s** avec les autres via NVLink/NVSwitch, avec un fabric non bloquant dans le nœud [^3]. Pour Blackwell, NVIDIA indique que la cinquième génération de NVLink double la vitesse par GPU à **1 800 Go/s** dans les systèmes adaptés [^3].

Ce niveau d'interconnexion n'est pas un détail : il rend le **tensor parallelism** beaucoup plus viable, car les GPU doivent échanger des activations et résultats intermédiaires à chaque génération.

---

## 🛣️ PCIe : le goulot discret

PCIe est le bus généraliste qui relie CPU, GPU, SSD et cartes réseau. PCI-SIG indique que PCIe 5.0 monte à **32 GT/s par lane**, soit le double de PCIe 4.0 [^4].

Pour une carte GPU en **x16**, cela donne un ordre de grandeur théorique d'environ **64 Go/s par direction** en PCIe 5.0, avant de tenir compte des contraintes réelles de plateforme. C'est élevé pour de l'I/O généraliste, mais très faible comparé à la bande passante interne d'une carte GPU moderne : 960 Go/s sur RTX 6000 Ada, 1 792 Go/s sur RTX PRO 6000 Blackwell [^1][^2].

```mermaid
graph TD
    A[RAM système] -->|PCIe x16: dizaines de Go/s| B[GPU 0 - VRAM locale]
    A -->|PCIe x16: dizaines de Go/s| C[GPU 1 - VRAM locale]
    B -. echanges inter-GPU via PCIe .-> C
    B -->|GDDR/HBM: centaines a milliers de Go/s| D[Calcul GPU 0]
    C -->|GDDR/HBM: centaines a milliers de Go/s| E[Calcul GPU 1]
```

Conséquence : si un moteur d'inférence doit beaucoup synchroniser deux GPU via PCIe, l'accélération attendue peut disparaître. Le multi-GPU PCIe fonctionne mieux quand les communications sont rares, quand les requêtes sont indépendantes, ou quand le moteur sait choisir un parallélisme adapté.

---

## 🧠 Les modes de parallélisme

### Data Parallel : plusieurs copies du modèle

Le **data parallel** réplique le modèle sur plusieurs GPU. Chaque carte sert des requêtes différentes.

* **Avantage :** très efficace pour augmenter le débit multi-utilisateur si le modèle tient sur une carte.
* **Limite :** la VRAM ne s'additionne pas pour un seul modèle, car chaque GPU garde sa propre copie.

TensorRT-LLM décrit ce mode comme adapté aux grands lots et scénarios de débit élevé [^5].

### Tensor Parallel : un modèle coupé dans chaque couche

Le **tensor parallelism** découpe les poids d'une même couche sur plusieurs GPU. C'est le mode intuitif quand un modèle est trop gros pour une seule carte.

vLLM recommande ce mode quand le modèle ne tient pas sur un GPU mais tient dans un nœud multi-GPU ; on configure par exemple `--tensor-parallel-size 4` pour quatre GPU [^6]. TensorRT-LLM décrit aussi le TP comme un sharding des poids à travers les GPU [^5].

* **Avantage :** peut réduire la pression VRAM par GPU et exploiter plusieurs bandes passantes mémoire.
* **Limite :** demande des communications fréquentes ; NVLink/NVSwitch aide beaucoup, PCIe peut devenir limitant.

### Pipeline Parallel : le modèle coupé par blocs de couches

Le **pipeline parallelism** distribue des groupes de couches sur plusieurs GPU. Les activations passent d'une carte à l'autre.

vLLM recommande de combiner tensor parallel et pipeline parallel quand le modèle dépasse un seul nœud, avec `tensor_parallel_size` pour les GPU par nœud et `pipeline_parallel_size` pour le nombre de nœuds [^6]. TensorRT-LLM liste aussi ce mode comme stratégie centrale [^5].

* **Avantage :** plus tolérant aux interconnexions lentes que le TP pur dans certains cas.
* **Limite :** peut créer des “bulles” où certains GPU attendent, surtout avec de petits lots.

---

## ⚖️ Choisir entre APU, mono-GPU, multi-GPU PCIe et serveur NVLink

| Besoin | Architecture souvent rationnelle | Pourquoi |
| :--- | :--- | :--- |
| LLM 70B quantifié, faible bruit, grande RAM | APU / mémoire unifiée | Simple, grande capacité, pas de copie RAM→VRAM |
| Modèle qui tient en 48–96 Go VRAM | Mono-GPU workstation | Simple, rapide, peu de synchronisation |
| Plusieurs utilisateurs / plusieurs modèles | Multi-GPU en réplication | Chaque GPU sert une charge indépendante |
| Modèle trop gros pour une carte, même nœud | Multi-GPU avec TP/PP | Possible si le moteur supporte le sharding |
| Très gros modèles, faible latence, production | Serveur NVLink/NVSwitch | Fabric inter-GPU adapté aux communications fréquentes |

Le piège classique est d'acheter “2 × 48 Go” en pensant obtenir une carte virtuelle de 96 Go. C'est seulement vrai si le moteur sait répartir le modèle et si l'interconnexion ne détruit pas le gain.

---

## 📋 Le Conseil de l'Architecte

Pour un déploiement souverain on-premise :

1. **Commencer par le besoin de service, pas par le nombre de GPU.** Un seul utilisateur sur un gros modèle dense n'a pas les mêmes contraintes qu'un serveur multi-utilisateur.
2. **Privilégier le mono-GPU quand le modèle tient.** Une RTX PRO 6000 Blackwell 96 Go peut être plus simple qu'une station 2 × 48 Go pour un modèle qui tient dans 96 Go [^2].
3. **Utiliser le multi-GPU PCIe pour le débit.** Plusieurs cartes peuvent servir plusieurs répliques ou plusieurs modèles avec peu de communication entre elles.
4. **Réserver le tensor parallel exigeant aux interconnexions rapides.** vLLM et TensorRT-LLM supportent le TP, mais les docs insistent sur l'importance du réseau/interconnect pour éviter que les communications dominent [^5][^6].
5. **Ne pas confondre station et datacenter.** NVLink/NVSwitch change radicalement le profil, mais il appartient surtout aux plateformes serveur NVIDIA compatibles [^3].

---

## 📚 Sources et Références

[^1]: NVIDIA, *RTX 6000 Ada Generation Graphics Card* (48 Go GDDR6 ECC, PCIe Gen 4 x16, 300 W). [https://www.nvidia.com/en-us/products/workstations/rtx-6000/](https://www.nvidia.com/en-us/products/workstations/rtx-6000/)
[^2]: NVIDIA, *RTX PRO 6000 Blackwell Workstation Edition* (96 Go GDDR7 ECC, 1 792 Go/s, PCIe Gen 5, 600 W). [https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/)
[^3]: NVIDIA Technical Blog, *NVIDIA NVLink and NVIDIA NVSwitch Supercharge Large Language Model Inference* (NVLink/NVSwitch, 900 Go/s Hopper, 1 800 Go/s Blackwell). [https://developer.nvidia.com/blog/nvidia-nvlink-and-nvidia-nvswitch-supercharge-large-language-model-inference/](https://developer.nvidia.com/blog/nvidia-nvlink-and-nvidia-nvswitch-supercharge-large-language-model-inference/)
[^4]: PCI-SIG, *PCI Express 5.0 FAQ* (32 GT/s par lane, double PCIe 4.0). [https://pcisig.com/faq?field_category_value%5B%5D=pci_express_5.0](https://pcisig.com/faq?field_category_value%5B%5D=pci_express_5.0)
[^5]: NVIDIA TensorRT-LLM, *Parallelism in TensorRT LLM* (TP, PP, DP, EP, CP). [https://nvidia.github.io/TensorRT-LLM/features/parallel-strategy.html](https://nvidia.github.io/TensorRT-LLM/features/parallel-strategy.html)
[^6]: vLLM, *Parallelism and Scaling* (tensor parallel, pipeline parallel, Ray, multiprocessing, GPUDirect RDMA). [https://docs.vllm.ai/en/stable/serving/parallelism_scaling/](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/)

