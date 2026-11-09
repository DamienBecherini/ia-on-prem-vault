#!/usr/bin/env node
/**
 * audit-version-floors.mjs
 *
 * Fails when .agents/vault-maintenance/version-floors.json disagrees with the minimum
 * versions the guide recommends. The watch uses that file to drop advisories already
 * covered: a stale value brings handled advisories back as "urgent" (issue #69).
 *
 * Usage:
 *   node scripts/audit-version-floors.mjs           # check
 *   node scripts/audit-version-floors.mjs --write   # align the file on the pages
 *
 * npm script: audit:version-floors
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { VAULT_ROOT } from "./lib/vault-walk.mjs";

const WRITE = process.argv.includes("--write");
const FLOORS_FILE = ".agents/vault-maintenance/version-floors.json";
const CALLOUT_PAGE = "06-mise-en-oeuvre/local-inference-security.md";
const JAN_PAGE = "05-agents-et-assistants-on-prem/assistants-personnels/solutions/jan-ai.md";

const read = (rel) => readFileSync(join(VAULT_ROOT, rel), "utf8");

/** The line that follows the "Planchers de version" callout title. */
function calloutText() {
  const lines = read(CALLOUT_PAGE).split(/\r?\n/);
  const title = lines.findIndex((l) => /^>\s*\[!\w+\]\s*Planchers de version/.test(l));
  return title < 0 ? "" : (lines[title + 1] ?? "");
}

const VERSION = String.raw`(\d+(?:\.\d+)+)`;
const callout = calloutText();
const inCallout = (label) => callout.match(new RegExp(String.raw`(?:^>\s*|·\s*)${label} ≥ ${VERSION}`))?.[1];

/** Feed id of feeds.json → the minimum the guide states (with one per release line, the first and lowest). */
const SOURCES = {
  "adv-vllm": { where: CALLOUT_PAGE, value: () => inCallout("vLLM") },
  "adv-litellm": { where: CALLOUT_PAGE, value: () => inCallout("LiteLLM") },
  "adv-ollama": { where: CALLOUT_PAGE, value: () => inCallout("Ollama") },
  "adv-open-webui": { where: CALLOUT_PAGE, value: () => inCallout("Open WebUI") },
  "adv-jan": { where: JAN_PAGE, value: () => read(JAN_PAGE).match(new RegExp(String.raw`Installez au minimum la v${VERSION}`))?.[1] },
};

const raw = read(FLOORS_FILE);
const { floors } = JSON.parse(raw);
const errors = [];
const stale = [];

for (const feed of Object.keys(floors)) {
  if (!SOURCES[feed]) errors.push(`${feed}: no page is mapped to this floor in scripts/audit-version-floors.mjs`);
}
for (const [feed, { where, value }] of Object.entries(SOURCES)) {
  const stated = value();
  if (!stated) errors.push(`${feed}: minimum version not found in ${where}`);
  else if (floors[feed] !== stated) stale.push({ feed, where, stated, floor: floors[feed] });
}

if (WRITE && stale.length && !errors.length) {
  let text = raw;
  for (const { feed, stated, floor } of stale) {
    text = floor === undefined
      ? text.replace(/("floors":\s*\{\r?\n)/, `$1    "${feed}": "${stated}",\n`)
      : text.replace(`"${feed}": "${floor}"`, `"${feed}": "${stated}"`);
    console.log(`${feed}: ${floor ?? "(none)"} → ${stated}`);
  }
  text = text.replace(/"updated": "[^"]*"/, `"updated": "${new Date().toISOString().slice(0, 10)}"`);
  writeFileSync(join(VAULT_ROOT, FLOORS_FILE), text, "utf8");
  process.exit(0);
}

for (const { feed, where, stated, floor } of stale) {
  errors.push(`${feed}: ${FLOORS_FILE} has ${floor ?? "no floor"}, ${where} says ${stated}`);
}
if (errors.length) {
  console.error("❌ Version floors out of step with the guide:");
  for (const e of errors) console.error(`   ${e}`);
  console.error("   Align them with: node scripts/audit-version-floors.mjs --write");
  process.exit(1);
}
console.log(`✅ ${Object.keys(SOURCES).length} version floors match the guide.`);
