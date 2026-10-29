"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import ClaimSlip from "@/components/ClaimSlip";
import Reveal from "@/components/Reveal";
import { PRICES, TIME_SLOTS, formatPhone, manilaToday, normalisePhone, peso, shortDate, slotLabel } from "@/lib/shop";
import { useNowMinute } from "@/lib/use-now";
import { bookPickup, type BookingFields, type BookingState } from "./actions";

const loadsFor = (kg: number) => Math.max(1, Math.ceil(kg / PRICES.loadKg));

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p id={id} className="mt-2 t-small text-[#b3261e]">
      {msg}
    </p>
  ) : null;
}

export default function BookForm() {
  const params = useSearchParams();
  const startKg = Math.min(60, Math.max(1, Number(params.get("kg")) || 6));

  const [state, action, pending] = useActionState<BookingState | null, FormData>(bookPickup, null);
  const now = useNowMinute();
  const today = now === null ? undefined : manilaToday();
  const lastDay = now === null ? undefined : manilaToday(14);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [kg, setKg] = useState(String(startKg));
  const [notes, setNotes] = useState("");
  // A field's error clears as soon as it is edited, until the next submit.
  const [edited, setEdited] = useState<{ after: BookingState | null; fields: Set<string> }>({ after: state, fields: new Set() });
  if (edited.after !== state) setEdited({ after: state, fields: new Set() });

  if (state?.ok)
    return (
      <>
        <Intro title={<>Pickup<br />booked</>} />
        <Confirmation ref_={state.ref} booking={state.booking} />
      </>
    );

  const touch = (f: BookingFields) => {
    if (!edited.fields.has(f)) setEdited((e) => ({ ...e, fields: new Set(e.fields).add(f) }));
  };
  const allErrors = state && !state.ok ? state.errors : {};
  const errors = Object.fromEntries(
    Object.entries(allErrors).filter(([f]) => !edited.fields.has(f)),
  ) as Partial<Record<BookingFields, string>>;
  const err = (f: BookingFields) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": [errors[f] ? `${f}-error` : "", f === "load_kg" ? "load-hint" : ""].filter(Boolean).join(" ") || undefined,
  });

  const kgNum = Number(kg.replace(",", "."));
  const kgOk = Number.isFinite(kgNum) && kgNum >= 1 && kgNum <= 60;
  const loads = kgOk ? loadsFor(kgNum) : 0;
  const pickupDate = date || today;
  const normPhone = normalisePhone(phone);

  const stepKg = (d: number) => {
    const base = kgOk ? kgNum : startKg;
    setKg(String(Math.min(60, Math.max(1, Math.round((base + d) * 2) / 2))));
    touch("load_kg");
  };

  return (
    <>
    <Intro
      title={<>Book a free<br />pickup</>}
      text="Tell us where and when. A rider comes to your door in Novaliches, weighs the bag and brings it back folded."
    />
    <form action={action} noValidate className="grid12 gap-y-12 pb-[var(--section)]">
      <div className="col-span-12 space-y-8 lg:col-span-7">
        <Reveal>
          <label htmlFor="name" className="block font-medium">Name</label>
          <input id="name" name="name" className="field mt-2" autoComplete="name" required value={name} onChange={(e) => { setName(e.target.value); touch("name"); }} {...err("name")} />
          <FieldError id="name-error" msg={errors.name} />
        </Reveal>
        <Reveal>
          <label htmlFor="phone" className="block font-medium">Mobile number</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" className="field mt-2" autoComplete="tel" placeholder="0917 123 4567" required value={phone} onChange={(e) => { setPhone(e.target.value); touch("phone"); }} {...err("phone")} />
          <FieldError id="phone-error" msg={errors.phone} />
        </Reveal>
        <Reveal>
          <label htmlFor="address" className="block font-medium">Pickup address</label>
          <textarea id="address" name="address" className="field mt-2" autoComplete="street-address" rows={3} required value={address} onChange={(e) => { setAddress(e.target.value); touch("address"); }} {...err("address")} />
          <FieldError id="address-error" msg={errors.address} />
        </Reveal>
        <Reveal>
          <label htmlFor="pickup_date" className="block font-medium">Pickup day</label>
          <input id="pickup_date" name="pickup_date" type="date" className="field mt-2 sm:max-w-[16rem]" min={today} max={lastDay} required value={date || today || ""} onChange={(e) => { setDate(e.target.value); touch("pickup_date"); }} {...err("pickup_date")} />
          <FieldError id="pickup_date-error" msg={errors.pickup_date} />
        </Reveal>
        <Reveal as="fieldset" {...err("time_slot")}>
          <legend className="font-medium">Time slot</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIME_SLOTS.map((s) => (
              <label
                key={s.id}
                className="flex min-h-[52px] cursor-pointer items-center justify-center bg-[var(--paper)] px-2 text-center t-body transition-colors duration-150 has-[:checked]:bg-ink has-[:checked]:text-[var(--paper)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--accent)]"
              >
                <input type="radio" name="time_slot" value={s.id} className="sr-only" checked={slot === s.id} onChange={() => { setSlot(s.id); touch("time_slot"); }} />
                {s.label}
              </label>
            ))}
          </div>
          <FieldError id="time_slot-error" msg={errors.time_slot} />
        </Reveal>
        <Reveal>
          <label htmlFor="load_kg" className="block font-medium">Load size in kg</label>
          <div className="mt-2 flex items-stretch gap-1">
            <button type="button" className="step-btn !h-[52px] !w-[52px]" aria-label="Half a kilo less" onClick={() => stepKg(-0.5)}>−</button>
            <input id="load_kg" name="load_kg" inputMode="decimal" className="field w-28 text-center nums" required value={kg} onChange={(e) => { setKg(e.target.value); touch("load_kg"); }} {...err("load_kg")} />
            <button type="button" className="step-btn !h-[52px] !w-[52px]" aria-label="Half a kilo more" onClick={() => stepKg(0.5)}>+</button>
          </div>
          <p id="load-hint" className="mt-2 max-w-[48ch] text-muted">
            A guess is fine. A full laundry bag is usually 6 to 8 kg, and the rider weighs it at your door.
          </p>
          <FieldError id="load_kg-error" msg={errors.load_kg} />
        </Reveal>
        <Reveal>
          <label htmlFor="notes" className="block font-medium">Notes for the rider <span className="font-normal text-muted">(optional)</span></label>
          <textarea id="notes" name="notes" className="field mt-2" rows={3} maxLength={500} placeholder="Gate code, landmark, comforters, same-day request" value={notes} onChange={(e) => { setNotes(e.target.value); touch("notes"); }} {...err("notes")} />
          <FieldError id="notes-error" msg={errors.notes} />
        </Reveal>
      </div>

      <aside className="col-span-12 lg:col-span-4 lg:col-start-9 lg:row-span-2" aria-label="Your claim slip so far">
        <Reveal className="lg:sticky lg:top-8">
          <ClaimSlip
            className="mx-auto w-[86%] max-w-[380px] lg:w-full"
            meta="Pickup request"
            rows={[
              { label: "Pickup and delivery", amount: "Free" },
              { label: "Name", amount: name.trim() || "—" },
              { label: "Mobile", amount: normPhone ? formatPhone(normPhone) : "—" },
              { label: "Day", amount: pickupDate ? shortDate(pickupDate) : "—" },
              { label: "Slot", amount: slot ? slotLabel(slot) : "—" },
              { label: "Weight", sub: kgOk ? `${loads} ${loads === 1 ? "load" : "loads"}` : undefined, amount: kgOk ? `${kgNum} kg` : "—" },
            ]}
            totalLabel="Estimate"
            total={peso(loads * PRICES.washDryFold)}
            bump={loads}
            foot="The rider weighs the bag at your door. You pay for what the scale says, when it comes back."
          />
        </Reveal>
      </aside>

      <Reveal className="col-span-12 lg:col-span-7">
        {state && !state.ok && (state.formError || Object.keys(errors).length > 0) && (
          <p role="alert" className="mb-5 t-body text-[#b3261e]">
            {state.formError ?? "Check the fields marked above."}
          </p>
        )}
        <button type="submit" className="btn w-full sm:w-auto" disabled={pending}>
          {pending ? "Booking…" : "Book the pickup"} {!pending && <span className="arrow" aria-hidden>→</span>}
        </button>
      </Reveal>
    </form>
    </>
  );
}

