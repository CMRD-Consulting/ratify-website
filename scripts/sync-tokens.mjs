#!/usr/bin/env node
/**
 * Re-vendor the design tokens from the Ratify app repo.
 *
 *   npm run sync-tokens
 *   RATIFY_REPO=~/code/ratify npm run sync-tokens
 *
 * The app is a private repo, so this only works for someone who has it checked
 * out; it defaults to a sibling directory. The header below is regenerated
 * every time and the app's file is taken verbatim after its own header comment,
 * so the vendored file is a pure function of the source — there is no parsing
 * of the previous output to get wrong.
 *
 * If this prints a diff you did not expect, the app's palette moved. Read the
 * diff before committing it.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = process.env.RATIFY_REPO ?? join(here, "..", "..", "ratify");
const source = resolve(repo, "src/assets/ratify-tokens.css");
const target = join(here, "..", "src", "styles", "ratify-tokens.css");

let app;
try {
  app = readFileSync(source, "utf8");
} catch {
  console.error(`No token file at ${source}`);
  console.error("Set RATIFY_REPO to your Ratify app checkout.");
  process.exit(1);
}

// Drop the app's own header comment; ours replaces it.
const end = app.indexOf("*/");
if (end === -1) {
  console.error(`${source} has no leading comment block — refusing to guess.`);
  process.exit(1);
}
const body = app.slice(end + 2).replace(/^\n+/, "");

const stamp = new Date().toISOString().slice(0, 10);
const header = `/* ─────────────────────────────────────────────────────────────────────────
 * Ratify — Nocturne tokens.  VENDORED: do not edit here.
 *
 *   source: CMRD-Consulting/Ratify · src/assets/ratify-tokens.css
 *   copied: ${stamp}
 *
 * The site used to import this straight out of the app checkout next door.
 * That stopped working when the site became its own repository, and vendoring
 * beats a submodule here: the app repo is private, so a submodule would make
 * this repo unclonable by anyone who cannot read the app.
 *
 * Every value is taken from the design canvas, not re-picked. Two rules the
 * whole palette depends on:
 *   1. Indigo is chrome — selection, focus, progress, the mark, links, filled
 *      chrome buttons. It never appears on a review control.
 *   2. Mint is a verdict — approve, passing checks, added lines. It never
 *      appears as chrome.
 *
 * Regenerate with:  npm run sync-tokens
 *
 * Site-only rules belong in site.css, never here — anything added below is
 * lost on the next sync.
 * ───────────────────────────────────────────────────────────────────────── */

`;

const next = header + body;
const prev = (() => {
  try {
    return readFileSync(target, "utf8");
  } catch {
    return null;
  }
})();

// The date stamp changes even when nothing else does; compare the bodies.
const strip = (t) => t.slice(t.indexOf("*/") + 2);
if (prev !== null && strip(prev) === strip(next)) {
  console.log("Tokens already in sync.");
  process.exit(0);
}

writeFileSync(target, next);
console.log(`Updated src/styles/ratify-tokens.css from ${source}`);
console.log("Review the diff before committing — the palette moved.");
