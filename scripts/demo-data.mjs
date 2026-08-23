/**
 * Demo data for the marketing screenshots.
 *
 * The app's dev harness runs against a captured snapshot of a real review
 * queue. That snapshot is fine for development and unusable for a public
 * marketing site: it carries a client's repository name, colleagues' GitHub
 * handles, and real proprietary source in the diff bodies.
 *
 * ── Why nothing real is written down here ──────────────────────────────────
 *
 * The obvious way to sanitise is a rewrite table: `"realname" -> "fakename"`.
 * That table is then itself a list of exactly the names you were hiding, sitting
 * in a public repository. So this file contains **no real values at all**. It
 * derives them at runtime from the private app checkout:
 *
 *   - identities (logins, display names, `org/repo` strings) are discovered by
 *     shape from the fixture and the harness source, then mapped onto invented
 *     ones by position;
 *   - free text (titles, branches, descriptions) is replaced wholesale rather
 *     than rewritten, so there is nothing to miss;
 *   - every patch body is regenerated from the templates below, so no real
 *     source can survive by construction.
 *
 * `assertClean()` then re-derives the same identity list and fails if any of it
 * survived. Because the list is derived, it stays correct as the app's fixture
 * changes — and a fresh clone of this repo learns nothing from reading it.
 */

/** Fictional throughout. Northwind reads as sample data to anyone technical. */
const ORG = "northwind";
const REPO = `${ORG}/platform`;

/** Invented handles, assigned to discovered identities by position. */
const FAKE_LOGINS = ["mokafor", "svarga", "jhalden", "dpressley", "rkitteridge"];
const FAKE_NAMES = [
  "M. Okafor",
  "S. Varga",
  "J. Halden",
  "Dana Pressley",
  "R. Kitteridge",
];
const FAKE_REPOS = [REPO, `${ORG}/console`, `${ORG}/labs`, "CMRD-Consulting/Ratify"];
const FAKE_ORGS = [ORG, `${ORG}-labs`, "cmrd-consulting"];

const TITLES = [
  "fix(billing): hold shipment until payment capture is confirmed",
  "feat(api): publish order-created and expose carrier rate stats",
  "test(e2e): cover warehouse transfer rules end to end",
  "feat(console): manage multiple contacts per address book entry",
  "fix(console): re-render RateTableRow cells when row data changes",
  "feat(api): stage contact changes from a labelled add action",
  "chore(deps): bump the pdf toolchain to 4.2",
];

const BRANCHES = [
  "nw/fix/capture-hold",
  "nw/feat/order-events",
  "nw/test/transfer-rules",
  "nw/feat/address-contacts",
  "nw/fix/rate-table-render",
  "nw/feat/staged-contacts",
  "nw/chore/pdf-bump",
];

const BODY = `Holding a shipment currently trusts the client-supplied capture id.

This adds a verification step against the payments service and an audit
write on the success path.

- adds \`shipment_hold.reason\`, backfilled to \`capture_pending\`
- moves the capture lookup behind \`PaymentsClient#confirm\`
- fails closed: an unknown capture holds the shipment rather than releasing it

The migration is additive and safe to run ahead of the deploy.`;

/** Generic replacement text for any comment body found in the snapshot. */
const COMMENTS = [
  "Can we fail closed here? An unknown capture releasing the shipment is the worse default.",
  "Nit: this reads better as an early return.",
  "Worth a test for the expired-hold path.",
  "Agreed — pushed a fixup.",
];

