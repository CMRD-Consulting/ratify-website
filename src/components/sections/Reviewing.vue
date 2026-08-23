<script setup>
import Section from "../Section.vue";
import Shot from "../Shot.vue";
import Kbd from "../Kbd.vue";
</script>

<template>
  <Section id="reviewing">
    <div class="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
      <div v-reveal>
        <Shot
          src="/shots/approve.webp"
          alt="The review composer in Ratify, with approve, request changes and comment presented at the same size beside each other."
          caption="Approve is the only solid-filled button in the app."
        />
      </div>

      <div>
        <p class="eyebrow">Reviewing</p>
        <h2 class="h2 mt-4">Request changes is not a failure state.</h2>

        <p class="prose-body mt-5">
          It sits beside approve at the same size and the same keystroke cost,
          because it is an equally normal outcome. Approve gets the only solid
          fill in the app — that is the whole budget for the colour, which is
          why pressing it means something.
        </p>

        <p class="prose-body mt-4">
          Inline comments accumulate into a pending review exactly the way
          GitHub models them, and go out with the approve, request-changes or
          comment event. Replies to existing threads send immediately — two
          things that look alike and behave differently, so each card says
          which it is.
        </p>

        <div class="card mt-8 p-6">
          <h3 class="h3">Undo is real.</h3>
          <p class="prose-body mt-3 !text-[13px]">
            GitHub cannot un-submit a review. So
            <Kbd size="md">⌘Z</Kbd> within six seconds cancels the queued
            mutation <em class="not-italic text-zinc-300">before it fires</em>.
            After six seconds the affordance disappears rather than lying about
            what it can still do.
          </p>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-2">
          <Kbd tone="approve" size="md">a</Kbd>
          <span class="font-mono text-[12px] text-zinc-500">approve</span>
          <span class="mx-1 text-zinc-800">·</span>
          <Kbd tone="changes" size="md">r</Kbd>
          <span class="font-mono text-[12px] text-zinc-500"
            >request changes</span
          >
          <span class="mx-1 text-zinc-800">·</span>
          <Kbd size="md">c</Kbd>
          <span class="font-mono text-[12px] text-zinc-500">comment</span>
          <span class="mx-1 text-zinc-800">·</span>
          <Kbd size="md">m</Kbd>
          <span class="font-mono text-[12px] text-zinc-500">merge</span>
        </div>
      </div>
    </div>

    <div class="mt-16" v-reveal>
      <Shot
        src="/shots/approve-motion.webp"
        alt="Moving down the queue with j, pressing a to approve, and the pull request leaving the list as the next one selects itself."
        caption="Down the queue with j, approve with a, submit — and the pull request leaves the list."
        :width="1280"
        :height="800"
      />
    </div>
  </Section>
</template>
