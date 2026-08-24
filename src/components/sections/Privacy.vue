<script setup>
import Section from "../Section.vue";

/**
 * Where the code goes — as distinct from Trust below, which is about how the
 * credential is held.
 *
 * Every claim here is checkable against the app, and worded so it stays true.
 * Ratify plainly does read your diffs; that is the product. What it does not
 * do is copy them anywhere, and that is the part worth stating.
 */
const claims = [
  {
    title: "There is no server of ours",
    body: "Ratify talks to api.github.com and nothing else. No account to create, no backend to route through, nothing sitting between you and the code you already have access to.",
  },
  {
    title: "Nothing is stored but your settings",
    body: "Diffs live in memory for as long as the window is open and are gone when you quit. The only file Ratify writes is settings.json — your sections, triage rules, snippets and key bindings. No code, no diffs, no history.",
  },
  {
    title: "No telemetry, at all",
    body: "No analytics, no crash reporting, no usage pings, no first-run beacon. Not off by default — not written.",
  },
  {
    title: "Nothing is sent to a model",
    body: "There is no AI in Ratify. The risk classifier that orders your files is a list of path globs, evaluated on your machine in about a millisecond.",
  },
  {
    title: "The window cannot reach the network",
    body: "The webview's own content-security policy permits connect-src 'self' and the local IPC bridge, and nothing else. Every request is made by the Rust layer, which knows two hosts: GitHub's API, and GitHub's device-login endpoint.",
  },
];
</script>

<template>
  <Section id="privacy">
    <div class="max-w-2xl">
      <p class="eyebrow">Privacy</p>
      <h2 class="h2 mt-4">Your code never leaves your machine.</h2>
      <p class="prose-body mt-5">
        Ratify reads your diffs — that is the job. It reads them from GitHub,
        which already has them, and draws them on your screen. It copies them
        nowhere, keeps them nowhere, and shows them to no one.
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
          about how it is operated — there is nothing to operate. The two
          hosts above are the entire network surface.
        </p>
      </li>
    </ul>
  </Section>
</template>
