import Link from "next/link";
import { BARANGAYS } from "@/lib/shop";

/** The close: four short columns, then the name across the full width. Revealed from under the page. */
export default function SiteFooter() {
  return (
    <footer className="site-footer on-dark bg-field text-[var(--field-ink)]">
      <div className="wrap grid grid-rows-[auto_1fr_auto] gap-y-10 pt-8 pb-5 md:min-h-[100svh] md:gap-y-0">
        <div className="grid12 gap-y-8 t-body">
          <div className="col-span-6 md:col-span-3">
            <p>Express Wash</p>
            <p className="text-field-muted">Novaliches, Quezon City</p>
            <p className="text-field-muted">Open 24 hours, every day</p>
          </div>
          <nav className="col-span-6 hidden md:col-span-3 md:block" aria-label="Footer">
            <p>On this page</p>
            <ul className="text-field-muted">
              <li><Link className="link" href="/#services">Services</Link></li>
              <li><Link className="link" href="/#prices">Prices</Link></li>
              <li><Link className="link" href="/#questions">Questions</Link></li>
              <li><Link className="link" href="/book">Book a pickup</Link></li>
            </ul>
          </nav>
          <div className="col-span-6 hidden md:col-span-3 md:block">
            <p>Free pickup in</p>
            <p className="max-w-[30ch] text-field-muted">{BARANGAYS.join(", ")}</p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p>Call or text</p>
            <p className="text-field-muted nums">0900 000 0000 (sample number)</p>
            <p className="text-field-muted">Or book online, any hour</p>
          </div>
        </div>
        <div />
        <div>
          <Wordmark />
          <p className="mt-5 flex flex-wrap justify-between gap-x-6 gap-y-1 t-small text-field-muted">
            <span>© 2026 Express Wash. Prices shown are samples.</span>
            <span>Demo by Say</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** The name fitted to the margins: one line on wide screens, two on a phone. */
function Wordmark() {
  const text = { fontFamily: "var(--font-unbounded)", fontWeight: 800, fill: "currentColor" } as const;
  return (
    <>
      <svg className="hidden w-full md:block" viewBox="0 0 1000 104" aria-label="Express Wash" role="img">
        <text x="0" y="100" fontSize="118" textLength="1000" lengthAdjust="spacingAndGlyphs" style={text}>
          EXPRESS WASH
        </text>
      </svg>
      <svg className="block w-full md:hidden" viewBox="0 0 1000 300" aria-label="Express Wash" role="img">
        <text x="0" y="138" fontSize="196" textLength="1000" lengthAdjust="spacingAndGlyphs" style={text}>
          EXPRESS
        </text>
        <text x="0" y="296" fontSize="196" style={text}>
          WASH
        </text>
      </svg>
    </>
  );
}
