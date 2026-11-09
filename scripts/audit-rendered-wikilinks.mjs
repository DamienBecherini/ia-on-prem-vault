#!/usr/bin/env node
/**
 * audit-rendered-wikilinks.mjs
 *
 * Fails when a built page shows a raw wikilink: "[[" in the visible text, outside code.
 * It catches any cause, whereas audit-table-wikilinks.mjs only knows the table case.
 * Needs a site build, so it runs in the CI link-audit job and not in `npm test`.
 *
 * Usage:
 *   node scripts/audit-rendered-wikilinks.mjs <built-site-directory>
 *
 * npm script: audit:rendered-wikilinks
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const NOT_PROSE = /<(pre|code|script|style|annotation)\b[\s\S]*?<\/\1>/gi;
const TAG = /<[^>]+>/g;

const distDir = process.argv[2];
if (!distDir || !existsSync(distDir)) {
  console.error(`Built site not found: ${distDir ?? "(no directory given)"}`);
  process.exit(2);
}

/**
 * @param {string} dir
 * @returns {Generator<string>}
 */
function* walkHtml(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkHtml(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

let pages = 0;
/** @type {Array<{ page: string, count: number, sample: string }>} */
const violations = [];

for (const file of walkHtml(distDir)) {
  pages += 1;
  const text = readFileSync(file, "utf8").replace(NOT_PROSE, "").replace(TAG, "");
  const first = text.indexOf("[[");
  if (first === -1) continue;
  violations.push({
    page: relative(distDir, file).replaceAll("\\", "/"),
    count: text.split("[[").length - 1,
    sample: text.slice(first, first + 70).replace(/\s+/g, " "),
  });
}

if (pages === 0) {
  console.error(`No HTML page found in ${distDir}`);
  process.exit(2);
}

console.log(`# Rendered Wikilink Audit — ${pages} pages\n`);

if (violations.length === 0) {
  console.log("✅ No raw wikilink in the built pages.\n");
  process.exit(0);
}

console.log(`## ❌ Pages with a raw wikilink (${violations.length})\n`);
for (const { page, count, sample } of violations) {
  console.log(`- \`${page}\` (${count}): ${sample}`);
}
console.log();

process.exit(1);
