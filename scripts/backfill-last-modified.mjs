#!/usr/bin/env node
/**
 * backfill-last-modified.mjs
 *
 * For every vault .md file that lacks a `last_modified` frontmatter field,
 * fetches the date of the most recent git commit that touched that file and
 * injects `last_modified: YYYY-MM-DD` into the frontmatter.
 *
 * Usage:
 *   node scripts/backfill-last-modified.mjs            # dry-run (no writes)
 *   node scripts/backfill-last-modified.mjs --write    # apply changes
 *
 * Output: summary report to stdout.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const VAULT_ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const EXCLUDED_DIRS = new Set([
  '_private', 'build', 'node_modules', '.git', '.obsidian',
  '.agents', '.cursor', '_templates', 'scripts',
]);

const DRY_RUN = !process.argv.includes('--write');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function hasFrontmatterField(text, key) {
  // Match key inside the opening frontmatter block only
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return false;
  return new RegExp(`^${key}:`, 'm').test(fmMatch[1]);
}

function injectFrontmatterField(text, key, value) {
  // Insert the field just before the closing ---
  return text.replace(/^(---\r?\n[\s\S]*?)(\r?\n---)/m, `$1\n${key}: "${value}"$2`);
}

function getGitDate(filePath) {
  try {
    const rel = relative(VAULT_ROOT, filePath).replaceAll('\\', '/');
    const result = execSync(
      `git log --format="%ad" --date=short -1 -- "${rel}"`,
      { cwd: VAULT_ROOT, stdio: ['pipe', 'pipe', 'pipe'] }
    ).toString().trim();
    return result || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let skipped = 0;
let alreadyHas = 0;
let noGitDate = 0;
const updated = [];

for (const filePath of walkMd(VAULT_ROOT)) {
  let text;
  try {
    text = readFileSync(filePath, 'utf8');
  } catch {
    skipped++;
    continue;
  }

  // Skip files with no frontmatter at all
  if (!text.startsWith('---')) {
    skipped++;
    continue;
  }

  if (hasFrontmatterField(text, 'last_modified')) {
    alreadyHas++;
    continue;
  }

  const date = getGitDate(filePath);
  if (!date) {
    noGitDate++;
    continue;
  }

  const rel = relative(VAULT_ROOT, filePath).replaceAll('\\', '/');

  if (!DRY_RUN) {
    const newText = injectFrontmatterField(text, 'last_modified', date);
    writeFileSync(filePath, newText, 'utf8');
  }

  updated.push({ path: rel, date });
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const mode = DRY_RUN ? '(DRY RUN — no files written)' : '(WRITE mode)';
console.log(`\n# Backfill last_modified ${mode}\n`);
console.log(`- Already had \`last_modified\`: **${alreadyHas}** files`);
console.log(`- No frontmatter / skipped: **${skipped}** files`);
console.log(`- No git date found: **${noGitDate}** files`);
console.log(`- ${DRY_RUN ? 'Would update' : 'Updated'}: **${updated.length}** files\n`);

if (updated.length > 0) {
  console.log('| File | Date |');
  console.log('| :-- | :-- |');
  for (const { path, date } of updated) {
    console.log(`| \`${path}\` | ${date} |`);
  }
}

if (DRY_RUN && updated.length > 0) {
  console.log('\n> Re-run with `--write` to apply changes.');
}
