// sync.js
// Used by: All roles
// Simulates "real-time syncing" by re-reading the shared data file and
// reporting what's changed since the last time sync was run.
//
// TRADE-OFF (talk about this in the panel):
// A CLI can't do real push-based real-time sync - there's no persistent
// connection to a server. In a real deployment this would be a webhook
// or a polling API against a shared backend. Here we simulate the same
// *outcome* (the user finds out what's new) by re-reading the shared
// JSON file and comparing it against a small local marker file that
// remembers the last time sync was called. Acceptable because all roles
// already read/write the same shared file, so "sync" and "re-read" have
// the same practical effect for a single-machine sprint demo.
const fs = require("fs");
const path = require("path");
const store = require("../data/store");

const SYNC_STATE_PATH = path.join(__dirname, "../data/.sync-state.json");

function readLastSyncTime() {
  try {
    const raw = fs.readFileSync(SYNC_STATE_PATH, "utf8");
    return JSON.parse(raw).lastSyncedAt || null;
  } catch (err) {
    return null; // no marker file yet = first ever sync
  }
}

function writeLastSyncTime(timestamp) {
  fs.writeFileSync(SYNC_STATE_PATH, JSON.stringify({ lastSyncedAt: timestamp }, null, 2));
}

function run() {
  const deliveries = store.readAll();
  const lastSyncedAt = readLastSyncTime();
  const now = new Date().toISOString();

  const changedSinceLastSync = lastSyncedAt
    ? deliveries.filter((d) => d.updated_at > lastSyncedAt)
    : deliveries; // first sync ever: everything counts as "new"

  console.log(`Synced. ${deliveries.length} total delivery record(s) found.`);

  if (changedSinceLastSync.length > 0) {
    console.log(`${changedSinceLastSync.length} record(s) new or updated since last sync:`);
    changedSinceLastSync.forEach((d) => {
      console.log(`  #${d.id} | ${d.customer_name} | Status: ${d.status}`);
    });
  } else {
    console.log("No changes since last sync.");
  }

  writeLastSyncTime(now);
}

module.exports = { run };
