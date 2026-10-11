#!/usr/bin/env node
/**
 * audit-readability.mjs
 *
 * Deterministic part (40 points out of 100) of the readability score of the
 * FR pages, for two reader profiles scored from the same measurements:
 *
 *   A  « dirigeant de PME non technique »  (decision-maker, no technical background)
 *   B  « développeur qui découvre l'IA locale »
 *
 * The other 60 points are judged by an agent with the rubric in
 * `.agents/vault-maintenance/readability/rubric.md`. Scores are agent-only data:
 * they never go into public pages. Warn-only tool, not part of `npm test`.
 *
 * Pages are judged for DIRECT ARRIVAL (the reader lands on the page from a
 * search engine): only the page's own text and its own links count.
 *
 * ---------------------------------------------------------------------------
 * Scope
 * ---------------------------------------------------------------------------
 * Published FR `.md` pages (vault-walk exclusions: _private, _templates,
 * .agents, docs, scripts, ...; plus `en/`, README.md, CLAUDE.md and the
 * generated lexicon index).
 *
 * Before measuring, the script strips: frontmatter, fenced code blocks
 * (Mermaid included), `$$` math blocks, footnote definitions and references,
 * the "Sources / Références" sections, HTML, images, emoji, inline code and
 * inline math. Wikilinks and Markdown links are replaced by their visible text
 * and their spans are kept, to know whether a term sits inside a link.
 *
 * ---------------------------------------------------------------------------
 * Measurements
 * ---------------------------------------------------------------------------
 * Technical terms
 *   - lexicon terms: the cleaned title of every `00-lexique/` entry tagged
 *     `lexique`, its aliases, and the acronym in parentheses in its title
 *     (e.g. `MLA (Multi-head Latent Attention)` gives `MLA`). GENERIC_FORMS
 *     are skipped: the bare word "Attention" (too common in French) and plain
 *     French aliases that explain themselves ("validation humaine", "mémoire
 *     vive"...). Plural `s` is accepted. Single-token forms with 2+ capitals
 *     (GGUF, vLLM) are case-sensitive, the others are not.
 *   - acronyms: /\b[A-Z][A-Z0-9]{1,}[a-z]?\b/ minus ALLOWED_ACRONYMS (IA, PME,
 *     UE, RGPD..., brand names such as NVIDIA or RTX), Roman numerals,
 *     single-letter product codes (H100, M3, V3) and all-caps French words.
 *     An acronym that is also a lexicon form is counted as that entry.
 *   Only the FIRST occurrence of each term is examined (an occurrence in a
 *   heading counts only when the heading explains it). The term is
 *   "explained" when that occurrence:
 *     1. sits inside a wikilink or Markdown link, or
 *     2. comes after a link to the same lexicon entry earlier in the page
 *        (for a free acronym: an earlier link to an entry whose title or alias
 *        contains it, e.g. "KV" after a link to "KV Cache"), or
 *     3. is followed right away by a parenthesis, or by « est un / une / le /
 *        la / des », « est fait pour », « sert à » (a definition), or
 *     4. is itself the whole content of a short parenthesis after a gloss
 *        ("mémoire vidéo (VRAM)"), or follows "appelé / nommé / baptisé", or
 *     5. is followed, in the same sentence and within 12 words, by « : »,
 *        « c'est », « soit », « c'est-à-dire », « désigne », « signifie »
 *        or « autrement dit ».
 *   On a lexicon page, the page's own entry (and the acronyms in its forms)
 *   is never counted. Unexplained terms are listed per page with their number
 *   of occurrences; DEV_KNOWN terms are flagged `devKnown`.
 *
 * Sentences    prose, list items and callouts (not tables, not headings),
 *              fragments under 3 words ignored: mean words per sentence,
 *              share of sentences over 30 words.
 * Paragraphs   prose blocks and list items over 120 words.
 * Introduction text before the first H2 (for a lexicon entry: its first
 *              section, the short definition): word count.
 * Blocks       tables, `$$` formulas and Mermaid diagrams, and how many are
 *              not introduced by a sentence (previous non-blank line is a
 *              heading, a rule, another block, or fewer than 3 words).
 * Lexicon      distinct lexicon entries linked, per 1 000 words.
 *
 * ---------------------------------------------------------------------------
 * Scoring (each sub-score in 0..1, then weighted to 40 points)
 * ---------------------------------------------------------------------------
 *   U  unexplained terms   1 / (1 + u / 5)
 *                          u = distinct unexplained terms. For profile B,
 *                          DEV_KNOWN terms (GPU, CPU, API, JSON...) weigh 0.
 *   S  sentences           0.5 * lin(mean words, 18 -> 1, 30 -> 0)
 *                        + 0.5 * lin(share > 30 words, 5 % -> 1, 30 % -> 0)
 *   P  paragraphs          1 - min(1, long paragraphs / 4)
 *   I  introduction        0 under 15 words, linear 15 -> 40 words, 1 from 40
 *                          to 250 words, 0.7 above 250 words
 *                          (lexicon entry: lin(short definition, 4 -> 0, 10 -> 1))
 *   T  introduced blocks   1 - not introduced / total (1 when no block)
 *   L  lexicon links       min(1, distinct lexicon links per 1 000 words / 3)
 *
 *   Weights        U    S    P    I    T    L    total
 *   Profile A     16    8    4    6    3    3    40
 *   Profile B     12    6    6    6    5    5    40
 *
 *   Page type and primary profile (see rubric.md): hub (00-index, folder index.md,
 *   ai-glossary) A; lexique A+B; blueprint A; guide (06-mise-en-oeuvre) B;
 *   article: 03-stack-logicielle and 05/.../solutions B, otherwise A.
 *
 *   Final score /100 = deterministic /40 + judged /60 (rubric). Alert
 *   threshold 60/100. With the script alone, < 24/40 (60 %) is an early warning.
 *
 * Usage:
 *   node scripts/audit-readability.mjs                       # summary + default JSON
 *   node scripts/audit-readability.mjs --paths=00-index.md,01-fondations/kv-cache-and-context.md
 *   node scripts/audit-readability.mjs --json=path/to/out.json
 *   node scripts/audit-readability.mjs --top=20              # rows in the worst-pages tables
 *
 * npm script: audit:readability
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  VAULT_ROOT,
  extractFrontmatterBlock,
  isExcludedRelPath,
  readFrontmatterScalar,
  toRelPath,
  walkMd,
} from "./lib/vault-walk.mjs";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const DEFAULT_JSON = ".agents/vault-maintenance/readability/deterministic.json";
const LEXICON_DIR = "00-lexique";

/** Acronyms a non-technical French reader knows. */
const ALLOWED_ACRONYMS = new Set([
  "IA", "AI", "PME", "ETI", "UE", "EU", "FR", "PC", "USB", "PDF", "TVA", "HT", "TTC", "RGPD",
  "CNIL", "OK", "FAQ", "EUR", "USD", "TV", "SMS", "RH", "DSI", "PDG", "CEO",
  // brands and product lines (names, not jargon to explain)
  "NVIDIA", "AMD", "IBM", "AWS", "HP", "HPE", "ASUS", "MSI", "MIT", "RTX", "GTX",
  "DGX", "HGX", "MSRP", "PRO", "MAX", "ULTRA", "US", "XL", "XT", "GPT", "LM",
]);

