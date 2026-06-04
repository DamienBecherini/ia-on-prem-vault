# Source Verification Reference

## Source Tiers

**Tier A - strong support**

- Official documentation or specifications.
- Vendor pages for product capabilities, with date and model/hardware context.
- Peer-reviewed or widely cited papers.
- Project documentation for runtime behavior.

**Tier B - usable with context**

- Reputable engineering blog posts.
- Benchmarks with explicit hardware, model, quantization, runtime, and date.
- Technical articles from known practitioners.

**Tier C - weak support**

- Forum posts, social media, unsourced benchmark tables, generic SEO articles.
- Use only as anecdotal context, not as support for strong claims.

## Claim Checks

For each important claim:

1. Identify whether it is definitional, causal, comparative, numeric, or advisory.
2. Confirm the citation supports that exact claim.
3. Check whether the claim needs a date, version, hardware, model, or runtime context.
4. Replace overconfident wording with qualified wording when the evidence is partial.

## URL Checks

When internet access is available:

- Open the cited URL.
- Confirm it is not dead, redirected to unrelated content, or paywalled beyond useful verification.
- Confirm the title and organization match the bibliography.
- Confirm the page contains the relevant claim.

## Benchmark Checks

Benchmark claims must state enough context to be meaningful:

- hardware
- model
- quantization
- runtime or framework
- batch/concurrency when relevant
- date or software version when relevant

If this context is missing, treat the number as an anecdote or remove it.

## Lexicon Consistency

When a chapter introduces or updates a concept, check:

- whether a lexicon entry exists
- whether the entry should link back to the chapter
- whether definitions, formulas, acronyms, and aliases are consistent
- whether `00-lexique/ai-glossary.md` needs a hub or acronym update

