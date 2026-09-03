<div align="center">
  <img src="public/ratify-mark.svg" alt="" width="52" />
  <h1>ratify.cmrd.dev</h1>
  <p><strong>The marketing site for Ratify</strong> — a keyboard-driven macOS pull request review inbox.</p>
</div>

---

One page, no backend, no analytics, no cookies. The only thing it stores is
which palette you picked, under `ratify-theme` in localStorage, and only once
you pick one. Vite + Vue 3 + Tailwind 4, built to a static `dist/` and served
by Netlify.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
```

Node 22.12.0 (see [`.nvmrc`](.nvmrc)). A clean clone builds with nothing else
installed — the two palettes and every screenshot are committed, so neither the
app repo nor the capture tooling is needed to build the site.

## The design system is the app's

The palette, type scale, radii, canvas wash and focus ring are the desktop
app's own token files, vendored verbatim.

The app ships **two** palettes — Nocturne (dark) and "C · Slate" (light) — and
so, as of 2026-08-24, does this page. Both are vendored:
[`ratify-tokens.css`](src/styles/ratify-tokens.css) declares every token and
[`ratify-light.css`](src/styles/ratify-light.css) is a values-only override
layer selected by `:root[data-theme="light"]`, exactly as the app has them.
Nothing here re-picks a colour in either palette.

This page used to be dark and say so — a poster has no preference to remember
and no menu bar to sit inside. What changed the answer is that the page makes a
claim about the product ("light and dark, or neither") and a poster that cannot
do the thing it is describing is a weaker argument than one that can. The
switcher in the header is the feature working, which is also why it carries all
three states rather than being a two-way flip.

The light ramp is **solved, not picked**: each light shade's contrast against
the light canvas equals its dark counterpart's against the dark one, and the
app's own `contrast.test.js` enforces that to within 0.15. `text-zinc-400` in
this repo therefore means "the fourth step down", not `#9F9FA9`, and it flips
on its own. Do not eyeball a replacement here — fix it in the app and re-sync.

Two consequences worth knowing before you touch a colour:

- **Mint splits in two.** `--color-approve` is a *fill* and is byte-identical in
  both palettes, because the text sitting on it is `--color-approve-fg`. Mint as
  a *foreground* is `--color-approve-text`, which has to darken to emerald-700
  on a light canvas or it fails contrast. Never use `--color-approve` as a text
  colour; the site got this wrong once already.
- **The mark has two files.** Indigo-400 is 2.55:1 on Slate's canvas, so
  [`ratify-mark-light.svg`](public/ratify-mark-light.svg) is the same wireframe
  in indigo-600 — the value the app's token file already annotates "the mark on
  light". It is a pure function of the other one:
  `sed 's/#818CF8/#4F46E5/g' public/ratify-mark.svg > public/ratify-mark-light.svg`.

What did change here is that the app collapsed its ad-hoc white and black
alphas into named tokens — `--color-fill*`, `--color-hairline*`,
`--color-well`, `--color-scrollbar*`, the `*-wash` / `*-border` pairs. The
copied primitives below use those names now, because the app's do.

Two rules carry over unchanged, and they are why the page looks the way it does:

- **Indigo is chrome** — links, focus, the mark, filled buttons. The install
  command's Copy button and the App Store button are both chrome, so both are
  indigo.
- **Mint is a verdict** — approve, passing checks, added lines. On this page
  mint is spent only where the copy is literally about approving: the `a`
  keycap and the verdict-key row. Nowhere else.

[`src/styles/site.css`](src/styles/site.css) has three parts after those imports:

