<script setup>
import { ref } from "vue";
import { PREFERENCES, choose, themePreference } from "../theme.js";

/**
 * System · Light · Dark, in the app's own order.
 *
 * Three states rather than a two-way flip, because "light and dark, or
 * neither" is one of the things this page claims and a switcher that cannot
 * follow the OS quietly contradicts it.
 *
 * The glyphs are drawn on the same 24×24 grid at the same 1.5px stroke as the
 * feature icons, so the set reads as one weight. Labels are visually hidden
 * rather than absent — an icon-only control still has to say what it is.
 */
const GLYPHS = {
  system:
    '<rect x="2.75" y="4" width="18.5" height="12.5" rx="1.75"/><path d="M8.5 20.5h7M12 16.5v4"/>',
  light:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2.75v2M12 19.25v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M2.75 12h2M19.25 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4"/>',
  dark: '<path d="M20 13.4A8.2 8.2 0 1 1 10.6 4a6.6 6.6 0 0 0 9.4 9.4z"/>',
};

const LABELS = { system: "System", light: "Light", dark: "Dark" };

/**
 * A radiogroup, not three toggle buttons: this is one mutually exclusive
 * choice, and a screen reader should hear "2 of 3" rather than three unrelated
 * pressed states.
 *
 * That brings roving tabindex with it — the group is one tab stop and the
 * arrows move within it, which is what the pattern requires and what anyone
 * arriving by keyboard will try. Focus is taken off the DOM rather than off an
 * array of template refs, whose order Vue explicitly does not guarantee.
 */
const group = ref(null);

function move(index, step) {
  const next = (index + step + PREFERENCES.length) % PREFERENCES.length;
  choose(PREFERENCES[next]);
  group.value?.querySelectorAll('[role="radio"]')[next]?.focus();
}
</script>

<template>
  <div
    ref="group"
    class="flex items-center gap-0.5 rounded-[9px] border border-hairline bg-fill-subtle p-0.5"
    role="radiogroup"
    aria-label="Colour theme"
  >
    <button
      v-for="(value, i) in PREFERENCES"
      :key="value"
      type="button"
      role="radio"
      :aria-checked="themePreference === value"
      :tabindex="themePreference === value ? 0 : -1"
      :title="LABELS[value]"
      class="theme-segment"
      :class="themePreference === value && 'is-active'"
      @click="choose(value)"
      @keydown.right.prevent="move(i, 1)"
      @keydown.down.prevent="move(i, 1)"
      @keydown.left.prevent="move(i, -1)"
      @keydown.up.prevent="move(i, -1)"
    >
      <!-- Static, author-written markup — no user input reaches this. -->
      <svg
        class="h-[15px] w-[15px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        v-html="GLYPHS[value]"
      />
      <span class="sr-only">{{ LABELS[value] }}</span>
    </button>
  </div>
</template>
