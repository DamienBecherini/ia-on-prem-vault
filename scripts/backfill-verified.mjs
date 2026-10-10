#!/usr/bin/env node
/**
 * backfill-verified.mjs
 *
 * Sets editorial verification frontmatter on vault pages:
 *   last_verified, verified_by, verified_hitl, verified_hitl_url
 *
 * Usage:
 *   node scripts/backfill-verified.mjs                                       # dry-run, whole vault
 *   node scripts/backfill-verified.mjs --write --paths=a.md,b.md             # stamp last_verified + verified_by on the listed pages
 *   node scripts/backfill-verified.mjs --write --paths=... --hitl-approved   # also stamp verified_hitl* (after explicit human sign-off)
 *   node scripts/backfill-verified.mjs --write --all --baseline              # deliberate whole-vault bulk stamp (a baseline, never a per-page audit)
 *
 * Guards (added 2026-10-10, after the 2026-06-05 bulk stamp turned out to be
 * indistinguishable from real per-page verifications):
 *   - --write without --paths requires --all --baseline
 *   - verified_hitl / verified_hitl_url are only written with --hitl-approved;
 *     the human sign-off is the PR merge, not this script
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { loadEditorialConfig } from './lib/site-config.mjs';

const VAULT_ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const EXCLUDED_DIRS = new Set([
  '_private', 'build', 'node_modules', '.git', '.obsidian',
  '.agents', '.cursor', '.claude', '_templates', 'scripts',
]);

const ARGS = process.argv.slice(2);
const DRY_RUN = !ARGS.includes('--write');
const HITL_APPROVED = ARGS.includes('--hitl-approved');
const ALL = ARGS.includes('--all');
const BASELINE = ARGS.includes('--baseline');
const PATHS_ARG = ARGS.find((a) => a.startsWith('--paths='));
const ONLY_PATHS = PATHS_ARG
  ? new Set(PATHS_ARG.slice('--paths='.length).split(',').map((p) => p.trim().split(String.fromCharCode(92)).join('/')).filter(Boolean))
  : null;

if (!DRY_RUN && !ONLY_PATHS && !(ALL && BASELINE)) {
  console.error('Refusing to write the whole vault: pass --paths=<a.md,b.md> for audited pages, or --all --baseline for a deliberate bulk stamp.');
  process.exit(2);
}

const { hitl, defaultAgent } = loadEditorialConfig();
const today = new Date().toISOString().slice(0, 10);

const VERIFICATION_FIELDS = {
  last_verified: today,
  verified_by: defaultAgent,
  ...(HITL_APPROVED ? { verified_hitl: hitl.name, verified_hitl_url: hitl.url } : {}),
};

function* walkMd(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) yield* walkMd(full);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      yield full;
    }
  }
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  return { body: match[1], closeIndex: match[0].length };
}

function upsertField(fmBody, key, value) {
  const line = `${key}: "${value}"`;
  const re = new RegExp(`^${key}:.*$`, 'm');
  if (re.test(fmBody)) {
    return fmBody.replace(re, line);
  }
  return `${fmBody}\n${line}`;
}

function applyVerificationFields(text) {
  const fm = parseFrontmatter(text);
  if (!fm) return null;

  let body = fm.body;
  for (const [key, value] of Object.entries(VERIFICATION_FIELDS)) {
    body = upsertField(body, key, value);
  }

  return text.replace(/^---\r?\n[\s\S]*?\r?\n---/, `---\n${body}\n---`);
}

let skipped = 0;
const updated = [];

for (const filePath of walkMd(VAULT_ROOT)) {
  let text;
  try {
    text = readFileSync(filePath, 'utf8');
  } catch {
    skipped++;
    continue;
  }

  if (!parseFrontmatter(text)) {
    skipped++;
    continue;
  }

  const newText = applyVerificationFields(text);
  if (!newText || newText === text) {
    skipped++;
    continue;
  }

  const rel = relative(VAULT_ROOT, filePath).replaceAll('\\', '/');
  if (ONLY_PATHS && !ONLY_PATHS.has(rel)) {
    skipped++;
    continue;
  }
  if (!DRY_RUN) {
    writeFileSync(filePath, newText, 'utf8');
  }
  updated.push(rel);
}

const mode = DRY_RUN ? '(DRY RUN)' : '(WRITE)';
console.log(`\n# Backfill verification metadata ${mode}\n`);
console.log(`- Skipped (no frontmatter): **${skipped}**`);
console.log(`- ${DRY_RUN ? 'Would update' : 'Updated'}: **${updated.length}** files\n`);

if (updated.length > 0 && updated.length <= 30) {
  for (const p of updated) console.log(`- \`${p}\``);
} else if (updated.length > 30) {
  for (const p of updated.slice(0, 10)) console.log(`- \`${p}\``);
  console.log(`- … and ${updated.length - 10} more`);
}

console.log('\nFields applied:');
for (const [k, v] of Object.entries(VERIFICATION_FIELDS)) {
  console.log(`- \`${k}\`: ${v}`);
}

if (DRY_RUN && updated.length > 0) {
  console.log('\n> Re-run with `--write` to apply changes.');
}
