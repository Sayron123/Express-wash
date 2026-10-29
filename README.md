# Express Wash (demo)

A demo site for a 24/7 laundry shop in Novaliches, Quezon City, with free pickup and delivery.
Next.js 16 (App Router), TypeScript, Tailwind 4, Supabase.

- `/` home: services, prices with a live "what's in your bag" estimator, how it works, questions
- `/book` pickup form, saved to the Supabase `pickups` table as `pending`, then a claim-slip confirmation
- `/admin` pickups list with a status dropdown, behind a password set in `ADMIN_PASSWORD`

## Setup

1. Create a Supabase project and run [supabase/schema.sql](supabase/schema.sql) in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in the URL, the anon key, the service role key and an admin password.
3. `npm install`, then `npm run dev`.

The public key can only insert a `pending` booking (RLS). It cannot read, update or delete
bookings. `/admin` checks the password cookie on the server and then uses the service role key,
which stays on the server.

### Preview without Supabase

Set `DEMO_MEMORY_STORE=1` (and `ADMIN_PASSWORD`) in `.env.local`. Bookings then live in server
memory, seeded with a few sample rows, and are lost on restart. Never set this on a deployed site.

## Before showing this to the shop

Everything below is sample content. Swap it for the shop's real details:

- Prices: ₱180 per 8 kg load, ₱250 per comforter, self-service ₱60 wash / ₱60 dry, ₱20 detergent, ₱15 fabcon (`src/lib/shop.ts`)
- 24-hour turnaround, the time slots, the barangays covered (`src/lib/shop.ts`)
- The phone number `0900 000 0000` in the footer
- The flat drawings in `src/components/drawings.tsx` stand in for photographs of the shop

Demo by Say.
