---
title: "🔒 Sovereignty & Privacy"
description: >
  6-criterion evaluation grid to audit any local AI tool, concrete verification protocol,
  GDPR/AI Act regulatory context, and practical checklist.
sidebar:
  order: 2
last_modified: "2026-06-04"
---

Before choosing a personal assistant or custodian agent, one question deserves an honest answer:

> [!warning] Audit question
> Does this software actually run the model on my machine, or does it send my data somewhere without me noticing?

The answer is not always on the marketing page. It is in the code, the README, and network traffic.

---

## 🧪 The evaluation grid: 6 criteria

The same evaluation protocol is applied to every tool presented in this section.

### Criterion 1 — Data location

> *Where do your files, conversations, and indexed documents end up?*

| Level | Description |
| :-- | :-- |
| ✅ Strict local | Everything stays on your machine. No file leaves the system. |
| ⚠️ Configurable | Local by default, but cloud sync possible if explicitly enabled. |
| ❌ Cloud by default | Data is sent to the vendor's servers even without configuration. |

**How to verify:** look in `.env.example` for variables `SYNC_URL`, `CLOUD_STORAGE`, `UPLOAD_ENDPOINT`. A `grep -r "fetch\|axios\|upload" src/` reveals outbound network calls.

---

### Criterion 2 — Model routing

> *Does inference run on your GPU/CPU, or via a cloud API?*

| Level | Description |
| :-- | :-- |
| ✅ Strict local | Ollama, llama.cpp, vLLM — the LLM runs on your machine. |
| ⚠️ Configurable | Supports Ollama but also offers OpenAI by default at install time. |
| ❌ Cloud by default | The application uses OpenAI, Anthropic, or another API without an obvious local alternative. |

**How to verify:** check the default configuration file. Is `OPENAI_API_KEY` among the *recommended* variables in the install tutorial? If yes, the cloud path is the path of least resistance.

---

### Criterion 3 — Persistent memory

> *Does the tool keep context between sessions? If so, where is it stored?*

| Level | Description |
| :-- | :-- |
| ✅ Strict local | Local SQLite, Markdown files on disk, local vector database (Chroma, self-hosted Qdrant). |
| ⚠️ Configurable | Remote database possible but not required. |
| ❌ Cloud by default | History and embeddings are stored in the vendor's cloud service. |

---

### Criterion 4 — Telemetry

> *Does the software send metrics, logs, or prompt traces to its developers?*

| Level | Description |
| :-- | :-- |
| ✅ Absent | No telemetry confirmed in source code, or explicitly disabled with `false` by default. |
| ⚠️ Opt-out | Telemetry active by default, disableable in configuration. |
| ❌ Not disableable | Built-in telemetry with no documented disable option. |

**How to verify:** search for `posthog`, `segment`, `mixpanel`, `sentry`, `amplitude` in `package.json` or `requirements.txt`. These libraries are classic telemetry vectors in open-source projects.

---

### Criterion 5 — Offline mode

> *Does the tool work with no Internet connection after installation?*

| Level | Description |
| :-- | :-- |
| ✅ Yes | Zero network calls in normal operation once models are downloaded. |
| ⚠️ Partial | Works offline for essentials, but some features (updates, web search) require Internet. |
| ❌ No | An Internet connection is required even for basic conversations. |

---

### Criterion 6 — Sovereignty verdict

Summary of the previous 5 criteria:

| Verdict | Meaning |
| :-- | :-- |
| ✅ Native sovereign | All 5 criteria are at ✅ level without special configuration. |
| ⚠️ Configurable | Can be made sovereign by changing configuration, but that is not default behavior. A non-technical user will use the tool in cloud mode without knowing it. |
| ❌ Strict on-prem incompatible | Cannot be made sovereign. Incompatible with GDPR, HDS, or professional secrecy constraints. |

---

## The "local UI, cloud brain" trap

> [!warning] Local UI, cloud brain
> This is the most dangerous — and most common — pattern.
>
> The interface is installed on your machine. The README says "privacy-first". And yet every conversation is sent to `api.openai.com` (or `api.anthropic.com`, or the vendor's servers) because the model that replies is not local.

**Typical examples:**
- An Electron app that "supports" Ollama but whose default config points to `gpt-4o`.
- An assistant that stores your files locally but sends your prompts to a remote model for embedding.
- An agent that runs on your machine but uses the vendor's web search service for every query.

**The 60-second test:** launch the app normally and monitor network traffic with a proxy (Proxyman, Charles, or simply `sudo tcpdump -i any host api.openai.com`). If you see requests to cloud services during a "local" conversation, you have your answer.

---

## ⚖️ Regulatory context

### GDPR (General Data Protection Regulation)

GDPR requires that personal data of EU residents be processed with explicit consent and protected. Sending conversations containing personal data to a cloud service outside the EU (Article 46) without appropriate safeguards is a potential violation — even if the vendor acts in good faith.

On-premise AI is one of the few architectures that allows processing personal data in an LLM **without exporting it outside the organization's control perimeter**.

### AI Act (EU AI Regulation, applicable from 2025–2026)

The AI Act distinguishes limited-risk systems (general assistants) from high-risk systems (used in healthcare, justice, education, HR, etc.). For high-risk use, traceability, auditability, and human control are mandatory — requirements that are hard to meet with a "black box" cloud model.

### Sector-specific constraints

| Sector | Constraint | Implication |
| :-- | :-- | :-- |
| Healthcare | HDS (Health Data Hosting) | The host must be HDS-certified. Non-certified clouds are excluded. |
| Legal | Professional secrecy | Attorney–client exchanges cannot transit through third parties. |
| Defense / Government | Defense secrecy, IGI 1300 | Isolated networks mandatory for certain classification levels. |
| Finance | PSD2, NIS2 | Data localization and auditability requirements for critical systems. |

---

## ✅ Practical checklist: audit a new tool in 15 minutes

Before integrating a tool into your on-prem stack:

- [ ] **README:** is "local" accompanied by a local model (Ollama, llama.cpp) or an API key?
- [ ] **`.env.example`:** which variables are pre-filled? `OPENAI_API_KEY=""` present = cloud path facilitated.
- [ ] **`package.json` / `requirements.txt`:** presence of `posthog`, `segment`, `sentry`, `openai`, `anthropic`?
- [ ] **Network traffic (5 min):** tcpdump or proxy during a normal conversation — outbound calls?
- [ ] **Latest release:** is the project maintained? A version 18+ months old is a security risk.
- [ ] **GitHub issues:** search "privacy", "telemetry", "cloud" in closed issues — problems already reported and resolved (or ignored) are revealing.
- [ ] **Offline mode:** disconnect Internet and test. Everything stops = undocumented cloud dependency.

---

## 🔗 See also

- [[05-agents-et-assistants-on-prem/fondations-communes/possible-architectures|🏗️ Possible Architectures]] — taxonomy and pattern comparison
- [[05-agents-et-assistants-on-prem/assistants-personnels/index|🧑‍💼 Personal Assistants]] — solution sheets with sovereignty verdict
- [[05-agents-et-assistants-on-prem/agents-custodiens/index|🤖 Custodian Agents]] — solution sheets with sovereignty verdict
- [[00-lexique/on-premise|On-Premise (AI)]] — definition and motivations
- [[00-lexique/rag|RAG]] — common memory architecture in local assistants
