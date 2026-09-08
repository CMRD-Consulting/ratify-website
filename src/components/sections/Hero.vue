<script setup>
import Section from "../Section.vue";
import Shot from "../Shot.vue";
import FastPath from "../FastPath.vue";
import BrewInstall from "../BrewInstall.vue";
import { NOTARIZED, REQUIREMENTS } from "../../site.js";
</script>

<template>
  <Section id="top" class="!pt-32 md:!pt-40">
    <!-- min-w-0 on both columns: a grid item defaults to min-width:auto, so it
         refuses to shrink below its own min-content and overflows the track
         rather than compressing. Every min-w-0 further down is inert without
         this one, because nothing below is ever asked to fit. -->
    <div class="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <div class="min-w-0">
        <p class="eyebrow">A macOS review inbox</p>

        <h1 class="display mt-5">Approve pull requests in three keystrokes.</h1>

        <p class="lede mt-6 max-w-xl">
          GitHub takes about eight clicks and two page loads to approve a pull
          request. Ratify keeps the queue loaded, the top pull request selected,
          and every review action one keystroke away.
        </p>

        <!-- The second claim, and deliberately not folded into the first: the
             app is useful with no model at all, and the sentence that sells
             the agent must not imply otherwise. "Point it at" is doing that
             work — there is nothing configured out of the box. -->
        <p class="prose-body mt-4 max-w-xl">
          Point it at a model you own and it reads the queue before you do — a
          brief above the file list, findings as comments you accept or
          discard, and, where your rules allow it,
          <a href="#agents" class="link">reviews that happen while you sleep</a
          >.
        </p>

        <!-- The install line is the hero's call to action, and it is a
             command rather than a button because that is genuinely how this
             ships. The other channels live in #get, where someone who did not
             want a terminal has already scrolled past the argument for one. -->
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <BrewInstall />
          <a href="#inbox" class="btn-neutral !h-auto !rounded-[10px] px-4 py-3"
            >See how it works</a
          >
        </div>

        <!-- Most people copy the command from here and never reach #get,
             which is where the first-launch note lives. While Ratify is
             un-notarized that note is not a footnote — macOS refuses the
             first launch outright — so the hero points at it directly. It
             disappears with the note it points to. -->
        <p class="mt-4 font-mono text-[11px] text-zinc-600">
          {{ REQUIREMENTS }} ·
          <a href="#get" class="link">other ways to install</a>
          <template v-if="!NOTARIZED">
            ·
            <a href="#first-launch" class="link">opening it the first time</a>
          </template>
        </p>
      </div>

      <FastPath class="min-w-0 lg:mt-2" />
    </div>

    <div class="mt-16 md:mt-20" v-reveal>
      <Shot
        src="/shots/inbox.webp"
        alt="The Ratify inbox: a queue of pull requests on the left with check state, size tier and add/delete ratio; on the right the selected pull request with its risk-ordered file list and diff."
        caption="The review inbox. Queue on the left, pull request on the right, key hints along the bottom."
        eager
      />
    </div>
  </Section>
</template>
