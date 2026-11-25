#!/usr/bin/env node
/**
 * audit-footnotes.mjs
 *
 * Detects broken footnotes in every page (FR and EN):
 * - a definition `[^n]:` that no sentence calls (the reader sees a source attached to nothing),
 * - a call `[^n]` without a definition (the marker shows as raw text),
 * - a definition given twice in the same page.
 *
 * A call inside a code block or inline code is not a call: Markdown shows it as text, so a source cited only from
 * a code comment is reported as never called. Cite it in the sentence before or after the block instead.
 *
 * Usage:
 *   node scripts/audit-footnotes.mjs
 *
 * npm script: audit:footnotes
 */
import { readFileSync } from "node:fs";
import {
  VAULT_ROOT,
  isExcludedRelPath,
  toRelPath,
  walkMd,
} from "./lib/vault-walk.mjs";

const FENCE = /^\s*(?:>\s*)*(?:```|~~~)/;
const DEFINITION = /^\[\^([^\]]+)\]:/;
const CALL = /\[\^([^\]]+)\]/g;
const INLINE_CODE = /`[^`\n]*`/g;

/** @type {Array<{ path: string, problem: string }>} */
const violations = [];

for (const filePath of walkMd(VAULT_ROOT, { locale: "all" })) {
  const rel = toRelPath(filePath);
  if (isExcludedRelPath(rel)) continue;

  /** @type {Map<string, number>} */
  const defined = new Map();
  const called = new Set();
  let inFence = false;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    let text = line.replace(INLINE_CODE, "");
    const def = text.match(DEFINITION);
    if (def) {
      defined.set(def[1], (defined.get(def[1]) ?? 0) + 1);
      text = text.slice(def[0].length);
    }
    for (const m of text.matchAll(CALL)) called.add(m[1]);
  }
  const list = (notes) => notes.map((n) => `[^${n}]`).join(", ");
  const never = [...defined.keys()].filter((n) => !called.has(n));
  const undefinedCalls = [...called].filter((n) => !defined.has(n));
  const twice = [...defined].filter(([, count]) => count > 1).map(([n]) => n);
  if (never.length) violations.push({ path: rel, problem: `defined, never called: ${list(never)}` });
  if (undefinedCalls.length) violations.push({ path: rel, problem: `called, never defined: ${list(undefinedCalls)}` });
  if (twice.length) violations.push({ path: rel, problem: `defined twice: ${list(twice)}` });
}

const now = new Date().toISOString().slice(0, 10);
console.log(`# Footnote Audit — ${now}\n`);

if (violations.length === 0) {
  console.log("✅ Every footnote is called and defined once.\n");
  process.exit(0);
}

console.log(`## ❌ Violations (${violations.length})\n`);
console.log("Remove a note no sentence calls, define a note that is called, keep one definition per note.\n");
for (const { path, problem } of violations) {
  console.log(`- \`${path}\`: ${problem}`);
}
console.log();

process.exit(1);
