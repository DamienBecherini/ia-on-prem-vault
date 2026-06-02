---
name: stations-multi-gpu
overview: Générer la prochaine page du chapitre 02 sur les stations multi-GPU NVIDIA, PCIe, VRAM et limites d'interconnexion pour l'inférence IA on-premise.
todos:
  - id: source-scan
    content: Rassembler des sources fiables sur GPU workstation/datacenter, PCIe, NVLink/NVSwitch et inférence multi-GPU
    status: pending
  - id: article
    content: Créer 02-materiel/stations-multi-gpu.md avec citations, schémas et conseils architecte
    status: pending
  - id: sidebar
    content: Vérifier et compléter la navigation 02 - Le Matériel dans site.config.json si nécessaire
    status: pending
  - id: lexicon
    content: Ajouter la checklist lexique pour les termes existants et fiches à vérifier
    status: pending
  - id: verify
    content: Vérifier l'article, les sources et le build Starlight, puis append le rapport
    status: pending
  - id: separate-agent-notes
    content: Retirer les notes de travail agent de l'article public et les déplacer vers un backlog non publié
    status: pending
  - id: update-generation-skill
    content: Mettre à jour le skill de génération pour ne plus publier les sections Lexique - actions
    status: pending
isProject: false
---

# Stations Multi-GPU - Plan

## Objectif

Créer la prochaine page du chapitre `02-materiel/` :

```text
02-materiel/stations-multi-gpu.md
```

Sujet : **stations multi-GPU NVIDIA, PCIe, VRAM, NVLink/NVSwitch et arbitrages pour l'inférence IA on-premise**.

L'article doit compléter `02-materiel/apu-et-memoire-unifiee.md` :

- APU / mémoire unifiée : grande capacité partagée, bande passante plus faible, simplicité.
- Multi-GPU discret : très forte bande passante VRAM par carte, capacité cumulée, mais interconnexion et parallélisme plus complexes.

## Files

- Create: `02-materiel/stations-multi-gpu.md`
- Modify: `site.config.json` if the `02 - Le Matériel` sidebar section is absent
- Create: `.agents/vault-maintenance/lexicon-backlog.md`
- Modify: `.agents/skills/vault-generate-content/SKILL.md`
- Modify: this plan, append implementation/build reports after execution

## Source Targets

Priorité aux sources officielles :

- NVIDIA product specifications for RTX workstation and datacenter GPUs
- NVIDIA documentation/blogs on NVLink, NVSwitch, multi-GPU communication, TensorRT-LLM or Dynamo
- vLLM documentation on tensor parallelism and distributed inference
- PCI-SIG or vendor documentation for PCIe bandwidth/context
- Existing vault pages and lexicon entries for internal consistency

Avoid unsourced benchmark claims. If performance is discussed, phrase as architecture-level guidance unless a source gives exact context.

## Article Structure

Flexible chapter structure, not lexicon template:

1. Introduction: why multi-GPU exists in on-prem inference.
2. Hardware landscape: workstation GPUs vs datacenter GPUs.
3. PCIe bottleneck: why VRAM capacity does not simply add up.
4. NVLink/NVSwitch: when interconnect changes the design.
5. Parallelism modes: tensor parallel, pipeline parallel, data parallel / concurrent serving.
6. Practical sizing: when to choose APU, single GPU, dual GPU, or server GPU.
7. Architect advice for OpenHuman.
8. Sources.

## Lexicon Checklist

Lexicon follow-up must stay out of the public article. Store it in this plan report and in `.agents/vault-maintenance/lexicon-backlog.md`.

Existing entries linked or to verify:

- `[[00-lexique/multi-gpu]]`
- `[[00-lexique/pcie]]`
- `[[00-lexique/nvlink]]`
- `[[00-lexique/vram]]`
- `[[00-lexique/rdma]]`
- `[[00-lexique/roce]]`
- `[[00-lexique/offloading]]`
- `[[00-lexique/tokens-par-seconde]]`
- `[[00-lexique/ttft]]`

Potential new entries:

- `00-lexique/nvswitch.md`
- `00-lexique/tensor-parallelism.md`
- `00-lexique/pipeline-parallelism.md`
- `00-lexique/nccl.md`

## Tasks

- [x] Gather and verify external sources.
- [x] Draft `02-materiel/stations-multi-gpu.md` with internal wikilinks and citations.
- [x] Add the `02 - Le Matériel` sidebar section to `site.config.json` if missing.
- [x] Include a `Lexique - actions` section in the article.
- [x] Run lints on edited files.
- [x] Run the Starlight build from the engine repo.
- [x] Append the implementation/build report to this plan.
- [x] Remove the public `Lexique - actions` section from `02-materiel/stations-multi-gpu.md`.
- [x] Create `.agents/vault-maintenance/lexicon-backlog.md` with the extracted lexicon follow-up.
- [x] Update `vault-generate-content` so future chapter articles never include agent-only sections in public content.
- [x] Run lints and Starlight build again.
- [x] Append the follow-up implementation/build report to this plan.

