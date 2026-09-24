<script setup>
import Section from "../Section.vue";
import SharedConfigs from "../illustrations/SharedConfigs.vue";

/**
 * Shared configs, as shipped in 0.22.0. Every claim is checkable against the
 * app's Help topic "Shared configs" (src/help/10-shared-configs.md) and is
 * worded to stay true: an org's areas replace yours whole, what an org cannot
 * set is listed by name, and nothing here claims enforcement — the app's own
 * docs say plainly that it is a client.
 */
const areas = ["triage rules", "status rules", "lenses", "snippets", "review defaults"];

const yours = [
  { what: "Agent rules", why: "off, brief, draft or auto — auto approves in your name" },
  { what: "Providers and keys", why: "the spend is on your key, under your ceiling" },
  { what: "Sections and repositories", why: "one inbox spans every org you review in" },
];
</script>

<template>
  <Section id="teams">
    <div class="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <p class="eyebrow">Shared configs</p>
        <h2 class="h2 mt-4">One set of rules for the whole org.</h2>

        <p class="prose-body mt-5">
          An org keeps its review rules in one repository,
          <span class="font-mono text-[13px] text-zinc-300">&lt;org&gt;/ratify-config</span>,
          and every pull request in that org is read by them — whoever is
          reviewing it. Two reviewers on the same team see the same files as
          needs-eyes, the same chips on the same rows, and the same lenses in
          the brief.
        </p>

        <p class="prose-body mt-4">
          It works area by area:
          <template v-for="(a, i) in areas" :key="a"
            ><span class="text-zinc-300">{{ a }}</span
            >{{ i < areas.length - 2 ? ", " : i === areas.length - 2 ? " and " : "" }}</template
          >. An area the org defines replaces yours whole for its pull
          requests, so the first rule to match is the same for everyone; an area
          it leaves out falls back to yours. It goes by who owns the pull
          request, so someone reviewing in three orgs reads each one by its own
          rules — and their side projects by their own.
        </p>

        <p class="prose-body mt-4">
          An org decides how its pull requests are read. How much of the agent
          you use, and what it costs you, stays yours:
        </p>

        <dl
          class="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-xl border border-hairline bg-fill-subtle px-5 py-4"
        >
          <template v-for="y in yours" :key="y.what">
            <dt class="text-[13px] text-zinc-200">{{ y.what }}</dt>
            <dd class="prose-body !text-[13px]">{{ y.why }}</dd>
          </template>
        </dl>
      </div>

      <div>
        <div class="card overflow-hidden" v-reveal>
          <div class="illustration aspect-[3/1] w-full">
            <SharedConfigs />
          </div>
        </div>

        <div class="card mt-6 p-6" v-reveal="90">
          <h3 class="h3">Every change is a pull request.</h3>
          <p class="prose-body mt-3 !text-[13px]">
            Edit an org's rules in Settings as you would your own, and Ratify
            previews what the change would do to the pull request you have
            open. <span class="text-zinc-300">Propose</span> opens a pull request
            on the org's repository, on the commit you were looking at and
            carrying only the files you changed — so it can never overwrite a
            change you did not see. The org's own CODEOWNERS decide who
            approves.
          </p>
          <p class="prose-body mt-3 !text-[13px]">
            Until it merges, nothing changes, on your machine or anyone's.
            Within ten minutes of merging, every reviewer's Ratify has the new
            rules, and a strip over the inbox says what changed.
          </p>
        </div>

        <div class="card mt-6 p-6" v-reveal="180">
          <h3 class="h3">Set up in one click.</h3>
          <p class="prose-body mt-3 !text-[13px]">
            <span class="text-zinc-300">Set up</span> creates the org's
            <span class="font-mono text-zinc-300">ratify-config</span> and opens
            its first pull request from your own rules. Prompts live as Markdown,
            one lens per file, so a change to what an agent looks for reviews as
            prose.
          </p>
        </div>
      </div>
    </div>

    <p class="prose-body mt-10 max-w-2xl">
      Consistency, not enforcement: Ratify is a client, and says so. What it
      guarantees is that nobody using Ratify reads an org's pull requests by
      other rules without it showing — the header names the rules in force on
      every pull request.
    </p>
  </Section>
</template>

<style scoped>
.illustration {
  background:
    radial-gradient(120% 90% at 50% 0%, var(--color-brand-tint), transparent 70%),
    var(--color-fill-subtle);
}
</style>
