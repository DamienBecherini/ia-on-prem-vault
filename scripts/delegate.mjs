// @ts-check
/**
 * Delegates npm scripts to starlight-obsidian-engine (publish, deploy, upload).
 * Reads ENGINE_PATH from this vault's .env (see .env.example).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const vaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(vaultRoot, '.env');

if (fs.existsSync(envPath)) {
    const parsed = parseEnv(fs.readFileSync(envPath, 'utf-8'));
    for (const [key, value] of Object.entries(parsed)) {
        if (process.env[key] === undefined) process.env[key] = value;
    }
}

const command = process.argv[2];
const allowed = new Set([
    'publish',
    'deploy',
    'upload',
    'auth-install',
    'auth-remove',
    'audit-links',
]);
if (!command || !allowed.has(command)) {
    console.error(`❌ Usage: node scripts/delegate.mjs <${[...allowed].join('|')}>`);
    process.exit(1);
}

const enginePath = process.env.ENGINE_PATH?.trim()
    ? path.isAbsolute(process.env.ENGINE_PATH.trim())
        ? process.env.ENGINE_PATH.trim()
        : path.resolve(vaultRoot, process.env.ENGINE_PATH.trim())
    : path.resolve(vaultRoot, '../starlight-obsidian-engine');

const engineScript = path.join(enginePath, 'scripts', `${command}.mjs`);

if (!fs.existsSync(engineScript)) {
    console.error(`❌ Engine script not found: ${engineScript}`);
    console.error('   Set ENGINE_PATH in this vault\'s .env (see .env.example).');
    process.exit(1);
}

console.log(`↪ Delegating ${command} to ${enginePath}\n`);

const delegateEnv = command === 'audit-links'
    ? { ...process.env, VAULT_PATH: vaultRoot, FORCE_VAULT_PATH: '1' }
    : process.env;

const result = spawnSync(process.execPath, [engineScript, ...process.argv.slice(3)], {
    cwd: enginePath,
    stdio: 'inherit',
    env: delegateEnv,
});

process.exit(result.status ?? 1);