| | |
|---|---|
| **Unlayered block** | The token file styles bare `a` outside any cascade layer, and unlayered beats layered no matter how specific the layered selector is. The app never notices — its buttons are `<button>` elements. Here they are links, so `a.btn-chrome`, `a.nav-link` and `a.link` have to live outside the layer too. **Read the comment there before adding a link style**; every anchor-based button silently renders indigo otherwise. |
| **Copied primitives** | `.wordmark*`, `.kbd*`, `.btn-*`, `.panel`, `.card`, `.eyebrow`, `.pill` — lifted verbatim from the app's `main.css`. They are design-system vocabulary rather than app behaviour. Keep them byte-identical; if one drifts, copy it again rather than adjusting it here. **`sync-tokens` does not cover these** — it only re-vendors the two token files, so a change to the app's `main.css` has to be copied across by hand. |
| **Site-only vocabulary** | `.display`, `.h2`, `.h3`, `.lede`, `.prose-body`, `.shot`, `.reveal`, `.theme-segment`, `.cta-panel`. The app's type scale stops at 19px because every pixel is queue density; that decision does not survive a 1180px marketing column, so prose gets its own ramp — still tracked at the app's `-0.011em`. `--color-cell` and `--color-cell-hover` live here too: they are the only two colours on the page the app did not pick, and the comment beside them says why `--color-surface-content` could not do the job. |

## How the theme is wired

Three files, and the split between the first two is the whole design:

| | |
|---|---|
| [`public/theme-boot.js`](public/theme-boot.js) | Render-blocking, classic, **not part of the bundle**. `src/main.js` is a module and modules are deferred, so by the time it runs the canvas has already been painted and someone on a light desktop watches the page flash Nocturne first. This reads the stored preference, resolves it, sets `data-theme`, and stops. |
| [`src/theme.js`](src/theme.js) | Everything after the first frame: the reactive `theme` that `Shot.vue` and `Wordmark.vue` render from, the switcher's `choose()`, the `matchMedia` watcher, and the `theme-color` meta. |
| [`src/components/ThemeToggle.vue`](src/components/ThemeToggle.vue) | System · Light · Dark as a `radiogroup` with roving tabindex — one tab stop, arrows within it. |

The two halves share a storage key and a resolve rule and nothing else. **Keep
them in step.** The app splits the same job the same way and for the same
reason — `src/lib/theme.js` there, with `src-tauri/src/theme.rs` reading the
same key at document-start.

It is a real file rather than an inline `<script>` on purpose: `script-src
'self'` already covers it, so the CSP in [`netlify.toml`](netlify.toml) never
has to carry a hash that a later edit would silently invalidate.

Dark needs no attribute. That is the failure mode being chosen: if the theming
layer breaks, the page falls back to Nocturne rather than to nothing.

## Screenshots, and why they are fiction

Every screenshot on the site is captured against **invented data** — a
`northwind/platform` repo, invented authors, and a synthetic migration. That is
deliberate. The app's dev harness runs against a snapshot of a real review
queue, and that snapshot carries a client's repository name, colleagues' GitHub
handles and real proprietary source in the diff bodies. None of that belongs in
a public repository or on a marketing page.

```bash
npm run shoot     # drive the app in both palettes, 2x PNGs into public/shots/src/
npm run shots     # re-encode those into the WebP the site ships
SHOTS_ONLY=agents npm run shoot   # one scene (comma-separated for more)
```

`shots` re-encodes whatever `shoot` left in `public/shots/src/`, so a partial
run refreshes only the scenes it captured and leaves every other shipped file
byte-for-byte as it was. Re-shoot everything when the app's chrome changes;
re-shoot one scene when only that scene does.

**Every screen is captured twice**, because a Nocturne screenshot on a Slate
page is the one thing that gives a themed page away. The two live at the same
name under different directories, which is what lets `Shot.vue` take a single
`src` and derive the other:

```
public/shots/inbox.webp          Nocturne
public/shots/light/inbox.webp    C · Slate
```

The theme is driven the way a real user drives it, not by patching anything:
the app's appearance setting ships as `system` and it resolves that through
`prefers-color-scheme`, which is exactly what Playwright's `colorScheme`
context option sets. What is captured is the app's own theming code doing its
own job. **Adding a palette to the app means adding one line to `THEMES` in
[`scripts/shoot.mjs`](scripts/shoot.mjs)** and nothing else.

Only one palette's bytes are ever on the wire — `Shot.vue` swaps one `<img>`
rather than stacking two — so the second set costs a fetch on the first switch
rather than a doubled page weight.

`shoot` needs the app running and Google Chrome installed:

```bash
npm run dev --prefix ../ratify        # the browser harness, port 1420
RATIFY_REPO=~/code/ratify npm run shoot   # if the app lives elsewhere
```

