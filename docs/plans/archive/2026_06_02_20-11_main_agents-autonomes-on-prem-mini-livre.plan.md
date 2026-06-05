---
name: agents-autonomes-on-prem-mini-livre
overview: Create a new vault section on on-prem autonomous agents, focused on sovereign maintenance of a Markdown vault with a human-in-the-loop workflow.
todos:
  - id: structure-section
    content: Create the 05-agents-autonomes-on-prem tree and entry page
    status: pending
  - id: cadrage-editorial
    content: Write vision, sovereignty, architectures, and human-in-the-loop workflow pages
    status: pending
  - id: fiches-solutions
    content: Create solution sheets for Cursor CLI, Aider, OpenHands, Ollama, LiteLLM, SearXNG/Tavily, and LLM Wiki projects
    status: pending
  - id: comparatif
    content: Write the reasoned comparison and target architecture recommendation
    status: pending
  - id: lexique
    content: Identify then create or update required lexicon entries
    status: pending
  - id: validation
    content: Verify sources, linking, Starlight build, and append the implementation report
    status: pending
isProject: false
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

> ⚠️ **SUPERSEDED — 2026-06-04**
> This plan has been replaced by a broader combined plan:
> **`2026_06_04_08-14_main_agents-et-assistants-on-prem.plan.md`**
>
> That plan merges the custodian agents track (Track B, inherited from this document) with a new
> personal AI assistants track (Track A), shared sovereignty foundations, and the OpenHuman
> cleanup pre-migration. The target section is `05-agents-et-assistants-on-prem/`.
> Do not execute this plan. Refer to the new plan instead.

---

# On-prem autonomous agents - mini-book

## Objective

Create a new editorial section of the vault devoted to **on-prem autonomous agents** capable of auditing, maintaining, and proposing updates to a Markdown/Obsidian vault, with a human validation circuit.

This section should extend the vault’s initial journey:

- `01-fondations/` - physics of AI
- `02-materiel/` - hardware architectures
- `03-stack-logicielle/` - engines and frameworks
- `04-blueprints/` - architecture scenarios
- `05-agents-autonomes-on-prem/` - autonomous agents, sovereignty, and continuous maintenance

The through-line is the **custodian agent**: an agent that monitors the vault, detects outdated knowledge, proposes sourced corrections, works in branches/PRs, and leaves validation to humans.

## Editorial positioning

Sovereignty is a major criterion.

The section will present Cursor CLI and Cursor Automations as simple, powerful solutions, but explain why they are not the sovereign target architecture: model choice limited by Cursor, dependency on Cursor Cloud depending on modes, and confidentiality uncertainties when data transits their services.

The target architecture to study favors:

- VPS runner or Proxmox VM
- open-source CLI agent or orchestrator
- local models via Ollama or external models via LiteLLM
- controlled web search via SearXNG or Tavily
- Git work in dated branches
- PR or report, never direct push to `main`
- email/webhook notifications
- `human-in-the-loop` or `human-on-the-loop` loop

## Target tree

```text
05-agents-autonomes-on-prem/
  index.md
  vision-agent-custodian.md
  souverainete-et-confidentialite.md
  architectures-possibles.md
  comparatif-cursor-cli-aider-openhands.md
  workflow-human-in-the-loop.md
  github-branches-pr-notifications.md
  recherche-web-et-sources.md
  recommandation-architecture-cible.md

  solutions/
    index-solutions-agentiques.md
    cursor-cli.md
    aider.md
    openhands.md
    ollama.md
    litellm.md
    searxng.md
    tavily.md
    markdown-vault-mcp.md
    obsidian-vault-intelligence.md
    llm-wiki.md
    ai-assisted-docs.md
```

## Solution sheet structure

Each sheet in `05-agents-autonomes-on-prem/solutions/` should follow a flexible but comparable structure:

```markdown
## Quick overview

## Why this solution matters to us

## Advantages

## Limits and risks

## Sovereignty and confidentiality

## Possible vault integration

## Project maturity

## Sources

## Provisional verdict
```

Popularity figures, dates, features, and maturity claims must be sourced or stated cautiously.

## Phases

### Phase 1 - Structure and entry page

**Files:**

- Create: `05-agents-autonomes-on-prem/index.md`
- Create: `05-agents-autonomes-on-prem/solutions/index-solutions-agentiques.md`
- Modify: `site.config.json` if needed to add the section to the sidebar

**Steps:**

- [ ] Create the `05-agents-autonomes-on-prem/` folder.
- [ ] Create an `index.md` page that explains the section purpose and offers a navigation plan.
- [ ] Create `solutions/index-solutions-agentiques.md` as an index of studied projects and tools.
- [ ] Add the section to the vault sidebar if it should appear in published navigation.

### Phase 2 - Cross-cutting framing

**Files:**

