<script setup>
import { onBeforeUnmount, ref } from "vue";

/**
 * Vendored from the app's src/components/whats-new/TeamConfigHero.vue — the
 * picture the app's own What's new shows for this feature — with its
 * reduced-motion hook inlined, since the site has no copy of the app's lib.
 *
 * Shared configs, drawn: one `ratify-config` in the middle, four reviewers
 * around it, and the same rules travelling out to each — whose triage bars
 * then light in the same three tiers. The point of the feature, in a loop.
 *
 * SMIL rather than CSS for the travelling dots: `offset-path` needs Safari 16,
 * and Ratify runs on macOS 11. SMIL ignores `prefers-reduced-motion`, so the
 * animations are simply not rendered when it is set.
 */
const query = typeof window !== "undefined" && window.matchMedia
  ? window.matchMedia("(prefers-reduced-motion: reduce)")
  : null;
const still = ref(query?.matches ?? false);
const onChange = (e) => (still.value = e.matches);
query?.addEventListener?.("change", onChange);
onBeforeUnmount(() => query?.removeEventListener?.("change", onChange));

const DUR = "3.2s";
const cards = [
  { x: 36, y: 20, from: "M206 66 C 168 66, 150 43, 110 43", begin: "0s" },
  { x: 36, y: 94, from: "M206 98 C 168 98, 150 117, 110 117", begin: "0.25s" },
  { x: 374, y: 20, from: "M274 66 C 312 66, 330 43, 370 43", begin: "0.5s" },
  { x: 374, y: 94, from: "M274 98 C 312 98, 330 117, 370 117", begin: "0.75s" },
];
// The three triage tiers, as the manifest draws them.
const bars = [
  { dy: 26, w: 46, tone: "var(--color-danger)" },
  { dy: 33, w: 36, tone: "var(--color-changes)" },
  { dy: 40, w: 42, tone: "var(--color-approve)" },
];
</script>

<template>
  <svg viewBox="0 0 480 160" class="h-full w-full" role="img" aria-label="One shared config reaching every reviewer">
    <defs>
      <pattern id="tc-dots" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" style="fill: var(--color-hairline-strong)" />
      </pattern>
      <radialGradient id="tc-glow">
        <stop offset="0%" style="stop-color: var(--color-brand); stop-opacity: 0.28" />
        <stop offset="100%" style="stop-color: var(--color-brand); stop-opacity: 0" />
      </radialGradient>
    </defs>

    <rect width="480" height="160" fill="url(#tc-dots)" />
    <circle cx="240" cy="82" r="90" fill="url(#tc-glow)" />

    <!-- The spokes, and what travels along them. -->
    <g v-for="(c, i) in cards" :key="`s${i}`">
      <path :d="c.from" fill="none" stroke-dasharray="3 4" style="stroke: var(--color-brand-border)" />
      <circle v-if="!still" r="3.5" style="fill: var(--color-brand)" opacity="0">
        <animateMotion :path="c.from" :dur="DUR" :begin="c.begin" repeatCount="indefinite"
          keyPoints="0;1;1" keyTimes="0;0.4;1" calcMode="linear" />
        <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.04;0.38;0.42;1"
          :dur="DUR" :begin="c.begin" repeatCount="indefinite" />
      </circle>
    </g>

    <!-- The reviewers. -->
    <g v-for="(c, i) in cards" :key="`c${i}`">
      <rect :x="c.x" :y="c.y" width="74" height="48" rx="8"
        style="fill: var(--color-surface-sheet); stroke: var(--color-hairline-strong)" />
      <circle :cx="c.x + 13" :cy="c.y + 13" r="5" style="fill: var(--color-zinc-500)" opacity="0.6" />
      <rect :x="c.x + 22" :y="c.y + 11" width="30" height="4" rx="2" style="fill: var(--color-hairline-strong)" />
      <g v-for="(b, j) in bars" :key="j">
        <rect :x="c.x + 10" :y="c.y + b.dy" :width="b.w" height="3" rx="1.5" style="fill: var(--color-hairline-strong)" />
        <rect :x="c.x + 10" :y="c.y + b.dy" :width="b.w" height="3" rx="1.5" :style="{ fill: b.tone }"
          :opacity="still ? 1 : 0">
          <animate v-if="!still" attributeName="opacity" values="0;0;1;1;0" :keyTimes="`0;${0.4 + j * 0.03};${0.46 + j * 0.03};0.9;1`"
            :dur="DUR" :begin="c.begin" repeatCount="indefinite" />
        </rect>
      </g>
    </g>

    <!-- The one config. -->
    <circle v-if="!still" cx="240" cy="82" r="34" fill="none" style="stroke: var(--color-brand)">
      <animate attributeName="r" values="34;58" :dur="DUR" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0" :dur="DUR" repeatCount="indefinite" />
    </circle>
    <rect x="206" y="48" width="68" height="68" rx="14"
      style="fill: var(--color-surface-sheet); stroke: var(--color-brand-border)" stroke-width="1.5" />
    <rect x="206" y="48" width="68" height="68" rx="14" style="fill: var(--color-brand-tint)" />
    <rect x="224" y="64" width="22" height="22" rx="4" fill="none" stroke-width="2" style="stroke: var(--color-brand)" />
    <rect x="234" y="74" width="22" height="22" rx="4" stroke-width="2"
      style="stroke: var(--color-brand); fill: var(--color-brand-tint)" />
    <text x="240" y="138" text-anchor="middle" font-size="10" letter-spacing="0.04em"
      style="fill: var(--color-zinc-500); font-family: var(--font-mono)">ratify-config</text>
  </svg>
</template>
