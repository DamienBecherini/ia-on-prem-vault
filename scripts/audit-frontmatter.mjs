#!/usr/bin/env node
/**
 * audit-frontmatter.mjs
 *
 * Validates required frontmatter on published vault notes (FR + EN).
 *
 * Usage:
 *   node scripts/audit-frontmatter.mjs
 *
 * npm script: audit:frontmatter
 */
import { readFileSync } from "node:fs";
import {
  VAULT_ROOT,
  extractFrontmatterBlock,
  isExcludedRelPath,
  readFrontmatterScalar,
  toRelPath,
  walkMd,
} from "./lib/vault-walk.mjs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** @type {Array<{ path: string, issues: string[] }>} */
const violations = [];

for (const filePath of walkMd(VAULT_ROOT, { locale: "all" })) {
  const rel = toRelPath(filePath);
  if (isExcludedRelPath(rel)) continue;

  const text = readFileSync(filePath, "utf8");
  const fm = extractFrontmatterBlock(text);
  /** @type {string[]} */
  const issues = [];

  if (!fm) {
    issues.push("missing frontmatter block");
  } else {
    const title = readFrontmatterScalar(fm, "title");
    const description = readFrontmatterScalar(fm, "description");
    const lastModified = readFrontmatterScalar(fm, "last_modified");

    if (!title) issues.push("missing or empty `title`");
    if (!description) issues.push("missing or empty `description`");
    if (!lastModified) {
      issues.push("missing `last_modified`");
    } else if (!DATE_RE.test(lastModified)) {
      issues.push(`invalid \`last_modified\` format: ${lastModified}`);
    }
  }

  if (issues.length > 0) violations.push({ path: rel, issues });
}

const now = new Date().toISOString().slice(0, 10);
console.log(`# Frontmatter Audit — ${now}\n`);
console.log(`Vault root: \`${VAULT_ROOT}\`\n`);

if (violations.length === 0) {
  console.log("✅ All published notes have required frontmatter.\n");
  process.exit(0);
}

console.log(`## ❌ Violations (${violations.length})\n`);
for (const { path, issues } of violations) {
  console.log(`- \`${path}\``);
  for (const issue of issues) console.log(`  - ${issue}`);
  console.log();
}

process.exit(1);
