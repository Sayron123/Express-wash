// Flat drawings of the shop's own things, standing in for photographs until the shop has its own.
// One graphic language: flat fills from the palette, no outlines, no gradients.

const C = {
  ink: "#14202b",
  field: "#123a66",
  fieldDeep: "#0d2c4f",
  accent: "#1d5fbf",
  water: "#d3e2ef",
  water2: "#b9d0e5",
  water3: "#8fb2d3",
  paper: "#fbfcfa",
  surface: "#e1e6e3",
  steel: "#c9d1d6",
  warm: "#f3efe2",
};

type Props = { className?: string; title: string };

function Svg({ className, title, viewBox, slice = true, children }: Props & { viewBox: string; slice?: boolean; children: React.ReactNode }) {
  return (
    <svg
      className={`drawing ${className ?? ""}`}
      viewBox={viewBox}
      preserveAspectRatio={slice ? "xMidYMid slice" : "xMidYMid meet"}
      role="img"
      aria-label={title}
    >
      {children}
    </svg>
  );
}

/** Clothes tumbling inside a drum, centred on (cx, cy). Rotates as a whole. */
function Drum({ cx, cy, r, slow, rev }: { cx: number; cy: number; r: number; slow?: boolean; rev?: boolean }) {
  const holes = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    return { x: cx + Math.cos(a) * r * 0.86, y: cy + Math.sin(a) * r * 0.86 };
  });
  return (
    <g className={`drum ${slow ? "drum--slow" : ""} ${rev ? "drum--rev" : ""}`}>
      <circle cx={cx} cy={cy} r={r} fill={C.water3} />
      {holes.map((h, i) => (
        <circle key={i} cx={h.x} cy={h.y} r={r * 0.035} fill={C.water2} />
      ))}
      {/* a shirt, a towel and a sock, as flat shapes */}
      <path
        d={`M ${cx - r * 0.55} ${cy + r * 0.05} q ${r * 0.25} ${-r * 0.35} ${r * 0.6} ${-r * 0.2} q ${r * 0.2} ${r * 0.3} ${-r * 0.05} ${r * 0.55} q ${-r * 0.35} ${r * 0.05} ${-r * 0.55} ${-r * 0.35} z`}
        fill={C.paper}
      />
      <rect x={cx + r * 0.05} y={cy + r * 0.12} width={r * 0.5} height={r * 0.34} rx={r * 0.06} fill={C.accent} transform={`rotate(-18 ${cx} ${cy})`} />
      <path
        d={`M ${cx - r * 0.1} ${cy - r * 0.62} h ${r * 0.18} v ${r * 0.3} q 0 ${r * 0.14} ${r * 0.16} ${r * 0.14} v ${r * 0.14} h ${-r * 0.2} q ${-r * 0.14} 0 ${-r * 0.14} ${-r * 0.16} z`}
        fill={C.field}
      />
    </g>
  );
}

/** Front-load washer, close up: the hero picture. Portrait. */
export function WasherFront(p: Props) {
  return (
    <Svg {...p} viewBox="0 0 400 900">
      <rect width="400" height="900" fill={C.water} />
      <rect x="0" y="0" width="400" height="190" fill={C.water2} />
      <rect x="40" y="70" width="150" height="54" fill={C.ink} />
      <text x="115" y="107" textAnchor="middle" fontFamily="system-ui" fontWeight="700" fontSize="30" fill={C.water}>
        00:42
      </text>
      <circle cx="300" cy="97" r="40" fill={C.paper} />
      <rect x="296" y="62" width="8" height="30" fill={C.ink} />
      <circle cx="200" cy="470" r="190" fill={C.paper} />
      <circle cx="200" cy="470" r="150" fill={C.steel} />
      <Drum cx={200} cy={470} r={132} />
      <path d="M 120 370 a 120 120 0 0 1 120 -40" stroke={C.paper} strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.7" />
      <rect x="0" y="720" width="400" height="180" fill={C.water2} />
      <rect x="60" y="770" width="280" height="24" fill={C.water3} />
    </Svg>
  );
}

/** The shop at night, shutter up, machines lit. Landscape. */
export function ShopAtNight(p: Props) {
  return (
    <Svg {...p} viewBox="0 0 800 560" slice={false}>
      <rect width="800" height="560" fill={C.fieldDeep} />
      <circle cx="680" cy="80" r="34" fill={C.warm} />
      <rect x="60" y="120" width="680" height="440" fill={C.field} />
      <rect x="60" y="120" width="680" height="84" fill={C.ink} />
      <text x="400" y="176" textAnchor="middle" fontFamily="system-ui" fontWeight="800" fontSize="40" letterSpacing="2" fill={C.paper}>
        EXPRESS WASH · 24 HRS
      </text>
      {/* shutter rolled up */}
      <rect x="100" y="204" width="600" height="26" fill={C.water3} />
      {/* lit interior */}
      <rect x="100" y="230" width="600" height="330" fill={C.warm} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={130 + i * 140} y={330} width={120} height={150} fill={C.paper} />
          <rect x={130 + i * 140} y={330} width={120} height={26} fill={C.steel} />
          <Drum cx={190 + i * 140} cy={418} r={40} slow rev={i % 2 === 1} />
        </g>
      ))}
      <rect x="100" y="480" width="600" height="80" fill={C.water2} />
      {/* folding table with a stack */}
      <rect x="150" y="268" width="140" height="10" fill={C.water3} />
      <rect x="170" y="246" width="96" height="22" fill={C.accent} />
      <rect x="176" y="232" width="84" height="14" fill={C.paper} />
    </Svg>
  );
}

