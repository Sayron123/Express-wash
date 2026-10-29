import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { FoldedBag, MachinesArt, ScaleArt, ScooterArt, ShopAtNight, SlipArt, WasherFront } from "@/components/drawings";
import Reveal from "@/components/Reveal";
import Estimator from "@/components/home/Estimator";
import LiveClock from "@/components/home/LiveClock";
import ServicesIndex from "@/components/home/ServicesIndex";
import { BARANGAYS, PRICES, TURNAROUND_HOURS, peso } from "@/lib/shop";

const VERBS = [
  { verb: "Book", text: "Choose a day and a three-hour slot online. It takes a minute.", Art: SlipArt, art: "A claim slip" },
  {
    verb: "Collect",
    text: "A rider comes to your door, weighs the bag in front of you and writes your claim slip.",
    Art: ScaleArt,
    art: "A tied laundry bag on a hanging scale",
  },
  { verb: "Wash", text: "Sorted, washed, dried and folded at the shop, at any hour.", Art: MachinesArt, art: "A row of washers running" },
  {
    verb: "Deliver",
    text: `Back at your door within ${TURNAROUND_HOURS} hours, folded and bagged. Pay when it arrives.`,
    Art: ScooterArt,
    art: "A delivery scooter with two laundry bags",
  },
];

const FAQ = [
  [
    "How much is one load?",
    `${peso(PRICES.washDryFold)} for up to ${PRICES.loadKg} kg, washed, dried and folded. Detergent and fabric conditioner are included. Comforters and blankets are ${peso(PRICES.comforter)} a piece.`,
  ],
  [
    "Is pickup really free?",
    `Yes, for one load or more anywhere in ${BARANGAYS.slice(0, 4).join(", ")} and the other barangays we cover. There is no delivery fee on the way back either.`,
  ],
  [
    "How soon do I get it back?",
    `Within ${TURNAROUND_HOURS} hours of pickup. If you need it the same day, say so in the notes when you book and we will tell you if we can.`,
  ],
  [
    "How do you weigh it?",
    "The rider weighs your bag on a hanging scale at your door, in front of you, and writes the weight on your claim slip. You pay for what the scale says.",
  ],
  [
    "Can I come in at 3 am?",
    "Yes. The counter, the washers and the dryers are open 24 hours, every day, holidays included. Someone is at the counter on every shift.",
  ],
  ["How do I pay?", "Cash or GCash when your laundry comes back. Nothing is paid at pickup."],
];

