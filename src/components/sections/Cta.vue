<script setup>
import Section from "../Section.vue";
import AppStoreButton from "../AppStoreButton.vue";
import Kbd from "../Kbd.vue";
import { REQUIREMENTS } from "../../site.js";
</script>

<template>
  <Section id="get">
    <div
      class="relative overflow-hidden rounded-2xl border border-white/[0.08] px-6 py-16 text-center md:px-12 md:py-20"
      style="
        background-image:
          radial-gradient(
            620px 320px at 50% -10%,
            rgb(99 102 241 / 0.16),
            transparent 70%
          ),
          linear-gradient(180deg, rgb(24 24 27 / 0.7), rgb(12 13 15 / 0.7));
      "
    >
      <p class="eyebrow">Get Ratify</p>
      <h2 class="h2 mx-auto mt-4 max-w-xl">
        Your queue is already loaded.
      </h2>
      <p class="lede mx-auto mt-5 max-w-lg">
        Summon it with <Kbd size="lg">⌃⌥L</Kbd>, clear what you can, and get
        back to what you were doing.
      </p>

      <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
        <AppStoreButton />
      </div>

      <p class="mt-4 font-mono text-[11px] text-zinc-600">
        {{ REQUIREMENTS }}
      </p>
    </div>
  </Section>
</template>
