<script setup>
import Section from "../Section.vue";
import Shot from "../Shot.vue";
import FastPath from "../FastPath.vue";
import AppStoreButton from "../AppStoreButton.vue";
import { REQUIREMENTS } from "../../site.js";
</script>

<template>
  <Section id="top" class="!pt-32 md:!pt-40">
    <div class="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <div>
        <p class="eyebrow">A macOS review inbox</p>

        <h1 class="display mt-5">Approve pull requests in three keystrokes.</h1>

        <p class="lede mt-6 max-w-xl">
          GitHub takes about eight clicks and two page loads to approve a pull
          request. Ratify keeps the queue loaded, the top pull request selected,
          and every review action one keystroke away.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <AppStoreButton />
          <a href="#inbox" class="btn-neutral !h-auto !rounded-[10px] px-4 py-3"
            >See how it works</a
          >
        </div>

        <p class="mt-4 font-mono text-[11px] text-zinc-600">
          {{ REQUIREMENTS }}
        </p>
      </div>

      <FastPath class="lg:mt-2" />
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
