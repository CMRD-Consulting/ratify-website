<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import Wordmark from "./Wordmark.vue";

/**
 * The top bar, borrowing the app's own chrome: 56px tall, translucent
 * #0C0D0F at 80% over blur(16px), one hairline underneath.
 *
 * The hairline only appears once the page has moved, so the bar sits on the
 * hero without cutting a line across it.
 */
const scrolled = ref(false);
const onScroll = () => (scrolled.value = window.scrollY > 8);

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onUnmounted(() => window.removeEventListener("scroll", onScroll));

const nav = [
  { href: "#inbox", label: "The inbox" },
  { href: "#diffs", label: "Large PRs" },
  { href: "#keys", label: "Keyboard" },
  { href: "#who", label: "Who it's for" },
  { href: "#privacy", label: "Privacy" },
];
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200"
    :class="scrolled ? 'chrome-bar border-white/[0.06]' : 'border-transparent'"
    :style="{ height: 'var(--ratify-topbar-h)' }"
  >
    <div
      class="mx-auto flex h-full w-full max-w-[1180px] items-center gap-6 px-6 md:px-10"
    >
      <a href="#top" class="flex-none" aria-label="Ratify — home">
        <Wordmark :size="20" scale="md" />
      </a>

      <nav class="ml-2 hidden items-center gap-1 md:flex" aria-label="Sections">
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="nav-link rounded-md px-2.5 py-1.5 text-[13px] hover:bg-white/[0.06]"
          >{{ item.label }}</a
        >
      </nav>

      <!-- The install command does not fit a 56px bar and a badge for a store
           Ratify is not in yet would be worse than nothing, so the persistent
           call to action is a jump to the section that holds both. -->
      <div class="ml-auto flex items-center gap-3">
        <a href="#get" class="btn-chrome !h-8 !rounded-[8px] !px-3.5 !text-[13px]"
          >Install</a
        >
      </div>
    </div>
  </header>
</template>
