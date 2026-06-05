/**
 * Shared loader for vault site.config.json.
 * Used by maintenance scripts (backfill, audit, etc.).
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const VAULT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** @returns {Record<string, unknown>} */
export function loadSiteConfig(vaultRoot = VAULT_ROOT) {
  const configPath = join(vaultRoot, 'site.config.json');
  if (!existsSync(configPath)) {
    throw new Error(`site.config.json not found at ${configPath}`);
  }
  return JSON.parse(readFileSync(configPath, 'utf8'));
}

/**
 * Editorial defaults for verification frontmatter and agent skills.
 * @returns {{ hitl: { name: string, url: string }, defaultAgent: string }}
 */
export function loadEditorialConfig(vaultRoot = VAULT_ROOT) {
  const config = loadSiteConfig(vaultRoot);
  const editorial = config.editorial;
  if (!editorial?.hitl?.name || !editorial?.hitl?.url) {
    throw new Error(
      'site.config.json must define editorial.hitl.name and editorial.hitl.url'
    );
  }
  return {
    hitl: {
      name: editorial.hitl.name,
      url: editorial.hitl.url,
    },
    defaultAgent: editorial.defaultAgent ?? 'Sonnet 4.6',
  };
}
