<script setup>
/**
 * Mark + wordmark, the app's lockup.
 *
 * The mark is a wireframe with its colour baked into the file, which is why it
 * renders as an <img> rather than an inline SVG tinted by currentColor. It is
 * scaled by height only — its 0.799 aspect does not survive rounding a computed
 * width — and it is never used below 18px, where the wordmark stands alone.
 */
defineProps({
  /** Mark height in px. Below 18 the mark is dropped and only the word shows. */
  size: { type: Number, default: 22 },
  /** "sm" | "md" | "lg" — the wordmark's own tracking table. */
  scale: { type: String, default: "md" },
});
</script>

<template>
  <span class="flex items-center gap-2.5">
    <img
      v-if="size >= 18"
      src="/ratify-mark.svg"
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
