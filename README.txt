# IA On-Prem — Vault Obsidian

Coffre Obsidian pur : notes, templates et configuration du site.

## Structure

| Élément | Rôle |
|---------|------|
| `*.md` / `*.mdx` | Pages publiées par le moteur [starlight-obsidian-engine](../ia-on-prem-vault) |
| `site.config.json` | Titre, navigation, locales, liens sociaux |
| `_templates/` | Modèles Obsidian |
| `.obsidian/` | Config Obsidian (workspace ignoré par git) |

## Édition

Ouvrir **ce dossier** comme vault dans Obsidian.

## Build du site

Depuis le dépôt moteur sibling :

```bash
cd ../ia-on-prem-vault
cp .env.example .env
npm install
npm run dev
```

Le moteur charge ce vault via `VAULT_PATH=../ia-on-prem-vault-content` (ou le chemin par défaut).

## Migration finale (optionnelle)

Une fois le workspace Cursor fermé, vous pouvez renommer :

- `ia-on-prem-vault` (moteur) → `starlight-obsidian-engine`
- `ia-on-prem-vault-content` (ce dossier) → `ia-on-prem-vault`

Puis mettre à jour `VAULT_PATH=../ia-on-prem-vault` dans le `.env` du moteur.
