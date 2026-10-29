"use client";

import { useSyncExternalStore } from "react";

// The current minute, shared by every component that shows a time. Null during server render
// and hydration, so the server never prints a time that differs from the visitor's clock.

const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (timer === undefined) {
    timer = window.setInterval(() => listeners.forEach((l) => l()), 15_000);
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

const minute = () => Math.floor(Date.now() / 60_000);

export function useNowMinute(): number | null {
  return useSyncExternalStore(subscribe, minute, () => null);
}

const timeFmt = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });
const dayTimeFmt = new Intl.DateTimeFormat("en-PH", {
  timeZone: "Asia/Manila",
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
});

/** "2:14 am" in Manila. */
export const manilaTime = (ms: number) => timeFmt.format(ms).replace(/\s?([AP])M$/i, (_, a) => ` ${a.toLowerCase()}m`);
/** "Fri 2:14 pm" in Manila. */
export const manilaDayTime = (ms: number) =>
  dayTimeFmt.format(ms).replace(",", "").replace(/\s?([AP])M$/i, (_, a) => ` ${a.toLowerCase()}m`);
