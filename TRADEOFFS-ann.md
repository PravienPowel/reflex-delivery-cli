# Trade-off Log — Ann (Rider Commands + Sync/Scan Simulation)

Format per deliverable checklist: **what it is → why we accepted it anyway → what I'd do differently with more time.**

---

## 1. Sync: re-reading a shared JSON file instead of real-time sync

**What it is.**
`sync` doesn't sync anything over a network. It re-reads `deliveries.json` from disk and compares it against a locally stored timestamp (`meta.json`) to report what changed since your last sync. If two people run the CLI on *different machines*, they see different data.

**Why we accepted it anyway.**
For the demo, all roles run on one machine against one file, which is exactly what a shared backend gives you — minus the network. Re-reading a single source of truth is the honest core of what "sync" means here, and it let us ship the whole status-visibility story in a sprint week with zero infrastructure. The command still delivers real user value in-context: "what changed since I last looked" is the question a dispatcher actually asks.

**What I'd do differently.**
Move storage behind the same interface (`store.readAll` / `store.writeAll`) to an HTTP API backed by SQLite or Postgres. `sync` becomes a polling GET with an `?since=` timestamp; later, webhooks or WebSockets make it push-based. Because every command already goes through `store`, this is a swap, not a rewrite — that was deliberate architecture.

---

## 2. Scan simulation: typed confirmation code instead of a camera QR scan

**What it is.**
There's no scanning. When a rider marks a delivery "Picked Up", the CLI generates a random 4-digit code and stores it on the record. The customer keeps the code; at handover the rider types it into `confirm --code`. A match marks the delivery Delivered; a mismatch or missing code is rejected.

**Why we accepted it anyway.**
A CLI has no camera — that's a hardware constraint, not a design laziness. What proof-of-delivery actually needs is: (a) a secret the customer holds, (b) verification at handover, (c) an immutable record it happened. The code simulation preserves all three properties of a real scan while cutting scope by ~90%. It also survives the panel question "what does the customer get?" — a concrete 4-digit code is a better demo artifact than a fake progress bar.

**What I'd do differently.**
Generate a QR payload at pickup and render it as ASCII in the terminal so the customer shows it to a phone camera; the mobile rider app scans it and hits the same `/confirm` endpoint with the decoded token. Same flow, real optics. Also: rate-limit code attempts and use longer codes (6–8 digits) — 4 digits is brute-forceable at ~10k tries, acceptable only because there's no attacker in the demo threat model.

---

## 3. Status flow: forward-only validation enforced in the CLI, not the data layer

**What it is.**
`status` only allows Assigned → Picked Up → Delivered, one step at a time, and rejects moves on unassigned deliveries. But this rule lives in `status.js`. Anyone editing `deliveries.json` by hand — or another command written carelessly — can bypass it entirely.

**Why we accepted it anyway.**
The CLI is the only writer in this system, so command-level validation covers 100% of realistic writes for the demo. Centralizing enforcement would mean building a validation layer inside `store.js`, which is Pravien's territory — cross-cutting his module mid-sprint for a threat that doesn't exist yet is worse than documenting the gap.

**What I'd do differently.**
Move the state-machine check into the store/write path so *every* write is validated regardless of caller. In a client-server version, it becomes a server-side rule plus a database constraint (e.g., a partial index or trigger) — the server is the only writer, mirroring our current single-CLI-writer assumption but enforcing it technically rather than socially.

---

## Edge cases I can defend live (State → Context → Evidence)

| Question | My answer |
|---|---|
| "What if the rider confirms before pickup?" | **State:** Rejected. **Context:** `confirm` requires a stored `confirmation_code`, which only exists after "Picked Up". **Evidence:** run `confirm --id 1 --code 1234` on a fresh assignment — you get "no confirmation code yet". |
| "What if two dispatchers assign the same request?" | That's Kibet's flow, but from my side: last-write-wins on the JSON file; the second assign silently overwrites the first rider. Known trade-off, logged in Kibet's section. |
| "What happens if the JSON file is corrupt mid-write?" | **State:** The command crashes with a parse error. **Context:** no atomic writes — we write in place. **Evidence:** `store.js` uses plain `writeFileSync`. With more time: write-to-temp + rename, which is atomic on POSIX. |
| "Can a rider update someone else's delivery?" | Yes — there's no auth. **State:** accepted trade-off. **Context:** single-machine demo, roles are behavioral not authenticated. **Evidence:** no user identity exists anywhere in the data model. First roadmap item: PIN-per-rider. |
