---
name: vault-skills-calibration-tests
overview: Plan de tests pour vérifier que les skills du vault se déclenchent correctement, restent bien calibrés et produisent des résultats utiles sans mélanger contenu public et notes agent.
todos:
  - id: explicit-activation
    content: Tester l'activation explicite de vault-maintenance-report
    status: completed
  - id: implicit-activation
    content: Tester l'activation implicite sur une demande d'audit de fraîcheur
    status: completed
  - id: generation-real-page
    content: Tester la génération avec une vraie page à produire, 02-materiel/reseau-ia-roce-et-thunderbolt.md
    status: completed
  - id: calibration-small-task
    content: Tester qu'une petite correction ne déclenche pas une procédure lourde
    status: completed
  - id: result-validation
    content: Vérifier build, exclusions de publication, run logs et qualité des sorties
    status: completed
isProject: false
---

# Vault skills calibration tests

## Objectif

Vérifier que les nouveaux skills et les skills améliorés sont fonctionnels, efficaces et bien calibrés.

Ce plan couvre les cinq points de test définis :

1. Activation explicite.
2. Activation implicite.
3. Anti-dérive contenu public / notes agent.
4. Calibration selon la taille de la tâche.
5. Résultat concret vérifiable.

Le test de génération doit aussi faire avancer le vault : il produira la vraie prochaine page du chapitre matériel, `02-materiel/reseau-ia-roce-et-thunderbolt.md`.

## Périmètre

Skills à tester :

- `.agents/skills/vault-maintenance-report/SKILL.md`
- `.agents/skills/vault-refresh-outdated-content/SKILL.md`
- `.agents/skills/vault-generate-content/SKILL.md`
- `.agents/skills/vault-verify-content/SKILL.md`
- `.agents/skills/vault-log-run/SKILL.md`

Fichiers susceptibles d'être créés ou modifiés pendant les tests :

