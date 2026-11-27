#!/usr/bin/env node
/**
 * audit-watchlist-quotes.mjs
 *
 * Lists the watchlist rows whose quoted claim is no longer in their page: the page
 * was corrected, trimmed or reworded and the row was not. Such a row sends the old
 * wording to every re-check of the due claims (2026-11-26: four claims reported as
 * outdated when their pages were already current) and no longer lets `grep` find
 * the sentence it tracks.
 *
 * A claim is the text between the first « and the last » of the Claim cell. It is
 * cut at every « … » (or "...") and at inner guillemets (« a » / « b » joins two
 * passages), and each fragment of 12 characters or more must be found in the page. Page and fragments are compared without emphasis, code marks,
 * links (their text is kept), footnote calls, blockquote marks, escaped pipes and
 * with every run of spaces as one.
 *
 * Usage:
 *   node scripts/audit-watchlist-quotes.mjs                 # Markdown report, exit 0
 *   node scripts/audit-watchlist-quotes.mjs --json=out.json # also a JSON report
 *   node scripts/audit-watchlist-quotes.mjs --strict        # exit 1 when a row drifts
 *
 * npm script: audit:watchlist-quotes (warn-only, not in `npm test`)
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { VAULT_ROOT } from "./lib/vault-walk.mjs";

const args = process.argv.slice(2);
const STRICT = args.includes("--strict");
const jsonArg = args.find((a) => a.startsWith("--json="));
const OUT_JSON = jsonArg ? jsonArg.slice("--json=".length) : null;

const WATCHLIST_DIR = ".agents/vault-maintenance/watchlist";
const MIN_FRAGMENT = 12;

/** Text as the comparison sees it: what a reader reads, spaces folded. */
function normalise(text) {
  return text
    .replace(/^\s*>\s?/gm, "") // blockquote and callout marks
    .replace(/\\\|/g, "|") // escaped pipes in tables and watchlist cells
    .replace(/\[\^[^\]]+\]/g, "") // footnote calls
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // Markdown links and images: their text
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1") // wikilinks: their alias or target
    .replace(/[*`]/g, "") // emphasis and code marks
    .replace(/[   ]/g, " ") // non-breaking and thin spaces
    .replace(/[’ʼ]/g, "'") // typographic apostrophes
    .replace(/\s+/g, " ")
    .trim();
}

/** The quoted claim of a Claim cell, or null when the cell quotes nothing. */
function quoteOf(cell) {
  const start = cell.indexOf("«");
  const end = cell.lastIndexOf("»");
  return start >= 0 && end > start ? cell.slice(start + 1, end) : null;
}

/** The fragments of a quote that must each be found in the page. */
function fragments(quote) {
  return normalise(quote)
    .split(/…|\.\.\.|\(…\)|[«»]/) // a quote joining two cells or passages: « a » / « b »
    .map((s) => s.replace(/^[\s«».,;:)(]+|[\s«».,;:(]+$/g, ""))
    .filter((s) => s.length >= MIN_FRAGMENT);
}

/** Split a watchlist table row into its cells, escaped pipes kept inside them. */
function cellsOf(line) {
  return line
    .replace(/\\\|/g, "\u0000")
    .split("|")
    .slice(1, -1)
    .map((c) => c.split("\u0000").join("\\|").trim());
}

const pages = new Map();
function pageText(rel) {
  if (!pages.has(rel)) {
    const abs = join(VAULT_ROOT, rel);
    pages.set(rel, existsSync(abs) ? normalise(readFileSync(abs, "utf8")) : null);
  }
  return pages.get(rel);
}

const drifted = [];
let rows = 0;
let unquoted = 0;
const dir = join(VAULT_ROOT, WATCHLIST_DIR);
for (const file of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
  const lines = readFileSync(join(dir, file), "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (!line.startsWith("| `")) return;
    const cells = cellsOf(line);
    if (cells.length < 10) return;
    const page = cells[0].replace(/`/g, "");
    if (!page.endsWith(".md")) return;
    rows += 1;
    const quote = quoteOf(cells[1]);
    if (quote === null) {
      unquoted += 1;
      return;
    }
    const base = { file: `${WATCHLIST_DIR}/${file}`, line: i + 1, page, claim: cells[1],
      status: cells[7], recheck_by: cells[9] ?? "" };
    const text = pageText(page);
    if (text === null) {
      drifted.push({ ...base, reason: "page-missing", missing: [], found: 0, total: 0 });
      return;
    }
    const parts = fragments(quote);
    const missing = parts.filter((p) => !text.includes(p));
    if (missing.length) {
      drifted.push({ ...base, reason: missing.length === parts.length ? "quote-missing" : "fragment-missing",
        missing, found: parts.length - missing.length, total: parts.length });
    }
  });
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const count = (r) => drifted.filter((d) => d.reason === r).length;
const due = drifted.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.recheck_by)).length;
const md = [
  "# Watchlist quotes",
  "",
  `${rows} rows, ${unquoted} without a « quote ». **${drifted.length}** quote no longer found in their page: ` +
    `${count("quote-missing")} entirely, ${count("fragment-missing")} in part, ${count("page-missing")} page missing; ` +
    `${due} of them carry a « Recheck by » date.`,
  "",
];
if (drifted.length) {
  md.push("| Row | Page | Recheck by | Not found |", "| :-- | :-- | :-- | :-- |");
  for (const d of drifted) {
    const what = d.reason === "page-missing" ? "(page missing)"
      : `${d.found}/${d.total} found; « ${d.missing[0].slice(0, 100).replace(/\|/g, "\\|")}${d.missing[0].length > 100 ? "…" : ""} »`;
    md.push(`| \`${d.file.split("/").pop()}:${d.line}\` | \`${d.page}\` | ${d.recheck_by} | ${what} |`);
  }
  md.push("");
}
md.push("_Generated by `scripts/audit-watchlist-quotes.mjs`. A row listed here quotes wording its page no longer has: " +
  "quote the page as it reads today (`.agents/vault-maintenance/freshness-watchlist.md`, « If the wording changes, update the row »), " +
  "or remove the row when its sentence is gone. Checked and Status move only after a web check._");
console.log(md.join("\n"));

if (OUT_JSON) {
  writeFileSync(OUT_JSON, JSON.stringify({ rows, unquoted, drifted }, null, 2) + "\n", "utf8");
}
process.exit(STRICT && drifted.length ? 1 : 0);
