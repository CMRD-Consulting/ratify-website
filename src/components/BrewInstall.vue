<script setup>
import { ref, onUnmounted } from "vue";
import { BREW_COMMAND } from "../site.js";

/**
 * The install line, as something you copy rather than something you read.
 *
 * Indigo, not mint. Mint is a verdict in this system and this is chrome — the
 * same rule that keeps approve the only solid-mint surface in the app.
 *
 * The command itself is a <code>, not an <input>: a read-only input that looks
 * like a field invites people to type in it, and every character they lose to
 * that is a broken install.
 */

const copied = ref(false);
let timer = null;

async function copy() {
  try {
    await navigator.clipboard.writeText(BREW_COMMAND);
  } catch {
    // Clipboard access can be refused — an insecure origin, a locked-down
    // browser. Selecting the text is the fallback that always works, so say
    // nothing and leave the command sitting there selectable.
    return;
  }

  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 1800);
}

onUnmounted(() => clearTimeout(timer));
</script>

<template>
  <!-- 6px of padding around a 32px button lands this at 46px, the height the
       neutral buttons beside it come to. They are set in different units and
       will drift if either changes; they are meant to match. -->
  <div
    class="panel inline-flex max-w-full items-center gap-3 rounded-[10px] py-1.5 pl-4 pr-1.5"
  >
    <span class="select-none font-mono text-[13px] text-zinc-600" aria-hidden="true"
      >$</span
    >

    <code class="overflow-x-auto whitespace-nowrap font-mono text-[13px] text-zinc-100">{{
      BREW_COMMAND
    }}</code>

    <button
      type="button"
      class="btn-chrome flex-none !rounded-[7px] !px-3 !text-[12px]"
      @click="copy"
    >
      <!-- The label is the live region: it changes to "Copied", which a screen
           reader announces without needing a separate status element. -->
      <span aria-live="polite">{{ copied ? "Copied" : "Copy" }}</span>
      <span class="sr-only"> the install command</span>
    </button>
  </div>
</template>
