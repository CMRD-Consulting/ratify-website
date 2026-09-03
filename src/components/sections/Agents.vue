<script setup>
import Section from "../Section.vue";
import Kbd from "../Kbd.vue";

/**
 * Reviewing with agents, as shipped in 0.11.0. Every claim here is checkable
 * against the app's README ("Reviewing with agents") and is worded to stay
 * true: the agents are off until a provider is added, and what they send
 * goes to that provider and nowhere else.
 *
 * The four levels are the app's own words, in the app's own order.
 */
const levels = [
  { level: "off", body: "nothing runs" },
  { level: "brief", body: "a summary when you open it" },
  { level: "draft", body: "held comments when you open it" },
  { level: "auto", body: "reviewed in the background, approved if nothing blocks" },
];
</script>

<template>
  <Section id="agents">
    <div class="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <p class="eyebrow">Agents</p>
        <h2 class="h2 mt-4">It can read the pull request before you do.</h2>

        <p class="prose-body mt-5">
          Bring your own model. Any Anthropic or OpenAI-compatible endpoint —
          Anthropic, OpenRouter, Groq, Together, a local Ollama — with your own
          key. The key goes into the macOS Keychain beside your GitHub token,
          bound to the origin you entered it for, and the Rust side is the only
          thing that can read it. Nothing runs until you add one.
        </p>

        <p class="prose-body mt-4">
          Lenses are the agents. A lens is a named perspective with a prompt
          and a model of its own; Correctness, Security and Tests ship as
          defaults. Every lens on one model shares one prompt-cache write, so
          four lenses cost about one and a half reviews rather than four.
        </p>

        <p class="prose-body mt-4">
          A rules table decides how far they go. Agent rules is a fourth table
          beside triage and status rules, with the files' risk tier as an extra
          field. First match wins, and the match is a level:
        </p>

        <dl
          class="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-xl border border-hairline bg-fill-subtle px-5 py-4"
        >
          <template v-for="l in levels" :key="l.level">
            <dt class="font-mono text-[12px] text-zinc-200">{{ l.level }}</dt>
            <dd class="prose-body !text-[13px]">{{ l.body }}</dd>
          </template>
        </dl>

        <p class="prose-body mt-5">
          The default table is one line, everything → <span class="font-mono text-[13px] text-zinc-300">brief</span>.
          <span class="font-mono text-[13px] text-zinc-300">auto</span> is never
          on until you say so.
        </p>
      </div>

      <div>
        <div class="card p-6" v-reveal>
          <h3 class="h3">The brief is row zero.</h3>
          <p class="prose-body mt-3 !text-[13px]">
            With a run for the open pull request, the file manifest gets a row
            above the first file: what each lens concluded, findings by
            severity with the line each points at, and how much of the pull
            request was read within the budget.
            <Kbd size="md">n</Kbd> from the top lands on it before the first
            file.
          </p>
          <p class="prose-body mt-3 !text-[13px]">
            At <span class="font-mono text-zinc-300">draft</span>, each
            anchored finding is a proposed comment in the pending review.
            <Kbd size="md">t</Kbd> walks them with the real threads,
            <Kbd size="md">⏎</Kbd> accepts one, <Kbd size="md">x</Kbd> discards
            it, and <Kbd size="md">e</Kbd> opens it in the composer to rewrite.
            A review carries only what you accepted — a comment nobody read
            never goes out under your name.
          </p>
        </div>

        <div class="card mt-6 p-6" v-reveal="90">
          <h3 class="h3">
            <span class="font-mono">auto</span> approves for you, carefully.
          </h3>
          <p class="prose-body mt-3 !text-[13px]">
            A sweep runs off every queue refresh. Every lens finished and no
            blocker: it approves, naming the commit it reviewed, with a body
            that says a machine helped and who is responsible. A blocker holds
            it. Anything unfinished halts it. A pull request open in front of
            you is never approved under your nose.
          </p>
          <p class="prose-body mt-3 !text-[13px]">
            A daily ceiling stops background runs for the day; the runs you
            ask for by opening a pull request ignore it. A banner is the record
            of what happened while you were away, and
            <Kbd size="md">⌘K</Kbd> → Stop agent review stops a run down to the
            request in flight.
          </p>
        </div>
      </div>
    </div>

    <p class="prose-body mt-12 max-w-2xl">
      What leaves your machine is the pull request's description, its diffs,
      and as many file bodies as the budget holds —
      <strong class="font-semibold text-zinc-200"
        >sent to the provider you configured, and to nothing else</strong
      >.
    </p>
  </Section>
</template>
