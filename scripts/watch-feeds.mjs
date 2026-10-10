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
 * for a weekly run with overlap). No LLM, no judgement: the
 * `vault-watch` skill turns this list into dated events and an impact map.
 *
 * Usage:
 *   node scripts/watch-feeds.mjs                         # Markdown on stdout
 *   node scripts/watch-feeds.mjs --days=14               # wider window
 *   node scripts/watch-feeds.mjs --since=2026-10-01      # explicit start date
 *   node scripts/watch-feeds.mjs --only=engines,security # some domains only
 *   node scripts/watch-feeds.mjs --json=path.json        # also write JSON
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
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const TIMEOUT_MS = 20000;
const UA = "ia-on-prem-vault-watch/1.0 (+https://ia-on-prem.damien.becherini.fr)";

const sinceTime = new Date(`${SINCE}T00:00:00Z`).getTime();
const DOMAIN_ORDER = ["security", "engines", "models", "agents", "hardware", "signals"];
const DOMAIN_TITLE = {
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
    items.push({
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
  if (!feed.keywords?.length) return true;
  const hay = `${item.title} ${item.summary}`.toLowerCase();
  return feed.keywords.some((k) => hay.includes(k.toLowerCase()));
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
        summary: [m.pipeline_tag, ...(m.tags || []).filter((t) => t.startsWith("license:"))].filter(Boolean).join(" · "),
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
      let items = (await readFeed(feed)).filter((i) => inWindow(i.date) && matchesKeywords(feed, i));
      items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      const total = items.length;
      if (feed.collapse && total > 1) {
        items = [{ ...items[0], title: `${items[0].title} (+${total - 1} more in window)` }];
      }
      items = items.slice(0, MAX_ITEMS);
      for (const i of items) results.push({ feed: feed.id, domain: feed.domain, tier: feed.tier, ...i });
    } catch (err) {
      errors.push({ feed: feed.id, error: String(err?.message ?? err) });
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

const today = new Date().toISOString().slice(0, 10);
const md = [];
md.push(`# Weekly watch — ${SINCE} → ${today}\n`);
md.push(
  `Sources: **${feeds.length}** · items in window: **${results.length}** · sources in error: **${errors.length}**${TOKEN ? "" : " · no GitHub token (advisories may fail)"}\n`,
);
md.push(
  "_Raw list, no judgement. The `vault-watch` skill turns it into dated events, verifies the primary source and maps them to vault pages. Tier C items are leads only._\n",
);

for (const d of DOMAIN_ORDER) {
  const list = results.filter((r) => r.domain === d).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (!list.length && ONLY && !ONLY.has(d)) continue;
  md.push(`## ${DOMAIN_TITLE[d]} (${list.length})\n`);
  if (!list.length) {
    md.push("_Nothing new in the window._\n");
    continue;
  }
  md.push("| Date | Source | Item | Tier |");
  md.push("| :-- | :-- | :-- | :-- |");
  for (const r of list) {
    const title = r.title.replace(/\|/g, "\\|").slice(0, 160);
    md.push(`| ${(r.date || "").slice(0, 10)} | ${r.feed} | [${title}](${r.url}) | ${r.tier} |`);
  }
  md.push("");
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
  writeFileSync(target, JSON.stringify({ since: SINCE, until: today, items: results, errors }, null, 2) + "\n", "utf8");
}
