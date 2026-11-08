---
title: "LiteLLM"
description: OpenAI-compatible gateway to route agents and applications to Ollama, vLLM, cloud providers, or internal models.
sidebar:
  order: 4
last_modified: "2026-11-08"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

LiteLLM is an open-source proxy/gateway (MIT-licensed core, `enterprise/` features under a commercial license) that exposes an OpenAI-compatible interface to 100+ providers in Q4 2026: Ollama, vLLM, OpenAI, Anthropic, Azure, Bedrock, Vertex AI, Hugging Face, and others[^1].

## 💡 Why this project interests us

For a custodian agent, LiteLLM serves as a **model abstraction layer**. The agent speaks OpenAI-compatible; the operator decides whether the request goes to local Ollama, vLLM, or a cloud provider.

This avoids rewriting the agent on every model change.

## ✅ Strengths

- Unified API for local and cloud models[^1].
- Documented Ollama/vLLM support[^1][^2].
- Central proxy with virtual keys, routing, costs, logs, and guardrails.
- Useful for gradual cloud → local migration.

## ⚠️ Limitations and risks

- Not a model: it routes to backends.
- Bad config = leak to cloud.
- Logging/observability can capture prompts/responses if enabled without care[^3].
- Adds a critical layer to secure: in 2026 LiteLLM suffered a series of exploited vulnerabilities, including three listed in CISA's KEV catalog (CVE-2026-42208, CVE-2026-42271, CVE-2026-59822, all fixed from 1.84.0 onwards) and a critical privilege escalation (GHSA-7hp6-4w63-5g45, CVSS 9.9, an `internal_user` becomes `proxy_admin` and then executes commands on the host; fixed in 1.100.4 / 1.101.3 / 1.102.2 / 1.103.1). As of Q4 2026, never deploy a version earlier than 1.84.0. Version 1.100.4 fixes the September escalation, but the critical advisory of 2026-10-27 only patches the 1.103 to 1.106 lines: target at least 1.103.10 / 1.104.8 / 1.105.6 / 1.106.5. This is imperative with an Enterprise license (GHSA-w4c7-34wj-hqm8, CVSS 10.0: an unauthenticated request makes the proxy read a local file, for example `/proc/self/environ`, and exposes `LITELLM_MASTER_KEY` and the providers' keys; open-source deployments without a license are not affected). In all cases, restrict the proxy's outbound network access to the providers' endpoints and load the master key from a secrets manager rather than from the process environment[^4][^5][^9].
- Version discipline: since 2026-06-29, only the four most recent stable minor lines receive patches (one minor per week, so roughly one month of coverage per line) — plan at least a monthly update; a frozen version is a vulnerable version[^6].
- Supply chain: in March 2026, two PyPI releases (1.82.7 and 1.82.8) published by an attacker stole the host machine's secrets; the official Docker image was not affected[^7]. Install from the pinned official image or with hash-pinned dependencies, and rotate every secret held by the proxy if a compromised version was installed.
- MCP surface: the proxy also embeds an MCP gateway; two of its vulnerabilities were exploited in 2026 (CVE-2026-42271, CVE-2026-59822). If the custodian agent does not use MCP through LiteLLM, do not expose these endpoints[^4].

## 🔒 Sovereignty and privacy

- **Data:** transit through the proxy; destination per backend.
- **Model:** local if local Ollama/vLLM backend; cloud if cloud provider.
- **Memory:** not application memory, except logs/observability.
- **Telemetry/logging:** configurable; disable message logging for sensitive data[^3].
- **100% offline mode:** yes with local backends.
- **Verdict:** ✅ sovereign if configured local-only; ⚠️ otherwise.

## 🔗 Possible integration in this vault

LiteLLM is the target layer between:

- OpenHands / Agent Canvas (or Aider, whose development has been frozen since May 2026, see its sheet);
- Ollama/vLLM;
- routing policies;
- local logs;
- optional cloud fallback.

## 📊 Project maturity

