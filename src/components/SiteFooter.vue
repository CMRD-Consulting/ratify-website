<script setup>
import Wordmark from "./Wordmark.vue";
import {
  CMRD_URL,
  REQUIREMENTS,
  RELEASES_URL,
  TAP_URL,
  LEGAL_ENTITY,
} from "../site.js";

const year = new Date().getFullYear();

/**
 * Section links are written as `/#id`, not `#id`.
 *
 * The footer is shared with /license/ and /privacy-policy/, where a bare
 * `#inbox` resolves against the current URL and goes nowhere. The absolute
 * form behaves identically on the landing page — same document, so it is
 * still a fragment jump rather than a reload — and actually works from the
 * legal pages. Keep any link added here in the same form.
 */
const columns = [
  {
    title: "The app",
    links: [
      { href: "/#inbox", label: "The review inbox" },
      { href: "/#diffs", label: "Large pull requests" },
      { href: "/#reviewing", label: "Reviewing" },
      { href: "/#keys", label: "Keyboard" },
      { href: "/#settings", label: "Configuration" },
    ],
  },
  {
    title: "Details",
    links: [
      { href: "/#who", label: "Who it's for" },
      { href: "/#trust", label: "Security" },
      { href: "/#get", label: "Get Ratify" },
      { href: RELEASES_URL, label: "Releases", external: true },
      { href: TAP_URL, label: "Homebrew tap", external: true },
    ],
  },
];
</script>

<template>
  <footer class="border-t border-hairline px-6 pb-12 pt-16 md:px-10">
    <div class="mx-auto w-full max-w-[1180px]">
      <div class="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark :size="24" scale="lg" />
          <p class="prose-body mt-4 max-w-xs !text-[13px]">
            A keyboard-driven review inbox for macOS. Approve pull requests in
            three keystrokes.
          </p>
          <p class="mt-3 font-mono text-[11px] text-zinc-600">
            {{ REQUIREMENTS }}
          </p>
        </div>

        <div v-for="col in columns" :key="col.title">
          <h2 class="eyebrow">{{ col.title }}</h2>
          <ul class="mt-4 space-y-2.5">
            <li v-for="link in col.links" :key="link.label">
              <a
                :href="link.href"
                :target="link.external ? '_blank' : undefined"
                :rel="link.external ? 'noreferrer' : undefined"
                class="nav-link text-[13px]"
                >{{ link.label }}</a
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="rule my-12" />

      <!-- Made by CMRD Consulting. The lockup carries its own "cmrd" wordmark,
           so it needs about 64px of height before the grid letterforms resolve
           — smaller than that and it is a smudge of a bird. -->
      <div class="flex flex-col items-center gap-5 text-center">
        <a
          :href="CMRD_URL"
          target="_blank"
          rel="noreferrer"
          class="group flex flex-col items-center gap-4"
        >
          <span class="eyebrow">Made by</span>
          <img
            src="/cmrd-logo.svg"
            alt="CMRD Consulting"
            width="395"
            height="327"
            class="cmrd-lockup h-16 w-auto opacity-70 transition-opacity duration-200 group-hover:opacity-100"
          />
        </a>

        <p class="prose-body max-w-sm !text-[13px]">
          CMRD Consulting is a boutique software engineering practice.
          <a :href="CMRD_URL" target="_blank" rel="noreferrer" class="link"
            >cmrd.dev</a
          >
        </p>
      </div>

      <div class="rule my-10" />

      <!-- The legal pair sits beside the copyright rather than in a column,
           which is where people look for it, and keeps both link columns at
           the length they were designed at. These are real pages at real
           paths — see the rollupOptions in vite.config.js. -->
      <div
        class="flex flex-col gap-3 font-mono text-[11px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} {{ LEGAL_ENTITY }}</p>
        <div class="flex items-center gap-3">
          <a href="/license/" class="nav-link">Licence</a>
          <span aria-hidden="true" class="text-zinc-800">·</span>
          <a href="/privacy-policy/" class="nav-link">Privacy policy</a>
          <span aria-hidden="true" class="text-zinc-800">·</span>
          <span>ratify.cmrd.dev</span>
        </div>
      </div>
    </div>
  </footer>
</template>
