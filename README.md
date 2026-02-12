## Bugs Fixed

### 1. Server crashes on startup — wrong import path
**File:** `routes/transaction.js`  
The route file was importing from `../validations/transaction` but that path didn't exist. The actual middleware was in `MiddleWare/TransactionSchema.js`.  
**Fix:** Corrected the import path and standardized the folder name to `middleware/`.
And another bug was that index.html was refrencing the wrong path for the main.js file.

### 2. POST route never sends a response
**File:** `routes/transaction.js`  
The POST handler creates the transaction and pushes it to the array, but never calls `res.json()`. The client just hangs.  
**Fix:** Added `res.status(201).json(tx)` after creating the transaction.

### 3. DELETE always returns 404 — type mismatch
**File:** `routes/transaction.js`  
Transaction IDs are numbers (generated via `Date.now()`), but `req.params.id` is always a string. The `===` comparison never matches.  
**Fix:** Parsing the param with `Number(id)` before comparison.

### 4. DELETE route never responds
**File:** `routes/transaction.js`  
Same issue as the POST — splices from the array but doesn't send anything back.  
**Fix:** Added `res.json({ message: "Transaction deleted", data: deleted })`.

### 5. GET route swallows errors
**File:** `routes/transaction.js`  
The catch block just does `console.error` and never sends a response. If anything goes wrong, the client hangs forever.  
**Fix:** Forward errors to global error handler using `next(err)`.

### 6. Frontend crashes when API fails
**File:** `src/api.js` (was `api.jsx`)  
`getTransactions()` returns `undefined` on error, which gets passed to `setTransactions()`. Then `.map()` blows up because you can't map over `undefined`.  
**Fix:** Return `[]` as a fallback on error.

### 7. No delete functionality on frontend
**File:** `src/api.js`  
There was no `deleteTransaction()` function at all — the backend had a DELETE route but the frontend had no way to call it.  
**Fix:** Added the function + delete button in the Dashboard UI.

### 8. No HTTP status checks in API calls
**File:** `src/api.js`  
Both `getTransactions` and `addTransaction` called `res.json()` without checking `res.ok` first. Server errors (4xx/5xx) were silently ignored.  
**Fix:** Switched to axios which handles this automatically, and added proper error extraction from responses.

---

## Validation Changes

- **Backend:** Added `abortEarly: false` so all validation errors are returned at once instead of one at a time. Changed error responses from plain text strings to structured JSON (`{ error, errors: [] }`).
- **Frontend:** Removed `category` field from the schema — there's no category input in the UI so it was causing confusion. Both frontend and backend schemas now validate the same 4 fields: `title`, `amount`, `type`, `date`.
- **Cleanup:** Deleted duplicate `DashboardSchema.js` file (kept only the `.jsx` version with stricter rules). Removed dead `backend/validation/` directory that nothing was importing.

---

## Refactor One Major Module

The original `routes/transaction.js` had everything crammed in: route definitions, validation middleware, database operations, and response formatting. That's a lot of responsibility for one file.

I extracted the business logic into `controllers/transactionController.js`. Now the routes file only defines paths and chains middleware → controller:

```js
router.post("/", createTransactionSchema, createTransaction);
router.get("/", getTransactionsSchema, getTransactions);
router.delete("/:id", deleteTransactionSchema, deleteTransaction);
```

I also separated Yup schema definitions from middleware into `models/transactionModel.js`. The middleware file now uses a generic `validate(schema, property)` helper, so adding new validation is just one line instead of copy-pasting 15 lines of try/catch.

---

## API Improvements

- Switched frontend from raw `fetch` to **axios** with a centralized instance (`services/api.js`). Base URL comes from env variable (`VITE_API_URL`).
- Added `deleteTransaction(id)` and `getTransactionSummary()` API functions.
- GET response now returns pagination metadata: `{ data, total, page, limit }` instead of a raw array.
- Integrated the `/summary` endpoint into the Dashboard — shows total balance at the top.

---

## Error Handling

**Backend:**
- All route handlers forward errors to the global error handler via `next(err)` instead of silently swallowing them with `console.error`.
- Validation middleware returns structured JSON errors, not plain text.
- Every code path sends a response — no more hanging requests.

**Frontend:**
- API functions return safe fallbacks (`[]` for lists) on network errors.
- `addTransaction` and `deleteTransaction` re-throw errors so the UI can show toast notifications.
- Added loading state on the submit button to prevent double-submissions.

---

Key changes: consistent lowercase naming, everything in frontend is inside `src/`, no dead/duplicate files, clear separation between models, middleware, and controllers on the backend.