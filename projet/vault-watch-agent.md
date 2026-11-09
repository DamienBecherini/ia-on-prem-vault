---
title: "🤖 vault-watch-agent"
description: "Présentation de vault-watch-agent, l'agent IA qui propose des corrections sourcées pour ce guide, attend la relecture humaine et prépare la pull request."
last_modified: "2026-11-09"
---

> [!tip] En bref
> vault-watch-agent est le programme qui aide à garder ce guide exact. Il lit la liste des nouveautés du domaine, trouve les passages devenus faux et propose des corrections. Une personne relit tout, et rien n'est publié sans son accord.

## À quoi il sert

Le guide donne des versions minimales, des prix et des failles de sécurité à surveiller. Ces informations changent sans cesse : une version recommandée peut devenir dangereuse du jour au lendemain. Un [[projet/how-it-works|script de veille]] repère les changements ; l'agent détermine lesquels rendent une page fausse et prépare le travail de correction.

## Ce qu'il fait, étape par étape

| Phase | Ce qui se passe | Qui travaille |
| :-- | :-- | :-- |
| Collecte | Récupère la veille : l'issue GitHub et ses notes de version | Programme |
| Tri | Classe chaque élément : à corriger, à ajouter peut-être, sans intérêt | IA |
| Repérage | Trouve les pages françaises concernées et regroupe ce qui va ensemble | Programme |
| Proposition | Rédige les corrections en parallèle, avec texte actuel, nouveau texte et source | IA |
| Numérotation | Vérifie que chaque citation existe bien dans la page | Programme |
| Vérification croisée | Relit chaque correction avec tout le guide et le web : garder, réviser, rejeter | IA |
| **Relecture** | **Pause : l'auteur choisit les corrections à appliquer** | **Humain** |
| Application | Applique les corrections sur une branche séparée | Programme |
| Traduction | Met à jour les pages anglaises correspondantes | IA |
| Contrôles | Lance les audits du guide et teste les liens externes | Programme |
| **Publication** | **Pause : l'auteur autorise la pull request** | **Humain** |

## L'écran de relecture

Chaque correction apparaît sous forme de carte : le texte actuel, le texte proposé, la gravité et la source. Les corrections liées, comme une phrase et sa note de bas de page, se valident ensemble.

![Écran de relecture de vault-watch-agent : des corrections cochées, avec le texte actuel en rouge, le texte proposé en vert et la source.](/vault-watch-review.png)

## Ses garde-fous

- **Le modèle propose, le code décide.** L'IA n'écrit jamais dans un fichier. Une correction est refusée si le texte qu'elle cite ne se trouve pas exactement une fois dans la page.
- **Deux validations humaines.** L'une après le rapport, l'autre avant que quoi que ce soit ne quitte la machine.
- **Des preuves plutôt que de la mémoire.** Les propositions s'appuient sur les notes de version et sur des sources primaires consultées sur le web.
- **Une seule source de règles.** L'agent charge les règles éditoriales du guide à chaque passage.

## Ce qu'il vaut, mesuré

L'agent a été rejoué sur deux veilles traitées à la main avant sa création, puis ses propositions ont été comparées aux corrections humaines. Aucune proposition arrivée à la relecture n'était fausse, mais il en a manqué beaucoup : sur la veille la plus chargée, il a retrouvé 2 corrections sur 15. Le changement de fond de cette veille a bien été trouvé ; 9 des 13 corrections manquées ne portaient que sur une date. Le [détail de l'évaluation](https://github.com/DamienBecherini/vault-watch-agent#evaluation-on-past-watches) est public.

## Ses limites

- **Il est écrit pour ce guide.** Une autre base de connaissances devrait adapter sa collecte et ses contrôles.
- **Il corrige, il n'ajoute pas.** Les nouveaux outils et modèles sont listés comme pistes, sans page rédigée.
- **Il dépend d'un service cloud.** L'agent utilise les modèles Claude par API, [[projet/how-it-works|pour un contenu public uniquement]].
- **Il reste un assistant.** Il ne pousse jamais directement sur la branche principale.

## Pour les développeurs

Le projet est écrit en Python avec [LangGraph](https://langchain-ai.github.io/langgraph/) pour l'orchestration et le SDK Anthropic pour les appels au modèle. Les étapes forment un graphe d'états, sauvegardé à chaque étape dans SQLite : une exécution en pause peut reprendre des jours plus tard, depuis l'interface web ou la ligne de commande.

Le guide français tient entièrement dans le contexte du modèle grâce au cache de prompts. Il n'y a donc pas de [[00-lexique/rag|RAG]] vectoriel : à cette taille, tout lire coûte moins cher que construire un index, et le modèle voit les incohérences entre pages.

**Dépôt GitHub :** [DamienBecherini/vault-watch-agent](https://github.com/DamienBecherini/vault-watch-agent), sous licence MIT.
