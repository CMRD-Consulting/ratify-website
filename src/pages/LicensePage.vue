<script setup>
import LegalLayout from "../components/LegalLayout.vue";
import DraftNotice from "../components/DraftNotice.vue";
import { LEGAL_ENTITY, GOVERNING_LAW, LEGAL_CONTACT } from "../site.js";

/**
 * The end user licence agreement.
 *
 * What makes this document worth writing rather than pasting: clauses 6 and 7.
 * Ratify acts on the user's GitHub credential and, optionally, submits reviews
 * under their name — including unattended ones — and it sends their source to
 * a third party the user chose and pays directly. A stock desktop-app EULA
 * addresses none of that, and those are the only parts of this agreement that
 * describe a real, non-obvious risk.
 *
 * Everything factual here is checkable against the app and must stay in step
 * with it and with /privacy-policy/. In particular: `auto` being off by
 * default, the key living in the Keychain, and the review body disclosing
 * machine assistance are load-bearing in clause 7 and are asserted on the
 * landing page too.
 */
</script>

<template>
  <LegalLayout
    title="Licence agreement"
    standfirst="The terms on which you may install and use Ratify. Plain English wherever plain English is precise enough."
  >
    <DraftNotice />

    <p>
      This agreement is between you and {{ LEGAL_ENTITY }} (“we”, “us”), and it
      covers the Ratify application for macOS, including any updates we make
      available (“Ratify”). <strong>By installing or using Ratify you accept
      these terms.</strong> If you do not accept them, do not install it, and
      delete any copy you have.
    </p>

    <h2>1. What you may do</h2>

    <p>
      We grant you a personal, non-exclusive, non-transferable, revocable
      licence to install and use Ratify on Mac computers that you own or
      control, for your own purposes — personal or commercial, including your
      employer's work. There is no per-seat count in this licence and no
      activation; if you are deploying Ratify across a team, you need nothing
      further from us.
    </p>

    <h2>2. What you may not do</h2>

    <ul>
      <li>
        Redistribute, sell, rent, lease, sublicense or host Ratify as a service
        for others. Pointing colleagues at the Homebrew tap or the releases
        page is not redistribution and is welcome.
      </li>
      <li>
        Reverse engineer, decompile or disassemble Ratify, except to the extent
        that restriction is unenforceable under the law that applies to you,
        and then only to that extent.
      </li>
      <li>Remove or alter any copyright, trade mark or attribution notice.</li>
      <li>
        Use Ratify to break the terms of any service it connects to on your
        behalf — GitHub's, or those of a model provider you configure.
      </li>
    </ul>

    <h2>3. What we keep</h2>

    <p>
      Ratify is licensed, not sold. We and our licensors retain all right,
      title and interest in it, including its source, which is not part of what
      this licence grants you. Rights not expressly granted here are reserved.
    </p>

    <h2>4. Your code stays yours</h2>

    <p>
      Nothing in this agreement gives us any right in the code, diffs, comments
      or repositories you use Ratify on. We do not receive them. Ratify has no
      server component and no account system — see the
      <a href="/privacy-policy/" class="link">privacy policy</a> for exactly
      what is stored and what is transmitted.
    </p>

    <h2>5. Third-party components</h2>

    <p>
      Ratify includes open source components licensed by their own authors
      under their own terms. Those terms govern those components, and nothing
      in this agreement limits any right you have under them.
    </p>

    <h2>6. Acting on your GitHub account</h2>

    <p>
      Ratify works by holding a credential you supply — a personal access
      token, your local <code>gh</code> CLI token, or an OAuth token from
      GitHub's device flow — and acting through GitHub's API as you.
    </p>

    <p>
      <strong>Every action Ratify takes on GitHub is attributed to your
      account and is your responsibility.</strong> That includes approvals,
      requested changes, comments, merges and branch deletions. You are
      responsible for keeping your credential's scopes appropriate, and for
      complying with the policies of any organisation whose repositories you
      review. Your use of GitHub remains governed by your agreement with
      GitHub; we are not a party to it.
    </p>

    <h2>7. The review agent</h2>

    <p>
      Ratify can send a pull request to a large language model to be reviewed
      before you read it. <strong>This is off unless you configure it.</strong>
      With no model provider added, no part of this clause applies and nothing
      leaves your machine for a model.
    </p>

    <h3>7.1 The provider is yours, not ours</h3>

    <p>
      You supply the endpoint and, where one is required, the API key. We are
      not a party to your relationship with that provider, we do not resell
      their service, and we receive nothing from your use of it. Their terms
      and their privacy policy govern what they do with what you send. You pay
      them directly, and any cost figures Ratify shows you are estimates
      computed locally — not a quote, and not a bill.
    </p>

    <h3>7.2 You are responsible for what you are allowed to send</h3>

    <p>
      <strong>Sending source code to a third-party model provider may be
      prohibited by your employer, your client's contract, or the licence of
      the code itself.</strong> Ratify cannot know that, and does not check.
      Before enabling the agent on a repository, satisfy yourself that you have
      the right to transmit its contents to the provider you chose.
    </p>

    <h3>7.3 Its output is advisory</h3>

    <p>
      Model output is probabilistic. The agent will sometimes report problems
      that are not real, and will sometimes miss problems that are. It is a
      reading aid, not an assurance of correctness, security or fitness, and no
      finding — or absence of findings — should be treated as a warranty that
      code is sound.
    </p>

    <h3>7.4 Unattended approval</h3>

    <p>
      Ratify's <code>auto</code> level submits reviews to GitHub without a
      person present. It is off by default and runs only for pull requests
      matched by a rule you wrote yourself.
    </p>

    <p>
      <strong>A review submitted at <code>auto</code> is submitted under your
      GitHub account, in your name, and is your responsibility in exactly the
      way a review you typed would be.</strong> GitHub does not permit a review
      to be withdrawn once submitted, so this cannot be undone. Ratify adds a
      line to the body of such a review disclosing that it was machine-assisted
      and naming the lenses and models involved, but that disclosure does not
      transfer responsibility for the approval to us or to the model provider.
      If unattended approval is not appropriate for a repository, do not write
      a rule that enables it there.
    </p>

    <h2>8. Updates</h2>

    <p>
      Ratify checks whether a newer version has been published and tells you if
      one has; it does not install anything on its own. We are not obliged to
      provide updates, support, or continued availability of any distribution
      channel. An update may change or remove features.
    </p>

    <h2>9. Term and termination</h2>

    <p>
      This licence runs until terminated. It ends automatically if you breach
      it, and you may end it at any time by deleting Ratify. Clauses 3, 6, 7,
      10, 11 and 12 survive termination.
    </p>

    <h2>10. No warranty</h2>

    <p class="callout">
      RATIFY IS PROVIDED “AS IS” AND “AS AVAILABLE”, WITHOUT WARRANTY OF ANY
      KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED
      WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE
      AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT RATIFY WILL BE
      UNINTERRUPTED OR ERROR-FREE, THAT IT WILL CORRECTLY IDENTIFY RISK IN ANY
      CHANGE, OR THAT ANY REVIEW IT PRODUCES OR ASSISTS WITH IS ACCURATE OR
      COMPLETE.
    </p>

    <p>
      Some jurisdictions do not allow the exclusion of implied warranties, so
      parts of this clause may not apply to you. Nothing here limits any
      statutory right you have as a consumer that cannot lawfully be limited.
    </p>

    <h2>11. Limitation of liability</h2>

    <p class="callout">
      TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY
      INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, OR FOR
      ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR FOR CHARGES INCURRED
      WITH A MODEL PROVIDER, ARISING OUT OF OR RELATING TO RATIFY OR THIS
      AGREEMENT, EVEN IF ADVISED OF THE POSSIBILITY. OUR TOTAL AGGREGATE
      LIABILITY WILL NOT EXCEED THE GREATER OF THE AMOUNT YOU PAID US FOR
      RATIFY IN THE TWELVE MONTHS BEFORE THE CLAIM, OR FIFTY US DOLLARS.
    </p>

    <p>
      This allocation of risk is a fundamental part of the agreement, and the
      licence would not be granted on these terms without it. Nothing in this
      clause excludes liability for fraud, or for death or personal injury
      caused by negligence, or any other liability that cannot lawfully be
      excluded.
    </p>

    <h2>12. Governing law</h2>

    <p>
      This agreement is governed by the laws of the State of
      {{ GOVERNING_LAW }}, without regard to its conflict of laws rules, and
      the state and federal courts located there have exclusive jurisdiction
      over any dispute arising from it.
    </p>

    <h2>13. Changes to these terms</h2>

    <p>
      We may revise this agreement for future versions of Ratify. The version
      published here when you install or update applies to that copy;
      continuing to use Ratify after a revision means accepting it. Material
      changes will move the effective date at the top of this page.
    </p>

    <h2>14. Contact</h2>

    <p>
      {{ LEGAL_ENTITY }} —
      <a :href="`mailto:${LEGAL_CONTACT}`" class="link">{{ LEGAL_CONTACT }}</a>
    </p>
  </LegalLayout>
</template>
