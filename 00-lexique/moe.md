---
title: MoE
description: Mixture of Experts — architecture où seuls certains sous-réseaux sont activés par token, permettant des modèles énormes avec un coût d'inférence maîtrisé.
aliases:
  - Mixture of Experts
tags:
  - lexique
  - fondations
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Opus 5.5"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Définition courte

Architecture de réseau de neurones où le modèle est divisé en plusieurs "experts" spécialisés. Pour chaque token, un mécanisme de routage n'active qu'un petit sous-ensemble d'experts — ce qui réduit le coût de calcul par rapport à un modèle dense de même taille.

## 📖 Définition détaillée

Dans un modèle dense classique (Llama, Mistral…), **tous les paramètres** sont activés pour chaque token. Dans un MoE, seuls les **top-k experts** (de 2 sur 8 pour Mixtral à 16 sur 896 pour Kimi K3[^2]) participent à chaque calcul.

Exemples concrets (état au T4 2026) :

| Modèle | Paramètres totaux | Paramètres actifs/token | VRAM requise (Q4) |
| :-- | :-- | :-- | :-- |
| Llama 3.1 70B (dense) | 70 B | 70 B | ~40 Go |
| DeepSeek-V4.1-Flash (MoE, MIT) | 552 B + 196 B de mémoire Engram | 8 B (prefill) / 16 B (decode) | ~750 Go en FP8 (nœud 8 GPU)[^1] |
| Kimi K3 (MoE, licence custom) | 2 800 B | 104 B (16 experts sur 896) | ~1,4 To en MXFP4 natif[^2] |
| Qwen3-30B-A3B (MoE, Apache 2.0) | ~30 B | ~3 B actifs (8 experts sur 128) | ~18 Go en Q4[^3] |
| Nemotron 3.5 Lightning 30B-A3B (hybride Mamba-2 + MoE, OpenMDW) | ~30 B | ~3 B actifs | ~22 Go en NVFP4 officiel[^4] |
| GLM-5.3-Flash (MoE, MIT) | 320 B | 18 B actifs | ~320 Go en FP8 (nœud 8 GPU)[^5] |

Le MoE offre donc la **qualité d'un grand modèle** avec le **coût de calcul d'un modèle plus petit** — mais exige de charger **tous les experts en VRAM** même si la plupart sont inactifs.

## 💡 Pourquoi c'est important en IA on-premise

Les MoE de petite taille active (Qwen3-30B-A3B, Nemotron 3.5 Lightning, gpt-oss-20b[^3][^4][^6]) sont particulièrement intéressants sur les APU : ils offrent une bonne qualité de réponse avec des besoins VRAM acceptables et un bon débit de génération.

Pour les MoE géants (DeepSeek V4.1 : > 750 Go en FP8 ; Kimi K3 : > 1,4 To même en 4-bit natif ; le DeepSeek V3 de 2024 pesait déjà 404 Go en Q4_K_M), il faut un nœud 8 GPU ou un cluster multi-nœuds — les scénarios C ou D[^1][^2].

Attention aux licences : plusieurs MoE frontière ouverts de 2026 (Kimi K3, GLM-5.3, Qwen3.8-2.4T-A95B) sortent sous des licences custom à lire avant tout usage commercial. La règle n'est pas absolue : depuis septembre 2026, MiMo-V2.6-Pro de Xiaomi (1,02T paramètres dont 42B actifs) est publié sous MIT[^8], et la plupart des MoE de taille petite à intermédiaire (Qwen3-30B-A3B, GLM-5.3-Flash, DeepSeek V4 / V4.1, Nemotron 3.5) restent en Apache 2.0, MIT ou OpenMDW. Sur Ollama, `kimi-k3:cloud` ou `glm-5.2:cloud` sont des tags **hébergés**, pas des poids téléchargeables (voir [[03-stack-logicielle/choose-your-model|🗺️ Choisir son modèle]]).

## ⚠️ Pièges fréquents

- Comparer un MoE "671B" à un dense "70B" en croyant que le dense est forcément plus rapide : le débit dépend des paramètres **actifs**, pas totaux.
- Charger partiellement un MoE : si tous les experts ne tiennent pas en VRAM, le swap est catastrophique car les experts absents sont convoqués de façon non-prévisible. Exception notable : les embeddings n-gram de Qwen3.8-Flash-Next (51 B) sont conçus pour être déchargés en RAM sans ce coût, contrairement aux experts[^7].
- Sous-estimer la VRAM requise : tous les poids doivent être chargés même si seuls 2/64 experts sont activés par token.

## 📚 Pour comprendre en profondeur

- [[01-fondations/quantization-4bit-8bit|🗜️ La Quantification]]
- [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]]

## 🔗 Voir aussi

- [[00-lexique/llm|LLM]]
- [[00-lexique/quantification|Quantification]]
- [[00-lexique/tokens-per-second|Tokens par seconde]]
- [[00-lexique/vram|VRAM]]

[^1]: DeepSeek AI, *DeepSeek-V4.1-Flash* (MIT ; 552 B + 196 B de mémoire conditionnelle Engram, 8 B actifs en prefill / 16 B en decode, KV cache FP4), 2026. [https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) ; unsloth, *DeepSeek-V3-GGUF* (Q4_K_M ≈ 404 Go), janvier 2025. [https://huggingface.co/unsloth/DeepSeek-V3-GGUF](https://huggingface.co/unsloth/DeepSeek-V3-GGUF)
[^2]: Moonshot AI, *Kimi K3* (2,8 T de paramètres, 104 B actifs, 16 experts routés sur 896 + 2 partagés, MXFP4 natif par QAT, Kimi K3 License), juillet 2026. [https://huggingface.co/moonshotai/Kimi-K3](https://huggingface.co/moonshotai/Kimi-K3)
[^3]: Qwen, *Qwen3-30B-A3B* (30,5 B au total, 3,3 B activés, 8 experts sur 128, Apache 2.0), 2025. [https://huggingface.co/Qwen/Qwen3-30B-A3B](https://huggingface.co/Qwen/Qwen3-30B-A3B)
[^4]: NVIDIA, *NVIDIA-Nemotron-3.5-Lightning-30B-A3B* (hybride Mamba-2 + MoE + attention, 30 B / 3 B actifs, OpenMDW 1.1 ; checkpoint NVFP4 ≈ 21,6 Go recommandé pour le déploiement), août 2026. [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-BF16) · [https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4)
[^5]: Z.ai, *GLM-5.3-Flash* (320 B au total, 18 B actifs, attention hybride sparse + linéaire, MIT), 2026. [https://huggingface.co/zai-org/GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash)
[^6]: OpenAI, *gpt-oss-120b / gpt-oss-20b* (gpt-oss-20b : 21 B au total, 3,6 B actifs, MoE post-entraîné en MXFP4, tient dans 16 Go), août 2025. [https://huggingface.co/openai/gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b)
[^7]: Qwen, *Qwen3.8-Flash-Next* (10 experts routés + 1 partagé sur 512 ; 51 B d'embeddings n-gram « plus faciles à décharger que les experts MoE »), août 2026. [https://huggingface.co/Qwen/Qwen3.8-Flash-Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
[^8]: Xiaomi, *MiMo-V2.6-Pro-MOPD* (MoE 1,02T / 42B actifs, contexte 1M, texte + image + vidéo + audio, licence MIT ; checkpoint RL du 2026-09-21, mise à jour MOPD du 2026-09-27), Hugging Face. [https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-MOPD](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-MOPD)
