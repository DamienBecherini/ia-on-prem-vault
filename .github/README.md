<div align="center">

# ZTH: IA On-Premise

**Zero to Hero — architecturer et déployer des LLMs en local : souverains, privés, performants.**
**Zero to Hero — architect and deploy self-hosted LLMs: sovereign, private, high-performance.**

[![Built with starlight-obsidian-engine](https://img.shields.io/badge/built%20with-starlight--obsidian--engine-BC52EE?logo=astro&logoColor=white)](https://github.com/DamienBecherini/starlight-obsidian-engine)
[![Obsidian](https://img.shields.io/badge/Obsidian-vault-7C3AED?logo=obsidian&logoColor=white)](https://obsidian.md)
[![Lang](https://img.shields.io/badge/lang-FR%20%2F%20EN-0A7EA4)](#)
[![Digital garden](https://img.shields.io/badge/type-digital%20garden-2EA043)](#)

</div>

---

## 🇫🇷 Français

Ce dépôt est le **coffre Obsidian** (contenu) du projet *Zero to Hero : IA On-Premise* — un **jardin
numérique** qui explique comment dimensionner, déployer et comprendre les infrastructures matérielles et
logicielles pour faire tourner des modèles d'IA massifs **100 % en local**, privés et performants.

Le contenu est rédigé en Markdown dans Obsidian (wiki links `[[...]]`, templates, diagrammes Mermaid) et
**publié en site statique** par le moteur [`starlight-obsidian-engine`](https://github.com/DamienBecherini/starlight-obsidian-engine),
auquel ce coffre est rattaché via une junction. Ici vivent **uniquement les notes** — aucun code moteur.

### Au programme

- **Fondations** — la physique de l'IA : bande passante mémoire, mémoire unifiée vs RAM vs VRAM, KV cache, quantification.
- **Matériel** — APU & mémoire unifiée (Strix Halo, Mac), stations multi-GPU, réseau IA (RoCE, Thunderbolt).
- **Stack logicielle** — moteurs d'inférence (llama.cpp, Ollama, vLLM), clustering (Exo, Ray), RAG & agents.
- **Blueprints** — scénarios de déploiement prêts à l'emploi, du labo de dev au datacenter entreprise.

### Structure du coffre

```
site.config.json        manifeste consommé par le moteur (titre, locales, sidebar, social)
index.mdx               page d'accueil (hero)
00-index.md             sommaire « Zero to Hero »
01-fondations/          notes FR
en/                     versions anglaises
_templates/             templates Obsidian
```

### Ouvrir dans Obsidian

Ouvrir ce dossier comme coffre Obsidian. Pour le prévisualiser en site web, suivre le README du moteur
(`npm run link:vault` puis `npm run dev`).

### Publier en ligne

Les identifiants de déploiement (FTPS ou SFTP) se configurent dans le **`.env` de ce coffre**
(voir `.env.example`). Variables `DEPLOY_*` ; le protocole se choisit avec `DEPLOY_PROTOCOL`.

```bash
cp .env.example .env    # ENGINE_PATH + DEPLOY_*
npm run publish         # git + build + upload (FTPS/SFTP)
npm run deploy          # build + upload (sans git)
npm run upload          # upload seulement (dist/ déjà buildé)
```

Documentation complète :
[Publishing](https://github.com/DamienBecherini/starlight-obsidian-engine#publishing) (README moteur).

---

## 🇬🇧 English

This repository is the **Obsidian vault** (content) of *Zero to Hero: On-Premise AI* — a **digital garden**
explaining how to size, deploy and understand the hardware and software stacks needed to run massive AI
models **fully locally**, private and fast.

Notes are authored in Markdown in Obsidian (wiki links, templates, Mermaid diagrams) and **published as a
static site** by the [`starlight-obsidian-engine`](https://github.com/DamienBecherini/starlight-obsidian-engine),
to which this vault is attached via a junction. Only the **notes** live here — no engine code.

Topics covered: AI hardware physics (memory bandwidth, unified memory, VRAM), inference engines
(llama.cpp, Ollama, vLLM), clustering (Exo, Ray), RAG & agents, and ready-to-use deployment blueprints.

### Publish to the web

Deploy credentials (FTPS or SFTP) belong in **this vault's `.env`** (see `.env.example`).
Use the `DEPLOY_*` variables; pick the protocol with `DEPLOY_PROTOCOL`.

```bash
cp .env.example .env    # ENGINE_PATH + DEPLOY_*
npm run publish         # git + build + upload (FTPS/SFTP)
npm run deploy          # build + upload (no git)
npm run upload          # upload only (existing dist/)
```

Full docs: engine
[Publishing](https://github.com/DamienBecherini/starlight-obsidian-engine#publishing) section.

---

<div align="center">

Made by [Damien Becherini](https://damien.becherini.fr/) · Engine: [starlight-obsidian-engine](https://github.com/DamienBecherini/starlight-obsidian-engine)

</div>
