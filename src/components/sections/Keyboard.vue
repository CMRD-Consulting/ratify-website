<script setup>
import Section from "../Section.vue";
import Shot from "../Shot.vue";
import Kbd from "../Kbd.vue";
</script>

<template>
  <Section id="keys">
    <div class="max-w-2xl">
      <p class="eyebrow">Keyboard</p>
      <h2 class="h2 mt-4">Every action has a key.</h2>
      <p class="prose-body mt-5">
        <Kbd size="md">⌘K</Kbd> carries the compound and rare actions that never
        earned a keystroke of their own — approve-and-merge, bulk approve,
        approve-anyway — scoped to the pull request you are looking at.
        <Kbd size="md">?</Kbd> shows the full keymap. And the bottom rail shows
        only the keys that are valid right now, so it is context rather than a
        cheat sheet: on a proposed comment it reads
        <Kbd size="md">⏎</Kbd> accept · <Kbd size="md">x</Kbd> discard ·
        <Kbd size="md">e</Kbd> edit, and nowhere else.
      </p>
    </div>

    <div class="mt-12 grid gap-6 lg:grid-cols-2">
      <div v-reveal>
        <Shot
          src="/shots/palette.webp"
          alt="The Ratify command palette, listing actions scoped to the selected pull request with their key hints."
          caption="⌘K — the palette, scoped to the selected pull request."
        />
      </div>
      <div v-reveal="90">
        <Shot
          src="/shots/keymap.webp"
          alt="The keyboard overlay in Ratify, showing every binding grouped by what it acts on."
          caption="? — the full keymap. Bindings are yours to change."
        />
      </div>
    </div>

    <div class="mt-14" v-reveal>
      <Shot
        src="/shots/diff-motion.webp"
        alt="The queue collapsing to a rail and the risk-ordered file list being stepped through one file at a time with n."
        caption="Collapse the queue, then step the risk-ordered file list with n."
        :width="1280"
        :height="800"
      />
    </div>
  </Section>
</template>
