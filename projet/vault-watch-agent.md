---
title: "🤖 vault-watch-agent"
description: "Présentation de vault-watch-agent, l'agent IA qui propose des corrections sourcées pour ce guide, attend la relecture humaine et prépare la pull request."
last_modified: "2026-11-21"
---

> [!tip] En bref
> vault-watch-agent est le programme qui aide à garder ce guide exact. Il lit la liste des nouveautés du domaine, trouve les passages devenus faux et propose des corrections. Une personne relit tout, et rien n'est publié sans son accord.

## À quoi il sert

Le guide donne des versions minimales, des prix et des failles de sécurité à surveiller. Ces informations changent sans cesse : une version recommandée peut devenir dangereuse du jour au lendemain. Une [[projet/how-it-works|collecte sans IA]] relève les changements ; l'agent détermine lesquels rendent une page fausse et prépare le travail de correction.

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

![Écran de relecture de vault-watch-agent : des corrections cochées, avec le texte actuel en rouge, le texte proposé en vert et la source.](/vault-watch-review.fr.png)

## Ce qu'il fait d'autre

Une veille suit des sources déjà connues, et elle ne fait que corriger. Quatre autres travaux passent par la même relecture et la même pull request :

| Travail | Ce qui se passe |
| :-- | :-- |
| Corriger une erreur signalée | Une erreur relevée par un lecteur ou par un contrôle est vérifiée sur des sources primaires, puis corrigée |
| Vérifier le guide | À la demande : liens morts, cohérence entre les pages, fidélité de la traduction, affirmations datées à revoir |
| Alléger | À force d'ajouts, les pages s'alourdissent. L'agent liste ce qui est répété ou périmé et propose de le raccourcir, sans retirer un fait, un chiffre ou une source |
| Chercher ce qui manque | L'agent liste ce qu'un lecteur chercherait sans le trouver. Chaque piste retenue est vérifiée sur le web, puis écrite dans la page où elle a sa place |

Une piste est une question à vérifier, pas un fait : l'auteur choisit lesquelles suivre, et voit ce que la recherche coûtera avant de la lancer.

![Écran des pistes de vault-watch-agent : trois pistes cochées, chacune avec le passage du guide qu'elle concerne, et le coût estimé de la recherche.](/vault-watch-leads.fr.png)

## Ses garde-fous

- **Le modèle propose, le code décide.** L'IA n'écrit jamais dans un fichier. Une correction est refusée si le texte qu'elle cite ne se trouve pas exactement une fois dans la page.
- **Deux validations humaines.** L'une après le rapport, l'autre avant que quoi que ce soit ne quitte la machine.
- **Des preuves plutôt que de la mémoire.** Les propositions s'appuient sur les notes de version et sur des sources primaires consultées sur le web.
- **Une seule source de règles.** L'agent charge les règles éditoriales du guide à chaque passage.

## Ce qu'il vaut, mesuré

L'agent a été rejoué sur deux veilles traitées à la main avant sa création, puis ses propositions ont été comparées aux corrections humaines. Aucune proposition arrivée à la relecture n'était fausse, mais il en a manqué beaucoup : sur la veille la plus chargée, il a retrouvé 2 corrections sur 15. Le changement de fond de cette veille a bien été trouvé ; 9 des 13 corrections manquées ne portaient que sur une date. Le 18 novembre 2026, le rejeu d'une veille plus récente a retrouvé les 11 corrections fusionnées, sans erreur. Cette veille avait été traitée par l'agent lui-même, puis relue : ce rejeu mesure sa régularité, pas une vérité indépendante. Le [détail de l'évaluation](https://github.com/DamienBecherini/vault-watch-agent/blob/main/README.fr.md#le-guide-de-r%C3%A9f%C3%A9rence) est public.

Au 20 novembre 2026, l'agent a préparé 19 des [pull requests fusionnées](https://github.com/DamienBecherini/ia-on-prem-vault/pulls?q=is%3Apr+is%3Amerged) de ce guide, toutes relues par l'auteur avant fusion.

## Ses limites

- **Du Markdown dans un dépôt Git.** Écrit d'abord pour ce guide, l'agent tient maintenant tout guide en Markdown décrit par un petit fichier de configuration. Les autres formats ne sont pas pris en charge.
- **Il n'écrit pas de nouvelle page.** Il ajoute aux pages existantes. Quand un sujet demande une page à lui, il le signale, et l'écrire reste le travail de l'auteur.
- **Sa qualité n'est mesurée qu'avec Claude.** Ce guide est tenu avec les modèles Claude, un service cloud, [[projet/how-it-works|pour un contenu public uniquement]]. L'agent sait aussi utiliser un modèle local, mais la qualité de ses corrections n'y est pas mesurée.
- **Il reste un assistant.** Il ne pousse jamais directement sur la branche principale.

## Pour les développeurs

Le projet est écrit en Python avec [LangGraph](https://langchain-ai.github.io/langgraph/) pour l'orchestration. Les appels au modèle passent par le SDK Anthropic, par Claude Code, ou par tout serveur compatible avec l'API d'OpenAI. Les étapes forment un graphe d'états, sauvegardé à chaque étape dans SQLite : une exécution en pause peut reprendre des jours plus tard, depuis l'interface web ou la ligne de commande.

Le guide français tient entièrement dans le contexte du modèle grâce au cache de prompts. Il n'y a donc pas de [[00-lexique/rag|RAG]] vectoriel : à cette taille, tout lire coûte moins cher que construire un index, et le modèle voit les incohérences entre pages.

**Dépôt GitHub :** [DamienBecherini/vault-watch-agent](https://github.com/DamienBecherini/vault-watch-agent), sous licence MIT.

**Documentation :** [toutes les pages](https://github.com/DamienBecherini/vault-watch-agent/blob/main/docs/fr/README.md), rangées par question, avec une carte : brancher son guide, une veille étape par étape, vérifier le guide, les coûts, choisir un modèle.
