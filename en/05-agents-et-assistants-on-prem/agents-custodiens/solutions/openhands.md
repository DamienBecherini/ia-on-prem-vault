---
title: "OpenHands"
description: Docker-based agentic platform for software development, powerful but heavier to operate than a simple CLI.
sidebar:
  order: 3
last_modified: "2026-06-04"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

OpenHands is a software development agent platform with CLI, local interface, SDK, and Docker sandbox. It targets workflows close to Devin/Jules: the agent explores, modifies, executes, and iterates in a controlled environment[^1][^2].

## 💡 Why this project interests us

OpenHands is relevant when the custodian agent must go beyond simple file editing: running tests, isolated environment, long tasks, web UI, sandbox, and more structured orchestration.

## ✅ Strengths

- Docker sandbox to isolate execution[^3].
- Local/self-hosted model support via LM Studio, Ollama, vLLM, or SGLang[^4].
- More complete architecture than a CLI.
- Can serve as a base for a more ambitious custodian agent.

## ⚠️ Limitations and risks

- Heavier setup: Docker, volumes, images, LLM configuration.
- Local models must be powerful for agentic tasks[^4].
- Larger attack surface than Aider.
- May be oversized for simple vault audits.

## 🔒 Sovereignty and privacy

- **Data:** local if instance and model are local.
- **Model:** local possible via Ollama/vLLM/LM Studio; cloud possible per provider.
- **Memory:** depends on session and Docker workspace.
- **Telemetry:** audit per deployment.
- **100% offline mode:** possible but requires preloaded images/models.
- **Verdict:** ⚠️ configurable — sovereign if self-host + local LLM, heavy to harden.

## 🔗 Possible integration in this vault

OpenHands becomes interesting if the agent must:

- run builds/tests;
- work in a reproducible sandbox;
- execute complex tools;
- strongly isolate the workspace.

For simple Markdown maintenance, Aider remains lighter.

## 📊 Project maturity

Very active project, large community, many components. High maturity, but also high operational complexity.

## 📚 Sources

[^1]: OpenHands GitHub README. [https://github.com/OpenHands/OpenHands](https://github.com/OpenHands/OpenHands)
[^2]: OpenHands Docs, *Local setup*. [https://docs.openhands.dev/openhands/usage/run-openhands/local-setup](https://docs.openhands.dev/openhands/usage/run-openhands/local-setup)
[^3]: OpenHands Docs, *Docker Sandbox*. [https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox](https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox)
[^4]: OpenHands Docs, *Local LLMs*. [https://docs.openhands.dev/openhands/usage/llms/local-llms](https://docs.openhands.dev/openhands/usage/llms/local-llms)
