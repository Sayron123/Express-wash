import "server-only";
import type { Pickup, PickupStatus } from "./shop";
import { manilaToday } from "./shop";

// Local preview without Supabase: set DEMO_MEMORY_STORE=1 and bookings live in server memory
// (seeded with a few sample rows, lost on restart). Never set this on a deployed site.

export const memoryStoreOn = () => process.env.DEMO_MEMORY_STORE === "1";

const g = globalThis as unknown as { __ewPickups?: Pickup[] };

function seed(): Pickup[] {
  const now = Date.now();
  const at = (minsAgo: number) => new Date(now - minsAgo * 60_000).toISOString();
  const row = (p: Omit<Pickup, "id" | "notes"> & { notes?: string | null; n: number }): Pickup => {
    const { n, ...rest } = p;
    return { id: `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`, notes: null, ...rest };
  };
  return [
    row({ n: 1, created_at: at(35), name: "Maria Santos", phone: "09171234567", address: "12 Kaligayahan St., Brgy. Kaligayahan", pickup_date: manilaToday(), time_slot: "18-21", load_kg: 7, status: "pending", notes: "Green gate beside the sari-sari store" }),
    row({ n: 2, created_at: at(80), name: "Jun Reyes", phone: "09281112233", address: "Blk 4 Lot 9, Sta. Monica Village, Brgy. Santa Monica", pickup_date: manilaToday(), time_slot: "21-24", load_kg: 11.5, status: "pending" }),
    row({ n: 3, created_at: at(190), name: "Liza Mendoza", phone: "09065557788", address: "88 Quirino Hwy, Brgy. Gulod", pickup_date: manilaToday(1), time_slot: "09-12", load_kg: 5, status: "pending", notes: "Two comforters" }),
    row({ n: 4, created_at: at(420), name: "Ramon Cruz", phone: "09193334455", address: "3 Pag-asa St., Brgy. San Bartolome", pickup_date: manilaToday(), time_slot: "06-09", load_kg: 8, status: "washing" }),
    row({ n: 5, created_at: at(600), name: "Ana Villanueva", phone: "09451239876", address: "21 Sampaguita St., Brgy. Bagbag", pickup_date: manilaToday(), time_slot: "06-09", load_kg: 6.5, status: "picked_up" }),
    row({ n: 6, created_at: at(1500), name: "Carlo Bautista", phone: "09778889900", address: "Unit 2B, 45 Susano Rd., Brgy. San Agustin", pickup_date: manilaToday(-1), time_slot: "15-18", load_kg: 9, status: "ready" }),
    row({ n: 7, created_at: at(2900), name: "Grace Lim", phone: "09983216540", address: "7 Ilang-Ilang St., Brgy. Nagkaisang Nayon", pickup_date: manilaToday(-2), time_slot: "12-15", load_kg: 4, status: "delivered" }),
  ];
}

export function memoryRows(): Pickup[] {
  g.__ewPickups ??= seed();
  return g.__ewPickups;
}

export function memoryInsert(p: Omit<Pickup, "created_at">) {
  memoryRows().push({ ...p, created_at: new Date().toISOString() });
}

export function memoryUpdate(id: string, status: PickupStatus) {
  const r = memoryRows().find((x) => x.id === id);
  if (r) r.status = status;
}