- Create: `05-agents-autonomes-on-prem/vision-agent-custodian.md`
- Create: `05-agents-autonomes-on-prem/souverainete-et-confidentialite.md`
- Create: `05-agents-autonomes-on-prem/architectures-possibles.md`
- Create: `05-agents-autonomes-on-prem/workflow-human-in-the-loop.md`
- Create: `05-agents-autonomes-on-prem/github-branches-pr-notifications.md`
- Create: `05-agents-autonomes-on-prem/recherche-web-et-sources.md`

**Steps:**

- [ ] Define the custodian agent vision.
- [ ] Describe sovereignty, privacy, model choice, and data transit issues.
- [ ] Compare VPS, Proxmox, Cursor CLI, Aider, OpenHands, and home-grown custodian architectures.
- [ ] Describe the report → branch → PR → human review → merge → publication workflow.
- [ ] Describe GitHub strategies: bot account, GitHub App, dated branches, PR, email/webhook.
- [ ] Describe web search building blocks: Cursor web tools, SearXNG, Tavily, source logs, and budgets.

### Phase 3 - Solution sheets

**Files:**

- Create: `05-agents-autonomes-on-prem/solutions/cursor-cli.md`
- Create: `05-agents-autonomes-on-prem/solutions/aider.md`
- Create: `05-agents-autonomes-on-prem/solutions/openhands.md`
- Create: `05-agents-autonomes-on-prem/solutions/ollama.md`
- Create: `05-agents-autonomes-on-prem/solutions/litellm.md`
- Create: `05-agents-autonomes-on-prem/solutions/searxng.md`
- Create: `05-agents-autonomes-on-prem/solutions/tavily.md`
- Create: `05-agents-autonomes-on-prem/solutions/markdown-vault-mcp.md`
- Create: `05-agents-autonomes-on-prem/solutions/obsidian-vault-intelligence.md`
- Create: `05-agents-autonomes-on-prem/solutions/llm-wiki.md`
- Create: `05-agents-autonomes-on-prem/solutions/ai-assisted-docs.md`

**Steps:**

- [ ] For each solution, gather primary sources: official repo, docs, README, release/stars if relevant.
- [ ] Write a short, sourced, comparable sheet.
- [ ] Clearly separate verified facts from hypotheses or limits to audit later.
- [ ] Link each sheet to cross-cutting pages and the lexicon.

### Phase 4 - Comparison and recommendation

**Files:**

- Create: `05-agents-autonomes-on-prem/comparatif-cursor-cli-aider-openhands.md`
- Create: `05-agents-autonomes-on-prem/recommandation-architecture-cible.md`

**Steps:**

- [ ] Compare Cursor CLI, Aider, and OpenHands on: simplicity, sovereignty, model choice, Git integration, web search, maturity, cost, risks.
- [ ] Explain why Cursor CLI is interesting for an MVP but not ideal as a sovereign target.
- [ ] Propose a trajectory: simple MVP → model-agnostic runner → home-grown custodian.
- [ ] Define autonomy levels: report-only, branch, PR, human review, staging, publication.

### Phase 5 - Lexicon

**Files:**

- Potential create/update under `00-lexique/`

**Terms to evaluate:**

- `agent-autonome`
- `agent-custodian`
- `human-in-the-loop`
- `human-on-the-loop`
- `mcp`
- `litellm`
- `ollama`
- `searxng`
- `tavily`
- `github-app`
- `pat`
- `systemd-timer`
- `agent-cli`
- `llm-wiki`

**Steps:**

- [ ] Identify terms already covered by the lexicon.
- [ ] Create missing entries with `_templates/_Terme Lexique.md`.
- [ ] Add `Voir aussi` links between lexicon entries and the new section.
- [ ] Update `00-lexique/ai-glossary.md` if some terms should join recommended paths or the acronym index.

### Phase 6 - Verification and publication

**Files:**

- Modify: created pages
- Modify: this plan, append implementation report after execution

**Steps:**

- [ ] Run the `vault-verify-content` skill on main pages.
- [ ] Verify external sources, especially claims on maturity, supported models, privacy, and automation.
- [ ] Verify that `docs/plans/**`, `.agents/**`, and `.cursor/**` remain excluded from publication via `publish.exclude`.
- [ ] Run the Starlight build via the engine.
- [ ] Append the implementation/build report to the end of this plan.

## Success criteria

- The `05-agents-autonomes-on-prem/` section exists and has a navigable entry page.
- Each solution sheet distinguishes facts, limits, vault interest, and sovereignty level.
- Maturity and feature claims are sourced.
- The comparison clearly explains why Cursor CLI can serve as an MVP but is not the sovereign target.
- The target architecture recommendation proposes a pragmatic trajectory.
- Important terms are linked to the lexicon or listed for creation.
- The Starlight build passes after creating the section.

