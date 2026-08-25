// confirm.js
// Used by: Rider
// Simulates order confirmation "scanning" using a confirmation code
// instead of an actual barcode/QR scan.
// Example: reflex confirm --id 1 --code 1234
//
// How the simulation works:
// 1. When the rider marks a delivery "Picked Up", status.js generates a
//    random 4-digit code and stores it on the record.
// 2. The customer keeps that code. At handover, the rider runs `confirm`
//    and types it back in - the CLI equivalent of scanning.
// 3. A match marks the delivery Delivered; anything else is rejected.
//
// TRADE-OFF (Ann owns this - see TRADEOFFS-ann.md):
// A CLI has no camera, so we simulate the *outcome* of a scan (proof of
// handover) with a shared secret instead of the *mechanism* (optical QR).
// With more time this becomes a mobile app with a real QR scanner.

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

  if (delivery.status === "Delivered") {
    console.log(`Delivery #${id} is already confirmed as Delivered.`);
    return;
  }

  if (!delivery.confirmation_code) {
    console.log(
      `Delivery #${id} has no confirmation code yet. It must be marked "Picked Up" first.`
    );
    return;
  }

  if (String(code).trim() !== delivery.confirmation_code) {
    console.log(`Confirmation code does not match for delivery #${id}. Not marking as delivered.`);
    return;
  }

  delivery.status = "Delivered";
  delivery.delivered_at = new Date().toISOString();
  delivery.updated_at = delivery.delivered_at;
  delivery.confirmed_by_code = true;

  store.writeAll(deliveries);
  console.log(`Delivery #${id} confirmed with code ${code}. Marked as Delivered.`);
}

module.exports = { run };
