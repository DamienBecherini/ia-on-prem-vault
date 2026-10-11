# Readability rubric — judged part (60 points per profile)

Agent-only file. Scores never go into public pages.

The readability score of a FR page is out of 100 for each of two reader profiles:

| Part | Points | Who measures |
| :-- | --: | :-- |
| Deterministic | 40 | `npm run audit:readability` → `deterministic.json` |
| Judged | 60 | an agent, with this rubric → `judged.json` |

**Alert threshold: 60/100** on the page's primary profile (see [Page types](#page-types-and-primary-profile)).

## Three-tier reading pattern (editorial rule)

Articles follow « lecture à trois étages » (`.agents/rules/editorial-basics.md`): (1) an « En bref » for profile A with no jargon; (2) `prerequisites` in frontmatter, rendered as a « Pour bien lire cette page » box, giving 2–3 pages to read first; (3) an expert body where every technical term is linked to the lexicon (tooltip) or explained at first occurrence. Judge A1 on tier 1, A2 and B3 on tier 3, and credit tier 2 as described under A2.

## The two profiles

| Code | Profile (FR) | Who they are |
| :-- | :-- | :-- |
| **A** | « dirigeant de PME non technique » | Runs a 10–200 person company, decides on budget and risk, has no IT background. Knows *IA*, *ChatGPT*, *RGPD*, *serveur*, *cloud*. Does not know *GPU*, *VRAM*, *token*, *API*, *quantification*. Reads to decide: should we do it, what does it cost, what can go wrong. |
| **B** | « développeur qui découvre l'IA locale » | Writes code, knows Linux, Docker, HTTP APIs, JSON, CPU / GPU / RAM. Has used ChatGPT or an API, never run a model locally. Does not know *KV cache*, *GGUF*, *quantification Q4*, *vLLM*, *prefill*. Reads to do: install, size, configure, debug. |

## Reading situation: direct arrival

Score each page **as if the reader landed on it from a search engine**. The page must stand on its own: only its own text and its own links count. A term explained in another chapter but not linked here is unexplained. A link to a lexicon entry counts as an explanation (the reader can open it), but a page that needs ten link clicks to be understood is not readable on its own: judge that under criterion 2.

## Criteria — profile A (dirigeant de PME)

Each criterion is scored 1 to 5. Anchors describe 1, 3 and 5; 2 and 4 sit between.

### A1. Accroche et enjeu — on comprend vite de quoi parle la page et pourquoi ça compte

| Score | Anchor |
| :-- | :-- |
| 1 | The first screen is a spec sheet, a formula or a jargon list. The reader cannot say what the page is about or why it matters to a company. |
| 3 | The subject is stated in the first lines, but the business stake (cost, risk, capacity, confidentiality) is implicit or arrives late, or the opening is in technical words. |
| 5 | In the first 3–5 sentences, in plain French, the reader knows the subject and why it matters to them (what it changes for cost, risk or what the company can do). On articles this is the « En bref » callout of the three-tier pattern: no acronym, no product code, no unit the reader cannot picture. |

### A2. Jargon maîtrisé — termes expliqués ou liés

| Score | Anchor |
| :-- | :-- |
| 1 | Wall of acronyms and product codes; key terms are neither explained nor linked; the page is unreadable without outside help. |
| 3 | Core terms are explained or linked, but secondary jargon (formats, protocols, tool names) is left raw in places that matter to understanding. |
| 5 | Every technical term needed to follow the reasoning is explained in a few plain words at first use or linked to the lexicon; leftover jargon sits in clearly technical sub-sections the reader can skip. |

Use the deterministic `unexplainedTerms` list as evidence, but judge importance: one unexplained term in the conclusion weighs more than five in a spec table.

A term linked to the lexicon counts as explained: the site shows the entry's definition as a tooltip on hover or tap. A page that declares `prerequisites` (rendered as « 📚 Pour bien lire cette page ») may rely on those pages for the basics it lists; do not penalise it for not re-explaining them, as long as the « En bref » itself stays jargon-free.

### A3. Progression — du simple au complexe

| Score | Anchor |
| :-- | :-- |
| 1 | No visible order; technical detail comes before the reader knows why it matters; the essential is buried. |
| 3 | Sections follow a logical order, but the reader has to cross a technical block (formula, spec list, configuration) to reach what concerns them. |
| 5 | The reader gets the essential first and can stop early; each section builds on the previous one; technical depth comes last or is clearly marked as optional. |

### A4. Exemples et analogies