export default function Home() {
  return (
    <>
      <div className="page-body">
        <main>
          {/* ---------- hero: on wide screens the name stays pinned to two corners for two screens ---------- */}
          <section className="hero relative" aria-label="Express Wash">
            <div className="hero-pin">
              <h1 className="display hero-title">
                <span className="hero-word hero-word--a" data-rise>
                  Express
                </span>
                <span className="sr-only"> </span>
                <span className="hero-word hero-word--b" data-rise style={{ "--i": 1 } as React.CSSProperties}>
                  Wash
                </span>
              </h1>
            </div>

            <div>
              {/* 1. what this is */}
              <div className="hero-panel flex flex-col lg:grid lg:grid-cols-[9fr_3fr]">
                <div className="relative order-2 bg-surface px-[var(--margin)] pt-6 pb-10 lg:order-1 lg:p-0">
                  <div className="lg:absolute lg:top-[44%] lg:left-[calc(100vw*2/12)] lg:max-w-[34ch]">
                    <p className="lead">
                      A laundry shop in Novaliches, Quezon City, open 24 hours. We pick up your bag and bring it back folded, for free.
                    </p>
                    <Link href="/book" className="btn mt-6 w-full sm:w-auto lg:mt-8">
                      Book a free pickup <span className="arrow" aria-hidden>→</span>
                    </Link>
                  </div>
                  <nav aria-label="Sections" className="t-small lg:absolute lg:top-1/2 lg:right-7 lg:-translate-y-1/2">
                    <ul className="hidden space-y-1 text-right lg:block">
                      <li><a className="link" href="#services">Services</a></li>
                      <li><a className="link" href="#prices">Prices</a></li>
                      <li><a className="link" href="#questions">Questions</a></li>
                    </ul>
                  </nav>
                </div>
                <figure className="order-1 h-[24svh] bg-surface md:h-[40svh] lg:order-2 lg:h-auto">
                  <WasherFront className="!h-full" title="Drawing: a front-load washer mid-cycle" />
                </figure>
              </div>

              {/* 2. open 24/7 */}
              <div className="hero-panel wrap grid12 items-center gap-y-5 bg-ground py-10 md:gap-y-10 md:py-20 lg:py-[14svh]">
                <div className="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-2">
                  <Reveal as="h2" className="head">
                    Open 24/7
                  </Reveal>
                  <Reveal as="p" i={1} className="mt-4 max-w-[38ch] md:mt-6">
                    The counter, the washers and the dryers never close. Not on Sundays, not on holidays, not at 3 am after the night
                    shift.
                  </Reveal>
                  <Reveal i={2}>
                    <LiveClock />
                  </Reveal>
                </div>
                <Reveal
                  as="figure"
                  i={1}
                  className="col-span-12 h-[20svh] md:col-span-7 md:col-start-6 md:h-[46svh] lg:col-span-6 lg:col-start-7 lg:h-[52svh]"
                >
                  <ShopAtNight title="Drawing: the shop at night, shutter up and machines running" />
                </Reveal>
              </div>
            </div>
          </section>

          {/* ---------- free pickup and delivery ---------- */}
          <section className="wrap grid12 items-center gap-y-5 bg-water py-10 md:gap-y-10 md:py-[var(--section)]">
            <Reveal as="figure" className="order-2 col-span-12 hidden h-[46svh] md:order-1 md:col-span-6 md:block lg:h-[56svh]">
              <FoldedBag title="Drawing: folded laundry in a knotted clear bag with its claim slip" />
            </Reveal>
            <div className="order-1 col-span-12 md:order-2 md:col-span-6 md:col-start-7 lg:col-span-4 lg:col-start-8">
              <Reveal as="h2" className="head">
                Free pickup &amp; delivery
              </Reveal>
              <Reveal as="p" i={1} className="mt-4 max-w-[40ch] md:mt-6">
                Book a time slot. A rider comes to your door, weighs the bag in front of you and brings it back folded within{" "}
                {TURNAROUND_HOURS} hours. No delivery fee anywhere in Novaliches.
              </Reveal>
              <Reveal as="p" i={2} className="mt-4 max-w-[40ch] t-small text-muted md:mt-6">
                We cover {BARANGAYS.slice(0, -1).join(", ")} and {BARANGAYS.at(-1)}.
              </Reveal>
            </div>
          </section>

          {/* ---------- services as an index ---------- */}
          <section id="services" className="wrap scroll-mt-8 py-[var(--section)]">
            <Reveal as="h2" className="t-lead font-medium">
              What we wash
            </Reveal>
            <ServicesIndex />
          </section>

          {/* ---------- how it works: one verb at a time ---------- */}
          <section aria-label="How it works">
            {VERBS.map(({ verb, text, Art, art }, n) => (
              <div key={verb} className={`relative md:grid md:grid-cols-12 lg:min-h-[100svh] ${n % 2 ? "bg-surface" : "bg-ground"}`}>
                <Reveal
                  as="figure"
                  className="hidden md:order-2 md:col-span-5 md:col-start-8 md:block md:h-[52svh] lg:col-span-4 lg:col-start-9 lg:h-auto"
                >
                  <Art title={`Drawing: ${art}`} />
                </Reveal>
                <div className="wrap relative py-4 md:order-1 md:col-span-7 md:row-start-1 md:self-center lg:col-span-8 lg:self-auto lg:p-0">
                  <div className="lg:min-h-[100svh] lg:px-[var(--margin)] lg:pb-40">
                    <div className="verb-hold">
                      <h2 className="display verb">{verb}</h2>
                    </div>
                  </div>
                  <Reveal
                    as="p"
                    i={1}
                    className="mt-2 max-w-[34ch] md:mt-6 md:max-w-[30ch] md:text-[length:var(--step-lead)] md:leading-[1.35] lg:absolute lg:bottom-8 lg:left-[var(--margin)] lg:mt-0"
                  >
                    {text}
                  </Reveal>
                </div>
              </div>
            ))}
          </section>

          {/* ---------- pricing: the claim slip ---------- */}
          <section id="prices" className="on-dark wrap bg-field pb-[var(--section)] text-[var(--field-ink)]">
            <Estimator />
          </section>

          {/* ---------- questions: answered in the open on wide screens, one tap away on a phone ---------- */}
          <section id="questions" className="wrap py-[var(--section)]">
            <div className="grid12 gap-y-8 md:gap-y-20">
              <h2 className="col-span-12 t-head font-medium text-muted md:col-span-6">Questions</h2>
              <div className="col-span-12 -mt-2 space-y-1 md:hidden">
                {FAQ.map(([q, a]) => (
                  <details key={q} className="faq group bg-surface">
                    <summary className="flex min-h-[52px] cursor-pointer items-center justify-between gap-4 px-4 py-3 t-body font-medium">
                      {q}
                      <span aria-hidden className="t-lead leading-none transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="max-w-[40ch] px-4 pb-4 t-body">{a}</p>
                  </details>
                ))}
              </div>
              <div className="hidden md:col-span-5 md:col-start-8 md:block" />
              {FAQ.map(([q, a]) => (
                <div key={q} className="hidden md:contents">
                  <Reveal as="h3" className="col-span-6 t-head font-medium">
                    {q}
                  </Reveal>
                  <Reveal as="p" i={1} className="col-span-5 col-start-8 max-w-[40ch] pt-2 t-body">
                    {a}
                  </Reveal>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- the close, inverted ---------- */}
          <section className="on-dark wrap flex flex-col justify-between bg-ink pt-10 pb-8 text-[var(--bg)] md:min-h-[90svh] md:pt-[18svh]">
            <Reveal as="h2" className="display t-display">
              Tie the bag.
              <br />
              We&rsquo;ll come.
            </Reveal>
            <div className="mt-6 flex flex-col gap-5 md:mt-16 md:flex-row md:items-end md:justify-between md:gap-8">
              <Reveal as="p" i={1} className="max-w-[36ch] lead">
                Any hour, any day. Pickup and delivery are free in Novaliches, and you pay only when it comes back.
              </Reveal>
              <Reveal i={2}>
                <Link href="/book" className="btn min-h-14 w-full md:w-auto">
                  Book a free pickup <span className="arrow" aria-hidden>→</span>
                </Link>
              </Reveal>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
