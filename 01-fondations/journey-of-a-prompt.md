---
title: "🧠 Le Voyage d'un Prompt : Comment fonctionne un LLM ?"
description: De votre clavier jusqu'à la réponse. Pas de magie, juste de l'électricité et des mathématiques. Découvrez les étapes clés (Tokenisation, Prefill, KV Cache, Decoding).
sidebar:
  order: 0
last_modified: "2026-06-04"
---

> [!tip] En bref
> Quand vous envoyez un prompt, le modèle ne "comprend" pas le texte — il exécute des milliards de multiplications. Ce chapitre décompose ce voyage étape par étape : tokenisation, prefill, KV Cache, génération. Aucun prérequis requis.

Quand vous tapez une question dans un modèle d'IA local, il y a une illusion de magie : la machine semble "comprendre" le texte et "réfléchir" à la réponse.

En réalité, un processeur ne comprend pas le français. Il ne fait qu'exécuter des milliards de multiplications à une vitesse fulgurante. Pour comprendre pourquoi l'IA demande autant de matériel (et pourquoi votre PC peut ramer), il faut soulever le capot et regarder comment un texte est transformé en calculs mathématiques. 

Voici le voyage exact de votre prompt, étape par étape.

---

## Étape 1 : La [[00-lexique/tokenisation|Tokenisation]] (Le hachoir à texte)

Un ordinateur ne sait calculer que sur des nombres. La toute première étape consiste donc à découper votre phrase en morceaux appelés **[[00-lexique/tokenisation|tokens]]**, puis à assigner un numéro à chaque morceau.

> [!example] Exemple
> Vous tapez *"Où est Paris ?"*
> Le modèle ne voit pas des lettres, il voit les numéros de son dictionnaire interne. Par exemple : `[4502, 381, 1920, 30]`. 

Chaque modèle a son propre dictionnaire, appris pendant son entraînement. En 2026, un modèle standard comme **Llama 3** possède un vocabulaire d'environ **128 256 tokens** possibles[^1]. Chaque numéro est l'index exact d'un de ces mots ou sous-mots.

## Étape 2 : L'[[00-lexique/embedding|Embedding]] (La carte au trésor)

Avoir le numéro `4502` pour le mot "Où" n'aide pas le modèle à comprendre son *sens*. 
L'ordinateur va donc convertir chaque numéro en une longue liste de coordonnées mathématiques (un vecteur). C'est ce qu'on appelle l'**[[00-lexique/embedding|Embedding]]**.

Imaginez une carte en 3D où les concepts similaires sont proches. Le mot "Roi" sera proche de "Reine" et de "Couronne". Dans un grand modèle (LLM), cette "carte" ne fait pas 3 dimensions, mais souvent **4 096 ou 8 192 dimensions**. 

À la fin de cette étape, votre petite phrase de 4 mots s'est transformée en une gigantesque grille de milliers de nombres décimaux. Le vrai calcul peut commencer.

---

## Étape 3 : Le "Prefill" (L'ingestion du contexte)

C'est ici que le moteur d'inférence (le logiciel qui fait tourner l'IA) lance ses calculs les plus lourds. Le modèle va faire passer votre grille de nombres à travers des dizaines de "couches" de neurones artificiels. 

Cette phase s'appelle le [[00-lexique/prefill|Prefill]]. Le modèle **lit tout votre prompt d'un seul coup**, en parallèle. 

Le cœur de cette étape est le **[[00-lexique/attention|mécanisme d'Attention]]** : le modèle croise tous les mots entre eux pour comprendre le contexte. Il calcule mathématiquement que, dans votre phrase, le point d'interrogation est fortement lié au mot "Où". 
* **Ce qu'il se passe dans la machine :** Vos puces (CPU ou GPU) tournent à 100% de leur capacité de calcul (TFLOPS) parce qu'elles peuvent exécuter toutes ces multiplications matricielles simultanément.

## Étape 4 : Le KV Cache (La mémoire à court terme)

Pendant le Prefill, le modèle a calculé l'importance et le contexte de chaque mot de votre historique. S'il devait recalculer tout cela à chaque nouveau mot qu'il va générer, il serait effroyablement lent.

Pour éviter ça, il sauvegarde tous ces calculs intermédiaires dans la [[00-lexique/vram|VRAM]] de votre carte graphique. C'est le fameux **[[00-lexique/kv-cache|KV Cache]]** (Key-Value Cache). 
Plus votre prompt est long (ex: si vous lui donnez un PDF de 200 pages à lire), plus ce KV Cache devient énorme et sature la mémoire de votre machine.

---

## Étape 5 : Le "Decoding" (La génération mot à mot)

Maintenant que le modèle a "digéré" votre question et stocké le contexte dans le KV Cache, il va produire sa réponse. **Il le fait un seul token à la fois.** C'est la phase de [[00-lexique/decoding|Decoding]].

1. Le modèle regarde votre prompt, regarde son KV Cache, et prédit mathématiquement que le mot le plus probable pour commencer la réponse est *"Paris"*.
2. Il écrit *"Paris"*.
3. **Le cycle recommence :** il prend votre prompt + le mot *"Paris"*, relit le KV Cache, et calcule que le mot suivant est *"est"*.
4. Il écrit *"est"*.

Cette boucle continue jusqu'à ce que le modèle génère un token spécial qui signifie `<FIN>`.

* **Ce qu'il se passe dans la machine :** C'est une phase très séquentielle. Le processeur doit constamment faire des allers-retours avec la mémoire pour récupérer les poids du modèle et le KV Cache, juste pour générer un malheureux token. C'est pour cela que la vitesse de génération dépend de la **[[01-fondations/memory-bandwidth|Bande Passante Mémoire]]** et non plus de la puissance de calcul brute.

---

## 🎯 En résumé pour l'architecte

Quand un utilisateur se plaint que *"l'IA est lente"*, vous devez savoir de quelle phase il parle :
* **Elle met trop de temps à démarrer ?** C'est le **Prefill**. Le processeur manque de puissance de calcul brute (TFLOPS) pour digérer le prompt initial, ou le contexte envoyé est trop long.
* **Elle écrit la réponse trop lentement ?** C'est le **Decoding**. La machine souffre du "Memory Wall" : la mémoire de la carte graphique ne peut pas envoyer les données assez vite vers la puce pour calculer le token suivant.

> [!tip] Prochaine étape
> Maintenant que vous avez compris que le Decoding est limité par la vitesse de la mémoire, passez au chapitre sur [[01-fondations/memory-bandwidth|La Bande Passante Mémoire]].

## 📚 Sources et Références
[^1]: Meta, *Llama 3.1 Model Card* (Architecture, vocabulaire 128 256 tokens, tokenizer Tiktoken), 2024. [GitHub — llama-models](https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md)