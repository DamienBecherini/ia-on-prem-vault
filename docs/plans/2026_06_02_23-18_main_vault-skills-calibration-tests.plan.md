---
name: vault-skills-calibration-tests
overview: Test plan to verify vault skills trigger correctly, stay well calibrated, and produce useful results without mixing public content and agent notes.
todos:
  - id: explicit-activation
    content: Test explicit activation of vault-maintenance-report
    status: completed
  - id: implicit-activation
    content: Test implicit activation on a freshness audit request
    status: completed
  - id: generation-real-page
    content: Test generation with a real page to produce, 02-materiel/network-roce-infiniband-thunderbolt.md
    status: completed
  - id: calibration-small-task
    content: Test that a small fix does not trigger a heavy procedure
    status: completed
  - id: result-validation
    content: Verify build, publication exclusions, run logs, and output quality
    status: completed
isProject: false
last_modified: "2026-06-04"
---

# Vault skills calibration tests

## Objective

Verify that the new skills and improved skills are functional, effective, and well calibrated.

This plan covers the five defined test points:

1. Explicit activation.
2. Implicit activation.
3. Anti-drift public content / agent notes.
4. Calibration by task size.
5. Verifiable concrete result.

The generation test must also advance the vault: it will produce the real next page of the hardware chapter, `02-materiel/network-roce-infiniband-thunderbolt.md`.

## Scope

Skills to test:

- `.agents/skills/vault-maintenance-report/SKILL.md`
- `.agents/skills/vault-refresh-outdated-content/SKILL.md`
- `.agents/skills/vault-generate-content/SKILL.md`
- `.agents/skills/vault-verify-content/SKILL.md`
- `.agents/skills/vault-log-run/SKILL.md`

Files that may be created or modified during tests:

- `02-materiel/network-roce-infiniband-thunderbolt.md`
- `.agents/vault-maintenance/lexicon-backlog.md`
- `.agents/vault-maintenance/runs/YYYY/MM/*.md`
- `docs/plans/2026_06_02_23-18_main_vault-skills-calibration-tests.plan.md`

## Test principles

- Audits must be read-only except for the step explicitly dedicated to generation.
- Public pages must never contain agent notes.
- Run logs must exist for significant tasks, but not for micro-corrections.
- Performance claims must be sourced or stated cautiously.
- The test succeeds only if the output is useful to the project, not only procedure-compliant.

## Test 1 - Explicit activation

### Purpose

Verify that the `vault-maintenance-report` skill works when explicitly requested.

### Test prompt

```text
Use the vault-maintenance-report skill explicitly to produce a read-only audit of the 02-materiel/ folder.
Do not modify any article. I want a short report with priorities, freshness risks, links/lexicon items to watch, and any agent notes that may have leaked into public content.
Create a run log if the report is kept as a durable artifact.
```

### Success criteria

- The agent applies `vault-maintenance-report`.
- No public article is modified.
- The report is structured and actionable.
- Agent notes in public content are explicitly searched for.
- A run log is created only if the report is kept as a durable artifact.

### Typical failure

- The agent fixes articles directly.
- The report is vague.
- The skill does not check the public content / agent notes boundary.

## Test 2 - Implicit activation

### Purpose

Verify that skill descriptions are good enough to trigger the right workflow without naming the skill.

### Test prompt

```text
Run a read-only freshness audit of articles in chapter 02-materiel.
I want to know which content may be outdated or under-sourced, but do not change anything yet.
```

### Success criteria

- The agent naturally chooses `vault-maintenance-report` or `vault-verify-content`.
- It stays read-only.
- It distinguishes high freshness-risk topics: hardware, interconnects, performance, commands, software versions.
- It proposes next actions without generating unnecessary refactors.

### Decision after test

- If the right skill does not activate, strengthen the concerned skill `description`.
- If too many skills activate, reduce descriptions or clarify usage thresholds.

## Test 3 - Real generation and anti-drift

### Purpose

Test `vault-generate-content`, `vault-log-run`, and the public content / agent notes boundary with a real page useful to the project.

