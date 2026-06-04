---
title: "🧪 Practical implementation"
description: Concrete protocols to choose, test, secure, and operate local AI beyond hardware sizing.
sidebar:
  order: 1
---

Section 06 turns concepts from foundations, hardware, the software stack, and blueprints into **decision methods**.

> [!tip] Goal
> Do not choose a model, machine, or tool because it is popular, but because it passes your tests, on your data, with your sovereignty constraints.

---

## Where to start?

1. [[06-mise-en-oeuvre/getting-started-with-ollama|Getting started with Ollama]] — installation, first model, API, basic tuning.
2. [[06-mise-en-oeuvre/evaluate-local-model|Evaluate a local model]] — compare quality, hallucinations, coherence, RAG, agents, and performance.
3. [[06-mise-en-oeuvre/local-inference-security|Local inference security]] — API authentication, network isolation, OWASP LLM Top 10, secure agents.
4. [[06-mise-en-oeuvre/configure-vllm-multi-gpu|Configure vLLM multi-GPU]] — tensor parallelism, Ray multi-node, production hardening.
5. [[06-mise-en-oeuvre/monitoring-inference-stack|Prometheus + Grafana monitoring]] — vLLM metrics, GPU DCGM, dashboards and alerts.
6. [[06-mise-en-oeuvre/migrate-ollama-to-vllm|Migrate from Ollama to vLLM]] — API compatibility, model conversion, cutover strategy without downtime.

---

## See also

- [[03-stack-logicielle/inference-engines-vllm-ollama|Inference engines]]
- [[01-fondations/quantization-4bit-8bit|Quantization]]
- [[05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy|Sovereignty & Privacy]]
