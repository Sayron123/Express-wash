"use client";

import { manilaTime, useNowMinute } from "@/lib/use-now";

/** "It's 2:14 am in Novaliches. We're open." with the visitor's real Manila time. */
export default function LiveClock() {
  const now = useNowMinute();
  return (
    <p className="lead mt-8 max-w-[24ch]">
      {now === null ? (
        <>Whatever the time in Novaliches, we&rsquo;re open.</>
      ) : (
        <>
          It&rsquo;s <span className="nums">{manilaTime(now * 60_000)}</span> in Novaliches. We&rsquo;re open.
        </>
      )}
    </p>
  );
}
