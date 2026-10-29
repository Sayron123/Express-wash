"use server";

import { randomUUID } from "node:crypto";
import { memoryInsert, memoryStoreOn } from "@/lib/memory-store";
import { anonClient } from "@/lib/supabase";
import { TIME_SLOTS, manilaToday, normalisePhone, refFromId } from "@/lib/shop";

export type BookingFields = "name" | "phone" | "address" | "pickup_date" | "time_slot" | "load_kg" | "notes";

export type BookingState =
  | { ok: false; errors: Partial<Record<BookingFields, string>>; formError?: string; values?: Record<string, string> }
  | {
      ok: true;
      ref: string;
      booking: { name: string; phone: string; address: string; pickup_date: string; time_slot: string; load_kg: number; notes: string | null };
    };

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function bookPickup(_prev: BookingState | null, fd: FormData): Promise<BookingState> {
  const values = Object.fromEntries(
    ["name", "phone", "address", "pickup_date", "time_slot", "load_kg", "notes"].map((k) => [k, text(fd, k)]),
  );
  const errors: Partial<Record<BookingFields, string>> = {};

  const name = values.name;
  if (name.length < 2 || name.length > 80) errors.name = "Enter the name the rider should ask for.";

  const phone = normalisePhone(values.phone);
  if (!phone) errors.phone = "Enter a mobile number like 0917 123 4567.";

  const address = values.address;
  if (address.length < 8 || address.length > 300) errors.address = "Enter the street, house number and barangay.";

  const today = manilaToday();
  const last = manilaToday(14);
  const date = values.pickup_date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today || date > last) {
    errors.pickup_date = "Choose a day from today to two weeks ahead.";
  }

  const slot = values.time_slot;
  if (!TIME_SLOTS.some((s) => s.id === slot)) errors.time_slot = "Choose a time slot.";

  const kg = Number(values.load_kg.replace(",", "."));
  if (!Number.isFinite(kg) || kg < 1 || kg > 60) errors.load_kg = "Enter a weight from 1 to 60 kg. A guess is fine.";

  const notes = values.notes;
  if (notes.length > 500) errors.notes = "Keep notes under 500 characters.";

  if (Object.keys(errors).length) return { ok: false, errors, values };

  // The id is made here so the slip can show a reference without reading the row back:
  // the public key is allowed to insert, never to select.
  const id = randomUUID();
  const booking = {
    name,
    phone: phone!,
    address,
    pickup_date: date,
    time_slot: slot,
    load_kg: Math.round(kg * 10) / 10,
    notes: notes || null,
  };

  try {
    if (memoryStoreOn()) {
      memoryInsert({ id, ...booking, time_slot: booking.time_slot as never, status: "pending" });
      return { ok: true, ref: refFromId(id), booking };
    }
    const { error } = await anonClient().from("pickups").insert({ id, ...booking, status: "pending" });
    if (error) throw error;
  } catch (e) {
    console.error("bookPickup failed", e);
    return {
      ok: false,
      errors: {},
      values,
      formError: "We couldn't save your booking just now. Please try again in a minute.",
    };
  }

  return { ok: true, ref: refFromId(id), booking };
}
