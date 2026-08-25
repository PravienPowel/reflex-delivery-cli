// log.js
// Used by: Retailer staff
// Logs a new delivery request.
// Example: reflex log --customer "Jane Wanjiru" --phone "0712345678" --address "Thika Rd" --item "HP Printer"

const store = require("../data/store");

function run(args) {
  const { customer, phone, address, item } = args;

  if (!customer || !phone || !address || !item) {
    console.log("Missing details. Usage:");
    console.log(
      'reflex log --customer "Name" --phone "0700000000" --address "Location" --item "Item description"'
    );
    return;
  }

  const deliveries = store.readAll();
  const newDelivery = {
    id: store.getNextId(deliveries),
    customer_name: customer,
    phone: phone,
    address: address,
    item: item,
    status: "Pending",
    assigned_rider: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  deliveries.push(newDelivery);
  store.writeAll(deliveries);

  console.log(`Delivery request #${newDelivery.id} logged for ${customer}.`);
}

module.exports = { run };
