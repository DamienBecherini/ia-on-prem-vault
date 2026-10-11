# Vault Editorial Basics

- This repo is an Obsidian/Starlight content vault for IA on-premise documentation.
- **French-first generation:** new or substantially rewritten public notes are written in French at vault root paths; English under `en/` only on explicit translation tasks (see `language-policy.md`).
- Code and repo tooling stay in English.
- For generation or major rewrites, prefer the `vault-generate-content` skill.
- For targeted updates to stale or outdated content (specific claims, benchmarks, links), prefer the `vault-refresh-outdated-content` skill over a full rewrite.
- For EN translation of validated FR pages, prefer the `vault-translate-content` skill.
- For audits, source checks, or factual review, prefer the `vault-verify-content` skill.
- Lexicon structure is mandatory only for `00-lexique/` entries; chapter articles keep a flexible topic-driven structure.
- For chapter generation, track lexicon follow-up: existing terms to link, new entries to create, and linked entries to verify/update.
- On every substantive FR edit, set or update `last_modified: YYYY-MM-DD` in frontmatter (today's date). This feeds `npm run audit:i18n` for EN translation backlog.
- Never invent sources. Performance claims must be cited with relevant context or written as cautious order-of-magnitude statements.
- Use Obsidian wikilinks for internal references and footnotes for external sources.
- If the user explicitly asks not to use project skills or workflows, respect that request while keeping factuality and source constraints.

## Lisibilité : lecture à trois étages

Every public page must work for two readers who land on it straight from a search engine: (A) a non-technical SME manager and (B) a developer new to local AI. Do not re-explain everything on every page; layer it instead.

1. **« En bref » for reader A.** Every chapter article opens with a `> [!tip] En bref` callout of 3–4 short sentences with no jargon at all: no acronyms, no product codes, no units the reader cannot picture. Say what the topic is, why it matters to the reader, and which decision it informs. Use a number only if it is already sourced on the page.
2. **`prerequisites` for reader B.** Add the optional frontmatter field `prerequisites` (2–3 vault paths, see `docs/frontmatter-schema.md`) listing what to read first. The engine renders it as a « 📚 Pour bien lire cette page » box.
3. **Expert body, explained at first use.** The body stays expert, but every technical term or acronym is linked to the lexicon at its **first** occurrence (`[[00-lexique/slug|label]]`, shown as a tooltip by the engine) or explained in a few plain words right there (a short parenthesis or « c'est-à-dire »). Create a lexicon entry for a recurring term that has none; explain one-off terms inline.

Measure with the readability audit (`scripts/audit-readability.mjs` and `.agents/vault-maintenance/readability/rubric.md`) when available.
