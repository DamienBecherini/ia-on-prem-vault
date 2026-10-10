---
title: "Aider"
description: Terminal-first, open-source, model-agnostic code agent capable of working directly with Ollama.
sidebar:
  order: 2
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

Aider is a command-line programming agent. It modifies local files, understands a repository via a repo map, uses Git, and can connect to many LLMs, including local models via Ollama[^1][^2].

> [!tip] Sovereignty verdict
> **✅ Sovereign, but frozen**: a strong candidate if Aider is configured with local Ollama/vLLM, analytics disabled, and a sufficiently capable code model — bearing in mind that the project has had no commit since May 2026 (see Maturity).

## 💡 Why this project interests us

Aider fits the minimal custodian agent well: terminal, Git, local files, configurable model, no heavy UI.

For a Markdown vault, it can reread pages, apply fixes, create commits on a branch, and leave validation to a human.

## ✅ Strengths

- Open-source, simple CLI.
- Works with cloud or local models.
- Documented Ollama support[^2].
- No Aider intermediary server: requests go to the configured provider[^3].
- Opt-in / disableable analytics, no code or prompts per docs[^4].

## ⚠️ Limitations and risks

- Quality depends heavily on the local model: sovereign does not mean competent.
- Weak local models can break edit format, miss precise replacements, or loop on a fix.
- A 7B/8B generalist is acceptable for simple suggestions but too fragile for a custodian agent that actually modifies files.
- For serious local work, aim at least at a **coder** 14B class model for small controlled fixes, and preferably 32B or more for multi-file audits, refactoring, or reliable complex Markdown editing.
- Ollama must be configured with a sufficient context window: its default context can be too small for Aider and cause responses grounded on truncated context[^2].
- If a cloud provider is used, code goes to that provider.
- Commands and allowed files must be controlled carefully.

## 🔒 Sovereignty and privacy

- **Data:** stays local except what is sent to the configured LLM.
- **Model:** local possible via Ollama.
- **Memory:** session context + local Git.
- **Telemetry:** analytics disableable; must not include code/prompts per docs.
- **100% offline mode:** yes with a pre-downloaded local model.
- **Verdict:** ✅ native sovereign if configured locally.

## 🔗 Possible integration in this vault

Aider remains the simplest candidate for a first sovereign trial, provided you accept a tool frozen since May 2026; for a durable target, prefer a maintained, model-agnostic agent such as [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] (CLI or Agent Canvas, MIT) connected to Ollama/vLLM[^6]:

- `aider --model ollama_chat/<recent coder model>`: for example a Qwen3.6-35B-A3B (MoE, ~24 GB of VRAM quantized, recommended by OpenHands for agentic use as of Q2 2026) or a dense 14B for controlled trials, 32B+ for regular maintenance; since Aider no longer knows the models released after May 2026, ignore its "model warnings" after manually checking the context window[^2][^6];
- dedicated branch;
- vault plan/rules in context;
- final Markdown report.

> [!warning] Local sizing
> The custodian agent that **modifies** a repository needs a more robust model than a RAG assistant that answers a question. Hardware budget must be sized for a specialized code model, not a small conversational model.

## 📊 Project maturity

Mature project (Apache-2.0, about 49,000 GitHub stars) specialized in code editing, but **effectively frozen as of Q4 2026**: no commit since 2026-05-22, last release v0.86.0 (2025-08-09) and last PyPI publication 0.86.2 (2026-02-12), with no announcement from the maintainers[^1][^5]. It remains narrower than OpenHands and much simpler to operate, but new models are no longer referenced and no security fix is to be expected: use it knowingly, with a replacement plan.

For a durable target, prefer a maintained, model-agnostic agent such as [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] (CLI, SDK or Agent Canvas, MIT license), whose documentation covers local models via Ollama, vLLM or SGLang[^6]. If Aider does not resume, the other maintained model-agnostic candidates as of Q4 2026 are, to be evaluated, Goose (Block, Apache-2.0) and Cline (Apache-2.0, CLI 3.x), both on weekly releases; their support for local models has not been verified in this vault[^7].

## 🔗 See also

- [[00-lexique/autonomous-agent|Autonomous agent]] · [[00-lexique/appel-outils|Tool calling]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] · [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/cursor-cli|Cursor CLI]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/workflow-human-in-the-loop|HITL Workflow]] · [[05-agents-et-assistants-on-prem/agents-custodiens/github-branches-pr-notifications|Branches & PR]]
- [[04-blueprints/scenario-a-dev-lab|Scenario A]]

## 📚 Sources

[^1]: Aider GitHub README. [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)
[^2]: Aider Docs, *Ollama*. [https://aider.chat/docs/llms/ollama.html](https://aider.chat/docs/llms/ollama.html)
[^3]: Aider GitHub issue #3627 — clarifications on data/code and absence of Aider server. [https://github.com/Aider-AI/aider/issues/3627](https://github.com/Aider-AI/aider/issues/3627)
[^4]: Aider Docs, *Analytics*. [https://aider.chat/docs/more/analytics.html](https://aider.chat/docs/more/analytics.html)
[^5]: PyPI, *aider-chat* (last publication 0.86.2 on 2026-02-12), accessed 2026-10-09. [https://pypi.org/project/aider-chat/](https://pypi.org/project/aider-chat/)
[^6]: OpenHands Docs, *Local LLMs* (LM Studio, Ollama, vLLM, SGLang), updated 2026-05-21. [https://docs.openhands.dev/openhands/usage/llms/local-llms](https://docs.openhands.dev/openhands/usage/llms/local-llms)
[^7]: Block, *Goose Releases* (v1.54.0 of 2026-10-08, Apache-2.0) and Cline, *Cline Releases* (releases of 2026-10-08, Apache-2.0), accessed 2026-10-09. [https://github.com/block/goose/releases](https://github.com/block/goose/releases) · [https://github.com/cline/cline/releases](https://github.com/cline/cline/releases)