/** All-caps French words that are emphasis, not acronyms. */
const CAPS_WORDS = new Set([
  "TOUS", "TOUT", "TOUTE", "TOUTES", "PAS", "NON", "OUI", "SANS", "AVEC", "PLUS",
  "MOINS", "SEUL", "SEULE", "DOIT", "NE", "ET", "OU", "LE", "LA", "LES", "DES",
  "UN", "UNE", "JAMAIS", "TOUJOURS", "NOTE", "TODO", "ALERTE", "AVANT", "APRES",
]);

/** Terms a developer new to local AI already knows: weight 0 for profile B. */
const DEV_KNOWN = new Set([
  "API", "CPU", "GPU", "RAM", "OS", "CLI", "SDK", "HTTP", "HTTPS", "JSON", "YAML",
  "URL", "SSH", "REST", "SQL", "TCP", "IP", "DNS", "TLS", "SSL", "LAN", "VPN",
  "IDE", "CI", "CD", "PR", "UI", "UX", "HTML", "CSS", "JS", "TS", "SSD", "NVME",
  "NVMe", "BIOS", "LTS", "WSL", "CORS", "JWT", "CSV", "XML", "RPC", "GPUs", "CPUs",
  "MCP", "LLM", "LLMs", "GB", "TB", "MB", "KB", "SaaS", "CRUD", "OOM", "UTC",
]);

/** Weights per profile (sum = 40). */
const WEIGHTS = {
  A: { U: 16, S: 8, P: 4, I: 6, T: 3, L: 3 },
  B: { U: 12, S: 6, P: 6, I: 6, T: 5, L: 5 },
};

/**
 * Lexicon forms skipped: bare common French words, and plain French aliases
 * that are already self-explanatory (they explain the term, they are not jargon).
 */
const GENERIC_FORMS = new Set([
  "attention", "validation humaine", "humain dans la boucle", "mémoire vive", "mémoire vidéo",
  "agent de maintenance", "agent mainteneur", "politique zéro rétention", "arbre de mémoire",
  "contrôle de flux par priorité", "ia locale", "taille de contexte", "mécanisme d'attention",
  "injection de prompt", "base vectorielle", "attention clairsemée",
]);

