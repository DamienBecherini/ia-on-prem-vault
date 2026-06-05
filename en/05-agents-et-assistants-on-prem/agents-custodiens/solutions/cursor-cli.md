---
title: "Cursor CLI"
description: Cursor agent terminal interface, very effective for prototyping a custodian agent, but not sovereign in the strict on-prem sense.
sidebar:
  order: 1
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

Cursor CLI lets you use the Cursor agent from the terminal, interactively or in headless mode (`--print`) for scripts and CI. It can read a repository, modify files, use rules, resume sessions, and produce text/JSON output.

## 💡 Why this project interests us

For this vault, Cursor CLI is an **excellent MVP**: it quickly validates the "audit → modification → report → human validation" workflow without building the full infrastructure immediately.

## ✅ Strengths

- Very productive on an existing repo.
- Headless mode suited to scripts.
- Compatible with rules, `AGENTS.md`, MCP, search, and shell per configuration.
- Good tool for generating a branch or maintenance report.

## ⚠️ Limitations and risks

- Requires access to Cursor services.
- Prompts/code may transit to configured LLMs.
- BYOK does not mean local execution: the final prompt still passes through Cursor per documentation.
- No documented support for 100% local on-prem inference.

## 🔒 Sovereignty and privacy

- **Data:** context/code sent per Cursor model and settings.
- **Model:** routing via Cursor/providers; strict local not supported in consulted docs.
- **Memory:** depends on Cursor and the session.
- **Telemetry:** depends on Cursor/Privacy Mode.
- **100% offline mode:** no.
- **Verdict:** ❌ strict on-prem incompatible, but useful as MVP.

See the grid: [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]].

## 🔗 Possible integration in this vault

Cursor CLI can trigger:

- a link audit;
- a lexicon update;
- a source report;
- a manual or semi-automated PR.

This vault's `.agents/` folder is an example of structuring compatible with this approach.

## 📊 Project maturity

Product integrated with Cursor, very practical for prototyping and personal use. For an organization under strict sovereignty, it should remain a development tool, not the final target.

## 📚 Sources

- Cursor Docs, *CLI Overview*. [https://cursor.com/docs/cli/overview.md](https://cursor.com/docs/cli/overview.md)
- Cursor Docs, *Headless mode*. [https://cursor.com/docs/cli/headless.md](https://cursor.com/docs/cli/headless.md)
- Cursor Docs, *Enterprise deployment patterns*. [https://cursor.com/docs/enterprise/deployment-patterns.md](https://cursor.com/docs/enterprise/deployment-patterns.md)
- Cursor Help, *API keys / BYOK*. [https://cursor.com/help/models-and-usage/api-keys.md](https://cursor.com/help/models-and-usage/api-keys.md)
