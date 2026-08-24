<script setup>
import { computed } from "vue";
import { theme } from "../theme.js";

/**
 * A screenshot with its caption.
 *
 * Width and height are always set so the page does not reflow as the WebP
 * decodes. Stills are 1440×900, the settings window is 1440×1080, and the
 * animations are 1280×800. Everything below the fold loads lazily.
 *
 * Every screen is captured twice — `npm run shoot` drives the app once per
 * palette — and the two live at the same name under different directories:
 *
 *   /shots/inbox.webp          Nocturne
 *   /shots/light/inbox.webp    C · Slate
 *
 * so `src` names the screen and the theme picks the file. Swapping one <img>
 * rather than stacking two is what keeps only one palette's worth of bytes on
 * the wire; the cost is a fetch on the first switch, and `.shot` carries the
 * canvas colour underneath so what shows through in the meantime is the page
 * rather than a white hole.
 */
const props = defineProps({
  /** The Nocturne path. The light copy is derived from it — see above. */
  src: { type: String, required: true },
  /** Required — these images carry real information about the product. */
  alt: { type: String, required: true },
  caption: { type: String, default: "" },
  width: { type: Number, default: 1440 },
  height: { type: Number, default: 900 },
  eager: { type: Boolean, default: false },
});

const themed = computed(() =>
  theme.value === "light"
    ? props.src.replace("/shots/", "/shots/light/")
    : props.src,
);
</script>

<template>
  <figure class="m-0">
    <img
      class="shot"
      :src="themed"
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
