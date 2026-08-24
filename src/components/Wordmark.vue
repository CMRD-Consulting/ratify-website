<script setup>
import { computed } from "vue";
import { theme } from "../theme.js";

/**
 * Mark + wordmark, the app's lockup.
 *
 * The mark is a wireframe with its colour baked into the file, which is why it
 * renders as an <img> rather than an inline SVG tinted by currentColor. It is
 * scaled by height only — its 0.799 aspect does not survive rounding a computed
 * width — and it is never used below 18px, where the wordmark stands alone.
 *
 * Baked-in colour is also why there are two files rather than one. Indigo-400
 * is 2.55:1 on Slate's canvas, which is a smudge rather than a mark; the light
 * copy is indigo-600, straight off `--color-brand` in the light palette — the
 * value the app's own token file annotates "the mark on light". Nothing is
 * re-picked here. Regenerate it with:
 *
 *   sed 's/#818CF8/#4F46E5/g' public/ratify-mark.svg > public/ratify-mark-light.svg
 */
defineProps({
  /** Mark height in px. Below 18 the mark is dropped and only the word shows. */
  size: { type: Number, default: 22 },
  /** "sm" | "md" | "lg" — the wordmark's own tracking table. */
  scale: { type: String, default: "md" },
});

const mark = computed(() =>
  theme.value === "light" ? "/ratify-mark-light.svg" : "/ratify-mark.svg",
);
</script>

<template>
  <span class="flex items-center gap-2.5">
    <img
      v-if="size >= 18"
      :src="mark"
      alt=""
      aria-hidden="true"
      class="flex-none select-none"
      :style="{ height: `${size}px`, width: 'auto' }"
    />
    <span
      class="wordmark text-zinc-100"
      :class="`wordmark-${scale}`"
    >Ratify</span>
  </span>
</template>
