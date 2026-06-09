---
title: LLM-as-a-judge
description: Evaluation technique where a language model judges or scores responses.
aliases:
  - LLM judge
  - Model judge
  - LLM as judge
tags:
  - lexique
  - evaluation
last_modified: "2026-06-05"
last_verified: "2026-06-05"
verified_by: "Sonnet 4.6"
verified_hitl: "Damien BECHERINI"
verified_hitl_url: "https://damien.becherini.fr"
---

## 📝 Short definition

Method using an [[00-lexique/llm|LLM]] to score, compare, or explain the quality of answers from other models.

## 📖 Detailed definition

A judge LLM can:

- compare two answers to the same question;
- assign a score against a rubric;
- check whether an answer follows instructions;
- flag likely inconsistencies or hallucinations.

Useful to speed up open-ended evaluation, but imperfect: judge LLMs may favor long answers, be sensitive to answer order, or prefer their own style.

## 💡 Why it matters for on-prem AI

When choosing a local model, a judge LLM can pre-sort many answers before human review. It should not alone decide critical use cases.

## ⚠️ Common pitfalls

- Using the same model as candidate and judge.
- Forgetting to swap A/B answer order in comparisons.
- Scoring without an explicit rubric.
- Confusing automatic judgment with business validation.

## 🔗 See also

- [[06-mise-en-oeuvre/evaluate-local-model|Evaluate a local model]]
- [[00-lexique/benchmark-llm|LLM benchmark]]
- [[00-lexique/ragas|RAGAS]]
