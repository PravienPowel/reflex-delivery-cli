// status.js
// Used by: Rider
// Updates the status of an assigned delivery.
// Example: reflex status --id 1 --update "Picked Up"
//
// Status flow is forward-only: Assigned -> Picked Up -> Delivered.
// "Pending" belongs to the retailer (pre-assignment) and cannot be set here.
//
// EDGE CASES HANDLED (panel talking points):
// - Skipping a step (Assigned -> Delivered) is rejected.
// - Moving backwards (Delivered -> Picked Up) is rejected.
// - Updating a delivery that has no rider yet is rejected.

const store = require("../data/store");

const NEXT_STATUS = {
  Assigned: "Picked Up",
  "Picked Up": "Delivered",
};

function run(args) {
  const { id, update } = args;

  if (!id || !update) {
    console.log('Usage: reflex status --id <deliveryId> --update "Picked Up"');
    return;
  }

  const validTargets = Object.values(NEXT_STATUS);
  if (!validTargets.includes(update)) {
    console.log(`Invalid status. A rider can only set a status to: ${validTargets.join(", ")}`);
    return;
  }

  const deliveries = store.readAll();
  const delivery = deliveries.find((d) => d.id === parseInt(id, 10));

  if (!delivery) {
    console.log(`No delivery found with id ${id}.`);
    return;
  }

  if (!delivery.assigned_rider) {
    console.log(`Delivery #${id} has not been assigned to a rider yet.`);
    return;
  }

  const allowed = NEXT_STATUS[delivery.status];
  if (!allowed) {
    console.log(`Delivery #${id} is already "${delivery.status}" - no further status moves.`);
    return;
  }

  if (update !== allowed) {
    console.log(
      `Invalid move: #${id} is "${delivery.status}" and can only go to "${allowed}" (forward-only flow).`
    );
    return;
  }

  delivery.status = update;
  delivery.updated_at = new Date().toISOString();

  if (update === "Picked Up") {
    // Generate the confirmation code at pickup. The customer keeps it;
    // the rider must type it back in `confirm` to close the delivery.
    // This simulates scanning a code at handover.
    delivery.confirmation_code = String(Math.floor(1000 + Math.random() * 9000));
  }

  store.writeAll(deliveries);

  console.log(`Delivery #${id} status updated to "${update}".`);
  if (delivery.confirmation_code && update === "Picked Up") {
    console.log(`Confirmation code for #${id}: ${delivery.confirmation_code}`);
    console.log("Give this code to the customer - they will read it back to you on delivery.");
  }
}

module.exports = { run };
