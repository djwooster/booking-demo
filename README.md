# APEX Studio — Fitness Booking System

A production-ready fitness studio booking system built as a portfolio showcase.

**Tech stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Zustand · Recharts · Radix UI · Sonner

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

| Role     | Email                    | Password   |
|----------|--------------------------|------------|
| Customer | demo@example.com         | demo123    |
| Admin    | admin@apexstudio.com     | admin123   |

Or sign up with any email + 6-character password.

---

## Features

### Customer
- Browse 2-week class schedule (list & grid view)
- Filter by class type and instructor
- Book classes with real-time spot availability
- Join waitlist for full classes
- Cancel bookings (2-hour policy enforced)
- Purchase membership plans (Drop-in · 10-Class Pack · Unlimited)
- Profile with achievement tracking

### Admin (`/admin`)
- Dashboard with KPI metrics and Recharts visualizations
- Full CRUD for class types
- Schedule management (add, cancel, delete sessions)
- Bookings table with search and status filters
- Instructor directory with detail profiles
- Membership plan analytics

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── (auth)/login          # Login
│   ├── (auth)/signup         # Sign up
│   ├── classes/              # Class browser & booking
│   ├── bookings/             # My bookings
│   ├── memberships/          # Membership purchase
│   ├── profile/              # User profile
│   └── admin/                # Admin dashboard
│       ├── classes/          # Class management
│       ├── schedule/         # Schedule management
│       ├── bookings/         # All bookings
│       ├── instructors/      # Instructor profiles
│       └── memberships/      # Plan analytics
├── components/
│   ├── ui/                   # Radix-based UI components
│   ├── layout/               # Navbar, Footer, AdminSidebar
│   └── providers/            # Theme + toast providers
├── lib/
│   ├── store.ts              # Zustand state + auth
│   ├── mock-data.ts          # Realistic seed data
│   ├── stripe.ts             # Mock Stripe integration
│   └── resend.ts             # Mock email integration
└── types/index.ts            # TypeScript interfaces
```

---

## Connecting Real Services

### Supabase
1. Create a project at supabase.com
2. Run `supabase/schema.sql` in your SQL editor
3. Copy keys to `.env.local` (see `.env.local.example`)

### Stripe (Payments)
1. Get keys from dashboard.stripe.com
2. Add to `.env.local`
3. Replace mock calls in `src/lib/stripe.ts` with real Stripe SDK

### Resend (Emails)
1. Get API key from resend.com
2. Add to `.env.local`
3. Replace mock calls in `src/lib/resend.ts` with real Resend SDK

---

## Design System

| Token        | Value                  |
|--------------|------------------------|
| Primary      | #16A34A (green-600)    |
| Accent       | #0D9488 (teal-600)     |
| Background   | #FAFAFA (stone-50)     |
| Text         | #1C1917 (stone-900)    |

Dark mode fully supported via next-themes.
