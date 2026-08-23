<script setup>
import Kbd from "./Kbd.vue";

/**
 * The fast path — the sequence the whole product is built around.
 *
 * `a` is tinted mint because it is a verdict key; nothing else here is
 * coloured, which is exactly how the app treats them.
 */
const steps = [
  { keys: ["⌃⌥L"], action: "summon", note: "the queue is already fresh" },
  { keys: ["j", "k"], action: "move through it", note: "" },
  { keys: ["a"], action: "approve", note: "", tone: "approve" },
  {
    keys: ["⌘⏎"],
    action: "submit",
    note: "→ the next pull request selects itself",
  },
];
</script>

<template>
  <div class="panel rounded-xl px-5 py-4 sm:px-6 sm:py-5">
    <ul class="space-y-3">
      <li
        v-for="step in steps"
        :key="step.action"
        class="flex flex-wrap items-baseline gap-x-3 gap-y-1"
      >
        <span class="flex flex-none items-center gap-1">
          <Kbd
            v-for="key in step.keys"
            :key="key"
            :tone="step.tone || 'neutral'"
            size="lg"
            >{{ key }}</Kbd
          >
        </span>
        <span
          class="font-mono text-[13px] text-zinc-200"
          :class="step.tone === 'approve' && 'text-[color:var(--color-approve)]'"
          >{{ step.action }}</span
        >
        <span
          v-if="step.note"
          class="font-mono text-[11px] text-zinc-600 sm:ml-auto"
          >{{ step.note }}</span
        >
      </li>
    </ul>
  </div>
</template>
