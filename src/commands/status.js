// status.js
// Used by: Rider
// Updates the status of an assigned delivery.
// Example: reflex status --id 1 --update "Picked Up"
//
// NOTE (Ann): Consider validating that status only moves forward
// (Assigned -> Picked Up -> Delivered) and not backwards or skipped.
// That validation logic is a good "edge case" talking point for the panel.

const store = require("../data/store");

const VALID_STATUSES = ["Pending", "Assigned", "Picked Up", "Delivered"];

function run(args) {
  const { id, update } = args;

  if (!id || !update) {
    console.log('Usage: reflex status --id <deliveryId> --update "Picked Up"');
    return;
  }

  if (!VALID_STATUSES.includes(update)) {
    console.log(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
    return;
  }

  const deliveries = store.readAll();
  const delivery = deliveries.find((d) => d.id === parseInt(id, 10));

  if (!delivery) {
    console.log(`No delivery found with id ${id}.`);
    return;
  }

  delivery.status = update;
  delivery.updated_at = new Date().toISOString();

  store.writeAll(deliveries);
  console.log(`Delivery #${id} status updated to "${update}".`);
}

module.exports = { run };
