<script setup>
import LegalLayout from "../components/LegalLayout.vue";
import DraftNotice from "../components/DraftNotice.vue";
import { LEGAL_ENTITY, LEGAL_CONTACT } from "../site.js";

/**
 * The privacy policy.
 *
 * The whole difficulty here is that the honest answer is "we collect nothing",
 * and a policy that says only that reads as evasion. So this one is specific
 * instead of reassuring: it enumerates the file, the Keychain entries, the
 * exact hosts, and — the two most easily-fudged items — the fact that this
 * website is served by Netlify, which keeps request logs, and that its
 * typefaces come from Google, which therefore sees a visitor's IP address.
 *
 * Both of those are provable from the repo (netlify.toml, the font <link> and
 * the CSP that permits exactly those two font hosts), so omitting them would
 * be a claim contradicted by the source. The landing page's Privacy section
 * makes precise, checkable claims and this document has to survive being
 * compared against it — and against the app's own src/help/11-privacy.md.
 *
 * Keep the three-GitHub-hosts list and the settings.json contents in step
 * with the app. They are asserted in three places now.
 */
</script>

<template>
  <LegalLayout
    title="Privacy policy"
    standfirst="Ratify has no server, no account system and no telemetry. This page says precisely what that means, and where the exceptions are."
  >
    <DraftNotice />

    <p>
      This policy explains how {{ LEGAL_ENTITY }} handles information in
      connection with the Ratify application for macOS and this website,
      ratify.cmrd.dev.
    </p>

    <p class="summary">
      <strong>The short version.</strong> We operate no server that Ratify
      talks to, so we receive nothing about you or your code — no account, no
      analytics, no crash reports, no usage pings. Your data stays on your Mac
      and goes to GitHub, which already has it. It goes to a model provider
      only if you add one yourself, and then only to the address you entered.
    </p>

    <h2>1. The application</h2>

    <h3>1.1 What we collect</h3>

    <p>
      Nothing. Ratify has no backend of ours, no account to create and no
      analytics, crash reporting, usage measurement or first-run beacon of any
      kind. These are not features that default to off — they are not built.
      There is consequently no personal data of yours in our possession, and no
      log of yours on any machine we run.
    </p>

    <h3>1.2 What is stored on your Mac</h3>

    <p>Two things, both local to your computer:</p>

    <ul>
      <li>
        <strong>A settings file.</strong> Your queue sections, triage rules,
        snippets, key bindings, appearance, the model providers and lenses you
        configured, and a ledger recording what the review agent ran and what
        it was estimated to cost. It contains no code, no diffs and no
        findings.
      </li>
      <li>
        <strong>Credentials, in the macOS Keychain.</strong> Your GitHub token
        and any model provider API keys you enter. These are held by the
        application's native layer; the app's own window never receives them,
        so nothing rendered from a pull request can read one. A provider key is
        additionally bound to the endpoint address it was entered for.
      </li>
    </ul>

    <p>
      Pull request contents — diffs, file bodies, comment threads — are held in
      memory while the window is open and are gone when you quit. They are not
      written to disk.
    </p>

    <h3>1.3 What leaves your Mac, and to whom</h3>

    <p><strong>To GitHub.</strong> Ratify reaches three GitHub hosts:</p>

    <ul>
      <li><code>github.com</code> — to sign in, if you use the device flow.</li>
      <li>
        <code>api.github.com</code> — to read your queue and pull requests, and
        to submit the reviews, comments and merges you ask for.
      </li>
      <li>
        <code>raw.githubusercontent.com</code> — to read the published Homebrew
        cask and see whether a newer version exists.
      </li>
    </ul>

    <p>
      GitHub's handling of that traffic is governed by your agreement with
      GitHub, not by this policy. The application window also loads contributor
      avatar images from GitHub's avatar hosts, and its typefaces from Google —
      see clause 2.3, which applies equally.
    </p>

    <p>
      <strong>To a model provider, only if you configure one.</strong> The
      review agent is inactive until you add a provider in Settings. Once you
      have, and for pull requests your own rules select, Ratify sends to the
      endpoint you entered:
    </p>

    <ul>
      <li>the pull request's title and description;</li>
      <li>its diffs;</li>
      <li>
        the full contents of as many changed files as the token budget you set
        allows, in the order your triage rules rank them; and
      </li>
      <li>the review instructions of each lens you enabled.</li>
    </ul>

    <p>
      It goes to that address and to no other. We are not in that path, we do
      not receive a copy, and we have no ability to see it.
      <strong>Your relationship with that provider is directly with them</strong>
      — their privacy policy and terms govern what they do with what you send,
      including whether they retain it or train on it. Choose accordingly, and
      make sure you are permitted to send the code in question before you
      enable the agent on a repository.
    </p>

    <h3>1.4 What the application window itself may reach</h3>

    <p>
      Ratify's window runs under a content security policy that permits it no
      network connection of its own beyond the local bridge to the native
      layer, with two written exceptions: its typefaces and GitHub's avatar
      images. Every other request is made by the native layer, which knows the
      three GitHub hosts above and the address of each provider you added.
    </p>

    <h2>2. This website</h2>

    <h3>2.1 No cookies, no analytics</h3>

    <p>
      ratify.cmrd.dev sets no cookies and runs no analytics, tag manager,
      session recorder, advertising pixel or embedded third-party widget. There
      is no consent banner because there is nothing to consent to.
    </p>

    <h3>2.2 Local storage</h3>

    <p>
      One value, and only once you use the light/dark switcher: your palette
      preference, under the key <code>ratify-theme</code>. It stays in your
      browser, is never transmitted, and clearing site data removes it.
    </p>

    <h3>2.3 Hosting and fonts — where third parties do see something</h3>

    <p>
      This site is served by Netlify, which as our hosting provider processes
      standard web server request logs, including visitor IP addresses, on our
      behalf. We do not analyse those logs or use them to build any profile.
    </p>

    <p>
      The site's typefaces are loaded from Google Fonts
      (<code>fonts.googleapis.com</code> and <code>fonts.gstatic.com</code>).
      Requesting a font discloses your IP address and user agent to Google, and
      is subject to their privacy policy.
      <strong>This is the only third party a visit to this site contacts</strong>,
      and it is named here rather than glossed over because it is verifiable
      from the site's own security headers.
    </p>

    <h2>3. Children</h2>

    <p>
      Ratify is a developer tool for professional use and is not directed at
      children. We do not knowingly collect information from anyone, of any
      age.
    </p>

    <h2>4. Your rights</h2>

    <p>
      Privacy laws including the GDPR and the CCPA give you rights to access,
      correct, delete and port personal data a company holds about you, and to
      object to its sale. <strong>We hold no personal data about you, and we
      sell nothing</strong>, so in practice there is nothing for us to produce
      or erase — your settings and credentials are on your own machine and
      under your own control, and deleting the application and its settings
      file removes them entirely.
    </p>

    <p>
      If you believe we hold something about you, write to us at the address
      below and we will answer. For data held by GitHub or by a model provider
      you configured, those requests go to them; we cannot action them on your
      behalf.
    </p>

    <h2>5. Changes to this policy</h2>

    <p>
      If what Ratify does with data changes, this page changes with it and the
      effective date at the top moves. Because there is no account, we have no
      way to notify you directly — the date is the mechanism.
    </p>

    <h2>6. Contact</h2>

    <p>
      {{ LEGAL_ENTITY }} —
      <a :href="`mailto:${LEGAL_CONTACT}`" class="link">{{ LEGAL_CONTACT }}</a>
    </p>

    <p>
      See also the
      <a href="/license/" class="link">licence agreement</a>, and the
      <a href="/#privacy" class="link">Privacy section</a> of the main page for
      the same claims in summary.
    </p>
  </LegalLayout>
</template>
