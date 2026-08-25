// mydeliveries.js
// Used by: Rider
// Shows all deliveries assigned to a specific rider.
// Example: reflex mydeliveries --rider "David"
// Example: reflex mydeliveries --rider "David" --status "Picked Up"
const store = require("../data/store");

const STATUS_ORDER = ["Assigned", "Picked Up", "Delivered", "Pending"];

function run(args) {
  const { rider, status } = args;
  if (!rider) {
    console.log("Usage: reflex mydeliveries --rider <riderName> [--status <status>]");
    return;
  }

  const deliveries = store.readAll();
  let mine = deliveries.filter(
    (d) => d.assigned_rider && d.assigned_rider.toLowerCase() === rider.toLowerCase()
  );

  if (status) {
    mine = mine.filter((d) => d.status.toLowerCase() === status.toLowerCase());
  }

  if (mine.length === 0) {
    console.log(
      status
        ? `No deliveries with status "${status}" assigned to ${rider}.`
        : `No deliveries currently assigned to ${rider}.`
    );
    return;
  }

  mine.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));

  console.log(`${mine.length} delivery(ies) assigned to ${rider}:\n`);
  mine.forEach((d) => {
    console.log(
      `#${d.id} | ${d.customer_name} | ${d.address} | Item: ${d.item} | Status: ${d.status}`
    );
  });
}

module.exports = { run };
