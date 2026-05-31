// @ts-check
/**
 * Delegates npm scripts to starlight-obsidian-engine (publish, deploy, upload).
 * Reads ENGINE_PATH from this vault's .env (see .env.example).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const vaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(vaultRoot, '.env');

if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
        if (!match || line.trimStart().startsWith('#')) continue;
        const key = match[1];
        const value = match[2].replace(/^["']|["']$/g, '').trim();
        if (process.env[key] === undefined) process.env[key] = value;
    }
}

const command = process.argv[2];
const allowed = new Set(['publish', 'deploy', 'upload', 'auth-install', 'auth-remove']);
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

const result = spawnSync(process.execPath, [engineScript, ...process.argv.slice(3)], {
    cwd: enginePath,
    stdio: 'inherit',
    env: process.env,
});

process.exit(result.status ?? 1);
