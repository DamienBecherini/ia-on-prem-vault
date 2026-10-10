<div align="center">

# ZTH: On-Premise AI

**Zero to Hero — architect and deploy self-hosted LLMs: sovereign, private, high-performance.**

**[Read online → ia-on-prem.damien.becherini.fr](https://ia-on-prem.damien.becherini.fr)**

[![Live site](https://img.shields.io/badge/live-ia--on--prem.damien.becherini.fr-0A7EA4)](https://ia-on-prem.damien.becherini.fr)
[![Built with starlight-obsidian-engine](https://img.shields.io/badge/built%20with-starlight--obsidian--engine-BC52EE?logo=astro&logoColor=white)](https://github.com/DamienBecherini/starlight-obsidian-engine)
[![Obsidian](https://img.shields.io/badge/Obsidian-vault-7C3AED?logo=obsidian&logoColor=white)](https://obsidian.md)
[![Lang](https://img.shields.io/badge/lang-FR%20%2F%20EN-0A7EA4)](#content)
[![Digital garden](https://img.shields.io/badge/type-digital%20garden-2EA043)](https://ia-on-prem.damien.becherini.fr)
[![Content: CC0 1.0](https://img.shields.io/badge/content-CC0%201.0-lightgrey.svg)](LICENSE)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE-CODE)

</div>

---

This repository is the **Obsidian vault** (content) of *Zero to Hero: On-Premise AI* — a **digital garden**
that explains how to size, deploy, and understand the hardware and software stacks needed to run massive AI
models **fully locally**, private and fast.

Notes are authored in Markdown in Obsidian (wiki links `[[...]]`, templates, Mermaid diagrams) and
**published as a static site** by the [`starlight-obsidian-engine`](https://github.com/DamienBecherini/starlight-obsidian-engine),
to which this vault is attached via a junction. Only the **notes** live here — no engine code.

## Content

- **Foundations** — AI physics: memory bandwidth, unified memory vs RAM vs VRAM, KV cache, quantization, prompt journey.
- **Hardware** — APUs & unified memory (Strix Halo, Mac), multi-GPU workstations, AI networking (RoCE, InfiniBand, Thunderbolt).
- **Software stack** — inference engines (Ollama, vLLM, TensorRT-LLM), clustering (Exo, Ray), RAG & agents, model selection guide.
- **Blueprints** — four ready-to-use scenarios from dev lab to enterprise datacenter, with TCO comparison.
- **Agents & assistants** — personal assistants (Open WebUI, AnythingLLM, Khoj, Jan AI), custodian agents (OpenHands, Aider, LiteLLM), sovereignty & privacy audit grid.
- **Implementation** — getting started with Ollama, evaluating models, securing local inference, multi-GPU vLLM, Prometheus/Grafana monitoring, Ollama → vLLM migration.

Site content is **French and English** (`en/` locale folder). This README is **English only** (repository documentation).

### How the content is written

The content is written **with AI assistance, under human direction**: the author sets the plan and the editorial line, every
numeric or time-sensitive claim must cite a primary source (tier A/B, dated), and every change goes through a pull request
reviewed and merged by the author. Pages carry `last_verified` / `verified_by` when they were actually audited, and
`verified_hitl*` only after human sign-off (see [`docs/frontmatter-schema.md`](docs/frontmatter-schema.md)).
Errors remain possible: check the cited sources before acting on a figure, and open an issue if one is wrong.

## Keeping it up to date

The ecosystem moves weekly, so the vault is maintained by deterministic scripts plus agent skills, with a human merge at the end.

| What | How |
| :-- | :-- |
| Freshness | `freshness.yml` (Mondays): pages due for review, and claims of the [watchlist](.agents/vault-maintenance/watchlist/) past their **Recheck by** date |
| Sources | `npm run audit:sources`: inventory and HTTP probe of every cited URL, tiers in [`source-tiers.md`](.agents/vault-maintenance/source-tiers.md) |
| Ecosystem watch | `watch.yml` (every other Monday): releases, advisories, models and news from [`feeds.json`](.agents/vault-maintenance/feeds.json), pre-triaged into a `veille` issue; an `urgent` issue when a High / Critical advisory is not covered by the [version floors](.agents/vault-maintenance/version-floors.json) |
| Processing | agent skill `vault-watch` ("traite la veille #N"): verify on primary sources, report, then one PR with FR + EN edits after the author's go-ahead |

```bash
npm run audit:freshness:due                          # pages due + watchlist claims past "Recheck by"
npm run audit:sources                                # cited URLs (network)
GITHUB_TOKEN=$(gh auth token) npm run watch:feeds    # what changed recently
node scripts/backfill-verified.mjs --write --paths=<fr.md,en/fr.md>   # stamp audited pages only
```

Agent skills (canonical in `.agents/skills/`, entry points in `.claude/skills/`): `vault-watch`, `vault-refresh-outdated-content`,
`vault-verify-content`, `vault-generate-content`, `vault-translate-content`, `vault-maintenance-report`, `vault-log-run`.
Rules for agents and contributors: [`CLAUDE.md`](CLAUDE.md) and [`.agents/rules/`](.agents/rules/).

## Contributing

`main` is protected: every change goes through a pull request from a branch off `main`, with the checks
`Vault quality checks` and `Internal link audit (engine)` required, and is squash-merged. A substantive French edit
updates `last_modified` and its English mirror in the same PR. Corrections with a source are welcome as issues or PRs.

## Vault layout

```
site.config.json        site manifest for the engine (title, locales, sidebar, social, lexicon)
.env.example            deploy credentials template (copy to .env, never committed)
package.json            vault-local npm scripts (delegate to the engine)
index.mdx               home page (hero)
00-index.md             "Zero to Hero" table of contents
00-lexique/             AI glossary (term pages + hub + generated index)
01-fondations/          ch. 01 — AI physics (FR + en/ mirror)
02-materiel/            ch. 02 — hardware (FR + en/ mirror)
03-stack-logicielle/    ch. 03 — software stack (FR + en/ mirror)
04-blueprints/          ch. 04 — deployment scenarios (FR + en/ mirror)
05-agents-et-assistants-on-prem/  ch. 05 — agents & assistants (FR + en/ mirror)
06-mise-en-oeuvre/      ch. 06 — practical implementation (FR + en/ mirror)
en/                     English locale root (mirrors FR chapters under en/)
scripts/                vault-local scripts (audits, freshness, sources, watch feeds, backfill, delegate)
docs/                   repository docs (frontmatter schema, quality checks; not published)
.github/workflows/      CI (ci.yml), freshness report (freshness.yml), ecosystem watch (watch.yml)
_templates/             Obsidian templates (_Terme Lexique.md, _Nouveau Chapitre.md)
_private/               confidential notes (gitignored, never published)
.agents/                agent skills, rules and maintenance (excluded from publish)
.agents/rules/          canonical agent rules (git workflow, language, editorial); .cursor/rules/ only points to them
.agents/vault-maintenance/  watchlist, source tiers, feeds, version floors, watch reports, lexicon backlog
.agents/plans/          working plans (gitignored except README)
CLAUDE.md               entry point for Claude Code (rules, skills, commands); .claude/skills/ exposes the vault skills
LICENSE, LICENSE-CODE   CC0 1.0 for the content, MIT for the code
```

### Lexicon (this vault)

- **Hub** : `00-lexique/ai-glossary.md` (curated overview).
- **Generated index** : `00-lexique/lexicon-index.md` (alphabetical table; regen at build when `lexicon.enabled` in `site.config.json`).
- **New term** : use `_templates/_Terme Lexique.md`, tag `lexique` in frontmatter.
- **Regenerate index manually** (from the engine repo): `npm run lexicon:index` (vault is resolved via the `src/content/docs` junction; no `VAULT_PATH` needed after `npm run link:vault`).
- **Commit policy** : commit `lexicon-index.md` with the vault when you add or change lexicon entries.

The engine excludes everything matched by the vault [`.gitignore`](.gitignore) (including `_private/*`) and
**never builds this root `README.md`** as a site page. See the engine
[Private / unpublished notes](https://github.com/DamienBecherini/starlight-obsidian-engine#private--unpublished-notes) section.

## Obsidian

Open **this folder** as an Obsidian vault.

To preview the site locally, follow the [engine README](https://github.com/DamienBecherini/starlight-obsidian-engine#quick-start)
(`npm run link:vault` then `npm run dev` in the engine repo).

## Publish to the web

Deploy credentials (FTPS or SFTP) belong in **this vault's `.env`** (see [`.env.example`](.env.example)).
Use the `DEPLOY_*` variables; pick the protocol with `DEPLOY_PROTOCOL`.

```bash
cp .env.example .env    # ENGINE_PATH + DEPLOY_*
npm run publish         # git + build + incremental upload (FTPS/SFTP)
npm run publish:full    # git + build + full remote scan + upload all + mirror
npm run deploy          # build + incremental upload (no git)
npm run deploy:full     # build + full remote scan + upload all + mirror
npm run upload          # incremental upload only (existing dist/)
npm run upload:full     # full remote scan + upload all + mirror
```

Incremental deploy uses `.deploy-manifest.json` (gitignored in this vault) plus a **remote copy** at
`{DEPLOY_REMOTE_PATH}/.deploy-manifest.json`. The engine merges both before comparing `dist/` hashes, so
CI and multi-machine deploys stay in sync; only changed files are uploaded after each build.

Add `-- --yes` to skip the confirmation prompt (e.g. `npm run upload:full -- --yes`). Do **not** use `npm run upload --full` — npm silently consumes flags placed before `--` and they never reach the script.

Run `npm run audit:links` in the engine to list unresolved wiki/MD links (lexicon backlog and [link audit allowlist](.agents/vault-maintenance/link-audit-allowlist.md)). From this vault you can also run `npm run audit:links` (delegates to the engine via `ENGINE_PATH`).

## Quality checks

Automated, deterministic checks run on every PR (no LLM agent required). Full reference: [`docs/quality-checks.md`](docs/quality-checks.md).

```bash
npm test                  # CI gate: frontmatter + Mermaid + agent-leaks + i18n strict
npm run audit:frontmatter
npm run audit:mermaid
npm run audit:agent-leaks
npm run audit:i18n:strict
npm run audit:ascii       # warn-only; use audit:ascii:strict to fail
npm run audit:links       # requires ENGINE_PATH in .env
```

GitHub Actions workflows: [`ci.yml`](.github/workflows/ci.yml) (every PR), [`freshness.yml`](.github/workflows/freshness.yml) and [`watch.yml`](.github/workflows/watch.yml) (scheduled, see [Keeping it up to date](#keeping-it-up-to-date)).

### FR/EN translation drift

After French content changes, list EN mirrors that need updating:

```bash
npm run audit:i18n          # default: FR newer than EN by > 7 days
npm run audit:i18n:strict   # any FR newer than EN (translation backlog)
```

Relies on `last_modified` frontmatter on FR and EN pairs. Backfill missing dates with `npm run backfill:dates:write`.

Agent working plans live in `.agents/plans/` (not published). Skills and maintenance notes live under `.agents/`.

To make the site **private** (Apache Basic Auth), fill in `AUTH_*` in `.env`, then:

```bash
npm run auth:install    # generate + upload .htaccess + .htpasswd
npm run auth:remove     # make the site public again
```

Full docs: engine [Publishing](https://github.com/DamienBecherini/starlight-obsidian-engine#publishing) section.

## License

- **Content** (notes, lexicon, diagrams, documentation): [CC0 1.0 Universal](LICENSE), dedicated to the public domain.
  You may copy, adapt and reuse it for any purpose, including commercially, without asking or giving credit.
  A link back to the [site](https://ia-on-prem.damien.becherini.fr) is appreciated, not required, and helps readers find the latest verified version.
- **Code** (`scripts/`, `.github/`, `.agents/skills/`, `.claude/skills/`): [MIT](LICENSE-CODE).

Third-party content quoted or referenced (vendor documentation excerpts, logos, trademarks, model cards) remains subject to the respective owners' terms.

---

<div align="center">

Made by [Damien Becherini](https://damien.becherini.fr/) · Engine: [starlight-obsidian-engine](https://github.com/DamienBecherini/starlight-obsidian-engine)

</div>
