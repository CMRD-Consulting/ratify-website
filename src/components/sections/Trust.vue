<script setup>
import Section from "../Section.vue";
import Shot from "../Shot.vue";

const points = [
  {
    title: "The token never reaches the webview",
    body: "It is stored in the macOS Keychain, and the Rust side owns it — the web layer gets generic proxies, gql and rest, and no credential. A provider key is held the same way, bound to the origin it was entered for. An XSS in a rendered pull request description has nothing to steal.",
  },
  {
    title: "Stranger-authored markdown is sanitised, always",
    body: "A fork's description is written by someone you have never met. It is rendered as markdown and sanitised without exception.",
  },
  {
    title: "No middleman, and no model but yours",
    body: "The risk classifier is path globs, evaluated locally. The app talks to GitHub's API directly, and to a model only through a provider you added with your own key — there is no account to make with us and no server of ours between you and your code.",
  },
  {
    title: "Sign in the way you already are",
    body: "A personal access token or your local gh CLI token works with no further setup. “Sign in with GitHub” uses the OAuth device flow.",
  },
];
</script>

<template>
  <Section id="trust">
    <div class="grid items-center gap-12 lg:grid-cols-[0.95fr_1fr] lg:gap-16">
      <div v-reveal>
        <Shot
          src="/shots/signin.webp"
          alt="The Ratify sign-in screen, offering sign in with GitHub, a gh CLI token, or a pasted personal access token."
          caption="Three ways in. The token lands in the Keychain either way."
        />
      </div>

      <div>
        <p class="eyebrow">Security</p>
        <h2 class="h2 mt-4">It holds a key to your repositories.</h2>
        <p class="prose-body mt-5">
          So it is built like something that does.
        </p>

        <dl class="mt-8 space-y-6">
          <div v-for="p in points" :key="p.title">
            <dt class="h3">{{ p.title }}</dt>
            <dd class="prose-body mt-2 !text-[13px]">{{ p.body }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </Section>
</template>
