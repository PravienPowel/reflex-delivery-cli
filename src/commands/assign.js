// assign.js
// Used by: Dispatcher
// Assigns an existing delivery request to a rider.
// Example: reflex assign --id 1 --rider "Kibet"

const store = require("../data/store");

function run(args) {
  const { id, rider } = args;

  if (!id || !rider) {
    console.log("Usage: reflex assign --id <deliveryId> --rider <riderName>");
    return;
  }

  const deliveries = store.readAll();
  const delivery = deliveries.find((d) => d.id === parseInt(id, 10));

  if (!delivery) {
    console.log(`No delivery found with id ${id}.`);
    return;
  }

  delivery.assigned_rider = rider;
  delivery.status = "Assigned";
  delivery.updated_at = new Date().toISOString();

  store.writeAll(deliveries);
  console.log(`Delivery #${id} assigned to ${rider}.`);
}

module.exports = { run };
