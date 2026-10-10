---
title: Excessive Agency
description: "OWASP Top 10 for LLM applications vulnerability: an AI agent has too many features, permissions or too much autonomy, allowing unintended real-world actions."
aliases:
  - LLM06
  - LLM03
tags:
  - lexique
  - security
niveau: intermediate
last_modified: "2026-10-10"
last_verified: "2026-06-06"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## Short definition

**LLM06:2025, which became LLM03:2026** in the 2026 edition of the OWASP Top 10 for LLM applications — moved up to 3rd place because real-world incidents involving tool-equipped agents are multiplying[^1]: an agent is granted more functionality, permissions, or autonomy than required, enabling harmful actions even in the absence of a deliberate attack.

## Detailed definition

OWASP identifies three exposure axes:

- **Excessive functionality** — the agent has access to more tools than needed (e.g. a mail plugin with both `read` and `send` when only reading is required).
- **Excessive permissions** — the agent operates with elevated rights (root, DB admin, full filesystem access) not justified by its task.
- **Excessive autonomy** — the agent makes high-impact decisions without [[00-lexique/human-in-the-loop|human validation (HITL)]].

Excessive Agency is dangerous even without an attacker: a hallucination or indirect prompt injection is enough to trigger a real action. For example, a vulnerable custodian agent can execute a destructive command read from a malicious GitHub issue.

## Why it matters for on-premise AI

On-premise agents often have direct access to critical resources: filesystem, databases, internal APIs, Git repositories. Misconfigured permissions can turn an assistant agent into an internal attack vector without any external network exposure.

## Common pitfalls

- Giving an agent a general shell tool (`subprocess`, `bash`) when a single targeted command would suffice.
- Not applying least privilege to mounted Docker volumes.
- Allowing the agent to push directly to `main` without human review.
- Forgetting that an agent's `fetch` tools inherit the host machine's network permissions.

## See also

- [[06-mise-en-oeuvre/local-inference-security|🔒 Local inference security]] — §5 (LLM06:2025 Excessive Agency, LLM03:2026) and §6 (agent isolation)
- [[00-lexique/human-in-the-loop|Human-in-the-loop]] — human validation of critical actions
- [[00-lexique/autonomous-agent|Autonomous agent]] — architecture and risks
- [[00-lexique/ai-glossary|📖 AI Glossary]]

[^1]: OWASP GenAI Security Project, *OWASP GenAI LLM Top 10 — 2026 Edition* (published 2026-08-03) and announcement of 2026-09-01 ("Excessive Agency, now number three"). [https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) · [https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members/](https://genai.owasp.org/2026/09/01/owasp-genai-security-project-unveils-2026-top-10-for-llm-applications-new-agent-control-standard-and-sponsors-as-community-tops-30000-members/)
