<script setup>
import Section from "../Section.vue";
import BrewInstall from "../BrewInstall.vue";
import AppStoreButton from "../AppStoreButton.vue";
import QuarantineNote from "../QuarantineNote.vue";
import UpdateNote from "../UpdateNote.vue";
import Kbd from "../Kbd.vue";
import { RELEASES_URL, TAP_URL, REQUIREMENTS } from "../../site.js";
</script>

<template>
  <Section id="get">
    <!-- The gradient lives in site.css rather than in a style attribute here,
         because it is one of the few things on the page that cannot be
         expressed as a swapped token: a darkening in Nocturne has to become a
         lightening in Slate or the panel reads as a hole. -->
    <div
      class="cta-panel relative overflow-hidden rounded-2xl border border-hairline px-6 py-16 text-center md:px-12 md:py-20"
    >
      <p class="eyebrow">Get Ratify</p>
      <h2 class="h2 mx-auto mt-4 max-w-xl">
        Your queue is already loaded.
      </h2>
      <p class="lede mx-auto mt-5 max-w-lg">
        Summon it with <Kbd size="lg">⌃⌥L</Kbd>, clear what you can, and get
        back to what you were doing.
      </p>

      <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
        <BrewInstall />
      </div>

      <!-- No `brew tap` line above this one, and that is not an omission.
           Homebrew 6 refuses casks from a tap it has not been told to trust,
           and `brew install` records that trust only for a fully-qualified
           name — so the two-step version of this is not longer, it is broken.
           The command above is the one that works. -->
      <p class="mt-4 text-[12px] text-[var(--color-zinc-500)]">
        Adds and trusts the
        <a :href="TAP_URL" target="_blank" rel="noreferrer" class="link"
          >cmrd-consulting tap</a
        >
        on first install.
      </p>

      <!-- items-stretch, not items-center: the App Store badge is two lines of
           text and comes out 50px, the DMG button one line and 45.5px. Letting
           the shorter one stretch keeps them level without either hardcoding a
           height the badge would outgrow. -->
      <div class="mt-8 flex flex-wrap items-stretch justify-center gap-3">
        <a
          :href="RELEASES_URL"
          target="_blank"
          rel="noreferrer"
          class="btn-neutral !h-auto !rounded-[10px] px-4 py-3"
          >Download the DMG</a
        >
        <AppStoreButton variant="quiet" />
      </div>

      <QuarantineNote />

      <!-- After the first-launch note, not before it: that one describes a
           block that arrives a minute after the install command, this one
           describes a command nobody needs until there is a second release. -->
      <UpdateNote />

      <p class="mt-6 font-mono text-[11px] text-zinc-600">
        {{ REQUIREMENTS }}
      </p>
    </div>
  </Section>
</template>
