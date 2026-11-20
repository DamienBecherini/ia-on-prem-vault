---
title: "🤖 vault-watch-agent"
description: "Overview of vault-watch-agent, the AI agent that proposes sourced corrections for this guide, waits for human review and prepares the pull request."
last_modified: "2026-11-20"
---

> [!tip] In brief
> vault-watch-agent is the program that helps keep this guide accurate. It reads the list of what is new in the field, finds the passages that have become wrong and proposes corrections. A person reviews everything, and nothing is published without their approval.

## What it is for

The guide gives minimum versions, prices and security vulnerabilities to watch. This information changes constantly: a recommended version can become dangerous overnight. A [[projet/how-it-works|collection without AI]] records the changes; the agent determines which ones make a page wrong and prepares the correction work.

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

![vault-watch-agent review screen: ticked corrections, with the current text in red, the proposed text in green and the source.](/vault-watch-review.png)

## What else it does

A watch follows sources that are already known, and it only corrects. Four other kinds of work go through the same review and the same pull request:

| Work | What happens |
| :-- | :-- |
| Fixing a reported error | An error noticed by a reader or by a check is verified against primary sources, then corrected |
| Checking the guide | On demand: dead links, consistency between pages, fidelity of the translation, dated claims to re-check |
| Trimming | With every addition, the pages grow heavier. The agent lists what is repeated or out of date and proposes to shorten it, without removing a fact, a figure or a source |
| Looking for what is missing | The agent lists what a reader would look for and not find. Each lead that is kept is checked on the web, then written in the page where it belongs |

A lead is a question to check, not a fact: the author chooses which ones to follow, and sees what the search will cost before starting it.

![vault-watch-agent leads screen: three leads ticked, each with the passage of the guide it is about, and the estimated cost of the search.](/vault-watch-leads.png)

## Its safeguards

- **The model proposes, the code decides.** The AI never writes to a file. A correction is refused if the text it quotes does not occur exactly once in the page.
- **Two human approvals.** One after the report, the other before anything leaves the machine.
- **Evidence rather than memory.** Proposals rely on release notes and on primary sources consulted on the web.
- **One source of rules.** The agent loads the guide's editorial rules on every run.

## How good it is, measured

The agent was replayed on two watches processed by hand before it existed, then its proposals were compared with the human corrections. No proposal that reached the review was wrong, but it missed many: on the busiest watch, it found 2 corrections out of 15. The substantive change of that watch was found; 9 of the 13 missed corrections only concerned a date. On 18 November 2026, the replay of a more recent watch found the 11 merged corrections, with no error. That watch had been processed by the agent itself, then reviewed: this replay measures its consistency, not an independent truth. The [full evaluation](https://github.com/DamienBecherini/vault-watch-agent#the-reference-guide) is public.

As of 20 November 2026, the agent has prepared 19 of the [merged pull requests](https://github.com/DamienBecherini/ia-on-prem-vault/pulls?q=is%3Apr+is%3Amerged) of this guide, all reviewed by the author before merging.

## Its limits

- **Markdown in a Git repository.** First written for this guide, the agent now keeps any Markdown guide described by a small configuration file. Other formats are not supported.
- **It does not write a new page.** It adds to existing pages. When a subject needs a page of its own, it says so, and writing it remains the author's work.
- **Its quality is only measured with Claude.** This guide is kept with Claude models, a cloud service, [[projet/how-it-works|for public content only]]. The agent can also use a local model, but the quality of its corrections is not measured there.
- **It remains an assistant.** It never pushes directly to the main branch.

## For developers

The project is written in Python with [LangGraph](https://langchain-ai.github.io/langgraph/) for the orchestration. The model calls go through the Anthropic SDK, through Claude Code, or through any server compatible with the OpenAI API. The steps form a state graph, saved at every step in SQLite: a paused run can resume days later, from the web interface or the command line.

The French guide fits entirely in the model's context thanks to prompt caching. There is therefore no vector [[00-lexique/rag|RAG]]: at this size, reading everything costs less than building an index, and the model sees inconsistencies between pages.

**GitHub repository:** [DamienBecherini/vault-watch-agent](https://github.com/DamienBecherini/vault-watch-agent), under the MIT licence.
