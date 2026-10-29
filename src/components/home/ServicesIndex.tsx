"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

const GROUPS = [
  {
    name: "Wash, dry and fold",
    summary: "We sort, wash, dry and fold. ₱180 for each load of up to 8 kg.",
    items: [
      ["Everyday clothes", "Sorted into whites and colours, washed by the care label."],
      ["School uniforms", "Washed apart from colours so the whites stay white for Monday."],
      ["Work uniforms", "Polo shirts and slacks folded flat, ready for the week."],
      ["Towels", "Dried right through, never folded damp."],
      ["Bedsheets and pillowcases", "Folded as sets and bagged together."],
      ["Comforters and blankets", "One piece per wash at ₱250, dried in the large dryer."],
      ["Curtains", "Washed and folded flat. Take the hooks off first, please."],
      ["Baby clothes", "Washed on their own with mild detergent, on request."],
    ],
  },
  {
    name: "Self-service",
    summary: "Use our machines yourself, any hour. ₱60 to wash, ₱60 to dry.",
    items: [
      ["8 kg front-load washers", "About 35 minutes a cycle, ₱60 a load."],
      ["Gas dryers", "₱60 for 30 minutes. Most loads need 30 to 40."],
      ["Detergent by the sachet", "₱20 a sachet at the counter, if you forgot yours."],
      ["Fabric conditioner", "₱15 a sachet, added in the last rinse."],
      ["Folding tables", "Fold here while your next load runs."],
      ["Open at 3 am too", "Come after the night shift. The doors never lock."],
    ],
  },
  {
    name: "Pickup and delivery",
    summary: "We fetch it and bring it back, free, anywhere in Novaliches.",
    items: [
      ["Free within Novaliches", "No delivery fee in the barangays we cover, from one load."],
      ["Book online in a minute", "Pick a day and a three-hour slot on the booking page."],
      ["Rider within your slot", "The rider texts you before coming to the door."],
      ["Weighed at your door", "On a hanging scale, in front of you, written on your slip."],
      ["Back folded and bagged", "Within 24 hours, sealed in a clear bag with your slip."],
      ["Pay on delivery", "Cash or GCash when your laundry comes back."],
    ],
  },
] as const;

/** The services as an index: hover or focus a name to read how it is handled. */
export default function ServicesIndex() {
  const [active, setActive] = useState<string>(GROUPS[0].items[0][1]);

  return (
    <div className="grid12 mt-6 gap-y-7 md:mt-24 md:gap-y-10">
      {GROUPS.map((g, gi) => (
        <Reveal
          key={g.name}
          i={gi + 1}
          className={`col-span-12 md:col-span-4 lg:col-span-3 ${["lg:col-start-1", "lg:col-start-4", "lg:col-start-7"][gi]}`}
        >
          <h3 className="t-body font-medium">{g.name}</h3>
          {/* On a phone the names run as one line of text; the full index needs the width. */}
          <p className="mt-2 t-body text-muted md:hidden">{g.items.map(([label]) => label).join(" · ")}</p>
          <ul className="mt-6 hidden space-y-1 md:block">
            {g.items.map(([label, desc]) => (
              <li key={label}>
                <button
                  type="button"
                  className={`text-left t-body !leading-[1.25] transition-colors duration-200 ${
                    active === desc ? "text-ink" : "text-muted"
                  } hover:text-ink focus-visible:text-ink`}
                  onMouseEnter={() => setActive(desc)}
                  onFocus={() => setActive(desc)}
                  onClick={() => setActive(desc)}
                  aria-describedby="service-note"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-5 hidden max-w-[34ch] t-body text-muted md:block lg:hidden">{g.summary}</p>
        </Reveal>
      ))}
      <p
        id="service-note"
        aria-live="polite"
        className="col-span-3 col-start-10 hidden self-start t-body lg:block"
      >
        {active}
      </p>
    </div>
  );
}
