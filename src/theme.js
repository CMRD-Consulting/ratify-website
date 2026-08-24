/**
 * The site's theme, in the app's own three states: system, light, dark.
 *
 * The page advertises "light and dark, or neither", so it offers all three
 * rather than a two-way flip — the switcher in the header is the feature
 * working, not a description of it.
 *
 * `preference` is what someone chose. `theme` is what that resolves to once
 * the OS has had its say, and it is the only one anything should render from.
 *
 * public/theme-boot.js has already painted the same answer before this module
 * is parsed; the two share a storage key and a resolve rule, and that file's
 * header says why the job is split in half. This half owns everything after
 * the first frame.
 */
import { computed, ref } from "vue";

/** Switcher order, not alphabetical — matches the app's appearance setting. */
export const PREFERENCES = ["system", "light", "dark"];

/** Shared with public/theme-boot.js. Changing it here changes it in two places. */
const KEY = "ratify-theme";

function stored() {
  try {
    const saved = localStorage.getItem(KEY);
    return PREFERENCES.includes(saved) ? saved : "system";
  } catch {
    return "system";
  }
}

function prefersDark() {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/** Anything unrecognised resolves as "system" rather than throwing. */
function resolve(preference, systemPrefersDark) {
  if (preference === "light" || preference === "dark") return preference;
  return systemPrefersDark ? "dark" : "light";
}

const preference = ref(stored());
const systemDark = ref(prefersDark());

/** "light" | "dark" — never "system". Render from this. */
export const theme = computed(() => resolve(preference.value, systemDark.value));

/** What the switcher binds to. Read it, and call `choose` to change it. */
export const themePreference = computed(() => preference.value);

/**
 * The browser's own chrome — the URL bar on iOS, the tab strip on Android —
 * is painted from <meta name="theme-color">, not from our CSS. Read the canvas
 * back out of the stylesheet rather than restating the two hex values here:
 * the palette is the app's, and a copy of it in JS is a copy that drifts.
 */
function paintBrowserChrome() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const canvas = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-canvas")
    .trim();
  if (canvas) meta.setAttribute("content", canvas);
}

export function choose(next) {
  preference.value = PREFERENCES.includes(next) ? next : "system";
  try {
    localStorage.setItem(KEY, preference.value);
  } catch {
    // The mirror is a cache. Losing it costs a flash on the next visit, which
    // is not worth failing the theme change over.
  }
  paint();
}

function paint() {
  document.documentElement.dataset.theme = theme.value;
  paintBrowserChrome();
}

/**
 * Call once, from main.js. The attribute is already correct — theme-boot.js
 * set it — so this is here to catch the OS flipping underneath us, which only
 * matters while the preference is "system".
 */
export function startTheme() {
  paint();

  if (!window.matchMedia) return () => {};
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = (event) => {
    systemDark.value = event.matches;
    // Never rewrite the preference: someone chose "follow the OS", not "dark".
    if (preference.value === "system") paint();
  };
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
