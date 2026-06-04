---
title: "Aider"
description: Terminal-first, open-source, model-agnostic code agent capable of working directly with Ollama.
sidebar:
  order: 2
---

## 🔍 Quick overview

Aider is a command-line programming agent. It modifies local files, understands a repository via a repo map, uses Git, and can connect to many LLMs, including local models via Ollama[^1][^2].

> [!tip] Sovereignty verdict
> **✅ Strong sovereign candidate** if Aider is configured with local Ollama/vLLM, analytics disabled, and a sufficiently capable code model.

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

Aider is the best candidate for the first sovereign target:

- `aider --model ollama_chat/qwen2.5-coder:14b` for controlled trials;
- `aider --model ollama_chat/qwen2.5-coder:32b` or equivalent strong coder for regular maintenance;
- dedicated branch;
- vault plan/rules in context;
- final Markdown report.

> [!warning] Local sizing
> The custodian agent that **modifies** a repository needs a more robust model than a RAG assistant that answers a question. Hardware budget must be sized for a specialized code model, not a small conversational model.

## 📊 Project maturity

Mature, very active project specialized in code editing. Narrower than OpenHands, but much simpler to operate.

## 📚 Sources

[^1]: Aider GitHub README. [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)
[^2]: Aider Docs, *Ollama*. [https://aider.chat/docs/llms/ollama.html](https://aider.chat/docs/llms/ollama.html)
[^3]: Aider GitHub issue #3627 — clarifications on data/code and absence of Aider server. [https://github.com/Aider-AI/aider/issues/3627](https://github.com/Aider-AI/aider/issues/3627)
[^4]: Aider Docs, *Analytics*. [https://aider.chat/docs/more/analytics.html](https://aider.chat/docs/more/analytics.html)
