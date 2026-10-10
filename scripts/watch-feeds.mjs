#!/usr/bin/env node
/**
 * watch-feeds.mjs
 *
 * Weekly ecosystem watch, deterministic part. Reads the sources listed in
 * `.agents/vault-maintenance/feeds.json` (GitHub releases / tags / security
 * advisories, Hugging Face model listings, RSS / Atom feeds, YouTube channel
 * feeds) and lists every item published inside the time window.
 *
 * Stateless: the window is "the last N days" (default from feeds.json, 8 days
 * for a weekly run with overlap). No LLM: the `vault-watch` skill turns the
 * kept items into dated events and an impact map.
 *
 * Deterministic pre-triage (rules, no judgement) so the agent reads ~30 items
 * instead of ~140. Every item gets `triage: "keep" | "drop"` and a reason:
 *   - pre-releases (rc, beta, dev, nightly, proto-…) and releases below the
 *     feed's `minLevel` (default minor: patch releases dropped), unless the
 *     release notes mention a security fix (security, CVE, GHSA,
 *     vulnerability);
 *   - `collapse` feeds (build-per-commit projects) are routine unless rescued
 *     the same way;
 *   - advisories of low severity, or already fixed at the vault's floor in
 *     `.agents/vault-maintenance/version-floors.json` (floor outside the
 *     vulnerable range, or lowest patched version at or below it);
 *   - Hugging Face quantized variants, adapters, and fine-tunes found by
 *     discovery;
 *   - anything whose URL is already in `.agents/vault-maintenance/watch-seen.md`.
 * High / Critical advisories not covered by a floor are flagged `urgent`
 * (the workflow adds the `urgent` label). Release notes and advisory texts of
 * kept items are cached in the JSON (`notes`) so the agent does not refetch.
 *
 * Usage:
 *   node scripts/watch-feeds.mjs                         # Markdown on stdout
 *   node scripts/watch-feeds.mjs --days=14               # wider window
 *   node scripts/watch-feeds.mjs --since=2026-10-01      # explicit start date
 *   node scripts/watch-feeds.mjs --only=engines,security # some domains only
 *   node scripts/watch-feeds.mjs --json=path.json        # also write JSON
 *   node scripts/watch-feeds.mjs --no-triage             # keep everything
 *
 * Environment:
 *   GITHUB_TOKEN / GH_TOKEN  optional, raises the GitHub API rate limit and is
 *                            needed for security advisories in CI.
 *
 * npm script: watch:feeds
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { VAULT_ROOT } from "./lib/vault-walk.mjs";

// ---------------------------------------------------------------------------
// CLI and config
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const opt = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};

const config = JSON.parse(readFileSync(join(VAULT_ROOT, ".agents/vault-maintenance/feeds.json"), "utf8"));
const DAYS = Number(opt("days") ?? config.defaults?.days ?? 8);
const MAX_ITEMS = Number(config.defaults?.maxItemsPerFeed ?? 15);
const SINCE = opt("since") ?? new Date(Date.now() - DAYS * 86400000).toISOString().slice(0, 10);
const ONLY = opt("only") ? new Set(opt("only").split(",")) : null;
const OUT_JSON = opt("json");
const TRIAGE = !args.includes("--no-triage");
const NOTES_MAX = 4000;
const FLOORS = JSON.parse(readFileSync(join(VAULT_ROOT, ".agents/vault-maintenance/version-floors.json"), "utf8")).floors;
const SEEN = new Set(
  (readFileSync(join(VAULT_ROOT, ".agents/vault-maintenance/watch-seen.md"), "utf8").match(/https?:\/\/[^\s)>\]|]+/g) || []).map(
    (u) => u.replace(/\/+$/, ""),
  ),
);
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const TIMEOUT_MS = 20000;
const UA = "ia-on-prem-vault-watch/1.0 (+https://ia-on-prem.damien.becherini.fr)";

const sinceTime = new Date(`${SINCE}T00:00:00Z`).getTime();
const DOMAIN_ORDER = ["security", "engines", "models", "agents", "hardware", "discovery", "signals"];
const DOMAIN_TITLE = {
  discovery: "Discovery (not yet in the vault? — candidates for additions)",
  security: "Security & regulation",
  engines: "Inference engines & tooling",
  models: "Open-weight models",
  agents: "Agents, assistants & RAG",
  hardware: "Hardware",
  signals: "Signals (tier C — leads only, never a citation)",
};

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function get(url, { json = false, github = false } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const headers = { "user-agent": UA };
  if (github) {
    headers.accept = "application/vnd.github+json";
    if (TOKEN) headers.authorization = `Bearer ${TOKEN}`;
  }
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return json ? await res.json() : await res.text();
  } finally {
    clearTimeout(timer);
  }
}

const decode = (s) =>
  String(s ?? "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();

/** Escaped HTML (Atom <content type="html">) to plain text. */
const htmlText = (s) => decode(decode(s));

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
};

