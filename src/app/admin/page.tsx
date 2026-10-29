import type { Metadata } from "next";
import { Suspense } from "react";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import type { Pickup } from "@/lib/shop";
import { memoryRows, memoryStoreOn } from "@/lib/memory-store";
import { serviceClient } from "@/lib/supabase";
import LoginForm from "./LoginForm";
import PickupBoard from "./PickupBoard";
import "./admin.css";

export const metadata: Metadata = {
  title: "Pickups · Express Wash admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="admin">
      <Suspense fallback={<BoardSkeleton />}>
        <Gate />
      </Suspense>
    </div>
  );
}

async function Gate() {
  if (!adminConfigured()) {
    return (
      <Centre>
        <h1 className="text-[22px] font-medium">Admin is not set up</h1>
        <p className="mt-2 text-[var(--a-muted)]">Set ADMIN_PASSWORD (8 characters or more) in the server environment, then reload.</p>
      </Centre>
    );
  }
  if (!(await isAdmin())) {
    return (
      <Centre>
        <LoginForm />
      </Centre>
    );
  }

  const { pickups, loadError, loadedAt } = await loadPickups();
  return <PickupBoard initial={pickups} loadError={loadError} loadedAt={loadedAt} />;
}

async function loadPickups(): Promise<{ pickups: Pickup[]; loadError: string | null; loadedAt: number }> {
  const loadedAt = Date.now();
  if (memoryStoreOn()) return { pickups: memoryRows().map((r) => ({ ...r })), loadError: null, loadedAt };
  try {
    const { data, error } = await serviceClient()
      .from("pickups")
      .select("id, created_at, name, phone, address, pickup_date, time_slot, load_kg, notes, status")
      .order("pickup_date", { ascending: true })
      .limit(500);
    if (error) throw error;
    const pickups = (data ?? []).map((p) => ({ ...p, load_kg: Number(p.load_kg) })) as Pickup[];
    return { pickups, loadError: null, loadedAt };
  } catch (e) {
    console.error("load pickups failed", e);
    return { pickups: [], loadError: "Couldn't load pickups from Supabase.", loadedAt };
  }
}

function Centre({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex min-h-[100svh] max-w-[360px] flex-col justify-center px-4">{children}</main>;
}

function BoardSkeleton() {
  return (
    <div className="px-4 pt-6 md:px-8 md:pt-9" aria-hidden>
      <span className="a-bar h-6 w-32" />
      <span className="a-bar mt-3 h-4 w-72" />
      <div className="mt-10 space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="a-bar h-[52px] w-full" />
        ))}
      </div>
    </div>
  );
}
