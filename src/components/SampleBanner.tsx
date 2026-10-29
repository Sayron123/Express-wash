/** Says plainly that this is a sample, on every page. */
export default function SampleBanner() {
  return (
    <p className="relative z-10 flex min-h-[var(--banner-h)] items-center justify-center bg-ink px-[var(--margin)] py-1 text-center t-small !leading-tight text-[var(--paper)]">
      Sample site made for Express Wash. Prices and details are placeholders.
    </p>
  );
}