### Target page

Create:

```text
02-materiel/network-roce-infiniband-thunderbolt.md
```

This page is the next building block of chapter `02 - Le Matériel`, after `APU et Mémoire Unifiée` and `Stations Multi-GPU`.

### Expected editorial angle

The page should explain how to connect machines or accelerators for on-prem AI:

- why the network becomes the bottleneck after VRAM and PCIe
- difference between classic Ethernet, RoCE, InfiniBand, and Thunderbolt
- GPUDirect RDMA and its practical limits
- realistic use cases: isolated workstation, desktop mini-cluster, homelab, SMB, datacenter
- what not to promise: Thunderbolt is not external NVLink, RoCE requires a well-configured network
- architecture advice for Zero to Hero readers

### Generation constraints

- Use relevant sources for technical claims.
- Nuance throughput/latency figures if sources are not sufficiently contextualized.
- Link relevant existing lexicon entries.
- Put new entries to create or verify in `.agents/vault-maintenance/lexicon-backlog.md`, not in the article.
- Create a run log.

### Test prompt

```text
Generate the page 02-materiel/network-roce-infiniband-thunderbolt.md using the vault-generate-content workflow.
This page should advance chapter 02 of the vault.
Respect the public content / agent notes boundary: no lexicon follow-up or run log section in the public article.
Put lexicon follow-up in .agents/vault-maintenance/lexicon-backlog.md and create a run log.
```

### Success criteria

- The public article is readable and useful.
- No agent block appears in the article.
- Performance claims are sourced or cautious.
- Important terms are linked or recorded in the lexicon backlog.
- A run log is created.
- The Starlight build passes.

### Typical failure

- The article contains a `Lexique - actions` section.
- Network figures are stated without context.
- Thunderbolt is presented as equivalent to NVLink.
- RoCE is presented as plug-and-play without mentioning PFC/ECN, congestion, or network configuration.

## Test 4 - Calibration on micro-task

### Purpose

Verify that skills do not turn a small fix into a heavy procedure.

### Test prompt

```text
Fix only an obvious typo in 02-materiel/stations-multi-gpu.md.
Do not create a plan, do not create a run log, and do not run a full build unless the fix breaks Markdown syntax.
```

### Success criteria

- A single targeted correction.
- No plan created.
- No run log created.
- No backlog modified.
- The agent briefly explains it kept the procedure light because the task was minimal.

### Typical failure

- The agent creates a full plan.
- The agent rewrites paragraphs.
- The agent adds a run log or modifies the backlog.

## Test 5 - Result and final validation

### Purpose

Verify that artifacts produced by the tests are consistent with each other and publishable without agent leakage.

### Validation commands

From `D:\Webdev\starlight-obsidian-engine`:

```powershell
npm run build
```

From `D:\Webdev\ia-on-prem-vault`:

```powershell
git status --short
```

### Manual checks

- `02-materiel/network-roce-infiniband-thunderbolt.md` contains no agent section.
- `.agents/vault-maintenance/lexicon-backlog.md` contains any lexicon follow-up.
- `.agents/vault-maintenance/runs/` contains run logs for significant tasks.
- Plans and `.agents/**` files remain excluded from publication.
- The build generates the new page without YAML or schema errors.

### Overall success criteria

- Explicit activation: passed.
- Implicit activation: passed or adjustment identified.
- Anti-drift: passed, no agent content in public pages.
- Calibration: passed, light micro-task handling.
- Result: build OK and useful deliverables.

## Expected report after execution

At the end of this plan’s execution, append a report with:

- tests executed
- prompts actually used
- files created/modified
- run logs created
- build/lints
- failures or required adjustments in skill descriptions
- decision: skills well calibrated, too weak, or too intrusive

---

## Implementation report

### Tests executed

All five plan tests were executed.

1. **Explicit activation**: used `vault-maintenance-report` for a read-only audit of `02-materiel/`.
2. **Implicit activation**: read-only freshness audit of the hardware chapter without requesting modifications.
3. **Real generation**: created `02-materiel/network-roce-infiniband-thunderbolt.md`.
4. **Micro-task calibration**: single correction of `systeme` to `système` in `02-materiel/stations-multi-gpu.md`, without dedicated plan or run log.
5. **Final validation**: searched for agent leakage, IDE diagnostics, Starlight build.