/** Folded clothes in a clear bag, knotted, with a claim tag. */
export function FoldedBag(p: Props) {
  const layers = [C.paper, C.accent, C.water2, C.field, C.paper, C.water3, C.accent];
  return (
    <Svg {...p} viewBox="0 0 800 560" slice={false}>
      <rect width="800" height="560" fill={C.surface} />
      <rect x="0" y="470" width="800" height="90" fill={C.water2} />
      <path d="M 220 470 V 150 q 0 -30 30 -30 h 300 q 30 0 30 30 V 470 z" fill={C.water} opacity="0.9" />
      {layers.map((fill, i) => (
        <rect key={i} x={250} y={420 - i * 40} width={300} height={40} rx={10} fill={fill} />
      ))}
      {/* knot */}
      <path d="M 360 120 q 40 -70 80 0 q -40 -20 -80 0 z" fill={C.water3} />
      <path d="M 380 120 q -60 -50 -40 -90 q 30 30 40 90 z" fill={C.water2} />
      <path d="M 420 120 q 60 -50 40 -90 q -30 30 -40 90 z" fill={C.water2} />
      {/* claim tag */}
      <rect x="560" y="250" width="120" height="160" fill={C.paper} transform="rotate(8 620 330)" />
      <rect x="580" y="290" width="80" height="10" fill={C.ink} transform="rotate(8 620 330)" />
      <rect x="580" y="316" width="60" height="8" fill={C.water3} transform="rotate(8 620 330)" />
      <rect x="580" y="336" width="70" height="8" fill={C.water3} transform="rotate(8 620 330)" />
      <rect x="580" y="370" width="50" height="16" fill={C.accent} transform="rotate(8 620 330)" />
    </Svg>
  );
}

/** A claim slip, very large. For "Book". */
export function SlipArt(p: Props) {
  return (
    <Svg {...p} viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill={C.water} />
      <g transform="rotate(-6 600 400)">
        <rect x="380" y="-40" width="440" height="900" fill={C.paper} />
        <circle cx="600" cy="40" r="16" fill={C.water} />
        {[140, 200, 260, 320, 380, 440, 500].map((y, i) => (
          <g key={y}>
            <rect x="430" y={y} width={i % 3 === 0 ? 200 : 150} height="16" fill={C.water2} />
            <rect x={700} y={y} width="70" height="16" fill={C.water2} />
          </g>
        ))}
        <rect x="430" y="570" width="340" height="10" fill={C.water3} />
        <rect x="630" y="610" width="140" height="44" fill={C.water3} />
      </g>
    </Svg>
  );
}

/** A tied laundry bag on a hanging scale. For "Collect". */
export function ScaleArt(p: Props) {
  return (
    <Svg {...p} viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill={C.surface} />
      <rect x="590" y="0" width="20" height="120" fill={C.steel} />
      <circle cx="600" cy="200" r="90" fill={C.paper} />
      <circle cx="600" cy="200" r="70" fill={C.water} />
      <rect x="596" y="140" width="8" height="64" fill={C.water3} transform="rotate(38 600 200)" />
      <path d="M 600 290 v 60 q 0 30 -30 30" stroke={C.steel} strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M 560 400 q -200 40 -210 240 q 0 120 250 120 q 250 0 250 -120 q -10 -200 -210 -240 z" fill={C.water2} />
      <path d="M 560 400 q 40 -40 80 0 z" fill={C.water3} />
      <path d="M 440 560 q 160 -60 320 0" stroke={C.water3} strokeWidth="14" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/** A row of washers running. For "Wash". */
export function MachinesArt(p: Props) {
  return (
    <Svg {...p} viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill={C.water} />
      <rect x="0" y="640" width="1200" height="160" fill={C.water2} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={60 + i * 280} y={200} width={240} height={440} fill={C.paper} />
          <rect x={60 + i * 280} y={200} width={240} height={60} fill={C.steel} />
          <circle cx={180 + i * 280} cy={430} r={92} fill={C.steel} />
          <Drum cx={180 + i * 280} cy={430} r={78} rev={i % 2 === 0} slow={i === 2} />
        </g>
      ))}
    </Svg>
  );
}

/** A delivery scooter with bags on the footboard. For "Deliver". */
export function ScooterArt(p: Props) {
  return (
    <Svg {...p} viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill={C.surface} />
      <rect x="0" y="600" width="1200" height="200" fill={C.water2} />
      <circle cx="380" cy="590" r="80" fill={C.ink} />
      <circle cx="380" cy="590" r="34" fill={C.steel} />
      <circle cx="840" cy="590" r="80" fill={C.ink} />
      <circle cx="840" cy="590" r="34" fill={C.steel} />
      <path d="M 300 560 q 0 -140 140 -150 h 230 l 60 -170 h 70 l -40 120 q 120 60 120 200 z" fill={C.water3} />
      <rect x="720" y="210" width="130" height="24" fill={C.ink} />
      <path d="M 360 400 h 200 q 20 0 20 20 v 20 h -240 v -20 q 0 -20 20 -20 z" fill={C.ink} />
      {/* bags on the footboard */}
      <path d="M 560 470 q -10 -100 50 -110 q 60 10 50 110 z" fill={C.water} />
      <path d="M 620 470 q -10 -120 60 -130 q 70 10 60 130 z" fill={C.paper} />
      <path d="M 590 358 q 20 -30 40 0 z" fill={C.water3} />
      <path d="M 660 338 q 20 -30 40 0 z" fill={C.water3} />
    </Svg>
  );
}
