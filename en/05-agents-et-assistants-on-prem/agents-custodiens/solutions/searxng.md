---
title: "SearXNG"
description: Self-hosted, privacy-first meta search engine, useful for giving a custodian agent controlled web access.
sidebar:
  order: 5
last_modified: "2026-10-10"
last_verified: "2026-10-10"
verified_by: "Fable 5.1"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 🔍 Quick overview

SearXNG is a free (AGPL-3.0) meta search engine that aggregates results from many engines without profiling the user. It can be self-hosted and exposes a search API usable by an agent[^1][^2].

## 💡 Why this project interests us

A custodian agent needs to verify sources. SearXNG gives it a controlled web search tool without depending directly on Google/Bing/Tavily.

## ✅ Strengths

- Self-hostable.
- No user profiling per documentation[^1].
- `/search` API with JSON format if `json` is listed in `search: formats:` of `settings.yml`; otherwise the instance returns 403[^3].
- Can be coupled with Tor/proxy as needed.
- No external API token required to start.

## ⚠️ Limitations and risks

- Queries still go to engines queried from the instance.
- Public instances may disable JSON or impose limits.
- A misconfigured instance can be abused by bots; enable the limiter (Valkey database required)[^5].
- Result quality depends on enabled engines.

## 🔒 Sovereignty and privacy

- **Data:** queries processed by your instance; remote engines see the instance.
- **Model:** not applicable.
- **Memory:** no application memory by default.
- **Telemetry:** no user profiling announced.
- **100% offline mode:** no, it is web access.
- **Verdict:** ✅ for privacy-preserving web search, not for strict air-gap.

## 🔗 Possible integration in this vault

SearXNG can become the custodian agent's `web_search` tool:

```text
GET /search?q=site:docs.vllm.ai+parallelism&format=json
```

The agent must then cite selected URLs in its report.

## 📊 Project maturity

Mature, active project (AGPL-3.0, about 38,000 GitHub stars in Q4 2026), widely used in self-hosting. SearXNG is a rolling release with no version number: every commit on `master` is a release, and the docs call for regular code updates[^4]. Protect with the built-in limiter (which **requires a Valkey database**), secret key, reverse proxy, and access policy[^5]; for container deployment, follow the official docs, the former `searxng-docker` repository having been archived since 2026-03-28[^6].

## 🔗 See also

- [[00-lexique/rag|RAG]] · [[03-stack-logicielle/rag-and-agents|🧩 RAG & Agents]] — web search for agents
- [[06-mise-en-oeuvre/local-inference-security|🔐 Inference security]] · [[00-lexique/prompt-injection|Prompt injection]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/openhands|OpenHands]] · [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/litellm|LiteLLM]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty]]

## 📚 Sources

[^1]: SearXNG Documentation — "Search without being tracked". [https://docs.searxng.org/](https://docs.searxng.org/)
[^2]: SearXNG GitHub README. [https://github.com/searxng/searxng](https://github.com/searxng/searxng)
[^3]: SearXNG Docs, *Search API* (`json` format to enable in `search: formats:`, otherwise 403), build 2026.10.9. [https://docs.searxng.org/dev/search_api.html](https://docs.searxng.org/dev/search_api.html)
[^4]: SearXNG Docs, *How to update* ("SearXNG is a rolling release; each commit to the master branch is a release", regular updates required), build 2026.10.9. [https://docs.searxng.org/admin/update-searxng.html](https://docs.searxng.org/admin/update-searxng.html)
[^5]: SearXNG Docs, *Limiter* ("The limiter requires a Valkey database"), build 2026.10.9. [https://docs.searxng.org/admin/searx.limiter.html](https://docs.searxng.org/admin/searx.limiter.html)
[^6]: searxng, *searxng-docker* (repository archived on 2026-03-28, "superseded" in favor of the official documentation), accessed 2026-10-10. [https://github.com/searxng/searxng-docker](https://github.com/searxng/searxng-docker)
