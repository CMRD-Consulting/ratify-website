<script setup>
import Section from "../Section.vue";

/**
 * Where the code goes — as distinct from Trust below, which is about how the
 * credential is held.
 *
 * Every claim here is checkable against the app, and worded so it stays true.
 * Ratify plainly does read your diffs; that is the product. What it does not
 * do is copy them anywhere you did not point it, and that is the part worth
 * stating. Since 0.11.0 there is one place you can point it: a model provider
 * you add yourself, with your own key. Every sentence below is written with
 * that in mind, so none of them stops being true the day someone adds one.
 */
const claims = [
  {
    title: "There is no server of ours",
    body: "Ratify talks to api.github.com, and to a model provider only if you add one. No account to create, no backend to route through, nothing sitting between you and the code you already have access to.",
  },
  {
    title: "Nothing is stored but your settings",
    body: "Diffs live in memory for as long as the window is open and are gone when you quit. The only file Ratify writes is settings.json — your sections, rules, snippets, key bindings, the lenses you named and a ledger of what the agents ran and spent. No code, no diffs, no findings.",
  },
  {
    title: "No telemetry, at all",
    body: "No analytics, no crash reporting, no usage pings, no first-run beacon. Not off by default — not written.",
  },
  {
    title: "Nothing goes to a model you did not add",
    body: "Ratify ships with no model and no key of its own. The risk classifier that orders your files is still a list of path globs, evaluated on your machine in about a millisecond. Add a provider and the agents read pull requests through it; add none and nothing is asked.",
  },
  {
    title: "The window cannot reach the network",
    body: "The webview's own content-security policy permits connect-src 'self' and the local IPC bridge, and nothing else. Every request is made by the Rust layer, which knows GitHub's API, GitHub's device-login endpoint, and the origin of each provider you added. To that origin it sends the pull request's text and nothing else — with a key it reads from the Keychain and never hands to the window.",
  },
];
</script>

<template>
  <Section id="privacy">
    <div class="max-w-2xl">
      <p class="eyebrow">Privacy</p>
      <h2 class="h2 mt-4">Your code goes nowhere you did not point it.</h2>
      <p class="prose-body mt-5">
        Ratify reads your diffs — that is the job. It reads them from GitHub,
        which already has them, and draws them on your screen. It copies them
        nowhere, keeps them nowhere, and shows them to no one — until you add
        a model, and then to that model and to nothing else.
      </p>
    </div>

    <ul
      class="mt-12 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2"
    >
      <li
        v-for="(c, i) in claims"
        :key="c.title"
        class="bg-cell p-6"
        v-reveal="Math.min(i, 4) * 45"
      >
        <h3 class="h3">{{ c.title }}</h3>
        <p class="prose-body mt-2 !text-[13px]">{{ c.body }}</p>
      </li>

      <li class="bg-cell p-6">
        <h3 class="h3">Written down, not just claimed</h3>
        <p class="prose-body mt-2 !text-[13px]">
          These are properties of how the app is built rather than promises
          about how it is operated — there is nothing to operate. The hosts
          above are the entire network surface: GitHub's two, and the
          provider you chose.
        </p>
      </li>
    </ul>
  </Section>
</template>
