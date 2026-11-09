---
title: "🤖 vault-watch-agent"
description: "Overview of vault-watch-agent, the AI agent that proposes sourced corrections for this guide, waits for human review and prepares the pull request."
last_modified: "2026-11-09"
---

> [!tip] In short
> vault-watch-agent is the program that helps keep this guide accurate. It reads the list of what is new in the field, finds the passages that have become wrong and proposes corrections. A person reviews everything, and nothing is published without their approval.

## What it is for

The guide gives minimum versions, prices and security vulnerabilities to watch. This information changes constantly: a recommended version can become dangerous overnight. A [[projet/how-it-works|watch script]] spots the changes; the agent determines which ones make a page wrong and prepares the correction work.

## What it does, step by step

| Phase | What happens | Who works |
| :-- | :-- | :-- |
| Collection | Fetches the watch: the GitHub issue and its release notes | Program |
| Triage | Sorts each item: to correct, possibly to add, of no interest | AI |
| Location | Finds the French pages concerned and groups what belongs together | Program |
| Proposal | Drafts the corrections in parallel, with current text, new text and source | AI |
| Numbering | Checks that each quotation really exists in the page | Program |
| Cross-check | Re-reads each correction with the whole guide and the web: keep, revise, reject | AI |
| **Review** | **Pause: the author chooses the corrections to apply** | **Human** |
| Application | Applies the corrections on a separate branch | Program |
| Translation | Updates the corresponding English pages | AI |
| Checks | Runs the guide's audits and tests the external links | Program |
| **Publication** | **Pause: the author authorizes the pull request** | **Human** |

## The review screen

Each correction appears as a card: the current text, the proposed text, the severity and the source. Related corrections, such as a sentence and its footnote, are approved together.

![vault-watch-agent review screen: ticked corrections, with the current text in red, the proposed text in green and the source.](https://raw.githubusercontent.com/DamienBecherini/vault-watch-agent/main/docs/review.png)

## Its safeguards

- **The model proposes, the code decides.** The AI never writes to a file. A correction is refused if the text it quotes does not occur exactly once in the page.
- **Two human approvals.** One after the report, the other before anything leaves the machine.
- **Evidence rather than memory.** Proposals rely on release notes and on primary sources consulted on the web.
- **One source of rules.** The agent loads the guide's editorial rules on every run.

## How good it is, measured

The agent was replayed on two watches processed by hand before it existed, then its proposals were compared with the human corrections. No proposal that reached the review was wrong, but it missed many: on the busiest watch, it found 2 corrections out of 15. The substantive change of that watch was found; 9 of the 13 missed corrections only concerned a date. The [full evaluation](https://github.com/DamienBecherini/vault-watch-agent#evaluation-on-past-watches) is public.

## Its limits

- **It is written for this guide.** Another knowledge base would have to adapt its collection and its checks.
- **It corrects, it does not add.** New tools and models are listed as leads, with no page drafted.
- **It depends on a cloud service.** The agent uses Claude models through an API, [[projet/how-it-works|for public content only]].
- **It remains an assistant.** It never pushes directly to the main branch.

## For developers

The project is written in Python with [LangGraph](https://langchain-ai.github.io/langgraph/) for the orchestration and the Anthropic SDK for the model calls. The steps form a state graph, saved at every step in SQLite: a paused run can resume days later, from the web interface or the command line.

The French guide fits entirely in the model's context thanks to prompt caching. There is therefore no vector [[00-lexique/rag|RAG]]: at this size, reading everything costs less than building an index, and the model sees inconsistencies between pages.

**GitHub repository:** [DamienBecherini/vault-watch-agent](https://github.com/DamienBecherini/vault-watch-agent), under the MIT licence.
