# Vault Agent Skills And Rules Plan

**Goal:** Add project-level agent skills and Cursor rules for reliable generation, verification, and planning of the IA on-premise vault content.

**Scope:** `ia-on-prem-vault` only.

**Naming policy:** Plans created on request must live in `docs/plans/` of the relevant repository and use `YYYY_MM_DD_HH-MM_<branch-slug>_<plan-title>.plan.md`.

---

## Files

- Create `.agents/skills/vault-generate-content/SKILL.md`
- Create `.agents/skills/vault-generate-content/references/editorial-policy.md`
- Create `.agents/skills/vault-verify-content/SKILL.md`
- Create `.agents/skills/vault-verify-content/references/source-verification.md`
- Create `.cursor/rules/vault-editorial-basics.mdc`
- Create `.cursor/rules/plan-workflow.mdc`
- Update this plan with the final implementation report

---

## Tasks

- [x] Create the content generation skill.
  - Include separate workflows for chapter articles and lexicon entries.
  - Make lexicon template enforcement apply only to `00-lexique/` entries.
  - Require a lexicon checklist for chapter generation: existing entries to link, new entries to create, and linked entries to verify/update.
  - Require sourced or nuanced performance claims.

- [x] Create the generation reference policy.
  - Capture source tiers, performance claim rules, chapter vs lexicon distinctions, and Obsidian/Starlight linking conventions.

- [x] Create the content verification skill.
  - Audit factual claims, source relevance, dead links, performance claims, audience fit, and lexicon consistency.
  - Produce findings first, ordered by severity, with concrete remediation steps.

- [x] Create the verification reference.
  - Define source quality tiers and checks for claims, benchmarks, URLs, and freshness.

- [x] Create the vault editorial Cursor rule.
  - Keep it short and scoped to Markdown files.
  - Point agents to the skills instead of duplicating the full editorial policy.
  - Include the explicit escape hatch: if the user asks not to use project skills/workflows, respect that while keeping factual/source constraints.

- [x] Create the plan workflow Cursor rule.
  - Apply when the user asks for a plan.
  - Require saving plans under `docs/plans/` in the correct repository.
  - Require timestamped filenames using `YYYY_MM_DD_HH-MM_<branch-slug>_<plan-title>.plan.md`.
  - Require appending an implementation/build report to the plan after execution when the user requests execution.

- [x] Verify the created files.
  - Confirm all expected files exist.
  - Check skill frontmatter names match their parent directories.
  - Check Cursor rule frontmatter is valid `.mdc`.
  - Run lint diagnostics on the edited paths if available.

- [x] Append the implementation report to this plan.
  - Include changed files.
  - Include verification/build evidence.
  - Include any limitations or follow-up notes.

---

## Implementation/build report

### Changes

- Created `vault-generate-content` skill with distinct workflows for chapter articles and lexicon entries.
- Created `vault-verify-content` skill for factual, source, performance, and lexicon consistency audits.
- Added skill references for editorial policy and source verification.
- Added `vault-editorial-basics.mdc` for short Markdown editorial guardrails.
- Added `plan-workflow.mdc` for the requested plan creation process.
- Updated `.gitignore` so `.cursor/rules/*.mdc` can be versioned without unignoring the whole `.cursor/` directory.
- Added this plan under `docs/plans/` using the requested timestamped naming pattern.

### Validation

- Lint diagnostics: no linter errors reported for `.agents/skills`, `.cursor/rules`, or `docs/plans`.
- First build command: `npm run build` from `D:\Webdev\starlight-obsidian-engine`.
  - Result: failed.
  - Root cause: the new plan file was included in the Starlight docs collection without required frontmatter.
  - Fix: added `title`, `description`, and `sidebar.order` frontmatter to the plan.
- Second build command: `npm run build` from `D:\Webdev\starlight-obsidian-engine`.
  - Result: passed.
  - Evidence: 74 pages built; Pagefind index built; sitemap generated.
  - Warnings: Astro markdown plugin deprecation warning; Vite chunk size warning; `Entry docs -> 404 was not found`.
- Final build after appending this report: passed.
  - Evidence: 74 pages built; Pagefind index built; sitemap generated.

### Notes

- I did not run `npm run publish` because the vault publish script can perform remote upload after build.
- The plan is under `docs/plans/`, so the current Starlight build publishes it as a docs page.
- No commit was created.

