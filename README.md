<div align="center">

# ZTH: On-Premise AI

**Zero to Hero — architect and deploy self-hosted LLMs: sovereign, private, high-performance.**

[![Built with starlight-obsidian-engine](https://img.shields.io/badge/built%20with-starlight--obsidian--engine-BC52EE?logo=astro&logoColor=white)](https://github.com/DamienBecherini/starlight-obsidian-engine)
[![Obsidian](https://img.shields.io/badge/Obsidian-vault-7C3AED?logo=obsidian&logoColor=white)](https://obsidian.md)
[![Lang](https://img.shields.io/badge/lang-FR%20%2F%20EN-0A7EA4)](#content)
[![Digital garden](https://img.shields.io/badge/type-digital%20garden-2EA043)](#)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

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
scripts/                vault-local maintenance scripts (audit, backfill, delegate)
_templates/             Obsidian templates (_Terme Lexique.md, _Nouveau Chapitre.md)
_private/               confidential notes (gitignored, never published)
docs/plans/             agent implementation plans (excluded from publish; see README there)
.agents/                agent skills and maintenance (excluded from publish)
.cursor/rules/          Cursor AI rules (tracked; rest of .cursor/ is gitignored)
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

Run `npm run audit:links` in the engine to list unresolved wiki/MD links (lexicon backlog and [link audit allowlist](.agents/vault-maintenance/link-audit-allowlist.md)).

Agent implementation plans live in [docs/plans/README.md](docs/plans/README.md) (English, not published).

To make the site **private** (Apache Basic Auth), fill in `AUTH_*` in `.env`, then:

```bash
npm run auth:install    # generate + upload .htaccess + .htpasswd
npm run auth:remove     # make the site public again
```

Full docs: engine [Publishing](https://github.com/DamienBecherini/starlight-obsidian-engine#publishing) section.

## License

Content in this vault is released under the
[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) license.  
You are free to share and adapt the material for any purpose, including commercially, provided you give
appropriate credit to **Damien Becherini** and link back to the original source.

Third-party content (vendor documentation excerpts, logos, trademarks) remains subject to the respective owners' terms.

---

<div align="center">

Made by [Damien Becherini](https://damien.becherini.fr/) · Engine: [starlight-obsidian-engine](https://github.com/DamienBecherini/starlight-obsidian-engine)

</div>
