<script setup>
/**
 * Vertical rhythm and the measure. Every section on the page goes through
 * this — don't hand-roll a <section> with its own padding.
 */
defineProps({
  id: { type: String, default: undefined },
  /** "wide" is the default 1200px column; "narrow" is a reading measure. */
  width: { type: String, default: "wide" },
  /** Tighter top padding when a section continues the one above it. */
  tight: { type: Boolean, default: false },
});
</script>

<template>
  <section :id="id" class="relative px-6 md:px-10" :class="tight ? 'py-12 md:py-16' : 'py-20 md:py-28'">
    <div
      class="mx-auto w-full"
      :class="width === 'narrow' ? 'max-w-3xl' : 'max-w-[1180px]'"
    >
      <slot />
    </div>
  </section>
</template>
