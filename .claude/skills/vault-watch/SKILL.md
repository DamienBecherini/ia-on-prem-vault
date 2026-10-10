---
name: vault-watch
description: Biweekly incremental refresh of the IA on-premise vault, corrections and additions. Turns the "Veille" GitHub issue (pre-triaged by `npm run watch:feeds`; an `urgent` issue in between for uncovered High / Critical advisories) into verified, dated events, maps them to vault pages and watchlist claims, re-checks the claims whose "Recheck by" date has passed, proposes focused edits and additions (paragraphs, lexicon entries, opportunity notes for new pages), and opens a PR only on request. Use when a `veille` issue is open ("traite la veille #N"), or when the user asks what changed recently. The full top-down run stays `vault-refresh-outdated-content`.
---

# vault-watch

This is the Claude Code entry point. The canonical skill is **`.agents/skills/vault-watch/SKILL.md`**: read it in full and follow it. Do not edit this pointer; edit the canonical file so every agent tool (Cursor, Claude Code, others) stays in sync.

Project rules that apply to every skill: `CLAUDE.md` and `.agents/rules/`.