// File paths are chosen to land in the classifier's tiers, because the risk
// ordering is the thing these screenshots exist to show:
//
//   **/migrations/**              → needs-eyes (MIGRATIONS)
//   **/billing/**                 → needs-eyes (MONEY PATHS)
//   **/*.spec.* net-deleting      → needs-eyes (DELETED TESTS)
//   **/*lock*, **/__snapshots__/  → noise      (GENERATED)
//
// Line comments, not a block: a glob containing `*/` would close one.
const PATHS = [
  "apps/api/migrations/20260818120000-create-shipment-holds.cjs",
  "apps/console/store/__tests__/billing.spec.js",
  "apps/api/services/__tests__/PaymentsService.spec.js",
  "apps/api/services/__tests__/HoldsService.spec.js",
  "apps/api/services/ShipmentService.js",
  "apps/api/services/ShipmentService.finalize.test.js",
  "apps/api/services/ShipmentService.recovery.test.js",
  "apps/api/services/ShipmentService.rateQuote.test.js",
  "apps/api/services/ShipmentService.overlap.test.js",
  "apps/api/services/PaymentsService.test.js",
  "apps/api/services/PaymentsService.js",
  "apps/api/models/ShipmentHold.js",
  "apps/api/models/ShipmentHold.test.js",
  "apps/api/controllers/ShipmentController.holds.test.js",
  "apps/api/openapi/carriers.yaml",
  "apps/console/pages/checkout.page.js",
  "apps/api/controllers/ShipmentController.js",
  "apps/api/controllers/CheckoutController.js",
  "apps/api/routes/shipments.js",
  "apps/api/routes/checkout.js",
  "apps/api/lib/PaymentsClient.js",
  "apps/api/lib/AuditLog.js",
  "apps/console/components/RateTable.vue",
  "apps/console/components/HoldBanner.vue",
  "apps/console/composables/useHolds.js",
  "apps/console/store/holds.js",
  "apps/console/store/checkout.js",
  "apps/api/jobs/ReleaseExpiredHolds.js",
  "apps/api/config/holds.js",
  "docs/runbooks/shipment-holds.md",
  "apps/console/__snapshots__/RateTable.spec.js.snap",
  "package-lock.json",
  "apps/console/vendor/pdf.min.js",
];

/** The migration is the file the diff pane actually renders. Generic on purpose. */
const MIGRATION = `'use strict';

const { Op } = require('sequelize');

const HOLD_REASONS = [
  'capture_pending',
  'capture_unknown',
  'captured',
  'release_in_progress',
  'release_unknown',
  'release_failed',
  'released',
];

const ORDER_REFERENCE_UNIQUE_INDEX =
  'shipment_holds_order_reference_unique';
const CAPTURE_ID_UNIQUE_INDEX = 'shipment_holds_capture_id_unique';
const SHIPMENT_HOLD_UNIQUE_INDEX =
  'shipment_holds_shipment_id_unique';

const holdReasonList = HOLD_REASONS.map(
  (reason) => \`'\${reason}'\`
).join(',');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShipmentHolds', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      shipmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Shipments', key: 'id' },
        onDelete: 'CASCADE',
      },
      orderReference: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      captureId: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      reason: {
        type: Sequelize.ENUM(...HOLD_REASONS),
        allowNull: false,
        defaultValue: 'capture_pending',
      },
      amountCents: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('ShipmentHolds', ['orderReference'], {
      name: ORDER_REFERENCE_UNIQUE_INDEX,
      unique: true,
    });

    await queryInterface.addIndex('ShipmentHolds', ['captureId'], {
      name: CAPTURE_ID_UNIQUE_INDEX,
      unique: true,
      where: { captureId: { [Op.ne]: null } },
    });

    await queryInterface.addIndex('ShipmentHolds', ['shipmentId'], {
      name: SHIPMENT_HOLD_UNIQUE_INDEX,
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'ShipmentHolds',
      SHIPMENT_HOLD_UNIQUE_INDEX
    );
    await queryInterface.dropTable('ShipmentHolds');
  },
};`;

/**
 * A short, plausible hunk for every file that is not the migration.
 *
 * These are read at about 500px wide in the split-view screenshot, so a
 * generated `const foo0 … foo7` ladder reads as obviously fake even at a
 * glance. Each template is a small refactor that holds together on its own.
 */
