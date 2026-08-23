<script setup>
import { NOTARIZED, QUARANTINE_COMMAND } from "../site.js";

/**
 * What happens the first time you open an app Apple has not notarized.
 *
 * This sits under the install buttons rather than in a FAQ, because the
 * failure it describes arrives about ninety seconds after the click and gives
 * no hint that a fix exists. "Ratify is damaged and can't be opened" is what
 * macOS says; a page that let someone meet that sentence unprepared would have
 * saved a paragraph and spent their afternoon.
 *
 * Renders nothing once NOTARIZED flips — there is no version of this worth
 * keeping as reassurance. The margin lives on the root rather than on a
 * wrapper, so nothing is left behind holding space when that happens.
 */
</script>

<template>
  <div
    v-if="!NOTARIZED"
    class="mx-auto mt-8 w-full min-w-0 max-w-md rounded-[10px] border border-white/[0.08]
           bg-white/[0.02] px-4 py-3 text-left"
  >
    <p class="text-[12px] leading-relaxed text-[var(--color-zinc-400)]">
      <strong class="font-semibold text-[var(--color-zinc-200)]"
        >Not notarized yet.</strong
      >
      macOS quarantines apps it cannot check with Apple, and refuses to open
      them. Ratify is one of those today, so run this once after installing:
    </p>

    <!--
      This one wraps rather than scrolls. It is a command someone has to run,
      and a line that scrolls sideways on a phone hides the half of it that
      matters — the path — behind a gesture there is no affordance for. Wrapped
      at the space before the path, both halves stay on screen.
    -->
    <code
      class="mt-2.5 block min-w-0 whitespace-pre-wrap break-words font-mono text-[11px]
             leading-relaxed text-[var(--color-zinc-100)]"
      >{{ QUARANTINE_COMMAND }}</code
    >

    <p class="mt-2.5 text-[11px] leading-relaxed text-[var(--color-zinc-600)]">
      Homebrew prints it for you on install. A Developer ID signature is what
      retires it.
    </p>
  </div>
</template>
