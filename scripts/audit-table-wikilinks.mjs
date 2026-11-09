#!/usr/bin/env node
/**
 * audit-table-wikilinks.mjs
 *
 * Detects wikilinks with an alias written with a bare pipe inside a Markdown table.
 * The pipe ends the table cell, so the link is cut in two and shows as raw text.
 * Inside a table, write [[path\|label]]; Obsidian and the site both accept it.
 *
 * Usage:
 *   node scripts/audit-table-wikilinks.mjs
 *
 * npm script: audit:table-wikilinks
 */
import { readFileSync } from "node:fs";
import {
  VAULT_ROOT,
  isExcludedRelPath,
  toRelPath,
  walkMd,
} from "./lib/vault-walk.mjs";

const TABLE_ROW = /^\s*(?:>\s*)*\|/;
const BARE_ALIAS = /\[\[[^\]|\\]*\|[^\]]*\]\]/g;
const FENCE = /^\s*(?:>\s*)*(?:```|~~~)/;

/** @type {Array<{ path: string, line: number, link: string }>} */
const violations = [];

for (const filePath of walkMd(VAULT_ROOT, { locale: "all" })) {
  const rel = toRelPath(filePath);
  if (isExcludedRelPath(rel)) continue;

  let inFence = false;
  readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .forEach((line, index) => {
      if (FENCE.test(line)) {
        inFence = !inFence;
        return;
      }
      if (inFence || !TABLE_ROW.test(line)) return;
      for (const match of line.matchAll(BARE_ALIAS)) {
        violations.push({ path: rel, line: index + 1, link: match[0] });
      }
    });
}

const now = new Date().toISOString().slice(0, 10);
console.log(`# Table Wikilink Audit — ${now}\n`);

if (violations.length === 0) {
  console.log("✅ No unescaped wikilink alias in a table.\n");
  process.exit(0);
}

console.log(`## ❌ Violations (${violations.length})\n`);
console.log("Write the alias separator as `\\|` inside a table.\n");
for (const { path, line, link } of violations) {
  console.log(`- \`${path}\` line ${line}: ${link}`);
}
console.log();

process.exit(1);
