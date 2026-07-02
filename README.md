# Prison Management System — React Frontend

React (Vite) frontend for the ASP.NET Core + ADO.NET Prison Management System backend.

## Pages (8 total — one per database table + core pages)

1. **Home** — welcome/landing page
2. **Login** — authenticates against `POST /api/users/login`
3. **About** — project/contact info
4. **Reports** — live counts from `GET /api/reports`
5. **Prisoners** — list + search + inline add/edit form + delete
6. **Cells** — list + search + inline add/edit form + delete
7. **Staff** — list + search + inline add/edit form + delete
8. **Users** — list + search + inline add/edit form + delete (login accounts/roles)

Login is required (via a protected route) to reach Prisoners, Cells, Staff, Users, and Reports.

## Setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` (the origin the backend's CORS policy already allows).

## Connecting to the backend

Edit `src/api/axios.js` if your API runs on a different port.

**Option A — HTTPS (recommended, matches this project's default `baseURL`):**

```bash
cd path\to\Prison_system      # the ASP.NET Core project folder
dotnet dev-certs https --trust    # once, so the browser trusts the dev cert
dotnet run --launch-profile https
```

`launchSettings.json` has two profiles (`http` and `https`). Plain `dotnet run`
uses the `http` profile by default (port 5232 only) — you must pass
`--launch-profile https` to also get `https://localhost:7229`, which is what
`src/api/axios.js` points to (`baseURL: "https://localhost:7229/api"`).

**Option B — HTTP only (simpler for local dev):**

1. In the backend's `Program.cs`, comment out:
   ```csharp
   // app.UseHttpsRedirection();
   ```
2. Run normally: `dotnet run`
3. Change `src/api/axios.js` → `baseURL: "http://localhost:5232/api"`

Either way, confirm the terminal shows `Now listening on: ...` for the port
you configured before testing login.

## Sample login

From `Phase1_Prison_Management_System.sql`:

| Username | Password  | Role  |
|----------|-----------|-------|
| admin    | admin123  | Admin |
| staff1   | staff123  | Staff |

## Notes

- Passwords in the sample data are stored in plain text for coursework
  purposes. For a production system these should be hashed (e.g. BCrypt)
  before being stored or compared.
- All forms validate required fields, string lengths, and numeric ranges
  client-side, matching the `[Required]`, `[StringLength]`, and `[Range]`
  data annotations on the backend models.
