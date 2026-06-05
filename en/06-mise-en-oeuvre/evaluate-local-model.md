---
title: "🧪 Evaluate a local model"
description: Practical protocol to compare local LLMs on quality, factuality, hallucinations, RAG, code editing, and performance.
sidebar:
  order: 2
last_modified: "2026-06-04"
---

Choosing a local model is not about picking the first name at the top of a leaderboard. A model can excel at math, be mediocre at domain-specific French, fast but hallucinated, or very good at RAG but risky for editing a repository.

> [!warning] Basic rule
> Never evaluate a model "in general." Evaluate it on **your task**, **your documents**, **your hardware**, and **your acceptance thresholds**.

---

## Three levels of evaluation

### 1. Public benchmarks

Public benchmarks give a first orientation, but their predictive value for enterprise use is **severely limited in 2026**.

> [!warning] The contamination problem
> Large static benchmarks — MMLU, HumanEval, MATH — are now considered **saturated and potentially contaminated**: part of their test data has leaked into training corpora of recent models. Comparing Qwen 2.5 and Llama 3.x on MMLU says almost nothing about real behavior in your business context. A model can score 90% on MMLU and produce dangerous hallucinations on your internal documents.

Benchmarks remain useful for **roughly sorting** model families, or for checking very targeted capabilities (formal reasoning, syntactically correct code). For that, prefer **domain-specific** tests and evaluations on real data (SWE-bench for code, for example, because it measures on real GitHub issues, not memorizable exercises).

| Family | Examples | Real utility | Limits |
| :-- | :-- | :-- | :-- |
| General knowledge | MMLU, MMLU-Pro, GPQA | rough sort between families | saturated, contaminated, does not predict domain work |
| Math / reasoning | GSM8K, MATH | check formal logic | not representative of prose tasks |
| Instruction following | IFEval, MT-Bench | conversational quality | results vary by language |
| Factuality | TruthfulQA, FActScore, HaluEval | resistance to false beliefs | measures general factuality, not your domain |
| Code | HumanEval, MBPP, SWE-bench | generation/editing ability | SWE-bench is most representative for agents |
| Holistic evaluation | HELM | multi-metric profile | useful as complement, not replacement for domain tests |

HELM reminds us that a model is not simply "good" or "bad": it has a profile — accuracy, robustness, calibration, bias, toxicity, efficiency[^1]. But even a favorable HELM profile guarantees nothing on your data.

> [!note] What a leaderboard really tells you
> It tells you how the model performs on questions chosen by its authors, often in English, with a normalized answer format. It says nothing about your internal documents, target language, citation requirements, output format, or VRAM budget.
>
> **The only evaluation that matters for SMB/enterprise deployment is a golden dataset built from your own use cases.**

### 2. Your domain test bench

The real comparison starts with a **golden dataset**: a small set of representative questions, validated by a competent human.

A good test set contains:

- 20 to 50 simple questions where the expected answer is clear;
- 20 to 50 hard, ambiguous, or trap questions;
- 10 to 20 "do not answer" cases: missing information, out-of-scope request, conflict between sources;
- a few long questions that test context window and [[00-lexique/kv-cache|KV Cache]];
- mandatory output formats: JSON, table, short summary, source citation.

For each question, store:

| Field | Example |
| :-- | :-- |
| `question` | "What is the procedure for validating an agent PR?" |
| `expected_source` | document path or reference excerpt |
| `expected_answer` | short answer or grading criteria |
| `risk` | low, medium, critical |
| `type` | RAG, reasoning, summary, extraction, refusal |

### 3. Human validation

Automatic scores speed up triage, but the final decision must remain human for critical uses.

> [!tip] Good protocol
> Score responses blind: the reviewer does not know which model answered. Otherwise the model brand quickly biases judgment.

---

## Which KPIs to measure?

### Response quality

| KPI | Question |
| :-- | :-- |
| Accuracy | Is the answer correct? |
| Completeness | Does it cover essential elements? |
| Coherence | Does it contradict itself between paragraphs or turns? |
| Instruction adherence | Does it follow the requested format? |
| Appropriate refusal | Does it say "I don't know" when the source is missing? |

### Hallucinations and factuality

TruthfulQA tests a model's ability to avoid false but plausible answers, often learned by imitating human text[^2]. FActScore goes further on long text: it splits the answer into atomic facts and checks what proportion is supported by a reliable source[^3].

For an internal guide, the most useful KPI is often:

$$\text{Critical hallucination rate} = \frac{\text{dangerously false answers}}{\text{total answers}}$$

A critical hallucination is not just an error: it is an answer that could trigger a bad business decision.

### RAG

For a [[00-lexique/rag|RAG]] architecture, split the problem in two:

| Component | KPI |
| :-- | :-- |
| Retrieval | context precision, context recall, correct source rate in top-k |
| Generation | faithfulness, answer relevancy, correct citation |

RAGAS proposes evaluating faithfulness of the answer to context, answer relevance, and quality of retrieved context, without always requiring a human reference answer[^4].

### Code and agents

For a custodian agent or a tool like Aider, completion benchmarks are not enough. Test real editing:

- does the patch compile?
- do tests pass?
- is the diff minimal?
- does the model respect allowed files?
- does it break Markdown, YAML frontmatter, or wikilinks?
- does it loop on the same fix?

SWE-bench measures this capability from real GitHub issues: the model must produce a patch and the repo tests serve as arbiter[^5]. That is much closer to a maintenance agent than a simple function-generation benchmark.

