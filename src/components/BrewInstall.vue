<script setup>
import { ref, onUnmounted } from "vue";
import { BREW_COMMAND } from "../site.js";

/**
 * The install line, as something you copy rather than something you read.
 *
 * Indigo, not mint. Mint is a verdict in this system and this is chrome — the
 * same rule that keeps approve the only solid-mint surface in the app.
 *
 * The whole panel is the button, not just the pill on the end of it: people
 * click the command itself, and a click that lands two pixels off the pill and
 * does nothing reads as broken rather than as a miss. The pill stays because
 * it is what says the thing is clickable at all.
 */

/**
 * Split at the last space so the cask spec cannot be broken across lines.
 * Left to itself the browser breaks at the hyphen in "cmrd-consulting", and
 * `brew install cmrd-` above `consulting/tap/ratify` reads like the name has a
 * newline in it. The spec is 183px at every width the panel reaches, so the
 * space is always a break that works.
 */
const lastSpace = BREW_COMMAND.lastIndexOf(" ");
const commandHead = BREW_COMMAND.slice(0, lastSpace);
const commandTail = BREW_COMMAND.slice(lastSpace + 1);

const copied = ref(false);
let timer = null;

async function copy() {
  try {
    await navigator.clipboard.writeText(BREW_COMMAND);
  } catch {
    // Clipboard access can be refused — an insecure origin, a locked-down
    // browser. Selecting the text is the fallback that always works, which is
    // why the command keeps `select-text` despite living inside a button.
    return;
  }

  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 1800);
}

onUnmounted(() => clearTimeout(timer));
</script>

<template>
  <!--
    Two layouts. Below `sm` the pill drops beneath the command, because at
    320px there is about 226px of room on one line and the command wants ~274.
    Above `sm` it is one row, 46px tall to match the neutral buttons beside it.

    The command wraps rather than scrolls. A scroller hides half a command
    behind a gesture with no affordance for it; wrapped at its one space, both
    halves stay on screen. There is nothing to wrap above `sm`, where the panel
    is only ever as wide as its contents.
  -->
  <button
    type="button"
    :aria-label="`Copy the install command: ${BREW_COMMAND}`"
    class="panel group flex w-full min-w-0 max-w-full cursor-pointer flex-col gap-1.5
           rounded-[10px] p-1.5 text-left transition-colors hover:border-hairline-strong
           sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:py-1.5 sm:pl-4 sm:pr-1.5"
    @click="copy"
  >
    <span class="flex min-w-0 items-center gap-2.5 px-2 py-1.5 sm:p-0">
      <span
        class="select-none font-mono text-[13px] leading-none text-zinc-600"
        aria-hidden="true"
        >$</span
      >

      <!-- break-words stays as a floor: nowrap suppresses the soft break inside
           the spec, but a genuinely impossible width should still wrap rather
           than push the page sideways again. -->
      <code
        class="min-w-0 select-text whitespace-pre-wrap break-words font-mono text-[12px]
               leading-snug text-zinc-100 sm:text-[13px] sm:leading-none"
        >{{ commandHead }} <span class="whitespace-nowrap">{{ commandTail }}</span></code
      >
    </span>

    <!-- Not a nested <button>: that is invalid, and the outer one is the
         control. This is the affordance, and the label the pointer aims at. -->
    <span
      class="btn-chrome w-full flex-none !rounded-[7px] !px-3 !text-[12px] sm:w-auto"
      aria-hidden="true"
      >{{ copied ? "Copied" : "Copy" }}</span
    >

    <!-- The button's name is fixed, so the confirmation needs its own live
         region or a screen reader gets no feedback that anything happened. -->
    <span class="sr-only" aria-live="polite">{{ copied ? "Copied" : "" }}</span>
  </button>
</template>
