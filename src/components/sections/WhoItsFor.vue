<script setup>
import Section from "../Section.vue";

/** What changes about your day, rather than what the app contains. */
const benefits = [
  {
    title: "Reviewing stops being a context switch",
    body: "Summon, clear two or three, dismiss. A background poller keeps the queue current, so there is no page load to pay before you know whether a pull request costs you anything.",
  },
  {
    title: "Large changes become decidable",
    body: "You start at the migration instead of file 1 of 95, and viewed state — synced back to GitHub — means the second pass resumes rather than restarts.",
  },
  {
    title: "Nothing waits because it was tedious",
    body: "When the routine approvals cost three keystrokes, they stop pooling. The people you unblock get an answer the same morning instead of whenever the queue gets painful enough to clear.",
  },
  {
    title: "Request changes costs what approve costs",
    body: "Same size, same position, same keystroke. When the honest answer is no cheaper than the easy one, the easy one stops winning by default.",
  },
];

/** Who ends up using it, and what specifically does the work for them. */
const cases = [
  {
    who: "Leads who own a busy repository",
    body: "Six to twenty reviews a day, in bursts between other work. The menu-bar badge is the only thing that has to interrupt you; ⌃⌥L is how you answer it.",
  },
  {
    who: "Teams buried in bot and agent pull requests",
    body: "Dependabot, Renovate, and coding agents produce a steady stream of mechanical changes. Give them their own section, filter to them, and bulk approve from the palette.",
  },
  {
    who: "Monorepos and long-lived feature branches",
    body: "Diffs measured in thousands of lines across dozens of files. Risk ordering, a noise tier for generated code, split view above 1560px, and a weight breakdown by directory.",
  },
  {
    who: "Anyone doing their third pass on the same branch",
    body: "“Since my review” diffs against the commit you last looked at. Unresolved thread counts sit on the row, so a re-review starts from what actually moved.",
  },
];
</script>

<template>
  <Section id="who">
    <div class="max-w-2xl">
      <p class="eyebrow">Benefits</p>
      <h2 class="h2 mt-4">What you get back.</h2>
    </div>

    <div class="mt-10 grid gap-5 sm:grid-cols-2">
      <div
        v-for="(b, i) in benefits"
        :key="b.title"
        class="card p-6 md:p-7"
        v-reveal="i * 60"
      >
        <h3 class="h3">{{ b.title }}</h3>
        <p class="prose-body mt-3 !text-[13px]">{{ b.body }}</p>
      </div>
    </div>

    <div class="rule my-16" />

    <div class="max-w-2xl">
      <p class="eyebrow">Use cases</p>
      <h2 class="h2 mt-4">Who it is for.</h2>
      <p class="prose-body mt-5">
        Not for first-time contributors, and not for deep architectural review —
        that stays in the browser, and <code class="font-mono text-zinc-300">o</code>
        opens the pull request on github.com from anywhere in the app.
      </p>
    </div>

    <ul class="mt-10 space-y-px overflow-hidden rounded-xl border border-hairline bg-hairline">
      <li
        v-for="(c, i) in cases"
        :key="c.who"
        class="grid gap-2 bg-cell p-6 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-8 md:p-7"
        v-reveal="i * 50"
      >
        <h3 class="h3">{{ c.who }}</h3>
        <p class="prose-body !text-[13px]">{{ c.body }}</p>
      </li>
    </ul>
  </Section>
</template>
