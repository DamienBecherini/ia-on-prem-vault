---
title: "🏗️ Target architecture recommendation"
description: Realistic path from a Cursor CLI MVP to a sovereign custodian stack based on OpenHands or Aider, Ollama/vLLM, LiteLLM, and SearXNG.
sidebar:
  order: 6
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

The right architecture is not the purest on day one. It is the one that lets you validate the workflow without lying about sovereignty.

## Step 1 — Practical MVP

To learn fast:

- Cursor CLI or Aider;
- manual run;
- Markdown report;
- dedicated Git branch;
- human validation.

Cursor CLI (owned by SpaceX since August 2026[^7]) is very productive for testing the idea. Aider is closer to the sovereign target because it can call Ollama directly, but its development has been frozen since May 2026[^1].

## Step 2 — Controlled runner

To automate:

- scheduled task (cron, systemd timer, self-hosted GitHub Actions, or Agent Canvas automation on an internal backend[^2]);
- dated branch;
- run logs via `vault-log-run` under `.agents/vault-maintenance/runs/`;
- source report;
- notification without automatic merge.

## Step 3 — Sovereign target

Recommended stack:

| Layer | Recommended choice | Role |
| :-- | :-- | :-- |
| Code agent | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] (CLI/SDK) — or [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]], frozen since May 2026, for experiments[^1] | Modifies files and works with Git |
| Local model | Ollama or vLLM + specialized coder model | On-prem inference with sufficient reasoning |
| Gateway | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]] ([[00-lexique/litellm|lexicon]]) — **monthly update mandatory** (vulnerabilities exploited in 2026, one month of support per minor line)[^4][^5] | OpenAI-compatible API, routing, logs |
| Search | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng|SearXNG]] | Self-hosted web search |
| Runner and sandbox | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] / Agent Canvas[^2][^3] | Docker agent, scheduled automations, orchestration of third-party agents via ACP |
| Fast MVP | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]] | Initial productivity |

> [!warning] Common trap
> "Aider + Ollama" is not enough for a good sovereign custodian agent. Aider is demanding: it works better with strong code models, often much heavier than a conversational RAG model. A 7B/8B generalist can answer a question correctly but remain too weak to edit a repository without breaking Markdown, missing replacements, or proposing incoherent diffs.

## Minimum sizing for local Aider

For a realistic sovereign target:

| Use | Recommended local model | Hardware reading |
| :-- | :-- | :-- |
| Simple suggestions, small files | Specialized coder 7B/8B | useful to learn, not reliable as an autonomous agent |
| Controlled fixes on Markdown vault | Coder 14B | practical floor, with strict human validation |
| Regular maintenance, multi-file audit | Coder 32B or higher | recommended target if the agent must produce usable diffs |
| Agentic work with long context, 24 GB VRAM | Coder MoE such as Qwen3.6-35B-A3B (3B active) | recommended by OpenHands in Q2 2026; context ≥ 32k tokens[^6] |
| Large refactor or long reasoning | 32B+ with large context, or frontier non-sovereign model in MVP | sovereignty vs quality trade-off |

Key point: the agent that **acts** on files needs more reasoning than the assistant that **retrieves** information. VRAM budget must be sized for the editing model, not only the chat model.

## Concrete recommendation for this vault

1. **Short term:** continue with Cursor/Aider under human validation.
2. **Medium term:** OpenHands (CLI, or Agent Canvas with scheduled automations and a local LLM profile) or Aider as long as it works, + Ollama + recent coder model (dense 14B/32B, or an MoE such as Qwen3.6-35B-A3B, recommended by OpenHands in Q2 2026) + SearXNG + maintenance scripts[^2][^6].
3. **Long term:** [[00-lexique/litellm|LiteLLM]] as gateway (maintained minor line, patched within the month)[^5], vLLM if throughput is needed, OpenHands/Agent Canvas for automations and complex sandboxed tasks[^2][^3].

> [!warning] Do not confuse
> A tool that runs on your machine is not automatically sovereign. The decisive criterion is: where do prompts, files, keys, and intermediate results go?

## See also

- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Human-in-the-loop workflow]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]]

## 📚 Sources and References

[^1]: Aider-AI, *aider* (GitHub repository: last commit on 2026-05-22, latest release v0.86.0 of 2025-08-09), accessed 2026-10-10. [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)
[^2]: OpenHands, *Introducing Agent Canvas* (self-hosted control center, scheduled or event-driven automations, LLM profiles, local/Docker/VM/Kubernetes backends, MIT license), 2026-06-16. [https://www.openhands.dev/blog/introducing-agent-canvas](https://www.openhands.dev/blog/introducing-agent-canvas)
[^3]: OpenHands, *Use any coding agent in OpenHands with ACP* (Agent Client Protocol: Claude Code, Codex, Gemini CLI; `ACPAgent` in the SDK), 2026-06-18. [https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp](https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp)
[^4]: BerriAI, *GHSA-7hp6-4w63-5g45* (`internal_user` → `proxy_admin` → host execution escalation, CVSS 9.9, fixed in 1.100.4 / 1.101.3 / 1.102.2 / 1.103.1), 2026-09-30; CISA, *Known Exploited Vulnerabilities Catalog* (CVE-2026-42208, CVE-2026-42271, CVE-2026-59822), catalog dated 2026-10-08. [https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45](https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45) · [https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json)
[^5]: LiteLLM, *Version Support Policy* (since 2026-06-29, only the four most recent stable minor lines receive fixes), 2026-06-20. [https://docs.litellm.ai/blog/version-support](https://docs.litellm.ai/blog/version-support)
[^6]: OpenHands Docs, *Local LLMs* (Ollama, vLLM, SGLang, LM Studio; Qwen3.6-35B-A3B recommended, ≥ 24 GB of VRAM when quantized, 32k context), updated 2026-05-21. [https://docs.openhands.dev/openhands/usage/llms/local-llms](https://docs.openhands.dev/openhands/usage/llms/local-llms)
[^7]: Cursor, *Cursor is now a part of SpaceX*, 2026-08-14. [https://cursor.com/blog/joining-spacex](https://cursor.com/blog/joining-spacex)
