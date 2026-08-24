<script setup>
import Section from "../Section.vue";
import Kbd from "../Kbd.vue";

/** The loop, as it actually runs on github.com. */
const browser = [
  "open the tab",
  "wait for it",
  "read the description",
  "skim the diff",
  "Files changed",
  "Review changes",
  "pick a radio button",
  'type "LGTM"',
  "Submit",
  "back to the list",
];

const app = [
  { key: "⌃⌥L", label: "summon" },
  { key: "j", label: "next" },
  { key: "a", label: "approve", tone: "approve" },
  { key: "⌘⏎", label: "submit" },
];
</script>

<template>
  <Section id="why">
    <div class="max-w-2xl">
      <p class="eyebrow">The problem</p>
      <h2 class="h2 mt-4">
        The approve button is not what makes reviewing slow.
      </h2>
      <p class="prose-body mt-5">
        The list you start from — notifications, or the pulls page — does not
        surface what you need in order to decide: check state, size, whether
        you have already looked at an earlier revision, how many threads are
        still open. So every pull request costs a page load before you know
        whether it costs anything at all.
      </p>
    </div>

    <div class="mt-12 grid gap-5 md:grid-cols-2">
      <div class="card p-6 md:p-7" v-reveal>
        <div class="flex items-baseline justify-between gap-4">
          <h3 class="h3 !text-zinc-400">On github.com</h3>
          <span class="font-mono text-[11px] text-zinc-600"
            >~8 clicks · 2 page loads</span
          >
        </div>
        <ol class="mt-5 space-y-2">
          <li
            v-for="(step, i) in browser"
            :key="step"
            class="flex items-baseline gap-3 font-mono text-[12px] text-zinc-500"
          >
            <span class="w-4 flex-none text-right text-zinc-700">{{
              i + 1
            }}</span>
            <span>{{ step }}</span>
          </li>
        </ol>
        <p class="mt-5 font-mono text-[11px] text-zinc-700">…then repeat.</p>
      </div>

      <div class="card p-6 md:p-7" v-reveal="90">
        <div class="flex items-baseline justify-between gap-4">
          <h3 class="h3">In Ratify</h3>
          <span class="font-mono text-[11px] text-zinc-600"
            >3 keystrokes · 0 page loads</span
          >
        </div>
        <ol class="mt-5 space-y-3">
          <li
            v-for="step in app"
            :key="step.key"
            class="flex items-baseline gap-3"
          >
            <span class="flex w-14 flex-none justify-start">
              <Kbd :tone="step.tone || 'neutral'" size="md">{{ step.key }}</Kbd>
            </span>
            <span
              class="font-mono text-[13px]"
              :class="
                step.tone === 'approve'
                  ? 'text-[color:var(--color-approve-text)]'
                  : 'text-zinc-200'
              "
              >{{ step.label }}</span
            >
          </li>
        </ol>
        <p class="prose-body mt-6 !text-[13px]">
          A background poller keeps the queue fresh, so summoning the window
          costs nothing. Submitting advances to the next pull request on its
          own — the loop has no return trip.
        </p>
      </div>
    </div>
  </Section>
</template>
