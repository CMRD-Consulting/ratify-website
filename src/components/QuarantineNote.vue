<script setup>
import { NOTARIZED, QUARANTINE_COMMAND } from "../site.js";

/**
 * What happens the first time you open an app Apple has not notarized, and
 * the two ways past it.
 *
 * This sits under the install buttons rather than in a FAQ, because the
 * failure it describes arrives about ninety seconds after the click and gives
 * no hint that a fix exists. The dialog offers exactly two buttons, Done and
 * Move to Trash, and neither of them is "open it anyway" — someone who meets
 * that unprepared reasonably concludes the download is broken.
 *
 * Ratify is signed, just not with a Developer ID: `codesign -dv` reports an
 * authority and `TeamIdentifier=not set`, so macOS can read the signature and
 * simply does not trust it. That distinction decides everything below. An app
 * whose signature is missing or broken is "damaged", and Privacy & Security
 * offers nothing for it; an app signed by someone Apple has not vouched for is
 * merely blocked, and that IS the case Open Anyway exists for. Check with
 * `spctl -a -vvv -t exec /Applications/Ratify.app` before rewording any of
 * this — "rejected" with an `origin=` line is the blocked case.
 *
 * The order is deliberate. The command is first because it is the one that
 * runs before the block rather than after it, and because anyone reading this
 * has a terminal open — they just pasted a brew line into it. The click path
 * is second because it is what you need once you have already double-clicked,
 * which is when most people arrive here.
 *
 * Renders nothing once NOTARIZED flips — there is no version of this worth
 * keeping as reassurance. The margin lives on the root rather than on a
 * wrapper, so nothing is left behind holding space when that happens.
 */
</script>

<template>
  <div
    v-if="!NOTARIZED"
    id="first-launch"
    class="mx-auto mt-8 w-full min-w-0 max-w-md rounded-[10px] border border-hairline
           bg-fill-subtle px-4 py-3 text-left"
  >
    <p class="text-[12px] leading-relaxed text-[var(--color-zinc-400)]">
      <strong class="font-semibold text-[var(--color-zinc-200)]"
        >macOS will block the first launch.</strong
      >
      Apple will not vouch for an app it has not notarized, and Ratify is not
      notarized yet — so the first time you open it macOS says it cannot verify
      the app, and offers you Done or Move to Trash. Nothing is wrong with the
      download. Take either route below.
    </p>

    <!--
      This one wraps rather than scrolls. It is a command someone has to run,
      and a line that scrolls sideways on a phone hides the half of it that
      matters — the path — behind a gesture there is no affordance for. Wrapped
      at the space before the path, both halves stay on screen.
    -->
    <p class="mt-3 text-[12px] leading-relaxed text-[var(--color-zinc-400)]">
      <strong class="font-semibold text-[var(--color-zinc-200)]"
        >Before you open it,</strong
      >
      clear the quarantine flag Homebrew set, and the block never happens:
    </p>

    <code
      class="mt-2 block min-w-0 whitespace-pre-wrap break-words font-mono text-[11px]
             leading-relaxed text-[var(--color-zinc-100)]"
      >{{ QUARANTINE_COMMAND }}</code
    >

    <p class="mt-3 text-[12px] leading-relaxed text-[var(--color-zinc-400)]">
      <strong class="font-semibold text-[var(--color-zinc-200)]"
        >If you already tried,</strong
      >
      allow it in System Settings:
    </p>

    <!--
      Three steps, and the first one is not optional padding: the Open Anyway
      button does not exist in Privacy & Security until a launch has been
      blocked. Someone who goes to Settings first finds an empty Security
      section and concludes the page is wrong. macOS 15 removed the old
      right-click → Open shortcut, so this is now the only way through
      without a terminal.
    -->
    <ol
      class="mt-2 space-y-1.5 text-[12px] leading-relaxed text-[var(--color-zinc-400)]"
    >
      <li class="flex gap-2.5">
        <span class="flex-none font-mono text-[11px] text-[var(--color-zinc-600)]"
          >1</span
        >
        <span
          >Open Ratify and let it be blocked, then click
          <strong class="font-semibold text-[var(--color-zinc-200)]">Done</strong
          >. Not Move to Trash.</span
        >
      </li>
      <li class="flex gap-2.5">
        <span class="flex-none font-mono text-[11px] text-[var(--color-zinc-600)]"
          >2</span
        >
        <span
          >Go to
          <strong class="font-semibold text-[var(--color-zinc-200)]"
            >System Settings → Privacy &amp; Security</strong
          >
          and scroll to Security.</span
        >
      </li>
      <li class="flex gap-2.5">
        <span class="flex-none font-mono text-[11px] text-[var(--color-zinc-600)]"
          >3</span
        >
        <span
          >Click
          <strong class="font-semibold text-[var(--color-zinc-200)]"
            >Open Anyway</strong
          >
          beside “Ratify was blocked”, authenticate, and confirm once more.</span
        >
      </li>
    </ol>

    <p class="mt-3 text-[11px] leading-relaxed text-[var(--color-zinc-600)]">
      Once through, it opens normally forever after. A Developer ID signature
      and notarization are what retire this note.
    </p>
  </div>
</template>
