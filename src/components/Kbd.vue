<script setup>
/**
 * A keycap, straight off the app's `.kbd`.
 *
 * `tone` follows the app's rule that a review key is coloured by its verdict
 * and everything else stays neutral — mint for approve, amber for request
 * changes. Never tint a navigation key: the colour is the meaning.
 */
defineProps({
  /** "neutral" | "approve" | "changes" */
  tone: { type: String, default: "neutral" },
  /** Marketing type is larger than the app's 10px keycap. */
  size: { type: String, default: "sm" },
});
</script>

<template>
  <kbd
    class="kbd"
    :class="[
      tone === 'approve' && 'kbd-approve',
      tone === 'changes' && 'kbd-changes',
      size === 'md' && '!text-[11px] !px-[6px] !py-[2px]',
      size === 'lg' && '!text-[13px] !px-[9px] !py-[4px] !rounded-[5px]',
    ]"
  >
    <span><slot /></span>
  </kbd>
</template>