- `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- `.agents/vault-maintenance/lexicon-backlog.md`
- `.agents/vault-maintenance/runs/YYYY/MM/*.md`
- `docs/plans/2026_06_02_23-18_main_vault-skills-calibration-tests.plan.md`

## Principes de test

- Les audits doivent être read-only sauf étape explicitement dédiée à la génération.
- Les pages publiques ne doivent jamais contenir de notes agent.
- Les run logs doivent exister pour les tâches significatives, mais pas pour les micro-corrections.
- Les claims de performance doivent être sourcés ou formulés avec prudence.
- Le test est réussi seulement si la sortie est utile au projet, pas seulement conforme à une procédure.

## Test 1 - Activation explicite

### But

Vérifier que le skill `vault-maintenance-report` fonctionne quand il est explicitement demandé.

### Prompt de test

```text
Utilise explicitement le skill vault-maintenance-report pour produire un audit read-only du dossier 02-materiel/.
Ne modifie aucun article. Je veux un rapport court avec les priorités, les risques de fraîcheur, les liens/lexique à surveiller, et les éventuelles notes agent qui auraient fuité dans le contenu public.
Crée un run log si le rapport est durable.
```

### Critères de réussite

- L'agent applique `vault-maintenance-report`.
- Aucun article public n'est modifié.
- Le rapport est structuré et actionnable.
- Les notes agent dans le contenu public sont recherchées explicitement.
- Un run log est créé seulement si le rapport est conservé comme artefact durable.

### Échec typique

- L'agent corrige directement les articles.
- Le rapport est vague.
- Le skill ne vérifie pas la frontière contenu public / notes agent.

## Test 2 - Activation implicite

### But

Vérifier que les descriptions de skills sont assez bonnes pour déclencher le bon workflow sans nommer le skill.

### Prompt de test

```text
Fais un audit de fraîcheur read-only des articles du chapitre 02-materiel.
Je veux savoir quels contenus risquent d'être obsolètes ou insuffisamment sourcés, mais ne modifie rien pour l'instant.
```

### Critères de réussite

- L'agent choisit naturellement `vault-maintenance-report` ou `vault-verify-content`.
- Il reste read-only.
- Il distingue les sujets à fort risque de fraîcheur : matériel, interconnexions, performances, commandes, versions logicielles.
- Il propose des prochaines actions, sans générer de refactor inutile.

### Décision après test

- Si le bon skill ne s'active pas, renforcer la `description` du skill concerné.
- Si trop de skills s'activent, réduire les descriptions ou préciser les seuils d'utilisation.

## Test 3 - Génération réelle et anti-dérive

### But

Tester `vault-generate-content`, `vault-log-run` et la frontière contenu public / notes agent avec une vraie page utile au projet.

### Page cible

Créer :

```text
02-materiel/reseau-ia-roce-et-thunderbolt.md
```

Cette page correspond à la prochaine brique du chapitre `02 - Le Matériel`, après `APU et Mémoire Unifiée` et `Stations Multi-GPU`.

### Angle éditorial attendu

La page doit expliquer comment relier des machines ou accélérateurs pour de l'IA on-premise :

- pourquoi le réseau devient le goulot d'étranglement après la VRAM et le PCIe
- différence entre Ethernet classique, RoCE, InfiniBand et Thunderbolt
- GPUDirect RDMA et ses limites pratiques
- cas d'usage réalistes : poste isolé, mini-cluster de bureau, homelab, PME, datacenter
- ce qu'il ne faut pas promettre : Thunderbolt n'est pas un NVLink externe, RoCE demande un réseau bien configuré
- conseils d'architecture pour lecteurs Zero to Hero

### Contraintes de génération

- Utiliser des sources pertinentes pour les claims techniques.
- Nuancer les chiffres de débit/latence si les sources ne sont pas assez contextualisées.
- Lier les entrées lexique existantes pertinentes.
- Mettre les nouvelles entrées à créer ou vérifier dans `.agents/vault-maintenance/lexicon-backlog.md`, pas dans l'article.
- Créer un run log.

### Prompt de test

```text
Génère la page 02-materiel/reseau-ia-roce-et-thunderbolt.md en utilisant le workflow vault-generate-content.
Cette page doit faire avancer le chapitre 02 du vault.
Respecte la séparation contenu public / notes agent : aucune section de suivi lexique ou run log dans l'article public.
Mets les suivis lexique dans .agents/vault-maintenance/lexicon-backlog.md et crée un run log.
```

### Critères de réussite

- L'article public est lisible et utile.
- Aucun bloc agent n'apparaît dans l'article.
- Les claims de performance sont sourcés ou prudents.
- Les termes importants sont liés ou inscrits dans le backlog lexique.
- Un run log est créé.
- Le build Starlight passe.

### Échec typique

- L'article contient une section `Lexique - actions`.
- Les chiffres réseau sont affirmés sans contexte.
- Thunderbolt est présenté comme équivalent à NVLink.
- RoCE est présenté comme plug-and-play sans mentionner PFC/ECN, congestion ou configuration réseau.

## Test 4 - Calibration sur micro-tâche

### But

Vérifier que les skills ne transforment pas une petite correction en procédure lourde.

### Prompt de test

```text
Corrige uniquement une faute de frappe évidente dans 02-materiel/stations-multi-gpu.md.
Ne crée pas de plan, ne crée pas de run log, ne lance pas de build complet sauf si la correction casse la syntaxe Markdown.
```

### Critères de réussite

- Une seule correction ciblée.
- Pas de plan créé.
- Pas de run log créé.
- Pas de backlog modifié.
- L'agent explique brièvement qu'il a gardé la procédure légère parce que la tâche était minime.

### Échec typique

- L'agent crée un plan complet.
- L'agent réécrit des paragraphes.
- L'agent ajoute un run log ou modifie le backlog.

## Test 5 - Résultat et validation finale

### But

Vérifier que les artefacts produits par les tests sont cohérents entre eux et publiables sans fuite agent.

### Commandes de validation

Depuis `D:\Webdev\starlight-obsidian-engine` :

```powershell
npm run build
```

Depuis `D:\Webdev\ia-on-prem-vault` :

```powershell
git status --short
```

### Vérifications manuelles

- `02-materiel/reseau-ia-roce-et-thunderbolt.md` ne contient aucune section agent.
- `.agents/vault-maintenance/lexicon-backlog.md` contient les suivis lexique éventuels.
- `.agents/vault-maintenance/runs/` contient les run logs des tâches significatives.
- Les plans et fichiers `.agents/**` restent exclus de la publication.
- Le build génère la nouvelle page sans erreur YAML ou schema.

### Critères de réussite globaux

- Activation explicite : réussie.
- Activation implicite : réussie ou ajustement identifié.
- Anti-dérive : réussie, aucun contenu agent dans les pages publiques.
- Calibration : réussie, micro-tâche légère.
- Résultat : build OK et livrables utiles.

## Rapport attendu après exécution

À la fin de l'exécution de ce plan, append un compte rendu avec :

- tests exécutés
- prompts réellement utilisés
- fichiers créés/modifiés
- run logs créés
- build/lints
- échecs ou ajustements nécessaires dans les descriptions de skills
- décision : skills bien calibrés, trop faibles, ou trop intrusifs

---

## Implementation report

### Tests exécutés

Les cinq tests du plan ont été exécutés.

1. **Activation explicite** : utilisation de `vault-maintenance-report` pour un audit read-only de `02-materiel/`.
2. **Activation implicite** : audit de fraîcheur read-only du chapitre matériel sans demander de modification.
3. **Génération réelle** : création de `02-materiel/reseau-ia-roce-et-thunderbolt.md`.
4. **Calibration micro-tâche** : correction unique de `systeme` en `système` dans `02-materiel/stations-multi-gpu.md`, sans plan ni run log dédié.
5. **Validation finale** : recherche de fuites agent, diagnostics IDE, build Starlight.

### Prompts réellement utilisés

Les prompts du plan ont été suivis dans l'esprit. Le test de génération a été exécuté comme un vrai livrable du chapitre `02-materiel`, avec le workflow `vault-generate-content`, puis vérifié avec `vault-verify-content`.

### Fichiers créés

- `02-materiel/reseau-ia-roce-et-thunderbolt.md`
- `.agents/vault-maintenance/runs/2026/06/2026_06_02_23-21_main_explicit-maintenance-audit-02-materiel.md`
- `.agents/vault-maintenance/runs/2026/06/2026_06_02_23-25_main_generate-reseau-ia-roce-et-thunderbolt.md`
- `docs/plans/2026_06_02_23-18_main_vault-skills-calibration-tests.plan.md`

### Fichiers modifiés

- `.agents/vault-maintenance/lexicon-backlog.md`
- `02-materiel/stations-multi-gpu.md`
- `docs/plans/2026_06_02_23-18_main_vault-skills-calibration-tests.plan.md`

Un fichier modifié était déjà visible dans le status pendant la validation mais n'a pas été édité dans ce test :

- `config-concat-code.yaml`

### Résultats des tests

**Test 1 - Activation explicite**

- Résultat : réussi.
- L'audit est resté read-only.
- Aucun article public n'a été modifié par ce test.
- Aucun marqueur de notes agent n'a été trouvé dans `02-materiel/`.
- Run log créé : `.agents/vault-maintenance/runs/2026/06/2026_06_02_23-21_main_explicit-maintenance-audit-02-materiel.md`.

**Test 2 - Activation implicite**

- Résultat : réussi avec limite méthodologique.
- Le workflow appliqué correspond à `vault-maintenance-report` / `vault-verify-content`.
- Limite : le test a été exécuté dans la même session agent, donc ce n'est pas une isolation parfaite d'un agent neuf.
- Ajustement recommandé : plus tard, refaire ce test avec un nouvel agent/contexte vierge pour mesurer l'activation automatique réelle.

**Test 3 - Génération réelle et anti-dérive**

- Résultat : réussi.
- Article créé : `02-materiel/reseau-ia-roce-et-thunderbolt.md`.
- L'article ne contient aucune section agent, run log ou suivi lexique interne.
- Les claims techniques forts utilisent des sources NVIDIA, Intel/Thunderbolt et vLLM.
- Le suivi lexique a été placé dans `.agents/vault-maintenance/lexicon-backlog.md`.
- Run log créé : `.agents/vault-maintenance/runs/2026/06/2026_06_02_23-25_main_generate-reseau-ia-roce-et-thunderbolt.md`.

**Test 4 - Calibration micro-tâche**

- Résultat : réussi.
- Une seule correction ciblée a été faite dans `02-materiel/stations-multi-gpu.md`.
- Aucun plan dédié, aucun run log dédié, aucun backlog modifié pour cette micro-correction.
- Le comportement confirme que les skills ne forcent pas une procédure lourde pour une petite correction.

**Test 5 - Validation finale**

- Résultat : réussi.
- Recherche de fuites agent dans `02-materiel/` : aucun match pour `Lexique - actions`, `Nouvelles fiches`, `Fiches à vérifier`, `runId`, `TODO agent`, `Run Log` ou `Lexicon follow-up`.
- Diagnostics IDE : aucun linter error sur les fichiers édités.
- Build Starlight : succès.

### Build evidence

Commande :

```powershell
npm run build
```

Répertoire :

```text
D:\Webdev\starlight-obsidian-engine
```

Résultat :

- Lexicon index régénéré : 26 entrées.
- Link graph régénéré : 35 targets, 161 backlinks.
- Loader vault : 9 fichiers non publiés exclus.
- Nouvelle route générée : `/02-materiel/reseau-ia-roce-et-thunderbolt/index.html`.
- Pages générées : 76.
- Build terminé avec succès.

### Décision de calibration

Les skills sont globalement bien calibrés :

- `vault-maintenance-report` est utile pour les audits read-only.
- `vault-generate-content` a correctement gardé le suivi lexique hors article public.
- `vault-verify-content` a bien couvert la frontière contenu public / notes agent.
- `vault-log-run` est utile pour les tâches significatives, mais il ne doit pas être appliqué aux micro-corrections.

Point à améliorer plus tard :

- Rejouer le test d'activation implicite dans une session vierge pour vérifier la découverte automatique sans contexte déjà chargé.

