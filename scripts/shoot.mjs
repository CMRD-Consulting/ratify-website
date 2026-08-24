#!/usr/bin/env node
/**
 * Re-shoot the product screenshots against demo data, in both palettes.
 *
 *   npm run dev  --prefix ../ratify      # the app's browser harness, port 1420
 *   npm run shoot
 *
 * Nothing in the app repo is modified. The app's dev harness imports its
 * fixture snapshot as a module, so this intercepts that request and serves
 * fiction instead; the harness's own constants (repo names, the signed-in
 * account) are rewritten in flight the same way. Run the app on a branch, on
 * main, dirty or clean — it does not matter and nothing needs cleaning up.
 *
 * Every screen is captured twice, because the site is themed and a Nocturne
 * screenshot on a Slate page is the one thing that gives a themed page away.
 * The theme is driven the way a real user drives it rather than by patching
 * anything: the app ships with its appearance set to "system", and the app
 * resolves that through `prefers-color-scheme`, which is exactly what
 * Playwright's `colorScheme` context option sets. Nothing is stubbed, so what
 * is captured is the app's own theming code doing its own job.
 *
 * Captures at 2x into docs-quality PNGs, then `npm run shots` re-encodes them
 * to the WebP the site actually ships. Nocturne lands in public/shots/src/ and
 * Slate one level down in public/shots/src/light/, which is the same shape the
 * shipped files take — see Shot.vue.
 *
 * Requires Google Chrome (driven via playwright-core's `channel: "chrome"`, so
 * there is no browser download).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import {
  assertClean,
  buildDemoFixtures,
  forbiddenFrom,
} from "./demo-data.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = process.env.RATIFY_REPO ?? join(here, "..", "..", "ratify");
const out = join(here, "..", "public", "shots", "src");

/**
 * The two palettes, and where each one's captures land. "dark" keeps the
 * top-level directory it has always had so nothing that already points at a
 * shot has to move.
 */
const THEMES = [
  { scheme: "dark", dir: out },
  { scheme: "light", dir: join(out, "light") },
];
const APP = process.env.RATIFY_URL ?? "http://localhost:1420/";

const VIEWPORT = { width: 1440, height: 900 };

const real = JSON.parse(
  readFileSync(join(repo, "src/dev/fixtures.json"), "utf8"),
);
// The harness keeps its own constants in source, so it is both an input to the
// scrub and a thing that needs scrubbing.
const harness = readFileSync(join(repo, "src/dev/mock.js"), "utf8");

const demo = buildDemoFixtures(real, harness);
assertClean(demo, real, harness);

const FORBIDDEN_ON_SCREEN = forbiddenFrom(real, harness);

/**
 * Rewrite the harness's own constants.
 *
 * By shape, not by name — the same reason demo-data.mjs derives everything.
 * Any `"owner/repo"` literal, any `login:` and any person-shaped `name:` is
 * replaced, so nothing real has to be written down in this repo to do it.
 */
function scrubHarness(source) {
  return source
    .replace(/"([\w.-]+\/[\w.-]+)"/g, (m, repoName) =>
      // Leave paths and globs alone; only owner/repo pairs are identities.
      /^[\w-]+\/[\w.-]+$/.test(repoName) && !repoName.includes(".")
        ? '"northwind/platform"'
        : m,
    )
    .replace(/login:\s*"[^"]+"/g, 'login: "dpressley"')
    .replace(/name:\s*"[A-Z][a-z]+ [A-Z][a-z]+"/g, 'name: "Dana Pressley"');
}

/**
 * Each entry is one screenshot: reach the state, then name the file.
 * Keys are the app's own bindings — ⇥ collapses the queue, ⇧S toggles split,
 * n steps a file. See src/lib/keymap.js in the app.
 */
const SHOTS = [
  { name: "inbox", async setup() {} },
  {
    name: "diff",
    // ⇥ collapses the queue to a rail, which is what gives the diff the width
    // the site's caption promises.
    async setup(page) {
      await press(page, "Tab");
    },
  },
  {
    name: "split",
    // The first file in risk order is the migration — wholly added, so split
    // renders an empty left column and the caption ("removals left, additions
    // right") describes nothing. Step past the needs-eyes tier to a modified
    // file, which is what split view is actually for.
    async setup(page) {
      await press(page, "Tab");
      for (let i = 0; i < 4; i += 1) await press(page, "n");
      await press(page, "S", { shift: true });
    },
  },
  { name: "approve", async setup(page) { await press(page, "a"); } },
  { name: "palette", async setup(page) { await press(page, "k", { meta: true }); } },
  { name: "keymap", async setup(page) { await press(page, "?", { shift: true }); } },
  {
    name: "signin",
    // The harness always hands back a session; drop it and App.vue falls
    // through to the sign-in view.
    mockPatch: (s) =>
      s.replace(
        /case "auth_session":\s*\n\s*return \{[^}]*\};/,
        'case "auth_session":\n          return null;',
      ),
    async setup() {},
  },
  {
    name: "triage",
    // Settings is its own window and its own entry point.
    url: "settings.html",
    viewport: { width: 720, height: 540 },
    async setup(page) {
      await page.getByText("Triage rules", { exact: true }).first().click();
      await page.waitForTimeout(400);
    },
  },
];

/**
 * Animated shots. Each step is captured as a frame, then img2webp stitches
 * them. Held at 1x — these run at about a third of the page width, and the
 * frame count is what drives the file size.
 */
