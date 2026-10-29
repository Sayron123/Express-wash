// The shop's paper claim slip, used as the price estimate, the booking preview and the confirmation.

export type SlipRow = { label: string; sub?: string; amount: string };

export default function ClaimSlip({
  heading = "Express Wash",
  meta,
  rows,
  totalLabel,
  total,
  foot,
  className = "",
  bump,
}: {
  heading?: string;
  meta?: string;
  rows: SlipRow[];
  totalLabel: string;
  total: string;
  foot?: React.ReactNode;
  className?: string;
  /** Changes whenever the total changes, to replay the small tick on the figure. */
  bump?: string | number;
}) {
  return (
    <div className={`slip px-6 pt-6 pb-12 md:px-7 md:pt-8 md:pb-14 ${className}`}>
      <p className="text-center font-display t-body font-extrabold uppercase tracking-[-0.02em]">{heading}</p>
      {meta && <p className="mt-1 text-center t-small text-muted">{meta}</p>}
      <dl className="mt-5 space-y-2.5 md:mt-7 md:space-y-3.5">
        {rows.map((r) => (
          <div key={r.label} className="slip-row t-body">
            <dt className="min-w-0 max-w-[62%]">
              {r.label}
              {r.sub && <span className="block text-muted">{r.sub}</span>}
            </dt>
            <dd className="shrink-0 text-right">{r.amount}</dd>
          </div>
        ))}
      </dl>
      <div className="slip-bar mt-6" />
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <span className="t-body font-medium">{totalLabel}</span>
        <span key={bump} className="tick font-display t-head font-extrabold !leading-none tracking-[-0.03em] nums">
          {total}
        </span>
      </div>
      {foot && <div className="mt-6 text-muted">{foot}</div>}
    </div>
  );
}
