/**
 * The handful of facts that change between "pre-release" and "on sale".
 * Everything the page says about availability reads from here.
 */

/**
 * PLACEHOLDER. Ratify is not on the Mac App Store yet, so this is a dummy id.
 * At release: paste the real product URL here and flip RELEASED to true.
 */
export const APP_STORE_URL = "https://apps.apple.com/app/ratify/id0000000000";

/**
 * False while the App Store link above is a placeholder. Flipping this to true
 * drops the "soon" chips from the download buttons — it does not change the
 * link, so change both together.
 */
export const RELEASED = false;

export const REQUIREMENTS = "macOS 11 or later · Apple silicon and Intel";

/* No source link: CMRD-Consulting/Ratify is a private repository, so anything
   pointing at it would 404 for every visitor. */
export const CMRD_URL = "https://cmrd.dev";
