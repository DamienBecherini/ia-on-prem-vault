#!/usr/bin/env node
/**
 * backfill-verified.mjs
 *
 * Sets editorial verification frontmatter on vault pages:
 *   last_verified, verified_by, verified_hitl, verified_hitl_url
 *
 * Usage:
 *   node scripts/backfill-verified.mjs            # dry-run
 *   node scripts/backfill-verified.mjs --write    # apply
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { loadEditorialConfig } from './lib/site-config.mjs';

const VAULT_ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const EXCLUDED_DIRS = new Set([
  '_private', 'build', 'node_modules', '.git', '.obsidian',
  '.agents', '.cursor', '_templates', 'scripts',
]);

const DRY_RUN = !process.argv.includes('--write');

const { hitl, defaultAgent } = loadEditorialConfig();
const today = new Date().toISOString().slice(0, 10);

const VERIFICATION_FIELDS = {
  last_verified: today,
  verified_by: defaultAgent,
  verified_hitl: hitl.name,
  verified_hitl_url: hitl.url,
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
