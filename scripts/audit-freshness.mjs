#!/usr/bin/env node
/**
 * audit-freshness.mjs
 *
 * Lists FR pages that are due for a content review, based on their volatility
 * class and their `last_verified` date. Deterministic, no network, no LLM.
 *
 * Volatility classes and cadences are defined in
 * `.agents/vault-maintenance/freshness-watchlist.md`:
 *   volatile  90 days   prices, availability, latest models, versions, benchmarks
 *   evolving 180 days   CLI flags, support matrices, recommendations, regulation
 *   stable   365 days   physics, formulas, definitions, papers
 *
 * A page's class comes from its `freshness:` frontmatter field when present,
 * otherwise from the folder rules below (the same rules as the watchlist doc).
 *
 * Dates on or before BASELINE_UNTIL (2026-06-10) come from the June 2026 bulk
 * stamp (see docs/frontmatter-schema.md, "Baseline dates"): such pages are
 * reported as "baseline" in addition to their due status.
 *
 * The report also counts, per page, the watchlist rows that are not `current`
 * and the rows whose Note asks for a re-check ("à revérifier").
 *
 * Usage:
 *   node scripts/audit-freshness.mjs                    # Markdown report, exit 0
 *   node scripts/audit-freshness.mjs --as-of=2027-01-15 # simulate a future date
 *   node scripts/audit-freshness.mjs --strict           # exit 1 if any page is overdue
 *   node scripts/audit-freshness.mjs --json=report.json # also write a JSON report
 *   node scripts/audit-freshness.mjs --due-only         # list only due / overdue pages
 *
 * npm scripts: audit:freshness | audit:freshness:strict
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  VAULT_ROOT,
  extractFrontmatterBlock,
  isExcludedRelPath,
  readFrontmatterScalar,
  toRelPath,
  walkMd,
} from "./lib/vault-walk.mjs";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CADENCE_DAYS = { volatile: 90, evolving: 180, stable: 365 };

/** "Due soon" window, in days before the due date. */
const SOON_DAYS = 30;

/** last_verified values up to this date come from the June 2026 bulk stamp. */
const BASELINE_UNTIL = "2026-06-10";

/** Lexicon entries describing tools, runtimes or products (evolving, not stable). */
const LEXICON_TOOL_ENTRIES = new Set([
  "exo",
  "langgraph",
  "litellm",
  "ollama",
  "ray",
  "sglang",
  "smolagents",
  "tensorrt-llm",
  "vllm",
  "ragas",
  "benchmark-llm",
  "zero-data-retention",
  "excessive-agency",
  "prompt-injection",
]);

/** Pages that are pure hubs or generated indexes: not audited for freshness. */
const SKIP_PAGES = new Set([
  "00-index.md",
  "00-lexique/ai-glossary.md",
  "00-lexique/lexicon-index.md",
]);

/**
 * Infer the volatility class of a FR page from its path.
 * @param {string} rel  vault-relative path, forward slashes
 * @returns {"volatile" | "evolving" | "stable"}
 */
function classFromPath(rel) {
  const [top, ...rest] = rel.split("/");
  const name = rest.join("/");

  if (rel === "04-blueprints/tco-comparison.md") return "volatile";
  if (rel === "03-stack-logicielle/choose-your-model.md") return "volatile";
  if (rel === "03-stack-logicielle/inference-engines-vllm-ollama.md") return "volatile";
  if (top === "02-materiel") return "volatile";
  if (top === "04-blueprints" && name.startsWith("scenario-")) return "volatile";
  if (top.startsWith("05-") && rel.includes("/solutions/")) return "volatile";

  if (top === "03-stack-logicielle") return "evolving";
  if (top === "06-mise-en-oeuvre") return "evolving";
  if (top.startsWith("05-")) return "evolving";
  if (top === "04-blueprints") return "evolving";

  if (top === "00-lexique") {
    const slug = name.replace(/\.md$/, "");
    return LEXICON_TOOL_ENTRIES.has(slug) ? "evolving" : "stable";
  }
  if (top === "01-fondations") return "stable";

  return "evolving";
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};

const STRICT = flag("strict");
const DUE_ONLY = flag("due-only");
const OUT_JSON = opt("json");
const AS_OF = opt("as-of") ?? new Date().toISOString().slice(0, 10);