## Success Criteria

- The article builds as a Starlight page.
- It avoids unsupported performance claims.
- It explains why multi-GPU does not mean simple VRAM pooling.
- It distinguishes PCIe workstation rigs from NVLink/NVSwitch systems.
- It links existing lexicon entries and lists lexicon follow-up.
- Lexicon follow-up is stored outside public articles.
- The generation skill explicitly separates public content from agent maintenance notes.
- The build report is appended to this plan.

---

## Implementation/build report

### Changes

- Created `02-materiel/stations-multi-gpu.md`.
- Added `02 - Le Matériel` to the vault sidebar in `site.config.json`.
- Added a `Lexique - actions` section in the new article for existing links, missing lexicon entries, and entries to verify/update.

### Sources used

- NVIDIA RTX 6000 Ada official product page.
- NVIDIA RTX PRO 6000 Blackwell Workstation official product page.
- NVIDIA NVLink/NVSwitch technical blog.
- PCI-SIG PCIe 5.0 FAQ.
- vLLM parallelism and scaling documentation.
- NVIDIA TensorRT-LLM parallelism documentation.

### Validation

- Lint diagnostics: no linter errors found for the edited vault files.
- First build command: `npm run build` from `D:\Webdev\starlight-obsidian-engine`.
  - Result: failed.
  - Root cause: YAML frontmatter title contained an unquoted colon.
  - Fix: quoted `title` and `description` in `02-materiel/stations-multi-gpu.md`.
- Second build command: `npm run build` from `D:\Webdev\starlight-obsidian-engine`.
  - Result: passed.
  - Evidence: route `/02-materiel/stations-multi-gpu/index.html` generated; 74 pages built; Pagefind index and sitemap generated.
  - Warnings: existing Astro markdown plugin deprecation warning, Vite chunk size warning, and `Entry docs -> 404 was not found`.

### Limitations and follow-up

- No performance benchmark table was added because exact multi-GPU LLM throughput depends heavily on model, quantization, backend, batch size and interconnect.
- Follow-up lexicon entries suggested: `nvswitch`, `tensor-parallelism`, `pipeline-parallelism`, `nccl`.
- Existing lexicon entries to improve: `multi-gpu`, `nvlink`, `pcie`, `vram`.

---

## Follow-up implementation/build report

### Reason for follow-up

The first implementation mixed reader-facing content with agent maintenance notes by publishing a `Lexique - actions` section inside `02-materiel/stations-multi-gpu.md`.

The intended boundary is now:

- public chapter articles contain only reader-facing content, useful wikilinks and sources
- agent-only lexicon follow-up lives in the implementation plan and `.agents/vault-maintenance/lexicon-backlog.md`
- the generation skill enforces this separation for future content

### Changes

- Removed the `Lexique - actions` section from `02-materiel/stations-multi-gpu.md`.
- Created `.agents/vault-maintenance/lexicon-backlog.md`.
- Moved the multi-GPU lexicon follow-up into that backlog:
  - new entries to create: `nvswitch`, `tensor-parallelism`, `pipeline-parallelism`, `nccl`
  - existing entries to verify/update: `multi-gpu`, `nvlink`, `pcie`, `vram`
  - already linked entries from the article: `multi-gpu`, `pcie`, `nvlink`, `vram`, `rdma`, `roce`, `offloading`
- Updated `.agents/skills/vault-generate-content/SKILL.md`:
  - chapter generation must not publish agent maintenance sections
  - lexicon follow-up must go to the plan/report and `.agents/vault-maintenance/lexicon-backlog.md`
  - if the backlog does not exist, it must be created before finishing the task

### Validation

- Lint diagnostics: no linter errors found for the edited article, backlog, skill and plan.
- Build command: `npm run build` from `D:\Webdev\starlight-obsidian-engine`.
  - Result: passed.
  - Evidence: route `/02-materiel/stations-multi-gpu/index.html` generated; 74 pages built; Pagefind index and sitemap generated.
  - Link graph: 34 targets, 154 backlinks.
  - Warnings: existing Astro markdown plugin deprecation warning, Vite chunk size warning, and `Entry docs -> 404 was not found`.

### Notes

- `.agents/**` remains excluded from public site generation through `publish.exclude` in `site.config.json`.
- The lexicon backlog is now the durable location for agent maintenance tasks that should not appear in published articles.

