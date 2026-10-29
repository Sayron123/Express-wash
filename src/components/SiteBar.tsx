import Link from "next/link";

/** A plain bar for inner pages: the name, two links, nothing else. */
export default function SiteBar() {
  return (
    <header className="wrap flex items-center justify-between gap-6 pt-5 md:pt-7">
      <Link href="/" className="font-display t-lead font-extrabold uppercase tracking-[-0.02em]">
        Express Wash
      </Link>
      <nav aria-label="Main" className="t-small">
        <ul className="flex gap-5">
          <li><Link className="link" href="/#prices">Prices</Link></li>
          <li><Link className="link" href="/#questions">Questions</Link></li>
        </ul>
      </nav>
    </header>
  );
}
