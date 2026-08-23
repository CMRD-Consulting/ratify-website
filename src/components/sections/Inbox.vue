<script setup>
import Section from "../Section.vue";
import Shot from "../Shot.vue";
import Kbd from "../Kbd.vue";

const sections = [
  { key: "1", label: "Needs my review" },
  { key: "2", label: "My teams" },
  { key: "3", label: "Re-review" },
  { key: "4", label: "Mine" },
];
</script>

<template>
  <Section id="inbox">
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <p class="eyebrow">The review inbox</p>
        <h2 class="h2 mt-4">A queue, not a notifications page.</h2>

        <p class="prose-body mt-5">
          Four search-backed sections, switched with the number keys. Each row
          shows only what it takes to answer one question —
          <em class="not-italic text-zinc-300"
            >can I stamp this, or is this a sit-down job</em
          >: check state, size tier, the add/delete ratio, author, age, and
          unresolved threads.
        </p>

        <ul class="mt-6 flex flex-wrap gap-2">
          <li v-for="s in sections" :key="s.key" class="pill !cursor-default">
            <Kbd>{{ s.key }}</Kbd>
            <span class="text-zinc-300">{{ s.label }}</span>
          </li>
        </ul>

        <p class="prose-body mt-6">
          Every search is pinned to the repositories you watch, because a query
          without its own <code class="font-mono text-zinc-300">repo:</code> or
          <code class="font-mono text-zinc-300">org:</code> searches all of
          GitHub — github.com quietly scopes your searches, and the API does
          not.
        </p>

        <p class="prose-body mt-4">
          Most days you care about one repository. Filter to it from the top
          bar and the section counts, the menu-bar badge and the queue all
          follow. With a filter on, the queue says how many rows it is holding
          back and offers to show them.
        </p>
      </div>

      <div v-reveal>
        <Shot
          src="/shots/repo-motion.webp"
          alt="The repository filter opening, narrowing as characters are typed, and the queue re-filtering to match."
          caption="Type to narrow, ⏎ to pick. The counts and the badge follow."
          :width="1280"
          :height="800"
        />
      </div>
    </div>
  </Section>
</template>