const atomLink = (block) => {
  const alt = block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i) || block.match(/<link[^>]*href="([^"]+)"/i);
  return alt ? alt[1] : tag(block, "link");
};

/** Parse RSS 2.0 or Atom into {title, url, date, summary}. */
function parseFeed(xml) {
  const items = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of blocks) {
    const date = tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date");
    const raw = (b.match(/<content[^>]*>([\s\S]*?)<\/content>/i) || b.match(/<description>([\s\S]*?)<\/description>/i) || [])[1];
    items.push({
      notes: raw ? htmlText(raw).slice(0, NOTES_MAX) : "",
      title: tag(b, "title") || tag(b, "media:title"),
      url: atomLink(b),
      date: date ? new Date(date).toISOString() : null,
      summary: (tag(b, "description") || tag(b, "summary") || tag(b, "media:description")).slice(0, 220),
    });
  }
  return items;
}

const inWindow = (iso) => iso && new Date(iso).getTime() >= sinceTime;

const matchesKeywords = (feed, item) => {
  if (feed.exclude && new RegExp(feed.exclude, "i").test(item.title)) return false;
  if (!feed.keywords?.length) return true;
  // Keywords match at the start of a word: "IA" must not hit "Debian".
  const hay = `${item.title} ${item.summary}`;
  return feed.keywords.some((k) =>
    new RegExp(`(?<![\\p{L}\\p{N}])${k.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "iu").test(hay),
  );
};

// ---------------------------------------------------------------------------
// Source readers
// ---------------------------------------------------------------------------

async function readFeed(feed) {
  switch (feed.type) {
    case "github-releases": {
      const xml = await get(`https://github.com/${feed.repo}/releases.atom`);
      return parseFeed(xml).map((i) => ({ ...i, title: `${feed.repo} ${i.title}` }));
    }
    case "github-tags": {
      const tags = await get(`https://api.github.com/repos/${feed.repo}/tags?per_page=10`, { json: true, github: true });
      const out = [];
      for (const t of tags.slice(0, 5)) {
        const c = await get(t.commit.url, { json: true, github: true });
        out.push({
          title: `${feed.repo} ${t.name}`,
          url: `https://github.com/${feed.repo}/releases/tag/${t.name}`,
          date: c?.commit?.committer?.date ?? null,
          summary: "",
        });
      }
      return out;
    }
    case "github-advisories": {
      const list = await get(
        `https://api.github.com/repos/${feed.repo}/security-advisories?state=published&sort=published&direction=desc&per_page=30`,
        { json: true, github: true },
      );
      return list.map((a) => ({
        title: `${feed.repo} ${a.ghsa_id}${a.cve_id ? ` / ${a.cve_id}` : ""} [${a.severity ?? "?"}] ${a.summary}`,
        url: a.html_url,
        date: a.published_at,
        severity: a.severity ?? null,
        vulns: (a.vulnerabilities || []).map((v) => ({ range: v.vulnerable_version_range || "", patched: v.patched_versions || "" })),
        notes: [
          ...(a.vulnerabilities || []).map(
            (v) => `${v.package?.name ?? "?"}: vulnerable ${v.vulnerable_version_range || "?"}, patched ${v.patched_versions || "none"}`,
          ),
          String(a.description ?? ""),
        ]
          .join("\n")
          .slice(0, NOTES_MAX),
        summary: (a.vulnerabilities || [])
          .map((v) => `${v.package?.name ?? ""} patched: ${v.patched_versions || "none"}`)
          .join("; ")
          .slice(0, 220),
      }));
    }
    case "huggingface-author": {
      const list = await get(
        `https://huggingface.co/api/models?author=${encodeURIComponent(feed.author)}&sort=createdAt&direction=-1&limit=40`,
        { json: true },
      );
      return list.map((m) => ({
        title: m.id,
        url: `https://huggingface.co/${m.id}`,
        date: m.createdAt ?? null,
        tags: m.tags || [],
        summary: [m.pipeline_tag, ...(m.tags || []).filter((t) => t.startsWith("license:"))].filter(Boolean).join(" · "),
      }));
    }
    case "huggingface-trending": {
      // Discovery: trending models from publishers not already followed.
      const followed = new Set(
        config.feeds.filter((f) => f.type === "huggingface-author").map((f) => f.author.toLowerCase()),
      );
      const list = await get(
        `https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=${feed.limit ?? 40}`,
        { json: true },
      );
      return list
        .filter((m) => !followed.has(String(m.id).split("/")[0].toLowerCase()))
        .map((m) => ({
          title: `${m.id} (trending ${m.trendingScore ?? "?"}, ${m.likes ?? 0} likes)`,
          url: `https://huggingface.co/${m.id}`,
          date: m.createdAt ?? null,
          tags: m.tags || [],
          summary: [m.pipeline_tag, ...(m.tags || []).filter((t) => t.startsWith("license:"))].filter(Boolean).join(" · "),
        }));
    }
    case "github-search": {
      // Discovery: young repositories that gained traction fast.
      const created = new Date(Date.now() - (feed.maxAgeDays ?? 30) * 86400000).toISOString().slice(0, 10);
      const q = `${feed.query} created:>${created} stars:>${feed.minStars ?? 500}`;
      const res = await get(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${feed.limit ?? 10}`,
        { json: true, github: true },
      );
      return (res.items || []).map((r) => ({
        title: `${r.full_name} (${r.stargazers_count} stars) — ${r.description ?? ""}`.slice(0, 200),
        url: r.html_url,
        date: r.created_at,
        summary: (r.topics || []).join(", "),
      }));
    }
    case "youtube": {
      const xml = await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${feed.channelId}`);
      return parseFeed(xml).map((i) => ({ ...i, title: `${feed.name}: ${i.title}` }));
    }
    case "rss":
    default:
      return parseFeed(await get(feed.url));
  }
}

