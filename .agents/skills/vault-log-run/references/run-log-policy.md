# Run Log Policy

Run logs are operational traces for agents maintaining this vault. They complement Git and implementation plans.

## What Git Provides

- exact diffs
- branches
- commits
- rollback

## What Run Logs Provide

- why the agent worked
- which skills were used
- which sources were consulted
- which validations ran
- what follow-up remains
- whether a commit or PR was created
- what failed and how it was fixed

## Storage

Run logs live under `.agents/vault-maintenance/runs/` and are not reader-facing content.

Suggested structure:

```text
.agents/vault-maintenance/runs/
  2026/
    06/
      2026_06_02_20-14_main_stations-multi-gpu.md
      summary.md
```

## Retention

Keep detailed logs for:

- the latest 50 runs, or
- the latest 2 months

Older runs may be consolidated into monthly summaries, then yearly summaries.

An LLM writes summaries. A deterministic script should later validate and prune.

Never delete a detailed run until:

- its `runId` appears in a monthly or yearly summary
- the summary includes the run objective, status, changed files, validation outcome and follow-up
- a validation/prune script confirms coverage

## Summary Structure

Monthly summaries should contain:

- totals: runs, success, failures, partials
- notable runs
- files or sections changed
- validation failures and fixes
- open follow-up
- lexicon backlog changes
- links to remaining detailed runs if kept

## Branch And Commit Fields

Use `no commit` when no commit exists. Do not invent SHAs.

If the working tree is dirty and no commit was created, record:

```text
finalHead: no commit
workingTree: dirty
```

