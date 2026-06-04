---
title: "SearXNG"
description: Self-hosted, privacy-first meta-search engine, useful for giving a custodian agent controlled web access.
sidebar:
  order: 5
---

## 🔍 Quick overview

SearXNG is a free meta-search engine that aggregates results from many engines without profiling the user. It can be self-hosted and exposes a search API usable by an agent[^1][^2].

## 💡 Why this project interests us

A custodian agent needs to verify sources. SearXNG provides a controlled web search tool without direct dependence on Google/Bing/Tavily.

## ✅ Strengths

- Self-hostable.
- No user profiling per documentation[^1].
- `/search` API with JSON format if enabled in `settings.yml`[^3].
- Can be coupled with Tor/proxy as needed.
- No external API token required to start.

## ⚠️ Limitations and risks

- Queries still go to engines queried from the instance.
- Public instances may disable JSON or impose limits.
- A misconfigured instance can be abused by bots.
- Result quality depends on enabled engines.

## 🔒 Sovereignty and privacy

- **Data:** queries handled by your instance; remote engines see the instance.
- **Model:** not applicable.
- **Memory:** no application memory by default.
- **Telemetry:** no user profiling announced.
- **100% offline mode:** no, this is web access.
- **Verdict:** ✅ for privacy-preserving web search, not for strict air-gap.

## 🔗 Possible integration in this vault

SearXNG can become the custodian agent's `web_search` tool:

```text
GET /search?q=site:docs.vllm.ai+parallelism&format=json
```

The agent must then cite selected URLs in its report.

## 📊 Project maturity

Mature, active project, widely used in self-hosting. Protect with rate limits, secret key, reverse proxy, and access policy.

## 📚 Sources

[^1]: SearXNG Documentation — "Search without being tracked". [https://docs.searxng.org/](https://docs.searxng.org/)
[^2]: SearXNG GitHub README. [https://github.com/searxng/searxng](https://github.com/searxng/searxng)
[^3]: SearXNG Docs, *Search API*. [https://docs.searxng.org/dev/search_api](https://docs.searxng.org/dev/search_api)
