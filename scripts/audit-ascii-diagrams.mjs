#!/usr/bin/env node
/**
 * audit-ascii-diagrams.mjs
 *
 * Flags ASCII box-drawing characters used outside fenced code blocks.
 * Default: warnings only. Use --strict to fail the run.
 *
 * Usage:
 *   node scripts/audit-ascii-diagrams.mjs
 *   node scripts/audit-ascii-diagrams.mjs --strict
 *
 * npm script: audit:ascii | audit:ascii:strict
 */
import { join } from "node:path";
import { readFileSync } from "node:fs";
import {
  VAULT_ROOT,
  isExcludedRelPath,
  loadSlugAllowlist,
  stripFencedCodeBlocks,
  toRelPath,
  walkMd,
} from "./lib/vault-walk.mjs";

const STRICT = process.argv.includes("--strict");

const BOX_CHAR_RE = /[┌┐└┘│├┤┬┴┼─]/;
const BOX_ASCII_RE = /\+[-=]{2,}\+/;

const ALLOWLIST_PATH = join(
  VAULT_ROOT,
  ".agents/vault-maintenance/ascii-diagram-allowlist.md",
);

const allowlist = loadSlugAllowlist(ALLOWLIST_PATH);

/** @type {Array<{ path: string, line: number, text: string }>} */
const findings = [];

for (const filePath of walkMd(VAULT_ROOT, { locale: "all" })) {
  const rel = toRelPath(filePath);
  if (isExcludedRelPath(rel)) continue;
  if (allowlist.has(rel)) continue;

  const prose = stripFencedCodeBlocks(readFileSync(filePath, "utf8"));
  const lines = prose.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (BOX_CHAR_RE.test(line) || BOX_ASCII_RE.test(line)) {
      findings.push({ path: rel, line: i + 1, text: line.trim() });
    }
  }
}

const now = new Date().toISOString().slice(0, 10);
console.log(`# ASCII Diagram Audit — ${now}\n`);
console.log(
  `Vault root: \`${VAULT_ROOT}\` | Mode: ${STRICT ? "**strict**" : "warn-only"}\n`,
);

if (findings.length === 0) {
  console.log("✅ No ASCII diagram characters detected outside code fences.\n");
  process.exit(0);
}

console.log(`## ⚠️ Findings (${findings.length})\n`);
for (const { path, line, text } of findings) {
  console.log(`- \`${path}\` line ${line}: ${text}`);
}
console.log();
console.log(
  "Allowlist: `.agents/vault-maintenance/ascii-diagram-allowlist.md`\n",
);

process.exit(STRICT && findings.length > 0 ? 1 : 0);