const HUNKS = [
  {
    header: "@@ -12,9 +12,12 @@ async function record(req, res) {",
    context: [
      "   const { shipmentId } = req.params;",
      "   const actor = req.user?.id ?? 'system';",
    ],
    del: [
      "-  const capture = req.body.captureId;",
      "-  if (!capture) {",
      "-    return res.status(400).json({ error: 'missing capture' });",
      "-  }",
    ],
    add: [
      "+  const capture = await payments.confirm(req.body.captureId);",
      "+  if (!capture.ok) {",
      "+    logger.warn('capture unconfirmed', { shipmentId, actor });",
      "+    return res.status(409).json({ error: capture.reason });",
      "+  }",
      "+",
      "+  await audit.write('shipment.hold', { shipmentId, actor });",
    ],
    tail: ["   return res.json({ ok: true });"],
  },
  {
    header: "@@ -34,8 +34,11 @@ export function useHolds(shipmentId) {",
    context: [
      "   const store = useHoldsStore();",
      "   const { holds } = storeToRefs(store);",
    ],
    del: ["-  watch(shipmentId, (id) => {", "-    store.fetch(id);", "-  });"],
    add: [
      "+  watch(shipmentId, (id, previous) => {",
      "+    if (id === previous) return;",
      "+    store.fetch(id, { signal: controller.signal });",
      "+  }, { immediate: true });",
      "+",
      "+  onScopeDispose(() => controller.abort());",
    ],
    tail: ["   return { holds, release: store.release };"],
  },
  {
    header: "@@ -58,7 +58,10 @@ class ShipmentService {",
    context: ["     const hold = await this.holds.findActive(shipmentId);"],
    del: [
      "-    if (hold.expiresAt < Date.now()) {",
      "-      await this.holds.release(hold.id);",
      "-    }",
    ],
    add: [
      "+    if (!hold) return null;",
      "+",
      "+    if (hold.expiresAt < this.clock.now()) {",
      "+      await this.holds.release(hold.id, 'expired');",
      "+      return null;",
      "+    }",
    ],
    tail: ["     return hold;", "   }"],
  },
  {
    header: "@@ -21,6 +21,9 @@ describe('release', () => {",
    context: ["     const service = new ShipmentService({ clock });"],
    del: ["-    expect(await service.release(id)).toBe(true);"],
    add: [
      "+    await expect(service.release(id)).resolves.toBe(true);",
      "+",
      "+    expect(audit.write).toHaveBeenCalledWith('shipment.release', {",
      "+      shipmentId: id,",
      "+    });",
    ],
    tail: ["   });"],
  },
];

function genericPatch(index) {
  const h = HUNKS[index % HUNKS.length];
  return [h.header, ...h.context, ...h.del, ...h.add, ...h.tail].join("\n");
}

/* ── Identity discovery ─────────────────────────────────────────────────── */

/** Collect every value stored under any of `keys`, anywhere in the tree. */
function collect(value, keys, found = new Set()) {
  if (Array.isArray(value)) {
    for (const v of value) collect(v, keys, found);
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === "string" && keys.includes(k) && v.trim()) found.add(v);
      else collect(v, keys, found);
    }
  }
  return found;
}

/**
 * Everything that identifies a person, org or repository, discovered by shape.
 *
 * Nothing here is written down — it is read out of the private app checkout on
 * every run, which is why this file can live in a public repo.
 */
export function discoverIdentities(real, harnessSource = "") {
  const logins = collect(real, ["login"]);
  const names = collect(real, ["name"]);
  const repos = collect(real, ["nameWithOwner"]);

  // The harness holds its own constants in source, not in the fixture.
  for (const m of harnessSource.matchAll(/login:\s*"([^"]+)"/g)) logins.add(m[1]);
  for (const m of harnessSource.matchAll(/name:\s*"([^"]+)"/g)) names.add(m[1]);
  for (const m of harnessSource.matchAll(/"([\w.-]+\/[\w.-]+)"/g)) repos.add(m[1]);

  // Owners implied by any discovered repo are identities too.
  for (const r of [...repos]) logins.add(r.split("/")[0]);

  const isPersonName = (n) => /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(n);
  return {
    logins: [...logins].filter((l) => /^[\w-]+$/.test(l)),
    names: [...names].filter(isPersonName),
    repos: [...repos],
  };
}

function buildIdentityMap(ids) {
  const map = new Map();
  ids.repos.forEach((r, i) => map.set(r, FAKE_REPOS[i % FAKE_REPOS.length]));
  ids.logins.forEach((l, i) => {
    // An org that owns a repo should map to that repo's owner, not a person.
    const asOwner = ids.repos.find((r) => r.split("/")[0] === l);
    map.set(
      l,
      asOwner
        ? map.get(asOwner).split("/")[0]
        : FAKE_LOGINS[i % FAKE_LOGINS.length],
    );
  });
  ids.names.forEach((n, i) => map.set(n, FAKE_NAMES[i % FAKE_NAMES.length]));
  // Longest first so `org/repo` is replaced before the bare `org`.
  return [...map.entries()].sort((a, b) => b[0].length - a[0].length);
}

/** Free text is replaced outright rather than rewritten — nothing to miss. */
const FREE_TEXT = new Set([
  "title",
  "body",
  "bodyText",
  "bodyHTML",
  "headRefName",
  "url",
  "avatarUrl",
  "avatar_url",
  "patch",
  "filename",
  "path",
]);

