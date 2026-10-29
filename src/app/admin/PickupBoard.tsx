"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { STATUSES, TIME_SLOTS, formatPhone, shortDate, slotLabel, type Pickup, type PickupStatus } from "@/lib/shop";
import { logout, updateStatus } from "./actions";

type Tab = "open" | PickupStatus | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "open", label: "Open" },
  ...STATUSES.map((s) => ({ id: s.id as Tab, label: s.label })),
  { id: "all", label: "All" },
];

const slotOrder = (id: string) => TIME_SLOTS.findIndex((s) => s.id === id);
const byPickup = (a: Pickup, b: Pickup) =>
  a.pickup_date.localeCompare(b.pickup_date) || slotOrder(a.time_slot) - slotOrder(b.time_slot);

const manilaYmd = (ms: number) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(ms);
const manilaClock = (ms: number) =>
  new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" }).format(ms).toLowerCase();

function ago(fromIso: string, nowMs: number): string {
  const mins = Math.max(0, Math.round((nowMs - Date.parse(fromIso)) / 60_000));
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "Yesterday" : `${d} days ago`;
}

export default function PickupBoard({ initial, loadError, loadedAt }: { initial: Pickup[]; loadError: string | null; loadedAt: number }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [tab, setTab] = useState<Tab>("open");
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [refreshing, startRefresh] = useTransition();

  // Server data replaces local rows whenever the page is refreshed.
  const [seen, setSeen] = useState(initial);
  if (seen !== initial) {
    setSeen(initial);
    setRows(initial);
  }

  const today = manilaYmd(loadedAt);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { open: 0, all: rows.length, pending: 0, picked_up: 0, washing: 0, ready: 0, delivered: 0 };
    for (const r of rows) {
      c[r.status] += 1;
      if (r.status !== "delivered") c.open += 1;
    }
    return c;
  }, [rows]);

  const pending = rows.filter((r) => r.status === "pending").sort(byPickup);
  const overdue = pending.filter((r) => r.pickup_date < today);
  const next = pending.find((r) => r.pickup_date >= today);

  const needle = q.trim().toLowerCase();
  const visible = rows
    .filter((r) => (tab === "all" ? true : tab === "open" ? r.status !== "delivered" : r.status === tab))
    .filter((r) => !needle || `${r.name} ${r.phone} ${r.address}`.toLowerCase().includes(needle))
    .sort(byPickup);

  async function change(id: string, status: PickupStatus) {
    const before = rows.find((r) => r.id === id)?.status;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    setSaving((s) => ({ ...s, [id]: true }));
    setRowError((e) => ({ ...e, [id]: "" }));
    const res = await updateStatus(id, status);
    setSaving((s) => ({ ...s, [id]: false }));
    if (!res.ok && before) {
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: before } : r)));
      setRowError((e) => ({ ...e, [id]: res.error ?? "Not saved." }));
    }
  }

  return (
    <>
      <header className="flex h-12 items-center justify-between border-b border-[var(--a-rule)] px-4 md:px-8">
        <p className="flex items-baseline gap-3">
          <span className="font-display text-[15px] font-extrabold uppercase tracking-[-0.02em]">Express Wash</span>
          <span className="text-[var(--a-muted)]">Novaliches</span>
        </p>
        <form action={logout}>
          <button type="submit" className="a-btn a-btn--grey">Sign out</button>
        </form>
      </header>

      <main className="px-4 pt-6 pb-16 md:px-8 md:pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-medium leading-tight md:text-[24px]">Pickups</h1>
            <p className="mt-1 text-[15px]">
              {loadError ? (
                <span className="text-[var(--a-muted)]">—</span>
              ) : counts.pending === 0 ? (
                <span className="text-[var(--a-muted)]">Nobody is waiting for a pickup.</span>
              ) : (
                <>
                  <span className="font-medium text-[var(--a-hue)] nums">{counts.pending}</span> waiting for pickup
                  {next && (
                    <>
                      . Next: {next.name},{" "}
                      <span className="whitespace-nowrap">
                        {next.pickup_date === today ? "today" : shortDate(next.pickup_date)}, {slotLabel(next.time_slot)}
                      </span>
                    </>
                  )}
                  {overdue.length > 0 && (
                    <span className="text-[#b3261e]">
                      . {overdue.length} {overdue.length === 1 ? "is" : "are"} past {overdue.length === 1 ? "its" : "their"} pickup day
                    </span>
                  )}
                  .
                </>
              )}
            </p>
          </div>
          <p className="flex items-center gap-3 text-[13px] text-[var(--a-muted)]">
            Updated {manilaClock(loadedAt)}
            <button type="button" className="a-btn a-btn--grey" disabled={refreshing} onClick={() => startRefresh(() => router.refresh())}>
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </p>
        </div>

        <div role="tablist" aria-label="Status" className="mt-6 flex gap-6 overflow-x-auto border-b border-[var(--a-rule)]">
          {TABS.map((t) => (
            <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} className="a-tab" onClick={() => setTab(t.id)}>
              {t.label}{" "}
              <span className={`nums ${t.id === "pending" && counts.pending > 0 ? "text-[var(--a-hue)]" : "text-[var(--a-muted)]"}`}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <label className="w-full sm:w-[300px]">
            <span className="sr-only">Search pickups</span>
            <input type="search" className="a-input w-full" placeholder="Search name, mobile or address" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <p className="text-[13px] text-[var(--a-muted)] nums">
            {visible.length} {visible.length === 1 ? "pickup" : "pickups"} · by pickup day
          </p>
        </div>

        <section className="mt-4" aria-label="Pickup list">
          {loadError ? (
            <div className="rounded-lg border border-dashed border-[var(--a-control)] px-4 py-3">
              {loadError} Last good data: none in this session.{" "}
              <button type="button" className="font-medium underline underline-offset-2" onClick={() => router.refresh()}>
                Retry
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead className="hidden md:table-header-group">
                <tr className="text-[13px] text-[var(--a-muted)]">
                  <th className="h-10 pr-4 font-normal">Customer</th>
                  <th className="h-10 pr-4 font-normal">Pickup address</th>
                  <th className="h-10 pr-4 font-normal">Pickup</th>
                  <th className="h-10 pr-4 text-right font-normal">Load</th>
                  <th className="hidden h-10 pr-4 text-right font-normal lg:table-cell">Booked</th>
                  <th className="h-10 w-[190px] font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr className="a-row">
                    <td colSpan={6} className="py-4 text-[var(--a-muted)]">
                      {rows.length === 0
                        ? "No bookings yet. They appear here as soon as someone books on the website."
                        : needle
                          ? `No pickups match “${q.trim()}”.`
                          : `No pickups in ${TABS.find((t) => t.id === tab)?.label.toLowerCase()}.`}
                    </td>
                  </tr>
                )}
                {visible.map((r) => {
                  const late = r.status === "pending" && r.pickup_date < today;
                  return (
                    <tr key={r.id} className="a-row grid grid-cols-[1fr_auto] gap-x-3 py-3 md:table-row md:py-0">
                      <td className="md:py-3 md:pr-4 md:align-top">
                        <span className="block font-medium">{r.name}</span>
                        <a href={`tel:${r.phone}`} className="block text-[13px] text-[var(--a-muted)] nums hover:text-[var(--a-text)] md:text-[14px]">
                          {formatPhone(r.phone)}
                        </a>
                      </td>
                      <td className="col-span-2 row-start-2 text-[13px] text-[var(--a-muted)] md:py-3 md:pr-4 md:align-top md:text-[14px] md:text-[var(--a-text)]">
                        <span className="md:hidden">
                          <span className="whitespace-nowrap">
                            {r.pickup_date === today ? "Today" : shortDate(r.pickup_date)}, {slotLabel(r.time_slot)}
                          </span>{" "}
                          · <span className="whitespace-nowrap">{r.load_kg} kg</span> ·{" "}
                        </span>
                        {r.address}
                        {r.notes && <span className="block text-[var(--a-muted)]">Note: {r.notes}</span>}
                      </td>
                      <td className="hidden whitespace-nowrap md:table-cell md:py-3 md:pr-4 md:align-top">
                        <span className={late ? "text-[#b3261e]" : ""}>{r.pickup_date === today ? "Today" : shortDate(r.pickup_date)}</span>
                        <span className="block text-[var(--a-muted)]">{slotLabel(r.time_slot)}</span>
                      </td>
                      <td className="hidden text-right nums md:table-cell md:py-3 md:pr-4 md:align-top">
                        {r.load_kg}
                        <span className="text-[var(--a-muted)]"> kg</span>
                      </td>
                      <td className="hidden text-right text-[var(--a-muted)] lg:table-cell lg:py-3 lg:pr-4 lg:align-top">
                        {ago(r.created_at, loadedAt)}
                      </td>
                      <td className="col-start-2 row-start-1 md:py-3 md:align-top">
                        <label>
                          <span className="sr-only">Status for {r.name}</span>
                          <select
                            className="a-select w-[172px] md:w-[180px]"
                            value={r.status}
                            data-status={r.status}
                            disabled={saving[r.id]}
                            onChange={(e) => change(r.id, e.target.value as PickupStatus)}
                          >
                            {STATUSES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        {rowError[r.id] && <span className="mt-1 block text-[13px] text-[#b3261e]">{rowError[r.id]}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}
