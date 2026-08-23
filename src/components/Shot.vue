<script setup>
/**
 * A screenshot with its caption.
 *
 * Width and height are always set so the page does not reflow as the WebP
 * decodes. Stills are 1440×900, the settings window is 1440×1080, and the
 * animations are 1280×800. Everything below the fold loads lazily.
 */
defineProps({
  src: { type: String, required: true },
  /** Required — these images carry real information about the product. */
  alt: { type: String, required: true },
  caption: { type: String, default: "" },
  width: { type: Number, default: 1440 },
  height: { type: Number, default: 900 },
  eager: { type: Boolean, default: false },
});
</script>

<template>
  <figure class="m-0">
    <img
      class="shot"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
    />
    <figcaption
      v-if="caption"
      class="mt-3 font-mono text-[11px] leading-relaxed text-zinc-600"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
