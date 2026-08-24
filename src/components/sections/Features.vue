<script setup>
import Section from "../Section.vue";

/**
 * The high-level tour. Each card is one capability in one sentence — the
 * sections below take the four that need a picture and go deeper.
 *
 * `glyph` is static, author-written SVG (see the v-html note in the template);
 * everything is drawn on a 24×24 grid with a 1.5px stroke so the set reads as
 * one weight.
 */
const features = [
  {
    title: "Four sections, all of them searches",
    body: "Needs my review, my teams, re-review, and your own pull requests — switched with 1–4. They are ordinary GitHub searches, so they are yours to rewrite, and dragging to reorder them moves the number keys too.",
    glyph: '<path d="M4 6h16M4 12h16M4 18h10"/>',
  },
  {
    title: "Rows that answer one question",
    body: "Check state, size tier, the add/delete ratio, author, age, unresolved threads. Only what a row needs to tell you whether this is a stamp or a sit-down job.",
    glyph: '<path d="M3 5h18v14H3z"/><path d="M3 10h18M9 10v9"/>',
  },
  {
    title: "File lists ordered by risk",
    body: "Migrations, money paths, auth changes and deleted tests rise to the top. Lockfiles and generated code collapse into a noise tier. Nothing is ever hidden or dropped from the viewed count.",
    glyph:
      '<path d="M7 20V4m0 16-3-3m3 3 3-3M17 4v16m0-16-3 3m3-3 3 3"/>',
  },
  {
    title: "Split view when there is room",
    body: "Above 1560px each side still holds a readable column, so split arrives on its own. ⇧S overrides it either way.",
    glyph: '<path d="M3 4h18v16H3z"/><path d="M12 4v16"/>',
  },
  {
    title: "Since my review",
    body: "Diff against the commit you last reviewed instead of the whole pull request, so a re-review resumes rather than restarts.",
    glyph:
      '<path d="M3 5v5h5"/><path d="M3.5 10a9 9 0 1 1 .5 5"/><path d="M12 8v4.5l3 1.8"/>',
  },
  {
    title: "Pending reviews, GitHub's way",
    body: "Inline comments accumulate into a pending review and go out with the approve, request-changes or comment event. Replies to existing threads send immediately — each card says which it is.",
    glyph:
      '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  },
  {
    title: "Undo that is real",
    body: "GitHub cannot un-submit a review, so ⌘Z within six seconds cancels the queued mutation before it fires. After six seconds the affordance disappears rather than lying about what it can still do.",
    glyph: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-5"/>',
  },
  {
    title: "One repo at a time",
    body: "Filter from the top bar — type to narrow, ⏎ to pick — and the section counts, the menu-bar badge and the queue all follow. Nothing disappears silently.",
    glyph: '<path d="M21 4H3l7.2 8.5V20l3.6-1.8v-5.7z"/>',
  },
  {
    title: "Merge behind a gate",
    body: "m opens a confirm sheet: squash, rebase or merge, plus delete-branch. Gated on approval, green checks and no conflicts unless you hold ⌥.",
    glyph:
      '<circle cx="18" cy="18" r="2.5"/><circle cx="6" cy="6" r="2.5"/><path d="M6 21V9a9 9 0 0 0 9 9"/>',
  },
  {
    title: "A palette and a keymap",
    body: "⌘K carries the compound and rare actions — approve-and-merge, bulk approve, approve-anyway. ? shows the full keymap, and the bottom rail shows only the keys that are valid right now.",
    glyph:
      '<path d="M15 6a3 3 0 1 1 3 3h-3zM9 6a3 3 0 1 0-3 3h3zM15 18a3 3 0 1 0 3-3h-3zM9 18a3 3 0 1 1-3-3h3zM9 9h6v6H9z"/>',
  },
  {
    title: "Light and dark, or neither",
    body: "System follows macOS and changes with it, schedule included, without a restart. The neutral ramp is mirrored by measured contrast rather than by eye, so nothing that was readable at night stops being readable by day.",
    glyph:
      '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none"/>',
  },
  {
    title: "A badge in the menu bar",
    body: "The count of what is actually waiting on you, and a popover for a glance without opening the window. ⌃⌥L summons the full app when you want it.",
    glyph:
      '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  },
  {
    title: "The token stays in the Keychain",
    body: "The Rust side owns your GitHub token and exposes two generic proxies. It never reaches the webview, so an XSS in a stranger's pull request description has no credential to steal.",
    glyph: '<path d="M5 11h14v10H5z"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  },
];
</script>

<template>
  <Section id="features">
    <div class="max-w-2xl">
      <p class="eyebrow">What is in it</p>
      <h2 class="h2 mt-4">Everything, at a glance.</h2>
      <p class="prose-body mt-5">
        Built with Tauri 2 and Vue 3 — a real Mac app, not a browser tab
        pretending to be one.
      </p>
    </div>

    <ul class="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="(f, i) in features"
        :key="f.title"
        class="bg-[#0B0B0E] p-6 transition-colors duration-150 hover:bg-[#111116]"
        v-reveal="Math.min(i, 5) * 45"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]"
        >
          <!-- Static, author-written markup — no user input reaches this. -->
          <svg
            class="h-[18px] w-[18px] text-[color:var(--color-brand)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            v-html="f.glyph"
          />
        </span>
        <h3 class="h3 mt-4">{{ f.title }}</h3>
        <p class="prose-body mt-2 !text-[13px]">{{ f.body }}</p>
      </li>
    </ul>
  </Section>
</template>
