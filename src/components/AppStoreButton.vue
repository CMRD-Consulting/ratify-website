<script setup>
import AppleGlyph from "./AppleGlyph.vue";
import { APP_STORE_URL, RELEASED } from "../site.js";

/**
 * The download button.
 *
 * Indigo, not mint. Mint is a verdict in this system and this is chrome — the
 * same rule that keeps approve the only solid-mint surface in the app.
 *
 * Apple's own black badge would vanish on a #09090B canvas, so this is the
 * badge redrawn in Nocturne. Swap it for the official artwork at release if
 * App Store marketing guidelines call for it.
 */
defineProps({
  /** "primary" is the filled indigo button; "quiet" is the neutral one. */
  variant: { type: String, default: "primary" },
});
</script>

<template>
  <a
    :href="APP_STORE_URL"
    class="group relative !h-auto gap-3 !rounded-[10px] px-4 py-2.5"
    :class="variant === 'primary' ? 'btn-chrome' : 'btn-neutral'"
  >
    <AppleGlyph class="h-[22px] w-[22px] flex-none opacity-95" />
    <span class="flex flex-col items-start leading-none">
      <span
        class="text-[10px] font-normal tracking-wide opacity-75"
        :class="variant === 'primary' ? 'text-white' : 'text-zinc-400'"
        >Download on the</span
      >
      <span class="mt-[3px] text-[15px] font-semibold tracking-[-0.01em]"
        >Mac App Store</span
      >
    </span>
    <!-- Honest while the link is a placeholder; one flag flips it off. -->
    <span
      v-if="!RELEASED"
      class="ml-1 rounded-full border border-white/25 px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.09em] opacity-80"
      >Soon</span
    >
  </a>
</template>
