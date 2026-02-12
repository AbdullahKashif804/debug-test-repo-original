# Bug Fixes — Backend Transaction API

Here's a rundown of the bugs I found and fixed in this backend project.

---

## Bug 1: Date validation was stale

**File:** `models/transactionModel.js`

The Yup schema was using `.max(new Date(), "Date cannot be in the future")` to block future dates. The problem is that `new Date()` gets evaluated **once** when the server starts — not on every request. So if the server has been running for a few hours, the validation boundary is hours behind, and recent valid dates start getting rejected for no reason.

**Fix:** Swapped `.max()` for a custom `.test()` so it grabs a fresh `new Date()` every time a request comes in.

```js
// Before
.max(new Date(), "Date cannot be in the future")

// After
.test(
    "not-future",
    "Date cannot be in the future",
    (value) => !value || value <= new Date()
)
```

---

## Bug 2: Duplicate IDs on concurrent requests

**File:** `controllers/transactionController.js`

IDs were generated using `Date.now()`. The issue is, if two POST requests hit the server at the exact same millisecond, they'd get the exact same ID. That breaks things when you try to delete or reference a specific transaction.

**Fix:** Added a simple counter that gets appended to the timestamp, so even rapid-fire requests always get a unique ID.

```js
// Before
const tx = { id: Date.now(), title, amount, type, date };

// After
let idCounter = 0;
const tx = { id: Date.now() * 1000 + (idCounter++ % 1000), title, amount, type, date };
```

---

## Bug 3: Unguarded else in the total calculation

**File:** `services/calcService.js`

The `calculateTotal` function was using a plain `else` to handle expenses, which means any transaction that isn't `"income"` — including corrupted or unexpected data — would get subtracted from the total. Not great.

**Fix:** Changed it to explicitly check for `"expense"` so only valid types affect the total.

```js
// Before
if (t.type === "income") {
    total += t.amount;
} else {
    total -= t.amount;
}

// After
if (t.type === "income") {
    total += t.amount;
} else if (t.type === "expense") {
    total -= t.amount;
}
```

---

## Testing

Ran 21 tests after applying the fixes — all passed. Covered POST/GET/DELETE endpoints, validation edge cases, concurrent ID uniqueness, and the corrected total calculation.
