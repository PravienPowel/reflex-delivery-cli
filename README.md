# Reflex Delivery CLI

A command-line tool that helps small Kenyan retailers (electronics shops, pharmacies, hardware stores) coordinate deliveries — replacing WhatsApp and phone-call chaos with a simple, trackable workflow.

## Problem

Small retailers currently coordinate deliveries over WhatsApp and phone calls. There's no record of who's assigned, no status visibility, and no proof of delivery. Reflex fixes that with a lightweight CLI that any retailer, dispatcher, or rider can run from a terminal.

## Who uses it

- **Retailer staff** — logs a new delivery request (customer name, phone, address, item)
- **Dispatcher** — views open requests and assigns each to a rider
- **Rider** — views assigned deliveries and updates status (Assigned → Picked Up → Delivered)

## Commands

| Command | Who uses it | What it does |
|---|---|---|
| `reflex log` | Retailer staff | Logs a new delivery request |
| `reflex list` | Dispatcher | Lists open/pending requests |
| `reflex assign` | Dispatcher | Assigns a request to a rider |
| `reflex mydeliveries` | Rider | Shows a rider's assigned deliveries |
| `reflex status` | Rider | Updates delivery status |
| `reflex sync` | All | Simulates pulling in real-time request updates |
| `reflex confirm` | Rider | Simulates order confirmation (in place of a barcode scan) |

## Data model

Each delivery request stores:

- `id`
- `customer_name`
- `phone`
- `address`
- `item`
- `status` (Pending → Assigned → Picked Up → Delivered)
- `assigned_rider`
- `created_at` / `updated_at`

## Design notes

- **Storage:** JSON file (chosen for speed of setup within a short sprint, over a full database).
- **Sync:** Simulated by re-reading the shared data file — a real deployment would use a webhook or polling API.
- **Scan for confirmation:** Simulated with a confirmation code entered by the rider, in place of an actual barcode/QR scan.


## Team

Built by Pravien, Kibet, Ann, Morris, and Topster as part of the PLP "Reflex: The Readiness Sprint" assignment.

