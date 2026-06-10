#!/usr/bin/env node
/**
 * run-audits.mjs
 *
 * Runs the vault quality-check suite (deterministic, no LLM agent).
 *
 * Usage:
 *   node scripts/run-audits.mjs
 *
 * npm script: test
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptsDir = __dirname;

const AUDITS = [
  { name: "frontmatter", script: "audit-frontmatter.mjs" },
  { name: "mermaid", script: "audit-mermaid.mjs" },
  { name: "agent-leaks", script: "audit-agent-leaks.mjs" },
  { name: "i18n-strict", script: "audit-i18n.mjs", args: ["--stale-days=0"] },
];

/** @type {Array<{ name: string, status: number | null }>} */
const results = [];

console.log("Vault quality checks\n");

for (const audit of AUDITS) {
  console.log(`▶ ${audit.name}`);
  const scriptPath = join(scriptsDir, audit.script);
  const result = spawnSync(process.execPath, [scriptPath, ...(audit.args ?? [])], {
    stdio: "inherit",
  });
  results.push({ name: audit.name, status: result.status });
  console.log();
}

const failed = results.filter((r) => r.status !== 0);

console.log("---");
if (failed.length === 0) {
  console.log(`✅ All ${results.length} vault audits passed.`);
  process.exit(0);
}

console.log(`❌ ${failed.length}/${results.length} audit(s) failed:`);
for (const { name } of failed) console.log(`   - ${name}`);
process.exit(1);
