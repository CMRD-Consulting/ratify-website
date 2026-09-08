<script setup>
import { computed } from "vue";
import { GOVERNING_LAW, LEGAL_CONTACT } from "../site.js";

/**
 * A banner at the top of either legal document while a placeholder in
 * `site.js` is still unfilled.
 *
 * Same idea as NOTARIZED gating the first-launch note: a fact that is not
 * true yet should be visible on the page rather than tracked in someone's
 * head. A licence naming the State of [STATE] and an address that bounces is
 * not a licence, and the failure mode without this is that it ships looking
 * finished — every placeholder is deep inside a wall of grey text that nobody
 * reads, which is exactly why nobody would catch it.
 *
 * It disappears on its own the moment the last placeholder is filled in.
 * There is nothing to remember to remove.
 */
const placeholders = computed(() =>
  [
    { label: "Governing law", value: GOVERNING_LAW },
    { label: "Contact address", value: LEGAL_CONTACT },
  ].filter((f) => f.value.trim().startsWith("[")),
);
</script>

<template>
  <div
    v-if="placeholders.length"
    class="callout"
    role="note"
    aria-label="Draft notice"
  >
    <p class="!mt-0 font-semibold text-[color:var(--color-changes)]">
      Draft — not yet in force
    </p>
    <p class="!mt-2">
      This document is unfinished and should not be relied on. It still
      contains {{ placeholders.length === 1 ? "a placeholder" : "placeholders" }}
      for
      <template v-for="(f, i) in placeholders" :key="f.label"
        ><template v-if="i > 0">{{
          i === placeholders.length - 1 ? " and " : ", "
        }}</template
        >{{ f.label.toLowerCase() }}</template
      >, and it has not been reviewed by a lawyer. Set the values in
      <code>src/site.js</code> and have it reviewed before treating it as
      binding.
    </p>
  </div>
</template>
