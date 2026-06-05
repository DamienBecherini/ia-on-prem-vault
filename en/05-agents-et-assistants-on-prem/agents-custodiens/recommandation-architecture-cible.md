---
title: "🏗️ Target architecture recommendation"
description: Realistic path from a Cursor CLI MVP to a sovereign custodian stack based on Aider, Ollama/vLLM, LiteLLM, and SearXNG.
sidebar:
  order: 6
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
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

Cursor CLI is very productive for testing the idea. Aider is closer to the sovereign target because it can call Ollama directly.

## Step 2 — Controlled runner

To automate:

- scheduled task (cron, systemd timer, self-hosted GitHub Actions);
- dated branch;
- logs under `.agents/vault-maintenance/runs/`;
- source report;
- notification without automatic merge.

## Step 3 — Sovereign target

Recommended stack:

| Layer | Recommended choice | Role |
| :-- | :-- | :-- |
| Code agent | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] | Modifies files and works with Git |
| Local model | Ollama or vLLM + specialized coder model | On-prem inference with sufficient reasoning |
| Gateway | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]] ([[00-lexique/litellm|lexicon]]) | OpenAI-compatible API, routing, logs |
| Search | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/searxng|SearXNG]] | Self-hosted web search |
| Advanced sandbox | [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] | Heavier Docker agent |
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
| Large refactor or long reasoning | 32B+ with large context, or frontier non-sovereign model in MVP | sovereignty vs quality trade-off |

Key point: the agent that **acts** on files needs more reasoning than the assistant that **retrieves** information. VRAM budget must be sized for the editing model, not only the chat model.

## Concrete recommendation for this vault

1. **Short term:** continue with Cursor/Aider under human validation.
2. **Medium term:** Aider + Ollama + coder 14B/32B model + SearXNG + maintenance scripts.
3. **Long term:** [[00-lexique/litellm|LiteLLM]] as gateway, vLLM if throughput is needed, OpenHands for complex sandboxed tasks.

> [!warning] Do not confuse
> A tool that runs on your machine is not automatically sovereign. The decisive criterion is: where do prompts, files, keys, and intermediate results go?

## See also

- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|Human-in-the-loop workflow]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]]
