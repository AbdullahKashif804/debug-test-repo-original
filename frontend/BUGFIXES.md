# Bug Fixes — Frontend

Here's a rundown of the bugs I found and fixed in the frontend.

---

## Bug 1: Wrong file path in index.html

**File:** `index.html`

The `<script>` tag was pointing to `/src/main.jsx` (lowercase "m"), but the actual file is called `Main.jsx` with a capital "M". This works fine on Windows since it doesn't care about case, but the moment you deploy to something like Vercel or any Linux-based server, the app just refuses to load — blank screen, no errors in the console, nothing helpful.

**Fix:** Just updated the path to match the actual filename.

```js
// Before
<script type="module" src="/src/main.jsx"></script>

// After
<script type="module" src="/src/Main.jsx"></script>
```

---

## Bug 2: Date validation goes stale over time

**File:** `src/schemas/dashboardSchema.js`

This was the exact same bug that was already fixed on the backend. The Yup schema was using `.max(new Date(), ...)` to block future dates, but `new Date()` only runs once when the module loads — not on every form submission. So if you leave the app open for a while, it starts rejecting perfectly valid dates because its idea of "now" is hours old.

**Fix:** Replaced `.max()` with a `.test()` so it grabs a fresh `new Date()` every time.

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

## Bug 3: Form sends amount as a string instead of a number

**File:** `src/components/Dashboard.jsx`

The submit function was calling `Dashboardschema.validate(formData)` to check for errors, but it was throwing away the return value. The thing is, Yup's `validate()` doesn't just check — it also casts values. So it converts the amount from `"100"` (string from the input field) to `100` (actual number). But since we weren't using the returned value, we were sending the raw `formData` to the API with the amount still as a string.

The backend happened to handle it because its own middleware re-validates and casts, but that's just luck — the frontend should send the right types.

**Fix:** Used the validated/cast data from Yup instead of the raw form data.

```js
// Before
await Dashboardschema.validate(formData, { abortEarly: false });
await addTransaction(formData);

// After
const validatedData = await Dashboardschema.validate(formData, { abortEarly: false });
await addTransaction(validatedData);
```

---

## Bug 4: No null check on summary data

**File:** `src/components/Dashboard.jsx`

The `fetchSummary` function was doing `setSummary(data)` without checking if `data` was actually something. If the API call failed in a weird way and returned `undefined`, the component would crash the next time it tried to read `summary.total`.

**Fix:** Added a simple fallback.

```js
// Before
setSummary(data);

// After
setSummary(data || { total: 0 });
```

---

## Verification

Ran `vite build` after all the fixes — built successfully with no errors.
