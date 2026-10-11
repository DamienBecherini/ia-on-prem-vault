---
title: MLA (Multi-head Latent Attention)
description: "Variante de l'attention qui stocke dans le KV cache un petit vecteur compressé par token au lieu des clés et valeurs complètes, introduite par DeepSeek-V2."
aliases:
  - Multi-head Latent Attention
  - MLA
  - Attention latente multi-têtes
tags:
  - lexique
  - fondations
last_modified: "2026-10-11"
---

## 📝 Définition courte

Façon de calculer l'attention qui garde en mémoire **un résumé compressé** de chaque token (un « vecteur latent ») au lieu de ses clés (K) et valeurs (V) complètes. Le [[00-lexique/kv-cache|KV cache]] devient beaucoup plus petit.

## 📖 Définition détaillée

Dans l'[[00-lexique/attention|attention]] classique, chaque couche du modèle stocke, pour chaque token, un vecteur K et un vecteur V par tête d'attention. MLA compresse ces informations en **un seul petit vecteur** par token et par couche. Au moment du calcul, le modèle « redéplie » ce vecteur pour retrouver les K et les V dont il a besoin.

Une analogie : au lieu de garder des notes complètes sur chaque intervenant d'une réunion, vous gardez un résumé de quelques lignes, à partir duquel vous savez retrouver l'essentiel.

MLA a été introduite par DeepSeek-V2 (mai 2024). Le papier annonce un KV cache réduit de 93,3 % par rapport à DeepSeek 67B, et un cache équivalent à celui d'un GQA avec seulement 2,25 groupes, avec de meilleurs résultats que l'attention classique[^1]. DeepSeek-V3 l'a conservée[^2], et Kimi K2 de Moonshot AI l'utilise aussi[^3].

## 💡 Pourquoi c'est important en IA on-premise

Sur un serveur on-premise, la VRAM disponible pour le cache limite la longueur des conversations et le nombre d'utilisateurs simultanés. Un modèle à MLA consomme bien moins de cache par token qu'un modèle classique de taille comparable. La formule GQA habituelle ne s'applique pas : elle surestime fortement la mémoire nécessaire.

## ⚠️ Pièges fréquents

- Dimensionner un modèle à MLA avec la formule GQA ($2 \times L \times H_{kv} \times D$…) : le résultat est très surévalué. Partez de la fiche du modèle ou de la taille de cache affichée par le moteur.
- Confondre MLA et [[00-lexique/sparse-attention|attention sparse]] : MLA réduit la **place** prise par chaque token ; l'attention sparse réduit le nombre de tokens **relus**.

## 📚 Pour comprendre en profondeur

- [[01-fondations/kv-cache-and-context|💾 KV Cache & Contexte]] *(section « Quand le modèle lui-même réduit sa mémoire » : MLA, attention sparse, attention linéaire)*

## 🔗 Voir aussi

- [[00-lexique/kv-cache|KV Cache]]
- [[00-lexique/attention|Attention]]
- [[00-lexique/sparse-attention|Attention sparse]]
- [[00-lexique/linear-attention|Attention linéaire]]
- [[00-lexique/moe|MoE]]
- [[00-lexique/ai-glossary|📖 Glossaire IA]]

[^1]: DeepSeek-AI, *DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model* (arXiv:2405.04434 ; KV cache compressé en vecteur latent, −93,3 % vs DeepSeek 67B, équivalent GQA à 2,25 groupes), mai 2024. [https://arxiv.org/abs/2405.04434](https://arxiv.org/abs/2405.04434)
[^2]: DeepSeek-AI, *DeepSeek-V3 Technical Report* (arXiv:2412.19437 ; MLA et DeepSeekMoE), décembre 2024. [https://arxiv.org/abs/2412.19437](https://arxiv.org/abs/2412.19437)
[^3]: Moonshot AI, *Kimi-K2-Instruct* (mécanisme d'attention « MLA »), juillet 2025. [https://huggingface.co/moonshotai/Kimi-K2-Instruct](https://huggingface.co/moonshotai/Kimi-K2-Instruct)
