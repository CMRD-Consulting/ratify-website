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

/**
 * The upgrade line, fully qualified for the same reason the install line is.
 *
 * `ratify` is NOT ours alone: homebrew-core ships a formula by that name — the
 * CNCF Artifact Ratification Framework, ratify.dev — and a bare `brew upgrade
 * ratify` resolves to that one, not this one. Homebrew says so itself when you
 * try, and names this exact string as the fix:
 *
 *   Warning: Treating ratify as a formula. For the cask, use
 *   cmrd-consulting/tap/ratify or specify the `--cask` flag.
 *
 * `brew upgrade --cask ratify` is the other half of that warning and works
 * equally well. This form wins anyway: it is character-for-character the spec
 * from BREW_COMMAND, so the page teaches one name instead of a name plus a
 * flag someone has to remember is load-bearing. Drop `--cask` and you upgrade
 * a stranger's software; drop nothing here, because there is nothing to drop.
 *
 * Named rather than bare `brew upgrade`, which would sweep up every other cask
 * on the machine. Someone who came here to update one app should get one app.
 */
export const BREW_UPGRADE_COMMAND = "brew upgrade cmrd-consulting/tap/ratify";

/**
 * How to see what you are actually running, for anyone who wants to know
 * whether the upgrade above has anything to do. Homebrew prints the version it
 * has installed alongside the one the tap is offering, which answers "am I on
 * the latest?" without the page having to hardcode a version number it would
 * then be wrong about for the whole gap between releases.
 *
 * Qualified for the collision above — `brew info ratify` describes the CNCF
 * project, right down to a version number that looks plausible and is not ours.
 */
export const BREW_VERSION_COMMAND = "brew info cmrd-consulting/tap/ratify";

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

/* ── The legal pages ───────────────────────────────────────────────────── */

/**
 * The two documents at /license/ and /privacy-policy/.
 *
 * ⚠️ THREE VALUES BELOW ARE PLACEHOLDERS AND MUST BE SET BEFORE EITHER PAGE
 * IS TREATED AS BINDING. They are gathered here rather than written into the
 * prose so that filling them in is one edit in one file, and so that shipping
 * with a placeholder still in place is visible rather than buried in a wall
 * of text — each renders as an obvious `[…]` marker on the page.
 *
 * Neither document has been reviewed by a lawyer. They are drafted to be
 * accurate about what the software actually does — which is the part that
 * takes product knowledge — not to be authoritative about what the law
 * requires, which is the part that does not.
 */
export const LEGAL_ENTITY = "CMRD Consulting LLC";

/** PLACEHOLDER — the US state whose law governs, and where disputes are heard. */
export const GOVERNING_LAW = "[STATE]";

/**
 * PLACEHOLDER — must be a real, monitored mailbox before publishing. A privacy
 * policy naming an address that bounces is worse than one naming none, and the
 * App Store review form requires a working contact.
 */
export const LEGAL_CONTACT = "[legal@example.com]";

/**
 * Shown on both documents. Bump it whenever the substance changes — not for a
 * typo fix, and not on every deploy: a date that moves without the terms
 * moving teaches people to ignore it.
 */
export const LEGAL_EFFECTIVE = "7 September 2026";
