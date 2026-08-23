<script setup>
import Wordmark from "./Wordmark.vue";
import { CMRD_URL, REQUIREMENTS } from "../site.js";

const year = new Date().getFullYear();

const columns = [
  {
    title: "The app",
    links: [
      { href: "#inbox", label: "The review inbox" },
      { href: "#diffs", label: "Large pull requests" },
      { href: "#reviewing", label: "Reviewing" },
      { href: "#keys", label: "Keyboard" },
      { href: "#settings", label: "Configuration" },
    ],
  },
  {
    title: "Details",
    links: [
      { href: "#who", label: "Who it's for" },
      { href: "#trust", label: "Security" },
      { href: "#get", label: "Get Ratify" },
    ],
  },
];
</script>

<template>
  <footer class="border-t border-white/[0.06] px-6 pb-12 pt-16 md:px-10">
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
            class="h-16 w-auto opacity-70 transition-opacity duration-200 group-hover:opacity-100"
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

      <div
        class="flex flex-col gap-2 font-mono text-[11px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} CMRD Consulting LLC</p>
        <p>ratify.cmrd.dev</p>
      </div>
    </div>
  </footer>
</template>