// ---------------------------------------------------------------------------
// Pre-triage (deterministic rules)
// ---------------------------------------------------------------------------

const RESCUE = /\b(security|CVE-\d{4}|GHSA-|vulnerab)/i;
const PRE = /(^|[^a-z])(rc\d*|alpha|beta|dev\d*|nightly|preview|canary|snapshot)([^a-z]|$)|^proto-/i;
const QUANT = /[-_.](gguf|awq|gptq|fp8|fp4|nvfp4|mxfp4|int4|int8|w4a16|w8a8|mlx|bnb|4bit|8bit|exl[23]|onnx)\b/i;

/** "v0.31.1rc0" → [0, 31, 1, 0]; null when the tag is not a dotted version. */
function parseVersion(v) {
  const m = String(v).match(/(\d+)\.(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
  return m ? m.slice(1).map((n) => Number(n ?? 0)) : null;
}

function cmpVersion(a, b) {
  const x = parseVersion(a) || [];
  const y = parseVersion(b) || [];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d) return Math.sign(d);
  }
  return 0;
}

/** Is `version` inside a GitHub range such as ">= 0.11.1, < 0.18.0"? */
function inRange(version, range) {
  return range.split(",").every((c) => {
    const m = c.trim().match(/^(<=|>=|<|>|=)?\s*v?(\S+)$/);
    if (!m || !parseVersion(m[2])) return true; // unknown constraint: assume vulnerable
    const d = cmpVersion(version, m[2]);
    return { "<": d < 0, "<=": d <= 0, ">": d > 0, ">=": d >= 0, "=": d === 0 }[m[1] || "="];
  });
}

/**
 * The floor is safe when it is outside the vulnerable range, or when the
 * lowest patched version (">= 0.31.0", "1.99.9, 1.100.4") is at or below it.
 * No usable data: not covered, the agent decides.
 */
