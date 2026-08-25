// status.js
// Used by: Rider
// Updates the status of an assigned delivery.
// Example: reflex status --id 1 --update "Picked Up"
//
// EDGE CASE (talk about this in the panel):
// Statuses must move forward one step at a time: Pending -> Assigned ->
// Picked Up -> Delivered. A rider can't skip a step (e.g. Assigned straight
// to Delivered) or move backwards. This stops accidental/out-of-order
// updates and keeps the status_events-style history meaningful.
const store = require("../data/store");

const STATUS_ORDER = ["Pending", "Assigned", "Picked Up", "Delivered"];

function isValidTransition(current, next) {
  const currentIndex = STATUS_ORDER.indexOf(current);
  const nextIndex = STATUS_ORDER.indexOf(next);
  return nextIndex === currentIndex + 1;
}

function run(args) {
  const { id, update } = args;
  if (!id || !update) {
    console.log('Usage: reflex status --id <deliveryId> --update "Picked Up"');
    return;
  }

  if (!STATUS_ORDER.includes(update)) {
    console.log(`Invalid status. Must be one of: ${STATUS_ORDER.join(", ")}`);
    return;
  }

  const deliveries = store.readAll();
  const delivery = deliveries.find((d) => d.id === parseInt(id, 10));
  if (!delivery) {
    console.log(`No delivery found with id ${id}.`);
    return;
  }

  if (!isValidTransition(delivery.status, update)) {
    const currentIndex = STATUS_ORDER.indexOf(delivery.status);
    const nextAllowed = STATUS_ORDER[currentIndex + 1];
    console.log(
      `Cannot move delivery #${id} from "${delivery.status}" to "${update}".`
    );
    console.log(
      nextAllowed
        ? `Next valid status is "${nextAllowed}".`
        : `Delivery #${id} is already at its final status.`
    );
    return;
  }

  delivery.status = update;
  delivery.updated_at = new Date().toISOString();
  store.writeAll(deliveries);
  console.log(`Delivery #${id} status updated to "${update}".`);
}

module.exports = { run };
