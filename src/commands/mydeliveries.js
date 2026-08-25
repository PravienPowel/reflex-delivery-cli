// mydeliveries.js
// Used by: Rider
// Shows all deliveries assigned to a specific rider.
// Example: reflex mydeliveries --rider "Kibet"
//
// NOTE (Ann): This is a basic working version - feel free to extend it,
// e.g. sort by status, add a --status filter, prettier output, etc.

const store = require("../data/store");

function run(args) {
  const { rider } = args;

  if (!rider) {
    console.log("Usage: reflex mydeliveries --rider <riderName>");
    return;
  }

  const deliveries = store.readAll();
  const mine = deliveries.filter(
    (d) => d.assigned_rider && d.assigned_rider.toLowerCase() === rider.toLowerCase()
  );

  if (mine.length === 0) {
    console.log(`No deliveries currently assigned to ${rider}.`);
    return;
  }

  mine.forEach((d) => {
    console.log(
      `#${d.id} | ${d.customer_name} | ${d.address} | Item: ${d.item} | Status: ${d.status}`
    );
  });
}

module.exports = { run };
