---
runId: 2026_06_03_00-10_main_generate-moteurs-inference
timestamp: 2026-06-03T00:10:00+02:00
repo: ia-on-prem-vault
branch: main
baseHead: no commit
finalHead: no commit
status: completed
mode: generation
commitCreated: false
prUrl:
plan:
skills:
  - vault-generate-content
  - vault-log-run
---

# Agent Run - Génération de moteurs-inference-vllm-ollama

## Objective
Générer le premier article du chapitre 03 sur la stack logicielle (vLLM vs Ollama vs TensorRT-LLM) en utilisant les skills `vault-generate-content` et des recherches web récentes (Mai 2026).

## Files Changed
- Création : `03-stack-logicielle/inference-engines-vllm-ollama.md`
- Modification : `site.config.json` (ajout du dossier 03 au sidebar)
- Modification : `.agents/vault-maintenance/lexicon-backlog.md` (3 nouvelles fiches à créer)
- Création : ce run log.

## Git State
- Branch: `main`
- Base HEAD: N/A
- Commit created: false

## Sources Consulted
- Recherches web contextuelles (Google Search API : "vLLM", "Ollama", "TensorRT-LLM" pour 2026).
- Documentation de vLLM (v0.22, Model Runner V2).
- Benchmarks communautaires (Ayi NEDJIMI, Particula Tech) documentant l'effondrement de requêtes concurrentes d'Ollama (llama.cpp) et sa montée à 52 millions de téléchargements.
- Documentation NVIDIA sur le support natif FP4 pour B200 sur TensorRT-LLM.

## Validation
- Respect de l'editorial-policy : chiffres très spécifiques (effondrement à 16 connexions, 52M téléchargements, réduction fragmentation à 4%) appuyés de footnotes contextuelles.
- La frontière publique a été respectée (pas de TO-DO dans l'article final).

## Lexicon Follow-Up
- Fiches existantes sourcées : `llm`, `vram`, `kv-cache`, `offloading`, `quantification`, `tokens-par-seconde`, `ttft`, `nvlink`, `multi-gpu`.
- À créer dans le backlog : `pagedattention.md`, `gguf.md`, `tensorrt-llm.md`.

## Retention Check
No action.

## Residual Risk
L'article présente TensorRT-LLM et vLLM sans entrer dans le détail exhaustif de l'orchestration Triton Inference Server ou de Ray Serve (qui feront très probablement l'objet du sous-chapitre "Clustering Exo et Ray").