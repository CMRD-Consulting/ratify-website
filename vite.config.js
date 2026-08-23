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
  },
});
