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
    console.log(`No delivery found with id ${id}`);
    return;
  }

  if (delivery.assigned_rider) {
    console.log(`Warning: Delivery #${id} is already assigned to ${delivery.assigned_rider} (current status: ${delivery.status}). Reassigning will overwrite this.`);
  }

  delivery.assigned_rider = rider;
  delivery.status = "Assigned";
  delivery.updated_at = new Date().toISOString();

  store.writeAll(deliveries);
  console.log(`Delivery ${id} assigned to ${rider}.`);
}

module.exports = { run };