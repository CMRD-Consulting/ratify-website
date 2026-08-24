/**
 * The handful of facts that change between "pre-release" and "on sale".
 * Everything the page says about availability reads from here.
 */

/* ── Homebrew, the way Ratify actually ships ───────────────────────────── */

/**
 * The install line, in full. `brew` expands `cmrd-consulting/tap` to
 * github.com/CMRD-Consulting/homebrew-tap on its own, so there is no separate
 * `brew tap` step to teach anyone — this one command is the whole story.
 */
export const BREW_COMMAND = "brew install cmrd-consulting/tap/ratify";

export const TAP_URL = "https://github.com/CMRD-Consulting/homebrew-tap";

/**
 * Deliberately /latest rather than a pinned version: the site would otherwise
 * need a deploy on every release just to keep a link honest, and the one it
 * shipped in between would quietly point at an old build.
 */
export const RELEASES_URL =
  "https://github.com/CMRD-Consulting/ratify-releases/releases/latest";

/**
 * False until the DMG is signed with a Developer ID and notarized. While it is
 * false the page carries the first-launch note — the quarantine command, and
 * the System Settings → Privacy & Security steps for anyone who has already
 * been blocked — because the alternative is someone downloading an app macOS
 * then refuses to open, with no explanation the page prepared them for.
 *
 * Flipping this to true removes that note AND the hero's link to it. Flip it
 * only after `spctl -a -vv` accepts the shipped bundle — not when the
 * certificate arrives. Today it says `rejected`, with an `origin=Ratify Dev`
 * line: signed, but by nobody Apple has vouched for.
 */
export const NOTARIZED = false;

export const QUARANTINE_COMMAND =
  'xattr -dr com.apple.quarantine "/Applications/Ratify.app"';

/* ── The Mac App Store, later ──────────────────────────────────────────── */

/**
 * PLACEHOLDER. Ratify is not on the Mac App Store yet, so this is a dummy id.
 * At release: paste the real product URL here and flip RELEASED to true.
 *
 * It is a second channel, not the main one, and there is real work between
 * here and there: the App Sandbox forbids the subprocess Ratify uses to read
 * your `gh` CLI token, so that convenience has to survive the move somehow.
 */
export const APP_STORE_URL = "https://apps.apple.com/app/ratify/id0000000000";

/**
 * False while the App Store link above is a placeholder. Flipping this to true
 * drops the "soon" chips from the App Store buttons — it does not change the
 * link, so change both together.
 */
export const RELEASED = false;

/* ── Everything else ───────────────────────────────────────────────────── */

export const REQUIREMENTS = "macOS 11 or later · Apple silicon and Intel";

/* No source link: CMRD-Consulting/ratify is a private repository, so anything
   pointing at it would 404 for every visitor. The releases repository above is
   public precisely because Homebrew cannot authenticate to a private one. */
export const CMRD_URL = "https://cmrd.dev";
