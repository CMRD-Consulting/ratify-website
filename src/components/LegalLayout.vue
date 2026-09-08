<script setup>
import Wordmark from "./Wordmark.vue";
import ThemeToggle from "./ThemeToggle.vue";
import SiteFooter from "./SiteFooter.vue";
import { LEGAL_EFFECTIVE } from "../site.js";

/**
 * The chrome around /license/ and /privacy-policy/.
 *
 * Deliberately NOT SiteHeader: that bar carries the landing page's section
 * nav, and every one of those links is a `#hash` that means nothing here —
 * they would resolve against the current URL and go nowhere. So the bar keeps
 * the wordmark, the switcher and one link back to the page the nav belongs
 * to, and drops the rest. The footer is shared unchanged, because its links
 * are absolute paths and its hashes are prefixed (see SiteFooter).
 *
 * The measure is narrower than the landing page's 1180px column. Legal prose
 * is read rather than scanned, and a 1180px line of 13px text is unreadable
 * in the way that makes people stop reading — which for a document whose
 * whole purpose is to be read is a functional failure, not an aesthetic one.
 */
defineProps({
  /** Document title, rendered as the h1 and expected to match <title>. */
  title: { type: String, required: true },
  /** One sentence under the title, in place of an abstract. */
  standfirst: { type: String, default: "" },
});
</script>

<template>
  <a
    href="#doc"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-surface-sheet focus:px-3 focus:py-2 focus:text-[13px] focus:!text-zinc-100"
    >Skip to content</a
  >

  <header
    class="chrome-bar fixed inset-x-0 top-0 z-50 border-b border-hairline"
    :style="{ height: 'var(--ratify-topbar-h)' }"
  >
    <div
      class="mx-auto flex h-full w-full max-w-[1180px] items-center gap-6 px-6 md:px-10"
    >
      <a href="/" class="flex-none" aria-label="Ratify — home">
        <Wordmark :size="20" scale="md" />
      </a>

      <div class="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <a href="/" class="nav-link whitespace-nowrap text-[13px]"
          >← Back to Ratify</a
        >
      </div>
    </div>
  </header>

  <main id="doc" class="px-6 pb-24 pt-32 md:px-10 md:pt-40">
    <div class="mx-auto w-full max-w-2xl">
      <p class="eyebrow">{{ LEGAL_EFFECTIVE }}</p>
      <h1 class="h2 mt-4">{{ title }}</h1>
      <p v-if="standfirst" class="lede mt-5">{{ standfirst }}</p>

      <div class="rule my-10" />

      <div class="legal-prose">
        <slot />
      </div>
    </div>
  </main>

  <SiteFooter />
</template>