const EXPLAIN_AFTER_RE =
  /(?:\s:\s|\s:$|^\s*:|\bc['’]est(?:-à-dire)?\b|\bsoit\b|\bdésigne\b|\bsignifie\b|\bautrement dit\b)/iu;
/** "Ollama est un outil…", "Les embeddings sont des vecteurs…": a definition right after the term. */
const DEFINES_RE =
  /^[s»"’']?\s+(?:(?:est|sont)\s+(?:un|une|le|la|l['’]|des|les)\b|(?:est|sont)\s+(?:fait|conçu)e?s?\s+pour\b|sert\s+à\b|servent\s+à\b)/iu;
const NAMED_BEFORE_RE = /\b(?:appel(?:é|ée|és|ées|le|lent)|nomm(?:é|ée|és|ées)|baptis(?:é|ée)|dit|dite)\s*$/iu;
const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'’\-]*/gu;
const ACRONYM_RE = /(?<![\p{L}\p{N}_\-])[A-Z][A-Z0-9]{1,}[a-z]?(?![\p{L}\p{N}_])/gu;

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
/** @param {string} name */
function argValue(name) {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
}
const jsonPath = join(VAULT_ROOT, argValue("json") ?? DEFAULT_JSON);
const onlyPaths = (argValue("paths") ?? "")
  .split(",")
  .map((p) => p.trim().replaceAll("\\", "/"))
  .filter(Boolean);
const TOP = Number.parseInt(argValue("top") ?? "15", 10);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** @param {number} x @param {number} good @param {number} bad */
function lin(x, good, bad) {
  if (good < bad) return x <= good ? 1 : x >= bad ? 0 : (bad - x) / (bad - good);
  return x >= good ? 1 : x <= bad ? 0 : (x - bad) / (good - bad);
}
/** @param {string} s */
const countWords = (s) => (s.match(WORD_RE) ?? []).length;
/** @param {string} s */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** @param {number} n */
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

/**
 * Read a YAML list (`key:` followed by `  - item` lines) from a frontmatter block.
 * @param {string | null} fm @param {string} key
 */
function readFrontmatterList(fm, key) {
  if (!fm) return [];
  /** @type {string[]} */
  const out = [];
  let inList = false;
  for (const line of fm.split(/\r?\n/)) {
    if (new RegExp(`^${key}:\\s*$`).test(line)) {
      inList = true;
      continue;
    }
    if (inList) {
      const m = line.match(/^\s+-\s+(.*)$/);
      if (m) out.push(m[1].trim().replace(/^["']|["']$/g, ""));
      else if (line.trim()) inList = false;
    }
  }
  return out;
}

/**
 * Full-line scalar (readFrontmatterScalar stops at the first space of an unquoted value).
 * @param {string | null} fm @param {string} key
 */
function readFullScalar(fm, key) {
  const m = fm?.match(new RegExp(`^${key}:[ \\t]*(.+)$`, "m"));
  if (!m) return null;
  const v = m[1].trim().replace(/^"(.*)"$|^'(.*)'$/, (_, a, b) => a ?? b);
  return v || null;
}

/** Remove emoji and quotes from a title. @param {string} title */
function cleanTitle(title) {
  return title
    .replace(/^["']|["']$/g, "")
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "")
    .trim();
}

/** Lexicon slug from a link target ("00-lexique/kv-cache#x", "/00-lexique/kv-cache/"). @param {string} target */
function slugFromTarget(target) {
  const clean = target.split("#")[0].replace(/\.md$/, "").replace(/\/$/, "");
  return clean.split("/").pop() ?? "";
}

// ---------------------------------------------------------------------------
// Lexicon
// ---------------------------------------------------------------------------

/**
 * @typedef {{ slug: string, title: string, forms: string[] }} LexEntry
 */

/** @returns {Map<string, LexEntry>} */
function loadLexicon() {
  /** @type {Map<string, LexEntry>} */
  const entries = new Map();
  for (const file of walkMd(join(VAULT_ROOT, LEXICON_DIR), { locale: "fr" })) {
    const rel = toRelPath(file);
    if (isExcludedRelPath(rel)) continue;
    const fm = extractFrontmatterBlock(readFileSync(file, "utf8"));
    if (!readFrontmatterList(fm, "tags").includes("lexique")) continue;
    const title = cleanTitle(readFullScalar(fm, "title") ?? "");
    const slug = slugFromTarget(rel);
    /** @type {Set<string>} */
    const forms = new Set();
    const paren = title.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (paren) {
      forms.add(paren[1].trim());
      // "(ZDR)" / "(Multi-head Latent Attention)" are forms; "(LLM)" / "(mécanisme)" qualify the title
      const inner = paren[2].trim();
      const head = paren[1].trim();
      const isQualifier = /^[a-zé]/.test(inner) || (/^[A-Z0-9]+$/.test(inner) && !initialsMatch(head, inner));
      if (!isQualifier) forms.add(inner);
    } else {
      forms.add(title);
    }
    for (const alias of readFrontmatterList(fm, "aliases")) forms.add(alias);
    const kept = [...forms].filter((f) => f.length >= 2 && !GENERIC_FORMS.has(f.toLowerCase()));
    entries.set(slug, { slug, title, forms: kept });
  }
  return entries;
}

/** "Zero Data Retention" ~ "ZDR". @param {string} words @param {string} acronym */
function initialsMatch(words, acronym) {
  const initials = words
    .split(/[\s\-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join("");
  return initials === acronym;
}

/**
 * Build one regex per form; forms with 2+ capitals are case-sensitive.
 * @param {Map<string, LexEntry>} lexicon
 */
function buildFormMatchers(lexicon) {
  /** @type {Array<{ slug: string, form: string, re: RegExp }>} */
  const matchers = [];
  /** @type {Map<string, string>} acronym -> slug */
  const acronymOwner = new Map();
  for (const entry of lexicon.values()) {
    for (const form of entry.forms) {
      const caps = (form.match(/\p{Lu}/gu) ?? []).length;
      // single-token forms with 2+ capitals (GGUF, vLLM, RAM) are case-sensitive; "KV Cache" also matches "KV cache"
      const flags = caps >= 2 && !/\s/.test(form) ? "gu" : "giu";
      const body = escapeRe(form).replace(/\\-|\s+/g, (m) => (m === "\\-" ? "[-\\s]?" : "\\s+"));
      const re = new RegExp(`(?<![\\p{L}\\p{N}_\\-])${body}s?(?![\\p{L}\\p{N}_])`, flags);
      matchers.push({ slug: entry.slug, form, re });
      if (/^[A-Z][A-Z0-9]+[a-z]?$/.test(form) && !acronymOwner.has(form)) acronymOwner.set(form, entry.slug);
    }
  }
  // longest forms first so "Attention linéaire" wins over shorter overlaps
  matchers.sort((a, b) => b.form.length - a.form.length);
  return { matchers, acronymOwner };
}

// ---------------------------------------------------------------------------
// Text preparation
// ---------------------------------------------------------------------------

/**
 * @typedef {{ start: number, end: number, target: string }} LinkSpan
 */

/**
 * Structural pass on the raw body: tables / formulas / diagrams and whether
 * the line before each one is an introducing sentence.
 * @param {string[]} lines
 */
function analyseBlocks(lines) {
  let tables = 0;
  let formulas = 0;
  let diagrams = 0;
  let unintroduced = 0;
  /** @type {string[]} */
  const unintroducedAt = [];
  let inFence = false;
  let fenceIsMermaid = false;
  let inMath = false;
  let prevContent = "";
  let lastHeading = "(début)";

  /** @param {string} kind */
  const check = (kind) => {
    const prev = prevContent.replace(/^>\s?/, "").trim();
    const ok =
      prev !== "" &&
      !/^#{1,6}\s/.test(prev) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(prev) &&
      !prev.startsWith("|") &&
      !prev.startsWith("```") &&
      !prev.startsWith("~~~") &&
      !prev.startsWith("$$") &&
      !/^\[!\w+\]/.test(prev) &&
      countWords(prev.replace(/\[\[[^\]]*\]\]|\[\^[^\]]+\]/g, "x")) >= 3;
    if (!ok) {
      unintroduced += 1;
      unintroducedAt.push(`${kind} sous « ${lastHeading} »`);
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (inFence) {
      if (/^(```|~~~)/.test(t)) {
        inFence = false;
        prevContent = "```";
      }
      continue;
    }
    if (inMath) {
      if (t.endsWith("$$")) {
        inMath = false;
        prevContent = "$$";
      }
      continue;
    }
    if (/^(```|~~~)/.test(t)) {
      inFence = true;
      fenceIsMermaid = /^(```|~~~)\s*mermaid/.test(t);
      if (fenceIsMermaid) {
        diagrams += 1;
        check("diagramme");
      }
      continue;
    }
    if (t.startsWith("$$")) {
      formulas += 1;
      check("formule");
      if (!(t.length > 2 && t.endsWith("$$") && t !== "$$")) inMath = true;
      else prevContent = "$$";
      continue;
    }
    const bare = t.replace(/^>\s?/, "");
    if (bare.startsWith("|")) {
      if (!prevContent.replace(/^>\s?/, "").trim().startsWith("|")) {
        tables += 1;
        check("tableau");
      }
      prevContent = bare;
      continue;
    }
    const heading = t.match(/^#{1,6}\s+(.*)$/);
    if (heading) lastHeading = cleanTitle(heading[1]).slice(0, 60);
    if (t !== "" && t !== ">") prevContent = t;
  }
  return { tables, formulas, diagrams, unintroduced, unintroducedAt };
}

/**
 * Strip everything that is not reader-facing prose, keep link spans.
 * @param {string} body
 * @param {Map<string, string>} titleBySlug
 */
function prepareText(body, titleBySlug) {
  let s = body.replace(/\r\n/g, "\n");
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/^(\s*)(```|~~~)[\s\S]*?^\s*\2[^\n]*$/gm, "");
  s = s.replace(/^\s*\$\$[\s\S]*?\$\$\s*$/gm, "");
  // footnote definitions (+ indented continuation lines), then references
  s = s.replace(/^\[\^[^\]]+\]:.*(?:\n(?: {2,}|\t).*)*/gm, "");
  s = s.replace(/\[\^[^\]]+\]/g, "");
  // "Sources / Références" sections up to the next H1/H2
  s = s.replace(/^#{1,3}\s+[^\p{L}\n]*(?:Sources|Références|References)\b[^\n]*\n[\s\S]*?(?=^#{1,2}\s|$(?![\s\S]))/gimu, "");
  s = s.replace(/!\[\[[^\]]*\]\]/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "");
  s = s.replace(/<\/?[A-Za-z][^>\n]*>/g, " ");
  s = s.replace(/`[^`\n]+`/g, "code");
  s = s.replace(/\$[^$\n]+\$/g, "formule");
  s = s.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, " ");
  s = s.replace(/^>\s?\[![\w-]+\][+-]?\s*/gm, "");
  s = s.replace(/^>\s?/gm, "");
  s = s.replace(/\*\*|~~|(?<![\p{L}\p{N}])\*|\*(?![\p{L}\p{N}])/gu, "");
  s = s.replace(/(?<![\]\)])\bhttps?:\/\/\S+/g, "");

  /** @type {LinkSpan[]} */
  const links = [];
  let out = "";
  let last = 0;
  const linkRe = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]|\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (const m of s.matchAll(linkRe)) {
    out += s.slice(last, m.index);
    const target = m[1] ?? m[4] ?? "";
    let text = m[2] ?? m[3];
    if (!text) {
      const slug = slugFromTarget(target);
      text = cleanTitle(titleBySlug.get(slug) ?? slug);
    }
    text = text.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "").trim();
    links.push({ start: out.length, end: out.length + text.length, target });
    out += text;
    last = (m.index ?? 0) + m[0].length;
  }
  out += s.slice(last);
  return { text: out, links };
}

// ---------------------------------------------------------------------------
// Measurements
// ---------------------------------------------------------------------------

/**
 * @param {string} text
 */
function headingRanges(text) {
  /** @type {Array<[number, number]>} */
  const ranges = [];
  for (const m of text.matchAll(/^#{1,6}\s[^\n]*$/gm)) ranges.push([m.index ?? 0, (m.index ?? 0) + m[0].length]);
  return ranges;
}

/**
 * Sentence that contains position `pos`: from the previous boundary to the next one.
 * @param {string} text @param {number} pos
 */
function sentenceAround(text, pos) {
  const before = text.slice(Math.max(0, pos - 400), pos);
  const startCut = Math.max(before.search(/[.!?…|\n][^.!?…|\n]*$/u), -1);
  const start = startCut === -1 ? Math.max(0, pos - 400) : pos - before.length + startCut + 1;
  const after = text.slice(pos);
  const endRel = after.search(/[.!?…](?=\s|$)|[|\n]/u);
  const end = endRel === -1 ? text.length : pos + endRel;
  return { start, end };
}

/**
 * @param {string} text @param {number} start @param {number} end
 * @param {LinkSpan[]} links @param {Set<string>} earlierSlugs slugs linked before `start`
 * @param {string | null} slug lexicon entry of the term (null for a free acronym)
 * @param {Map<string, LexEntry>} lexicon
 */
function isExplained(text, start, end, links, earlierSlugs, slug, lexicon) {
  if (links.some((l) => start >= l.start && end <= l.end)) return "lien";
  if (slug && earlierSlugs.has(slug)) return "lien plus haut";
  const term = text.slice(start, end);
  for (const s of earlierSlugs) {
    const entry = lexicon.get(s);
    if (!entry) continue;
    if (entry.forms.includes(term)) return "lien plus haut";
    // an acronym is explained by an earlier link to an entry that has it as a word ("KV" after "KV Cache")
    if (!slug && entry.forms.some((f) => f.split(/[\s\-/()]+/).includes(term.replace(/s$/, "")))) return "lien plus haut";
  }
  const tail = text.slice(end, end + 6);
  if (/^[s»"’']?\s?\(/u.test(tail)) return "parenthèse";
  if (DEFINES_RE.test(text.slice(end, end + 20))) return "définition";
  const pre = text.slice(Math.max(0, start - 80), start);
  const parenOpen = pre.lastIndexOf("(");
  if (parenOpen !== -1 && !pre.slice(parenOpen).includes(")")) {
    const close = text.indexOf(")", end);
    if (close !== -1 && close - start < 80 && countWords(text.slice(start, close)) <= 6 && pre.slice(0, parenOpen).trim().length > 0)
      return "glose avant";
  }
  if (NAMED_BEFORE_RE.test(pre.replace(/\s*(?:le|la|les|l['’]|un|une)\s*$/iu, " ").trimEnd() + " ") || NAMED_BEFORE_RE.test(pre.trimEnd()))
    return "glose avant";
  const { end: sEnd } = sentenceAround(text, start);
  const rest = text.slice(end, sEnd);
  const window = (rest.match(/^\s*(?:\S+\s*){0,12}/u) ?? [""])[0];
  if (EXPLAIN_AFTER_RE.test(window) || /^\s*:/.test(rest)) return "définition";
  return null;
}

/**
 * @param {string} text
 * @param {LinkSpan[]} links
 * @param {Map<string, LexEntry>} lexicon
 * @param {ReturnType<typeof buildFormMatchers>} formMatchers
 * @param {string | null} selfSlug
 */
function findTerms(text, links, lexicon, formMatchers, selfSlug) {
  const headings = headingRanges(text);
  const selfForms = selfSlug ? (lexicon.get(selfSlug)?.forms ?? []) : [];
  /** @param {number} p */
  const inHeading = (p) => headings.some(([a, b]) => p >= a && p < b);

  /** @type {Array<{ start: number, end: number, key: string, slug: string | null, kind: 'lexique' | 'acronyme', surface: string, heading: boolean }>} */
  const hits = [];
  /** @type {Array<[number, number]>} */
  const taken = [];
  const overlaps = (/** @type {number} */ a, /** @type {number} */ b) => taken.some(([x, y]) => a < y && b > x);

  for (const { slug, re } of formMatchers.matchers) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) {
      const a = m.index ?? 0;
      const b = a + m[0].length;
      if (overlaps(a, b)) continue;
      taken.push([a, b]);
      if (slug === selfSlug) continue;
      hits.push({ start: a, end: b, key: `lex:${slug}`, slug, kind: "lexique", surface: m[0], heading: inHeading(a) });
    }
  }
  for (const m of text.matchAll(ACRONYM_RE)) {
    const a = m.index ?? 0;
    const word = m[0];
    const b = a + word.length;
    if (overlaps(a, b)) continue;
    const base = word.replace(/s$/, "");
    if (ALLOWED_ACRONYMS.has(word) || ALLOWED_ACRONYMS.has(base)) continue;
    if (/^[IVXL]+$/.test(word)) continue;
    if (/^[A-Z]\d+[A-Za-z]?$/.test(word)) continue; // H100, M3, V3, K2
    if (CAPS_WORDS.has(word) || CAPS_WORDS.has(base) || (/^[A-ZÀ-Ý]+$/.test(word) && word.length >= 7)) continue;
    const owner = formMatchers.acronymOwner.get(word) ?? formMatchers.acronymOwner.get(base) ?? null;
    if (owner && owner === selfSlug) continue;
    if (selfForms.some((f) => f.split(/[\s\-/()]+/).includes(base))) continue; // "KV" on the KV Cache entry
    hits.push({
      start: a,
      end: b,
      key: owner ? `lex:${owner}` : `acr:${base}`,
      slug: owner,
      kind: owner ? "lexique" : "acronyme",
      surface: word,
      heading: inHeading(a),
    });
  }
  hits.sort((x, y) => x.start - y.start);

  /** @type {Map<string, { term: string, kind: string, entry: string | null, occurrences: number, explained: string | null, context: string }>} */
  const terms = new Map();
  for (const h of hits) {
    const known = terms.get(h.key);
    if (known) {
      known.occurrences += 1;
      continue;
    }
    const earlierSlugs = new Set(
      links.filter((l) => l.end <= h.start && l.target.includes(LEXICON_DIR + "/")).map((l) => slugFromTarget(l.target)),
    );
    const explained = isExplained(text, h.start, h.end, links, earlierSlugs, h.slug, lexicon);
    // a heading counts only when it explains the term ("Le piège de l'OOM (Out Of Memory)")
    if (h.heading && !explained) continue;
    const { start: cs, end: ce } = sentenceAround(text, h.start);
    const context = text.slice(Math.max(cs, h.start - 60), Math.min(ce, h.end + 60)).replace(/\s+/g, " ").trim();
    terms.set(h.key, {
      term: h.kind === "lexique" && h.slug ? h.surface : h.surface.replace(/s$/, ""),
      kind: h.kind,
      entry: h.slug,
      occurrences: 1,
      explained,
      context,
    });
  }
  return [...terms.values()];
}

/**
 * @param {string} text
 */
function proseStats(text) {
  const blocks = text.split(/\n\s*\n/);
  /** @type {number[]} */
  const sentenceLengths = [];
  let paragraphs = 0;
  let longParagraphs = 0;
  /** @type {string[]} */
  const longParagraphStarts = [];
  for (const block of blocks) {
    const lines = block.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) continue;
    /** @type {string[]} */
    const units = [];
    let current = "";
    for (const line of lines) {
      const t = line.trim();
      if (/^#{1,6}\s/.test(t) || t.startsWith("|") || /^(-{3,}|\*{3,}|_{3,})$/.test(t)) {
        if (current) units.push(current);
        current = "";
        continue;
      }
      if (/^([-*+]|\d+[.)])\s+/.test(t)) {
        if (current) units.push(current);
        current = t.replace(/^([-*+]|\d+[.)])\s+/, "");
      } else {
        current = current ? `${current} ${t}` : t;
      }
    }
    if (current) units.push(current);
    for (const unit of units) {
      const w = countWords(unit);
      if (w === 0) continue;
      paragraphs += 1;
      if (w > 120) {
        longParagraphs += 1;
        longParagraphStarts.push(unit.slice(0, 70));
      }
      for (const sentence of unit.split(/(?<=[.!?…])\s+(?=[«"“(\p{Lu}\d])/u)) {
        const n = countWords(sentence);
        if (n >= 3) sentenceLengths.push(n);
      }
    }
  }
  const count = sentenceLengths.length;
  const mean = count ? sentenceLengths.reduce((a, b) => a + b, 0) / count : 0;
  const longShare = count ? sentenceLengths.filter((n) => n > 30).length / count : 0;
  return { sentences: count, meanSentenceWords: mean, longSentenceShare: longShare, paragraphs, longParagraphs, longParagraphStarts };
}

// ---------------------------------------------------------------------------
// Page types
// ---------------------------------------------------------------------------

/** @param {string} rel @returns {{ type: string, primary: string }} */
function pageType(rel) {
  if (rel === "00-index.md" || /(^|\/)index\.md$/.test(rel) || rel === "00-lexique/ai-glossary.md")
    return { type: "hub", primary: "A" };
  if (rel.startsWith("00-lexique/")) return { type: "lexique", primary: "A+B" };
  if (rel.startsWith("04-blueprints/")) return { type: "blueprint", primary: "A" };
  if (rel.startsWith("06-mise-en-oeuvre/")) return { type: "guide", primary: "B" };
  if (rel.startsWith("03-stack-logicielle/")) return { type: "article", primary: "B" };
  if (/^05-agents-et-assistants-on-prem\/.*\/solutions\//.test(rel)) return { type: "article", primary: "B" };
  return { type: "article", primary: "A" };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const lexicon = loadLexicon();
const formMatchers = buildFormMatchers(lexicon);
/** @type {Map<string, string>} */
const titleBySlug = new Map();
for (const file of walkMd(VAULT_ROOT, { locale: "fr" })) {
  const fm = extractFrontmatterBlock(readFileSync(file, "utf8"));
  const title = readFullScalar(fm, "title");
  if (title) titleBySlug.set(slugFromTarget(toRelPath(file)), title);
}

/** @type {any[]} */
const pages = [];
for (const file of walkMd(VAULT_ROOT, { locale: "fr" })) {
  const rel = toRelPath(file);
  if (isExcludedRelPath(rel)) continue;
  if (onlyPaths.length && !onlyPaths.includes(rel)) continue;

  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const fm = extractFrontmatterBlock(raw);
  const body = fm === null ? raw : raw.slice(raw.indexOf("\n---", 4) + 4);
  const { type, primary } = pageType(rel);
  const selfSlug = type === "lexique" ? slugFromTarget(rel) : null;

  const blocks = analyseBlocks(body.split("\n"));
  const { text, links } = prepareText(body, titleBySlug);

  // Introduction: before the first H2; for a lexicon entry, its first section.
  let introText;
  if (type === "lexique") {
    const first = text.match(/^##\s[^\n]*\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/m);
    introText = first ? first[1] : "";
  } else {
    const h2 = text.search(/^##\s/m);
    introText = (h2 === -1 ? text : text.slice(0, h2)).replace(/^#\s[^\n]*$/gm, "");
  }
  const introWords = countWords(introText);

  const prose = proseStats(text);
  const words = countWords(text.replace(/^#{1,6}\s[^\n]*$/gm, ""));
  const terms = findTerms(text, links, lexicon, formMatchers, selfSlug);
  const unexplained = terms.filter((t) => !t.explained).sort((a, b) => b.occurrences - a.occurrences);
  const uAll = unexplained.length;
  const uDev = unexplained.filter((t) => !DEV_KNOWN.has(t.term) && !DEV_KNOWN.has(t.term.toUpperCase())).length;
  const lexiconLinked = new Set(
    links
      .filter((l) => l.target.includes(LEXICON_DIR + "/") || lexicon.has(slugFromTarget(l.target)))
      .map((l) => slugFromTarget(l.target))
      .filter((s) => lexicon.has(s) && s !== selfSlug),
  );
  const lexMentioned = terms.filter((t) => t.kind === "lexique").length;
  const linksPerK = words ? (lexiconLinked.size * 1000) / words : 0;
  const blockTotal = blocks.tables + blocks.formulas + blocks.diagrams;

  const sub = {
    U_A: 1 / (1 + uAll / 5),
    U_B: 1 / (1 + uDev / 5),
    S: 0.5 * lin(prose.meanSentenceWords, 18, 30) + 0.5 * lin(prose.longSentenceShare, 0.05, 0.3),
    P: 1 - Math.min(1, prose.longParagraphs / 4),
    I:
      type === "lexique"
        ? lin(introWords, 10, 4)
        : introWords < 15 ? 0 : introWords < 40 ? (introWords - 15) / 25 : introWords <= 250 ? 1 : 0.7,
    T: blockTotal === 0 ? 1 : 1 - blocks.unintroduced / blockTotal,
    L: Math.min(1, linksPerK / 3),
  };
  /** @param {'A' | 'B'} p */
  const score = (p) => {
    const w = WEIGHTS[p];
    return (
      w.U * (p === "A" ? sub.U_A : sub.U_B) + w.S * sub.S + w.P * sub.P + w.I * sub.I + w.T * sub.T + w.L * sub.L
    );
  };

  pages.push({
    path: rel,
    type,
    primaryProfile: primary,
    lastModified: readFrontmatterScalar(fm, "last_modified"),
    words,
    metrics: {
      sentences: prose.sentences,
      meanSentenceWords: round(prose.meanSentenceWords, 1),
      longSentenceShare: round(prose.longSentenceShare),
      paragraphs: prose.paragraphs,
      longParagraphs: prose.longParagraphs,
      introWords,
      tables: blocks.tables,
      formulas: blocks.formulas,
      diagrams: blocks.diagrams,
      unintroducedBlocks: blocks.unintroduced,
      lexiconEntriesLinked: lexiconLinked.size,
      lexiconLinksPerKWords: round(linksPerK, 1),
      lexiconTermsMentioned: lexMentioned,
      technicalTerms: terms.length,
      unexplainedTerms: uAll,
      unexplainedTermsDev: uDev,
    },
    unexplainedTerms: unexplained.map((t) => ({
      term: t.term,
      kind: t.kind,
      entry: t.entry,
      occurrences: t.occurrences,
      devKnown: DEV_KNOWN.has(t.term) || DEV_KNOWN.has(t.term.toUpperCase()),
      context: t.context,
    })),
    longParagraphs: prose.longParagraphStarts,
    unintroducedBlocks: blocks.unintroducedAt,
    subScores: Object.fromEntries(Object.entries(sub).map(([k, v]) => [k, round(v)])),
    deterministic: { A: round(score("A"), 1), B: round(score("B"), 1) },
  });
}

pages.sort((a, b) => a.path.localeCompare(b.path));
const today = new Date().toISOString().slice(0, 10);
mkdirSync(dirname(jsonPath), { recursive: true });
writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      generated: today,
      scale: "deterministic part, /40 per profile (judged part /60: see rubric.md)",
      weights: WEIGHTS,
      earlyWarningBelow: 24,
      pages,
    },
    null,
    2,
  ) + "\n",
);

// ---------------------------------------------------------------------------
// Markdown summary
// ---------------------------------------------------------------------------

/** @param {number[]} xs */
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
/** @param {any} p */
const topTerms = (p, n = 5) =>
  p.unexplainedTerms
    .slice(0, n)
    .map((/** @type {any} */ t) => `${t.term}${t.occurrences > 1 ? ` ×${t.occurrences}` : ""}`)
    .join(", ");

console.log(`# Readability audit (deterministic part) — ${today}\n`);
console.log(`Pages: ${pages.length} · JSON: \`${toRelPath(jsonPath)}\`\n`);
console.log(`| Profile | Mean /40 | Below 24/40 |`);
console.log(`| :-- | --: | --: |`);
for (const p of /** @type {const} */ (["A", "B"])) {
  const xs = pages.map((x) => x.deterministic[p]);
  console.log(`| ${p} | ${mean(xs).toFixed(1)} | ${xs.filter((x) => x < 24).length} |`);
}
for (const p of /** @type {const} */ (["A", "B"])) {
  console.log(`\n## Lowest ${Math.min(TOP, pages.length)} for profile ${p}\n`);
  console.log(`| Page | Type | ${p} /40 | Unexplained | Sent. mean | Intro | Main unexplained terms |`);
  console.log(`| :-- | :-- | --: | --: | --: | --: | :-- |`);
  for (const x of [...pages].sort((a, b) => a.deterministic[p] - b.deterministic[p]).slice(0, TOP)) {
    const u = p === "A" ? x.metrics.unexplainedTerms : x.metrics.unexplainedTermsDev;
    console.log(
      `| \`${x.path}\` | ${x.type} | ${x.deterministic[p]} | ${u} | ${x.metrics.meanSentenceWords} | ${x.metrics.introWords} | ${topTerms(x)} |`,
    );
  }
}
