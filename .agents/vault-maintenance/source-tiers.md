# Source tiers (domain classification)

Agent maintenance file — not reader-facing content.

Consumed by `npm run audit:sources` (`scripts/audit-sources.mjs`) to classify every cited external URL by evidence tier. Tiers follow `.agents/skills/vault-verify-content/references/source-verification.md`:

- **Tier A** — official documentation, vendor specs, standards bodies, peer-reviewed or widely cited papers, project docs. Strong support for factual and numeric claims.
- **Tier B** — reputable engineering blogs and benchmark publishers with disclosed hardware/model/quantization/runtime context. Usable with context.
- **Tier C** — SEO articles, consultancies' marketing blogs, forums, social media, unsourced benchmark tables. Anecdotal only; must not be the sole support for a numeric claim.

One domain per line. A domain matches itself and all its subdomains (`nvidia.com` covers `docs.nvidia.com`). `www.` is ignored. Hosts not listed are reported as **unclassified** by the audit so an agent can classify them here.

**Lifecycle:** `vault-verify-content` / `vault-refresh-outdated-content` add new hosts after judging them. `vault-maintenance-report` flags unclassified hosts. Keep the lists alphabetical.

---

## Tier A

- aclanthology.org
- acm.org
- ai.meta.com
- aider.chat
- amd.com
- anssi.gouv.fr
- anthropic.com
- anythingllm.com
- apple.com
- arxiv.org
- blog.google
- cisa.gov
- cloudflare.com
- cnil.fr
- crfm.stanford.edu
- cursor.com
- cveawg.mitre.org
- deepseek.com
- developers.googleblog.com
- docs.anythingllm.com
- docs.arize.com
- docs.litellm.ai
- docs.openwebui.com
- docs.ray.io
- docs.searxng.org
- docs.sglang.ai
- docs.vllm.ai
- docs.docker.com
- ec.europa.eu
- eur-lex.europa.eu
- europa.eu
- exolabs.net
- firecracker-microvm.github.io
- genai.owasp.org
- github.com
- githubusercontent.com
- grafana.com
- groq.com
- huggingface.co
- ieee.org
- infinibandta.org
- intel.com
- jan.ai
- khoj.dev
- kubernetes.io
- kb.cert.org
- langchain-ai.github.io
- langfuse.com
- learn.microsoft.com
- legifrance.gouv.fr
- llama.com
- lmstudio.ai
- lmsys.org
- milvus.io
- mistral.ai
- mlcommons.org
- modelcontextprotocol.io
- neo4j.com
- nist.gov
- nvidia.com
- nvidia.github.io
- ollama.com
- openai.com
- openhands.dev
- owasp.org
- pcisig.com
- prometheus.io
- pypi.org
- qdrant.tech
- qwen.ai
- qwenlm.github.io
- research.meta.ai
- swebench.com
- tailscale.com
- tenstorrent.com
- thunderbolttechnology.net
- tinyhumans.ai
- twingate.com
- vllm.ai
- z.ai

## Tier B

- anandtech.com
- anyscale.com
- arena.ai
- artificialanalysis.ai
- baseten.co
- blog.vllm.ai
- blogs.vmware.com
- chipsandcheese.com
- crunchydata.com
- damien.becherini.fr
- developer.apple.com
- fireworks.ai
- hardwareluxx.de
- latent.space
- lmarena.ai
- modal.com
- notebookcheck.net
- phoronix.com
- semianalysis.com
- servethehome.com
- simonwillison.net
- spheron.network
- techpowerup.com
- tinyhumans.gitbook.io
- together.ai
- tomshardware.com
- trendforce.com
- tweaktown.com
- vals.ai
- zed.dev

## Tier C

- ayinedjimi-consultants.fr
- craftrigs.com
- dev.to
- hashnode.dev
- linkedin.com
- llmhardware.io
- lyzr.ai
- medium.com
- particula.tech
- quora.com
- reddit.com
- sitepoint.com
- substack.com
- towardsdatascience.com
- twitter.com
- videocardz.com
- x.com
- xzh.me
- youtube.com
