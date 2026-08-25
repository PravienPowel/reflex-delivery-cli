// list.js
// Used by: Dispatcher
// Lists delivery requests, optionally filtered by status.
// Example: reflex list --status Pending

const store = require("../data/store");

function run(args) {
  const deliveries = store.readAll();
  const filterStatus = args.status;

  const filtered = filterStatus
    ? deliveries.filter(
        (d) => d.status.toLowerCase() === filterStatus.toLowerCase()
      )
    : deliveries;

  if (filtered.length === 0) {
    console.log("No delivery requests found.");
    return;
  }

  filtered.forEach((d) => {
    console.log(
      `#${d.id} | ${d.customer_name} | ${d.item} | Status: ${d.status} | Rider: ${
        d.assigned_rider || "Unassigned"
      }`
    );
  });
}

module.exports = { run };
