<script setup>
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
import Hero from "./components/sections/Hero.vue";
import Problem from "./components/sections/Problem.vue";
import Features from "./components/sections/Features.vue";
import Inbox from "./components/sections/Inbox.vue";
import LargeDiffs from "./components/sections/LargeDiffs.vue";
import Reviewing from "./components/sections/Reviewing.vue";
import Keyboard from "./components/sections/Keyboard.vue";
import Configure from "./components/sections/Configure.vue";
import WhoItsFor from "./components/sections/WhoItsFor.vue";
import Trust from "./components/sections/Trust.vue";
import Cta from "./components/sections/Cta.vue";
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-[#18181B] focus:px-3 focus:py-2 focus:text-[13px] focus:!text-zinc-100"
    >Skip to content</a
  >

  <SiteHeader />

  <main id="main">
    <Hero />
    <Problem />
    <Features />
    <Inbox />
    <LargeDiffs />
    <Reviewing />
    <Keyboard />
    <Configure />
    <WhoItsFor />
    <Trust />
    <Cta />
  </main>

  <SiteFooter />
</template>
