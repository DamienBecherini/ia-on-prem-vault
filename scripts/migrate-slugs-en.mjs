// @ts-check
/** Migrate FR slugs to neutral EN slugs (content dirs only — skips build/dist). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const renames = [
  ['01-fondations/memory-bandwidth.md', '01-fondations/memory-bandwidth.md'],
  ['01-fondations/kv-cache-and-context.md', '01-fondations/kv-cache-and-context.md'],
  ['01-fondations/journey-of-a-prompt.md', '01-fondations/journey-of-a-prompt.md'],
  ['01-fondations/unified-memory-vs-ram-vs-vram.md', '01-fondations/unified-memory-vs-ram-vs-vram.md'],
  ['01-fondations/quantization-4bit-8bit.md', '01-fondations/quantization-4bit-8bit.md'],
  ['02-materiel/apu-and-unified-memory.md', '02-materiel/apu-and-unified-memory.md'],
  ['02-materiel/network-roce-infiniband-thunderbolt.md', '02-materiel/network-roce-infiniband-thunderbolt.md'],
  ['03-stack-logicielle/inference-engines-vllm-ollama.md', '03-stack-logicielle/inference-engines-vllm-ollama.md'],
  ['03-stack-logicielle/clustering-exo-and-ray.md', '03-stack-logicielle/clustering-exo-and-ray.md'],
  ['03-stack-logicielle/rag-and-agents.md', '03-stack-logicielle/rag-and-agents.md'],
  ['04-blueprints/scenario-a-dev-lab.md', '04-blueprints/scenario-a-dev-lab.md'],
  ['04-blueprints/scenario-b-sme-appliance.md', '04-blueprints/scenario-b-sme-appliance.md'],
  ['04-blueprints/scenario-c-desktop-cluster.md', '04-blueprints/scenario-c-desktop-cluster.md'],
  [
    '05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy.md',
    '05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy.md',
  ],
  [
    '05-agents-et-assistants-on-prem/fondations-communes/possible-architectures.md',
    '05-agents-et-assistants-on-prem/fondations-communes/possible-architectures.md',
  ],
  ['00-lexique/memory-bandwidth.md', '00-lexique/memory-bandwidth.md'],
  ['00-lexique/context-window.md', '00-lexique/context-window.md'],
  ['00-lexique/unified-memory.md', '00-lexique/unified-memory.md'],
  ['00-lexique/autonomous-agent.md', '00-lexique/autonomous-agent.md'],
  ['00-lexique/ai-glossary.md', '00-lexique/ai-glossary.md'],
  ['00-lexique/lexicon-index.md', '00-lexique/lexicon-index.md'],
  ['00-lexique/tokens-per-second.md', '00-lexique/tokens-per-second.md'],
];

/** @type {[string, string][]} longest first */
const replacements = [
  [
    '05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy',
    '05-agents-et-assistants-on-prem/fondations-communes/sovereignty-and-privacy',
  ],
  [
    '05-agents-et-assistants-on-prem/fondations-communes/possible-architectures',
    '05-agents-et-assistants-on-prem/fondations-communes/possible-architectures',
  ],
  ['01-fondations/unified-memory-vs-ram-vs-vram', '01-fondations/unified-memory-vs-ram-vs-vram'],
  ['01-fondations/memory-bandwidth', '01-fondations/memory-bandwidth'],
  ['01-fondations/quantization-4bit-8bit', '01-fondations/quantization-4bit-8bit'],
  ['01-fondations/kv-cache-and-context', '01-fondations/kv-cache-and-context'],
  ['01-fondations/journey-of-a-prompt', '01-fondations/journey-of-a-prompt'],
  ['02-materiel/apu-and-unified-memory', '02-materiel/apu-and-unified-memory'],
  ['02-materiel/network-roce-infiniband-thunderbolt', '02-materiel/network-roce-infiniband-thunderbolt'],
  ['03-stack-logicielle/inference-engines-vllm-ollama', '03-stack-logicielle/inference-engines-vllm-ollama'],
  ['03-stack-logicielle/clustering-exo-and-ray', '03-stack-logicielle/clustering-exo-and-ray'],
  ['03-stack-logicielle/rag-and-agents', '03-stack-logicielle/rag-and-agents'],
  ['04-blueprints/scenario-b-sme-appliance', '04-blueprints/scenario-b-sme-appliance'],
  ['04-blueprints/scenario-c-desktop-cluster', '04-blueprints/scenario-c-desktop-cluster'],
  ['04-blueprints/scenario-a-dev-lab', '04-blueprints/scenario-a-dev-lab'],
  ['00-lexique/memory-bandwidth', '00-lexique/memory-bandwidth'],
  ['00-lexique/context-window', '00-lexique/context-window'],
  ['00-lexique/tokens-per-second', '00-lexique/tokens-per-second'],
  ['00-lexique/autonomous-agent', '00-lexique/autonomous-agent'],
  ['00-lexique/unified-memory', '00-lexique/unified-memory'],
  ['00-lexique/lexicon-index', '00-lexique/lexicon-index'],
  ['00-lexique/ai-glossary', '00-lexique/ai-glossary'],
  ['ai-glossary.md', 'ai-glossary.md'],
  ['lexicon-index.md', 'lexicon-index.md'],
  ['"path": "ai-glossary"', '"path": "ai-glossary"'],
  ['"/00-lexique/ai-glossary/"', '"/00-lexique/ai-glossary/"'],
  ['"/00-lexique/lexicon-index/"', '"/00-lexique/lexicon-index/"'],
];

const SKIP_DIR_NAMES = new Set(['build', 'dist', 'node_modules', '.git']);

const scanRoots = [
  '00-index.md',
  'README.md',
  'site.config.json',
  '.deploy-manifest.json',
  '00-lexique',
  '01-fondations',
  '02-materiel',
  '03-stack-logicielle',
  '04-blueprints',
  '05-agents-et-assistants-on-prem',
  'en',
  'docs',
  '.agents',
  '_templates',
  '_private',
  'scripts',
];

const TEXT_EXT = new Set(['.md', '.json', '.mjs', '.mdc']);

/** @param {string} dir */
function collectFiles(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    if (TEXT_EXT.has(path.extname(dir))) out.push(dir);
    return out;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIR_NAMES.has(entry.name)) continue;
    out.push(...collectFiles(path.join(dir, entry.name)));
  }
  return out;
}

/** @param {string} filePath */
function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const [from, to] of replacements) {
    if (!content.includes(from)) continue;
    content = content.split(from).join(to);
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  patch: ${path.relative(root, filePath)}`);
  }
}

console.log('=== Step 1: patch references ===');
let patchCount = 0;
for (const rel of scanRoots) {
  const abs = path.join(root, rel);
  for (const file of collectFiles(abs)) {
    patchFile(file);
    patchCount++;
  }
}
console.log(`  scanned ${patchCount} file(s)`);

console.log('=== Step 2: rename files ===');
for (const [oldRel, newRel] of renames) {
  const oldPath = path.join(root, oldRel);
  const newPath = path.join(root, newRel);
  if (!fs.existsSync(oldPath)) {
    if (fs.existsSync(newPath)) {
      console.log(`  skip (done): ${newRel}`);
      continue;
    }
    throw new Error(`Missing: ${oldRel}`);
  }
  if (fs.existsSync(newPath)) throw new Error(`Target exists: ${newRel}`);
  fs.mkdirSync(path.dirname(newPath), { recursive: true });
  fs.renameSync(oldPath, newPath);
  console.log(`  ${oldRel} -> ${newRel}`);
}

console.log('=== Done ===');
