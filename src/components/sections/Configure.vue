<script setup>
import Section from "../Section.vue";
import Shot from "../Shot.vue";
</script>

<template>
  <Section id="settings">
    <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
      <div>
        <p class="eyebrow">Configuration</p>
        <h2 class="h2 mt-4">Yours to change, including the opinions.</h2>

        <p class="prose-body mt-5">
          Triage rules are path globs, first match wins, and they are editable.
          They only re-order and collapse — a rule never hides a file, so
          disagreeing with the defaults costs you nothing.
        </p>

        <p class="prose-body mt-4">
          Sections, snippets and key bindings live alongside them. Every control
          commits on change; there is no save button. Rebinding is the one
          exception, because a conflict has to be resolved before it can be
          saved.
        </p>
      </div>

      <div v-reveal>
        <Shot
          src="/shots/triage.webp"
          alt="The Ratify settings window showing the triage rules: path globs mapped to risk tiers, in first-match order."
          caption="Triage rules, in first-match order."
          :width="1440"
          :height="1080"
        />
      </div>
    </div>
  </Section>
</template>
