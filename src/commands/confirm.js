// confirm.js
// Used by: Rider
// Simulates order confirmation "scanning" using a confirmation code
// instead of an actual barcode/QR scan.
// Example: reflex confirm --id 1 --code 1234
//
// TRADE-OFF (talk about this in the panel):
// A CLI has no camera to scan a real barcode/QR code. We simulate the
// same outcome (proof the item was confirmed at handover) using a typed
// confirmation code. With more time/a mobile app, this would be a real
// camera-based QR scan.
//
// NOTE (Ann): Right now any code is accepted - feel free to add real
// code generation/validation logic if you want to make this more robust.

const store = require("../data/store");

function run(args) {
  const { id, code } = args;

  if (!id || !code) {
    console.log("Usage: reflex confirm --id <deliveryId> --code <confirmationCode>");
    return;
  }

  const deliveries = store.readAll();
  const delivery = deliveries.find((d) => d.id === parseInt(id, 10));

  if (!delivery) {
    console.log(`No delivery found with id ${id}.`);
    return;
  }

  delivery.status = "Delivered";
  delivery.updated_at = new Date().toISOString();

  store.writeAll(deliveries);
  console.log(`Delivery #${id} confirmed with code ${code}. Marked as Delivered.`);
}

module.exports = { run };
