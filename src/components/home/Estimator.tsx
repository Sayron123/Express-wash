"use client";

import Link from "next/link";
import { useState } from "react";
import ClaimSlip, { type SlipRow } from "@/components/ClaimSlip";
import Reveal from "@/components/Reveal";
import { BAG_ITEMS, PRICES, TURNAROUND_HOURS, peso } from "@/lib/shop";
import { manilaDayTime, useNowMinute } from "@/lib/use-now";

type Counts = Record<(typeof BAG_ITEMS)[number]["id"] | "comforters", number>;

const START = Object.fromEntries([...BAG_ITEMS.map((i) => [i.id, i.start]), ["comforters", 0]]) as Counts;

function Stepper({ label, value, onChange, max = 60 }: { label: string; value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5 md:py-2">
      <span className="t-body">{label}</span>
      <span className="flex items-center gap-1">
        <button type="button" className="step-btn" aria-label={`One fewer: ${label}`} disabled={value === 0} onClick={() => onChange(value - 1)}>
          −
        </button>
        <output className="w-10 text-center t-body nums" aria-live="polite" aria-label={`${label}: ${value}`}>
          {value}
        </output>
        <button type="button" className="step-btn" aria-label={`One more: ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          +
        </button>
      </span>
    </div>
  );
}

/** What's in your bag: counts become kilos, kilos become loads, loads print on the slip. */
export default function Estimator() {
  const [counts, setCounts] = useState<Counts>(START);
  const now = useNowMinute();

  const kg = Math.round(BAG_ITEMS.reduce((sum, i) => sum + counts[i.id] * i.kg, 0) * 10) / 10;
  const loads = kg > 0 ? Math.ceil(kg / PRICES.loadKg) : 0;
  const loadCost = loads * PRICES.washDryFold;
  const comforterCost = counts.comforters * PRICES.comforter;
  const total = loadCost + comforterCost;
  const bookKg = Math.min(60, Math.max(1, Math.ceil(kg * 2) / 2 + (counts.comforters ? counts.comforters * 2 : 0)));

  const rows: SlipRow[] = [
    { label: "Pickup and delivery", amount: "Free" },
    { label: "Detergent and fabcon", amount: "Included" },
    ...(counts.comforters
      ? [{ label: "Comforters", sub: `${counts.comforters} × ${peso(PRICES.comforter)}`, amount: peso(comforterCost) }]
      : []),
    {
      label: "Wash, dry and fold",
      sub: loads ? `${loads} ${loads === 1 ? "load" : "loads"}, about ${kg.toLocaleString("en-PH")} kg` : "Nothing added yet",
      amount: peso(loadCost),
    },
  ];


  const set = (id: keyof Counts) => (n: number) => setCounts((c) => ({ ...c, [id]: Math.max(0, n) }));

  return (
    <div className="grid12 gap-y-8 md:gap-y-12">
      <div className="col-span-12 pt-12 md:col-span-7 md:pt-[120px] lg:col-span-6">
        <Reveal as="h2" className="head">
          Priced by the load
        </Reveal>
        <Reveal as="p" i={1} className="mt-4 max-w-[46ch] text-field-muted md:mt-6">
          One load is up to {PRICES.loadKg} kg, washed, dried and folded, detergent and fabcon included. Count what&rsquo;s in
          your bag and the slip adds it up.
        </Reveal>
        <Reveal i={2} className="mt-5 max-w-[480px] md:mt-8">
          {BAG_ITEMS.map((i) => (
            <Stepper key={i.id} label={i.label} value={counts[i.id]} onChange={set(i.id)} />
          ))}
          <Stepper label="Comforters and blankets" value={counts.comforters} onChange={set("comforters")} max={10} />
        </Reveal>
        <Link
          href={`/book?kg=${bookKg}`}
          className="btn mt-10 hidden md:inline-flex"
          aria-disabled={total === 0}
          onClick={(e) => total === 0 && e.preventDefault()}
        >
          Book a pickup for this bag <span className="arrow" aria-hidden>→</span>
        </Link>
        <p className="mt-6 max-w-[46ch] t-small text-field-muted md:mt-12 md:text-[length:var(--step-body)]">
          Doing it yourself? Self-service is {peso(PRICES.selfWash)} a wash and {peso(PRICES.selfDry)} for 30 minutes of drying.
          Detergent is {peso(PRICES.detergent)} and fabric conditioner {peso(PRICES.fabcon)} a sachet.
        </p>
      </div>

      <div className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-8">
        <div className="md:sticky md:top-0">
        <ClaimSlip
          className="mx-auto w-full max-w-[380px]"
          meta="Estimate"
          rows={rows}
          totalLabel="Total"
          total={peso(total)}
          bump={total}
          foot={
            now === null
              ? `Back within ${TURNAROUND_HOURS} hours of pickup.`
              : `Back by ${manilaDayTime((now + TURNAROUND_HOURS * 60) * 60_000)} if picked up now.`
          }
        />
        <Link
          href={`/book?kg=${bookKg}`}
          className="btn mt-6 w-full md:hidden"
          aria-disabled={total === 0}
          onClick={(e) => total === 0 && e.preventDefault()}
        >
          Book a pickup for this bag <span className="arrow" aria-hidden>→</span>
        </Link>
        </div>
      </div>
    </div>
  );
}