### Local performance

Even if this chapter focuses mainly on quality, always measure:

- [[00-lexique/ttft|TTFT]];
- [[00-lexique/tokens-per-second|tokens/s]];
- VRAM used at idle and under load;
- [[00-lexique/kv-cache|KV Cache]] consumption;
- throughput with 1, 5, 20 simultaneous users;
- stability after 1 hour of load.

---

## Use an AI as judge?

Yes, but carefully.

The judge model (*LLM-as-a-judge*) is useful to pre-sort many open-ended responses. Work around MT-Bench and Chatbot Arena shows that a strong judge can approach human agreement on conversational preferences, but with documented biases: answer position, verbosity, preference for its own model family[^6].

> [!warning] Do not delegate the final verdict
> An LLM judge can help score, explain, triage, and detect inconsistencies. It does not replace human validation on critical cases.

Good practices:

1. Use an explicit rubric: accuracy, source, format, concision, risk.
2. Ask for a short justification, not only a score.
3. Compare in double-blind: anonymized models A/B.
4. Reverse answer order to detect position bias.
5. Do not use the same model as candidate and judge.
6. Manually review a sample of decisions.

---

## Concrete 7-step protocol

### Step 1 — Define the task

Examples:

- RAG assistant for HR documents;
- custodian agent that fixes a Markdown vault;
- legal summary;
- JSON extraction from invoices;
- level-1 internal support.

### Step 2 — Define acceptance thresholds

Example for a document assistant:

| KPI | Threshold |
| :-- | :-- |
| Answer with correct source | ≥ 95% on simple questions |
| Critical hallucination | 0 tolerated |
| Correct refusal when source missing | ≥ 90% |
| TTFT | < 2 s |
| Throughput | ≥ 10 tokens/s per interactive user |

### Step 3 — Build the golden dataset

Start small. A CSV or JSONL file is enough:

```json
{"id":"rag-001","question":"Which scenario fits 10 users on a 70B model?","expected_source":"04-blueprints/scenario-b-sme-appliance.md","risk":"medium","type":"rag"}
```

### Step 4 — Fix parameters

To compare fairly:

- same system prompt;
- same temperature;
- same context size;
- same quantization;
- same inference engine;
- same hardware;
- same model version.

### Step 5 — Run multiple passes

A single pass is not enough. LLMs are non-deterministic whenever temperature is above zero.

For critical tasks, run at least 3 passes and note:

- average score;
- worst answer;
- variability between runs;
- recurring errors.

### Step 6 — Analyze errors

Classify each error:

| Category | Example |
| :-- | :-- |
| Retrieval miss | The right document was not retrieved |
| Hallucination | The model invents a non-existent policy |
| Bad format | Invalid JSON, broken table |
| Overconfidence | Answers when the source is missing |
| Faulty reasoning | Good source, wrong conclusion |
| Regression | Old model answered correctly, new one fails |

### Step 7 — Decide

The best model is rarely the largest. The right model is the one that meets thresholds, fits your [[00-lexique/vram|VRAM]], respects confidentiality, and stays operable.

> [!tip] Practical decision
> Keep a small fast model for simple tasks, a stronger model for decisions or editing, and a regression protocol so quality is not lost on updates.

---

## Decision matrix

| Need | Priority metric | Useful public benchmark | Essential local test |
| :-- | :-- | :-- | :-- |
| General chat | human preference, instruction following | MT-Bench, Chatbot Arena, IFEval | anonymized domain conversations |
| Document RAG | faithfulness, context recall | RAGAS | sourced questions on your documents |
| Code agent | correct patch, tests pass | SWE-bench | simulated PRs on your repo |
| Legal / medical summary | factuality, critical omissions | FActScore, TruthfulQA | expert human review |
| SMB deployment | TTFT, tokens/s, stability | engine benchmarks | concurrent load on target hardware |

---

## See also

- [[01-fondations/quantization-4bit-8bit|4-bit & 8-bit quantization]]
- [[03-stack-logicielle/rag-and-agents|RAG & Agents]]
- [[05-agents-et-assistants-on-prem/agents-custodiens/solutions/aider|Aider]]
- [[00-lexique/benchmark-llm|LLM benchmark]]
- [[00-lexique/llm-as-a-judge|LLM-as-a-judge]]
- [[00-lexique/ragas|RAGAS]]

## Sources

[^1]: Stanford CRFM, *Holistic Evaluation of Language Models (HELM)*. [https://crfm.stanford.edu/helm/](https://crfm.stanford.edu/helm/)
[^2]: Lin, Hilton, Evans, *TruthfulQA: Measuring How Models Mimic Human Falsehoods*, 2021. [https://arxiv.org/abs/2109.07958](https://arxiv.org/abs/2109.07958)
[^3]: Min et al., *FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation*, EMNLP 2023. [https://aclanthology.org/2023.emnlp-main.741/](https://aclanthology.org/2023.emnlp-main.741/)
[^4]: Es et al., *RAGAS: Automated Evaluation of Retrieval Augmented Generation*, EACL 2024. [https://aclanthology.org/2024.eacl-demo.16/](https://aclanthology.org/2024.eacl-demo.16/)
[^5]: Jimenez et al., *SWE-bench: Can Language Models Resolve Real-World GitHub Issues?*, ICLR 2024. [https://www.swebench.com/original.html](https://www.swebench.com/original.html)
[^6]: Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*, NeurIPS 2023. [https://arxiv.org/abs/2306.05685](https://arxiv.org/abs/2306.05685)
