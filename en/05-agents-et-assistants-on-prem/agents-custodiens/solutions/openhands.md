---
title: "OpenHands"
description: Software development agent platform (CLI, SDK, Docker sandbox, Agent Canvas), powerful but heavier to operate than a simple CLI.
sidebar:
  order: 3
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

OpenHands is a software development agent platform (MIT): CLI, Python SDK, Docker sandbox and, since June 2026, **Agent Canvas**, a self-hosted control center that launches sessions and scheduled or event-driven automations (Slack, GitHub, Linear) on local, Docker, VM, or Kubernetes backends. Agent Canvas drives the OpenHands agent or, via the Agent Client Protocol (ACP), third-party agents such as Claude Code, Codex, or Gemini CLI[^1][^5][^6]. The agent explores, modifies, executes, and iterates in a controlled environment[^2].

## 💡 Why this project interests us

OpenHands is relevant when the custodian agent must go beyond simple file editing: test execution, isolated environment, long tasks, web interface, sandbox, and more structured orchestration.

Since June 2026, it is also an orchestration layer: via ACP, the same Agent Canvas can start with a vendor agent (Claude Code, Codex) and then switch to the OpenHands agent connected to a local model without changing interface — an MVP → sovereign target path without a rewrite[^6].

## ✅ Strengths

- Docker sandbox to isolate execution[^3].
- Local/self-hosted model support via LM Studio (proprietary, freemium), Ollama, vLLM, or SGLang; in Q2 2026 the docs recommend Qwen3.6-35B-A3B with at least 24 GB of VRAM when quantized and a 32k-token context[^4][^8].
- More complete architecture than a CLI.
- Can serve as a base for a more ambitious custodian agent.

## ⚠️ Limitations and risks

- Heavier setup: Docker, volumes, images, LLM configuration.
- Local models must be powerful for agentic tasks[^4].
- Larger attack surface than Aider.
- Can be oversized for simple vault audits.

## 🔒 Sovereignty and privacy

- **Data:** local if instance and model are local.
- **Model:** local possible via Ollama/vLLM/LM Studio; cloud possible per provider.
- **Memory:** depends on session and Docker workspace.
- **Telemetry:** to audit per deployment; in Agent Canvas, select only local/Docker/internal VM backends, never "OpenHands Cloud"[^5].
- **100% offline mode:** possible but requires preloaded images/models.
- **Verdict:** ⚠️ configurable — sovereign if self-host + local LLM, heavy to harden.

## 🔗 Possible integration in this vault

OpenHands becomes interesting if the agent must:

- run builds/tests;
- work in a reproducible sandbox;
- execute complex tools;
- strongly isolate the workspace.

Since June 2026, Agent Canvas lets you define an automation (scheduled, or triggered by GitHub/Slack/Linear) that launches the agent on an internal Docker or VM backend, with a dedicated LLM profile pointing to Ollama or vLLM: this is the controlled runner of step 2 of the [[05-agents-et-assistants-on-prem/agents-custodiens/recommandation-architecture-cible|trajectory]], with no home-made script[^5].

For simple Markdown maintenance, Aider remains lighter, but its development has been frozen since May 2026; the OpenHands CLI (without Agent Canvas) is the closest maintained option[^7].

## 📊 Project maturity

Very active project (MIT, about 90,000 stars and several releases per week in Q4 2026), large community, many components; Agent Canvas is still labeled "beta". High maturity, but also high operational complexity[^1].

## 🔗 See also

- [[00-lexique/agent-custodian|Custodian agent]] · [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|HITL Workflow]]
- [[00-lexique/appel-outils|Tool calling]] · [[00-lexique/vllm|vLLM]] · [[00-lexique/litellm|LiteLLM]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]] · [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]]
- [[06-mise-en-oeuvre/local-inference-security|🔐 Inference security]] · [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]]

## 📚 Sources

[^1]: OpenHands GitHub README (repository presented as "Agent Canvas (beta)", MIT, v1.26.0 of 2026-10-08), accessed 2026-10-10. [https://github.com/OpenHands/OpenHands](https://github.com/OpenHands/OpenHands)
[^2]: OpenHands Docs, *Local setup*. [https://docs.openhands.dev/openhands/usage/run-openhands/local-setup](https://docs.openhands.dev/openhands/usage/run-openhands/local-setup)
[^3]: OpenHands Docs, *Docker Sandbox*. [https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox](https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox)
[^4]: OpenHands Docs, *Local LLMs* (LM Studio, Ollama, vLLM, SGLang; Qwen3.6-35B-A3B recommended, ≥ 24 GB of VRAM when quantized, 32k context), updated 2026-05-21. [https://docs.openhands.dev/openhands/usage/llms/local-llms](https://docs.openhands.dev/openhands/usage/llms/local-llms)
[^5]: OpenHands, *Introducing Agent Canvas* (scheduled and event-driven Slack/GitHub/Linear workflows, LLM profiles, local/Docker/VM/Kubernetes/OpenHands Cloud backends, MIT license), 2026-06-16. [https://www.openhands.dev/blog/introducing-agent-canvas](https://www.openhands.dev/blog/introducing-agent-canvas)
[^6]: OpenHands, *Use any coding agent in OpenHands with ACP* (Agent Client Protocol: Claude Code, Codex, Gemini CLI, or any compatible agent; `ACPAgent` in the SDK), 2026-06-18. [https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp](https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp)
[^7]: Aider-AI, *aider* (GitHub repository: last commit on 2026-05-22, latest release v0.86.0 of 2025-08-09), accessed 2026-10-10. [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)
[^8]: LM Studio, *Introducing LM Studio Bionic* (proprietary application, local models via the LM Studio runtime, paid "Secure Cloud" offering), 2026-07-16. [https://lmstudio.ai/blog/introducing-lm-studio-bionic](https://lmstudio.ai/blog/introducing-lm-studio-bionic)
