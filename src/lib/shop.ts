// Shop facts shared by the home page, the booking form and the admin screen.
// Prices, weights and turnaround are sample values for the demo; confirm them with the shop.

export const PRICES = {
  loadKg: 8,
  washDryFold: 180, // per load, detergent and fabric conditioner included
  comforter: 250, // per piece
  selfWash: 60,
  selfDry: 60, // per 30 minutes
  detergent: 20,
  fabcon: 15,
} as const;

export const TURNAROUND_HOURS = 24;

// Rough dry weights, used only by the estimator on the home page.
export const BAG_ITEMS = [
  { id: "tops", label: "Shirts and tops", kg: 0.2, start: 12 },
  { id: "pants", label: "Pants and jeans", kg: 0.6, start: 3 },
  { id: "uniforms", label: "School or work uniforms", kg: 0.35, start: 0 },
  { id: "towels", label: "Towels", kg: 0.5, start: 4 },
  { id: "sheets", label: "Bedsheet sets", kg: 1.2, start: 1 },
] as const;

export const BARANGAYS = [
  "Bagbag",
  "Capri",
  "Gulod",
  "Kaligayahan",
  "Nagkaisang Nayon",
  "Novaliches Proper",
  "Pasong Putik",
  "San Agustin",
  "San Bartolome",
  "Santa Monica",
] as const;

export const TIME_SLOTS = [
  { id: "06-09", label: "6–9 am" },
  { id: "09-12", label: "9 am–12 nn" },
  { id: "12-15", label: "12–3 pm" },
  { id: "15-18", label: "3–6 pm" },
  { id: "18-21", label: "6–9 pm" },
  { id: "21-24", label: "9 pm–12 mn" },
  { id: "00-06", label: "12–6 am" },
] as const;

export type TimeSlotId = (typeof TIME_SLOTS)[number]["id"];

export const STATUSES = [
  { id: "pending", label: "Waiting for pickup" },
  { id: "picked_up", label: "Picked up" },
  { id: "washing", label: "Washing" },
  { id: "ready", label: "Ready to deliver" },
  { id: "delivered", label: "Delivered" },
] as const;

export type PickupStatus = (typeof STATUSES)[number]["id"];

export type Pickup = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  address: string;
  pickup_date: string; // YYYY-MM-DD, Manila date
  time_slot: TimeSlotId;
  load_kg: number;
  notes: string | null;
  status: PickupStatus;
};

export const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;

export const slotLabel = (id: string) => TIME_SLOTS.find((s) => s.id === id)?.label ?? id;
export const statusLabel = (id: string) => STATUSES.find((s) => s.id === id)?.label ?? id;

export const isStatus = (v: unknown): v is PickupStatus =>
  typeof v === "string" && STATUSES.some((s) => s.id === v);

/** Today's date in Manila as YYYY-MM-DD, whatever the server or browser timezone. */
export function manilaToday(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(d);
}

/** "Thu 30 Oct" for a YYYY-MM-DD date. */
export function shortDate(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("en-PH", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Short booking reference shown on the claim slip, taken from the row id. */
export const refFromId = (id: string) => `EW-${id.slice(0, 6).toUpperCase()}`;

/** Accepts 0917 123 4567, +63 917 123 4567 or 639171234567 and returns 09171234567, or null. */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, "");
  const m = digits.match(/^(?:\+?63|0)?(9\d{9})$/);
  return m ? `0${m[1]}` : null;
}

export const formatPhone = (p: string) => `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}`;
