// sync.js
// Used by: All roles
// Simulates "real-time syncing" by re-reading the shared data file.
//
// TRADE-OFF (Ann owns this - see TRADEOFFS-ann.md):
// A CLI can't do push-based real-time sync. In a real deployment this
// would be a webhook or polling API against a shared backend. Here we
// simulate it by re-reading the JSON file that all roles share, and we
// remember the last sync time so we can report what changed since then.
//
// What you get: total records, a per-status breakdown, and how many
// records were created/updated since your previous `sync`.

const store = require("../data/store");

function run(args) {
  const now = new Date().toISOString();
  const lastSyncAt = store.readMeta().last_sync_at;

  const deliveries = store.readAll();

  console.log(`Synced at ${now}.`);
  console.log(`Total delivery record(s): ${deliveries.length}`);

  if (deliveries.length > 0) {
    const byStatus = {};
    deliveries.forEach((d) => {
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;
    });
    console.log("By status:");
    Object.keys(byStatus)
      .sort()
      .forEach((s) => console.log(`  ${s}: ${byStatus[s]}`));
  }

  if (lastSyncAt) {
    const changed = deliveries.filter(
      (d) => (d.updated_at || d.created_at || "") > lastSyncAt
    );
    if (changed.length === 0) {
      console.log("No changes since your last sync.");
    } else {
      console.log(`${changed.length} record(s) changed since last sync (${lastSyncAt}):`);
      changed.forEach((d) =>
        console.log(`  #${d.id} | ${d.customer_name} | Status: ${d.status}`)
      );
    }
  } else {
    console.log("First sync - no previous checkpoint to compare against.");
  }

  store.writeMeta({ last_sync_at: now });
}

module.exports = { run };