**It never modifies the app repo.** The harness imports its fixture as a
module, so [`scripts/shoot.mjs`](scripts/shoot.mjs) intercepts that request and
serves fiction instead, rewriting the harness's own constants in flight. Run
the app dirty, on a branch, mid-rebase — it does not matter, and there is
nothing to clean up afterwards.

The `agents` scene goes one step further in the same direction. The harness
answers every lens with a placeholder finding, which is right for a dev loop
and wrong to photograph, so the scene's `mockPatch` has it answer each lens
about the demo migration instead — fiction about fictional code, like every
other word on these screenshots. A provider, the lenses' models and a `draft`
rule are seeded through the app's own settings store on the page; the parser,
the anchoring, the brief and the cards are the app's, untouched.

Two guards make the sanitisation something other than a promise.
[`scripts/demo-data.mjs`](scripts/demo-data.mjs) holds a list of known-real
tokens; `assertClean()` refuses to build fixtures that still contain any of
them, and every captured screen is scanned for them before it is written to
disk. **If you add a screenshot, you inherit both guards for free — but if you
ever see one fire, do not work around it.** It is the thing standing between a
client's source and the open internet.

The one deliberate exception is the word `insurance`, which is one of the app's
own default triage-rule globs and so appears in the settings screenshot
legitimately. That exception is narrow and commented where it lives.

## Design tokens

`src/styles/ratify-tokens.css` and `src/styles/ratify-light.css` are vendored
from the app, which is private. Refresh both from a sibling checkout:

```bash
npm run sync-tokens
RATIFY_REPO=~/code/ratify npm run sync-tokens
```

Each header is regenerated and the app's file is taken verbatim below it, so a
vendored copy is a pure function of its source. **Changing either palette in
the app means running this** — nothing warns you otherwise, and a palette that
moves in one theme and not the other is the failure you will not see until
someone flips the switcher.

It syncs those two files and nothing else. The copied primitives in
[`site.css`](src/styles/site.css) come from the app's `main.css` and still have
to be carried across by hand.

## How Ratify ships, and what the page has to say about it

Everything about availability lives in [`src/site.js`](src/site.js). Nothing
else on the page hardcodes a URL, a version or a claim about what works today.

Homebrew is the real channel:

```bash
brew install cmrd-consulting/tap/ratify
```

That one line is the whole install — `brew` resolves `cmrd-consulting/tap` to
[`CMRD-Consulting/homebrew-tap`][tap] itself, so the page deliberately does not
teach a separate `brew tap` step. The DMG comes from
[`CMRD-Consulting/ratify-releases`][releases], which is public because the app's
own repository is private and Homebrew downloads with no credentials.

Two flags gate what the page promises, and each is false for its own reason:

| | | |
|---|---|---|
| `NOTARIZED` | `false` | Homebrew quarantines what it downloads, and the bundle is signed by nobody Apple has vouched for, so macOS refuses the first launch. While this is false the page carries the first-launch note under the install buttons — and the hero links to it, because that is where most people copy the command from. **Flip it only after `spctl -a -vv` accepts a shipped bundle** — not when the certificate arrives. |
| `RELEASED` | `false` | The Mac App Store link is a placeholder id, which is what puts the "soon" chip on that button. **Change it and `APP_STORE_URL` together** — the chip is the only thing telling visitors the link does not work. |

The App Store is a second channel and further off than it looks: the App
Sandbox forbids the subprocess Ratify uses to read your `gh` CLI token, so that
convenience has to survive the move before the listing can exist.

### The first launch, and why the note says what it says

Ratify **is** signed — just not by anyone Apple recognises. That one fact
decides the whole note, so check it rather than reasoning about it:

```bash
codesign -dv --verbose=2 /Applications/Ratify.app   # Authority set, TeamIdentifier=not set
spctl -a -vvv -t exec    /Applications/Ratify.app   # rejected, with an origin= line
```

An app whose signature is *missing or broken* is "damaged", and Privacy &
Security offers nothing for it — the `xattr` command is the only way through.
An app signed by someone Apple has not vouched for is merely *blocked*, and
that is the case **Open Anyway** exists for. `rejected` **with** an `origin=`
line is the second one, which is where Ratify sits today. The note
[documents both routes](src/components/QuarantineNote.vue) on that basis; if
the signing setup changes, re-run the two commands above before rewording it.