if (!/^\d{4}-\d{2}-\d{2}$/.test(AS_OF)) {
  console.error(`Invalid --as-of date: ${AS_OF} (expected YYYY-MM-DD)`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000;
const toDate = (s) => new Date(`${s}T00:00:00Z`);
const addDays = (s, n) => new Date(toDate(s).getTime() + n * DAY_MS).toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.round((toDate(b) - toDate(a)) / DAY_MS);

/** Claim-level re-check horizon, in days after --as-of. */
const CLAIM_UPCOMING_DAYS = 14;

/** Watchlist claims carrying a "Recheck by" date (10th column). */
const claims = [];

/**
 * Parse the per-chapter watchlist files into per-page counters, and collect
 * the claims that carry a "Recheck by" date (claim-level deadlines: promos,
 * launches, release candidates, quotes).
 * @returns {Map<string, { open: number, recheck: number }>}
 */
function loadWatchlist() {
  const dir = join(VAULT_ROOT, ".agents/vault-maintenance/watchlist");
  /** @type {Map<string, { open: number, recheck: number }>} */
  const map = new Map();
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return map;
  }
  for (const f of files) {
    const lines = readFileSync(join(dir, f), "utf8").split(/\r?\n/);
    for (const line of lines) {
      if (!line.startsWith("|")) continue;
      // Protect escaped pipes before splitting into cells.
      const cells = line.replace(/\\\|/g, "\u0000").split("|").map((c) => c.trim());
      if (cells.length < 11) continue;
      const page = cells[1].replace(/`/g, "");
      if (!page.endsWith(".md")) continue;
      const status = cells[8].toLowerCase();
      const note = cells[9].toLowerCase();
      const recheckBy = (cells[10] ?? "").trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(recheckBy)) {
        claims.push({ page, claim: cells[2].split("\u0000").join("\\|"), status, recheckBy });
      }
      const entry = map.get(page) ?? { open: 0, recheck: 0 };
      if (["drifted", "stale", "unverifiable", "pending"].includes(status)) entry.open += 1;
      if (note.includes("revérifier") || note.includes("reverifier")) entry.recheck += 1;
      map.set(page, entry);
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// Scan
// ---------------------------------------------------------------------------

const watchlist = loadWatchlist();
const rows = [];

for (const abs of walkMd(VAULT_ROOT, { locale: "fr" })) {
  const rel = toRelPath(abs);
  if (isExcludedRelPath(rel) || SKIP_PAGES.has(rel)) continue;

  const fm = extractFrontmatterBlock(readFileSync(abs, "utf8"));
  const declared = readFrontmatterScalar(fm, "freshness");
  const klass = declared && CADENCE_DAYS[declared] ? declared : classFromPath(rel);
  const cadence = CADENCE_DAYS[klass];
  const lastVerified = readFrontmatterScalar(fm, "last_verified");

  let status;
  let dueDate = null;
  let daysLeft = null;
  if (!lastVerified || !/^\d{4}-\d{2}-\d{2}$/.test(lastVerified)) {
    status = "never-verified";
  } else {
    dueDate = addDays(lastVerified, cadence);
    daysLeft = daysBetween(AS_OF, dueDate);
    status = daysLeft < 0 ? "overdue" : daysLeft <= SOON_DAYS ? "due-soon" : "ok";
  }

  const wl = watchlist.get(rel) ?? { open: 0, recheck: 0 };
  rows.push({
    page: rel,
    class: klass,
    classSource: declared && CADENCE_DAYS[declared] ? "frontmatter" : "folder",
    lastVerified: lastVerified ?? null,
    baseline: Boolean(lastVerified && lastVerified <= BASELINE_UNTIL),
    dueDate,
    daysLeft,
    status,
    openClaims: wl.open,
    recheckClaims: wl.recheck,
  });
}

const ORDER = { "never-verified": 0, overdue: 1, "due-soon": 2, ok: 3 };
rows.sort(
  (a, b) =>
    ORDER[a.status] - ORDER[b.status] ||
    (a.daysLeft ?? -1e9) - (b.daysLeft ?? -1e9) ||
    a.page.localeCompare(b.page),
);

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const count = (pred) => rows.filter(pred).length;
const byStatus = {
  "never-verified": count((r) => r.status === "never-verified"),
  overdue: count((r) => r.status === "overdue"),
  "due-soon": count((r) => r.status === "due-soon"),
  ok: count((r) => r.status === "ok"),
};
const baselineCount = count((r) => r.baseline);
const upcomingLimit = addDays(AS_OF, CLAIM_UPCOMING_DAYS);
const byDate = (a, b) => a.recheckBy.localeCompare(b.recheckBy) || a.page.localeCompare(b.page);
const claimsDue = claims.filter((c) => c.recheckBy <= AS_OF).sort(byDate);
const claimsUpcoming = claims.filter((c) => c.recheckBy > AS_OF && c.recheckBy <= upcomingLimit).sort(byDate);

const md = [];
md.push(`# Freshness Audit — as of ${AS_OF}\n`);
md.push(
  `FR pages scanned: **${rows.length}** · cadences: volatile ${CADENCE_DAYS.volatile} d, evolving ${CADENCE_DAYS.evolving} d, stable ${CADENCE_DAYS.stable} d · "due soon" = within ${SOON_DAYS} d\n`,
);
md.push("| Status | Pages |");
md.push("| :-- | --: |");
for (const [k, v] of Object.entries(byStatus)) md.push(`| ${k} | ${v} |`);
md.push(`| of which June 2026 baseline dates | ${baselineCount} |`);
md.push(`| watchlist claims due for re-check | ${claimsDue.length} |`);
md.push(`| watchlist claims due within ${CLAIM_UPCOMING_DAYS} d | ${claimsUpcoming.length} |`);
md.push("");

const claimSection = (title, list) => {
  md.push(`## ${title} (${list.length})\n`);
  if (!list.length) {
    md.push("_None._\n");
    return;
  }
  md.push("| Recheck by | Page | Claim | Status |");
  md.push("| :-- | :-- | :-- | :-- |");
  for (const c of list) md.push(`| ${c.recheckBy} | \`${c.page}\` | ${c.claim} | ${c.status} |`);
  md.push("");
};
claimSection("🔔 Claims due for re-check", claimsDue);
claimSection(`🗓️ Claims due within ${CLAIM_UPCOMING_DAYS} days`, claimsUpcoming);

const section = (title, list) => {
  md.push(`## ${title} (${list.length})\n`);
  if (!list.length) {
    md.push("_None._\n");
    return;
  }
  md.push("| Page | Class | last_verified | Due | Days | Open claims | Re-check notes |");
  md.push("| :-- | :-- | :-- | :-- | --: | --: | --: |");
  for (const r of list) {
    const lv = r.lastVerified ? `${r.lastVerified}${r.baseline ? " (baseline)" : ""}` : "—";
    md.push(
      `| \`${r.page}\` | ${r.class} | ${lv} | ${r.dueDate ?? "—"} | ${r.daysLeft ?? "—"} | ${r.openClaims} | ${r.recheckClaims} |`,
    );
  }
  md.push("");
};

section("❌ Never verified", rows.filter((r) => r.status === "never-verified"));
section("⏰ Overdue", rows.filter((r) => r.status === "overdue"));
section("⚠️ Due soon", rows.filter((r) => r.status === "due-soon"));
if (!DUE_ONLY) section("✅ Up to date", rows.filter((r) => r.status === "ok"));

md.push("---\n");
md.push(
  "_Generated by `scripts/audit-freshness.mjs`. Classes come from `freshness:` frontmatter when set, otherwise from the folder rules in `.agents/vault-maintenance/freshness-watchlist.md`. A due page is a candidate for the next `vault-refresh-outdated-content` run, not a proof that it is wrong._",
);

console.log(md.join("\n"));

if (OUT_JSON) {
  const target = resolve(VAULT_ROOT, OUT_JSON);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(
    target,
    JSON.stringify({ asOf: AS_OF, cadences: CADENCE_DAYS, byStatus, baselineCount, claimsDue, claimsUpcoming, pages: rows }, null, 2) + "\n",
    "utf8",
  );
}

if (STRICT && (byStatus.overdue > 0 || byStatus["never-verified"] > 0)) process.exit(1);