Very widely used as a gateway (over 60,000 GitHub stars as of Q4 2026[^1]), LiteLLM publishes one minor line per week (1.104.2 on 2026-10-08[^8]) and, since 2026-06-29, only patches the four most recent stable minor lines: each line receives roughly one month of fixes[^6]. Freezing a version is therefore not a viable strategy: plan at least a monthly update, follow the GitHub advisories feed, and version/audit configuration, secrets, logs, and routing rules.

## 🔗 See also

- [[00-lexique/litellm|LiteLLM]] · [[00-lexique/vllm|vLLM]] · [[00-lexique/ollama|Ollama]]
- [[06-mise-en-oeuvre/local-inference-security|🔐 Inference security]] · [[06-mise-en-oeuvre/monitoring-inference-stack|📊 Monitoring]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] — full agent orchestration
- [[04-blueprints/scenario-d-datacenter|Scenario D]]

## 📚 Sources

[^1]: LiteLLM GitHub README ("100+ LLM providers") and LICENSE (MIT, except `enterprise/` under `enterprise/LICENSE`), read on 2026-10-09. [https://github.com/BerriAI/litellm](https://github.com/BerriAI/litellm)
[^2]: LiteLLM Proxy docs — local proxy, Ollama, vLLM. [https://docs.litellm.ai/docs/proxy_server](https://docs.litellm.ai/docs/proxy_server)
[^3]: LiteLLM Docs, *Logging* — callbacks, OpenTelemetry, `turn_off_message_logging`. [https://docs.litellm.ai/docs/proxy/logging](https://docs.litellm.ai/docs/proxy/logging)
[^4]: CISA, *Known Exploited Vulnerabilities Catalog* (JSON feed; LiteLLM entries CVE-2026-42208 added 2026-05-08, CVE-2026-42271 on 2026-06-08, CVE-2026-59822 on 2026-09-02), catalog dated 2026-10-08. [https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json)
[^5]: BerriAI, *GHSA-7hp6-4w63-5g45* (LiteLLM advisory, `internal_user` → `proxy_admin` → command execution on the host, CVSS 9.9, versions 1.91.0 → < 1.100.4, fixed in 1.100.4 / 1.101.3 / 1.102.2 / 1.103.1), 2026-09-30. [https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45](https://github.com/BerriAI/litellm/security/advisories/GHSA-7hp6-4w63-5g45)
[^6]: LiteLLM, *Version Support Policy* (blog: from 2026-06-29, only the four most recent stable minor lines receive patches), 2026-06-20. [https://docs.litellm.ai/blog/version-support](https://docs.litellm.ai/blog/version-support)
[^7]: BerriAI, *Issue #24518* (PyPI releases 1.82.7 and 1.82.8 published outside CI by an attacker, host secret theft; proxy Docker image not affected), 2026-03-24. [https://github.com/BerriAI/litellm/issues/24518](https://github.com/BerriAI/litellm/issues/24518)
[^8]: BerriAI, *LiteLLM Releases* (v1.104.2 published on 2026-10-08, cadence of one minor line per week), accessed 2026-10-09. [https://github.com/BerriAI/litellm/releases](https://github.com/BerriAI/litellm/releases)
[^9]: BerriAI, *GHSA-w4c7-34wj-hqm8* (critical LiteLLM advisory, CVSS 10.0: unauthenticated file read on a proxy under an Enterprise license, exposing `LITELLM_MASTER_KEY` and the providers' keys; affected versions < 1.103.10 / < 1.104.8 / < 1.105.6 / < 1.106.5, fixed in 1.103.10 / 1.104.8 / 1.105.6 / 1.106.5; open source without a license not affected; recommendations: master key in a secrets manager, distinct `LITELLM_SALT_KEY`, outbound network access limited to the providers), 2026-10-27. [https://github.com/BerriAI/litellm/security/advisories/GHSA-w4c7-34wj-hqm8](https://github.com/BerriAI/litellm/security/advisories/GHSA-w4c7-34wj-hqm8)
