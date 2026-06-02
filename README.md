<div align="center">

# ZTH: On-Premise AI

**Zero to Hero — architect and deploy self-hosted LLMs: sovereign, private, high-performance.**

[![Built with starlight-obsidian-engine](https://img.shields.io/badge/built%20with-starlight--obsidian--engine-BC52EE?logo=astro&logoColor=white)](https://github.com/DamienBecherini/starlight-obsidian-engine)
[![Obsidian](https://img.shields.io/badge/Obsidian-vault-7C3AED?logo=obsidian&logoColor=white)](https://obsidian.md)
[![Lang](https://img.shields.io/badge/lang-FR%20%2F%20EN-0A7EA4)](#content)
[![Digital garden](https://img.shields.io/badge/type-digital%20garden-2EA043)](#)

</div>

---

This repository is the **Obsidian vault** (content) of *Zero to Hero: On-Premise AI* — a **digital garden**
that explains how to size, deploy, and understand the hardware and software stacks needed to run massive AI
models **fully locally**, private and fast.

Notes are authored in Markdown in Obsidian (wiki links `[[...]]`, templates, Mermaid diagrams) and
**published as a static site** by the [`starlight-obsidian-engine`](https://github.com/DamienBecherini/starlight-obsidian-engine),
to which this vault is attached via a junction. Only the **notes** live here — no engine code.

## Content

- **Foundations** — AI physics: memory bandwidth, unified memory vs RAM vs VRAM, KV cache, quantization.
- **Hardware** — APUs & unified memory (Strix Halo, Mac), multi-GPU workstations, AI networking (RoCE, Thunderbolt).
- **Software stack** — inference engines (llama.cpp, Ollama, vLLM), clustering (Exo, Ray), RAG & agents.
- **Blueprints** — ready-to-use deployment scenarios, from dev lab to enterprise datacenter.

Site content is **French and English** (`en/` locale folder). This README is **English only** (repository documentation).

## Vault layout

```
site.config.json        site manifest for the engine (title, locales, sidebar, social, lexicon)
index.mdx               home page (hero)
00-index.md             “Zero to Hero” table of contents
00-lexique/             AI glossary (term pages + hub + generated index)
01-fondations/          French notes
en/                     English notes
_templates/             Obsidian templates (e.g. _Terme Lexique.md)
_private/               confidential notes (gitignored, never published)
```

### Lexicon (this vault)

- **Hub** : `00-lexique/glossaire-ia.md` (curated overview).
- **Generated index** : `00-lexique/index-lexique.md` (alphabetical table; regen at build when `lexicon.enabled` in `site.config.json`).
- **New term** : use `_templates/_Terme Lexique.md`, tag `lexique` in frontmatter.
- **Regenerate index manually** (from the engine repo): `npm run lexicon:index` with `VAULT_PATH` pointing here.
- **Commit policy** : commit `index-lexique.md` with the vault when you add or change lexicon entries.

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
npm run deploy          # build + incremental upload (no git)
npm run upload          # incremental upload only (existing dist/)
npm run upload:full     # full remote scan + upload all + mirror
```

Incremental deploy uses `.deploy-manifest.json` (gitignored in this vault) plus a **remote copy** at
`{DEPLOY_REMOTE_PATH}/.deploy-manifest.json`. The engine merges both before comparing `dist/` hashes, so
CI and multi-machine deploys stay in sync; only changed files are uploaded after each build.

Run `npm run audit:links` in the engine to list unresolved wiki/MD links (lexicon backlog maintenance).

Full deploy: `npm run upload:full -- --yes` or `npm run upload -- --full --yes`. Do not use `npm run upload --full` — npm consumes `--full` and never passes it to the script.

To make the site **private** (Apache Basic Auth), fill in `AUTH_*` in `.env`, then:

```bash
npm run auth:install    # generate + upload .htaccess + .htpasswd
npm run auth:remove     # make the site public again
```

Full docs: engine [Publishing](https://github.com/DamienBecherini/starlight-obsidian-engine#publishing) section.

---

<div align="center">

Made by [Damien Becherini](https://damien.becherini.fr/) · Engine: [starlight-obsidian-engine](https://github.com/DamienBecherini/starlight-obsidian-engine)

</div>