### Prompts actually used

Plan prompts were followed in spirit. The generation test was executed as a real deliverable for chapter `02-materiel`, with the `vault-generate-content` workflow, then verified with `vault-verify-content`.

### Files created

- `02-materiel/network-roce-infiniband-thunderbolt.md`
- `.agents/vault-maintenance/runs/2026/06/2026_06_02_23-21_main_explicit-maintenance-audit-02-materiel.md`
- `.agents/vault-maintenance/runs/2026/06/2026_06_02_23-25_main_generate-reseau-ia-roce-et-thunderbolt.md`
- `docs/plans/2026_06_02_23-18_main_vault-skills-calibration-tests.plan.md`

### Files modified

- `.agents/vault-maintenance/lexicon-backlog.md`
- `02-materiel/stations-multi-gpu.md`
- `docs/plans/2026_06_02_23-18_main_vault-skills-calibration-tests.plan.md`

One modified file was already visible in status during validation but was not edited in this test:

- `config-concat-code.yaml`

### Test results

**Test 1 - Explicit activation**

- Result: passed.
- The audit stayed read-only.
- No public article was modified by this test.
- No agent note markers were found in `02-materiel/`.
- Run log created: `.agents/vault-maintenance/runs/2026/06/2026_06_02_23-21_main_explicit-maintenance-audit-02-materiel.md`.

**Test 2 - Implicit activation**

- Result: passed with methodological limitation.
- The applied workflow matches `vault-maintenance-report` / `vault-verify-content`.
- Limitation: the test ran in the same agent session, so it is not perfect isolation of a fresh agent.
- Recommended adjustment: later, rerun this test with a new agent/clean context to measure real automatic activation.

**Test 3 - Real generation and anti-drift**

- Result: passed.
- Article created: `02-materiel/network-roce-infiniband-thunderbolt.md`.
- The article contains no agent section, run log, or internal lexicon follow-up.
- Strong technical claims use NVIDIA, Intel/Thunderbolt, and vLLM sources.
- Lexicon follow-up was placed in `.agents/vault-maintenance/lexicon-backlog.md`.
- Run log created: `.agents/vault-maintenance/runs/2026/06/2026_06_02_23-25_main_generate-reseau-ia-roce-et-thunderbolt.md`.

**Test 4 - Micro-task calibration**

- Result: passed.
- A single targeted correction was made in `02-materiel/stations-multi-gpu.md`.
- No dedicated plan, no dedicated run log, no backlog change for this micro-correction.
- Behavior confirms skills do not force a heavy procedure for a small fix.

**Test 5 - Final validation**

- Result: passed.
- Agent leakage search in `02-materiel/`: no match for `Lexique - actions`, `Nouvelles fiches`, `Fiches à vérifier`, `runId`, `TODO agent`, `Run Log`, or `Lexicon follow-up`.
- IDE diagnostics: no linter errors on edited files.
- Starlight build: success.

### Build evidence

Command:

```powershell
npm run build
```

Directory:

```text
D:\Webdev\starlight-obsidian-engine
```

Result:

- Lexicon index regenerated: 26 entries.
- Link graph regenerated: 35 targets, 161 backlinks.
- Vault loader: 9 unpublished files excluded.
- New route generated: `/02-materiel/network-roce-infiniband-thunderbolt/index.html`.
- Pages generated: 76.
- Build completed successfully.

### Calibration decision

Skills are generally well calibrated:

- `vault-maintenance-report` is useful for read-only audits.
- `vault-generate-content` correctly kept lexicon follow-up out of the public article.
- `vault-verify-content` covered the public content / agent notes boundary well.
- `vault-log-run` is useful for significant tasks, but must not be applied to micro-corrections.

Point to improve later:

- Rerun the implicit activation test in a clean session to verify automatic discovery without already-loaded context.

