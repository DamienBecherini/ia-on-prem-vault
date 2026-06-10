#!/usr/bin/env node
/**
 * audit-agent-leaks.mjs
 *
 * Detects agent-only section headings accidentally published in FR notes.
 *
 * Usage:
 *   node scripts/audit-agent-leaks.mjs
 *
 * npm script: audit:agent-leaks
 */
import { readFileSync } from "node:fs";
import {
  VAULT_ROOT,
  isExcludedRelPath,
  stripFencedCodeBlocks,
  toRelPath,
  walkMd,
} from "./lib/vault-walk.mjs";

const FORBIDDEN_HEADINGS = [
  /^#{1,6}\s+Lexique\s*-\s*actions\s*$/im,
  /^#{1,6}\s+Nouvelles fiches [àa] cr[ée]er\s*$/im,
  /^#{1,6}\s+Fiches [àa] v[ée]rifier\s*$/im,
];

/** @type {Array<{ path: string, line: number, text: string }>} */
const violations = [];

for (const filePath of walkMd(VAULT_ROOT, { locale: "fr" })) {
  const rel = toRelPath(filePath);
  if (isExcludedRelPath(rel)) continue;

  const text = stripFencedCodeBlocks(readFileSync(filePath, "utf8"));
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    for (const pattern of FORBIDDEN_HEADINGS) {
      if (pattern.test(line)) {
        violations.push({ path: rel, line: i + 1, text: line.trim() });
      }
    }
  }
}

const now = new Date().toISOString().slice(0, 10);
console.log(`# Agent Leak Audit — ${now}\n`);
console.log(`Vault root: \`${VAULT_ROOT}\` | Scope: FR published notes\n`);

if (violations.length === 0) {
  console.log("✅ No agent-only section headings detected.\n");
  process.exit(0);
}

console.log(`## ❌ Violations (${violations.length})\n`);
for (const { path, line, text } of violations) {
  console.log(`- \`${path}\` line ${line}: ${text}`);
}
console.log();

process.exit(1);
