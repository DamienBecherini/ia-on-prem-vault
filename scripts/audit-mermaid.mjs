#!/usr/bin/env node
/**
 * audit-mermaid.mjs
 *
 * Lightweight syntax checks for ```mermaid fenced blocks in published notes.
 * Uses diagram-type validation (no npm dependency).
 *
 * Usage:
 *   node scripts/audit-mermaid.mjs
 *
 * npm script: audit:mermaid
 */
import { readFileSync } from "node:fs";
import {
  VAULT_ROOT,
  isExcludedRelPath,
  toRelPath,
  walkMd,
} from "./lib/vault-walk.mjs";

const MERMAID_BLOCK_RE = /```mermaid\s*\r?\n([\s\S]*?)```/g;

const VALID_DIAGRAM_PREFIXES = [
  "flowchart",
  "graph",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram-v2",
  "stateDiagram",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "quadrantChart",
  "requirementDiagram",
  "gitGraph",
  "mindmap",
  "timeline",
  "sankey-beta",
  "xychart-beta",
  "block-beta",
  "packet-beta",
  "kanban",
  "architecture-beta",
  "C4Context",
  "C4Container",
  "C4Component",
  "C4Dynamic",
  "C4Deployment",
];

/**
 * @param {string} body
 * @returns {string | null}
 */
function validateMermaidBody(body) {
  const trimmed = body.trim();
  if (!trimmed) return "empty Mermaid block";

  const firstLine = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith("%%"));

  if (!firstLine) return "Mermaid block has no diagram declaration";

  const normalized = firstLine.replace(/\s+/g, " ");
  const isValid = VALID_DIAGRAM_PREFIXES.some((prefix) => {
    if (prefix === "graph" || prefix === "flowchart") {
      return new RegExp(`^${prefix}\\s+(TD|TB|BT|RL|LR)`, "i").test(normalized);
    }
    return normalized.startsWith(prefix);
  });

  if (!isValid) {
    return `unrecognized diagram type on first line: ${firstLine}`;
  }

  const openSquare = (trimmed.match(/\[/g) ?? []).length;
  const closeSquare = (trimmed.match(/\]/g) ?? []).length;
  const openParen = (trimmed.match(/\(/g) ?? []).length;
  const closeParen = (trimmed.match(/\)/g) ?? []).length;
  const openBrace = (trimmed.match(/\{/g) ?? []).length;
  const closeBrace = (trimmed.match(/\}/g) ?? []).length;

  if (openSquare !== closeSquare) return "unbalanced `[` / `]` brackets";
  if (openParen !== closeParen) return "unbalanced `(` / `)` parentheses";
  if (openBrace !== closeBrace) return "unbalanced `{` / `}` braces";

  return null;
}

/** @type {Array<{ path: string, index: number, message: string }>} */
const violations = [];

for (const filePath of walkMd(VAULT_ROOT, { locale: "all" })) {
  const rel = toRelPath(filePath);
  if (isExcludedRelPath(rel)) continue;

  const text = readFileSync(filePath, "utf8");
  let match;
  let index = 0;
  MERMAID_BLOCK_RE.lastIndex = 0;

  while ((match = MERMAID_BLOCK_RE.exec(text)) !== null) {
    index += 1;
    const error = validateMermaidBody(match[1] ?? "");
    if (error) violations.push({ path: rel, index, message: error });
  }
}

const now = new Date().toISOString().slice(0, 10);
console.log(`# Mermaid Audit — ${now}\n`);
console.log(`Vault root: \`${VAULT_ROOT}\`\n`);

if (violations.length === 0) {
  console.log("✅ All Mermaid blocks passed lightweight syntax checks.\n");
  process.exit(0);
}

console.log(`## ❌ Violations (${violations.length})\n`);
for (const { path, index, message } of violations) {
  console.log(`- \`${path}\` — block #${index}: ${message}`);
}
console.log();

process.exit(1);
