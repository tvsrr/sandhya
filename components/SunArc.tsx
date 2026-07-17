"use client";

// The daily Sun Arc: the sun's path from horizon to zenith, in three segments.
// Close all three and the sun clears the arc — and the 75-day sky rises one degree.

const R = 130;
const CX = 150;
const CY = 150;

function polar(t: number) {
  // t in [0,1] -> angle 180deg (left horizon) to 0deg (right horizon), over the top
  const theta = (Math.PI * (1 - t));
  return {
    x: CX + R * Math.cos(theta),
    y: CY - R * Math.sin(theta),
  };
}

function arcPath(t0: number, t1: number) {
  const p0 = polar(t0);
  const p1 = polar(t1);
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${R} ${R} 0 0 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}

interface SegDef {
  key: string;
  label: string;
  sub: string;
  t0: number;
  t1: number;
  done: boolean;
}

export default function SunArc({
  dayIndex,
  deha,
  karma,
  chitta,
}: {
  dayIndex: number;
  deha: boolean;
  karma: boolean;
  chitta: boolean;
}) {
  const segs: SegDef[] = [
    { key: "deha", label: "DEHA", sub: "body", t0: 0.02, t1: 0.34, done: deha },
    { key: "karma", label: "KARMA", sub: "craft", t0: 0.35, t1: 0.66, done: karma },
    { key: "chitta", label: "CHITTA", sub: "mind", t0: 0.67, t1: 0.98, done: chitta },
  ];

  const closed = (deha ? 1 : 0) + (karma ? 1 : 0) + (chitta ? 1 : 0);
  // Never 0: even before DEHA closes, the sun sits a sliver above the horizon.
  const sunT = Math.max(0.05, closed / 3);
  const sun = polar(sunT);
  const allClosed = closed === 3;

  return (
    <div className="relative w-full max-w-[340px] mx-auto">
      <svg viewBox="0 0 300 170" className="w-full">
        <defs>
          <linearGradient id="arcGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffd27a" />
            <stop offset="100%" stopColor="#ff8c42" />
          </linearGradient>
          <filter id="sunBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* faint full track */}
        <path d={arcPath(0.02, 0.98)} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="10" strokeLinecap="round" />

        {/* segments */}
        {segs.map((s) => (
          <path
            key={s.key}
            d={arcPath(s.t0, s.t1)}
            fill="none"
            stroke={s.done ? "url(#arcGold)" : "rgba(255,255,255,0.22)"}
            strokeWidth="11"
            strokeLinecap="round"
            style={{
              transition: "stroke 0.6s ease",
              filter: s.done ? "drop-shadow(0 0 6px rgba(255,150,70,0.7))" : "none",
            }}
          />
        ))}

        {/* the sun marker */}
        <circle cx={sun.x} cy={sun.y} r="14" fill="#fff6da" filter="url(#sunBlur)" opacity="0.9" />
        <circle cx={sun.x} cy={sun.y} r="7.5" fill="#fff" />
      </svg>

      {/* center readout — names live on the doors below, so the arc stays clean */}
      <div className="absolute inset-x-0 bottom-2 flex flex-col items-center pointer-events-none">
        <div className="text-[10px] tracking-[0.35em] uppercase text-white/50">Day</div>
        <div className="text-6xl font-serif leading-none text-white ink-shadow">{dayIndex || "—"}</div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/45 mt-1">
          {allClosed ? "risen" : "of 75"}
        </div>
      </div>
    </div>
  );
}
