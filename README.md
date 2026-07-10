<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Iron & Aesthetic — Gym Apparel Store

A full storefront (React + React Router) backed by a real Express + MongoDB
API, with JWT sessions stored in httpOnly cookies, guest checkout, and a
protected admin back-office.

## Project structure

```
src/
  api/            fetch wrappers for the backend (auth, admin auth, products, orders, contact)
  context/        AppContext (storefront state) + AdminAuthContext (admin session)
  hooks/          useLegacyView (URL <-> view-name compatibility for a few components)
  layouts/        StorefrontLayout (Header/Footer) and AdminShell (admin sidebar)
  pages/          one file per route, wires context + API calls into the *View components
  pages/admin/    admin-only pages, code-split from the customer bundle
  routes/         AppRouter (route table) and RequireAdminAuth (route guard)
  components/     presentational *View components (mostly unchanged UI)
server/
  index.js        Express app entry point
  mongo.js        Mongoose connection (MONGODB_URI)
  models/         Product, Order, User, Admin, ContactMessage
  seed.js         one-time seed script (catalogue + demo accounts)
  routes/         REST endpoints (auth, admin-auth, products, orders, admin-orders, contact)
  middleware/     JWT verification, read from httpOnly cookies (requireCustomerAuth / requireAdminAuth)
  utils/          jwt signing, cookie helpers, mailer (nodemailer, console fallback)
```

## Run locally

**Prerequisites:** Node.js 18+, a MongoDB instance (local or Atlas)

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust `MONGODB_URI` if needed. A local
   MongoDB works out of the box:
   ```
   MONGODB_URI="mongodb://127.0.0.1:27017/iron-aesthetic"
   ```
3. Seed the catalogue and demo accounts (run once):
   ```
   npm run seed
   ```
4. Run both the frontend and the API together:
   ```
   npm run dev:full
   ```
   This starts the Vite dev server (http://localhost:3000) and the Express API
   (http://localhost:4000) side by side; Vite proxies `/api/*` to the backend
   so the browser only ever talks to one origin (needed for the session cookies).

   Prefer two terminals? Run `npm run server:watch` and `npm run dev` separately.

## Demo accounts

Created by `npm run seed`:

| Role     | Email                              | Password      |
|----------|-------------------------------------|---------------|
| Customer | john.doe@ironandaesthetic.com       | password123   |
| Admin    | admin@ironandaesthetic.com          | admin123      |

Admin login lives at `/admin/login` and is not linked from the storefront —
visiting any other `/admin/*` route without a valid session redirects there.

## Guest checkout

Placing an order does **not** require a customer account — same as most real
storefronts. Every order still captures full contact info (name, email,
phone, address) via the checkout form, so admins can see and fulfil guest
orders from `/admin/orders` exactly like logged-in ones. Only "My Orders" on
the customer side requires login (an order needs to be tied to an account to
show up there).

## Sessions & security

- JWTs are issued on login/register and set as **httpOnly cookies**
  (`ia_customer_token`, `ia_admin_token`) — never touched by client-side JS,
  so they aren't readable by an XSS payload.
- Customer and admin sessions are fully independent (different cookie,
  different JWT role, different middleware).
- Stock is checked server-side before an order is created (all-or-nothing —
  if any line item doesn't have enough stock, the whole order is rejected)
  and decremented atomically per item afterwards.
- Products with `stock <= 0` show a "SOLD OUT" badge and can't be added to
  the cart.

## Forgot password

`/forgot-password` sends a real 6-digit verification code by email via
`server/utils/mailer.js` (nodemailer). If `SMTP_HOST` isn't set in `.env`,
the code is printed to the API server's console instead — handy for local
development without setting up an SMTP account.

## Building for production

```
npm run build      # bundles the frontend into dist/
npm run server      # runs the API (point a static host / reverse proxy at dist/ + /api)
```

Serve the built frontend and the API from the same origin (or configure
`CORS_ORIGIN` + a reverse proxy) so the session cookies are sent correctly.
