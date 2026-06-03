---
runId: 2026_06_03_23-30_main_generate-scenario-a-labo-dev
timestamp: 2026-06-03T23:30:00+02:00
repo: ia-on-prem-vault
branch: main
baseHead: no commit
finalHead: no commit
status: completed
mode: generation
commitCreated: false
prUrl:
plan:
skills:
  - vault-generate-content
  - vault-log-run
---

# Agent Run - Génération de Scénario A (Labo Dev)

## Objective
Générer le premier article du chapitre 04 (Blueprints d'Architecture) centré sur la configuration d'entrée de gamme (PC Gamer, RTX 24GB et CPU Offloading) via le skill `vault-generate-content`.

## Files Changed
- Création : `04-blueprints/scenario-a-labo-dev.md`
- Modification : `site.config.json` (ajout du dossier 04 au sidebar)
- Modification : `.agents/vault-maintenance/lexicon-backlog.md` (suivi des liens utilisés)
- Création : ce run log.

## Git State
- Branch: `main`
- Base HEAD: N/A
- Commit created: false

## Sources Consulted
- Recherches communautaires et documentations (Ollama, llama.cpp, sous-reddit r/LocalLLaMA) pour valider l'effondrement de vitesse réel lorsqu'un 70B déborde d'une carte de 24 Go vers la RAM système DDR5 (baisse typique de ~15-20 tok/s en pur VRAM à ~2-5 tok/s en hybride).

## Validation
- Respect de la politique éditoriale : La frontière publique a été respectée (pas de contenu d'agent dans le fichier markdown). 
- Cohérence : Le blueprint utilise les notions des Chapitres 1 et 2 pour expliquer les limites concrètes d'une architecture à bas coût.

## Lexicon Follow-Up
- Les termes `offloading`, `ram`, `vram`, `quantification-q4`, `tokens-par-seconde` et `decoding` ont été liés avec succès. Pas de création de fiches manquantes requise à cette étape.

## Retention Check
No action.