Two details in that copy are load-bearing, and both come from macOS 15:

- **Open Anyway does not exist until a launch has been blocked.** Someone sent
  straight to System Settings finds an empty Security section and concludes the
  page is wrong, so step 1 is "let it be blocked".
- **The old right-click → Open shortcut is gone.** Privacy & Security is now the
  only route that does not involve a terminal.

### Updating, and why it can be blocked twice

Homebrew installed it, so Homebrew updates it:

```bash
brew upgrade cmrd-consulting/tap/ratify   # the update itself
brew info    cmrd-consulting/tap/ratify   # installed version, next to the tap's
```

**Fully qualified, and not by habit — `ratify` is not ours alone.**
homebrew-core ships a formula of that name, the CNCF [Artifact Ratification
Framework](https://ratify.dev), so the short name resolves to someone else's
software:

```console
$ brew upgrade ratify
Warning: Treating ratify as a formula. For the cask, use
cmrd-consulting/tap/ratify or specify the `--cask` flag.
Error: ratify not installed
```

`brew upgrade --cask ratify` is the other half of that warning and works just as
well. The qualified form is preferred here because it is character-for-character
the spec in `BREW_COMMAND` — the page then teaches **one** string rather than a
string plus a flag whose absence silently retargets the command. Verify with
`brew info cmrd-consulting/tap/ratify`, which should name Ratify and
`ratify.cmrd.dev`; if it says "Artifact Ratification Framework" you are reading
the wrong project.

The cask is named rather than left off, so someone who came to update one app
does not upgrade every cask on the machine.

The consequence worth documenting is the second block. An upgrade is a fresh
download, so the replacement bundle arrives with a fresh quarantine flag and
none of the approval macOS recorded for the copy it replaced. The first-launch
note ends on "it opens normally forever after", which is true of that bundle and
not of its successor — [`UpdateNote.vue`](src/components/UpdateNote.vue) is what
keeps the pair honest, and its warning is gated on `NOTARIZED` so it retires
with the block it describes. The two commands above are not gated; they outlive
Apple's opinion of the signature.

`RELEASES_URL` points at `/releases/latest` rather than a pinned tag on purpose
— otherwise the site needs a deploy on every release just to stay honest, and
the build shipped in between quietly points at an old DMG. **Cutting a release
requires no change here.**

[tap]: https://github.com/CMRD-Consulting/homebrew-tap
[releases]: https://github.com/CMRD-Consulting/ratify-releases

## Deploying

[`netlify.toml`](netlify.toml) carries the whole deploy: `npm run build`,
publish `dist`, Node pinned to match `.nvmrc`, plus cache and security headers.
There are no environment variables and no build secrets.

**Merging to `main` deploys.** The site is connected to this repository through
the Netlify GitHub App, so a merge builds and publishes to `ratify.cmrd.dev`
with nothing to run by hand. Pull requests get a deploy preview; no other
branch builds, because `allowed_branches` is `main` alone.

Nothing here needs touching when the app releases: the download links resolve
through `/releases/latest`, so a new DMG is live on the site the moment its
release is published.

Deploying by hand is still possible and is occasionally the right thing —
rolling back, or shipping while GitHub is down:

```bash
npm run build
netlify deploy --prod --dir=dist
```

Prefer a merge. A manual deploy publishes whatever is in `dist` at that moment,
which is not necessarily what is on `main`.

There is deliberately **no catch-all rewrite to `index.html`**. This is one page
with no client-side router, so anything that is not a real file should 404
rather than serve the landing page under an invented URL.

The `Content-Security-Policy` header allows exactly what the page uses: its own
scripts and styles, its own images, and Google Fonts. If you add anything that
talks to a third party, that header is what will block it first.

---

<div align="center">
  <a href="https://cmrd.dev"><img src="public/cmrd-logo.svg" alt="CMRD Consulting" width="90" /></a>
  <p><sub>Made by <a href="https://cmrd.dev">CMRD Consulting</a></sub></p>
</div>
