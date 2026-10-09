#!/usr/bin/env node
/**
 * audit-sources.mjs
 *
 * Deterministic inventory and health check of external sources cited in vault notes.
 *
 *   1. Extracts every http(s) URL from published notes (prose + footnotes, code blocks ignored).
 *   2. Deduplicates and records which pages cite each URL.
 *   3. Classifies the domain by evidence tier (A/B/C) using
 *      `.agents/vault-maintenance/source-tiers.md`; unknown domains are reported as "unclassified".
 *   4. Optionally probes each URL over HTTP (HEAD, then GET fallback) and reports
 *      dead, redirected, blocked, and unreachable links.
 *
 * This replaces the LLM-driven "open every footnote" step of a refresh run with a script.
 * An agent should only investigate the failures and the tier C / unclassified sources.
 *
 * Usage:
 *   node scripts/audit-sources.mjs                       # FR notes, probe URLs, Markdown to stdout
 *   node scripts/audit-sources.mjs --no-fetch            # inventory only (offline)
 *   node scripts/audit-sources.mjs --locale=all          # include en/ mirrors
 *   node scripts/audit-sources.mjs --out=report.md --json=report.json
 *   node scripts/audit-sources.mjs --strict              # exit 1 if any URL is dead (4xx/5xx/network)
 *   node scripts/audit-sources.mjs --concurrency=8 --timeout=15000
 *
 * npm scripts: audit:sources | audit:sources:offline | audit:sources:report
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  VAULT_ROOT,
  isExcludedRelPath,
  stripFencedCodeBlocks,
  toRelPath,
  walkMd,
} from "./lib/vault-walk.mjs";

// ---------------------------------------------------------------------------
// CLI options
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const FETCH = !flag("no-fetch");
const STRICT = flag("strict");
const LOCALE = opt("locale", "fr") === "all" ? "all" : "fr";
const OUT_MD = opt("out", null);
const OUT_JSON = opt("json", null);
const CONCURRENCY = Math.max(1, parseInt(opt("concurrency", "8"), 10) || 8);
const TIMEOUT_MS = Math.max(1000, parseInt(opt("timeout", "15000"), 10) || 15000);

const TIERS_FILE = join(VAULT_ROOT, ".agents/vault-maintenance/source-tiers.md");

/** Hosts that are code examples or placeholders, never real sources. */
const IGNORED_HOST_PATTERNS = [
  /^localhost(:\d+)?$/i,
  /^127\.0\.0\.1(:\d+)?$/,
  /^0\.0\.0\.0(:\d+)?$/,
  /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/, // raw LAN IPs in examples
  /(^|\.)example\.(com|org|net)$/i,
  /\.local(:\d+)?$/i,
  /\.internal(:\d+)?$/i,
  /\.lan(:\d+)?$/i,
  /^<.*>$/, // templated hosts such as <your-host>
  /\$\{?[A-Z_]+/, // ${VAR} / $VAR
  /^host\.docker\.internal/i,
  /^\w+-service(:\d+)?$/i, // k8s-style service names
];

// ---------------------------------------------------------------------------
// Tier configuration
// ---------------------------------------------------------------------------

/**
 * Parse `.agents/vault-maintenance/source-tiers.md`.
 * Sections `## Tier A`, `## Tier B`, `## Tier C`; one domain pattern per line.
 * A pattern matches the host exactly or as a suffix (`nvidia.com` matches `docs.nvidia.com`).
 * @returns {{ A: string[], B: string[], C: string[] }}
 */
function loadTiers() {
  const tiers = { A: [], B: [], C: [] };
  let raw;
  try {
    raw = readFileSync(TIERS_FILE, "utf8");
  } catch {
    return tiers;
  }
  let current = null;
  for (const line of raw.split(/\r?\n/)) {
    const h = line.match(/^## Tier ([ABC])\b/);
    if (h) {
      current = h[1];
      continue;
    }
    if (line.startsWith("## ")) {
      current = null;
      continue;
    }
    if (!current) continue;
    const entry = line.replace(/^[-*]\s+/, "").replace(/`/g, "").trim();
    if (!entry || entry.startsWith("(") || entry.startsWith("_")) continue;
    tiers[current].push(entry.toLowerCase());
  }
  return tiers;
}

const TIERS = loadTiers();

/** @param {string} host */
function classifyHost(host) {
  const h = host.toLowerCase().replace(/^www\./, "");
  for (const tier of ["A", "B", "C"]) {
    for (const pattern of TIERS[tier]) {
      const p = pattern.replace(/^www\./, "");
      if (h === p || h.endsWith(`.${p}`)) return tier;
    }
  }
  return "unclassified";
}

// ---------------------------------------------------------------------------
// URL extraction
// ---------------------------------------------------------------------------

const URL_RE = /https?:\/\/[^\s<>"'`)\]|]+/g;

/** Trim punctuation that Markdown prose tends to glue onto a URL. */
function cleanUrl(raw) {
  let url = raw;
  // balance parentheses: "(see https://x.y/z)" is handled by the regex, but
  // Wikipedia-style URLs with "(...)" inside are kept when balanced.
  while (/[.,;:!?]$/.test(url)) url = url.slice(0, -1);
  while (url.endsWith(")") && (url.match(/\(/g) ?? []).length < (url.match(/\)/g) ?? []).length) {
    url = url.slice(0, -1);
  }
  return url;
}

/** @param {string} text @returns {Array<{ url: string, footnote: string | null, line: number }>} */
function extractUrls(text) {
  const prose = stripFencedCodeBlocks(text).replace(/`[^`\n]*`/g, "");
  const out = [];
  const lines = prose.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const fn = line.match(/^\[\^([^\]]+)\]:/);
    for (const m of line.matchAll(URL_RE)) {
      const url = cleanUrl(m[0]);
      if (!url) continue;
      out.push({ url, footnote: fn ? fn[1] : null, line: idx + 1 });
    }
  });
  return out;
}

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

function isIgnoredHost(host) {
  return !host || IGNORED_HOST_PATTERNS.some((re) => re.test(host));
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

/** @type {Map<string, { url: string, host: string, tier: string, citations: Array<{ page: string, footnote: string | null, line: number }> }>} */
const inventory = new Map();
let pagesScanned = 0;
let citationsTotal = 0;
let ignoredCitations = 0;

for (const abs of walkMd(VAULT_ROOT, { locale: LOCALE })) {
  const rel = toRelPath(abs);
  if (isExcludedRelPath(rel)) continue;
  pagesScanned += 1;
  const text = readFileSync(abs, "utf8");
  for (const { url, footnote, line } of extractUrls(text)) {
    const host = hostOf(url);
    if (isIgnoredHost(host)) {
      ignoredCitations += 1;
      continue;
    }
    citationsTotal += 1;
    const entry = inventory.get(url) ?? {
      url,
      host,
      tier: classifyHost(host),
      citations: [],
    };
    entry.citations.push({ page: rel, footnote, line });
    inventory.set(url, entry);
  }
}

// ---------------------------------------------------------------------------
// HTTP probing
// ---------------------------------------------------------------------------

const UA =
  "Mozilla/5.0 (compatible; ia-on-prem-vault-source-audit/1.0; +https://ia-on-prem.damien.becherini.fr)";

/**
 * @param {string} url
 * @returns {Promise<{ status: string, code: number | null, finalUrl: string | null, error: string | null }>}
 */
async function probe(url) {
  const attempt = async (method) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
      });
      // Drain small bodies so sockets are released; ignore errors.
      if (method === "GET") {
        try {
          await res.arrayBuffer();
        } catch {
          /* ignore */
        }
      }
      return { code: res.status, finalUrl: res.url || null, error: null };
    } catch (err) {
      const name = err?.name === "AbortError" ? "timeout" : (err?.cause?.code ?? err?.name ?? "error");
      return { code: null, finalUrl: null, error: String(name) };
    } finally {
      clearTimeout(timer);
    }
  };

  let r = await attempt("HEAD");
  // Many hosts reject HEAD (405/403/501) or mis-handle it; retry with GET before judging.
  if (r.code === null || r.code >= 400) r = await attempt("GET");

  if (r.code === null) {
    return { status: r.error === "timeout" ? "timeout" : "network-error", code: null, finalUrl: null, error: r.error };
  }
  const redirected = r.finalUrl && normalize(r.finalUrl) !== normalize(url);
  if (r.code >= 200 && r.code < 300) {
    return { status: redirected ? "redirected" : "ok", code: r.code, finalUrl: redirected ? r.finalUrl : null, error: null };
  }
  if (r.code === 401 || r.code === 403 || r.code === 429) {
    // Bot protection or rate limiting: not proof of a dead link.
    return { status: "blocked", code: r.code, finalUrl: null, error: null };
  }
  if (r.code >= 400 && r.code < 500) return { status: "dead", code: r.code, finalUrl: null, error: null };
  return { status: "server-error", code: r.code, finalUrl: null, error: null };
}

function normalize(u) {
  try {
    const x = new URL(u);
    x.hash = "";
    let s = x.toString();
    if (s.endsWith("/")) s = s.slice(0, -1);
    return s.replace(/^http:/, "https:").replace("://www.", "://");
  } catch {
    return u;
  }
}

async function probeAll(entries) {
  const queue = [...entries];
  const results = new Map();
  let done = 0;
  const worker = async () => {
    while (queue.length) {
      const e = queue.shift();
      results.set(e.url, await probe(e.url));
      done += 1;
      if (done % 25 === 0 || done === entries.length) {
        process.stderr.write(`  probed ${done}/${entries.length}\n`);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, entries.length) }, worker));
  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const entries = [...inventory.values()].sort((a, b) => a.host.localeCompare(b.host) || a.url.localeCompare(b.url));

let probes = new Map();
if (FETCH && entries.length) {
  process.stderr.write(`Probing ${entries.length} unique URLs (concurrency ${CONCURRENCY}, timeout ${TIMEOUT_MS} ms)...\n`);
  probes = await probeAll(entries);
}

for (const e of entries) {
  const p = probes.get(e.url);
  e.probe = p ?? { status: "not-probed", code: null, finalUrl: null, error: null };
}

const byStatus = {};
const byTier = { A: 0, B: 0, C: 0, unclassified: 0 };
for (const e of entries) {
  byStatus[e.probe.status] = (byStatus[e.probe.status] ?? 0) + 1;
  byTier[e.tier] += 1;
}

/** Hosts with their tier and citation volume, for the tier backlog. */
const hostStats = new Map();
for (const e of entries) {
  const s = hostStats.get(e.host) ?? { host: e.host, tier: e.tier, urls: 0, citations: 0 };
  s.urls += 1;
  s.citations += e.citations.length;
  hostStats.set(e.host, s);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10);
const md = [];
const pageList = (cits) => [...new Set(cits.map((c) => c.page))].map((p) => `\`${p}\``).join(", ");

md.push(`# Source Audit Report — ${today}\n`);
md.push(`Scope: **${LOCALE === "all" ? "FR + EN" : "FR"}** notes · ${pagesScanned} pages scanned · ${citationsTotal} citations · ${entries.length} unique URLs · ${ignoredCitations} example/placeholder URLs ignored · probing: **${FETCH ? "on" : "off"}**\n`);
md.push(`---\n`);

md.push(`## Summary\n`);
md.push(`| Metric | Count |`);
md.push(`| :-- | --: |`);
for (const [k, v] of Object.entries(byStatus).sort()) md.push(`| status: ${k} | ${v} |`);
for (const [k, v] of Object.entries(byTier)) md.push(`| tier ${k} | ${v} |`);
md.push("");

const section = (title, filter, extra) => {
  const rows = entries.filter(filter);
  md.push(`## ${title} (${rows.length})\n`);
  if (!rows.length) {
    md.push(`_None._\n`);
    return;
  }
  md.push(`| URL | ${extra.header} | Cited by |`);
  md.push(`| :-- | :-- | :-- |`);
  for (const e of rows) md.push(`| ${e.url} | ${extra.cell(e)} | ${pageList(e.citations)} |`);
  md.push("");
};

if (FETCH) {
  section("❌ Dead or erroring URLs", (e) => ["dead", "server-error", "network-error", "timeout"].includes(e.probe.status), {
    header: "Status",
    cell: (e) => `${e.probe.status}${e.probe.code ? ` (${e.probe.code})` : ""}${e.probe.error ? ` ${e.probe.error}` : ""}`,
  });
  section("🚧 Blocked (401/403/429) — verify manually", (e) => e.probe.status === "blocked", {
    header: "Code",
    cell: (e) => String(e.probe.code),
  });
  section("↪️ Redirected — update the citation if the target moved", (e) => e.probe.status === "redirected", {
    header: "Final URL",
    cell: (e) => e.probe.finalUrl ?? "",
  });
}

section("⚠️ Tier C sources — weak support, replace or qualify", (e) => e.tier === "C", {
  header: "Host",
  cell: (e) => e.host,
});

md.push(`## 🏷️ Unclassified hosts — add to \`.agents/vault-maintenance/source-tiers.md\`\n`);
const uncl = [...hostStats.values()].filter((h) => h.tier === "unclassified").sort((a, b) => b.citations - a.citations);
if (!uncl.length) md.push(`_None._\n`);
else {
  md.push(`| Host | URLs | Citations |`);
  md.push(`| :-- | --: | --: |`);
  for (const h of uncl) md.push(`| ${h.host} | ${h.urls} | ${h.citations} |`);
  md.push("");
}

md.push(`## 📊 Hosts by citation volume\n`);
md.push(`| Host | Tier | URLs | Citations |`);
md.push(`| :-- | :-- | --: | --: |`);
for (const h of [...hostStats.values()].sort((a, b) => b.citations - a.citations).slice(0, 30)) {
  md.push(`| ${h.host} | ${h.tier} | ${h.urls} | ${h.citations} |`);
}
md.push("");
md.push(`---\n`);
md.push(`_Generated by \`scripts/audit-sources.mjs\`. Blocked hosts are not dead links; redirected hosts may still be valid._`);

const report = md.join("\n");

if (OUT_MD) {
  mkdirSync(dirname(join(VAULT_ROOT, OUT_MD)), { recursive: true });
  writeFileSync(join(VAULT_ROOT, OUT_MD), report + "\n", "utf8");
  process.stderr.write(`Markdown report written to ${OUT_MD}\n`);
} else {
  console.log(report);
}

if (OUT_JSON) {
  mkdirSync(dirname(join(VAULT_ROOT, OUT_JSON)), { recursive: true });
  writeFileSync(
    join(VAULT_ROOT, OUT_JSON),
    JSON.stringify({ generated: today, locale: LOCALE, probed: FETCH, pagesScanned, citationsTotal, uniqueUrls: entries.length, byStatus, byTier, sources: entries }, null, 2) + "\n",
    "utf8",
  );
  process.stderr.write(`JSON inventory written to ${OUT_JSON}\n`);
}

const deadCount = entries.filter((e) => ["dead", "server-error", "network-error", "timeout"].includes(e.probe.status)).length;
if (STRICT && deadCount > 0) process.exit(1);
