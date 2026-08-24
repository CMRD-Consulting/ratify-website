/* Paint the theme before the first frame.
 *
 * This is deliberately NOT part of the bundle. src/main.js is a module and so
 * is deferred; by the time it runs the browser has already painted the canvas,
 * and someone on a light desktop would watch the page flash Nocturne first.
 * A classic <script src> in <head> is render-blocking, which is the whole
 * point — see the comment beside its tag in index.html.
 *
 * It is served from public/ verbatim, so `script-src 'self'` covers it and the
 * CSP needs no inline-script hash to maintain.
 *
 * Keep this in step with src/theme.js, which owns the same key and the same
 * resolve rule and takes over once Vue mounts. This half only ever paints;
 * everything else — the switcher, the OS watcher, the theme-color meta —
 * belongs over there. The app splits the job the same way, and for the same
 * reason: see src/lib/theme.js in the Ratify repo.
 */
(function () {
  try {
    var preference = localStorage.getItem("ratify-theme");
  } catch (e) {
    // Storage can be blocked outright (Safari in Lockdown Mode, a hardened
    // profile). Falling through to the OS preference is the right answer.
    preference = null;
  }

  var resolved =
    preference === "light" || preference === "dark"
      ? preference
      : window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

  document.documentElement.dataset.theme = resolved;
})();
