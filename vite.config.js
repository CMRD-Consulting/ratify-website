import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// Everything the site needs lives inside this repo: the design tokens are
// vendored into src/styles/, and the screenshots are committed under public/.
// Nothing reaches outside the project root, so a clean clone builds.
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    // Screenshots are already WebP; inlining them as base64 would be worse.
    assetsInlineLimit: 2048,

    // Three real pages, because netlify.toml deliberately has no catch-all
    // rewrite: anything that is not a file on disk 404s. The two legal
    // documents therefore have to BE files, which also gives them the stable,
    // linkable URLs the App Store review form asks for.
    //
    // Directory-style on purpose — `license/index.html` serves at `/license/`
    // with no extension in the URL, so the address survives ever moving off
    // Netlify. Adding a page here means adding its <link rel="canonical">,
    // its sitemap entry, and its footer link; grep for "license/" to find the
    // full set.
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        license: resolve(import.meta.dirname, "license/index.html"),
        privacyPolicy: resolve(
          import.meta.dirname,
          "privacy-policy/index.html",
        ),
      },
    },
  },
});
