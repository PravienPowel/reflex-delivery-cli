// sync.js
// Used by: All roles
// Simulates "real-time syncing" by re-reading the shared data file.
//
// TRADE-OFF (talk about this in the panel):
// A CLI can't do real push-based real-time sync. In a real deployment
// this would be a webhook or a polling API against a shared backend.
// Here we simulate it by simply re-reading the JSON file, since all
// team members/roles are reading from the same shared data source.
//
// NOTE (Ann): This is intentionally simple right now - feel free to add
// something like "X new requests since last sync" for a nicer demo moment.

const store = require("../data/store");

function run(args) {
  const deliveries = store.readAll();
  console.log(`Synced. ${deliveries.length} total delivery record(s) found.`);
}

module.exports = { run };
