# 🍰 Cake Delight — Next.js + Tailwind + MUI + Framer Motion + Supabase

Full-stack custom cake shop website (Sahiwal) with an animated storefront and a complete admin dashboard, rebuilt to match the approved design.

| Layer | Tech |
|---|---|
| Framework | **Next.js 16** (App Router, TypeScript, Turbopack) |
| Styling | **Tailwind CSS v4** (custom `@theme` design tokens) |
| Components | **Material UI v9** (MUI) — forms, dialogs, steppers, switches, snackbars |
| Animation | **Framer Motion 13** — hero entrance, scroll reveals, layout transitions, chart bars |
| Backend | **Supabase** (Postgres + Auth + Storage) — with a built-in local JSON fallback so the app runs with zero config |

## 🚀 Quick start

```bash
npm install
npm run dev        # → http://localhost:3000
```

No environment variables needed for local development — the app automatically uses a seeded local store (`data/db.json`) with demo orders, products, and messages.

- **Storefront** → http://localhost:3000
- **Admin dashboard** → http://localhost:3000/admin
- **Admin login (local mode)** → `admin` / `admin123`

## 🔌 Going live on Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the full contents of [`supabase/schema.sql`](supabase/schema.sql) (tables + RLS + seed data).
3. In **Authentication → Users → Add user**, create the admin: `admin@cakedelight.pk` + a strong password.
4. *(Optional, for product image uploads)* Create a **public** Storage bucket named `product-images`.
5. Copy `.env.example` → `.env.local` and fill in your project URL + keys.
6. Restart `npm run dev` — the app now reads/writes Supabase. Admin login is your Supabase Auth email + password.

## 📄 Pages

**Storefront** `/` home (hero, trust badges, categories, builder steps, filterable best sellers, event band, testimonials) · `/gallery` search + filters + sorting · `/product/[id]` sizes/flavors/message · `/custom` 4-step cake builder · `/flavors` · `/about` · `/contact` · `/cart` · `/checkout` (COD) · `/order-success` (tracking)

**Admin** `/admin` overview (revenue, 7-day animated chart, status pipeline, recent activity) · `/admin/orders` (search, status updates, detail dialog) · `/admin/custom-orders` (design briefs, notes, WhatsApp links) · `/admin/products` (CRUD + image upload) · `/admin/flavors` · `/admin/messages` · `/admin/testimonials`

## 🔌 API

Public: `GET /api/products|flavors|testimonials`, `POST /api/orders|custom-orders|contact`, `GET /api/orders/track/[no]`
Admin (Bearer): `POST /api/admin/login`, `GET /api/admin/me|stats`, `GET|POST /api/admin/[resource]`, `GET|PATCH|DELETE /api/admin/[resource]/[id]` where resource ∈ `products|orders|custom-orders|flavors|testimonials|messages`, plus `POST /api/admin/upload`.

## 💰 Business rules

Prices in Rs. (PKR), base = 2 lb · size multipliers 1/2/3/5 lb = ×0.6/×1/×1.4/×2.2 (rounded to Rs. 50, **recomputed server-side**) · delivery Rs. 200, free over Rs. 3,000 · Cash on Delivery · PK phone validation.

## 🗂 Structure

```
app/(site)/        storefront pages      app/api/          REST endpoints
app/admin/(dash)/  dashboard pages       lib/store.ts      data layer (Supabase ⇄ local)
components/        theme, cart, header…  supabase/schema.sql
```
