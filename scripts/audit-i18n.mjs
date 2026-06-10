#!/usr/bin/env node
/**
 * audit-i18n.mjs
 *
 * Scans the vault for FR/EN parity issues:
 *   - FR pages missing an EN counterpart
 *   - EN pages whose `last_modified` frontmatter is older than the FR page by more than STALE_DAYS
 *
 * Usage:
 *   node scripts/audit-i18n.mjs
 *   node scripts/audit-i18n.mjs --stale-days=14
 *   node scripts/audit-i18n.mjs --stale-days=0   # strict: any FR newer than EN
 *
 * npm scripts: audit:i18n | audit:i18n:strict
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, sep } from "path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const VAULT_ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

const EXCLUDED_DIRS = new Set([
  "_private",
  "build",
  "docs",
  "node_modules",
  ".git",
  ".obsidian",
  ".agents",
  ".cursor",
  "_templates",
  "scripts",
  "en",        // EN tree is the target; we walk FR tree only
  "references",
]);

/** FR paths that intentionally have no EN mirror (repo docs, not published notes) */
const EXCLUDED_FILES = new Set(["README.md"]);

const STALE_DAYS = (() => {
  const arg = process.argv.find((a) => a.startsWith("--stale-days="));
  return arg ? parseInt(arg.split("=")[1], 10) : 7;
})();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Walk a directory tree and yield .md file paths */
function* walkMd(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) yield* walkMd(full);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      yield full;
    }
  }
}

/** Extract a YYYY-MM-DD value from frontmatter key in a file's raw text */
function extractFrontmatterDate(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, "m"));
  return match ? new Date(match[1]) : null;
}

/** Parse ISO date from frontmatter or fall back to filesystem mtime */
function getModifiedDate(filePath) {
  try {
    const text = readFileSync(filePath, "utf8");
    const fm = extractFrontmatterDate(text, "last_modified");
    if (fm) return fm;
  } catch {
    // fall through
  }
  return new Date(statSync(filePath).mtime);
}

/** Convert a FR vault path to its expected EN counterpart */
function toEnPath(frPath) {
  const rel = relative(VAULT_ROOT, frPath);
  return join(VAULT_ROOT, "en", rel);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const inSync = [];
const stale = [];
const missingEn = [];

for (const frPath of walkMd(VAULT_ROOT)) {
  const frRel = relative(VAULT_ROOT, frPath).replaceAll(sep, "/");
  if (EXCLUDED_FILES.has(frRel)) continue;

  const enPath = toEnPath(frPath);

  let enExists = false;
  try {
    statSync(enPath);
    enExists = true;
  } catch {
    // EN file does not exist
  }

  if (!enExists) {
    missingEn.push(relative(VAULT_ROOT, frPath).replaceAll(sep, "/"));
    continue;
  }

  const frDate = getModifiedDate(frPath);
  const enDate = getModifiedDate(enPath);
  const diffDays = Math.round((frDate - enDate) / (1000 * 60 * 60 * 24));

  if (diffDays > STALE_DAYS) {
    stale.push({ path: frRel, frDate, enDate, diffDays });
  } else {
    inSync.push(frRel);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const now = new Date().toISOString().slice(0, 10);

console.log(`# i18n Audit Report — ${now}\n`);
console.log(`Stale threshold: **${STALE_DAYS} days** | Vault root: \`${VAULT_ROOT}\`\n`);
console.log(`---\n`);

console.log(`## ✅ In sync (${inSync.length} files)\n`);
if (inSync.length === 0) {
  console.log("_No files in sync._\n");
} else {
  for (const p of inSync) console.log(`- \`${p}\``);
  console.log();
}

console.log(`## ⚠️ Possibly stale EN — FR newer by more than ${STALE_DAYS} days (${stale.length} files)\n`);
if (stale.length === 0) {
  console.log("_No stale files detected._\n");
} else {
  console.log("| FR file | FR modified | EN modified | Delta (days) |");
  console.log("| :-- | :-- | :-- | :-- |");
  for (const { path, frDate, enDate, diffDays } of stale) {
    const frStr = frDate.toISOString().slice(0, 10);
    const enStr = enDate.toISOString().slice(0, 10);
    console.log(`| \`${path}\` | ${frStr} | ${enStr} | +${diffDays} |`);
  }
  console.log();
}

console.log(`## ❌ Missing EN counterpart (${missingEn.length} files)\n`);
if (missingEn.length === 0) {
  console.log("_No missing EN files._\n");
} else {
  for (const p of missingEn) console.log(`- \`${p}\``);
  console.log();
}

console.log(`---\n`);
console.log(`_Total FR files scanned: ${inSync.length + stale.length + missingEn.length}_`);

if (missingEn.length > 0 || (STALE_DAYS === 0 && stale.length > 0)) {
  process.exit(1);
}