| Score | Anchor |
| :-- | :-- |
| 1 | Abstract only: no example, no comparison, no order of magnitude the reader can relate to. |
| 3 | Some concrete elements (a scenario, a price, a figure), but no analogy for the hard concept, or examples that are themselves technical. |
| 5 | The hard concepts get an everyday analogy; examples come from the reader's world (a firm of 20 people, a confidential file, a monthly bill); orders of magnitude are given in € or in time. |

### A5. Utilité pour décider — coût, risque, choix

| Score | Anchor |
| :-- | :-- |
| 1 | The reader ends the page with no idea what to do, what it costs or what can go wrong. |
| 3 | A conclusion or advice exists, but it is written for an engineer (flags, settings) or leaves cost and risk implicit. |
| 5 | A clear takeaway the reader can act on: when to choose what, budget range, main risks and how to avoid them, and where to go next. |

## Criteria — profile B (développeur)

### B1. Justesse et précision

| Score | Anchor |
| :-- | :-- |
| 1 | Errors, or vague claims ("très rapide", "beaucoup de mémoire") with no figure, version or source. |
| 3 | Mostly right, but some figures lack a date, version or source, or some claims are over-general; a code sample may be broken. |
| 5 | Precise and nuanced: versions and dates, sourced figures, measured vs theoretical clearly separated, limits stated; every command or snippet is valid as written. |

### B2. Étapes reproductibles — actionnable

| Score | Anchor |
| :-- | :-- |
| 1 | Nothing the reader can run, compute or apply. |
| 3 | Some commands, a formula or settings, but steps are missing (prerequisites, how to verify, how to undo) or the method has to be guessed. |
| 5 | The reader can reproduce: commands in order, expected output or a check, a worked calculation they can redo with their own numbers, a rollback. For a conceptual page: a method the reader can apply (formula + worked example, decision rule). |

### B3. Termes définis ou liés

| Score | Anchor |
| :-- | :-- |
| 1 | Local-AI terms (KV cache, GGUF, quantification, prefill...) used without definition or link. |
| 3 | Main terms linked or defined, some first uses left bare (often formats, precisions, engine names). |
| 5 | Every local-AI term is defined or linked at first use; general dev terms (API, JSON, Docker) may stay bare. |

### B4. Progression

| Score | Anchor |
| :-- | :-- |
| 1 | Steps or concepts in the wrong order; the reader needs something explained later to understand what comes first. |
| 3 | Logical overall, with jumps: a forward reference, a prerequisite stated late, an aside that breaks the flow. |
| 5 | Prerequisites first, then each step or concept in the order the reader needs it; no forward dependency; asides marked. |

### B5. Profondeur suffisante

| Score | Anchor |
| :-- | :-- |
| 1 | Surface only: says what, not why or how; no pitfalls. |
| 3 | Explains the mechanism or the procedure, but misses the main pitfalls, limits or the next step. |
| 5 | Goes to the mechanism (why it works), the pitfalls and limits, and points to where to go deeper; enough to make a sound technical choice. |

## Conversion to /60 and final score

- Judged part, per profile: `judged = (sum of the 5 criteria) × 2.4` (5 → 12, 15 → 36, 25 → 60). A page scored 3 everywhere gets 36/60: with an average deterministic part (≈ 24/40) it lands on the 60 threshold, which is the intent ("acceptable").
- Final score, per profile: `final = deterministic (/40) + judged (/60)`, rounded to the nearest integer.

## Page types and primary profile

The primary profile decides the alert. The secondary profile is reported for information: below 45 it is flagged `watch`, not `alert`.

| Type | Pages | Primary profile | Alert when |
| :-- | :-- | :-- | :-- |
| `hub` | `00-index.md`, every folder `index.md`, `00-lexique/ai-glossary.md` | A | A < 60 |
| `lexique` | `00-lexique/*` (entries tagged `lexique`) | A and B | A < 50 **or** B < 50 |
| `article` (fondations, matériel, agents) | `01-fondations/`, `02-materiel/`, `05-…/` except `solutions/` | A | A < 60 |
| `article` (stack, solutions) | `03-stack-logicielle/`, `05-…/*/solutions/` | B | B < 60 |
| `blueprint` | `04-blueprints/` | A | A < 60 |
| `guide` | `06-mise-en-oeuvre/` except `index.md` | B | B < 60 |

The script writes `type` and `primaryProfile` per page; override them in `judged.json` only with a reason (one line in `typeNote`).

### Lighter expectations for lexicon entries

A lexicon entry is a short definition, not a lesson. Both profiles must reach **50** (not 60), and the anchors read as follows:

- **A1 / A3**: the short definition alone must make sense to profile A; the detailed sections may be technical.
- **A4**: one concrete example or one order of magnitude is enough for a 5.
- **A5**: "why it matters on-premise" in one or two sentences with a consequence (cost, capacity, risk) is a 5.
- **B2**: a way to recognize, measure or set the concept (an order of magnitude, a formula, a flag, where it shows up in a tool) — not a procedure.
- **B5**: definition + mechanism + a link to the chapter that goes deeper is a 5.

### Hubs

- **A5**: does the hub help the reader choose where to go (decision table, reading path)?
- **B2**: does the hub give a developer a quick way to get hands-on (a guide to start with)?
- **B5**: coverage of the vault's main entry points, not depth.

## Scoring procedure (agent prompt)

Run once per page. One read, both profiles. EN mirrors are never scored.

1. **Select pages.** Run `npm run audit:readability` (whole vault, a few seconds). Score a page when it is not in `judged.json`, or when its `last_modified` in `deterministic.json` differs from `lastModifiedScored` in `judged.json`. Skip the rest.
2. **Read the page once**, fully, as it renders: callouts, tables and code included, footnotes skimmed. Do not open linked pages (direct arrival). Keep at hand its entry in `deterministic.json` (metrics, `unexplainedTerms`, `longParagraphs`, `unintroducedBlocks`).
3. **Score profile A then profile B** with the anchors above (lexicon and hub adjustments when they apply). One line of justification per criterion, quoting or pointing to the passage that decided the score. Do not re-score the deterministic measures: use them as evidence only.
4. **Compute** `judged = sum × 2.4` and `final = deterministic + judged` (rounded) per profile; set `alert` from the primary profile and its threshold.
5. **Write three improvement suggestions in French**, most useful first, concrete enough to apply in one edit (what to add, move, explain or link, and where). Favour fixes that help the primary profile without hurting the other.
6. **Append or replace** the page's entry in `judged.json` (schema below). Do not edit the page itself in a scoring run.

Prompt to give a scoring agent (one page or a small batch, disjoint pages per agent):

> Tu évalues la lisibilité d'une page du vault « ZTH: IA On-Premise » pour deux profils : A « dirigeant de PME non technique » et B « développeur qui découvre l'IA locale ». Le lecteur arrive directement sur la page depuis un moteur de recherche : seule la page et ses liens comptent, n'ouvre pas les pages liées. Lis `.agents/vault-maintenance/readability/rubric.md`, puis la page `<chemin>` une seule fois, et son entrée dans `.agents/vault-maintenance/readability/deterministic.json`. Note les critères A1–A5 et B1–B5 de 1 à 5 avec les ancres de la grille (ajustements « lexique » et « hub » si le type s'y prête), avec une justification d'une ligne par critère qui cite le passage décisif. Calcule le total jugé (somme × 2,4) et le score final (déterministe + jugé, arrondi) par profil, l'alerte selon le profil principal, puis propose trois améliorations concrètes en français. Réponds uniquement avec l'objet JSON du schéma de la grille. Ne modifie aucune page.

### Output schema (`judged.json`)

`judged.json` is `{ "rubricVersion": 2, "pages": [ <entry>, ... ] }`, one entry per page:

```json
{
  "page": "01-fondations/kv-cache-and-context.md",
  "type": "article",
  "primaryProfile": "A",
  "typeNote": null,
  "lastModifiedScored": "2026-10-11",
  "scoredOn": "2026-10-11",
  "scoredBy": "Opus 5.5",
  "profiles": {
    "A": {
      "criteria": {
        "A1": { "score": 3, "why": "…" },
        "A2": { "score": 2, "why": "…" },
        "A3": { "score": 3, "why": "…" },
        "A4": { "score": 4, "why": "…" },
        "A5": { "score": 3, "why": "…" }
      },
      "judged": 36,
      "deterministic": 21.6,
      "final": 58
    },
    "B": {
      "criteria": {
        "B1": { "score": 5, "why": "…" },
        "B2": { "score": 4, "why": "…" },
        "B3": { "score": 4, "why": "…" },
        "B4": { "score": 4, "why": "…" },
        "B5": { "score": 5, "why": "…" }
      },
      "judged": 52.8,
      "deterministic": 24.3,
      "final": 77
    }
  },
  "alert": true,
  "watch": [],
  "suggestions": [
    "…",
    "…",
    "…"
  ]
}
```

`watch` lists the secondary profiles below 45 (e.g. `["B"]`). `suggestions` are in French; everything else is data.

## Calibration

The rubric was calibrated on six pages on 2026-10-11: see `calibration-2026-10-11.md`. If the user's own judgement differs from the calibration by more than about 10 points on a page, adjust the anchors or the conversion here (bump `rubricVersion`) before scoring the rest of the vault.
