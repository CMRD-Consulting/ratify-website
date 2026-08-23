<div align="center">
  <img src="public/ratify-mark.svg" alt="" width="52" />
  <h1>ratify.cmrd.dev</h1>
  <p><strong>The marketing site for Ratify</strong> — a keyboard-driven macOS pull request review inbox.</p>
</div>

---

One page, no backend, no analytics, no cookies. Vite + Vue 3 + Tailwind 4,
built to a static `dist/` and served by Netlify.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
```

Node 22.12.0 (see [`.nvmrc`](.nvmrc)). A clean clone builds with nothing else
installed — see [Refreshing from the app repo](#refreshing-from-the-app-repo)
for the two things that are vendored rather than fetched.

## The design system is the app's

`src/styles/ratify-tokens.css` is the desktop app's own token file, vendored
verbatim: the same palette, type scale, radii, canvas wash and focus ring the
app ships. Nothing here re-picks a colour.

Two rules carry over unchanged, and they are why the page looks the way it does:

- **Indigo is chrome** — links, focus, the mark, filled buttons. The install
  command's Copy button and the App Store button are both chrome, so both are
  indigo.
- **Mint is a verdict** — approve, passing checks, added lines. On this page
  mint is spent only where the copy is literally about approving: the `a`
  keycap and the verdict-key row. Nowhere else.

[`src/styles/site.css`](src/styles/site.css) has three parts after that import:

| | |
|---|---|
| **Unlayered block** | The token file styles bare `a` outside any cascade layer, and unlayered beats layered no matter how specific the layered selector is. The app never notices — its buttons are `<button>` elements. Here they are links, so `a.btn-chrome`, `a.nav-link` and `a.link` have to live outside the layer too. **Read the comment there before adding a link style**; every anchor-based button silently renders indigo otherwise. |
| **Copied primitives** | `.wordmark*`, `.kbd*`, `.btn-*`, `.panel`, `.card`, `.eyebrow`, `.pill` — lifted verbatim from the app's `main.css`. They are design-system vocabulary rather than app behaviour. Keep them byte-identical; if one drifts, copy it again rather than adjusting it here. |
| **Site-only vocabulary** | `.display`, `.h2`, `.h3`, `.lede`, `.prose-body`, `.shot`, `.reveal`. The app's type scale stops at 19px because every pixel is queue density; that decision does not survive a 1180px marketing column, so prose gets its own ramp — still tracked at the app's `-0.011em`. |

## Screenshots, and why they are fiction

Every screenshot on the site is captured against **invented data** — a
`northwind/platform` repo, invented authors, and a synthetic migration. That is
deliberate. The app's dev harness runs against a snapshot of a real review
queue, and that snapshot carries a client's repository name, colleagues' GitHub
handles and real proprietary source in the diff bodies. None of that belongs in
a public repository or on a marketing page.

```bash
npm run shoot     # drive the app, capture 2x PNGs into public/shots/src/
npm run shots     # re-encode those into the WebP the site ships
```

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

`src/styles/ratify-tokens.css` is vendored from the app, which is private.
Refresh it from a sibling checkout:

```bash
npm run sync-tokens
RATIFY_REPO=~/code/ratify npm run sync-tokens
```

The header is regenerated and the app's file is taken verbatim below it, so the
vendored copy is a pure function of the source. **Changing the palette in the
app means running this** — nothing warns you otherwise.

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
| `NOTARIZED` | `false` | The DMG has no Developer ID signature yet, so macOS quarantines it. While this is false the page shows the `xattr` command under the install buttons. **Flip it only after `spctl -a -vv` accepts a shipped bundle** — not when the certificate arrives. |
| `RELEASED` | `false` | The Mac App Store link is a placeholder id, which is what puts the "soon" chip on that button. **Change it and `APP_STORE_URL` together** — the chip is the only thing telling visitors the link does not work. |

The App Store is a second channel and further off than it looks: the App
Sandbox forbids the subprocess Ratify uses to read your `gh` CLI token, so that
convenience has to survive the move before the listing can exist.

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
