Trade-Off Log — Kibet (Retailer & Dispatcher Commands)

1. Silent double-assignment (now mitigated with a warning, not eliminated)

What it is: Two dispatchers assigning the same delivery request in quick succession results in the second call overwriting the first, with no protection against the underlying race — only a warning printed to whoever runs the second command. The dispatcher who made the first assignment never sees it was overwritten.

Acceptable because: building real concurrency protection would mean abandoning the team's flat-JSON-file storage decision, and for a small number of dispatchers coordinating a small number of daily deliveries, the odds of a true simultaneous collision are low. A visible warning at least surfaces the conflict to whoever causes it, rather than failing completely silently as it did before this fix.

What I'd do differently with more time: add optimistic concurrency control — store a version number on each record, and reject a write if the version has changed since it was read — or push the confirmation to the dispatcher being overwritten (e.g., visible on their next list call), so the loss is visible to both parties, not just the second one.

2. No input validation on log

What it is: reflex log requires that customer, phone, address, and item are all present, but does no format checking — a malformed phone number, extra whitespace, or an accidentally duplicated request all get logged exactly as typed.

Acceptable because: the sprint's scope is proving the workflow (log → assign → track), not building a hardened production intake form; retailer staff are a small, trusted group, and validation logic adds real complexity (regex rules, locale-specific phone formats) that wasn't core to what this week is testing.

What I'd do differently with more time: add basic sanitization (trim whitespace) and a lightweight phone-format check, plus a duplicate-detection warning if an identical customer/item combination was logged in the last few minutes — mirroring the same "warn, don't block" philosophy used in assign.

3. No database — flat JSON file storage

What it is: the entire system's state lives in one JSON file, read fully into memory and rewritten fully on every change, with no transactions, indexing, or locking.

Acceptable because: at this scale (a handful of users, a small number of concurrent deliveries), a database adds real setup cost — schema design, a running server, connection config — that isn't justified for a one-week sprint meant to prove the workflow, not the infrastructure. It also means the whole project runs with zero install steps beyond git clone and node index.js, which matters for a live demo.

What I'd do differently with more time: this is also the direct root cause of weak point #1 — a real database could use a transaction or unique constraint to prevent the double-assignment race at the storage layer instead of just warning about it after the fact. With more time, SQLite would be the natural next step: still zero-server-setup, but with real atomic writes.