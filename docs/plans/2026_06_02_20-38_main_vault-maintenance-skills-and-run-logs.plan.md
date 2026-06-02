---
name: vault-maintenance-skills-and-run-logs
overview: Créer les skills de maintenance du vault et renforcer les skills existants pour tracer les runs, séparer contenu public et notes agent, et préparer une rétention fiable.
todos:
  - id: run-log-skill
    content: Créer le skill vault-log-run pour journaliser les exécutions agent
    status: completed
  - id: maintenance-report-skill
    content: Créer le skill vault-maintenance-report pour audits récurrents read-only
    status: completed
  - id: refresh-skill
    content: Créer le skill vault-refresh-outdated-content pour mises à jour sourcées d'articles existants
    status: completed
  - id: references
    content: Créer les références communes run-log-policy et maintenance-policy
    status: completed
  - id: improve-existing
    content: Améliorer vault-generate-content et vault-verify-content pour utiliser run logs, backlog et frontière contenu public
    status: completed
  - id: verify
    content: Vérifier les skills, lancer diagnostics/build et append le compte rendu
    status: completed
isProject: false
---

# Vault maintenance skills and run logs

## Pourquoi ce chantier

Les derniers travaux ont montré trois problèmes structurels :

1. **Mélange contenu lecteur / notes agent.** La première version de `02-materiel/stations-multi-gpu.md` contenait une section `Lexique - actions` utile pour l'agent mais visible par les lecteurs.
2. **Traçabilité insuffisante hors Git.** Git garde le diff, mais pas toujours l'intention, les sources consultées, les skills utilisés, les validations, les follow-ups lexique ou les décisions de ne pas créer de commit.
3. **Risque d'accumulation.** Si chaque agent récurrent écrit des run logs détaillés, `.agents/vault-maintenance/` peut devenir lourd et bruité sans politique de rétention.

Le vault a donc besoin d'une couche de maintenance agentique explicite :

- les articles publiés restent propres
- les plans gardent l'intention et les comptes rendus de chantier
- les run logs gardent l'historique opérationnel
- les backlogs agent gardent les tâches de maintenance non publiées
- la rétention combine synthèse IA et validation déterministe future

## Solution envisagée

Créer trois nouveaux skills projet sous `.agents/skills/` :

1. `vault-log-run` : créer des logs horodatés d'exécution agent, avec métadonnées Git, fichiers touchés, sources, validations, follow-ups et politique de rétention.
2. `vault-maintenance-report` : produire des audits récurrents read-only du vault : freshness, sources, lexique, pages à revoir, risques de publication.
3. `vault-refresh-outdated-content` : mettre à jour une page existante avec recherche source-first, en mode draft/branche/PR, avec vérification séparée.

Améliorer les deux skills existants :

- `vault-generate-content` : finir toute génération significative par un run log, garder le suivi lexique hors article public, utiliser le backlog.
- `vault-verify-content` : vérifier aussi la frontière contenu public / notes agent, et produire un run log pour les audits significatifs.

Créer des références communes :

- `references/run-log-policy.md`
- `references/maintenance-policy.md`

## Files

- Create: `.agents/skills/vault-log-run/SKILL.md`
- Create: `.agents/skills/vault-log-run/references/run-log-policy.md`
- Create: `.agents/skills/vault-maintenance-report/SKILL.md`
- Create: `.agents/skills/vault-maintenance-report/references/maintenance-policy.md`
- Create: `.agents/skills/vault-refresh-outdated-content/SKILL.md`
- Modify: `.agents/skills/vault-generate-content/SKILL.md`
- Modify: `.agents/skills/vault-verify-content/SKILL.md`
- Modify: this plan, append implementation/build report

## Design decisions

### Public content boundary

Reader-facing pages must not contain agent maintenance notes:

- no `Lexique - actions`
- no `Nouvelles fiches à créer`
- no `Fiches à vérifier`
- no run metadata blocks

Agent-only material goes to:

- `docs/plans/*.plan.md` for chantier intent and reports
- `.agents/vault-maintenance/lexicon-backlog.md` for lexicon follow-up
- `.agents/vault-maintenance/runs/` for operational timeline

### Run logs

Run logs are append-only operational traces. They complement Git, they do not replace Git.

Target path:

```text
.agents/vault-maintenance/runs/YYYY/MM/YYYY_MM_DD_HH-MM_<branch-slug>_<task-slug>.md
```

Required content:

- timestamp
- repository
- branch
- base HEAD
- final HEAD if committed
- commit/PR status
- skills used
- files created/modified/deleted
- sources consulted
- validation evidence
- lexicon follow-up
- residual risk

### Retention

An LLM must summarize; a deterministic script must validate/prune later.

Policy:

- keep detailed logs for the latest 50 runs or latest 2 months
- older logs are candidates for monthly summaries
- yearly summaries can consolidate previous years
- never delete a detailed run unless its run ID is represented in a monthly/yearly summary
- until a validation script exists, agents may create summaries but must not prune detailed logs

## Tasks

- [x] Create `vault-log-run`.
- [x] Create `vault-maintenance-report`.
- [x] Create `vault-refresh-outdated-content`.
- [x] Create shared references.
- [x] Update `vault-generate-content`.
- [x] Update `vault-verify-content`.
- [x] Verify frontmatter and skill discoverability.
- [x] Run lints on edited files.
- [x] Run Starlight build from the engine repo.
- [x] Append implementation/build report to this plan.

## Success criteria

- Future generation/verification tasks have a clear run-log convention.
- Future recurring audits have a read-only maintenance skill.
- Future refresh work has a source-first, human-in-the-loop workflow.
- The existing generation/verification skills no longer rely only on chat final summaries.
- Public article content is explicitly separated from maintenance notes.
- Build passes after adding skills and references.

---

## Implementation report

### Changes

Created three new project skills:

- `.agents/skills/vault-log-run/SKILL.md`
- `.agents/skills/vault-maintenance-report/SKILL.md`
- `.agents/skills/vault-refresh-outdated-content/SKILL.md`

Created two reference files:

- `.agents/skills/vault-log-run/references/run-log-policy.md`
- `.agents/skills/vault-maintenance-report/references/maintenance-policy.md`

Improved existing skills:

- `.agents/skills/vault-generate-content/SKILL.md`
  - now asks for `vault-log-run` on significant generation or rewrite tasks
  - reinforces lexicon follow-up outside public articles
  - requires backlog items or minimal entries for important missing terms
- `.agents/skills/vault-verify-content/SKILL.md`
  - now checks for accidental agent-only sections in public content
  - adds public content boundary reporting
  - asks for run logs on significant audits

Created the first structured run log:

- `.agents/vault-maintenance/runs/2026/06/2026_06_02_23-11_main_vault-maintenance-skills-and-run-logs.md`

### Validation

IDE diagnostics:

- Result: no linter errors found on edited skill and plan files.

Build:

- Command: `npm run build`
- Working directory: `D:\Webdev\starlight-obsidian-engine`
- Result: success
- Evidence:
  - Lexicon index regenerated: 26 entries
  - Link graph regenerated: 34 targets, 154 backlinks
  - Vault loader excluded 8 unpublished vault files
  - Astro/Starlight generated 74 pages

### Git state

- Vault branch: `main`
- Base HEAD during implementation: `e0e7fa6`
- Commit created: no

### Limitations and follow-up

- The retention policy is documented, but the deterministic validation/prune script does not exist yet.
- Until that script exists, agents may create monthly/yearly summaries but must not delete detailed run logs.
- A future skill or script can implement `prune-run-logs` once enough real run logs exist to validate the format.

