<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import Wordmark from "./Wordmark.vue";
import ThemeToggle from "./ThemeToggle.vue";

/**
 * The top bar, borrowing the app's own chrome: 56px tall, `--color-chrome` at
 * 80% over blur(16px), one hairline underneath.
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
  { href: "#agents", label: "Agents" },
  { href: "#keys", label: "Keyboard" },
  { href: "#who", label: "Who it's for" },
  { href: "#privacy", label: "Privacy" },
];
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200"
    :class="scrolled ? 'chrome-bar border-hairline' : 'border-transparent'"
    :style="{ height: 'var(--ratify-topbar-h)' }"
  >
    <div
      class="mx-auto flex h-full w-full max-w-[1180px] items-center gap-6 px-6 md:px-10"
    >
      <a href="#top" class="flex-none" aria-label="Ratify — home">
        <Wordmark :size="20" scale="md" />
      </a>

      <!-- lg, not md. At 768px the six labels are squeezed into ~386px and
           wrap mid-label — "Who it's / for" over two lines inside a 56px bar.
           That was already happening at five and adding Agents made it worse,
           so the breakpoint moves rather than the labels being abbreviated:
           the bar is chrome borrowed from the app and a two-line nav inside it
           is worse than no nav on a screen that scrolls anyway. whitespace-
           nowrap keeps it a wrapping failure rather than a silent squeeze if a
           seventh item is ever added. -->
      <nav class="ml-2 hidden items-center gap-1 lg:flex" aria-label="Sections">
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="nav-link whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] hover:bg-fill"
          >{{ item.label }}</a
        >
      </nav>

      <!-- The install command does not fit a 56px bar and a badge for a store
           Ratify is not in yet would be worse than nothing, so the persistent
           call to action is a jump to the section that holds both.

           The switcher goes before it and stays quiet, which is the order of
           business: someone arrives to find out what this is, not to pick a
           palette. It is here at all because the page claims the app has
           one. -->
      <div class="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <a href="#get" class="btn-chrome !h-8 !rounded-[8px] !px-3.5 !text-[13px]"
          >Install</a
        >
      </div>
    </div>
  </header>
</template>
