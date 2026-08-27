# Reflex CLI Testing Report

## Tester
Testing, Demo Script & Timing

## Branch Tested
main

## End-to-End Test

The current main branch was pulled and confirmed up to date before testing.

### Test sequence

`log → assign → status → confirm → sync`

### Result

**PASS**

The delivery successfully progressed through:

`Pending → Assigned → Picked Up → Delivered`

The final sync detected the delivery in `Delivered` status.

## Edge Cases Tested

### 1. Invalid delivery ID

Command:

`node index.js assign --id 999 --rider "rider001"`

Result:

`No delivery found with id 999`

**PASS** — invalid delivery ID was handled without assigning a nonexistent delivery.

### 2. Incorrect confirmation code

Command:

`node index.js confirm --id 2 --code 9999`

Result:

`Incorrect confirmation code for delivery #2. Please check with the retailer and try again.`

**PASS** — incorrect confirmation code was rejected.

## Additional Tests

- Invalid status → rejected with valid status options.
- Missing required log details → usage message displayed.
- Unknown rider → no deliveries reported.
- Repeated sync with no changes → `No changes since last sync.`

## Evidence

Terminal screenshots were captured during testing as supporting evidence.

## Timing

Formal timing will be recorded during the team's dry runs.