function floorCovers(floor, { range, patched }) {
  if (range && !inRange(floor, range)) return true;
  const fixes = (patched.match(/\d+\.\d+(?:\.\d+)*/g) || []).sort(cmpVersion);
  return fixes.length > 0 && cmpVersion(fixes[0], floor) <= 0;
}

/** "major" if x.0.0, "minor" if x.y.0, "patch" otherwise. */
function releaseLevel(v) {
  const p = parseVersion(v);
  if (!p) return null;
  if (p.slice(2).some(Boolean)) return "patch";
  return p[1] ? "minor" : "major";
}

const LEVELS = { major: 3, minor: 2, patch: 1 };

/** Returns [triage, reason, urgent]. */
function triage(feed, item) {
  if (!TRIAGE) return ["keep", "", false];
  if (SEEN.has(String(item.url).replace(/\/+$/, ""))) return ["drop", "already in watch-seen.md", false];
  const rescued = RESCUE.test(`${item.title} ${item.notes ?? ""}`);

  if (feed.type === "github-releases" || feed.type === "github-tags") {
    const tagName = decodeURIComponent(String(item.url).split("/releases/tag/")[1] ?? "");
    if (PRE.test(tagName)) return ["drop", "pre-release", false];
    if (feed.collapse) return rescued ? ["keep", "notes mention a security fix", false] : ["drop", "routine build", false];
    const level = releaseLevel(tagName);
    if (level && LEVELS[level] < LEVELS[feed.minLevel ?? "minor"]) {
      return rescued ? ["keep", `${level} release, notes mention a security fix`, false] : ["drop", `${level} release`, false];
    }
    return ["keep", "", false];
  }

  if (feed.type === "github-advisories") {
    const sev = String(item.severity ?? "").toLowerCase();
    if (sev === "low") return ["drop", "low severity", false];
    const floor = FLOORS[feed.id];
    if (floor && item.vulns?.length && item.vulns.every((v) => floorCovers(floor, v))) {
      return ["drop", `covered by floor ${floor}`, false];
    }
    return ["keep", floor ? `affects floor ${floor}` : "no floor in the vault", sev === "high" || sev === "critical"];
  }

  if (feed.type === "huggingface-author" || feed.type === "huggingface-trending") {
    const tags = item.tags || [];
    // A quant-suffixed repo is a variant of a base listed on its own; a quantized
    // repo without suffix counts only when another publisher made it (an official
    // FP8-only release such as Aleph-Alpha/Kolibri-1 stays).
    const author = String(item.url).split("/")[3]?.toLowerCase();
    const thirdPartyQuant = tags.some(
      (t) => t.startsWith("base_model:quantized:") && t.split(":")[2]?.split("/")[0].toLowerCase() !== author,
    );
    if (QUANT.test(item.url) || thirdPartyQuant) return ["drop", "quantized variant", false];
    if (tags.some((t) => t.startsWith("base_model:adapter:"))) return ["drop", "adapter (LoRA)", false];
    const thirdPartyTune = tags.some(
      (t) => /^base_model:(finetune|merge):/.test(t) && t.split(":")[2]?.split("/")[0].toLowerCase() !== author,
    );
    if (feed.discovery && thirdPartyTune) return ["drop", "third-party fine-tune or merge", false];
  }
  return ["keep", "", false];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const feeds = config.feeds.filter((f) => !ONLY || ONLY.has(f.domain));
const results = [];
const errors = [];

const queue = [...feeds];
async function worker() {
  while (queue.length) {
    const feed = queue.shift();
    try {
      // Discovery feeds look at how young an item is (maxAgeDays), not at the weekly window.
      const fresh = feed.discovery
        ? (i) => i.date && new Date(i.date).getTime() >= Date.now() - (feed.maxAgeDays ?? 45) * 86400000
        : (i) => inWindow(i.date);
      let items = (await readFeed(feed)).filter((i) => fresh(i) && matchesKeywords(feed, i));
      items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      const total = items.length;
      if (feed.collapse && total > 1) {
        const notes = items.filter((i) => RESCUE.test(i.notes ?? "")).map((i) => `${i.title}: ${i.notes}`).join("\n");
        items = [{ ...items[0], title: `${items[0].title} (+${total - 1} more in window)`, notes: (notes || items[0].notes || "").slice(0, NOTES_MAX) }];
      }
      items = items.slice(0, MAX_ITEMS);
      for (const i of items) {
        const [verdict, reason, urgent] = triage(feed, i);
        const { tags, notes, vulns, ...rest } = i;
        results.push({
          feed: feed.id,
          domain: feed.discovery ? "discovery" : feed.domain,
          tier: feed.tier,
          ...rest,
          triage: verdict,
          reason,
          urgent,
          ...(verdict === "keep" && notes ? { notes } : {}),
        });
      }
    } catch (err) {
      errors.push({ feed: feed.id, error: String(err?.message ?? err) });
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

const today = new Date().toISOString().slice(0, 10);
const md = [];
md.push(`# Weekly watch — ${SINCE} → ${today}\n`);
const kept = results.filter((r) => r.triage === "keep");
const dropped = results.filter((r) => r.triage === "drop");
const urgent = kept.filter((r) => r.urgent);
// Core items need a primary-source check; discovery and tier C signals are leads, skimmed only.
const core = kept.filter((r) => r.domain !== "discovery" && r.domain !== "signals");
md.push(
  `Sources: **${feeds.length}** · items in window: **${results.length}** · kept after pre-triage: **${kept.length}** (core **${core.length}**, leads **${kept.length - core.length}**) · urgent: **${urgent.length}** · sources in error: **${errors.length}**${TOKEN ? "" : " · no GitHub token (advisories may fail)"}\n`,
);
md.push(
  "_Deterministic pre-triage only (rules in `scripts/watch-feeds.mjs`). The `vault-watch` skill turns the kept items into dated events, verifies the primary source and maps them to vault pages. Release notes and advisory texts are cached in `watch.json` (run artifact). Tier C items are leads only._\n",
);
if (urgent.length) {
  md.push(`## Urgent (${urgent.length}) — High / Critical advisories not covered by a vault floor\n`);
  for (const r of urgent) md.push(`- [${r.title.replace(/\|/g, "\\|").slice(0, 160)}](${r.url}) — ${r.reason}`);
  md.push("");
}

for (const d of DOMAIN_ORDER) {
  const list = kept.filter((r) => r.domain === d).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (!list.length && ONLY && !ONLY.has(d)) continue;
  md.push(`## ${DOMAIN_TITLE[d]} (${list.length})\n`);
  if (!list.length) {
    md.push("_Nothing new in the window._\n");
    continue;
  }
  md.push("| Date | Source | Item | Tier | Pre-triage |");
  md.push("| :-- | :-- | :-- | :-- | :-- |");
  for (const r of list) {
    const title = r.title.replace(/\|/g, "\\|").slice(0, 160);
    md.push(`| ${(r.date || "").slice(0, 10)} | ${r.feed} | [${title}](${r.url}) | ${r.tier} | ${r.reason} |`);
  }
  md.push("");
}

if (dropped.length) {
  md.push(`## Dropped by pre-triage (${dropped.length})\n`);
  md.push("<details><summary>Dropped by deterministic rules (run with <code>--no-triage</code> to keep everything)</summary>\n");
  const byReason = new Map();
  for (const r of dropped) byReason.set(r.reason, [...(byReason.get(r.reason) || []), r]);
  for (const [reason, list] of [...byReason].sort((a, b) => b[1].length - a[1].length)) {
    const names = list.map((r) => r.title.replace(/\s*\(.*$/, "").replace(/\|/g, "/").slice(0, 70)).join(", ");
    md.push(`- **${reason}** (${list.length}): ${names.slice(0, 600)}${names.length > 600 ? " …" : ""}`);
  }
  md.push("\n</details>\n");
}

if (errors.length) {
  md.push(`## Sources in error (${errors.length})\n`);
  for (const e of errors) md.push(`- \`${e.feed}\`: ${e.error}`);
  md.push("");
}

console.log(md.join("\n"));

if (OUT_JSON) {
  const target = resolve(VAULT_ROOT, OUT_JSON);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify({ since: SINCE, until: today, kept: kept.length, core: core.length, urgent: urgent.length, items: results, errors }, null, 2) + "\n", "utf8");
}