function scrubDeep(value, rewrites, key, seed = { n: 0 }) {
  if (typeof value === "string") {
    if (key === "avatarUrl" || key === "avatar_url") return null;
    if (key === "bodyText" || key === "bodyHTML" || key === "body") {
      return COMMENTS[seed.n++ % COMMENTS.length];
    }
    let out = value;
    for (const [from, to] of rewrites) out = out.split(from).join(to);
    return out;
  }
  if (Array.isArray(value)) {
    return value.map((v) => scrubDeep(v, rewrites, undefined, seed));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, scrubDeep(v, rewrites, k, seed)]),
    );
  }
  return value;
}

/* ── Build ──────────────────────────────────────────────────────────────── */

function buildFiles() {
  return PATHS.map((filename, i) => {
    const isMigration = filename.includes("/migrations/");
    // The three spec files under needs-eyes are net deletions; that is what
    // puts them in DELETED TESTS rather than with the other tests.
    const netDelete = i >= 1 && i <= 3;
    const additions = isMigration ? 138 : netDelete ? 4 : 20 + ((i * 37) % 260);
    const deletions = isMigration ? 0 : netDelete ? 90 + i * 12 : (i * 13) % 40;
    return {
      filename,
      status: isMigration ? "added" : "modified",
      additions,
      deletions,
      changes: additions + deletions,
      patch: isMigration
        ? "@@ -0,0 +1,138 @@\n" +
          MIGRATION.split("\n")
            .map((l) => `+${l}`)
            .join("\n")
        : genericPatch(i),
    };
  });
}

/**
 * Build the demo snapshot from the real one.
 *
 * The detail is pinned to the first queue row's title. In the real harness the
 * detail fixture is returned for whatever row is selected, so the queue said
 * one thing and the pane said another — visible, and slightly confusing, in
 * the old screenshots.
 */
export function buildDemoFixtures(real, harnessSource = "") {
  const ids = discoverIdentities(real, harnessSource);
  const rewrites = buildIdentityMap(ids);

  const files = buildFiles();

  const queue = real.queue.nodes.map((node, i) => ({
    ...node,
    title: TITLES[i % TITLES.length],
    url: `https://github.com/${REPO}/pull/${node.number}`,
    author: { login: FAKE_LOGINS[i % FAKE_LOGINS.length], avatarUrl: null },
    repository: { nameWithOwner: FAKE_REPOS[i % FAKE_REPOS.length] },
  }));

  const detail = {
    ...real.detail,
    number: queue[0].number,
    title: TITLES[0],
    body: BODY,
    url: `https://github.com/${REPO}/pull/${queue[0].number}`,
    baseRefName: "dev",
    headRefName: BRANCHES[0],
    author: { login: FAKE_LOGINS[0], avatarUrl: null },
    repository: { nameWithOwner: REPO },
    changedFiles: files.length,
    additions: files.reduce((n, f) => n + f.additions, 0),
    deletions: files.reduce((n, f) => n + f.deletions, 0),
  };

  // scrubDeep is what reaches the identities nested inside reviews, review
  // requests and threads; the fields named above are just the obvious ones.
  const out = scrubDeep(
    { queue: { ...real.queue, nodes: queue }, detail, files },
    rewrites,
  );

  // The rebuild above replaced these wholesale; put them back afterwards so
  // the free-text scrub does not overwrite the copy we actually want.
  out.detail.body = BODY;
  out.detail.title = TITLES[0];
  out.files = files;

  return out;
}

/**
 * The identity list, for scanning rendered screens.
 *
 * Derived, never stored — so this repo can be public without listing the very
 * names it exists to keep out of it.
 */
export function forbiddenFrom(real, harnessSource = "") {
  const ids = discoverIdentities(real, harnessSource);
  const fake = new Set([
    ...FAKE_LOGINS,
    ...FAKE_NAMES,
    ...FAKE_REPOS,
    ...FAKE_ORGS,
    ...FAKE_REPOS.map((r) => r.split("/")[0]),
  ]);
  return [...ids.logins, ...ids.names, ...ids.repos]
    .filter((t) => !fake.has(t))
    // Single characters and common words would match everything.
    .filter((t) => t.length >= 4);
}

export function assertClean(obj, real, harnessSource = "") {
  const forbidden = forbiddenFrom(real, harnessSource);
  const text = JSON.stringify(obj);
  const hits = forbidden.filter((t) => text.includes(t));
  if (hits.length) {
    throw new Error(
      `Demo fixtures still contain real identities: ${hits.join(", ")}\n` +
        "Refusing to continue — these would end up in a public repo.",
    );
  }
}
