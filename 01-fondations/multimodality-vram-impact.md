---
title: "🖼️ Multimodalité : Impact Matériel (VRAM & KV Cache)"
description: Ce qui change dans votre infrastructure quand vous traitez des images, des documents scannés ou de l'audio — encodeurs visuels, coût VRAM, interaction avec le KV Cache, et carte des blueprints concernés.
sidebar:
  order: 6
last_modified: "2026-06-05"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> [!tip] En bref
> Ajouter de la vision à un LLM ajoute un **encodeur visuel** qui consomme 1–4 Go de VRAM et transforme chaque image en centaines à milliers de tokens — l'équivalent d'un long texte en termes de KV Cache. Une image 1024×1024 peut occuper autant d'espace de contexte qu'un document de 2 000 mots.

---

## Pourquoi la multimodalité change le calcul matériel

Un LLM pur traite du texte : chaque token est un vecteur numérique issu d'un vocabulaire. La complexité mémoire est prévisible et bien documentée.

Un **VLM (Vision Language Model)** ajoute un composant amont : un **encodeur visuel** qui transforme les pixels d'une image en une séquence de vecteurs que le LLM peut "lire". Ce chemin supplémentaire a des conséquences directes sur la [[00-lexique/vram|VRAM]], le [[00-lexique/kv-cache|KV Cache]] et la latence.

---

## L'encodeur visuel : anatomie et empreinte VRAM

### Comment ça fonctionne

```
Image (pixels)
    │
    ▼
Encodeur visuel (ex. CLIP-ViT-L/14, SigLIP)
    │  découpe l'image en patches (ex. 14×14 px)
    │  encode chaque patch en vecteur
    ▼
Séquence de visual tokens (ex. 256 à 1 024 tokens)
    │
    ▼
Projecteur (MLP de connexion) ──► LLM backbone (Qwen, Mistral, LLaMA…)
```

L'encodeur et le projecteur sont des poids supplémentaires chargés **en plus** du LLM backbone.

### Empreinte VRAM approximative par famille

| Modèle VLM | LLM backbone | Encodeur visuel | VRAM totale (FP16) | Visual tokens / image |
| :-- | :-- | :-- | :-- | :-- |
| LLaVA 1.6 (Mistral 7B) | 7B | CLIP-ViT-L/14 (~0,3 Go) | ~15 Go | 256–576 |
| Qwen2-VL 7B | 7B | SigLIP-SO400M (~0,4 Go) | ~16 Go | 256–1 024 (dynamique) |
| Qwen2-VL 72B | 72B | SigLIP-SO400M (~0,4 Go) | ~144 Go | 256–1 024 (dynamique) |
| Pixtral 12B (Mistral) | 12B | Vision encoder 400M (~0,8 Go) | ~26 Go | jusqu'à 1 024 |
| Gemma 3 27B Vision | 27B | SigLIP (~0,4 Go) | ~54 Go | 256–729 |

*Sources : LLaVA [^1] · Qwen2-VL [^2]*

> [!note] Ordres de grandeur
> L'encodeur visuel lui-même pèse généralement **0,3 à 1 Go** de VRAM — négligeable comparé au backbone. L'impact mémoire dominant vient des **visual tokens injectés dans le KV Cache**, pas de l'encodeur.

---

## L'impact sur le KV Cache

Le KV Cache stocke les états intermédiaires de chaque token du contexte. Les visual tokens s'y comportent **exactement comme des tokens texte** : ils occupent la même quantité d'espace par token.

### Formule de référence

Pour un modèle à précision FP16 :

```
KV Cache par token = 2 (K+V) × nombre_de_couches × dimension_tête × 2 octets
```

Pour un LLM 7B typique (32 couches, 128 dim de tête) :

```
≈ 2 × 32 × 128 × 2 = 16 384 octets ≈ 16 Ko par token
```

### Comparaison texte vs image

| Input | Tokens typiques | KV Cache estimé (7B) |
| :-- | :-- | :-- |
| Document texte 500 mots | ~650 tokens | ~10 Mo |
| Image 512×512 (LLaVA 1.6) | ~256 tokens | ~4 Mo |
| Image 1024×1024 (LLaVA 1.6 HD) | ~576 tokens | ~9 Mo |
| Image 1024×1024 (Qwen2-VL dynamique) | ~1 024 tokens | ~16 Mo |
| PDF 10 pages converti en images | ~5 000–10 000 tokens | ~80–160 Mo |

*Source : vLLM metrics [^4]*

> [!warning] L'effet cumulatif dans un batch
> En production avec plusieurs requêtes concurrentes (vLLM continuous batching), chaque image dans le batch occupe son slot KV Cache. Dix images 1024×1024 simultanées sur un Qwen2-VL 7B : ~160 Mo de KV Cache pour les images seules, avant tout contexte texte.

---

## Audio : Whisper comme pré-traitement

La transcription audio (réunions, dictées, appels clients) est souvent mentionnée avec la vision, mais son architecture est fondamentalement différente.

**Whisper n'est pas un VLM.** C'est un modèle sequence-to-sequence indépendant :

```
Audio (WAV/MP3)
    │
    ▼
Whisper (modèle distinct — 39 Mo à 1,5 Go selon taille)
    │  transcrit en texte
    ▼
Texte (tokens normaux)
    │
    ▼
LLM backbone (si analyse du transcript est souhaitée)
```

