<script setup>
import {
  BREW_UPGRADE_COMMAND,
  BREW_VERSION_COMMAND,
  NOTARIZED,
} from "../site.js";

/**
 * Split each command at its last space, the same way BrewInstall does, and for
 * the same reason: left alone the browser breaks inside `cmrd-consulting` at
 * the hyphen, and `brew upgrade cmrd-` sitting above `consulting/tap/ratify`
 * reads like the cask name has a newline in it. The tap spec is ~172px in
 * JetBrains Mono at 11px and the block is 188px wide at its narrowest, so the
 * space is a break that always works and the hyphen is a break that never has
 * to happen.
 *
 * This became necessary when the commands went fully-qualified — at
 * `--cask ratify` there was no hyphen to break and nothing to protect.
 */
const split = (command) => {
  const at = command.lastIndexOf(" ");
  return { head: command.slice(0, at), tail: command.slice(at + 1) };
};

const upgrade = split(BREW_UPGRADE_COMMAND);
const version = split(BREW_VERSION_COMMAND);

/**
 * How to move to a newer Ratify once you already have one.
 *
 * This is a block rather than a footnote because the page previously said it
 * in half a sentence, hung off the end of a paragraph whose subject was the
 * tap — which put the one command someone needs weeks after install inside the
 * one paragraph they read once, at install, and never returned to.
 *
 * It sits below the first-launch note, not above it. The note above describes
 * a failure that arrives about ninety seconds after the install command; this
 * describes something nobody needs until there is a second release. Ordering
 * these by urgency rather than by topic keeps the blocking thing on top.
 *
 * Unlike QuarantineNote this does not disappear when NOTARIZED flips — the
 * upgrade command outlives Apple's opinion of the signature. Only the
 * re-quarantine paragraph goes.
 */
</script>

<template>
  <div
    id="update"
    class="mx-auto mt-4 w-full min-w-0 max-w-md rounded-[10px] border border-hairline
           bg-fill-subtle px-4 py-3 text-left"
  >
    <p class="text-[12px] leading-relaxed text-[var(--color-zinc-400)]">
      <strong class="font-semibold text-[var(--color-zinc-200)]"
        >Updating is one command.</strong
      >
      Homebrew installed Ratify, so Homebrew updates it — there is nothing to
      download again by hand and no in-app updater to wait on:
    </p>

    <!-- Wrapped, not scrolled, for the same reason as the quarantine command:
         a line that scrolls sideways on a phone hides the half that matters
         behind a gesture with no affordance for it. Both of these are short
         enough to survive 320px intact, and break-words is the floor if not. -->
    <code
      class="mt-2 block min-w-0 whitespace-pre-wrap break-words font-mono text-[11px]
             leading-relaxed text-[var(--color-zinc-100)]"
      >{{ upgrade.head }} <span class="whitespace-nowrap">{{ upgrade.tail }}</span></code
    >

    <p class="mt-3 text-[12px] leading-relaxed text-[var(--color-zinc-400)]">
      <strong class="font-semibold text-[var(--color-zinc-200)]"
        >To check what you are on,</strong
      >
      ask Homebrew — it prints the version installed next to the version the tap
      is offering:
    </p>

    <code
      class="mt-2 block min-w-0 whitespace-pre-wrap break-words font-mono text-[11px]
             leading-relaxed text-[var(--color-zinc-100)]"
      >{{ version.head }} <span class="whitespace-nowrap">{{ version.tail }}</span></code
    >

    <!--
      The part people get caught by. An upgrade is a fresh download, so the
      new bundle arrives with a fresh quarantine flag — the approval macOS
      recorded for the old one does not carry over, and the block that only
      happened once at install happens again. The note above says "it opens
      normally forever after", which is true of the bundle it was talking
      about and not of its replacement; this is what keeps that honest.

      Goes when NOTARIZED goes. The commands above stay.
    -->
    <p
      v-if="!NOTARIZED"
      class="mt-3 text-[12px] leading-relaxed text-[var(--color-zinc-400)]"
    >
      <strong class="font-semibold text-[var(--color-zinc-200)]"
        >Expect the block again.</strong
      >
      An update is a new download, and macOS quarantines it exactly like the
      first one — the permission you granted the old copy does not transfer.
      Take
      <a href="#first-launch" class="link">either route above</a> once more, or
      run the quarantine command before you reopen it.
    </p>
  </div>
</template>
