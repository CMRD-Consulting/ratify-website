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
 *
 *   SHOTS_ONLY=agents npm run shoot   # just the named scenes, comma-separated
 *
 * `shots.sh` re-encodes whatever is in public/shots/src/, so a partial run
 * refreshes only the scenes it captured and leaves every other shipped file
 * exactly as it was.
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

/** Scene names to capture, or every scene when unset. */
const ONLY = (process.env.SHOTS_ONLY ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const wanted = (shot) => !ONLY.length || ONLY.includes(shot.name);

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
  {
    name: "agents",
    // A pull request at `draft`, after the lenses have run: the brief is row
    // zero of the manifest and the cursor sits on a proposed comment, so the
    // rail reads ⏎ accept · x discard · e edit.
    //
    // The harness answers every lens with the same placeholder finding
    // ("Mock finding on a diff line"), which is the right thing for a dev
    // loop and the wrong thing to photograph. The patch below has it answer
    // each lens about the demo migration instead — fiction about fictional
    // code, like every other word on these screenshots. The app's own
    // parser, anchoring, brief and cards are what is captured; nothing in
    // the app is touched.
    mockPatch: agentsMockPatch,
    async setup(page) {
      // Nothing runs until a provider exists, so the app booted with the
      // agents absent. Add one the way Settings would, point every default
      // lens at it and route everything to `draft`; then step off the top
      // row and back, which is an ordinary open of a pull request whose
      // lenses can now run.
      await page.evaluate(() => {
        const pinia = document.querySelector("#app").__vue_app__.config
          .globalProperties.$pinia;
        const settings = pinia._s.get("settings");
        const provider = {
          id: "provider-anthropic",
          label: "Anthropic",
          kind: "anthropic",
          baseUrl: "https://api.anthropic.com",
          models: ["claude-opus-4-1"],
          windows: { "claude-opus-4-1": 200_000 },
          workspaceId: "",
        };
        settings.providers = [provider];
        settings.lenses = settings.lenses.map((l) => ({
          ...l,
          model: { providerId: provider.id, modelId: "claude-opus-4-1" },
        }));
        settings.agentRules = settings.agentRules.map((r) => ({
          ...r,
          level: "draft",
        }));
      });
      await press(page, "j");
      await press(page, "k");
      // The harness answers a lens after four seconds.
      await page.waitForFunction(
        () => {
          const pinia = document.querySelector("#app").__vue_app__.config
            .globalProperties.$pinia;
          const pr = pinia._s.get("pullRequest").pr;
          return pr && pinia._s.get("agent").runFor(pr)?.status === "done";
        },
        null,
        { timeout: 20000 },
      );
      await page.waitForTimeout(400);
      // Collapse the queue, go into the diff pane, then walk threads until
      // the cursor is on a proposed card — real threads come first when they
      // sit higher in risk order. The rail's finding keys show only with
      // the diff pane focused, which is what ⏎ is for.
      await press(page, "Tab");
      await press(page, "Enter");
      for (let i = 0; i < 8; i += 1) {
        await press(page, "t");
        const proposed = await page.evaluate(() => {
          const pinia = document.querySelector("#app").__vue_app__.config
            .globalProperties.$pinia;
          return !!pinia._s.get("pullRequest").cursorThread?.pending?.proposed;
        });
        if (proposed) return;
      }
      throw new Error("agents: no proposed comment reached with t");
    },
  },
];

/**
 * Have the harness answer each lens about the demo migration. Keyed on the
 * lens's own prompt, which the runner sends as `prompt`, so Correctness gets
 * the anchored defect, Tests the file-level note, and Security nothing —
 * a lens that finds nothing is part of what the brief shows. The anchored
 * line is looked up in the intercepted fixture's patch by content, so it
 * follows the migration if that text ever moves.
 */
function agentsMockPatch(source) {
  const findings = `function mockFindings(args) {
  const first = fixtures.files[0];
  const added = (first?.patch ?? "").split("\\n").filter((l) => l.startsWith("+"));
  // Wholly added, so the k-th "+" line is line k+1 on the new side.
  const at = (needle) => {
    const i = added.findIndex((l) => l.includes(needle));
    return i === -1 ? null : i + 1;
  };
  const prompt = String(args?.prompt ?? "");
  if (/attacker/i.test(prompt)) {
    return JSON.stringify({
      summary: "Nothing the shown code makes exploitable. The new table takes no user input directly; every column is written by the service layer, and the enum bounds the reason.",
      findings: [],
    });
  }
  if (/regressed/i.test(prompt)) {
    return JSON.stringify({
      summary: "The partial unique index on captureId is not exercised by any test in the change.",
      findings: [
        { path: first?.filename, line: null, severity: "nit", title: "No test covers the captureId partial index", detail: "ShipmentHold.test.js creates one hold per capture id, so a second hold with the same captureId — the case the index exists for — is never attempted." },
      ],
    });
  }
  return JSON.stringify({
    summary: "One defect in the migration: the partial index's predicate never matches on Postgres, so the unique constraint on captureId does not hold.",
    findings: [
      { path: first?.filename, line: at("[Op.ne]: null"), severity: "issue", title: "Op.ne against null compiles to != NULL, which is never true", detail: "Postgres evaluates captureId != NULL as unknown, so the partial index covers no rows and a second hold with the same captureId is accepted. Use [Op.not]: null, which Sequelize renders as IS NOT NULL." },
    ],
  });
}
`;
  const patched = source
    .replace(/function mockFindings\(\) \{[\s\S]*?\n\}\n/, findings)
    .replace("function mockComplete(requestId)", "function mockComplete(requestId, args)")
    .replace("resolve(mockFindings());", "resolve(mockFindings(args));")
    .replace("return mockComplete(args.requestId);", "return mockComplete(args.requestId, args);");
  for (const must of ["mockFindings(args)", "mockComplete(requestId, args)", "mockComplete(args.requestId, args)"]) {
    if (!patched.includes(must)) throw new Error(`agents: the harness no longer has the shape this patch expects (${must})`);
  }
  return patched;
}

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
    for (const shot of SHOTS.filter(wanted)) {
      const { context, page } = await open(shot, { scheme });
      await shot.setup(page);
      await guard(page, shot.name);
      await page.screenshot({ path: join(themeOut, `${shot.name}.png`) });
      console.log(`  ${shot.name}.png`);
      await context.close();
    }

    for (const shot of MOTION.filter(wanted)) {
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
  const total =
    (SHOTS.filter(wanted).length + MOTION.filter(wanted).length) * THEMES.length;
  console.log(`\nWrote ${total} captures to public/shots/src/`);
  console.log("Re-encode the stills with: npm run shots");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
