<script setup>
import Section from "../Section.vue";
import Shot from "../Shot.vue";
import Kbd from "../Kbd.vue";

/** Measured off the real queue this app was designed against. */
const stats = [
  { value: "~2,000", label: "median added lines" },
  { value: "31", label: "median files touched" },
  { value: "95", label: "files in the worst one" },
];

const risen = [
  "migrations",
  "money paths",
  "auth changes",
  "deleted tests",
];
const sunk = ["lockfiles", "generated code", "snapshots", "formatting churn"];
</script>

<template>
  <Section id="diffs">
    <div class="max-w-2xl">
      <p class="eyebrow">Large pull requests</p>
      <h2 class="h2 mt-4">
        Most pull requests are not one-glance approvals.
      </h2>
      <p class="prose-body mt-5">
        We pulled a real review queue before designing this. The assumption
        going in was “mostly small, mechanical, agent-authored changes that need
        a rubber stamp.” That is not what a queue looks like.
      </p>
    </div>

    <dl
      class="mt-10 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3"
      v-reveal
    >
      <div v-for="s in stats" :key="s.label" class="bg-cell px-6 py-7">
        <dt class="eyebrow">{{ s.label }}</dt>
        <dd
          class="mt-2 font-mono text-[2rem] leading-none tracking-tight text-zinc-100"
        >
          {{ s.value }}
        </dd>
      </div>
    </dl>

    <p class="prose-body mt-8 max-w-2xl">
      The bottleneck was never the approve button — it is building enough
      confidence to press it. So the file list
      <strong class="font-semibold text-zinc-200"
        >re-orders by risk instead of annotating it</strong
      >, and a 5,000-line diff arrives with its dangerous parts already at the
      top.
    </p>

    <div class="mt-8 grid gap-5 sm:grid-cols-2" v-reveal>
      <div class="card p-6">
        <h3 class="eyebrow !text-[color:var(--color-changes)]">Rises</h3>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li
            v-for="item in risen"
            :key="item"
            class="rounded-md border border-changes-border bg-changes-wash px-2 py-1 font-mono text-[11px] text-[color:var(--color-changes)]"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="card p-6">
        <h3 class="eyebrow">Recedes</h3>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li
            v-for="item in sunk"
            :key="item"
            class="rounded-md border border-hairline bg-fill-subtle px-2 py-1 font-mono text-[11px] text-zinc-500"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <!-- This line used to end "no model, no network" full stop, which stopped
         being the whole story when the review agent shipped. The resolution is
         the app's own: it stays true OF THE CLASSIFIER, said more precisely.
         Triage is the layer that works with no key, no budget and no
         connection, and the agent riding on top of it is why that matters. -->
    <p class="prose-body mt-6 max-w-2xl">
      The classifier itself is path globs only — no model, no network, nothing
      to configure. That is the layer that always works, and it stays that way:
      <a href="#agents" class="link">the review agent</a> reads in the order it
      produces and never replaces it. Both are advisory — a rule never hides a
      file, and never drops one from the viewed count.
    </p>

    <div class="mt-14" v-reveal>
      <Shot
        src="/shots/diff.webp"
        alt="A diff open in Ratify with the risk-ordered file manifest beside it: a migration at the top under a Needs eyes heading, the bulk of the change grouped below under Review."
        caption="The manifest groups by risk, then by weight. “Where the weight is” sits underneath, so you know the shape before you start."
      />
    </div>

    <div class="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div v-reveal>
        <h3 class="h3">Split view arrives on its own.</h3>
        <p class="prose-body mt-3">
          Above 1560px each side still holds a readable column, so it switches
          without being asked. <Kbd size="md">⇧S</Kbd> overrides it either way.
          <Kbd size="md">n</Kbd> steps to the next file;
          <Kbd size="md">v</Kbd> marks the current one viewed and moves to the
          next one that is not, so a clean pass never needs a second keystroke.
          Viewed state syncs back to GitHub, so a re-review resumes rather than
          restarts.
        </p>
      </div>
      <div v-reveal="90">
        <Shot
          src="/shots/split.webp"
          alt="Split view: removed lines on the left, added lines on the right, each side a readable column."
          caption="Split view, removals left and additions right."
        />
      </div>
    </div>
  </Section>
</template>