function Intro({ title, text }: { title: React.ReactNode; text?: string }) {
  return (
    <div className="grid12 pt-14 pb-10 md:pt-20 md:pb-14">
      <div className="col-span-12">
        <h1 className="display t-display" data-rise>
          {title}
        </h1>
        {text && (
          <p className="lead mt-8 max-w-[40ch]" data-rise style={{ "--i": 1 } as React.CSSProperties}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

function Confirmation({ ref_, booking }: { ref_: string; booking: Extract<BookingState, { ok: true }>["booking"] }) {
  const loads = loadsFor(booking.load_kg);
  return (
    <div className="grid12 gap-y-12 pb-[var(--section)]">
      <div className="col-span-12 lg:col-span-6">
        <p className="lead max-w-[30ch]" role="status">
          Salamat, {booking.name.split(" ")[0]}. Your pickup is booked for {shortDate(booking.pickup_date)}, {slotLabel(booking.time_slot)}.
        </p>
        <p className="mt-6 max-w-[44ch]">
          The rider will text {formatPhone(booking.phone)} before coming to the door. Keep the bag tied and ready. Your laundry comes back
          folded within 24 hours of pickup, and you pay then.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link href="/" className="btn">Back to the home page</Link>
          <a href="/book" className="link-plain">Book another pickup</a>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 lg:col-start-9">
        <ClaimSlip
          className="mx-auto w-[86%] max-w-[380px] lg:w-full"
          meta={`Claim slip ${ref_}`}
          rows={[
            { label: "Name", amount: booking.name },
            { label: "Mobile", amount: formatPhone(booking.phone) },
            { label: "Address", sub: booking.address, amount: "" },
            { label: "Day", amount: shortDate(booking.pickup_date) },
            { label: "Slot", amount: slotLabel(booking.time_slot) },
            { label: "Weight", sub: `${loads} ${loads === 1 ? "load" : "loads"}, to be weighed`, amount: `${booking.load_kg} kg` },
            { label: "Status", amount: "Waiting for pickup" },
          ]}
          totalLabel="Estimate"
          total={peso(loads * PRICES.washDryFold)}
        />
      </div>
    </div>
  );
}