const MOTION = [
  {
    name: "repo-motion",
    steps: [
      async () => {},
      async (p) => press(p, "R", { shift: true }),
      async (p) => { await p.keyboard.type("con", { delay: 90 }); await p.waitForTimeout(250); },
      async (p) => press(p, "Enter"),
      async () => {},
    ],
  },
  {
    name: "approve-motion",
    steps: [
      async () => {},
      async (p) => press(p, "j"),
      async (p) => press(p, "j"),
      async (p) => press(p, "a"),
      async (p) => press(p, "Enter", { meta: true }),
      async (p) => p.waitForTimeout(600),
    ],
  },
  {
    name: "diff-motion",
    steps: [
      async () => {},
      async (p) => press(p, "Tab"),
      async (p) => press(p, "n"),
      async (p) => press(p, "n"),
      async (p) => press(p, "n"),
      async (p) => press(p, "v"),
    ],
  },
];

async function press(page, key, mods = {}) {
  const prefix =
    (mods.meta ? "Meta+" : "") +
    (mods.shift ? "Shift+" : "") +
    (mods.alt ? "Alt+" : "");
  await page.keyboard.press(prefix + key);
  await page.waitForTimeout(350);
}

async function freshPage(browser, opts = {}) {
  const context = await browser.newContext({
    viewport: opts.viewport ?? VIEWPORT,
    deviceScaleFactor: opts.scale ?? 2,
    // The app's appearance setting is "system" and it resolves that through
    // this media query, so this is the whole theme switch. See the header.
    colorScheme: opts.scheme ?? "dark",
    // Motion shots need the app's transitions; stills do not.
    reducedMotion: opts.motion ? "no-preference" : "reduce",
  });
  const page = await context.newPage();

  // Serve the demo snapshot in place of the captured one.
  await page.route("**/src/dev/fixtures.json*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: `export default ${JSON.stringify(demo)}`,
    }),
  );

  // Rewrite the harness's own constants on the way through.
  await page.route("**/src/dev/mock.js*", async (route) => {
    const res = await route.fetch();
    let body = scrubHarness(await res.text());
    if (opts.mockPatch) body = opts.mockPatch(body);
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body,
    });
  });

  // No avatar should ever be fetched from GitHub.
  await page.route("**://avatars.githubusercontent.com/**", (route) =>
    route.abort(),
  );

  return { context, page };
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome" });
  } catch (err) {
    console.error("Could not launch Google Chrome:", err.message.split("\n")[0]);
    process.exit(1);
  }

  /** Load a fresh page, settled and ready to be driven. */
  async function open(shot, opts) {
    const { context, page } = await freshPage(browser, {
      ...opts,
      viewport: shot.viewport,
      mockPatch: shot.mockPatch,
    });
    const url = shot.url ? new URL(shot.url, APP).href : APP;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
    } catch {
      console.error(`Cannot reach ${url} — is the app's dev server running?`);
      console.error("  npm run dev --prefix ../ratify");
      await browser.close();
      process.exit(1);
    }
    // The queue renders cache-then-fetch; wait for it to settle.
    await page.waitForTimeout(1200);
    return { context, page };
  }

  /** Fail loudly rather than saving a screenshot with real data in it. */
  async function guard(page, label) {
    const text = await page.evaluate(() => document.body.innerText);
    const leaked = FORBIDDEN_ON_SCREEN.filter((t) => text.includes(t));
    if (!leaked.length) return;
    console.error(`\n${label}: real data on screen — ${leaked.join(", ")}`);
    console.error("The fixture interception did not take. Refusing to save.");
    browser.close();
    process.exit(1);
  }

  for (const { scheme, dir: themeOut } of THEMES) {
    mkdirSync(themeOut, { recursive: true });
    console.log(`\n${scheme}`);

    // Each shot gets a fresh page: the states are modal and unwinding them
    // reliably is more fragile than just reloading. A fresh context per shot
    // is also what keeps the theme honest — the app mirrors its preference to
    // localStorage, and a reused context would carry the last one over.
    for (const shot of SHOTS) {
      const { context, page } = await open(shot, { scheme });
      await shot.setup(page);
      await guard(page, shot.name);
      await page.screenshot({ path: join(themeOut, `${shot.name}.png`) });
      console.log(`  ${shot.name}.png`);
      await context.close();
    }

    for (const shot of MOTION) {
      const dir = join(themeOut, shot.name);
      mkdirSync(dir, { recursive: true });
      const { context, page } = await open(shot, {
        scheme,
        scale: 1,
        motion: true,
        viewport: { width: 1280, height: 800 },
      });
      const frames = [];
      for (const [i, step] of shot.steps.entries()) {
        await step(page);
        const file = join(dir, `${String(i).padStart(2, "0")}.png`);
        await page.screenshot({ path: file });
        frames.push(file);
      }
      await guard(page, shot.name);
      await context.close();

      // Hold the first and last frames so the loop reads as a beat, not a blur.
      const durations = frames.map((_, i) =>
        i === 0 ? 900 : i === frames.length - 1 ? 1600 : 700,
      );
      const args = frames.flatMap((f, i) => ["-d", String(durations[i]), f]);
      execFileSync(
        "img2webp",
        [
          "-loop",
          "0",
          "-q",
          "70",
          ...args,
          "-o",
          join(themeOut, `${shot.name}.webp`),
        ],
        { stdio: "inherit" },
      );
      rmSync(dir, { recursive: true, force: true });
      console.log(`  ${shot.name}.webp (${frames.length} frames)`);
    }
  }

  await browser.close();
  const total = (SHOTS.length + MOTION.length) * THEMES.length;
  console.log(`\nWrote ${total} captures to public/shots/src/`);
  console.log("Re-encode the stills with: npm run shots");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