### Empreinte VRAM Whisper

| Modèle Whisper | Paramètres | VRAM |
| :-- | :-- | :-- |
| tiny | 39 M | ~80 Mo |
| base | 74 M | ~145 Mo |
| small | 244 M | ~480 Mo |
| medium | 769 M | ~1,5 Go |
| large-v3 | 1,5 B | ~3 Go |

*Source : OpenAI Whisper [^3]*

> [!tip] Whisper peut tourner en CPU
> Pour la transcription non-temps-réel (batch), Whisper fonctionne correctement sur CPU avec `whisper.cpp`. La VRAM GPU n'est mobilisée que si vous forcez la transcription GPU pour la latence temps réel.

**Conséquence architecturale :** Whisper peut coexister avec un VLM sur la même machine sans compétition VRAM significative, à condition de ne pas les exécuter simultanément sur GPU. En pipeline asynchrone (transcription → résumé LLM), une séquence est parfaitement viable sur un Blueprint B.

---

## Carte des blueprints

| Blueprint | VLM faisable ? | Modèle recommandé | Contrainte principale |
| :-- | :-- | :-- | :-- |
| A — Labo Dev (RTX 4090, 24 Go) | ✅ Oui | LLaVA 1.6 7B, Qwen2-VL 7B | Images HD limitées en batch simultané |
| A — Labo Dev (mémoire unifiée 64 Go) | ✅ Oui | Qwen2-VL 7B ou Pixtral 12B | Bande passante mémoire unifée = facteur limitant |
| B — Appliance PME (128 Go mémoire unifiée) | ✅ Oui | Qwen2-VL 7B ou 72B Q4 | 70B en vision = lent, mais fonctionnel |
| C — Cluster Bureau (4× 64 Go unifiés) | ✅ Oui | Pixtral 12B, Qwen2-VL 72B distribué | Exo requis pour distribuer un 72B vision |
| D — Datacenter (8× GPU 80 Go) | ✅ Oui | Qwen2-VL 72B, Pixtral Large | Cas d'usage production haute concurrence |

> [!note] Budgétisation VRAM
> Pour ajouter de la vision à votre blueprint, comptez : **VRAM backbone + 0,5–1 Go (encodeur) + 20–30 % de marge KV Cache supplémentaire** pour les requêtes visuelles en batch.

---

## Points de vigilance en production

1. **Context length surprises** : une requête "simple" (image + question courte) peut consommer 1 500–2 000 tokens, là où la question texte équivalente n'en utilisait que 50. Adapter `max_model_len` dans vLLM en conséquence.

2. **Prefill asymétrique** : le prefill d'une image (passage de tous les visual tokens dans le transformeur) est computationnellement plus dense qu'un prefill texte équivalent en tokens. La latence du premier token (TTFT) est plus élevée.

3. **Résolution et découpe** : les VLMs modernes (LLaVA 1.6 HD, Qwen2-VL) adaptent dynamiquement le nombre de visual tokens à la résolution de l'image. Envoyer des images non redimensionnées peut multiplier le coût par 4–8×.

4. **Quantification partielle** : les encodeurs visuels supportent mal la quantification agressive (Q4 ou Q2). Si vous quantifiez le backbone pour économiser de la VRAM, gardez l'encodeur visuel en FP16 ou Q8.

---

## Voir aussi

- [[00-lexique/kv-cache|KV Cache]] — mécanique détaillée du cache d'attention
- [[00-lexique/vram|VRAM]] — empreinte mémoire des modèles
- [[01-fondations/quantization-4bit-8bit|🗜️ Quantification 4-bit & 8-bit]] — réduire l'empreinte VRAM
- [[01-fondations/kv-cache-and-context|🧠 KV Cache et fenêtre de contexte]]
- [[01-fondations/unified-memory-vs-ram-vs-vram|💾 Mémoire unifiée vs RAM vs VRAM]]
- [[04-blueprints/scenario-b-sme-appliance|🏢 Scénario B — Appliance PME]]

---

## Sources et Références

[^1]: Liu et al., *Visual Instruction Tuning (LLaVA)* (architecture : encodeur CLIP-ViT-L/14 + projecteur MLP + LLM backbone ; le poids de l'encodeur VRAM est calculé à partir de la taille des paramètres publiés). [https://arxiv.org/abs/2304.08485](https://arxiv.org/abs/2304.08485)
[^2]: Alibaba Cloud, *Qwen2-VL model documentation* (tokens visuels dynamiques selon résolution, architecture SigLIP). [https://huggingface.co/Qwen/Qwen2-VL-7B-Instruct](https://huggingface.co/Qwen/Qwen2-VL-7B-Instruct)
[^3]: OpenAI, *Whisper model card* (tailles tiny à large-v3, paramètres et empreinte mémoire indicative). [https://github.com/openai/whisper](https://github.com/openai/whisper)
[^4]: vLLM Project, *Production Metrics — KV cache usage* (comportement du KV Cache en batch continu). [https://docs.vllm.ai/en/stable/serving/metrics.html](https://docs.vllm.ai/en/stable/serving/metrics.html)
